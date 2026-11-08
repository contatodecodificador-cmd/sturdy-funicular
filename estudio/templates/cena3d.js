// Camada 3D (Three.js) do estúdio: municípios extrudados, tornado, temporal, chuva, vento, raio, enchente, casas, apagão.
// Render determinístico por tempo: nada de requestAnimationFrame. A câmera imita o perspective(1100px)+rotateX+rotateZ do CSS,
// então o mapa SVG (embaixo) e os blocos 3D (em cima) ficam alinhados. Unidades dos objetos = pixels da tela de 720x1280.
(function(){
const T3=window.THREE;
if(!T3){window.C3D={ok:false};return;}
const C={ink:0x141414,hl:0xffd400,gray:0x8e8e8e,dark:0x474747,mid:0x6c6c6c,light:0xddd8ca,white:0xfbf8ef,red:0xe0343f,water:0x9db2b4,leaf:0xa3ae93,wall:0xf3eee0,roofDk:0x3a3a3a};
const mat=(c,o={})=>new T3.MeshStandardMaterial({color:c,roughness:1,metalness:0,flatShading:true,...o});
const basic=(c,o={})=>new T3.MeshBasicMaterial({color:c,...o});
const rnd=(n)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}; // pseudo-aleatório determinístico
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const outBack=(x,c=1.4)=>{x=cl(x);return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
let R,scene,tilt,world,cam,CYv=600;
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
  scene.add(new T3.HemisphereLight(0xfff6e0,0x9a9486,1.05));
  const sun=new T3.DirectionalLight(0xffffff,1.9);sun.position.set(-260,-180,520);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-720;sc.right=720;sc.top=900;sc.bottom=-900;sc.near=50;sc.far=1800;sun.shadow.radius=4;sun.shadow.bias=-.0006;
  tilt.add(sun);tilt.add(sun.target);
  const gnd=new T3.Mesh(new T3.PlaneGeometry(3600,5200),new T3.ShadowMaterial({opacity:.30}));gnd.position.z=.2;gnd.receiveShadow=true;tilt.add(gnd);
  C3D.ok=true;setCY(CY);return true;
}
function setCY(v){CYv=v;if(cam){cam.setViewOffset(720,1280,0,640-v,720,1280);}}

// posiciona o mundo conforme a câmera do mapa (cx,cy em coords da cena, s zoom) e o tilt/orbit
function quadro(c,zp,rx,rz){
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
function nuvem(r,cor,seed){
  const g=new T3.Group();const m=mat(cor);
  for(let i=0;i<6;i++){
    const s=r*(.45+rnd(seed+i)*.35);
    const b=new T3.Mesh(new T3.IcosahedronGeometry(s,1),m);
    b.position.set((rnd(seed+i*3)-.5)*r*1.5,(rnd(seed+i*5)-.5)*r*1.1,(rnd(seed+i*7)-.5)*r*.35);b.scale.z=.7;b.castShadow=true;g.add(b);
  }
  return g;
}
function casa(w,d,h,cor,telhado=true,seed=1){
  const g=new T3.Group();
  const b=new T3.Mesh(new T3.BoxGeometry(w,d,h),mat(cor));b.position.z=h/2;b.castShadow=b.receiveShadow=true;g.add(b);
  const jan=new T3.Mesh(new T3.BoxGeometry(w*.18,.6,h*.28),mat(C.ink));jan.position.set(-w*.2,-d/2-.2,h*.55);g.add(jan);
  const jan2=jan.clone();jan2.position.x=w*.2;g.add(jan2);
  let roof=null;
  if(telhado){
    roof=new T3.Mesh(new T3.ConeGeometry(Math.hypot(w,d)*.62,h*.55,4),mat(C.roofDk));roof.rotation.x=Math.PI/2;roof.rotation.y=Math.PI/4;roof.scale.set(1,1,1);
    roof.position.z=h+h*.27;roof.castShadow=true;g.add(roof);
  }
  return {g,roof};
}
function arvore(h,seed){
  const g=new T3.Group();
  const t=new T3.Mesh(new T3.CylinderGeometry(1.6,2.2,h*.4,6),mat(0x6b6558));t.rotation.x=Math.PI/2;t.position.z=h*.2;g.add(t);
  for(let i=0;i<2;i++){const c=new T3.Mesh(new T3.ConeGeometry(h*.3-i*3,h*.55,7),mat(C.leaf));c.rotation.x=Math.PI/2;c.position.z=h*.5+i*h*.22;c.castShadow=true;g.add(c);}
  return g;
}
function predio(w,d,h,cor){
  const g=new T3.Group();const b=new T3.Mesh(new T3.BoxGeometry(w,d,h),mat(cor));b.position.z=h/2;b.castShadow=true;g.add(b);
  const wm=mat(C.ink);for(let k=0;k<Math.floor(h/12);k++)for(let j=-1;j<=1;j+=2){const f=new T3.Mesh(new T3.BoxGeometry(w*.22,.6,4),wm);f.position.set(j*w*.22,-d/2-.2,8+k*12);g.add(f);}
  return g;
}
function seg(mesh,a,b){ // caixa fina entre dois pontos
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,L=Math.hypot(dx,dy,dz)||.01;
  mesh.position.set((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);mesh.scale.set(1,1,L);
  mesh.lookAt(b.x,b.y,b.z);
}
function raio(g,alt,x,seed){
  const segs=[],pts=[];let x0=x,y0=0;
  for(let i=0;i<=8;i++){pts.push(new T3.Vector3(x0,y0,alt*(1-i/8)));x0+=(rnd(seed+i)-.5)*34;y0+=(rnd(seed+i*2)-.5)*14;}
  const mm=basic(C.hl);
  for(let i=0;i<8;i++){const b=new T3.Mesh(new T3.BoxGeometry(5,5,1),mm);seg(b,pts[i],pts[i+1]);g.add(b);segs.push(b);}
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
    const N=16,layers=[];
    for(let i=0;i<N;i++){
      const r0=10+Math.pow(i/N,1.7)*92,r1=10+Math.pow((i+1)/N,1.7)*92;
      const m=new T3.Mesh(new T3.CylinderGeometry(r1,r0,17.5,12,1,true),mat(i%2?0x7b7b7b:0x5c5c5c,{side:T3.DoubleSide}));
      m.castShadow=true;fun.add(m);layers.push(m);
    }
    const topo=new T3.Group();topo.position.z=282;g.add(topo);
    [[0,0,86,0x3b3b3b],[-70,30,62,0x4d4d4d],[66,-26,66,0x444444],[10,70,54,0x575757],[-30,-62,58,0x3f3f3f]].forEach((c,k)=>{const n=nuvem(c[2],c[3],k*9);n.position.set(c[0],c[1],k%2*6);topo.add(n);});
    const det=[];const dm=[mat(C.ink),mat(0x7a7a7a),mat(C.hl),mat(0xd6d0bf)];
    for(let i=0;i<40;i++){const b=new T3.Mesh(new T3.BoxGeometry(4+rnd(i)*7,3+rnd(i+3)*5,2+rnd(i+6)*3),dm[i%4]);b.castShadow=true;g.add(b);det.push(b);}
    const poeira=new T3.Mesh(new T3.RingGeometry(20,96,32),new T3.MeshBasicMaterial({color:0x9c9482,transparent:true,opacity:.45,side:T3.DoubleSide}));poeira.position.z=1;g.add(poeira);
    const upd=(a,t)=>{
      layers.forEach((m,i)=>{const f=i/N;m.position.y=i*17+8;m.position.x=Math.sin(t*2.1+i*.45)*(3+f*20)+Math.sin(t*.7)*f*14;m.position.z=Math.cos(t*1.7+i*.5)*(2+f*14);m.rotation.y=t*(5-f*2)+i*.7;});
      topo.rotation.z=t*.45;
      det.forEach((b,i)=>{const h=(t*.32+i*.173)%1,ang=t*(3+i%3)+i*1.7,rad=16+Math.pow(h,1.3)*118*(.55+rnd(i)*.7);
        b.position.set(Math.cos(ang)*rad+Math.sin(t*.7)*h*14,Math.sin(ang)*rad,6+h*270);b.rotation.set(t*4+i,t*3+i*2,t*5);});
      poeira.scale.setScalar(1+.08*Math.sin(t*3));
    };
    return {g,upd,cenario:'campo'};
  },
  temporal(){
    const g=new T3.Group();const nu=[];
    [[-95,-20,78,0x3d3d3d],[10,10,92,0x2f2f2f],[104,-24,70,0x454545],[-30,50,64,0x505050],[60,56,60,0x3a3a3a]].forEach((c,k)=>{const n=nuvem(c[2],c[3],k*5+2);n.position.set(c[0],c[1],250+k%3*10);g.add(n);nu.push(n);});
    const ch=chuvaLinhas(170,300,250,0x5a5a5a);g.add(ch);
    const bolts=[raio(g,240,-40,3),raio(g,240,70,11)];
    const upd=(a,t)=>{
      nu.forEach((n,k)=>{n.position.x+=0;n.rotation.z=Math.sin(t*.6+k)*.18;n.position.y=Math.sin(t*.8+k*2)*14;});
      ch.upd(t);
      bolts.forEach((bs,bi)=>{const ph=(t*1.1+bi*.5)%1,on=ph<.13&&(Math.floor(t*1.1+bi*.5)%2===bi%2||bi===0);
        if(ph<.02&&false){};bs.forEach(b=>b.visible=on&&(Math.floor(ph*40)%3!==1));});
    };
    return {g,upd,cenario:'cidade'};
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
    const upd=(a,t)=>{const ph=(t*.9)%1,on=ph<.18;
      bolts.forEach((bs,i)=>bs.forEach(b=>b.visible=on&&(i===Math.floor(t*.9)%3)));
      anel.visible=on;anel.scale.setScalar(1+ph*18);anel.material.opacity=1-ph/.18;n.rotation.z=Math.sin(t*.8)*.1;};
    return {g,upd,cenario:'campo'};
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
      luzes.forEach((j,k)=>{j.visible=Math.sin(t*14+k*3)>.1&&((t*2+k*.4)%2)<1.2;});
      fag.forEach((b,i)=>{const f=((t*1.7+i*.31)%1),on=Math.sin(t*20+i)>-.2&&((Math.floor(t*3))%2===0||i<5);
        b.visible=on;b.position.set(-80+Math.cos(i*2)*f*26,Math.sin(i*3)*f*14,120-f*50);});
    };
    return {g,upd,cenario:'vazio'};
  },
};
// cenário de maquete ao redor (casas, árvores, prédios) para dar contexto
function cenario(tipo,seed){
  const g=new T3.Group();
  if(tipo==='campo'){[[-130,-40],[120,50],[-100,90],[140,-70],[-150,40]].forEach((p,k)=>{const a=arvore(40+rnd(seed+k)*18,k);a.position.set(p[0],p[1],0);g.add(a);});
    [[-120,-90],[110,-100]].forEach((p,k)=>{const h=casa(30,26,22,C.wall,true,k);h.g.position.set(p[0],p[1],0);g.add(h.g);});}
  if(tipo==='cidade'){[[-120,-60,30,28,70],[0,-80,26,26,48],[120,-50,32,30,86],[-60,80,28,26,56],[80,76,28,28,64]].forEach((p,k)=>{const b=predio(p[2],p[3],p[4],k%2?0xe9e2cf:C.light);b.position.set(p[0],p[1],0);g.add(b);});}
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
      o.upd(a,t);
    }
  };
};

function render(){R.render(scene,cam);}
window.C3D={ok:false,init,setCY,quadro,projeta,dest,fillBloco,ilus,render,tipos:Object.keys(FAB)};
})();
