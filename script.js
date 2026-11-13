(() => {
  const failure = document.querySelector('#fail-node');
  failure.addEventListener('click', () => {
    const failed = failure.getAttribute('aria-pressed') !== 'true';
    failure.setAttribute('aria-pressed', String(failed));
    failure.textContent = failed ? 'Restore node ↺' : 'Simulate node failure ↗';
    document.querySelector('#node-b').classList.toggle('offline', failed);
    document.querySelector('#node-b small').textContent = failed ? 'offline' : 'online';
    document.querySelector('#replica').textContent = failed ? '▦ ▦ ▦' : '▦ ▦';
    document.querySelector('#dfs-status').textContent = failed ? 'Concept: a replica moves to node C.' : 'Replicas distributed across nodes.';
  });
  const canvas = document.querySelector('#doodle');
  let path = null;
  function point(event) {
    const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(canvas.getScreenCTM().inverse());
    return `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }
  function newPath(d) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    element.setAttribute('d', d); element.setAttribute('fill', 'none');
    element.setAttribute('stroke', '#2456eb'); element.setAttribute('stroke-width', '3');
    element.setAttribute('stroke-linecap', 'round'); canvas.append(element); return element;
  }
  canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); path = newPath(`M${point(e)}`); });
  canvas.addEventListener('pointermove', e => { if (path) path.setAttribute('d', `${path.getAttribute('d')} L${point(e)}`); });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => canvas.addEventListener(type, () => path = null));
  document.querySelector('#clear-doodle').addEventListener('click', () => {canvas.replaceChildren(); path = null;});
  let spark = 0;
  document.querySelector('#spark').addEventListener('click', () => {
    const x = 55 + (spark++ % 7) * 60, y = 75 + (spark % 2) * 85;
    newPath(`M${x-12} ${y}h24 M${x} ${y-12}v24 M${x-9} ${y-9}l18 18 M${x-9} ${y+9}l18 -18`);
  });
  const tasks = [...document.querySelectorAll('.task-window input')];
  tasks.forEach(task => task.addEventListener('change', () => {
    document.querySelector('#task-status').textContent = `${tasks.filter(t => t.checked).length} of 3 complete · illustrative tasks`;
  }));
  const bar = document.querySelector('#touchbar');
  for (let i = 0; i < 45; i++) {
    const b = document.createElement('i'); b.style.setProperty('--h', `${10 + Math.abs(Math.sin(i * .6)) * 32}px`);
    b.style.setProperty('--d', `${-i * .13}s`); bar.append(b);
  }
  const play = document.querySelector('#xp-play');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function setPlay(on) {
    bar.classList.toggle('playing', on && !reduced.matches);
    play.setAttribute('aria-pressed', String(on));
    play.textContent = on ? 'Pause visualizer Ⅱ' : 'Play visualizer ▷';
    if (reduced.matches) play.textContent = 'Static preview · reduced motion';
  }
  play.addEventListener('click', () => setPlay(play.getAttribute('aria-pressed') !== 'true'));
  reduced.addEventListener('change', () => setPlay(false));
  document.querySelector('#xp-theme').addEventListener('click', () => bar.classList.toggle('ocean'));
})();
