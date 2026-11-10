# Software Requirements Specification

## Purpose and scope

The School Design Playground lets a designer compare dashboard concepts, customize visual styles, preview the result, and export a Tailwind v4 CSS starting point. It is a local, self-contained HTML application; it does not provide a backend, authentication, or deployment.

## Users and assumptions

Designers use the controls to explore a visual direction. Developers use the exported stylesheet as a starting point for integration into a Tailwind v4 application. The browser must support JavaScript, CSS custom properties, local storage, and modern browser APIs.

## Functional requirements

1. The application shall display 14 selectable layouts with previous/next navigation and palette presets.
2. Users shall be able to customize palette colors and text colors per design.
3. Users shall be able to adjust typography scales and individual text roles, including global and per-role font families, font sizes, line heights, padding, and margins. Spacing shall support all sides, horizontal and vertical pairs, and individual sides, with individual values taking precedence.
4. Users shall be able to select a container and adjust padding, margin, gap, border radius and drop shadow. Radius units include px, %, rem, and em.
5. Users shall be able to set button and navigation styles globally and override individual items. Settings include colors, size, weight, radius, and padding. Sidebar icons shall be independently toggleable.
6. The application shall offer unordered and ordered sample lists, independently styled from navigation, and a toggle for their visibility.
7. The application shall offer an optional sample table with a separate heading and column headers. Users shall be able to change cell padding, font size, borders, radius, and colors.
8. The footer shall appear outside the main content container and show a copyright line by default. An expanded sample shall be optional; its example GitHub icon shall not navigate.
9. Users shall be able to disable the color scheme. The preview shall be neutral, color controls hidden, and color declarations omitted from the CSS export while non-color settings remain.
10. When the full preview frame is outside the viewport, a scaled live preview shall appear above layout settings. Activating it shall return the user to the frame.
11. Settings shall persist in browser local storage where available. Reset controls shall restore the settings they identify. The interface shall report storage failures.
12. The application shall export an `App.css` file using Tailwind v4 conventions, containing the selected design's applicable settings and preview rules. The export shall not claim to replace the target application's existing imports or project-specific styles.

## Non-functional requirements

- The playground shall operate without a server and adapt to narrow screens.
- Controls shall have accessible labels, support keyboard interaction, and respect reduced-motion preferences for preview navigation.
- The export shall be validated by a Tailwind v4 build. Integration and full accessibility conformance require separate testing in the target application.
- Color customization and automated checks alone do not establish accessibility compliance.

## Acceptance checks

Select different designs and verify their saved settings remain separate; change each type of style and inspect the preview; reload and confirm persistence; test the color-disabled and expanded footer states; verify the miniature preview updates and returns to the frame; download CSS in both color modes and build it in a Tailwind v4 project. Verify the exported selectors against the target markup before integration.
