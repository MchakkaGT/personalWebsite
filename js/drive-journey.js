/* Scroll-scrubbed line-art scene. A small perspective renderer, no WebGL/runtime dependency. */
(() => {
  'use strict';
  const root=document.documentElement;
  const stage=document.createElement('div');stage.className='drive-stage';stage.setAttribute('aria-hidden','true');
  const canvas=document.createElement('canvas');stage.append(canvas);document.body.append(stage);
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const ids=['experience','projects','skills','about','contact'];
  const bands=ids.map(id=>{const el=document.createElement('div');el.className='drive-transition';el.dataset.destination=id;el.setAttribute('aria-hidden','true');document.getElementById(id).before(el);return el;});
  const sections=['hero',...ids].map(id=>document.getElementById(id));
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const mix=(a,b,t)=>a+(b-a)*t;
  // yaw, camera elevation, scale, door angle, hood angle, interior emphasis.
  const views=[
    [0.28,.15,1.05,0,0,0],
    [.96,.20,.78,0,0,0],
    [1.22,.16,1.18,1.16,0,.12],
    [1.48,.12,1.85,1.35,0,.85],
    [.20,.12,2.1,.25,0,1],
    [-.45,.52,1.12,0,1.15,.12],
    [-.82,.29,.88,0,0,0],
    [-2.65,.2,.90,0,0,0]
  ];
  let view=views[0],width=0,height=0,queued=false,active=false,cache=[];
  function measure(){cache=sections.map(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight}));schedule();}
  function project(p){
    const [yaw,pitch,scale]=view;
    const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw);
    const z=p[2]*Math.cos(yaw)-p[0]*Math.sin(yaw);
    const y=p[1]*Math.cos(pitch)+z*Math.sin(pitch);
    const depth=z*Math.cos(pitch)-p[1]*Math.sin(pitch);
    const f=Math.min(width/5.9,height/3.4)*scale*6/(6+depth);
    return [width*.5+x*f,height*.60-y*f];
  }
  function line(points,color='#53635d',alpha=1,weight=1,closed=false,fill=null){
    ctx.beginPath();points.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(...q):ctx.moveTo(...q);});if(closed)ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.globalAlpha=alpha;ctx.fill();}
    ctx.strokeStyle=color;ctx.lineWidth=weight;ctx.globalAlpha=alpha;ctx.stroke();ctx.globalAlpha=1;
  }
  function ellipse(center,rx,ry,plane='xy',color='#53635d',alpha=1){
    const points=Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return plane==='yz'?[center[0],center[1]+ry*Math.sin(a),center[2]+rx*Math.cos(a)]:[center[0]+rx*Math.cos(a),center[1]+ry*Math.sin(a),center[2]];});line(points,color,alpha);
  }
  function wheel(x,z,alpha=1){
    ctx.save();
    const center=[x,.02,z];ellipse(center,.49,.49,'yz','#4a5752',alpha);ellipse(center,.37,.37,'yz','#68766e',alpha*.8);ellipse(center,.08,.08,'yz','#68766e',alpha);
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2+scrollY*.00045;line([[x,.02+Math.sin(a)*.1,z+Math.cos(a)*.1],[x,.02+Math.sin(a)*.36,z+Math.cos(a)*.36]],'#718179',alpha*.75);}
    ctx.restore();
  }
  function doorPoint(p,side){
    if(side!==1)return p;
    const hinge=-.70,dz=p[2]-hinge,a=view[3];return [p[0]+Math.sin(a)*dz,p[1],hinge+Math.cos(a)*dz];
  }
  function drawCar(){
    const interior=view[5],bodyAlpha=mix(1,.18,interior);
    // Broad transparent pastel washes stay behind the unfilled wire drawing.
    line([[-1.3,-.5,-2.4],[1.3,-.5,-2.4],[1.3,-.5,2.4],[-1.3,-.5,2.4]],'#c7d5ce',.35,.5,true,'#dbe7dd');
    for(const side of [-1,1]){
      const x=side;
      const sideAlpha=bodyAlpha*(side*Math.sin(view[0])<0?.22:1);
      const outline=[[x*.91,.3,-2.35],[x,.7,-2.10],[x,.75,-.85],[x*.78,1.35,-.12],[x*.76,1.39,.75],[x*.95,.81,1.52],[x,.62,2.1],[x,.18,2.25]];
      line(outline,'#45554e',sideAlpha,1.4);
      line([[x,.18,-2.25],[x,.10,-1.95],[x,.1,-1.05],[x,-.12,-.83],[x,-.12,1.0],[x,.12,1.15],[x,.12,2.23]],'#586a61',sideAlpha);
      line([[x*.77,1.29,-.06],[x*.97,.79,-.66],[x*.96,.80,.92],[x*.76,1.32,.71],[x*.77,1.29,-.06]],'#68746c',sideAlpha);
      line([[x*.78,1.30,.44],[x*.96,.81,.48]],'#6c7e75',sideAlpha);
      const door=[[x*.97,.75,-.7],[x*.98,.05,-.72],[x*.99,.01,.91],[x*.97,.76,.94],[x*.77,1.32,.67],[x*.78,1.31,.05],[x*.97,.75,-.7]].map(p=>doorPoint(p,side));
      line(door,'#567967',mix(sideAlpha,1,view[3]/1.4),1.3,false);
      line([[x*.985,.64,.45],[x*.985,.64,.67]].map(p=>doorPoint(p,side)),'#64786d',sideAlpha);
      line([[x,.71,-.66],[x*1.18,.82,-.72],[x*1.23,.79,-.45],[x,.72,-.41]],'#64786d',sideAlpha);
      wheel(x*1.015,-1.48,sideAlpha);wheel(x*1.015,1.48,sideAlpha);
    }
    // Windshield and roof describe a recognizable performance coupe silhouette.
    line([[-.98,.77,-.85],[-.77,1.35,-.12],[.77,1.35,-.12],[.98,.77,-.85],[-.98,.77,-.85]],'#56625c',bodyAlpha,1.1);
    line([[-.77,1.35,-.12],[-.76,1.39,.75],[.76,1.39,.75],[.77,1.35,-.12]],'#5b6a62',bodyAlpha);
    line([[-.76,1.39,.75],[-.94,.81,1.52],[.94,.81,1.52],[.76,1.39,.75]],'#6d7a73',bodyAlpha);
    const hoodPoint=p=>{const dz=p[2]+.85,a=view[4];return[p[0],p[1]-Math.sin(a)*dz,-.85+Math.cos(a)*dz];};
    const hood=[[-.97,.77,-.85],[-.91,.7,-2.10],[.91,.7,-2.10],[.97,.77,-.85],[-.97,.77,-.85]].map(hoodPoint);
    line(hood,'#5d7468',bodyAlpha,1.3,true,'#f6f3eb');
    for(const x of [-.52,.52])line([[x,.73,-2.02],[x*.8,.77,-.96]].map(hoodPoint),'#91a9b3',bodyAlpha);
    line([[-.91,.7,-2.1],[-.91,.30,-2.35],[.91,.30,-2.35],[.91,.7,-2.1]],'#52645b',bodyAlpha,1.4,true,'#f6f3eb');
    line([[-.65,.48,-2.36],[.65,.48,-2.36],[.51,.32,-2.37],[-.51,.32,-2.37],[-.65,.48,-2.36]],'#65786b',bodyAlpha);
    for(const s of [-1,1])line([[s*.88,.65,-2.15],[s*.37,.61,-2.22],[s*.42,.53,-2.24],[s*.86,.57,-2.2],[s*.88,.65,-2.15]],'#9caebe',bodyAlpha,1.5);
    if(Math.cos(view[0])<.4) line([[-1,.62,2.1],[1,.62,2.1],[1,.18,2.25],[-1,.18,2.25],[-1,.62,2.1]],'#61756a',bodyAlpha);
    if(Math.cos(view[0])<.4) line([[-.85,.52,2.18],[.85,.52,2.18]],'#bd9288',bodyAlpha,2);
    if(view[4]>.02){
      const a=clamp(view[4]);line([[-.7,.60,-1.02],[-.7,.6,-1.94],[.7,.6,-1.94],[.7,.6,-1.02]],'#8d9a93',a,1,true);
      for(let i=0;i<5;i++)line([[-.4,.63,-1.2-i*.13],[.38,.63,-1.2-i*.13]],'#768e83',a,2);
    }
    line([[1.02,-.08,-.78],[1.02,-.08,.96]],'#bba08f',bodyAlpha*.7,1.7);
    drawInterior(interior);
    // Light construction axes, no invented measurements or automotive text labels.
    line([[-1.6,-.52,-2.65],[1.6,-.52,-2.65]],'#8fa8b5',.4);
    line([[-1.45,-.52,-2.6],[-1.45,-.52,2.6]],'#9daf9c',.35);
  }
  function drawInterior(a){
    const alpha=mix(.18,1,a);
    line([[-.85,.71,-.65],[-.8,.85,-.45],[.8,.85,-.45],[.85,.71,-.65]],'#718278',alpha,1.4);
    ellipse([-.47,.83,-.39],.25,.25,'xy','#668575',alpha);ellipse([-.47,.83,-.39],.19,.19,'xy','#71877a',alpha);
    line([[-.65,.9,-.39],[-.47,.8,-.39],[-.29,.9,-.39]],'#789086',alpha);line([[-.47,.8,-.39],[-.47,.6,-.39]],'#789086',alpha);
    line([[-.12,.88,-.43],[.40,.88,-.43],[.40,.56,-.43],[-.12,.56,-.43],[-.12,.88,-.43]],'#819caa',alpha,1.5,false,'#e0e9e6');
    line([[-.13,.5,-.3],[.4,.5,-.3],[.35,.23,.8],[-.12,.23,.8]],'#a5b6aa',alpha);
    for(const x of [-.55,.6])line([[x-.20,.1,.55],[x-.20,.8,.80],[x+.15,.8,.80],[x+.18,.1,.55]],'#8a9c8f',alpha);
  }
  function render(){
    queued=false;if(!active)return;
    const vh=innerHeight,reading=scrollY+vh*.45;
    let segment=0,t=0,inBand=false,bandTop=0,bandBottom=0;
    for(let i=0;i<bands.length;i++){
      const b=bands[i],top=b.getBoundingClientRect().top;
      if(top<vh&&top+b.offsetHeight>100){inBand=true;bandTop=top;bandBottom=top+b.offsetHeight;segment=i+1;t=ease((vh*.7-top)/(b.offsetHeight+vh*.25));break;}
    }
    if(!inBand){for(let i=0;i<cache.length;i++)if(reading>=cache[i].top)segment=i;
      t=clamp((reading-cache[segment].top)/cache[segment].height);
    }
    let from,to;
    if(segment===0){from=views[0];to=views[1];t=ease(scrollY/(vh*.9));}
    else if(inBand){from=views[segment===1?1:segment+1];to=views[segment+1];if(segment===1){from=views[1];to=views[2];}else if(segment===2){from=views[3];to=views[4];}else if(segment===3){from=views[4];to=views[5];}else if(segment===4){from=views[5];to=views[6];}else{from=views[6];to=views[7];}}
    else{const index=segment===1?2:segment+2;from=views[index];to=views[segment===1?3:index];t=ease(t);}
    view=from.map((n,i)=>mix(n,to[i],t));
    root.style.setProperty('--drive-intro',String(clamp(scrollY/(vh*.85))));
    // Continuous framing: broad in transitions, compact beside readable content.
    const mobile=innerWidth<900;
    const bandWeight=inBand?Math.sin(Math.PI*t):0;
    const hero=segment===0;
    const baseWidth=hero?innerWidth*.49:inBand&&segment===1?mix(innerWidth*.49,Math.min(320,innerWidth*.24),t):Math.min(320,innerWidth*.24);
    const w=mobile?innerWidth:mix(baseWidth,innerWidth*.80,bandWeight);
    const h=mobile?(hero?300:inBand?vh*.47:170):mix(hero?vh*.60:vh*.48,vh*.72,bandWeight);
    stage.style.width=w+'px';stage.style.height=h+'px';
    stage.style.right=(mobile?0:mix(hero?innerWidth*.025:15,innerWidth*.1,bandWeight))+'px';
    stage.style.top=(mobile?(hero?Math.max(190,730-scrollY):inBand?vh*.26:vh-175):mix(hero?vh*.25:vh*.29,vh*.18,bandWeight))+'px';
    const stageTop=parseFloat(stage.style.top);
    stage.style.clipPath=inBand&&bandWeight>.12?`inset(${Math.max(0,bandTop-stageTop)}px 0 ${Math.max(0,stageTop+h-bandBottom)}px 0)`:'none';
    stage.style.opacity=mobile?(hero||inBand?1:.25):1;
    stage.dataset.scene=['hero','experience','projects','skills','about','contact'][segment];
    stage.dataset.door=view[3].toFixed(2);stage.dataset.hood=view[4].toFixed(2);
    const dpr=Math.min(devicePixelRatio||1,2);
    if(width!==Math.round(w)||height!==Math.round(h)){width=Math.round(w);height=Math.round(h);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);drawCar();
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
  function activate(){active=root.dataset.concept==='sketch-drive';stage.hidden=!active;if(active)measure();}
  document.addEventListener('conceptchange',activate);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);
  new ResizeObserver(measure).observe(document.querySelector('main'));
  activate();
})();
