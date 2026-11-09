// Low-poly miniature models in the style of the channel references (flat shaded primitives).
import * as THREE from './node_modules/three/build/three.module.js';

const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0.0, flatShading: true, ...o });
const box = (w, h, d, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = true; m.receiveShadow = true; return m; };
const cyl = (rt, rb, h, mat, seg = 12) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.castShadow = true; return m; };
const sph = (r, mat, seg = 12) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), mat); m.castShadow = true; return m; };

export const PALETTE = {
  de: { main: 0xb5574b, dark: 0x7d3a33, light: 0xd07a6c },      // German = red (as in references)
  al: { main: 0x8fa36f, dark: 0x5d6e47, light: 0xb1c38f },      // Allied = olive green
  fr: { main: 0x6f8fb0, dark: 0x4a6684, light: 0x9db6cf },      // French = steel blue
  be: { main: 0xc9a85a, dark: 0x8e7537, light: 0xe0c98c },      // Belgian = ochre
  neutral: { main: 0xd9d2c3, dark: 0x9a948a, light: 0xefe9dc },
};
const track = M(0x4a4a4a), wheel = M(0x2f2f2f), skin = M(0xf1e6d6), white = M(0xf3f1ec), grey = M(0xb9bcc0), darkgrey = M(0x6c6f73);

// all models are built ~1 unit long (x forward), sit on y=0
export function tank(side = 'de') {
  const p = PALETTE[side], g = new THREE.Group();
  const body = M(p.main), dark = M(p.dark);
  const tl = box(1.0, 0.18, 0.18, track); tl.position.set(0, 0.11, 0.27); g.add(tl);
  const tr = tl.clone(); tr.position.z = -0.27; g.add(tr);
  for (let i = 0; i < 5; i++) for (const z of [0.37, -0.37]) {
    const w = cyl(0.075, 0.075, 0.03, M(p.dark), 10); w.rotation.x = Math.PI / 2; w.position.set(-0.36 + i * 0.18, 0.1, z); g.add(w);
  }
  const hull = box(0.95, 0.2, 0.62, body); hull.position.set(0, 0.28, 0); g.add(hull);
  const glacis = box(0.25, 0.14, 0.6, body); glacis.position.set(0.47, 0.25, 0); glacis.rotation.z = -0.5; g.add(glacis);
  const turret = cyl(0.21, 0.24, 0.16, dark, 8); turret.position.set(-0.05, 0.46, 0); g.add(turret);
  const hatch = cyl(0.08, 0.08, 0.05, body, 8); hatch.position.set(-0.1, 0.56, 0.05); g.add(hatch);
  const barrel = cyl(0.03, 0.035, 0.6, dark, 8); barrel.rotation.z = Math.PI / 2; barrel.position.set(0.42, 0.47, 0); g.add(barrel);
  return g;
}

export function soldier(side = 'de') {
  const p = PALETTE[side], g = new THREE.Group(), uni = M(p.main), dk = M(p.dark);
  const l1 = box(0.1, 0.38, 0.11, dk); l1.position.set(0, 0.19, 0.07); g.add(l1);
  const l2 = l1.clone(); l2.position.z = -0.07; g.add(l2);
  const torso = box(0.18, 0.36, 0.32, uni); torso.position.set(0, 0.56, 0); g.add(torso);
  const a1 = box(0.09, 0.32, 0.09, uni); a1.position.set(0, 0.55, 0.21); g.add(a1);
  const a2 = a1.clone(); a2.position.z = -0.21; g.add(a2);
  const head = sph(0.11, skin); head.position.set(0, 0.85, 0); g.add(head);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), dk); helm.position.set(0, 0.87, 0); helm.castShadow = true; g.add(helm);
  const rifle = box(0.04, 0.04, 0.5, M(0x6b4a2f)); rifle.position.set(-0.08, 0.75, -0.05); rifle.rotation.x = 0.9; g.add(rifle);
  g.scale.setScalar(0.9);
  return g;
}

export function truck(side = 'al') {
  const p = PALETTE[side], g = new THREE.Group();
  const cab = box(0.3, 0.3, 0.42, M(p.light)); cab.position.set(0.32, 0.33, 0); g.add(cab);
  const win = box(0.02, 0.12, 0.34, M(0x5a6570)); win.position.set(0.475, 0.38, 0); g.add(win);
  const bed = box(0.62, 0.26, 0.46, M(p.main)); bed.position.set(-0.15, 0.32, 0); g.add(bed);
  const chassis = box(1.0, 0.08, 0.4, M(p.dark)); chassis.position.set(0.02, 0.16, 0); g.add(chassis);
  for (const x of [0.32, -0.08, -0.32]) for (const z of [0.21, -0.21]) {
    const w = cyl(0.1, 0.1, 0.08, wheel, 12); w.rotation.x = Math.PI / 2; w.position.set(x, 0.1, z); g.add(w);
  }
  return g;
}

export function plane(side = 'de') {
  const p = PALETTE[side], g = new THREE.Group(), body = M(side === 'de' ? 0xe9e7e1 : 0xd9dccf);
  const fus = cyl(0.06, 0.09, 1.0, body, 10); fus.rotation.z = Math.PI / 2; g.add(fus);
  const nose = cyl(0.02, 0.06, 0.12, darkgrey, 10); nose.rotation.z = -Math.PI / 2; nose.position.x = 0.56; g.add(nose);
  const wing = box(0.22, 0.025, 1.15, body); wing.position.set(0.12, -0.03, 0); g.add(wing);
  const tail = box(0.12, 0.02, 0.4, body); tail.position.set(-0.45, 0.02, 0); g.add(tail);
  const fin = box(0.12, 0.16, 0.02, M(p.main)); fin.position.set(-0.46, 0.1, 0); g.add(fin);
  for (const z of [0.3, -0.3]) { const e = cyl(0.045, 0.045, 0.16, darkgrey, 8); e.rotation.z = Math.PI / 2; e.position.set(0.2, -0.04, z); g.add(e); }
  const prop = box(0.01, 0.22, 0.03, darkgrey); prop.position.set(0.63, 0, 0); g.add(prop); g.userData.prop = prop;
  g.userData.flying = true;
  return g;
}

export function ship(kind = 'destroyer') {
  const g = new THREE.Group(), hullM = M(0x8c9196), deck = M(0xc9c2b2), sup = M(0xd8d8d2);
  const s = new THREE.Shape();
  if (kind === 'boat') { s.moveTo(-0.5, -0.18); s.lineTo(0.3, -0.18); s.lineTo(0.5, 0); s.lineTo(0.3, 0.18); s.lineTo(-0.5, 0.18); s.closePath(); }
  else { s.moveTo(-0.5, -0.12); s.lineTo(0.25, -0.12); s.lineTo(0.5, 0); s.lineTo(0.25, 0.12); s.lineTo(-0.5, 0.12); s.closePath(); }
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: kind === 'boat' ? 0.14 : 0.12, bevelEnabled: false }), kind === 'boat' ? M(0xe8e1d0) : hullM);
  hull.rotation.x = -Math.PI / 2; hull.castShadow = true; g.add(hull);
  if (kind === 'boat') {
    const cabin = box(0.25, 0.12, 0.2, M(0x7b5b3e)); cabin.position.set(-0.1, 0.2, 0); g.add(cabin);
  } else {
    const d = box(0.7, 0.02, 0.2, deck); d.position.set(-0.08, 0.13, 0); g.add(d);
    const bridge = box(0.14, 0.14, 0.14, sup); bridge.position.set(0.12, 0.2, 0); g.add(bridge);
    for (const x of [-0.05, -0.2]) { const f = cyl(0.035, 0.04, 0.16, M(0x5a5a5a), 8); f.position.set(x, 0.22, 0); g.add(f); }
    const gun = box(0.08, 0.06, 0.08, darkgrey); gun.position.set(0.3, 0.16, 0); g.add(gun);
    const gun2 = gun.clone(); gun2.position.x = -0.38; g.add(gun2);
  }
  g.userData.ship = true;
  return g;
}

export function building(color = 0xefe6d2, roof = 0xd98f78) {
  const g = new THREE.Group();
  const b = box(0.6, 0.9, 0.6, M(color)); b.position.y = 0.45; g.add(b);
  const r = box(0.64, 0.06, 0.64, M(roof)); r.position.y = 0.93; g.add(r);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 3; x++) {
    const w = box(0.1, 0.1, 0.01, M(0x6f7a85)); w.position.set(-0.18 + x * 0.18, 0.2 + y * 0.18, 0.305); g.add(w);
  }
  return g;
}

export function bunker() {
  const g = new THREE.Group();
  const b = box(0.8, 0.35, 0.8, M(0xcfcabd)); b.position.y = 0.175; g.add(b);
  const top = box(0.9, 0.08, 0.9, M(0xb6b0a2)); top.position.y = 0.39; g.add(top);
  const slit = box(0.5, 0.05, 0.02, M(0x333333)); slit.position.set(0, 0.25, 0.41); g.add(slit);
  return g;
}

export function gun(side = 'de') {
  const p = PALETTE[side], g = new THREE.Group();
  const shield = box(0.05, 0.25, 0.35, M(p.main)); shield.position.set(0.05, 0.25, 0); g.add(shield);
  const barrel = cyl(0.025, 0.03, 0.7, M(p.dark), 8); barrel.rotation.z = Math.PI / 2 - 0.25; barrel.position.set(0.3, 0.3, 0); g.add(barrel);
  for (const z of [0.2, -0.2]) { const w = cyl(0.13, 0.13, 0.05, wheel, 12); w.rotation.x = Math.PI / 2; w.position.set(0, 0.13, z); g.add(w); }
  const trail = box(0.6, 0.04, 0.05, M(p.dark)); trail.position.set(-0.3, 0.08, 0); trail.rotation.z = 0.15; g.add(trail);
  return g;
}

export function flag(side = 'de') {
  const p = PALETTE[side], g = new THREE.Group();
  const pole = cyl(0.015, 0.015, 0.9, darkgrey, 6); pole.position.y = 0.45; g.add(pole);
  const cloth = box(0.02, 0.22, 0.34, M(p.main)); cloth.position.set(0, 0.78, 0.17); g.add(cloth);
  return g;
}

export function wreck() { // abandoned vehicles pile
  const g = new THREE.Group();
  const t = truck('al'); t.rotation.set(0.15, 0.6, 0.3); g.add(t);
  const t2 = truck('al'); t2.position.set(0.6, 0, 0.5); t2.rotation.y = 2.2; g.add(t2);
  g.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.color.multiplyScalar(0.55); } });
  return g;
}

export const MODELS = { tank, soldier, truck, plane, ship, building, bunker, gun, flag, wreck };
