// Camada 3D (Three.js) do estúdio: municípios extrudados, tornado, temporal, chuva, vento, raio, enchente, casas, apagão.
// Render determinístico por tempo: nada de requestAnimationFrame. A câmera imita o perspective(1100px)+rotateX+rotateZ do CSS,
// então o mapa SVG (embaixo) e os blocos 3D (em cima) ficam alinhados. Unidades dos objetos = pixels da tela de 720x1280.
(function(){
const T3=window.THREE;
if(!T3){window.C3D={ok:false};return;}
const C={ink:0x141414,hl:0xffd400,gray:0x8e8e8e,dark:0x474747,mid:0x6c6c6c,light:0xddd8ca,white:0xfbf8ef,red:0xe0343f,water:0x9db2b4,leaf:0xa3ae93,wall:0xf3eee0,roofDk:0x4a4a4e};
const mat=(c,o={})=>new T3.MeshStandardMaterial({color:c,roughness:1,metalness:0,flatShading:true,...o});
const basic=(c,o={})=>new T3.MeshBasicMaterial({color:c,...o});
const rnd=(n)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}; // pseudo-aleatório determinístico
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const outBack=(x,c=1.4)=>{x=cl(x);return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
let R,scene,tilt,world,cam,CYv=600,hemi,sun,dim=0,fl=0;
const geoCache=new Map();

function anelDe(d){
  const out=[];let cur=null;
  for(const t of d.match(/[MLZ]|-?[\d.]+(?:e-?\d+)?,-?[\d.]+(?:e-?\d+)?/g)||[]){
    if(t==='M'){cur=[];out.push(cur);}else if(t!=='L'&&t!=='Z'){const [x,y]=t.split(',');cur.push([+x,+y]);}
  }
  return out.filter(r=>r.length>2);
}
const area=(r)=>{let a=0;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length];a+=p[0]*q[1]-q[0]*p[1];}return a/2;};
function geo(d){
  if(geoCache.has(d))return geoCache.get(d);
  const rs=anelDe(d);if(!rs.length){geoCache.set(d,null);return null;}
  const ref=Math.sign(rs.reduce((b,r)=>Math.abs(area(r))>Math.abs(b)?area(r):b,0));
  const shapes=[];
  for(const r of rs){
    const pts=r.map(p=>new T3.Vector2(p[0],-p[1]));
    if(Math.sign(area(r))===ref||!shapes.length)shapes.push(new T3.Shape(pts));
    else shapes.at(-1).holes.push(new T3.Path(pts));
  }
  const g=new T3.ExtrudeGeometry(shapes,{depth:1,bevelEnabled:false,curveSegments:1});
  geoCache.set(d,g);return g;
}

function init(CY){
  const cv=document.getElementById('c3d');
  try{R=new T3.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});}catch(e){console.warn('sem WebGL');C3D.ok=false;return false;}
  R.setPixelRatio(window.devicePixelRatio||1);R.setSize(720,1280,false);R.setClearColor(0x000000,0);
  R.shadowMap.enabled=true;R.shadowMap.type=T3.PCFSoftShadowMap;
  scene=new T3.Scene();
  cam=new T3.PerspectiveCamera(2*Math.atan(640/1100)*180/Math.PI,720/1280,10,6000);cam.position.set(0,0,1100);
  tilt=new T3.Group();scene.add(tilt);world=new T3.Group();tilt.add(world);
  hemi=new T3.HemisphereLight(0xfff6e0,0x9a9486,1.05);scene.add(hemi);
  sun=new T3.DirectionalLight(0xffffff,1.9);sun.position.set(-260,-180,520);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-720;sc.right=720;sc.top=900;sc.bottom=-900;sc.near=50;sc.far=1800;sun.shadow.radius=4;sun.shadow.bias=-.0006;
  tilt.add(sun);tilt.add(sun.target);
  const gnd=new T3.Mesh(new T3.PlaneGeometry(3600,5200),new T3.ShadowMaterial({opacity:.22}));gnd.position.z=.2;gnd.receiveShadow=true;tilt.add(gnd);
  C3D.ok=true;setCY(CY);return true;
}
function setCY(v){CYv=v;if(cam){cam.setViewOffset(720,1280,0,640-v,720,1280);cam.updateMatrixWorld(true);}}

// posiciona o mundo conforme a câmera do mapa (cx,cy em coords da cena, s zoom) e o tilt/orbit
function quadro(c,zp,rx,rz){
  dim=0;fl=0;
  const d=Math.PI/180;
  tilt.position.set(zp.dx,-zp.dy,0);tilt.scale.set(1+zp.z,1+zp.z,1+zp.z);
  tilt.rotation.order='XYZ';tilt.rotation.set(-rx*d,0,-rz*d);
  world.scale.set(c.s,c.s,1);world.position.set(-c.cx*c.s,c.cy*c.s,0);
  tilt.updateMatrixWorld(true);
}
// ponto da cena (sx,sy) + altura em px -> pixels da tela
const _v=new T3.Vector3();
function projeta(sx,sy,z){
  _v.set(sx,-sy,z);world.localToWorld(_v);_v.project(cam);
  return [(_v.x+1)/2*720,(1-_v.y)/2*1280];
}

// ---- blocos extrudados (municípios) ----
function bloco(m,cor,arestas){
  const g=geo(m.d);if(!g)return null;
  const mesh=new T3.Mesh(g,mat(cor));mesh.castShadow=mesh.receiveShadow=true;mesh.visible=false;
  if(arestas){const e=new T3.LineSegments(new T3.EdgesGeometry(g,30),new T3.LineBasicMaterial({color:C.ink}));mesh.add(e);}
  world.add(mesh);
  return {mesh,set(h){this.mesh.visible=h>.05;this.mesh.scale.z=Math.max(.01,h);}};
}
const nulo={set(){}};
const dest=(m,cor)=>bloco(m,new T3.Color(cor),true)||nulo;
const fillBloco=(m,cor)=>bloco(m,new T3.Color(cor),false)||nulo;

// ---- peças ----
function nuvem(r,cor,seed,suave=true){
  const g=new T3.Group();const m=mat(cor,{flatShading:!suave});
  for(let i=0;i<6;i++){
    const s=r*(.45+rnd(seed+i)*.35);
    const b=new T3.Mesh(new T3.IcosahedronGeometry(s,suave?3:1),m);
    b.position.set((rnd(seed+i*3)-.5)*r*1.5,(rnd(seed+i*5)-.5)*r*1.1,(rnd(seed+i*7)-.5)*r*.35);b.scale.z=.7;b.castShadow=true;g.add(b);
  }
  return g;
}
function casa(w,d,h,cor,telhado=true,seed=1){
  const g=new T3.Group();
  const b=new T3.Mesh(new T3.BoxGeometry(w,d,h),mat(cor));b.position.z=h/2;b.castShadow=b.receiveShadow=true;g.add(b);
  const jm=basic(C.hl),jw=Math.max(2.4,w*.2),jh=Math.max(3,h*.32);
  [-.22,.22].forEach(k=>{const j=new T3.Mesh(new T3.BoxGeometry(jw,.8,jh),jm);j.position.set(w*k,-d/2-.3,h*.52);g.add(j);});
  const j2=new T3.Mesh(new T3.BoxGeometry(.8,jw,jh),jm);j2.position.set(w/2+.3,0,h*.52);g.add(j2);
  let roof=null;
  if(telhado){
    roof=new T3.Mesh(new T3.ConeGeometry(Math.hypot(w,d)*.56,h*.42,4),mat(C.roofDk));roof.rotation.x=Math.PI/2;roof.rotation.y=Math.PI/4;
    roof.position.z=h+h*.21;roof.castShadow=true;g.add(roof);
  }
  return {g,roof};
}
function arvore(h,seed){
  const g=new T3.Group();
  const t=new T3.Mesh(new T3.CylinderGeometry(1.4,2,h*.45,6),mat(0x7a6a55));t.rotation.x=Math.PI/2;t.position.z=h*.22;g.add(t);
  const lm=mat(0x7fa467,{flatShading:false});
  [[0,0,.62,.36],[h*.12,h*.05,.5,.22],[-h*.1,-h*.04,.46,.2]].forEach(c=>{const s=new T3.Mesh(new T3.IcosahedronGeometry(h*c[3],2),lm);s.position.set(c[0],c[1],h*c[2]);s.castShadow=true;g.add(s);});
  return g;
}
function predio(w,d,h,cor){
  const g=new T3.Group();const b=new T3.Mesh(new T3.BoxGeometry(w,d,h),mat(cor));b.position.z=h/2;b.castShadow=true;g.add(b);
  const wm=basic(C.hl);
  for(let k=0;k<Math.floor((h-8)/10);k++){
    const f=new T3.Mesh(new T3.BoxGeometry(w*.78,.8,4),wm);f.position.set(0,-d/2-.3,10+k*10);g.add(f);
    const f2=new T3.Mesh(new T3.BoxGeometry(.8,d*.78,4),wm);f2.position.set(w/2+.3,0,10+k*10);g.add(f2);
  }
  const t=new T3.Mesh(new T3.BoxGeometry(w*1.04,d*1.04,2),mat(C.roofDk));t.position.z=h+1;g.add(t);
  return g;
}
function seg(mesh,a,b){ // caixa fina entre dois pontos
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,L=Math.hypot(dx,dy,dz)||.01;
  mesh.position.set((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);mesh.scale.set(1,1,L);
  mesh.lookAt(b.x,b.y,b.z);
}
const BOLT=.42;const boltPh=(t)=>(t*BOLT)%1;
function raio(g,alt,x,seed){
  const segs=[],pts=[];let x0=x,y0=0;
  for(let i=0;i<=8;i++){pts.push(new T3.Vector3(x0,y0,alt*(1-i/8)));x0+=(rnd(seed+i)-.5)*34;y0+=(rnd(seed+i*2)-.5)*14;}
  const mm=basic(C.hl);
  for(let i=0;i<8;i++){const b=new T3.Mesh(new T3.BoxGeometry(7,7,1),mm);seg(b,pts[i],pts[i+1]);g.add(b);segs.push(b);}
  return segs;
}
function chuvaLinhas(n,w,h,cor){
  const geom=new T3.BufferGeometry();geom.setAttribute('position',new T3.BufferAttribute(new Float32Array(n*6),3));
  const l=new T3.LineSegments(geom,new T3.LineBasicMaterial({color:cor,transparent:true,opacity:.85}));l.frustumCulled=false;
  l.userData={n,w,h};
  l.upd=(t,vel=260)=>{const p=geom.attributes.position.array;
    for(let i=0;i<n;i++){const x=(rnd(i)-.5)*w,y=(rnd(i+500)-.5)*w*.7,ph=(t*vel/h+rnd(i+900))%1,z=h*(1-ph);
      p.set([x,y,z,x-3,y,z+14],i*6);}
    geom.attributes.position.needsUpdate=true;};
  return l;
}

// ---- ilustrações ----
const FAB={
  tornado(){
    const g=new T3.Group(),fun=new T3.Group();fun.rotation.x=Math.PI/2;g.add(fun);
    const N=18,RS=18,layers=[];
    const claro=new T3.Color(0xcfcbc2),escuro=new T3.Color(0x7d7a75);
    for(let i=0;i<N;i++){
      const f0=i/N,f1=(i+1)/N,r0=7+Math.pow(f0,1.55)*78,r1=7+Math.pow(f1,1.55)*78;
      const gm=new T3.CylinderGeometry(r1,r0,17.6,RS,1,true);
      const col=[];const pos=gm.attributes.position;
      for(let v=0;v<pos.count;v++){const c=(v%(RS+1))%2?claro:escuro;col.push(c.r,c.g,c.b);}
      gm.setAttribute('color',new T3.Float32BufferAttribute(col,3));
      const m=new T3.Mesh(gm,new T3.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T3.DoubleSide}));
      m.castShadow=true;fun.add(m);layers.push(m);
    }
    const topo=new T3.Group();topo.position.z=292;g.add(topo);
    [[0,0,52,0xb9b6b0],[-52,22,42,0xa7a49e],[50,-18,44,0xc2bfb8],[12,52,36,0xaeaba5],[-24,-46,38,0xb3b0aa],[58,34,30,0xc8c5be]].forEach((c,k)=>{const n=nuvem(c[2],c[3],k*9);n.position.set(c[0],c[1],k%2*8);topo.add(n);});
    const det=[];const dm=[mat(C.ink),mat(0x6e6e6e),mat(0x2b2b2b),mat(0xd6d0bf)];
    for(let i=0;i<44;i++){const b=new T3.Mesh(new T3.BoxGeometry(3+rnd(i)*6,2.5+rnd(i+3)*4,2+rnd(i+6)*3),dm[i%4]);b.castShadow=true;g.add(b);det.push(b);}
    const poeira=new T3.Mesh(new T3.RingGeometry(12,78,32),new T3.MeshBasicMaterial({color:0xa79f8e,transparent:true,opacity:.4,side:T3.DoubleSide}));poeira.position.z=1;g.add(poeira);
    const upd=(a,t)=>{
      layers.forEach((m,i)=>{const f=i/N;m.position.y=i*16.4+8;m.position.x=Math.sin(t*2.1+i*.45)*(2+f*18)+Math.sin(t*.7)*f*12;m.position.z=Math.cos(t*1.7+i*.5)*(2+f*12);m.rotation.y=t*(4.5-f*2)+i*.5;});
      topo.rotation.z=t*.4;
      det.forEach((b,i)=>{const h=(t*.3+i*.173)%1,ang=t*(3+i%3)+i*1.7,rad=12+Math.pow(h,1.25)*105*(.55+rnd(i)*.7);
        b.position.set(Math.cos(ang)*rad+Math.sin(t*.7)*h*12,Math.sin(ang)*rad,5+h*280);b.rotation.set(t*4+i,t*3+i*2,t*5);});
      poeira.scale.setScalar(1+.08*Math.sin(t*3));
    };
    return {g,upd,cenario:'bairro'};
  },
  temporal(){
    const g=new T3.Group();const nu=[];
    [[-85,-20,50,0x6a6a70],[5,8,60,0x56565c],[92,-22,46,0x707076],[-28,44,44,0x5f5f65],[54,50,40,0x66666c]].forEach((c,k)=>{const n=nuvem(c[2],c[3],k*5+2);n.position.set(c[0],c[1],250+k%3*10);g.add(n);nu.push(n);});
    const ch=chuvaLinhas(300,300,250,0x3a3a3e);g.add(ch);
    const bolts=[raio(g,240,-40,3),raio(g,240,70,11)];
    const upd=(a,t)=>{
      nu.forEach((n,k)=>{n.rotation.z=Math.sin(t*.6+k)*.18;n.position.y=Math.sin(t*.8+k*2)*14;});
      ch.upd(t);
      const ph=boltPh(t),on=ph<.09,bi=Math.floor(t*BOLT)%2;
      bolts.forEach((bs,k)=>bs.forEach(b=>b.visible=on&&k===bi&&(Math.floor(ph*60)%3!==1)));
    };
    return {g,upd,cenario:'cidade',dim:()=>.25,flash:(t)=>{const ph=boltPh(t);return ph<.2?Math.max(0,1-ph/.2)*(Math.floor(ph*60)%3!==1?1:.5):0;}};
  },
  chuva(){
    const g=new T3.Group();const nu=[];
    [[-70,0,74,0x6a6a6a],[30,12,88,0x5a5a5a],[100,-10,64,0x6f6f6f]].forEach((c,k)=>{const n=nuvem(c[2],c[3],k*7+1);n.position.set(c[0],c[1],230);g.add(n);nu.push(n);});
    const ch=chuvaLinhas(210,320,230,0x4f4f4f);g.add(ch);
    const poca=new T3.Mesh(new T3.CircleGeometry(60,24),new T3.MeshBasicMaterial({color:C.water,transparent:true,opacity:.6}));poca.position.z=.8;g.add(poca);
    const upd=(a,t)=>{ch.upd(t,300);nu.forEach((n,k)=>n.position.y=Math.sin(t+k*2)*10);poca.scale.setScalar(.8+.2*Math.sin(t*2));};
    return {g,upd,cenario:'cidade'};
  },
  vento(){
    const g=new T3.Group();const setas=[];
    const curva=new T3.CatmullRomCurve3([[-70,0,0],[-35,14,0],[0,-10,0],[35,12,0],[70,0,0]].map(p=>new T3.Vector3(...p)));
    for(let i=0;i<4;i++){
      const s=new T3.Group();
      const tubo=new T3.Mesh(new T3.TubeGeometry(curva,24,3.2,6,false),mat(C.hl));tubo.castShadow=true;s.add(tubo);
      const cab=new T3.Mesh(new T3.ConeGeometry(10,22,6),mat(C.hl));cab.rotation.z=-Math.PI/2;cab.position.set(80,0,0);s.add(cab);
      const borda=new T3.Mesh(new T3.TubeGeometry(curva,24,4.4,6,false),mat(C.ink));borda.position.z=-.5;s.add(borda);
      s.position.z=60+i*34;s.userData.i=i;g.add(s);setas.push(s);
    }
    const arv=[[-110,70],[100,-60],[-90,-70]].map((p,k)=>{const a=arvore(48,k);a.position.set(p[0],p[1],0);g.add(a);return a;});
    const upd=(a,t)=>{
      setas.forEach((s,i)=>{const f=((t*.4+i*.27)%1);s.position.x=-200+f*400;s.position.y=-60+i*38+Math.sin(t*3+i)*6;const v=Math.sin(f*Math.PI);s.scale.setScalar(.7+.5*v);
        s.children.forEach(c=>{if(c.material&&c.material.transparent!==undefined){c.material.transparent=true;c.material.opacity=Math.min(1,v*2);}});});
      arv.forEach((a,k)=>{a.rotation.y=Math.sin(t*5+k)*.18+.12;});
    };
    return {g,upd,cenario:'campo'};
  },
  raio(){
    const g=new T3.Group();const n=nuvem(90,0x3a3a3a,4);n.position.z=250;g.add(n);
    const bolts=[raio(g,250,0,21),raio(g,250,20,34),raio(g,250,-20,47)];
    const anel=new T3.Mesh(new T3.RingGeometry(8,12,32),new T3.MeshBasicMaterial({color:C.hl,transparent:true,side:T3.DoubleSide}));anel.position.z=1.5;g.add(anel);
    const upd=(a,t)=>{const ph=boltPh(t),on=ph<.12;
      bolts.forEach((bs,i)=>bs.forEach(b=>b.visible=on&&(i===Math.floor(t*BOLT)%3)));
      anel.visible=on;anel.scale.setScalar(1+ph*14);anel.material.opacity=1-ph/.12;n.rotation.z=Math.sin(t*.8)*.1;};
    return {g,upd,cenario:'campo',dim:()=>.3,flash:(t)=>{const ph=boltPh(t);return ph<.2?Math.max(0,1-ph/.2):0;}};
  },
  enchente(){
    const g=new T3.Group();
    const pl=new T3.PlaneGeometry(300,230,30,22);
    const agua=new T3.Mesh(pl,new T3.MeshStandardMaterial({color:C.water,roughness:.35,metalness:.1,transparent:true,opacity:.82,flatShading:true}));agua.receiveShadow=true;g.add(agua);
    const base=pl.attributes.position.array.slice();
    const rip=[0,1,2].map(i=>{const r=new T3.Mesh(new T3.RingGeometry(10,12,24),new T3.MeshBasicMaterial({color:0xffffff,transparent:true,side:T3.DoubleSide}));g.add(r);return r;});
    const upd=(a,t)=>{
      const nivel=6+Math.min(a,3)/3*20;agua.position.z=nivel;
      const p=pl.attributes.position.array;for(let i=0;i<p.length;i+=3)p[i+2]=Math.sin(base[i]*.06+t*3)*2.2+Math.cos(base[i+1]*.08+t*2.4)*1.8;
      pl.attributes.position.needsUpdate=true;pl.computeVertexNormals();
      rip.forEach((r,i)=>{const f=((t*.5+i/3)%1);r.position.set(Math.sin(i*2.1)*70,Math.cos(i*1.7)*50,nivel+3);r.scale.setScalar(.5+f*3);r.material.opacity=.7*(1-f);});
    };
    return {g,upd,cenario:'casas_baixas'};
  },
  casas_destelhadas(){
    const g=new T3.Group();const cs=[];const tel=[];
    const cfg=[[-70,30,36,30,26,C.wall,false],[0,40,40,32,28,0xe9e2cf,true],[72,26,34,30,24,C.wall,false],[-36,-40,38,30,25,0xe9e2cf,true],[40,-44,36,30,26,C.wall,false]];
    cfg.forEach((c,i)=>{const h=casa(c[2],c[3],c[4],c[5],c[6],i);h.g.position.set(c[0],c[1],0);g.add(h.g);cs.push(h);
      if(!c[6]){for(let k=0;k<5;k++){const t=new T3.Mesh(new T3.BoxGeometry(14,10,1.6),mat(C.roofDk));t.castShadow=true;t.userData={i,k,h:c[4],x:c[0],y:c[1]};g.add(t);tel.push(t);}
        const rest=new T3.Mesh(new T3.BoxGeometry(c[2]*.95,c[3]*.95,2),mat(0x8a8272));rest.position.set(c[0],c[1],c[4]+1);g.add(rest);} });
    [[-110,-20],[112,-6],[0,-80]].forEach((p,k)=>{const a=arvore(46,k);a.position.set(p[0],p[1],0);g.add(a);});
    const upd=(a,t)=>{tel.forEach(m=>{const u=m.userData,f=((t*.33+u.k*.19+u.i*.11)%1);const ang=t*3+u.k*1.3;
      m.position.set(u.x+Math.cos(ang)*(10+f*60),u.y+Math.sin(ang)*(10+f*60),u.h+f*130);m.rotation.set(t*4+u.k,t*5,t*3+u.i);m.scale.setScalar(1-Math.max(0,f-.8)*4);});};
    return {g,upd,cenario:'vazio'};
  },
  apagao(){
    const g=new T3.Group();
    const postes=[[-80,0],[80,0]].map(p=>{
      const s=new T3.Group();const f=new T3.Mesh(new T3.CylinderGeometry(2.6,3.4,130,8),mat(C.ink));f.rotation.x=Math.PI/2;f.position.z=65;f.castShadow=true;s.add(f);
      const b=new T3.Mesh(new T3.BoxGeometry(70,4,4),mat(C.ink));b.position.z=120;b.castShadow=true;s.add(b);
      s.position.set(p[0],p[1],0);g.add(s);return s;});
    const fios=[-28,0,28].map(dx=>{const pts=[];for(let i=0;i<=16;i++){const f=i/16;pts.push(new T3.Vector3(-80+160*f+0,dx*.02,120-Math.sin(f*Math.PI)*16));}
      const ln=new T3.Line(new T3.BufferGeometry().setFromPoints(pts),new T3.LineBasicMaterial({color:C.ink}));ln.position.y=dx*.12;g.add(ln);return ln;});
    const luzes=[];
    [[-30,-50],[30,-56],[-0,-70]].forEach((p,k)=>{const h=casa(30,26,24,C.wall,true,k);h.g.position.set(p[0],p[1],0);g.add(h.g);
      const j=new T3.Mesh(new T3.BoxGeometry(7,1,7),basic(C.hl));j.position.set(p[0]-5,p[1]-13.4,14);g.add(j);luzes.push(j);});
    const fag=[];for(let i=0;i<14;i++){const b=new T3.Mesh(new T3.BoxGeometry(2.4,2.4,2.4),basic(C.hl));g.add(b);fag.push(b);}
    const upd=(a,t)=>{
      luzes.forEach((j,k)=>{j.visible=a<1.0+k*.25&&Math.sin(t*14+k*3)>-.3;});
      fag.forEach((b,i)=>{const f=((t*1.7+i*.31)%1),on=Math.sin(t*20+i)>-.2&&((Math.floor(t*3))%2===0||i<5);
        b.visible=on;b.position.set(-80+Math.cos(i*2)*f*26,Math.sin(i*3)*f*14,120-f*50);});
    };
    return {g,upd,cenario:'vazio',dim:(a)=>cl((a-.5)/1.0)*.9};
  },
  aeroporto(){
    const g=new T3.Group();
    const pista=new T3.Mesh(new T3.BoxGeometry(260,36,2),mat(0x4b4b4f));pista.position.z=1;pista.receiveShadow=true;g.add(pista);
    for(let i=-5;i<=5;i++){const f=new T3.Mesh(new T3.BoxGeometry(14,3,2.2),basic(C.hl));f.position.set(i*22,0,1.2);g.add(f);}
    const term=new T3.Mesh(new T3.BoxGeometry(120,34,20),mat(C.white));term.position.set(-10,-52,10);term.castShadow=true;g.add(term);
    const topo=new T3.Mesh(new T3.BoxGeometry(124,36,4),mat(C.roofDk));topo.position.set(-10,-52,22);g.add(topo);
    const torre=new T3.Mesh(new T3.CylinderGeometry(6,8,54,8),mat(C.light));torre.rotation.x=Math.PI/2;torre.position.set(70,-56,27);torre.castShadow=true;g.add(torre);
    const cab=new T3.Mesh(new T3.CylinderGeometry(12,9,10,8),mat(C.ink));cab.rotation.x=Math.PI/2;cab.position.set(70,-56,58);g.add(cab);
    const av=new T3.Group();const fus=new T3.Mesh(new T3.ConeGeometry(5,34,8),mat(C.white));fus.rotation.z=-Math.PI/2;av.add(fus);
    const asa=new T3.Mesh(new T3.BoxGeometry(10,46,1.6),mat(C.light));av.add(asa);av.traverse(o=>o.castShadow=true);g.add(av);
    const bl=[];for(let i=0;i<22;i++){const b=new T3.Mesh(new T3.BoxGeometry(5+rnd(i)*9,4+rnd(i+2)*6,3+rnd(i+4)*4),mat(i%3?C.mid:C.ink));b.castShadow=true;g.add(b);bl.push(b);}
    const upd=(a,t)=>{
      const f=((t*.22)%1);av.position.set(-150+f*300,-8*Math.sin(f*6),8+Math.sin(f*Math.PI)*34);av.rotation.set(0,-.2,Math.sin(t*4)*.05);
      bl.forEach((b,i)=>{const h=(t*.35+i*.21)%1,ang=i*1.9+t*2.5,r=14+h*70;b.position.set(-30+Math.cos(ang)*r+i*4,Math.sin(ang)*r*.6,4+h*90);b.rotation.set(t*4+i,t*3,t*2+i);});
    };
    return {g,upd,cenario:'vazio'};
  },
  icones_seguranca(){
    const g=new T3.Group();const xs=[];
    const X=(x,y)=>{const o=new T3.Group();const m=basic(C.red);
      [1,-1].forEach(sg=>{const b=new T3.Mesh(new T3.BoxGeometry(5,5,60),m);b.rotation.y=sg*Math.PI/4;b.position.z=0;o.add(b);});
      o.rotation.x=Math.PI/2;o.position.set(x,y,38);g.add(o);xs.push(o);};
    const arv=arvore(70,3);arv.position.set(-105,0,0);g.add(arv);
    const poste=new T3.Group();const pf=new T3.Mesh(new T3.CylinderGeometry(3,4,92,8),mat(C.ink));pf.rotation.x=Math.PI/2;pf.position.z=46;poste.add(pf);
    const pb=new T3.Mesh(new T3.BoxGeometry(34,4,4),mat(C.ink));pb.position.z=84;poste.add(pb);poste.position.set(-35,0,0);poste.traverse(o=>o.castShadow=true);g.add(poste);
    const tom=new T3.Group();const tb=new T3.Mesh(new T3.BoxGeometry(36,20,52),mat(C.white));tb.position.z=26;tom.add(tb);
    [-8,8].forEach(x=>{const p=new T3.Mesh(new T3.BoxGeometry(4,6,16),mat(C.ink));p.position.set(x,-12,30);tom.add(p);});
    tom.position.set(35,0,0);tom.traverse(o=>o.castShadow=true);g.add(tom);
    const cv=document.createElement('canvas');cv.width=128;cv.height=200;const cx=cv.getContext('2d');cx.fillStyle='#ffd400';cx.fillRect(0,0,128,200);cx.fillStyle='#141414';cx.font='96px Titulo, Anton, sans-serif';cx.textAlign='center';cx.fillText('199',64,130);cx.font='bold 16px monospace';cx.fillText('DEFESA CIVIL',64,170);
    const tex=new T3.CanvasTexture(cv);const cel=new T3.Group();const cb=new T3.Mesh(new T3.BoxGeometry(28,6,52),mat(C.ink));cb.position.z=26;cel.add(cb);
    const tela=new T3.Mesh(new T3.PlaneGeometry(24,46),new T3.MeshBasicMaterial({map:tex}));tela.rotation.x=Math.PI/2;tela.position.set(0,-3.2,26);cel.add(tela);
    cel.position.set(105,0,0);cel.traverse(o=>o.castShadow=true);g.add(cel);
    [-105,-35,35].forEach(x=>X(x,-18));
    const upd=(a,t)=>{xs.forEach((o,i)=>{const k=cl((a-.7-i*.35)/.3);o.scale.setScalar(Math.max(.001,k));o.visible=k>0;});cel.rotation.z=Math.sin(t*2)*.12;tom.rotation.z=Math.sin(t*1.6)*.08;};
    return {g,upd,cenario:'vazio'};
  },
};
// cenário de maquete ao redor (casas, árvores, prédios) para dar contexto
function cenario(tipo,seed){
  const g=new T3.Group();
  if(tipo==='bairro'){
    for(let gx=-6;gx<=6;gx++)for(let gy=-5;gy<=5;gy++){
      const x=gx*25+(rnd(gx*7+gy)-.5)*6,y=gy*25+(rnd(gy*5+gx*3)-.5)*6;
      if(Math.hypot(x,y)<44||rnd(gx*13+gy*17)<.18)continue;
      const w=13+rnd(gx+gy*9)*5;const h=casa(w,w*.85,13+rnd(gx*3+gy)*6,C.white,true,gx+gy);
      h.g.position.set(x,y,0);h.g.rotation.z=Math.floor(rnd(gx*11+gy)*4)*Math.PI/2;g.add(h.g);
      if(rnd(gx*19+gy*23)<.22){const a=arvore(26,gx);a.position.set(x+11,y+9,0);g.add(a);}
    }
  }
  if(tipo==='campo'){[[-130,-40],[120,50],[-100,90],[140,-70],[-150,40]].forEach((p,k)=>{const a=arvore(40+rnd(seed+k)*18,k);a.position.set(p[0],p[1],0);g.add(a);});
    [[-120,-90],[110,-100]].forEach((p,k)=>{const h=casa(30,26,22,C.wall,true,k);h.g.position.set(p[0],p[1],0);g.add(h.g);});}
  if(tipo==='cidade'){
    for(let gx=-6;gx<=6;gx++)for(let gy=-5;gy<=5;gy++){
      const x=gx*26+(rnd(gx*7+gy)-.5)*5,y=gy*26+(rnd(gy*5+gx*3)-.5)*5;
      if(rnd(gx*13+gy*17)<.12)continue;
      const central=Math.abs(gx)<=2&&Math.abs(gy)<=1;
      if(central){const w=15+rnd(gx+gy*9)*6,hh=46+rnd(gx*3+gy*11)*52;const p=predio(w,w*.9,hh,rnd(gx+gy)<.5?C.white:C.light);p.position.set(x,y,0);g.add(p);}
      else{const w=14+rnd(gx+gy*9)*5;const h=casa(w,w*.85,13+rnd(gx*3+gy)*6,C.white,true,gx+gy);h.g.position.set(x,y,0);h.g.rotation.z=Math.floor(rnd(gx*11+gy)*4)*Math.PI/2;g.add(h.g);
        if(rnd(gx*19+gy*23)<.14){const a=arvore(26,gx);a.position.set(x+11,y+9,0);g.add(a);}}
    }
  }
  if(tipo==='cidade_antiga'){[[-120,-60,30,28,70],[0,-80,26,26,48],[120,-50,32,30,86],[-60,80,28,26,56],[80,76,28,28,64]].forEach((p,k)=>{const b=predio(p[2],p[3],p[4],k%2?0xe9e2cf:C.light);b.position.set(p[0],p[1],0);g.add(b);});}
  if(tipo==='casas_baixas'){[[-100,-60],[10,-80],[100,-40],[-80,60],[70,70]].forEach((p,k)=>{const h=casa(32,28,24,C.wall,true,k);h.g.position.set(p[0],p[1],0);g.add(h.g);});}
  return g;
}

const ilus=(tipo,m,semCenario)=>{
  const f=FAB[tipo];if(!f)return null;
  const anchor=new T3.Group();anchor.position.set(m.cx,-m.cy,0);anchor.visible=false;world.add(anchor);
  const inner=new T3.Group();anchor.add(inner);
  const o=f();inner.add(o.g);
  let cen=null;if(!semCenario&&o.cenario&&o.cenario!=='vazio'){cen=cenario(o.cenario,m.cx);inner.add(cen);}
  return {
    // a = segundos desde a entrada, t = tempo absoluto, s = zoom do mapa, sai = 0..1 (saída)
    set(a,t,s,sai,esc=1){
      const vis=a>=0&&sai>.01;anchor.visible=vis;if(!vis)return;
      const k=outBack(a/.7,1.5)*sai;anchor.scale.set(esc/s,esc/s,esc);
      inner.scale.set(1,1,1);o.g.scale.set(k,k,k);if(cen)cen.scale.set(cl(a/.5),cl(a/.5),cl(a/.5));
      o.upd(a,t);if(o.dim)dim=Math.max(dim,o.dim(a));if(o.flash)fl=Math.max(fl,o.flash(t));
    }
  };
};

function render(){hemi.intensity=1.05*(1-.62*dim)+.9*fl;sun.intensity=1.9*(1-.75*dim)+1.2*fl;R.render(scene,cam);}
window.C3D={ok:false,BOLT,flashAmt:()=>fl,init,setCY,quadro,projeta,dest,fillBloco,ilus,render,tipos:Object.keys(FAB)};
})();
