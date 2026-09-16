/* Three mechanical studies, one shared portfolio. No external rendering library. */
(() => {
  'use strict';
  const bolt = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" class="bolt"/><path d="M${x-r/2} ${y}h${r}" class="bolt-slot"/>`;
  const svg = (body) => `<svg viewBox="0 0 540 500" aria-hidden="true" focusable="false">${body}</svg>`;

  // Concept 1: separate head, pistons, block and crankshaft on an isometric axis.
  const engine = () => svg(`
    <defs><linearGradient id="engine-metal" x2="1" y2="1"><stop stop-color="#8cc8dd"/><stop offset=".45" stop-color="#315975"/><stop offset="1" stop-color="#162d44"/></linearGradient></defs>
    <g class="drawing-guides"><path d="M70 435L450 210M80 185L458 405M110 65V447M427 65V447M50 250H490"/><ellipse cx="270" cy="420" rx="185" ry="40"/></g>
    <g class="engine-head engine-part">
      <path d="M128 122L285 45L418 113L260 195Z" fill="url(#engine-metal)"/>
      <path d="M128 122V144L260 218V195ZM260 195L418 113V136L260 218" class="metal-side"/>
      <path d="M157 121L284 61L389 114L263 179Z" class="metal-inset"/>
      ${[0,1,2,3,4].map(i=>`<path d="M${173+i*22} ${113-i*10}l91 49" class="cooling-fin"/>`).join('')}
      ${[[143,124],[284,56],[402,114],[260,199]].map(p=>bolt(...p)).join('')}
    </g>
    <g class="engine-pistons engine-part">
      ${[[215,223],[270,195],[325,167]].map(([x,y])=>`<g><path d="M${x-22} ${y}v32c0 19 44 19 44 0v-32" fill="url(#engine-metal)"/><ellipse cx="${x}" cy="${y}" rx="22" ry="12" class="metal-top"/><path d="M${x-21} ${y+11}q21 15 42 0M${x-21} ${y+18}q21 15 42 0" class="piston-ring"/><path d="M${x-5} ${y+45}v44h10v-44" class="connecting-rod"/><circle cx="${x}" cy="${y+93}" r="12" class="metal-top"/><circle cx="${x}" cy="${y+93}" r="5" class="metal-inset"/></g>`).join('')}
    </g>
    <g class="engine-block engine-part">
      <path d="M128 302L285 222L418 290L260 373Z" fill="url(#engine-metal)"/>
      <path d="M128 302V360L260 437V373ZM260 373L418 290V351L260 437" class="metal-side"/>
      ${[[215,326],[270,298],[325,270]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="29" ry="16" class="cylinder-hole"/><ellipse cx="${x}" cy="${y+2}" rx="21" ry="11" class="cylinder-inner"/>`).join('')}
      <path d="M140 332l107 61M140 345l107 61M275 394l129-68M275 407l129-68" class="cooling-fin"/>
      ${[[143,302],[285,234],[403,291],[261,363]].map(p=>bolt(...p)).join('')}
    </g>
    <g class="engine-crank engine-part"><path d="M165 400l36 20 27-14 31 17 28-15 31 17 42-23" class="crankshaft"/>${[[165,400],[228,406],[287,408],[360,402]].map(p=>bolt(...p,10)).join('')}</g>
    <g class="drawing-labels"><path d="M404 89H469V67M121 222H63M407 329H469"/><text x="392" y="57">CYLINDER HEAD</text><text x="25" y="213">PISTONS</text><text x="446" y="350">BLOCK</text><text x="52" y="474">EXPLODED VIEW / INLINE ASSEMBLY</text></g>
  `);

  // Concept 2: a volute housing wraps a radial compressor wheel and airflow paths.
  const turbo = () => svg(`
    <defs><radialGradient id="turbo-metal" cx=".35" cy=".3"><stop stop-color="#879292"/><stop offset=".4" stop-color="#384748"/><stop offset="1" stop-color="#172224"/></radialGradient><linearGradient id="turbo-blade" x2="1" y2="1"><stop stop-color="#dbedec"/><stop offset=".35" stop-color="#667a7a"/><stop offset="1" stop-color="#1b292b"/></linearGradient></defs>
    <g class="turbo-guides"><circle cx="270" cy="245" r="206"/><path d="M24 245H516M270 20V470"/>${Array.from({length:36},(_,i)=>`<path d="M270 33v${i%3===0?13:6}" transform="rotate(${i*10} 270 245)"/>`).join('')}</g>
    <g class="air-trails"><path d="M10 352C127 352 91 66 267 64C405 62 487 165 475 290"/><path d="M6 370C148 367 108 82 268 82C397 81 465 171 458 278"/><path d="M12 389C163 383 123 101 270 101"/></g>
    <path d="M390 113L480 113V181L430 181C461 277 408 386 305 411C184 440 84 353 91 242C95 147 167 97 250 105C317 111 364 153 371 214C379 273 339 323 281 328C229 332 190 302 186 258L190 209C179 273 233 309 281 291C328 273 334 215 306 187C272 153 215 160 188 194L130 166C172 104 280 63 390 113Z" fill="url(#turbo-metal)" class="turbo-housing"/>
    <rect x="459" y="103" width="29" height="88" rx="5" class="turbo-flange"/>
    <circle cx="270" cy="245" r="123" class="turbo-rim"/>
    <circle cx="270" cy="245" r="109" class="turbo-cavity"/>
    <g class="turbine-wheel">${Array.from({length:11},(_,i)=>`<path d="M270 223C239 198 234 160 274 140C263 173 288 193 286 224L281 244Z" fill="url(#turbo-blade)" transform="rotate(${i*360/11} 270 245)"/>`).join('')}</g>
    <circle cx="270" cy="245" r="27" fill="url(#turbo-metal)" class="turbo-hub"/>
    <path d="M270 232l12 7v13l-12 7-12-7v-13Z" class="turbo-nut"/>
    ${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return bolt(270+116*Math.cos(a),245+116*Math.sin(a),4);}).join('')}
    <g class="drawing-labels"><path d="M156 133L112 80H48M365 322l60 58h60"/><text x="32" y="65">AIR IN / ENERGY OUT</text><text x="370" y="404">RADIAL COMPRESSOR</text><text x="55" y="474">PERFORMANCE THROUGH PRECISION</text></g>
  `);

  // Concept 3: a modular linkage with pivot plates, slotted rails and connected nodes.
  const assembly = () => svg(`
    <defs><pattern id="assembly-dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#b6b9a9"/></pattern><linearGradient id="plate-metal" x2="1" y2="1"><stop stop-color="#e2e3d8"/><stop offset="1" stop-color="#a3ac98"/></linearGradient></defs>
    <rect x="24" y="26" width="490" height="445" fill="url(#assembly-dots)"/>
    <g class="assembly-base"><path d="M92 340L300 216L470 315L264 442Z" class="assembly-shadow"/><path d="M86 315L294 191L464 290L258 417Z" class="assembly-plate"/><path d="M86 315v18l172 102v-18M258 417l206-127v18L258 435" class="assembly-edge"/>
    ${[[110,315],[294,207],[442,292],[260,400]].map(p=>bolt(...p,7)).join('')}
    <path d="M132 314l132 77M154 299l132 77M319 247l96 57" class="assembly-slots"/></g>
    <g class="assembly-arm assembly-part"><path d="M164 276L307 156" class="linkage-shadow"/><path d="M164 263L307 143" class="linkage"/><path d="M191 240l85-71" class="linkage-slot"/><circle cx="164" cy="263" r="32" class="pivot"/>${bolt(164,263,14)}</g>
    <g class="assembly-bracket assembly-part"><path d="M304 139L402 242L365 279L267 176Z" class="bracket"/><path d="M304 139v20l79 83-18 17v20l37-37v-20Z" class="bracket-edge"/><circle cx="305" cy="152" r="29" class="pivot"/>${bolt(305,152,13)}<circle cx="380" cy="253" r="25" class="pivot"/>${bolt(380,253,11)}</g>
    <g class="assembly-dial assembly-part"><circle cx="188" cy="131" r="59" class="dial-rim"/><circle cx="188" cy="131" r="45" class="dial-face"/>${Array.from({length:12},(_,i)=>`<path d="M188 93v8" transform="rotate(${i*30} 188 131)"/>`).join('')}<path d="M188 131l24-23" class="dial-hand"/>${bolt(188,131,8)}</g>
    <g class="drawing-labels"><path d="M108 132H47V83M389 207h90V167M195 392l-48 45H55"/><text x="32" y="70">INDEPENDENT PARTS</text><text x="385" y="151">CONNECTED SYSTEM</text><text x="43" y="465">DESIGNED TO WORK TOGETHER</text></g>
  `);

  const cad = () => svg(`
    <g class="cad-construction"><path d="M45 45H490V445H45ZM45 245H490M270 45V445M85 85L455 405M85 405L455 85"/><circle cx="270" cy="245" r="170"/></g>
    <g class="cad-outline"><path d="M110 285L260 195L422 280L272 372ZM110 285V310L272 398L422 308V280M272 372V398"/><ellipse cx="270" cy="278" rx="61" ry="33"/><ellipse cx="270" cy="278" rx="41" ry="22"/><path d="M208 278V170M331 278V170"/><ellipse cx="270" cy="170" rx="62" ry="34"/><ellipse cx="270" cy="170" rx="42" ry="23"/><path d="M228 169v-52M312 169v-52"/><ellipse cx="270" cy="117" rx="42" ry="23"/></g>
    <g class="cad-dimensions"><path d="M78 280V408M65 285H91M65 398H91M442 274V409M435 281h14M435 398h14M106 432H424M110 423v18M422 423v18M315 117h112"/><text x="101" y="461">FIG. A / SECTIONAL ASSEMBLY</text><text x="351" y="107">AXIS / Z</text><text x="28" y="263">ELEVATION</text></g>
  `);
  const telemetry = () => svg(`
    <g class="lab-grid">${Array.from({length:10},(_,i)=>`<path d="M40 ${65+i*38}H500M${50+i*48} 55V435"/>`).join('')}</g>
    <g class="lab-equipment"><rect x="60" y="90" width="420" height="300" rx="12"/><rect x="82" y="114" width="310" height="222" rx="4"/><circle cx="435" cy="158" r="19"/><circle cx="435" cy="221" r="19"/><path d="M435 158l11-9M435 221l-9 11M416 282h37M416 296h37M108 357h258"/></g>
    <path class="lab-wave" d="M96 227H125L138 215 150 238 163 174 179 272 197 210 211 225H238L252 198 269 248 286 216 301 227H376"/>
    <g class="lab-cursors"><path d="M163 134V316M286 134V316"/><circle cx="163" cy="174" r="6"/><circle cx="286" cy="216" r="6"/></g>
    <g class="drawing-labels"><text x="82" y="70">SYSTEM OBSERVATION</text><text x="94" y="418">ILLUSTRATIVE SIGNAL / NOT LIVE DATA</text></g>
  `);
  const concepts = {
    original: null,
    cad: { kicker:'Draw the system. Understand the whole.', title:'Kinetic CAD / Blueprint', description:'Construction lines resolve into a sectional drawing. Toggle the construction layer to inspect the form.', art:cad, control:'Hide construction', activeControl:'Show construction' },
    telemetry: { kicker:'Observe. Trace. Understand.', title:'Telemetry / Engineering Test Lab', description:'An illustrative signal study, not a live measurement. Follow a trace through the work below.', art:telemetry, control:'Hold signal', activeControl:'Resume signal' },
    'exploded-engine': { kicker:'Systems, considered from every angle.', title:'Exploded Engine', description:'Layered parts. A shared purpose. Scroll to separate the assembly, or bring it together.', art:engine, control:'Assemble engine', activeControl:'Explode engine' },
    turbocharger: { kicker:'Built for the work. Tuned for performance.', title:'Turbocharger', description:'A study in flow, precision and performance. A quiet rotation inside a sculpted housing.', art:turbo, control:'Pause turbine', activeControl:'Resume turbine' },
    'abstract-assembly': { kicker:'Good systems start with thoughtful connections.', title:'Abstract Mechanical Assembly', description:'Individual components, connected with intent. Explore how the parts move together.', art:assembly, control:'Articulate assembly', activeControl:'Reset assembly' }
  };
  const root = document.documentElement;
  const art = document.getElementById('mechanicalArt');
  const control = document.getElementById('mechanicalControl');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = root.dataset.concept;
  let interacted = false;
  let framePending = false;
  function paintMotion() {
    const hero = document.getElementById('hero');
    const progress = (reduceMotion.matches || root.dataset.motion === 'reduced') ? 0 : Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
    art.style.setProperty('--separation', `${progress * 25}px`);
    framePending = false;
  }
  document.addEventListener('motionchange', paintMotion);
  function scheduleMotion() {
    if (!framePending) { framePending = true; requestAnimationFrame(paintMotion); }
  }
  function renderConcept(name) {
    active = Object.hasOwn(concepts,name) ? name : 'original';
    root.dataset.concept = active;
    interacted = false;
    art.classList.remove('engaged');
    control.setAttribute('aria-pressed','false');
    document.querySelectorAll('.concept-switcher [data-concept]').forEach(link => {
      if (link.dataset.concept === active) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    const concept = concepts[active];
    if (concept) {
      art.innerHTML = concept.art();
      document.getElementById('conceptKicker').textContent = concept.kicker;
      document.getElementById('drawingTitle').textContent = concept.title;
      document.getElementById('conceptDescription').textContent = concept.description;
      control.textContent = concept.control;
      control.hidden = active === 'turbocharger' && reduceMotion.matches;
    } else { art.replaceChildren(); }
    document.title = `Manish Chakka | ${concept ? concept.title : 'Software Engineer'}`;
    paintMotion();
    document.dispatchEvent(new CustomEvent('conceptchange', {detail: active}));
  }
  document.querySelectorAll('.concept-switcher [data-concept]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const next = link.dataset.concept;
    const url = new URL(location.href); url.searchParams.set('concept', next);
    const offset = document.querySelector('.concept-switcher').getBoundingClientRect().bottom + 24;
    const candidates = Array.from(document.querySelectorAll('.timeline__item, .project-card, .skills-category, #about .about-grid'));
    const containsReadingLine = el => { const box = el.getBoundingClientRect(); return box.top <= offset && box.bottom > offset; };
    const section = candidates.find(containsReadingLine) || candidates.filter(el => el.getBoundingClientRect().bottom > offset).sort((a,b) => Math.abs(a.getBoundingClientRect().top-offset)-Math.abs(b.getBoundingClientRect().top-offset))[0] || Array.from(document.querySelectorAll('main > section')).find(containsReadingLine);
    const before = section ? section.getBoundingClientRect().top : 0;
    history.pushState({},'',url);
    renderConcept(next);
    if (section && section.id !== 'hero') {
      window.scrollBy({ top: section.getBoundingClientRect().top - before, behavior: 'instant' });
    }
  }));
  control.addEventListener('click', () => {
    interacted = !interacted;
    art.classList.toggle('engaged', interacted);
    control.setAttribute('aria-pressed', String(interacted));
    control.textContent = concepts[active][interacted ? 'activeControl' : 'control'];
  });
  window.addEventListener('popstate', () => {
    const name = new URLSearchParams(location.search).get('concept') || 'original';
    if (name !== active) renderConcept(name);
  });
  window.addEventListener('scroll',scheduleMotion,{passive:true});
  window.addEventListener('resize',scheduleMotion);
  reduceMotion.addEventListener('change',()=>renderConcept(active));
  renderConcept(active);
})();
