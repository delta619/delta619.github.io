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

Project descriptions and links come from the existing portfolio, the delta619/XPtouchbar README, and the linked Daily Excelsior feature dated July 13, 2020. The existing portrait and Toptal résumé URL are reused. The page adds no achievement metrics.

The DFS visualization, drawing canvas, task checklist, and Touch Bar spectrum are illustrative browser-local interactions, not embedded live project backends. The visualizer uses no audio input. Drawing and checklist state reset on reload. Reduced-motion preferences suppress animation; drawing also has keyboard-operable add/clear controls.

## Checks

- `node --check script.js`
- `git diff --check`
- Serve and inspect desktop/mobile layouts, check for horizontal overflow, and exercise project interactions.
