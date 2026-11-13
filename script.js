(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const whenVisible = (target, onChange) => {
    if (!('IntersectionObserver' in window)) return onChange(true);
    new IntersectionObserver(entries => onChange(entries[0].isIntersecting), { rootMargin: '100px' }).observe(target);
  };

  function initDfs() {
    const HEARTBEAT = 5, TIMEOUT = 6, SWEEP = 2, REPLICAS = 3, MAX_LOG = 5;
    const nodesEl = $('#dfs-nodes'), logEl = $('#dfs-log');
    if (!nodesEl) return;
    const seed = [
      { name: 'orion01', space: 412, requests: 3, chunks: ['c1', 'c2'], offset: 0.4 },
      { name: 'orion02', space: 388, requests: 2, chunks: ['c1', 'c3', 'c4'], offset: 1.6 },
      { name: 'orion03', space: 455, requests: 4, chunks: ['c2', 'c3'], offset: 2.7 },
      { name: 'orion04', space: 301, requests: 1, chunks: ['c1', 'c4'], offset: 3.5 },
      { name: 'orion05', space: 476, requests: 2, chunks: ['c2', 'c3', 'c4'], offset: 4.4 },
    ];
    let nodes, clock, lastSweep, timer = null, visible = false;

    const score = n => n.space / (n.requests + 1);
    const live = () => nodes.filter(n => n.registered);

    function log(message, alert) {
      const item = el('li', alert ? 'is-alert' : '');
      item.append(el('time', '', `${clock.toFixed(0).padStart(2, '0')}s`), message);
      logEl.append(item);
      while (logEl.children.length > MAX_LOG) logEl.firstChild.remove();
    }

    function reset() {
      nodes = seed.map(n => ({ ...n, chunks: [...n.chunks], fresh: [], running: true, registered: true, lastBeat: 0 }));
      clock = 0; lastSweep = 0;
      logEl.replaceChildren();
      log('5 nodes registered. Every chunk is on 3 of them.');
      build();
    }

    function build() {
      nodesEl.replaceChildren(...nodes.map(n => {
        const button = el('button', 'node');
        button.type = 'button';
        button.append(
          Object.assign(el('span', 'node-name'), { innerHTML: '<i class="node-pulse"></i>' }),
          el('span', 'node-meta node-beat'),
          el('span', 'node-meta node-score'),
          el('span', 'node-chunks'),
          el('span', 'node-action'),
        );
        button.firstChild.append(n.name);
        button.addEventListener('click', () => stop(n));
        n.el = button;
        return button;
      }));
      paint();
    }

    function paint() {
      const canStop = live().length > REPLICAS;
      for (const n of nodes) {
        const silent = !n.running && n.registered;
        n.el.classList.toggle('is-silent', silent);
        n.el.classList.toggle('is-down', !n.registered);
        n.el.disabled = !n.running || !canStop;
        const since = (clock - n.lastBeat).toFixed(1);
        $('.node-beat', n.el).textContent = n.registered ? `last beat ${since}s ago` : 'deregistered';
        $('.node-score', n.el).innerHTML = `${n.space} GB free · ${n.requests} req<br>score <b>${score(n).toFixed(0)}</b>`;
        $('.node-chunks', n.el).replaceChildren(...n.chunks.map(c => el('span', n.fresh.includes(c) ? 'chunk is-new' : 'chunk', c)));
        $('.node-action', n.el).textContent = !n.registered ? 'down' : silent ? 'silent, not yet noticed' : canStop ? 'click to stop' : 'needed for 3 copies';
        n.el.setAttribute('aria-label', `${n.name}, ${!n.registered ? 'down' : silent ? 'stopped, controller has not noticed yet' : 'running'}, holds ${n.chunks.join(', ') || 'no chunks'}${n.running && canStop ? '. Activate to stop this node.' : ''}`);
      }
    }

    function stop(node) {
      if (!node.running || live().length <= REPLICAS) return;
      node.running = false;
      log(`${node.name} stopped. The controller doesn't know yet.`);
      paint();
    }

    function deregister(dead) {
      dead.registered = false;
      log(`${dead.name} silent for more than ${TIMEOUT}s. Deregistered.`, true);
      for (const chunk of dead.chunks) {
        const source = live().find(n => n.chunks.includes(chunk));
        const target = live().filter(n => !n.chunks.includes(chunk)).sort((a, b) => score(b) - score(a))[0];
        if (!source || !target) continue;
        target.chunks.push(chunk);
        target.fresh.push(chunk);
        target.requests += 1;
        log(`${chunk}: ${source.name} copies to ${target.name} (best score).`);
      }
    }

    function tick() {
      clock += 0.25;
      for (const n of nodes) {
        if (!n.running) continue;
        const phase = (clock - n.offset) % HEARTBEAT;
        if (phase >= 0 && phase < 0.25) {
          n.lastBeat = clock;
          n.el.classList.remove('is-beating');
          void n.el.offsetWidth;
          n.el.classList.add('is-beating');
        }
      }
      if (clock - lastSweep >= SWEEP) {
        lastSweep = clock;
        nodes.filter(n => n.registered && clock - n.lastBeat > TIMEOUT).forEach(deregister);
      }
      paint();
    }

    function sync() {
      const shouldRun = visible && !document.hidden;
      if (shouldRun && !timer) timer = setInterval(tick, 250);
      if (!shouldRun && timer) { clearInterval(timer); timer = null; }
    }

    $('#dfs-reset').addEventListener('click', reset);
    document.addEventListener('visibilitychange', sync);
    whenVisible(nodesEl, v => { visible = v; sync(); });
    reset();
  }

  function initDoodle() {
    const local = $('#pad-local'), remote = $('#pad-remote');
    if (!local) return;
    const status = $('#doodle-status'), slow = $('#doodle-slow');
    const wire = { buffer: $('#wire-buffer'), update: $('#wire-update'), queue: $('#wire-queue'), wait: $('#wire-wait') };
    const INK = '#5b34b5';
    const pads = [local, remote].map(canvas => ({ canvas, ctx: canvas.getContext('2d'), strokes: [] }));
    let buffer = [], queue = [], debounce = null, drawing = false, generation = 0;
    const scale = () => (slow.checked ? 10 : 1);

    function fit(pad) {
      const rect = pad.canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      pad.canvas.width = Math.max(1, Math.round(rect.width * ratio));
      pad.canvas.height = Math.max(1, Math.round(rect.height * ratio));
      pad.ctx.lineWidth = 3 * ratio;
      pad.ctx.lineCap = pad.ctx.lineJoin = 'round';
      pad.ctx.strokeStyle = INK;
      pad.strokes.forEach(stroke => stroke.forEach((p, i) => i && segment(pad, stroke[i - 1], p)));
    }
    function segment(pad, a, b) {
      const { width, height } = pad.canvas;
      pad.ctx.beginPath();
      pad.ctx.moveTo(a.x * width, a.y * height);
      pad.ctx.lineTo(b.x * width, b.y * height);
      pad.ctx.stroke();
    }
    function flash(step) {
      const item = $(`[data-step="${step}"]`, $('#wire'));
      item.classList.add('is-active');
      setTimeout(() => item.classList.remove('is-active'), 260 * Math.min(scale(), 4));
    }
    function showCounts() {
      wire.buffer.textContent = `${buffer.length} pts`;
      wire.queue.textContent = `${queue.length} batch${queue.length === 1 ? '' : 'es'}`;
    }

    function addPoint(point, startsStroke) {
      const strokes = pads[0].strokes;
      if (startsStroke || !strokes.length) strokes.push([]);
      const stroke = strokes[strokes.length - 1];
      if (stroke.length) segment(pads[0], stroke[stroke.length - 1], point);
      stroke.push(point);
      buffer.push({ ...point, start: startsStroke });
      flash('buffer');
      showCounts();
      clearTimeout(debounce);
      debounce = setTimeout(sendUpdate, 100 * scale());
    }

    function sendUpdate() {
      if (!buffer.length) return;
      wire.update.textContent = `${buffer.length} pts sent`;
      queue.push(buffer);
      buffer = [];
      flash('update'); flash('queue');
      showCounts();
    }

    function serverFlush() {
      if (queue.length) {
        const batches = queue;
        queue = [];
        const total = batches.reduce((sum, batch) => sum + batch.length, 0);
        wire.wait.textContent = `answered, ${total} pts`;
        flash('wait');
        showCounts();
        status.textContent = `The other browser received ${total} points and is replaying them.`;
        replay(batches.flat());
        setTimeout(() => { wire.wait.textContent = 'held open'; }, 100 * scale());
      }
      setTimeout(serverFlush, 100 * scale());
    }

    function replay(points) {
      const run = generation;
      const delay = reducedMotion.matches ? 0 : 50;
      points.forEach((point, i) => setTimeout(() => {
        if (run !== generation) return;
        const strokes = pads[1].strokes;
        if (point.start || !strokes.length) strokes.push([]);
        const stroke = strokes[strokes.length - 1];
        if (stroke.length) segment(pads[1], stroke[stroke.length - 1], point);
        stroke.push(point);
      }, i * delay));
    }

    function position(event) {
      const rect = local.getBoundingClientRect();
      return {
        x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      };
    }
    local.addEventListener('pointerdown', event => {
      if (event.button) return;
      local.setPointerCapture(event.pointerId);
      drawing = true;
      addPoint(position(event), true);
    });
    local.addEventListener('pointermove', event => { if (drawing) addPoint(position(event), false); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => local.addEventListener(type, () => { drawing = false; }));

    let sample = 0;
    $('#doodle-sample').addEventListener('click', () => {
      const row = 0.25 + (sample++ % 3) * 0.25;
      const points = Array.from({ length: 26 }, (_, i) => ({ x: 0.12 + i * 0.03, y: row + Math.sin(i / 2.2 + sample) * 0.09 }));
      points.forEach((point, i) => setTimeout(() => addPoint(point, i === 0), reducedMotion.matches ? 0 : i * 22));
      status.textContent = 'Sample stroke drawn on your canvas.';
    });
    $('#doodle-clear').addEventListener('click', () => {
      generation += 1;
      buffer = []; queue = [];
      clearTimeout(debounce);
      pads.forEach(pad => { pad.strokes = []; pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height); });
      wire.update.textContent = 'idle';
      showCounts();
      status.textContent = 'Cleared. In the real app this is a POST /clear for the whole room.';
    });
    slow.addEventListener('change', () => {
      status.textContent = slow.checked ? 'Batching and flushing now take 1 second each, so you can watch the steps.' : 'Back to the real 100 ms timings.';
    });

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => pads.forEach(fit), 120); });
    pads.forEach(fit);
    serverFlush();
  }

  function initTasks() {
    const list = $('#tasks-list');
    if (!list) return;
    const form = $('#tasks-form'), input = $('#tasks-input'), hint = $('#tasks-hint'), allButton = $('#tasks-all');
    const tabs = $$('.browser-tabs button');
    const db = {
      'github.com': [{ val: 'Review PR #42', done: false }, { val: 'Update unit tests', done: false }, { val: 'Merge feature branch', done: false }],
      'figma.com': [{ val: 'Create wireframes', done: true }, { val: 'Design components', done: false }, { val: 'Export assets', done: false }],
      'youtube.com': [],
    };
    let domain = 'github.com', viewAll = false;

    function row(task, site) {
      const item = el('div', 'task');
      const label = el('label');
      const box = el('input');
      box.type = 'checkbox';
      box.checked = task.done;
      box.addEventListener('change', () => { task.done = box.checked; });
      label.append(box, el('span', '', task.val));
      const remove = el('button', '', '×');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Delete ${task.val}`);
      remove.addEventListener('click', () => {
        db[site] = db[site].filter(t => t !== task);
        render();
        (viewAll ? allButton : input).focus();
      });
      item.append(label, remove);
      return item;
    }

    function render() {
      hint.textContent = viewAll ? 'All sites' : 'Tasks for this site only';
      form.hidden = viewAll;
      allButton.setAttribute('aria-pressed', String(viewAll));
      const sites = viewAll ? Object.keys(db).filter(site => db[site].length) : [domain];
      const nodes = [];
      for (const site of sites) {
        if (viewAll) nodes.push(el('div', 'domain-label', site));
        nodes.push(...db[site].map(task => row(task, site)));
      }
      if (!nodes.length) nodes.push(el('div', 'tasks-empty', viewAll ? 'No tasks anywhere yet' : `Nothing for ${domain} yet. Add one above.`));
      list.replaceChildren(...nodes);
    }

    tabs.forEach(tab => tab.addEventListener('click', () => {
      domain = tab.dataset.site;
      viewAll = false;
      tabs.forEach(t => t.setAttribute('aria-pressed', String(t === tab)));
      render();
    }));
    allButton.addEventListener('click', () => { viewAll = !viewAll; render(); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      db[domain].push({ val, done: false });
      input.value = '';
      render();
    });
    render();
  }

  function initTouchBar() {
    const canvas = $('#xp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const play = $('#xp-play');
    const BARS = 80;
    const themes = {
      classic: ['#c2410c', '#f59e0b', '#fde047', '#a3e635'],
      ocean: ['#2563eb', '#22d3ee'],
      sunset: ['#ef4444', '#fb923c', '#fde047'],
      ice: ['#3b82f6', '#67e8f9', '#ffffff'],
    };
    let mode = 'bars', theme = 'classic', playing = false, visible = false, frame = null, time = 3.1;
    const levels = new Float32Array(BARS);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      draw();
    }
    function sampleSignal() {
      for (let i = 0; i < BARS; i++) {
        const x = i / BARS;
        const bass = Math.exp(-x * 5) * (0.55 + 0.45 * Math.sin(time * 5.2));
        const mid = 0.38 * Math.exp(-((x - 0.42) ** 2) * 28) * (0.6 + 0.4 * Math.sin(time * 3.1 + 1));
        const ripple = 0.16 * (0.5 + 0.5 * Math.sin(i * 0.9 + time * 7)) * (1 - x * 0.7);
        const target = Math.min(1, Math.max(0.04, bass + mid + ripple));
        levels[i] += (target - levels[i]) * 0.35;
      }
    }
    function draw() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      themes[theme].forEach((color, i, all) => gradient.addColorStop(i / (all.length - 1), color));
      ctx.fillStyle = ctx.strokeStyle = gradient;
      const step = width / BARS;
      if (mode === 'bars' || mode === 'mirror') {
        for (let i = 0; i < BARS; i++) {
          const h = Math.max(2, levels[i] * height * (mode === 'mirror' ? 0.5 : 1));
          const y = mode === 'mirror' ? height / 2 - h : height - h;
          ctx.fillRect(i * step + step * 0.15, y, step * 0.7, mode === 'mirror' ? h * 2 : h);
        }
      } else if (mode === 'line') {
        ctx.lineWidth = Math.max(1, height / 22);
        ctx.shadowColor = themes[theme][themes[theme].length - 1];
        ctx.shadowBlur = height / 4;
        ctx.beginPath();
        for (let i = 0; i < BARS; i++) {
          const y = height / 2 + Math.sin(i * 0.55 + time * 9) * levels[i] * height * 0.42;
          i ? ctx.lineTo(i * step + step / 2, y) : ctx.moveTo(step / 2, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.lineWidth = Math.max(1, height / 30);
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        for (let i = 0; i < BARS; i += 2) {
          const y = height - 4 - levels[i] * (height - 8);
          i ? ctx.lineTo(i * step + step / 2, y) : ctx.moveTo(step / 2, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        for (let i = 0; i < BARS; i += 2) {
          ctx.beginPath();
          ctx.arc(i * step + step / 2, height - 4 - levels[i] * (height - 8), Math.max(1.5, height / 14), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    function loop() {
      time += 1 / 60;
      sampleSignal();
      draw();
      frame = requestAnimationFrame(loop);
    }
    function sync() {
      const shouldRun = playing && visible && !document.hidden && !reducedMotion.matches;
      if (shouldRun && !frame) frame = requestAnimationFrame(loop);
      if (!shouldRun && frame) { cancelAnimationFrame(frame); frame = null; }
    }
    function still() {
      time += 0.7;
      for (let i = 0; i < 12; i++) sampleSignal();
      draw();
    }
    function setPlaying(on) {
      playing = on && !reducedMotion.matches;
      play.setAttribute('aria-pressed', String(playing));
      play.disabled = reducedMotion.matches;
      play.textContent = reducedMotion.matches ? 'Still frame (reduced motion)' : playing ? 'Pause' : 'Play';
      sync();
    }
    function group(id, key, apply) {
      const buttons = $$(`#${id} button`);
      buttons.forEach(button => button.addEventListener('click', () => {
        buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        apply(button.dataset[key]);
        if (!frame) still();
      }));
    }

    play.addEventListener('click', () => setPlaying(!playing));
    group('xp-modes', 'mode', value => { mode = value; });
    group('xp-themes', 'theme', value => { theme = value; });
    reducedMotion.addEventListener('change', () => setPlaying(false));
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', resize);
    whenVisible(canvas, v => { visible = v; sync(); });
    for (let i = 0; i < 30; i++) sampleSignal();
    resize();
    setPlaying(false);
  }

  function initCopyEmail() {
    const button = $('#copy-email');
    if (!button || !navigator.clipboard) { if (button) button.hidden = true; return; }
    const status = $('#copy-status');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.email);
        button.textContent = 'Copied ✓';
        status.textContent = 'Email address copied.';
      } catch {
        button.textContent = 'Couldn’t copy';
      }
      setTimeout(() => { button.textContent = 'Copy address'; status.textContent = ''; }, 1800);
    });
  }

  initDfs();
  initDoodle();
  initTasks();
  initTouchBar();
  initCopyEmail();
})();
