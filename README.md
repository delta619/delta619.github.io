# Ashutosh Malla — The Builder’s Lab

Portfolio on `react_app`. Static HTML, CSS, and vanilla JavaScript; no framework runtime or dependency installation is required.

## Local preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. The repository root is the ready-to-serve site; there is no compilation step. `projects.html` retains the original project archive with isolated `legacy.css` and `legacy.js` dependencies.

## GitHub Pages

Relative asset and page URLs support root or repository-subpath hosting. Keep `index.html`, `projects.html`, both stylesheet/script pairs, and `images/` together. No server-side routing or rewrites are needed. No publication has been performed as part of this redesign.

## Content and previews

Project stories are written from the repositories themselves (delta619/go-dfs, concurrency_drawing, concurrency_drawing_ui, chrome_extension_todays_tasks, XPtouchbar, pintnetwork_india_bk) and the Daily Excelsior feature dated July 13, 2020. The two code excerpts are copied from those repositories. `images/portrait.jpg` is a web-sized copy of `images/about.jpg`; `images/todays-tasks-github.jpg` is a store screenshot from the extension repository.

The four demos are browser-local simulations, labelled as such on the page, not live backends:

- Go DFS: heartbeats every 5 s, a 6 s timeout swept every 2 s, three replicas, and placement by `free space / (requests + 1)`, as in `controller.go`.
- Collaborative Doodle: the 100 ms client batch, server queue, held `/wait` response, and 50 ms-per-point replay. No network calls are made.
- Todays Tasks: a recreated popup with per-site lists. State resets on reload.
- XP Touch Bar: a generated signal drawn in four of the app's modes and palettes. No audio is captured.

Reduced-motion preferences stop the animations; the drawing demo has a keyboard-operable sample stroke, and DFS nodes are buttons.

## Checks

- `node --check script.js`
- `git diff --check`
- Serve and inspect desktop/mobile layouts, check for horizontal overflow, and exercise project interactions.
