# Portfolio design comparison

All three directions share the same HTML content, experience timeline, project details, links, and technology catalog. The original design remains the default until a direction is chosen.

## Preview links

- [Exploded Engine](https://manish-chakka.vercel.app/?concept=exploded-engine): midnight blueprint surfaces, an isometric engine assembly, squared component cards, and scroll-driven separation. Use **Assemble engine** to bring the layers together.
- [Turbocharger](https://manish-chakka.vercel.app/?concept=turbocharger): graphite surfaces, warm copper accents, italic display type, a sculpted compressor housing, and slow turbine rotation with a pause control.
- [Abstract Mechanical Assembly](https://manish-chakka.vercel.app/?concept=abstract-assembly): warm paper, sage and brass, offset modular cards, and an articulated linkage illustration.
- [Original](https://manish-chakka.vercel.app/?concept=original): the existing design for reference.

Use the Design Lab switcher at the top of any page. Switching preserves open details and keeps the current section in view. Each concept has a shareable URL; browser back and forward restore the selected direction.

## Completed brief

- [x] Three distinct, implemented visual directions with interactive SVG hero artwork.
- [x] Persistent concept switcher and direct preview links.
- [x] Shared portfolio content and links without three copies of the website.
- [x] Seven jobs retained in the animated timeline; Atlassian, Cox Automotive and Waystar remain first.
- [x] Atlassian shown as a past internship: Software Engineer Intern, Seattle, WA, May 2026 to August 2026.
- [x] Correct pipeline: Filtering, Data Retrieval, Re-ranking, Fatigue, Hydration.
- [x] Opscribe artwork fully visible, with its live demo link in every variant.
- [x] All 37 technology logos and names retained in five compact groups.
- [x] Expandable project and experience details retained.
- [x] No em dashes in site text or metadata.
- [x] Responsive layouts, keyboard controls, focus indicators, and reduced-motion styles.
- [x] Original GitHub profile correction retained.

## Implementation

The existing static HTML/CSS/JavaScript stack is unchanged. `concept-init.js` selects the URL theme before paint. `concepts.js` owns the three SVG illustrations, switcher history, and their interaction controls. `concepts.css` contains the theme tokens, component styling, responsive rules and reduced-motion overrides. No new external rendering dependency or build step is required.

## Verification

Checked JavaScript syntax, local asset and link targets, all three rendered themes, mobile overflow, the concept switcher, mobile navigation, expandable details, pipeline order, technology count, and image loading. Reduced-motion CSS stops automatic SVG animation and transitions; the JavaScript motion query disables scroll separation and removes the unnecessary turbine control when reduced motion is enabled.
