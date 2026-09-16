/* Decorative automotive sketches; portfolio content stays professional. */
(() => {
  'use strict';
  const root = document.documentElement;
  const fragments = {
    experience:'<path d="M25 98L32 75 87 64 132 30Q169 17 225 29L274 65 326 77 339 99H301Q299 69 276 70T249 101H107Q104 72 81 72T54 99Z"/><path d="M103 64L142 36 187 33 194 65ZM201 34L222 36 260 65H205"/><circle cx="81" cy="97" r="19"/><circle cx="276" cy="97" r="19"/><path d="M17 122H347M191 8V113" class="fragment-guide"/>',
    projects:'<ellipse cx="177" cy="79" rx="62" ry="62"/><ellipse cx="177" cy="79" rx="44" ry="44"/><circle cx="177" cy="79" r="12"/><path d="M177 36V66M141 57L166 73M142 103L167 85M192 119L182 91M218 68L188 76M112 12L72 109 116 130M75 36L110 48 85 60 101 73 72 87M239 20L303 38 270 115 235 119"/><path d="M55 79H310M177 5V145" class="fragment-guide"/>',
    skills:'<path d="M82 41L213 21 279 55 264 113 133 136 72 96Z M82 41L137 77 279 55M137 77L133 136M165 69L164 130M193 64L192 125M222 60L220 120M90 54L79 91M107 65L95 103"/><circle cx="240" cy="82" r="13"/><path d="M65 27L275 5M48 121L139 151M296 33V135" class="fragment-guide"/>',
    about:'<path d="M29 62Q166 -4 330 64M40 75Q168 22 320 77M35 104L83 111M269 109L320 102"/><ellipse cx="177" cy="82" rx="56" ry="49"/><ellipse cx="177" cy="82" rx="44" ry="38"/><path d="M135 69L166 81 170 116M219 69L188 81 183 116M165 81Q177 74 190 82L185 94H169Z M73 65L97 56 108 72 82 79M243 56L279 68 272 86 240 76"/><path d="M177 6V143M15 147H344" class="fragment-guide"/>'
  };
  for (const [id,paths] of Object.entries(fragments)) {
    const art=document.createElement('div');art.className='automotive-fragment';art.setAttribute('aria-hidden','true');
    art.innerHTML=`<svg viewBox="0 0 360 155">${paths}</svg>`;
    document.querySelector('#'+id+' .section__header').append(art);
  }
  const footerArt=document.createElement('div');footerArt.className='sketch-footer';footerArt.setAttribute('aria-hidden','true');
  footerArt.innerHTML=`<svg viewBox="0 0 360 155">${fragments.experience}</svg>`;
  document.querySelector('footer').prepend(footerArt);
  const files={toa:'tasteofatl.png',commuride:'commuride.png',covid:'covid-dashboard.jpg',pi:'raspberrypi.jpeg'};
  const diagrams=[];
  document.querySelectorAll('.project-card').forEach(card=>{
    const id=card.dataset.project, diagram=card.querySelector('.project-system');
    const identity=document.createElement('div');identity.className='project-identity';
    if(id==='opscribe') {
      identity.classList.add('project-identity--opscribe');
      const image=document.createElement('img');image.src='images/opscribe.png';image.alt='Opscribe: AI for Infrastructure Intelligence';image.loading='lazy';identity.append(image);
    } else {
      const image=document.createElement('img');image.src='images/'+files[id];image.alt=card.querySelector('h3').textContent.trim()+' project image';image.loading='lazy';identity.append(image);
    }
    card.prepend(identity);
    diagrams.push({card,diagram,identity,details:card.querySelector('.project-card__details')});
  });
  const motion=document.getElementById('motionToggle');
  let wasSketch=false;
  let previousMotion=root.dataset.motion;
  function apply(){
    const enabled=root.dataset.concept==='sketch-drive';
    motion.hidden=enabled;
    document.querySelector('.mechanical-panel').setAttribute('aria-label', enabled ? 'Automotive line drawing' : 'Interactive mechanical illustration');
    // This experiment has motion enabled and no extra motion-mode control.
    if(enabled && !wasSketch) { previousMotion=root.dataset.motion; root.dataset.motion='full'; }
    if(!enabled && wasSketch) root.dataset.motion=previousMotion;
    wasSketch=enabled;
    for(const entry of diagrams){
      if(enabled) entry.details.prepend(entry.diagram);
      else entry.identity.after(entry.diagram);
    }
    if(enabled) {
      document.querySelectorAll('.role-system-label').forEach(el=>el.textContent='');
      document.querySelectorAll('.diagram-view-label').forEach(el=>el.textContent='Technical overview');
    }
  }
  document.addEventListener('conceptchange',apply);apply();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('sketch-visible',entry.isIntersecting)),{threshold:.15});
  document.querySelectorAll('.automotive-fragment,.sketch-footer').forEach(el=>observer.observe(el));
})();
