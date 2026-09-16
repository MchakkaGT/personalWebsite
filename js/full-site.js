/* Full-site concept structures and factual, illustrative project diagrams. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('motionToggle');
  let userReduced = false;
  const motionOff = () => reduced.matches || userReduced;
  function syncMotion() {
    root.dataset.motion = motionOff() ? 'reduced' : 'full';
    motionButton?.setAttribute('aria-pressed', String(motionOff()));
    if (motionButton) motionButton.textContent = reduced.matches ? 'System: reduced motion' : userReduced ? 'Enable motion' : 'Reduce motion';
    if (motionButton) motionButton.disabled = reduced.matches;
    document.dispatchEvent(new Event('motionchange'));
  }
  motionButton?.addEventListener('click', () => { userReduced = !userReduced; syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  syncMotion();

  const sheets = ['experience','projects','skills','about','contact'];
  sheets.forEach((id,i) => {
    const section = document.getElementById(id);
    section.dataset.sheet = String(i+1).padStart(2,'0');
    section.querySelector('.section__header').dataset.sheet = section.dataset.sheet;
    const rule = document.createElement('div');
    rule.className = 'section-mechanism'; rule.setAttribute('aria-hidden','true');
    rule.innerHTML = `<span>${String(i+1).padStart(2,'0')}</span><svg viewBox="0 0 900 45" preserveAspectRatio="none"><path class="section-line" d="M0 23H185Q220 23 245 9T305 23H460Q480 23 490 9L510 37 530 9 550 23H900"/><circle cx="185" cy="23" r="5"/><circle cx="550" cy="23" r="5"/></svg>`;
    section.prepend(rule);
  });
  const items = [...document.querySelectorAll('.timeline__item')];
  items.forEach((item,i) => {
    item.dataset.part = String(i+1).padStart(2,'0');
    const label = document.createElement('span'); label.className = 'role-system-label';
    label.dataset.index = String(i+1).padStart(2,'0');
    item.querySelector('.exp-card__header').prepend(label);
    const connector = document.createElementNS('http://www.w3.org/2000/svg','svg');
    connector.setAttribute('viewBox','0 0 180 70'); connector.setAttribute('aria-hidden','true'); connector.classList.add('role-connector');
    connector.innerHTML = '<path d="M4 35H54Q90 35 100 12T176 35"/><circle cx="8" cy="35" r="6"/><circle cx="174" cy="35" r="5"/>';
    item.prepend(connector);
  });

  // The same exact pipeline in every direction. Animation is user-triggered and finite.
  const pipeline = document.querySelector('.delivery-pipeline');
  const pipelineContext = document.createElement('p'); pipelineContext.className='pipeline-context'; pipelineContext.setAttribute('aria-live','polite');
  const stages = [...pipeline.children].map(li=>li.textContent);
  pipeline.querySelectorAll('li').forEach((li,i)=>{
    const button=document.createElement('button'); button.type='button'; button.textContent=stages[i]; button.setAttribute('aria-pressed','false');
    li.replaceChildren(button);
    button.addEventListener('click',()=>{ stopTrace(); selectStage(i); });
  });
  const runTrace=document.createElement('button'); runTrace.type='button'; runTrace.className='trace-trigger'; runTrace.textContent='Follow a trace';
  pipeline.after(runTrace,pipelineContext);
  let traceTimer;
  function stopTrace(){ clearTimeout(traceTimer); runTrace.disabled=false; runTrace.textContent='Follow a trace'; }
  function selectStage(i){
    pipeline.querySelectorAll('button').forEach((b,n)=>{b.setAttribute('aria-pressed',String(n===i));b.parentElement.classList.toggle('is-current',n===i);});
    pipelineContext.textContent=`${stages[i]} · Stage ${i+1} of 5. The same trace ID travels through the delivery stages so engineers can reconstruct the message lifecycle.`;
  }
  runTrace.addEventListener('click',()=>{
    stopTrace();
    if(motionOff()){selectStage(0);pipelineContext.textContent='Filtering → Data Retrieval → Re-ranking → Fatigue → Hydration. Select any stage to explore the trace.';return;}
    runTrace.disabled=true;runTrace.textContent='Following trace';let step=0;
    function advance(){selectStage(step++);if(step<5)traceTimer=setTimeout(advance,750);else stopTrace();}
    advance();
  });
  selectStage(0);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTrace();});
  reduced.addEventListener('change',stopTrace);
  motionButton?.addEventListener('click',stopTrace);

  const projects = [
    {id:'opscribe',title:'Opscribe',kind:'graph',caption:'Conceptual architecture map',nodes:[
      ['UI','React + TypeScript','Interactive views of cloud architecture and typed dependency graphs.'],
      ['API','FastAPI','The backend framework used in the full-stack platform.'],
      ['Graph','BFS + DFS','Multi-hop dependency resolution, reverse impact tracing and blast-radius analysis.'],
      ['Retrieval','pgvector RAG','Semantic retrieval of source code, Terraform configurations and infrastructure documentation.'],
      ['Storage','PostgreSQL','PostgreSQL with pgvector supports the retrieval platform.'],
      ['AI agent','LangChain + Llama 3.3','Combines graph traversal and semantic retrieval for architecture questions and IaC generation.']
    ],edges:[[0,1],[1,2],[1,3],[3,4],[2,5],[3,5]],points:[[15,25],[43,25],[73,17],[43,70],[15,70],[79,70]]},
    {id:'toa',title:'Taste of Atlanta',kind:'map',caption:'Illustrative discovery map',nodes:[
      ['Map','Google Maps','Interactive markers connect visitors to restaurant information.'],
      ['Details','Places API','Restaurant ratings, opening hours and cuisine from real-time Places API data.'],
      ['Favorites','Django','Accounts, password reset and personalized saved restaurants.']
    ],edges:[[0,1],[1,2]],points:[[20,67],[51,26],[81,55]]},
    {id:'commuride',title:'CommuRide',kind:'route',caption:'Illustrative shared route',nodes:[
      ['Origin','React Native + Expo','A cross-platform mobile client for iOS and Android.'],
      ['Shared route','Google Maps','Geocoding, turn-by-turn route planning and commuter matching.'],
      ['Destination','Firebase','Authentication and real-time database synchronization with Firestore.']
    ],edges:[[0,1],[1,2]],points:[[16,72],[49,31],[83,58]]},
    {id:'covid',title:'COVID-19 Dashboard',kind:'chart',caption:'Illustrative trace, not measured data',nodes:[
      ['Trends','Tableau','Interactive state-level infection trends, positivity indices and time-series analysis.'],
      ['Search','Elasticsearch + Kibana','Search and interactive exploration of public-health data.'],
      ['Hosting','AWS + Docker','EC2 hosting with S3 persistence and containerized services.']
    ],edges:[],points:[[19,78],[50,78],[81,78]]},
    {id:'pi',title:'Raspberry Pi',kind:'hardware',caption:'Conceptual cluster modules',nodes:[
      ['Cluster','Kubernetes','A multi-node Raspberry Pi cluster for workload distribution and redundancy.'],
      ['Containers','Docker + RetroPie','Containerized gaming emulators across the hardware.'],
      ['Management','Flask + AWS EC2','A Flask library-management interface, with EC2 for remote access and centralized ROM storage.']
    ],edges:[[0,1],[1,2]],points:[[22,24],[50,48],[78,73]]}
  ];
  const backdrops = {
    graph:'<path class="diagram-construction" d="M30 25H570V240H30ZM30 135H570M300 25V240"/>',
    map:'<path class="map-blocks" d="M20 30h110v65H20ZM170 20h150v90H170ZM385 20h170v75H385ZM30 150h180v80H30ZM270 150h120v85H270ZM460 130h100v100H460Z"/><path class="map-road" d="M0 120C170 150 230 100 600 112M350 0L405 260"/>',
    route:'<path class="route-road" d="M12 40H570M20 130H580M20 220H580M160 10V250M380 10V250"/><path class="route-line" d="M96 187V120Q96 80 144 80H294Q380 80 400 125L498 151"/>',
    chart:'<path class="chart-axis" d="M40 30V170H565M40 65H565M40 115H565"/><path class="chart-line" d="M40 140L82 134 124 102 166 114 208 65 250 76 292 42 334 67 376 107 418 83 460 106 502 125 552 113"/><path class="chart-line chart-line--secondary" d="M40 148L82 145 124 130 166 141 208 109 250 116 292 81 334 106 376 130 418 118 460 139 502 144 552 134"/>',
    hardware:'<g class="hardware-plates"><path d="M38 25H235L265 88H68ZM205 95H405L435 158H235ZM373 166H565L585 231H400Z"/><path d="M45 38h21M45 50h21M215 109h21M215 122h21M385 180h21M385 193h21"/></g>'
  };
  projects.forEach((project,index)=>{
    const card=document.getElementById(project.id+'-details').closest('.project-card');
    card.dataset.project=project.id; card.dataset.figure=String(index+1).padStart(2,'0');
    const visual=card.querySelector('.project-card__image');
    visual.className='project-system project-system--'+project.kind;
    const paths=project.edges.map(([a,b])=>{
      const p=project.points[a],q=project.points[b];
      return `<path class="diagram-edge" data-from="${a}" data-to="${b}" d="M${p[0]*6} ${p[1]*2.6}L${q[0]*6} ${q[1]*2.6}"/>`;
    }).join('');
    visual.innerHTML=`<div class="project-system__label"><span>${project.title}</span><span class="diagram-view-label"></span></div><div class="project-diagram"><svg viewBox="0 0 600 260" preserveAspectRatio="none" aria-hidden="true">${backdrops[project.kind]}${paths}</svg>${project.nodes.map((node,i)=>`<button type="button" class="diagram-node" style="--node-x:${project.points[i][0]}%;--node-y:${project.points[i][1]}%" data-node="${i}" aria-label="${project.title}: ${node[0]}" aria-pressed="false">${node[0]}</button>`).join('')}</div><p class="diagram-caption">${project.caption}. Select a component.</p><div class="diagram-description" aria-live="polite"></div>`;
    const choose=(i)=>{
      const related=new Set([i,...project.edges.filter(edge=>edge.includes(i)).flat()]);
      visual.querySelectorAll('.diagram-node').forEach((node,j)=>{node.setAttribute('aria-pressed',String(i===j));node.classList.toggle('is-related',related.has(j));});
      visual.querySelectorAll('.diagram-edge').forEach(edge=>edge.classList.toggle('is-related',+edge.dataset.from===i||+edge.dataset.to===i));
      visual.querySelector('.diagram-description').replaceChildren();
      const title=document.createElement('strong');title.textContent=project.nodes[i][1];
      const copy=document.createElement('span');copy.textContent=project.nodes[i][2];
      visual.querySelector('.diagram-description').append(title,copy);
      visual.dataset.selected=i;
    };
    visual.querySelectorAll('.diagram-node').forEach((button,i)=>button.addEventListener('click',()=>choose(i)));
    choose(0);
  });

  const about=document.querySelector('.about-grid');
  const portrait=document.createElement('figure');portrait.className='profile-mechanism';
  portrait.innerHTML='<div class="profile-shutter profile-shutter--left" aria-hidden="true"></div><img src="images/facepic.png" alt="Manish Chakka" width="240" height="240"><div class="profile-shutter profile-shutter--right" aria-hidden="true"></div><figcaption>Manish Chakka <span>Georgia Tech · Computer Science</span></figcaption>';
  about.prepend(portrait);
  const sceneNames={'exploded-engine':'Assembly layers',turbocharger:'Flow stations','abstract-assembly':'Connected modules',cad:'System schematic',telemetry:'System inspection',original:'Project map'};
  const roleNames={'exploded-engine':'SUBSYSTEM',turbocharger:'FLOW STATION','abstract-assembly':'LINKAGE',cad:'CALLOUT',telemetry:'SYSTEM TRACE',original:'ROLE'};
  function labelConcept(){
    document.querySelectorAll('.diagram-view-label').forEach(el=>el.textContent=sceneNames[root.dataset.concept]);
    document.querySelectorAll('.role-system-label').forEach(el=>el.textContent=`${roleNames[root.dataset.concept]} ${el.dataset.index}`);
    updateProgress();
  }
  // One passive, frame-batched observer drives the small persistent instrument.
  let scheduled=false;
  function updateProgress(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=Math.min(1,Math.max(0,scrollY/max));
    root.style.setProperty('--page-progress',progress);
    const current=[...document.querySelectorAll('main > section')].filter(section=>section.getBoundingClientRect().top<innerHeight*.48).at(-1);
    const id=current?.id||'hero';root.dataset.chapter=id;
    document.getElementById('progressSection').textContent=id==='hero'?'Overview':id.charAt(0).toUpperCase()+id.slice(1);
    items.forEach(item=>item.classList.toggle('module-active',item.getBoundingClientRect().top<innerHeight*.65&&item.getBoundingClientRect().bottom>innerHeight*.25));
    scheduled=false;
  }
  function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}}
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
  if('ResizeObserver' in window)new ResizeObserver(queue).observe(document.querySelector('main'));
  document.addEventListener('conceptchange',labelConcept);
  labelConcept();
  // Only animate diagrams while visible, and never when motion is reduced.
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting)),{threshold:.15});
    document.querySelectorAll('.project-system,.profile-mechanism,.mechanical-panel').forEach(el=>observer.observe(el));
  }
})();
