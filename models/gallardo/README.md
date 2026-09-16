# Gallardo line-art asset

Gallardo mesh by **machman_3d**, originally credited in the three.js car example:
https://github.com/timoxley/threejs/blob/master/examples/webgl_materials_cubemap_dynamic.html

Source body and wheel geometry:
https://github.com/timoxley/threejs/tree/master/examples/obj/gallardo/parts

The source collection is distributed under the MIT license, reproduced in LICENSE.txt. The original artist URL is no longer an artist page. Attribution is retained here and in the renderer source.

Adaptation: converted the legacy binary geometry to indexed Float32 positions and Uint32 triangles; split connected panels for hinged animation; render paper surfaces, silhouettes, and crease lines. The rear engine cover serves as the Projects reveal. On a real Gallardo, the luggage compartment is at the front.

Three.js r160 is vendored locally under js/vendor, with its MIT license. Only Sketch Drive loads the renderer and model. No external model viewer or runtime CDN is required.
