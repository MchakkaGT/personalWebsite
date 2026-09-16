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
    [.63,.24,1.02,0,0,0],
    [.96,.20,.78,0,0,0],
    [1.06,.23,.98,1.02,0,.08],
    [1.25,.16,1.38,1.12,0,.78],
    [.28,.12,1.65,.12,0,1],
    [-.64,.36,1.02,0,1.05,.04],
    [-.82,.29,.88,0,0,0],
    [-2.65,.2,.90,0,0,0]
  ];
  let view=views[0],width=0,height=0,queued=false,active=false,cache=[],keys=[],drawQueue=null,depthHint=null;
  function measure(){
    cache=sections.map(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight}));
    if(!active)return;
    const w=innerWidth,h=innerHeight,mobile=w<900;
    const panel=document.querySelector('#hero .mechanical-panel').getBoundingClientRect();
    const heroFrame=mobile?[w,300,0,panel.top+scrollY,1]:[w*.49,h*.60,w*.025,h*.25,1];
    const side=mobile?[w,220,0,h*.62,0]:[Math.min(320,w*.24),h*.48,15,h*.29,1];
    const wide=mobile?[w,h*.52,0,h*.29,1]:[w*.78,h*.70,w*.11,h*.19,1];
    keys=[];
    const add=(at,v,f,scene)=>keys.push({at,view:v,frame:f,scene});
    add(0,views[0],heroFrame,'hero');
    const first=bands[0].getBoundingClientRect().top+scrollY;
    const heroEnd=mobile?[w,300,0,Math.max(180,heroFrame[3]-(first-h*.55)),1]:heroFrame;
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
      add(top+band.offsetHeight*.32,after,wide,ids[i]);
      add(top+band.offsetHeight*.48,after,wide,ids[i]);
      add(end,after,side,ids[i]);
      if(i===0)add(cache[1].top+cache[1].height-h*.65,views[3],side,'experience');
    });
    keys.sort((a,b)=>a.at-b.at);schedule();
  }
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
    if(drawQueue){const depth=depthHint??points.reduce((n,p)=>n+p[2]*Math.cos(view[0])-p[0]*Math.sin(view[0]),0)/points.length;drawQueue.push({depth,points,color,alpha,weight,closed,fill});return;}
    ctx.beginPath();points.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(...q):ctx.moveTo(...q);});if(closed)ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.globalAlpha=alpha;ctx.fill();}
    ctx.strokeStyle=color;ctx.lineWidth=weight;ctx.globalAlpha=alpha;ctx.stroke();ctx.globalAlpha=1;
  }
  function ellipse(center,rx,ry,plane='xy',color='#53635d',alpha=1){
    const points=Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return plane==='yz'?[center[0],center[1]+ry*Math.sin(a),center[2]+rx*Math.cos(a)]:[center[0]+rx*Math.cos(a),center[1]+ry*Math.sin(a),center[2]];});line(points,color,alpha);
  }
  function doorPoint(p,side){
    if(side!==1)return p;
    const hinge=-.70,dz=p[2]-hinge,a=view[3];return [p[0]+Math.sin(a)*dz,p[1],hinge+Math.cos(a)*dz];
  }
  function curve(points){
    const out=[];
    for(let i=0;i<points.length-1;i++){
      const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];
      for(let n=0;n<10;n++){const t=n/10;out.push(b.map((v,k)=>.5*((2*v)+(-a[k]+c[k])*t+(2*a[k]-5*v+4*c[k]-d[k])*t*t+(-a[k]+3*v-3*c[k]+d[k])*t*t*t)));}
    }return [...out,points.at(-1)];
  }
  function drawCar(){
    const interior=view[5],bodyAlpha=mix(1,.10,interior),paper='#f6f3eb';
    drawQueue=[];
    // Solid paper-colored surfaces hide unseen edges. The result stays line art, not X-ray wireframe.
    for(const side of [-1,1]){
      const x=side;
      depthHint=-x*Math.sin(view[0])*1.05;
      const shoulder=curve([[x*.80,.34,-2.48],[x*.98,.62,-2.18],[x*1.04,.73,-1.5],[x*.98,.70,-.73],[x*.99,.73,.60],[x*1.04,.76,1.48],[x*.99,.63,2.1],[x*.84,.32,2.38]]);
      const arch=z=>Array.from({length:25},(_,i)=>{const a=i/24*Math.PI;return[x*1.055,-.04+Math.sin(a)*.57,z+Math.cos(a)*.55];});
      const panel=[...shoulder,[x*.87,-.14,2.35],[x*1.01,-.14,2.03],...arch(1.48),[x*1.02,-.14,.93],[x*1.02,-.14,-.93],...arch(-1.48),[x*.87,-.14,-2.34]];
      line(panel,'#4b5d54',bodyAlpha,1.15,true,paper);
      line(curve([[x*1.05,.42,-2.04],[x*1.055,.48,-1.04],[x*1.03,.41,.32],[x*1.07,.49,1.13],[x*.99,.43,2.1]]),'#8d9c93',bodyAlpha,.7);
      line([[x*1.055,-.07,-.88],[x*1.055,-.07,.88]],'#b39e8c',bodyAlpha,1.5);
      const roof=curve([[x*.98,.70,-.73],[x*.78,1.10,-.13],[x*.74,1.22,.32],[x*.76,1.19,.82],[x*.90,.90,1.34],[x*1.01,.73,1.66]]);
      line([...roof,[x*.98,.70,-.73]],'#5c7064',bodyAlpha,1,true,'#edf0e9');
      const window=curve([[x*.955,.76,-.59],[x*.785,1.08,-.08],[x*.77,1.15,.30],[x*.80,1.13,.75],[x*.92,.81,1.23]]);
      line([...window,[x*.955,.76,-.59]],'#64746b',bodyAlpha,.8,true,paper);
      line([[x*.80,1.13,.69],[x*.97,.77,.80]],'#75857b',bodyAlpha,.7);
      // The near-side door has a real fixed hinge and carries its window and mirror.
      depthHint-=.005;
      const door=[[x*.99,.70,-.70],[x*1.045,-.03,-.68],[x*1.045,-.03,.79],[x*1.005,.73,.82],[x*.80,1.13,.69],[x*.77,1.15,.30],[x*.785,1.08,-.08],[x*.955,.76,-.59],[x*.99,.70,-.70]].map(p=>doorPoint(p,side));
      line(door,'#61766a',bodyAlpha,1,true,paper);
      const glass=[[x*.965,.76,-.52],[x*.795,1.07,-.04],[x*.785,1.12,.29],[x*.81,1.10,.64],[x*.99,.76,.74]].map(p=>doorPoint(p,side));
      line(glass,'#8a9e9b',bodyAlpha,.65,true,'#edf1eb');
      line([[x*1.055,.57,.47],[x*1.055,.57,.65]].map(p=>doorPoint(p,side)),'#6c7d73',bodyAlpha,1.4);
      line([[x*1.01,.75,-.61],[x*1.18,.78,-.66],[x*1.20,.73,-.46],[x*1.02,.71,-.42]].map(p=>doorPoint(p,side)),'#6c7d73',bodyAlpha,.8,true,paper);
      for(const z of [-1.48,1.48]){
        const center=[x*1.07,-.04,z];
        depthHint=Math.min(-x*Math.sin(view[0])*1.05-.02,z*Math.cos(view[0])-x*1.07*Math.sin(view[0]));
        const ring=Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return [center[0],center[1]+.49*Math.sin(a),z+.49*Math.cos(a)];});
        line(ring,'#485b51',bodyAlpha,1.15,true,paper);
        ellipse(center,.39,.39,'yz','#6e8075',bodyAlpha);ellipse(center,.34,.34,'yz','#9eada3',bodyAlpha*.65);ellipse(center,.065,.065,'yz','#6e8075',bodyAlpha);
        for(let i=0;i<5;i++){const a=i/5*Math.PI*2+scrollY*.00012;for(const da of [-.06,.06])line([[x*1.075,-.04+Math.sin(a+da)*.08,z+Math.cos(a+da)*.08],[x*1.075,-.04+Math.sin(a+.16+da)*.37,z+Math.cos(a+.16+da)*.37]],'#6e8075',bodyAlpha,.7);}
      }
    }
    depthHint=null;
    // Low, curved roof and a swept windshield replace the boxy cabin.
    line(curve([[-.78,1.10,-.13],[-.38,1.16,-.17],[.38,1.16,-.17],[.78,1.10,-.13]]).concat([[.98,.70,-.73],[-.98,.70,-.73]]),'#607267',bodyAlpha,1,true,'#eef1e9');
    line([[-.78,1.10,-.13],[-.74,1.22,.32],[-.76,1.19,.82],[.76,1.19,.82],[.74,1.22,.32],[.78,1.10,-.13]],'#66796d',bodyAlpha,1,true,paper);
    line([[-.76,1.19,.82],[-.9,.9,1.34],[.9,.9,1.34],[.76,1.19,.82]],'#7d8b81',bodyAlpha,.8,true,'#eef1e9');
    const hoodPoint=p=>{const dz=p[2]+.73,a=view[4];return[p[0],p[1]-Math.sin(a)*dz,-.73+Math.cos(a)*dz];};
    const hood=curve([[-.96,.7,-.73],[-.93,.65,-1.5],[-.83,.56,-2.18],[-.40,.54,-2.27],[.40,.54,-2.27],[.83,.56,-2.18],[.93,.65,-1.5],[.96,.7,-.73]]).map(hoodPoint);
    line(hood,'#536b5e',bodyAlpha,1.1,true,paper);
    for(const x of [-.56,.56])line(curve([[x*.7,.705,-.78],[x,.65,-1.46],[x*.9,.57,-2.12]]).map(hoodPoint),'#8ca8b1',bodyAlpha,.8);
    const front=curve([[-.98,.55,-2.18],[-.94,.23,-2.42],[-.72,.03,-2.48],[0,-.02,-2.5],[.72,.03,-2.48],[.94,.23,-2.42],[.98,.55,-2.18]]);
    depthHint=-2.42*Math.cos(view[0]);
    line(front,'#51665a',bodyAlpha,1.15,true,paper);
    line(curve([[-.58,.23,-2.46],[-.45,.08,-2.50],[.45,.08,-2.50],[.58,.23,-2.46],[-.58,.23,-2.46]]),'#687d6e',bodyAlpha,.85);
    line([[-.8,-.08,-2.43],[0,-.12,-2.48],[.8,-.08,-2.43]],'#92a4aa',bodyAlpha,1);
    for(const side of [-1,1]){
      const x=side;
      line([[x*.88,.49,-2.24],[x*.37,.43,-2.34],[x*.44,.34,-2.38],[x*.87,.39,-2.3]],'#657f89',bodyAlpha,.8,true,paper);
      line([[x*.84,.445,-2.28],[x*.46,.40,-2.355]],'#8ba8b2',bodyAlpha,1.35);
      line([[x*.85,.25,-2.4],[x*.67,.24,-2.45],[x*.69,.1,-2.46],[x*.82,.12,-2.43]],'#7c8c81',bodyAlpha,.7);
    }
    depthHint=null;
    line([[-.99,.60,2.1],[-.86,.01,2.37],[.86,.01,2.37],[.99,.60,2.1]],'#64796a',bodyAlpha,1,true,paper);
    line([[-.83,.44,2.20],[-.28,.43,2.25],[.28,.43,2.25],[.83,.44,2.20]],'#bd9d95',bodyAlpha,1.8);
    if(view[4]>.02){const a=clamp(view[4]*2);line([[-.68,.49,-.89],[-.68,.49,-1.94],[.68,.49,-1.94],[.68,.49,-.89]],'#91a397',a,.7,true,'#e7eee5');for(let i=0;i<5;i++)line([[-.35,.54,-1.04-i*.14],[.35,.54,-1.04-i*.14]],'#819889',a,1.5);}
    const queue=drawQueue;drawQueue=null;depthHint=null;
    queue.sort((a,b)=>b.depth-a.depth).forEach(item=>line(item.points,item.color,item.alpha,item.weight,item.closed,item.fill));
    if(interior>.01)drawInterior(interior);
    line([[-1.45,-.57,-2.5],[-1.45,-.57,2.5]],'#afc2b6',.3,.6);
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
    stage.dataset.door=view[3].toFixed(3);stage.dataset.hood=view[4].toFixed(3);
    stage.dataset.camera=view.slice(0,3).map(n=>n.toFixed(4)).join(',');
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
