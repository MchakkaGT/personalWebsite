/* Gallardo by machman_3d, from the three.js example asset collection. See models/gallardo/README.md. */
import * as THREE from './vendor/three.module.js';
export async function createGallardo(canvas) {
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(30,1,.1,100);
  const car=new THREE.Group();scene.add(car);
  const pivots={body:car};
  for(const [name,origin] of Object.entries({door:[.88,.05,.81],hood:[0,.24,1.32],trunk:[0,.38,-.79]})){
    const group=new THREE.Group();group.position.fromArray(origin);car.add(group);pivots[name]=group;
  }
  const base=new URL('../models/gallardo/',import.meta.url);
  const [meta,buffer]=await Promise.all([
    fetch(new URL('gallardo.json',base)).then(r=>{if(!r.ok)throw Error('Gallardo metadata unavailable');return r.json();}),
    fetch(new URL('gallardo.bin',base)).then(r=>{if(!r.ok)throw Error('Gallardo geometry unavailable');return r.arrayBuffer();})
  ]);
  const ink=new THREE.LineBasicMaterial({color:0x46544d,transparent:true,opacity:.85});
  ink.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\ngl_Position.z -= 0.000015 * gl_Position.w;');};
  const outline=new THREE.MeshBasicMaterial({color:0x46544d,side:THREE.BackSide,polygonOffset:true,polygonOffsetFactor:2,polygonOffsetUnits:2});
  outline.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed += normal * 0.006;');
  };
  const materials={};
  function material(part,id){
    const key=part+id;
    if(!materials[key]){
      const color=part==='wheel'?(id===0?0xeeeae1:0xe3e3da):({0:0xf6f3eb,1:0xd8ded5,2:0xe3e9e4,3:0xf6f3eb,4:0xe9eee8,5:0xf4efe1,6:0xe8b5aa}[id]||0xf6f3eb);
      materials[key]=new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide});
    }
    return materials[key];
  }
  const fittingPoints=[];
  function attach(geometry,parent,part,id){
    const positions=geometry.getAttribute('position');
    for(let i=0;i<positions.count;i+=4)fittingPoints.push({parent,point:new THREE.Vector3().fromBufferAttribute(positions,i)});
    geometry.computeVertexNormals();
    const mesh=new THREE.Mesh(geometry,material(part,id));parent.add(mesh);
    const shell=new THREE.Mesh(geometry,outline);parent.add(shell);
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,32),ink);parent.add(edges);
  }
  const wheelCenter=new THREE.Vector3(69.2201/80,-21.715/80,106.08865/80);
  for(const g of meta.groups){
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(buffer,g.positionOffset,g.vertices*3).slice(),3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer,g.indexOffset,g.indices),1));
    if(g.part==='wheel'){
      geometry.translate(-wheelCenter.x,-wheelCenter.y,-wheelCenter.z);
      for(const side of [-1,1])for(const axle of [-1,1]){
        const group=new THREE.Group();group.position.set(side*wheelCenter.x,wheelCenter.y,axle===1?wheelCenter.z:-wheelCenter.z-22.5/80);
        if(side===-1)group.rotation.z=Math.PI;
        car.add(group);attach(geometry,group,'wheel',g.material);
      }
    } else {
      const parent=pivots[g.part];if(parent!==car)geometry.translate(-parent.position.x,-parent.position.y,-parent.position.z);
      attach(geometry,parent,g.part,g.material);
    }
  }
  // Gallardo mirror housings and short stalks, kept with the opening door.
  for(const side of [-1,1]){
    const parent=side===1?pivots.door:car;
    const shape=new THREE.Shape();
    shape.moveTo(.94,.24);shape.lineTo(1.02,.33);shape.quadraticCurveTo(1.18,.36,1.23,.29);
    shape.lineTo(1.20,.23);shape.lineTo(1.02,.21);shape.closePath();
    const housing=new THREE.ExtrudeGeometry(shape,{depth:.19,bevelEnabled:true,bevelSize:.015,bevelThickness:.012,bevelSegments:2,steps:1,curveSegments:6});
    housing.translate(0,0,.63);housing.scale(side,1,1);
    if(parent!==car)housing.translate(-parent.position.x,-parent.position.y,-parent.position.z);
    attach(housing,parent,'body',0);
    const stalk=new THREE.BoxGeometry(.14,.045,.065);stalk.translate(side*.95,.225,.72);
    if(parent!==car)stalk.translate(-parent.position.x,-parent.position.y,-parent.position.z);
    attach(stalk,parent,'body',0);
  }
  // Recess under the opening rear deck. The actual Gallardo stores luggage at the front.
  const well=new THREE.Mesh(new THREE.BoxGeometry(1,.18,1.28),new THREE.MeshBasicMaterial({color:0xcbd6cb}));
  well.position.set(0,.14,-1.53);car.add(well);
  const bounds=new THREE.Box3(),center=new THREE.Vector3(),size=new THREE.Vector3();
  let lastW=0,lastH=0;
  return {
    draw(view,w,h){
      pivots.door.rotation.y=-view[3];pivots.hood.rotation.x=-view[4];pivots.trunk.rotation.x=view[6];
      well.visible=view[6]>.02;
      if(lastW!==w||lastH!==h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();lastW=w;lastH=h;}
      car.updateMatrixWorld(true);bounds.setFromObject(car);bounds.getCenter(center);bounds.getSize(size);
      const yaw=view[0],pitch=view[1];
      const direction=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));
      camera.position.copy(center).addScaledVector(direction,12);camera.lookAt(center);camera.updateMatrixWorld(true);
      // Fit the articulated model using camera-space surface samples, preserving its aspect ratio on phones.
      let required=0;const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
      const inv=camera.matrixWorldInverse;
      const p=new THREE.Vector3();
      for(const sample of fittingPoints){
        p.copy(sample.point).applyMatrix4(sample.parent.matrixWorld).applyMatrix4(inv);const depth=p.z+12;
        required=Math.max(required,Math.abs(p.x)/(tan*camera.aspect)+depth,Math.abs(p.y)/tan+depth);
      }
      const distance=required*1.12/Math.min(view[2],1.02);
      camera.position.copy(center).addScaledVector(direction,distance);camera.lookAt(center);
      renderer.render(scene,camera);
    }
  };
}
