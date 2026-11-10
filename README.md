# School Design Playground

A browser-based playground for comparing 14 named school dashboard designs, adjusting their styles, and exporting a starting `App.css`.

## Development

Requires Node.js 20.19+ or 22.12+ (as required by Vite 7).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To check the production build locally:

```sh
npm run build
npm run preview
```

Run `npm test` for Vitest component tests and `npm run test:e2e` for Playwright browser tests. Install the browser once with `npx playwright install chromium`.

Vite outputs the static site to `dist/`. The site needs an HTTP server; opening `index.html` directly is no longer supported.

## Cloudflare Pages

For a Git-connected Pages project, set the build command to `npm run build` and the build output directory to `dist`. Commit the source, `package.json`, and `package-lock.json`; `dist` and `node_modules` are ignored. Cloudflare builds on deployment. For a manual deployment, build locally and upload the contents of `dist`.

## Architecture and migration status

- `src/main.jsx` mounts the React application; `src/components/Playground.jsx` renders the page. Gallery selection and editor settings use React state; per-design settings are saved under the existing local-storage keys.
- `src/components/previews/` contains the 14 layout previews as JSX components. `src/playground.html` contains the current editor shell, which has yet to be converted to JSX.
- `src/components/` contains React editors, layout previews, and the mini preview. `src/lib/css-export.js` generates the downloadable stylesheet from the active React settings and rendered browser styles. The legacy scripts in `assets/controllers/` are retained as historical reference and are not loaded by the playground.
- `assets/styles/` contains existing CSS, imported in cascade order by `src/styles/main.css`. Tailwind CSS v4 processes this file and supports `@apply` for shared utility-based rules. Existing custom styles remain CSS; Tailwind preflight is intentionally not enabled to avoid changing the previews.
- `public/` contains the existing template gallery and tutorial, copied unchanged into the build. These pages are not yet React components.
- `docs/` contains the requirements, observation notes, and [design audit](docs/design-audit.md).

Settings remain in the visitor's browser under the existing local-storage keys and are not shared between browsers. The CSS download is a starting point, not a complete application: review the output and adapt its selectors and markup to the target project. See the design audit for the detailed feature list, export guidance, and recommendations for consolidating similar layouts.
