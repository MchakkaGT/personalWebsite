# Five full-site portfolio experiments

All five concepts use the same factual content, seven roles, five projects, 37 technology logos, resume and links. Original remains available as a reference. No final direction has been selected.

## Compare the concepts

Use the persistent Design Lab selector, including while a role is expanded. The switcher keeps the nearby role or section in view and preserves disclosures and diagram selections.

| Concept | Full-site treatment | Preview |
| --- | --- | --- |
| Exploded Engine | Paired subsystems on a mechanical spine, separated detail layers, parts trays, layered project diagrams, portrait shutters and assembling progress device | [Open](https://manish-chakka.vercel.app/?concept=exploded-engine) |
| Turbocharger / Flow | Alternating curved stations, directional expansion, flowing connections, rounded category headers and circular progress | [Open](https://manish-chakka.vercel.app/?concept=turbocharger) |
| Abstract Mechanical Assembly | Rail and joint experience linkage, hinged details, linked circular nodes, interchangeable skill modules and an opening profile frame | [Open](https://manish-chakka.vercel.app/?concept=abstract-assembly) |
| Kinetic CAD / Blueprint | Wireframe hero, numbered sheets, leader-line role callouts, full-width project drawings, component legends and construction-grid portrait | [Open](https://manish-chakka.vercel.app/?concept=cad) |
| Telemetry / Test Lab | Signal hero, inspection records, instrument-framed diagrams, selected-node tracing, tools bench and quiet profile scan | [Open](https://manish-chakka.vercel.app/?concept=telemetry) |

## Completed

- [x] Five distinct concepts extending through Experience, Projects, Skills and About.
- [x] Shared content and persistent selector with shareable links.
- [x] Atlassian completed internship, Seattle, May 2026 to August 2026.
- [x] Filtering, Data Retrieval, Re-ranking, Fatigue, Hydration in exact order.
- [x] Selectable pipeline stages and finite, user-triggered trace playback.
- [x] Opscribe interactive UI, API, graph, retrieval, storage and AI-agent map.
- [x] Opscribe demo linked to the supplied Replit URL.
- [x] Project-specific map, route, illustrative chart and hardware diagrams.
- [x] Conceptual visuals labeled; no fabricated performance metrics.
- [x] All technology logos and expanded experience/project content preserved.
- [x] No em dashes in HTML, JavaScript or CSS.
- [x] Correct GitHub profile retained.
- [x] Mobile layouts, keyboard controls, focus states and reduced-motion support.
- [x] Lightweight CSS/SVG/JavaScript with visible-only animated diagrams.

## Validation

Checked all five concepts at 1440px desktop and 390px mobile widths: no horizontal page overflow, five project diagrams, 37 technology items and no broken loaded images. Inspected themed sections with the hero offscreen. Verified keyboard diagram selection, role disclosure, concept switching with open details, mobile navigation and the Reduce motion control. Browser console checks reported no errors. Native prefers-reduced-motion uses equivalent CSS overrides and disables the JavaScript scroll/trace motion; system preference itself was not changed during QA.

All JavaScript passes `node --check`; `git diff --check` passes. The production packaging command validates 60 local asset/link targets and copies the static website to a clean output folder:

```sh
python3 scripts/build.py --out /tmp/personalwebsite-production
```

Use a new output directory for each build. Vercel can serve the source directly because this site has no compilation dependencies.

Resume returned HTTP 200 with application/pdf. Opscribe, CommuRide and the GitHub profile returned HTTP 200. Taste of Atlanta timed out during the destination check; its existing URL is retained. HTTP checks establish destination reachability, not end-to-end functionality of those separate apps.


## Sketch Drive experiment

[Preview Sketch Drive](https://manish-chakka.vercel.app/?concept=sketch-drive).

- [x] Added as a separate experiment; existing concepts and default preserved.
- [x] Assembly typography and pastel foundation with an original, unbranded SVG car sketch.
- [x] Thin unfilled contours, construction lines, selective pastel washes and finite sketch-in animation.
- [x] Side-profile, wheel/suspension, gearbox and interior fragments through Experience, Projects, Skills and About; small footer silhouette.
- [x] Normal professional section and role labels; no numbered mechanical role labels in this concept.
- [x] Project identities first. Opscribe has a clean custom project graphic; existing images restored for other projects using contain sizing.
- [x] Architecture diagrams move into expandable project details only in Sketch Drive.
- [x] All 37 technology logos, content depth, links and correct Atlassian pipeline preserved.
- [x] No extra motion-mode or mystery hero control in Sketch Drive. Finite line animations, scroll response and hover motion remain enabled under normal system settings.
- [x] Desktop and 390px mobile inspected, project image loading checked, graph keyboard interaction checked, no horizontal overflow or browser console errors.
- [x] JavaScript syntax and static production packaging pass.

Existing Kinetic CAD control is explicitly labeled Hide construction / Show construction and controls the construction-line layer.

## Scroll-driven Sketch Drive journey

Sketch Drive now has one continuously reprojected line-art car scene instead of repeated static illustrations. A small Canvas 2D perspective renderer controls camera yaw, elevation, scale, hinged driver door, hood and interior visibility from actual document scroll position. There is no WebGL dependency, autoplay loop, or scroll interception. Drawing occurs on requested animation frames after scroll/layout changes, with pixel density capped at 2.

The six scenes move from a frontal hero to an open-door Experience view, an interior/dashboard Projects view, an open-hood Skills view, and wider About and rear-quarter Contact views. Five transition intervals provide room for camera movement. The scene occupies a separate desktop margin beside content, expands during transitions, and simplifies on mobile. Normal section links still work.

The rectangular Assembly job-card treatment and left date/rail layout are restored in Sketch Drive, without mechanical role labels. All seven existing selector options remain. Project identities still precede expandable diagrams, and all 37 technology logos remain.

Validation: static production packaging and JavaScript syntax pass; desktop and 390px mobile checked for horizontal overflow; scroll state inspected for door and hood progression; existing concept switching, project disclosure and console checked. This is an illustrative car model, not a mechanical simulation.
