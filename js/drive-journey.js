/* Continuous scroll choreography for the detailed Gallardo line drawing. */
(() => {
  'use strict';
  const root=document.documentElement;
  const stage=document.createElement('div');stage.className='drive-stage';stage.setAttribute('aria-hidden','true');
  const canvas=document.createElement('canvas');stage.append(canvas);document.body.append(stage);
  let model=null,loading=false;
  const ids=['experience','projects','skills','about','contact'];
  const bands=ids.map(id=>{const el=document.createElement('div');el.className='drive-transition';el.dataset.destination=id;el.setAttribute('aria-hidden','true');document.getElementById(id).before(el);return el;});
  const sections=['hero',...ids].map(id=>document.getElementById(id));
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const mix=(a,b,t)=>a+(b-a)*t;
  // yaw, elevation, scale, door, front hood, reserved, rear luggage lid.
  const views=[
    [.63,.24,1.02,0,0,0,0],
    [.96,.20,.86,0,0,0,0],
    [1.06,.23,.98,1.02,0,0,0],
    [1.40,.23,.98,.25,0,0,0],
    [4.00,.30,1.02,0,0,0,1.08],
    [6.92,.36,1.02,0,1.05,0,0],
    [7.10,.29,.94,0,0,0,0],
    [8.93,.23,.98,0,0,0,0]
  ];
  let view=views[0],width=0,height=0,queued=false,active=false,cache=[],keys=[];
  function measure(){
    cache=sections.map(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight}));
    if(!active)return;
    const w=innerWidth,h=innerHeight,mobile=w<900;
    const panel=document.querySelector('#hero .mechanical-panel').getBoundingClientRect();
    const mobileHeight=Math.min(340,w*.82);
    const heroFrame=mobile?[w,mobileHeight,0,panel.top+scrollY,1]:[w*.49,h*.60,w*.025,h*.25,1];
    const side=mobile?[w,220,0,h*.62,0]:[Math.min(320,w*.24),h*.48,15,h*.29,1];
    const wide=mobile?[w,mobileHeight,0,Math.max(190,(h-mobileHeight)/2),1]:[w*.78,h*.70,w*.11,h*.19,1];
    keys=[];
    const add=(at,v,f,scene)=>keys.push({at,view:v,frame:f,scene});
    add(0,views[0],heroFrame,'hero');
    const first=bands[0].getBoundingClientRect().top+scrollY;
    const heroEnd=mobile?[w,mobileHeight,0,Math.max(190,(h-mobileHeight)/2),1]:heroFrame;
    add(Math.max(1,first-h*.55),views[1],heroEnd,'hero');
    bands.forEach((band,i)=>{
      const top=band.getBoundingClientRect().top+scrollY;
      const end=top+band.offsetHeight-h*.18;
      const start=top-h*.55;
      const before=i===0?views[1]:views[i===1?3:i+2];
      const after=views[i===0?2:i+3];
      if(i>0)add(start,before,side,ids[i-1]);
      // Settle the framing first, then articulate. Hold the open panel before content arrives.
      add(top-h*.10,before,wide,ids[i]);
      if(i===1){
        const closed=[...after];closed[6]=0;
        add(top+band.offsetHeight*.15,closed,wide,ids[i]);
      }
      add(top+band.offsetHeight*.32,after,wide,ids[i]);
      add(top+band.offsetHeight*.48,after,wide,ids[i]);
      add(end,after,side,ids[i]);
      if(i===0)add(cache[1].top+cache[1].height-h*.65,views[3],side,'experience');
    });
    keys.sort((a,b)=>a.at-b.at);schedule();
  }
  function render(){
    queued=false;if(!active||!keys.length)return;
    const y=scrollY;
    let index=0;while(index<keys.length-2&&y>keys[index+1].at)index++;
    const from=keys[index],to=keys[index+1];
    const t=ease((y-from.at)/Math.max(1,to.at-from.at));
    view=from.view.map((v,i)=>mix(v,to.view[i],t));
    const [w,h,right,top,opacity]=from.frame.map((v,i)=>mix(v,to.frame[i],t));
    // One continuous timeline controls both camera and framing. No branch switches or clipping panels.
    Object.assign(stage.style,{width:w+'px',height:h+'px',right:right+'px',top:top+'px',opacity:String(opacity),clipPath:'none'});
    root.style.setProperty('--drive-intro',String(clamp(y/(innerHeight*.85))));
    stage.dataset.scene=t<.5?from.scene:to.scene;
    stage.dataset.door=view[3].toFixed(3);stage.dataset.hood=view[4].toFixed(3);stage.dataset.trunk=view[6].toFixed(3);
    stage.dataset.camera=view.slice(0,3).map(n=>n.toFixed(4)).join(',');
    width=Math.round(w);height=Math.round(h);
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    if(model)model.draw(view,width,height);

  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
  function activate(){
    active=root.dataset.concept==='sketch-drive';stage.hidden=!active;
    if(active){
      measure();
      if(!loading){loading=true;import('./gallardo.js?v=13').then(m=>m.createGallardo(canvas)).then(m=>{model=m;stage.dataset.ready='true';schedule();}).catch(error=>{console.error('Gallardo scene:',error);stage.hidden=true;});}
    }
  }
  document.addEventListener('conceptchange',activate);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);
  new ResizeObserver(measure).observe(document.querySelector('main'));
  activate();
})();
