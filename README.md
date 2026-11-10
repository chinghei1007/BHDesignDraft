# School Design Playground

A browser-based playground for comparing school dashboard designs, adjusting their visual styles, and exporting an `App.css` template. Open `index.html` directly in a modern browser; no installation is required. Open `tutorial.html` for an interactive guide.

## Features

- Compare 14 named dashboard designs and switch between preset palettes or customize a design's colors.
- Edit the typography scale and configure heading and text roles: font family, size, line height, padding, margin, and colors. Set spacing for all sides, horizontal or vertical pairs, or individual sides.
- Adjust container spacing, border radius, and drop shadows. Configure buttons and navigation globally or per item, including an option to show or hide sidebar icons.
- Preview unordered and ordered lists independently of navigation, with controls for markers, size, weight, padding, radius, and colors.
- Enable a sample table and adjust its typography, cell spacing, borders, radius, and colors.
- Customize a simple copyright footer or show an expanded example. The footer sits outside the main content container.
- Disable the color scheme to focus on typography and layout. A miniature live preview appears above the settings when the main frame leaves the viewport; activate it to return to the full preview.
- Save settings in the current browser, separately for each design. Reset controls restore their corresponding defaults.

## Design and layout audit

The playground currently offers **14 named designs**, not 14 independent layouts. Each preview uses the same basic dashboard content and can use the same palette controls. A layout describes the placement and order of navigation and content; a design can also differ through typography, colors, sample role, and component styling. Palette choices and parent/teacher/student copy are not layouts.

A useful target model is **three navigation arrangements** (sidebar, compact rail, horizontal bar), combined with **four content arrangements** (two-column, stacked, reordered focus, and resource-first), plus reusable palette, typography, card, row, and link styles. These are proposed building blocks, not a claim that the current editor already offers all combinations. Some responsive rules collapse columns on small screens. The table below reviews every existing option; the recommendations do not remove or merge the current previews or saved settings.

| Current design | What actually differs | Recommendation |
| --- | --- | --- |
| Academic Editorial | Standard sidebar and two-column dashboard, with serif type and sharper cards; parent copy. | Keep as an editorial typography/card preset on the standard layout. |
| Learning Studio | Standard sidebar and two-column dashboard; teacher copy and indigo palette. | Palette and role-content preset, not a separate layout. |
| Modern School Commons | Standard sidebar and two-column dashboard; student copy and navy/teal palette. | Palette and role-content preset on the standard layout. |
| Soft School Commons | Same dashboard and student content as Modern School Commons, with a lighter palette and navigation treatment. | Merge into the standard layout as a palette/navigation style. |
| Horizontal navigation | Moves navigation to a horizontal bar; otherwise uses the standard dashboard. | Keep as a navigation option, composable with content arrangements. |
| Compact icon rail | Narrows the sidebar into an icon rail, with a responsive fallback. | Keep as a navigation option; check labels and accessibility when refining it. |
| Split workspace | Two columns with a 1.6:1 ratio and a highlighted first panel. | Use a column-ratio and panel-style option on the two-column layout. |
| Focus first | Stacks panels and reverses their order so the second panel comes first. | Keep as a stacked/reordered content arrangement. |
| Card grid | Uses two columns with tinted, shadowed panels; the base already has two columns. | Card surface and shadow preset, not a separate layout. |
| Daily agenda | Stacks panels in their original order and gives rows more vertical spacing. | Stacked content arrangement plus an agenda row-density preset. |
| Classroom board | Uses two columns and turns rows into separate rounded white blocks. | Board-style row/card preset on the two-column layout; the markup is not a distinct kanban board. |
| School magazine | Horizontal navigation with editorial typography and divider-like panels. | Horizontal navigation plus an editorial typography/panel preset. |
| Resource hub | Styles links as a three-column tile grid and assigns them an order value; otherwise uses two columns. | A link-tile component preset; a true resource-first layout would also need an explicit content-order implementation and verification. |
| Learning timeline | Uses a 2:1 column ratio and left-accented rows. | Column-ratio option plus a timeline row style; it is not a separate timeline data structure. |

The current controls already provide some customization, including colors, button and navigation styling, list styling, spacing, and shadows. They do **not** yet expose every recommended card, row, ratio, or navigation arrangement as an independent setting. A future consolidation should add those options first, migrate existing saved presets carefully, and then decide whether to retire duplicate names.

## Exporting App.css

The export is intended to turn the chosen design and its settings into a reusable starting point for an application stylesheet. Its structure is inspired by the Tailwind v4 `App.css` in `cpcyd-school`: it includes a Tailwind import, root variables, theme tokens, shared styles, and rules for the selected preview. It is not a replacement for the target application's existing stylesheet or layout-specific imports.

1. Select a layout and adjust the settings.
2. Select **Disable color scheme** if the exported stylesheet should omit color-related declarations.
3. Click **Download App.css**.
4. In a Tailwind CSS v4 project, review the generated tokens and rules, then merge the relevant parts into the application's stylesheet. Preserve any existing imports and project-specific rules.
5. Adapt selectors and markup to the target application. Preview-specific rules expect the exported layout's `.ui` structure and classes; individual overrides can target specific elements in that structure.
6. Build the application and test the result across screen sizes, keyboard interaction, and accessibility states.

The download contains CSS, not the preview's HTML or application behavior. Fonts named in settings must be available in the target application. Settings stored in one browser are not automatically shared with another.

## Files

- `index.html` — playground shell and ordered asset references.
- `assets/templates/` — one static preview component per named design, inserted synchronously as the page loads so direct `file://` use still works.
- `assets/controllers/` — gallery, editors, preview, persistence, and export controllers. Their order in `index.html` matters: later controllers depend on earlier setup. Controllers with reusable operations return a named object at the end of their closure; internal helpers and stored state remain private.
- `assets/styles/` — styles grouped by playground feature and component; the order of the stylesheet links preserves the CSS cascade.
- `school-design-directions.html` — gallery of the design directions.
- `tutorial.html` — interactive usage guide.
- `SRS.md` — software requirements and verification expectations.
