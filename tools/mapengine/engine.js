// Map animation engine: pastel flat map + low-poly 3D miniatures + always-moving camera + screen-space cards.
import * as THREE from './node_modules/three/build/three.module.js';
import { MODELS } from './models.js';

export const W = 1920, H = 1080;
const LON0 = 3.0, LAT0 = 50.5;
const KX = 111.32 * Math.cos(LAT0 * Math.PI / 180), KY = 110.57;
export const proj = (lon, lat) => [(lon - LON0) * KX, -(lat - LAT0) * KY]; // world x,z in km

export const COL = {
  sea: '#93AEC0', beach: '#EFE3C8', reich: '#E2A797', france: '#A9BE93', belgium: '#BCCB9E', nl: '#BCCB9E', uk: '#9FB689',
  neutral: '#D9D1BF', border: '#5b3f35', river: '#7FA3C6', red: '#B8322A', redDash: '#C23A2E', ink: '#1d1b19', paper: '#EFE3C8',
};
const COUNTRY_COLOR = {
  Germany: COL.reich, Austria: COL.reich, Czechia: COL.reich, Denmark: COL.reich, Luxembourg: COL.reich,
  France: COL.france, Belgium: COL.belgium, Netherlands: COL.nl, 'United Kingdom': COL.uk, Jersey: COL.uk, Guernsey: COL.uk, 'Isle of Man': COL.uk,
};

// ---------- easing / helpers
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ease = x => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;

function catmull(pts, n = 24) { // smooth path through lon/lat points -> world pts
  const P = pts.map(p => proj(p[0], p[1]));
  if (P.length < 3) { const out = []; for (let i = 0; i <= n; i++) out.push([lerp(P[0][0], P[1][0], i / n), lerp(P[0][1], P[1][1], i / n)]); return out; }
  const curve = new THREE.CatmullRomCurve3(P.map(p => new THREE.Vector3(p[0], 0, p[1])), false, 'centripetal');
  return curve.getPoints(n * (P.length - 1)).map(v => [v.x, v.z]);
}
function linear(pts, n) { const P = pts.map(p => proj(p[0], p[1])), out = [];
  for (let i = 0; i < P.length - 1; i++) for (let j = 0; j < n; j++) out.push([lerp(P[i][0], P[i + 1][0], j / n), lerp(P[i][1], P[i + 1][1], j / n)]);
  out.push(P[P.length - 1]); return out; }
function polyLen(P) { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return L; }
function pointAt(P, L, f) { // f in 0..1 by length -> [x,z,angle]
  const d = clamp(f) * L[L.length - 1];
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const seg = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
  const x = lerp(P[i - 1][0], P[i][0], seg), z = lerp(P[i - 1][1], P[i][1], seg);
  return [x, z, Math.atan2(-(P[i][1] - P[i - 1][1]), P[i][0] - P[i - 1][0])];
}

// ---------- 2D map texture
function drawGeo(ctx, geo, bb, Wt, Ht, opts) {
  const [lo0, la0, lo1, la1] = bb;
  const X = lon => (lon - lo0) / (lo1 - lo0) * Wt, Y = lat => (la1 - lat) / (la1 - la0) * Ht;
  const sc = Wt / (lo1 - lo0); // px per degree lon
  const path = (g) => {
    ctx.beginPath();
    const ring = r => { r.forEach((c, i) => i ? ctx.lineTo(X(c[0]), Y(c[1])) : ctx.moveTo(X(c[0]), Y(c[1]))); ctx.closePath(); };
    if (g.type === 'Polygon') g.coordinates.forEach(ring);
    else if (g.type === 'MultiPolygon') g.coordinates.forEach(p => p.forEach(ring));
  };
  const line = (g) => {
    ctx.beginPath();
    const seg = r => r.forEach((c, i) => i ? ctx.lineTo(X(c[0]), Y(c[1])) : ctx.moveTo(X(c[0]), Y(c[1])));
    if (g.type === 'LineString') seg(g.coordinates); else if (g.type === 'MultiLineString') g.coordinates.forEach(seg);
  };
  ctx.fillStyle = COL.sea; ctx.fillRect(0, 0, Wt, Ht);
  // subtle sea depth gradient near coasts: beach band
  const bw = Math.max(1.5, sc * 0.018);
  ctx.lineJoin = 'round';
  for (const [n, g] of Object.entries(geo.countries)) { path(g); ctx.strokeStyle = COL.beach; ctx.lineWidth = bw * 2.2; ctx.stroke(); }
  for (const [n, g] of Object.entries(geo.countries)) { path(g); ctx.fillStyle = (opts.colors && opts.colors[n]) || COUNTRY_COLOR[n] || COL.neutral; ctx.fill(); }
  // occupation zones, clipped to land
  if (opts.zones && opts.zones.length) {
    ctx.save(); ctx.beginPath();
    const ring2 = r => { r.forEach((c, i) => i ? ctx.lineTo(X(c[0]), Y(c[1])) : ctx.moveTo(X(c[0]), Y(c[1]))); ctx.closePath(); };
    for (const g of Object.values(geo.countries)) { if (g.type === 'Polygon') g.coordinates.forEach(ring2); else g.coordinates.forEach(p => p.forEach(ring2)); }
    ctx.clip();
    for (const z of opts.zones) { ctx.beginPath(); z.poly.forEach((c, i) => i ? ctx.lineTo(X(c[0]), Y(c[1])) : ctx.moveTo(X(c[0]), Y(c[1]))); ctx.closePath(); ctx.fillStyle = z.color; ctx.globalAlpha = z.alpha ?? 1; ctx.fill(); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 0.9;
  for (const l of geo.lakes) { path(l); ctx.fillStyle = COL.river; ctx.fill(); }
  ctx.strokeStyle = COL.river; ctx.lineCap = 'round';
  const RIV = new Set(opts.rivers || ['Maas','Rhein','Rhine','Rhin','Schelde','Seine','Mosel','Marne','Thames','Waal','Main','Loire','Lek','IJssel','Nederrijn']);
  for (const r of geo.rivers) { if (!RIV.has(r.name)) continue; line(r.geom); ctx.lineWidth = Math.max(1.2, sc * 0.007); ctx.stroke(); }
  for (const c of (opts.canals || [])) { line({ type: 'LineString', coordinates: c }); ctx.lineWidth = Math.max(1.2, sc * 0.0055); ctx.stroke(); }
  ctx.globalAlpha = 1;
  for (const [n, g] of Object.entries(geo.countries)) { path(g); ctx.strokeStyle = COL.border; ctx.globalAlpha = 0.55; ctx.lineWidth = Math.max(1, sc * 0.006); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // paper grain
  const img = ctx.getImageData(0, 0, Wt, Ht), d = img.data;
  let s = 1234567;
  for (let i = 0; i < d.length; i += 4) { s = (s * 16807) % 2147483647; const n = ((s / 2147483647) - 0.5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
}

function makePlane(geo, bb, Wt, opts, y) {
  const [lo0, la0, lo1, la1] = bb;
  const [x0, z0] = proj(lo0, la1), [x1, z1] = proj(lo1, la0);
  const Ht = Math.round(Wt * (z1 - z0) / (x1 - x0));
  const cv = document.createElement('canvas'); cv.width = Wt; cv.height = Ht;
  drawGeo(cv.getContext('2d'), geo, bb, Wt, Ht, opts);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshLambertMaterial({ map: tex }));
  m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); m.receiveShadow = true;
  return m;
}

// ---------- engine
export class MapEngine {
  constructor(geo, places) {
    this.geo = geo; this.places = places;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(W, H); this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.cssText = 'position:absolute;left:0;top:0';
    document.body.appendChild(this.renderer.domElement);
    this.ov = document.createElement('canvas'); this.ov.width = W; this.ov.height = H;
    this.ov.style.cssText = 'position:absolute;left:0;top:0'; document.body.appendChild(this.ov);
    this.ctx = this.ov.getContext('2d');
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(COL.sea);
    this.camera = new THREE.PerspectiveCamera(28, W / H, 1, 20000);
    this.scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8a7f72, 1.6));
    this.sun = new THREE.DirectionalLight(0xffffff, 1.9); this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048); this.sun.shadow.bias = -0.0005; this.sun.shadow.radius = 4;
    this.scene.add(this.sun); this.scene.add(this.sun.target);
    this.dyn = new THREE.Group(); this.scene.add(this.dyn);
  }
  buildMap(opts = {}) {
    const key = JSON.stringify(opts); if (key === this.mapKey) return; this.mapKey = key;
    if (this.mapGroup) { this.scene.remove(this.mapGroup); this.mapGroup.traverse(o => { if (o.material) { o.material.map?.dispose(); o.material.dispose(); o.geometry.dispose(); } }); }
    this.mapGroup = new THREE.Group();
    this.mapGroup.add(makePlane(this.geo, [-6, 46, 14, 55.5], 6144, opts, 0));
    this.mapGroup.add(makePlane(this.geo, [-1.5, 48.0, 8.0, 52.6], 8192, opts, 0.02));
    this.mapGroup.add(makePlane(this.geo, [0.9, 50.05, 4.1, 51.55], 8192, opts, 0.04));
    this.scene.add(this.mapGroup);
  }
  // scene: {dur, cam:[...], units:[], arrows:[], rings:[], areas:[], labels:[], cards:{}}
  load(sc) {
    this.sc = sc; this.dyn.clear(); this.objs = [];
    this.lab = [];
    const S = sc.unitScale || 6;
    for (const a of sc.arrows || []) {
      const P = catmull(a.path, 30), L = polyLen(P), total = L[L.length - 1];
      const width = a.width || S * 0.28, dash = a.dashed === false ? 0 : (a.dash || S * 0.9);
      const mat = new THREE.MeshBasicMaterial({ color: a.color || COL.redDash, transparent: true });
      const segs = [];
      const step = dash ? dash : S * 0.5;
      for (let d = 0; d < total; d += step) {
        if (dash && Math.round(d / step) % 2) continue;
        const len = Math.min(step, total - d);
        const [x, z, ang] = pointAt(P, L, (d + len / 2) / total);
        const m = new THREE.Mesh(new THREE.BoxGeometry(len * (dash ? 1 : 1.05), 0.05, width), mat);
        m.position.set(x, 0.12, z); m.rotation.y = ang; m.userData.f = (d + len) / total; this.dyn.add(m); segs.push(m);
      }
      let head = null;
      if (a.head !== false) {
        const sh = new THREE.Shape(); const hw = width * 2.6, hl = width * 3.4;
        sh.moveTo(hl, 0); sh.lineTo(0, hw); sh.lineTo(0, -hw); sh.closePath();
        head = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat); head.rotation.x = -Math.PI / 2; this.dyn.add(head);
      }
      this.objs.push({ type: 'arrow', a, P, L, segs, head, mat });
    }
    for (const r of sc.rings || []) {
      const pts = r.path.concat(r.closed === false ? [] : [r.path[0]]);
      const P = linear(pts, 12), L = polyLen(P), total = L[L.length - 1];
      const mat = new THREE.MeshBasicMaterial({ color: r.color || COL.red, transparent: true });
      const segs = []; const step = S * 0.4;
      for (let d = 0; d < total; d += step) {
        const len = Math.min(step, total - d); const [x, z, ang] = pointAt(P, L, (d + len / 2) / total);
        const m = new THREE.Mesh(new THREE.BoxGeometry(len * 1.1, 0.05, r.width || S * 0.2), mat);
        m.position.set(x, 0.13, z); m.rotation.y = ang; m.userData.f = (d + len) / total; this.dyn.add(m); segs.push(m);
      }
      this.objs.push({ type: 'ring', a: r, segs, mat });
    }
    for (const ar of sc.areas || []) {
      const sh = new THREE.Shape(); ar.poly.forEach((p, i) => { const [x, z] = proj(p[0], p[1]); i ? sh.lineTo(x, -z) : sh.moveTo(x, -z); });
      const mat = new THREE.MeshBasicMaterial({ color: ar.color || COL.reich, transparent: true, opacity: 0, depthWrite: false });
      const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat); m.rotation.x = -Math.PI / 2; m.position.y = 0.08 + (ar.z || 0) * 0.01;
      this.dyn.add(m); this.objs.push({ type: 'area', a: ar, m, mat });
    }
    for (const u of sc.units || []) {
      const g = MODELS[u.model](u.side || u.kind);
      const k = (u.scale || 1) * S; g.scale.multiplyScalar(k);
      const wrap = new THREE.Group(); wrap.add(g); this.dyn.add(wrap);
      const P = catmull(u.path.length === 1 ? [u.path[0], u.path[0]] : u.path, 20);
      this.objs.push({ type: 'unit', a: u, g: wrap, inner: g, P, L: polyLen(P), k });
    }
  }
  cam(t) {
    const keys = this.sc.cam;
    let i = 0; while (i < keys.length - 1 && keys[i + 1].t <= t) i++;
    const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
    const f = k1 === k0 ? 0 : ease((t - k0.t) / (k1.t - k0.t));
    const pos = k => k.follow ? this.tip(k.follow, t, k) : [k.lon, k.lat];
    const p0 = pos(k0), p1 = pos(k1);
    let lon = lerp(p0[0], p1[0], f), lat = lerp(p0[1], p1[1], f);
    let w = Math.exp(lerp(Math.log(k0.w), Math.log(k1.w), f));
    const tilt = lerp(k0.tilt ?? 32, k1.tilt ?? 32, f), yaw = lerp(k0.yaw ?? 0, k1.yaw ?? 0, f);
    // never static: gentle drift
    w *= 1 - 0.006 * t; lon += 0.0009 * t * (w / 100);
    return { lon, lat, w, tilt, yaw };
  }
  tip(id, t, k) {
    const o = this.objs.find(o => o.a.id === id); if (!o) return [k.lon, k.lat];
    const f = ease((t - o.a.t0) / (o.a.t1 - o.a.t0));
    const [x, z] = pointAt(o.P, o.L, f);
    const lead = k.lead || [0, 0];
    return [x / KX + LON0 + lead[0], -z / KY + LAT0 + lead[1]];
  }
  renderAt(t) {
    const sc = this.sc; this.curW = this.cam(t).w;
    for (const o of this.objs) {
      const a = o.a, vis = clamp((t - (a.t0 ?? 0)) / 0.4) * (a.out != null ? 1 - clamp((t - a.out) / 0.4) : 1);
      if (o.type === 'arrow' || o.type === 'ring') {
        const f = (a.t1 != null) ? ease((t - a.t0) / (a.t1 - a.t0)) : 1;
        o.mat.opacity = vis;
        for (const s of o.segs) s.visible = s.userData.f <= f + 1e-6 && vis > 0;
        if (o.head) {
          const [x, z, ang] = pointAt(o.P, o.L, Math.max(0.001, f));
          o.head.visible = f > 0.02 && vis > 0; o.head.position.set(x, 0.14, z); o.head.rotation.z = ang;
        }
      } else if (o.type === 'area') {
        o.mat.opacity = (a.opacity ?? 0.55) * vis;
      } else if (o.type === 'unit') {
        const f = a.t1 != null ? ease((t - a.t0) / (a.t1 - a.t0)) : 0;
        const [x, z, ang] = pointAt(o.P, o.L, f);
        const pop = a.pop === false ? 1 : smooth((t - (a.t0 ?? 0) + (a.pre ?? 0.4)) / 0.4);
        const out = a.out != null ? 1 - smooth((t - a.out) / 0.35) : 1;
        o.g.visible = pop * out > 0.01;
        const zs = this.sc.fixedUnits ? 1 : Math.pow(this.curW / (this.sc.refW || 120), 0.85);
        o.g.scale.setScalar(Math.max(0.001, pop * out * zs));
        const fly = o.inner.userData.flying ? (a.alt ?? 4) * o.k * zs : 0;
        const bob = o.inner.userData.ship ? Math.sin(t * 2 + x) * 0.03 * o.k : 0;
        o.g.position.set(x, fly + bob, z);
        o.g.rotation.y = (a.heading != null ? a.heading * Math.PI / 180 : (o.L[o.L.length - 1] > 0 ? ang : 0));
        if (o.inner.userData.prop) o.inner.userData.prop.rotation.x = t * 40;
      }
    }
    // camera
    const c = this.cam(t), [tx, tz] = proj(c.lon, c.lat);
    const hf = Math.atan(Math.tan(this.camera.fov * Math.PI / 360) * W / H);
    const dist = (c.w / 2) / Math.tan(hf);
    const th = c.tilt * Math.PI / 180, yw = c.yaw * Math.PI / 180;
    this.camera.position.set(tx + Math.sin(yw) * dist * Math.sin(th), dist * Math.cos(th), tz + Math.cos(yw) * dist * Math.sin(th));
    this.camera.lookAt(tx, 0, tz);
    this.camera.near = dist * 0.05; this.camera.far = dist * 6; this.camera.updateProjectionMatrix();
    this.sun.position.set(tx - dist * 0.4, dist * 1.2, tz - dist * 0.6); this.sun.target.position.set(tx, 0, tz);
    const sc2 = this.sun.shadow.camera, half = c.w * 0.9;
    sc2.left = -half; sc2.right = half; sc2.top = half; sc2.bottom = -half; sc2.near = 1; sc2.far = dist * 4; sc2.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    this.overlay(t, c);
  }
  screen(lon, lat, y = 0) {
    const [x, z] = proj(lon, lat); const v = new THREE.Vector3(x, y, z).project(this.camera);
    return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z];
  }
  overlay(t, c) {
    const g = this.ctx, sc = this.sc; g.clearRect(0, 0, W, H); g.textAlign = 'left';
    // labels: regions (spaced stencil), cities (dot + name)
    const kmPx = W / c.w;
    for (const L of sc.labels || []) {
      const vis = clamp((t - (L.t0 ?? 0)) / 0.5) * (L.out != null ? 1 - clamp((t - L.out) / 0.4) : 1);
      if (vis <= 0) continue;
      const pl = this.places[L.p] || { lon: L.lon, lat: L.lat };
      const [x, y] = this.screen(pl.lon, pl.lat); if (x < -200 || x > W + 200 || y < -100 || y > H + 100) continue;
      g.globalAlpha = vis;
      if (L.kind === 'region' || L.kind === 'sea') {
        g.font = `${L.size || 30}px "Stardos Stencil"`; g.letterSpacing = `${(L.size || 30) * 0.32}px`;
        g.fillStyle = L.kind === 'sea' ? '#4f6f88' : (L.color || '#7a2e25'); g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(L.text, x, y); g.letterSpacing = '0px';
      } else {
        const r = L.big ? 7 : 5;
        g.fillStyle = COL.ink; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
        g.font = `${L.big ? 36 : 29}px "Barlow Condensed"`; g.textAlign = L.left ? 'right' : 'left'; g.textBaseline = 'middle';
        const tx = x + (L.left ? -12 : 12), ty = y - (L.big ? 14 : 12);
        g.lineWidth = 5; g.strokeStyle = 'rgba(239,227,200,0.9)'; g.strokeText(L.text, tx, ty);
        g.fillStyle = COL.ink; g.fillText(L.text, tx, ty);
      }
      g.globalAlpha = 1;
    }
    // pulse circles (dashed) & unit tags
    for (const p of sc.pulses || []) {
      const vis = clamp((t - p.t0) / 0.4) * (p.out != null ? 1 - clamp((t - p.out) / 0.4) : 1); if (vis <= 0) continue;
      const pl = this.places[p.p] || p; const [x, y] = this.screen(pl.lon, pl.lat);
      const r = (p.km || 8) * kmPx * (0.9 + 0.1 * Math.sin(t * 3));
      g.globalAlpha = vis; g.setLineDash([10, 8]); g.lineWidth = 3.5; g.strokeStyle = COL.red; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    }
    for (const tg of sc.tags || []) {
      const vis = clamp((t - tg.t0) / 0.3) * (tg.out != null ? 1 - clamp((t - tg.out) / 0.3) : 1); if (vis <= 0) continue;
      let lon = tg.lon, lat = tg.lat;
      if (tg.unit) { const o = this.objs.find(o => o.a.id === tg.unit); const v = o.g.position; lon = v.x / KX + LON0; lat = -v.z / KY + LAT0; }
      else if (tg.p) ({ lon, lat } = this.places[tg.p]);
      const [x, y] = this.screen(lon, lat, 0);
      typeBox(g, tg.text, x + (tg.dx || 0), y + (tg.dy ?? -70), t - tg.t0, { font: '26px "Saira Stencil One"', bg: COL.ink, fg: '#f3ead7', center: true, alpha: vis });
    }
    // cards
    const C = sc.cards || {};
    if (C.title) typeBox(g, C.title, 54, 50, t - (C.titleT ?? 0.2), { font: '42px "Saira Stencil One"', bg: '#151311', fg: '#f5efe2', pad: [22, 14] });
    if (C.date) dateTag(g, C.date, t);
    if (C.clock) clockTag(g, C.clock, t);
    for (const s of C.stamps || []) stamp(g, s, t);
    vignette(g); logo(g);
  }
}

// ---------- screen-space card helpers
export function typeBox(g, text, x, y, dt, o = {}) {
  if (dt < 0) return;
  const n = Math.min(text.length, Math.floor(dt * (o.cps || 26)));
  const shown = text.slice(0, n);
  g.save(); g.globalAlpha = o.alpha ?? 1; g.font = o.font; g.textBaseline = 'middle';
  const full = g.measureText(text).width, [px, py] = o.pad || [16, 10];
  const fs = parseInt(o.font), h = fs + py * 2, w = full + px * 2;
  const bx = o.center ? x - w / 2 : x, by = o.center ? y - h / 2 : y;
  const grow = clamp(dt / 0.18);
  g.fillStyle = o.bg; g.fillRect(bx, by, w * grow, h);
  if (o.bar) { g.fillStyle = COL.red; g.fillRect(bx - 8, by, 5, h); }
  g.fillStyle = o.fg; g.textAlign = 'left'; g.fillText(shown, bx + px, by + h / 2 + 1);
  g.restore();
}
function dateTag(g, text, t) {
  const a = clamp(t / 0.4); g.save(); g.globalAlpha = a; g.font = '30px "Stardos Stencil"'; g.textAlign = 'left';
  const w = g.measureText(text).width + 36, x = W - 54 - w, y = 50;
  g.fillStyle = '#EFE3C8'; g.fillRect(x, y, w, 50); g.strokeStyle = '#3a2f28'; g.lineWidth = 2; g.strokeRect(x + 4, y + 4, w - 8, 42);
  g.fillStyle = '#2a211c'; g.textBaseline = 'middle'; g.fillText(text, x + 18, y + 27); g.restore();
}
function clockTag(g, ck, t) { // {h0,h1,t0,t1,label}
  const f = ease((t - ck.t0) / (ck.t1 - ck.t0)), hours = lerp(ck.h0, ck.h1, f);
  const x = W - 250, y = 40, R = 52; g.save();
  g.fillStyle = '#EFE3C8'; g.strokeStyle = '#2a211c'; g.lineWidth = 3; g.beginPath(); g.arc(x + R, y + R + 6, R, 0, 7); g.fill(); g.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(x + R + Math.sin(a) * R * 0.8, y + R + 6 - Math.cos(a) * R * 0.8); g.lineTo(x + R + Math.sin(a) * R * 0.92, y + R + 6 - Math.cos(a) * R * 0.92); g.stroke(); }
  const red = hours >= (ck.redAt ?? 999);
  const ha = hours / 12 * Math.PI * 2, ma = (hours % 1) * Math.PI * 2;
  g.strokeStyle = '#2a211c'; g.lineWidth = 5; g.beginPath(); g.moveTo(x + R, y + R + 6); g.lineTo(x + R + Math.sin(ha) * R * 0.5, y + R + 6 - Math.cos(ha) * R * 0.5); g.stroke();
  g.strokeStyle = COL.red; g.lineWidth = 3; g.beginPath(); g.moveTo(x + R, y + R + 6); g.lineTo(x + R + Math.sin(ma) * R * 0.8, y + R + 6 - Math.cos(ma) * R * 0.8); g.stroke();
  g.font = '34px "Black Ops One"'; g.textAlign = 'left'; g.fillStyle = red ? COL.red : '#f3ead7';
  const txt = `${String(Math.floor(hours)).padStart(2, '0')}:00 h`;
  g.fillStyle = '#151311'; const tw = g.measureText(txt).width + 28; g.fillRect(x + 2 * R + 14, y + 22, tw, 56);
  g.fillStyle = red ? '#e0574b' : '#f3ead7'; g.textBaseline = 'middle'; g.fillText(txt, x + 2 * R + 28, y + 51);
  g.restore();
}
function stamp(g, s, t) { // {text,t0,out}
  const dt = t - s.t0; if (dt < 0 || (s.out != null && t > s.out + 0.3)) return;
  const k = dt < 0.18 ? 1.6 - 0.6 * (dt / 0.18) : 1, a = s.out != null ? 1 - clamp((t - s.out) / 0.3) : 1;
  g.save(); g.globalAlpha = clamp(dt / 0.08) * a; g.translate(s.x ?? W / 2, s.y ?? H - 130); g.scale(k, k); g.rotate((s.rot ?? -2) * Math.PI / 180);
  g.font = `${s.size || 54}px "Black Ops One"`; const w = g.measureText(s.text).width + 50, h = (s.size || 54) + 34;
  g.fillStyle = '#F2E8D2'; g.fillRect(-w / 2, -h / 2, w, h); g.strokeStyle = s.color || COL.red; g.lineWidth = 4; g.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  g.fillStyle = s.color || COL.red; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s.text, 0, 3); g.restore();
}
function vignette(g) {
  const r = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
  r.addColorStop(0, 'rgba(40,25,15,0)'); r.addColorStop(1, 'rgba(40,25,15,0.42)'); g.fillStyle = r; g.fillRect(0, 0, W, H);
}
export function logo(g) {
  const x = W - 78, y = H - 78, R = 40; g.save();
  g.globalAlpha = 0.85; g.fillStyle = '#d9c7a4'; g.beginPath(); g.arc(x, y, R, 0, 7); g.fill();
  g.strokeStyle = '#7a5a3e'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, R - 5, 0, 7); g.stroke();
  g.fillStyle = '#5b4330'; g.beginPath(); g.moveTo(x, y - 26); g.lineTo(x + 6, y); g.lineTo(x, y + 26); g.lineTo(x - 6, y); g.closePath(); g.fill();
  g.strokeStyle = COL.red; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 22, y + 14); g.quadraticCurveTo(x, y - 30, x + 24, y - 10); g.stroke();
  g.restore();
}
