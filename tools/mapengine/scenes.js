// Map scenes for video 02 – Dünkirchen 1940. Times are seconds relative to scene start.
// Camera keys: {t, lon, lat, w(km visible width), tilt, yaw, follow:'unit/arrow id'}
const P = (lon, lat) => [lon, lat];
const LAB_BASE = [
  { kind: 'sea', text: 'ÄRMELKANAL', lon: 1.2, lat: 50.55, size: 30 },
  { kind: 'sea', text: 'NORDSEE', lon: 2.6, lat: 51.65, size: 30 },
  { kind: 'region', text: 'FRANKREICH', lon: 2.9, lat: 49.55, size: 34, color: '#43572f' },
  { kind: 'region', text: 'BELGIEN', lon: 4.6, lat: 50.55, size: 32, color: '#43572f' },
  { kind: 'region', text: 'ENGLAND', lon: 0.2, lat: 51.25, size: 32, color: '#43572f' },
  { kind: 'region', text: 'DEUTSCHES REICH', lon: 7.9, lat: 50.6, size: 34 },
  { kind: 'region', text: 'NIEDERLANDE', lon: 5.4, lat: 52.2, size: 26, color: '#43572f' },
];
// Kessel 24 May (approx)
const POCKET = [P(2.128, 50.99), P(2.25, 50.75), P(2.40, 50.64), P(2.64, 50.53), P(2.83, 50.43), P(3.08, 50.37), P(3.52, 50.36), P(3.62, 50.52),
  P(3.45, 50.78), P(3.72, 51.05), P(3.56, 51.20), P(3.20, 51.34), P(2.92, 51.235), P(2.55, 51.09)];
const PERIMETER = [P(2.27, 51.02), P(2.32, 50.97), P(2.434, 50.968), P(2.585, 50.98), P(2.66, 51.07), P(2.75, 51.13)];
const SICHEL = [P(6.6, 50.25), P(5.72, 50.0), P(4.94, 49.70), P(4.01, 49.69), P(3.29, 49.85), P(2.93, 49.93), P(2.30, 49.89), P(1.835, 50.105), P(1.68, 50.19)];
// German-held territory 24 May 1940 (clipped to land in the texture)
const OCC_0524 = [P(2.128, 50.99), P(2.25, 50.75), P(2.40, 50.64), P(2.64, 50.53), P(2.83, 50.43), P(3.08, 50.37), P(3.52, 50.36), P(3.62, 50.52),
  P(3.45, 50.78), P(3.72, 51.05), P(3.56, 51.20), P(3.30, 51.40), P(3.6, 51.6), P(4.2, 52.2), P(4.6, 52.9), P(5.2, 53.6), P(7.5, 53.8), P(7.5, 49.0), P(5.6, 49.3),
  P(4.9, 49.45), P(3.9, 49.55), P(3.1, 49.68), P(2.3, 49.82), P(1.7, 50.0), P(1.2, 50.1), P(1.0, 50.9), P(1.9, 51.05)];
const OCC_0510 = [P(5.95, 53.6), P(7.3, 53.7), P(9, 53), P(9, 48.5), P(7.5, 47.5), P(6.1, 49.45), P(6.4, 49.9), P(6.05, 50.4), P(5.95, 50.75), P(6.0, 51.4), P(6.75, 51.9), P(7.05, 52.4), P(6.7, 53.0)];
const OCC_0520 = [P(1.55, 50.18), P(1.83, 50.105), P(2.30, 49.94), P(2.93, 49.98), P(3.6, 49.95), P(4.2, 50.0), P(4.5, 50.3), P(4.8, 50.55), P(4.6, 50.95), P(4.45, 51.25),
  P(4.3, 51.6), P(4.6, 52.9), P(5.2, 53.6), P(7.5, 53.8), P(7.5, 49.0), P(5.6, 49.3), P(4.9, 49.45), P(3.9, 49.55), P(3.1, 49.68), P(2.3, 49.82), P(1.7, 50.0), P(1.2, 50.05)];
const AA_LINE = [P(2.128, 50.986), P(2.21, 50.83), P(2.252, 50.75), P(2.396, 50.639), P(2.64, 50.53), P(2.832, 50.432)];

export const SCENES = {
  // 00:23.5–00:47.5  Die Lage: Kessel, Dünkirchen, Panzer am Aa-Kanal
  m01_lage: {
    dur: 14.0, unitScale: 8, refW: 120, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 3.0, lat: 50.6, w: 360, tilt: 30 }, { t: 4.7, lon: 2.8, lat: 50.75, w: 230, tilt: 32 }, { t: 9.4, lon: 2.4, lat: 50.95, w: 120, tilt: 35 }, { t: 14, lon: 2.3, lat: 50.9, w: 100, tilt: 38, yaw: -6 }],
    rings: [{ path: POCKET, t0: 1.0, t1: 4.5, color: '#B8322A' }],
    units: [
      { id: 'bef1', model: 'soldier', side: 'al', path: [P(2.75, 50.75)], t0: 1.6 }, { id: 'bef2', model: 'truck', side: 'al', path: [P(3.1, 50.6)], t0: 2.0 },
      { id: 'fr1', model: 'soldier', side: 'fr', path: [P(3.3, 50.5)], t0: 2.4 }, { id: 'be1', model: 'soldier', side: 'be', path: [P(3.35, 50.95)], t0: 2.8 },
      { id: 'pz1', model: 'tank', side: 'de', path: [P(2.05, 50.80), P(2.17, 50.88)], t0: 9.6, t1: 11.6, heading: 40 },
      { id: 'pz2', model: 'tank', side: 'de', path: [P(2.25, 50.66), P(2.33, 50.72)], t0: 9.9, t1: 11.9, heading: 40 },
      { id: 'pz3', model: 'tank', side: 'de', path: [P(2.50, 50.48), P(2.58, 50.55)], t0: 10.2, t1: 12.2, heading: 40 },
    ],
    arrows: [{ id: 'a_aa', path: [P(2.17, 50.88), P(2.30, 50.98), P(2.36, 51.02)], t0: 11.4, t1: 13.6, color: '#C23A2E' }],
    pulses: [{ p: 'duenkirchen', t0: 8.6, km: 9 }],
    labels: [...LAB_BASE, { p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 8.4 }, { p: 'calais', text: 'Calais', t0: 0 }, { p: 'lille', text: 'Lille', t0: 0 },
      { p: 'gravelines', text: 'Gravelines', t0: 9.4, left: true }, { p: 'stomer', text: 'Saint-Omer', t0: 9.4, left: true }, { p: 'ostende', text: 'Ostende', t0: 0 }, { p: 'dover', text: 'Dover', t0: 0 }],
    tags: [{ text: 'AA-KANAL', lon: 2.2, lat: 50.83, t0: 9.8, dx: -40, dy: 40 }, { text: '< 20 KM', lon: 2.29, lat: 50.96, t0: 12.8, dy: -60 }],
    cards: { title: 'Der Kessel', date: '24. MAI 1940', stamps: [{ text: '400.000 MANN', t0: 0.4, out: 4.4 }] },
  },
  // 00:17.4–00:22.0 Flug Felsennest -> Charleville
  m00_flug: {
    dur: 4.8, unitScale: 9, refW: 160, map: { zones: [{ poly: OCC_0520, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 6.4, lat: 50.35, w: 260, tilt: 34 }, { t: 4.8, lon: 5.3, lat: 49.95, w: 230, tilt: 36 }],
    units: [{ id: 'flug', model: 'plane', side: 'de', path: [P(6.80, 50.515), P(5.9, 50.2), P(4.72, 49.77)], t0: 0.2, t1: 4.6, alt: 3 }],
    arrows: [{ id: 'fa', path: [P(6.80, 50.515), P(5.9, 50.2), P(4.72, 49.77)], t0: 0.2, t1: 4.6, color: '#3b3b3b', width: 1.4, dash: 4 }],
    labels: [{ p: 'felsennest', text: 'Felsennest', big: true, t0: 0 }, { p: 'charleville', text: 'Charleville', big: true, t0: 1.5 }, { p: 'koeln', text: 'Köln', t0: 0 },
      { p: 'luxemburg', text: 'Luxemburg', t0: 0 }, { kind: 'region', text: 'EIFEL', lon: 6.55, lat: 50.3, size: 26, t0: 0 }, { kind: 'region', text: 'ARDENNEN', lon: 5.2, lat: 50.1, size: 26, t0: 0 }],
    cards: { title: 'Der Flug', date: '24. MAI 1940' },
  },
  // 01:58.6–02:19.2 Fall Gelb: Heeresgruppe B, Eben-Emael, Alliierte nach Norden (Falle)
  m02_fallgelb: {
    dur: 20.6, unitScale: 9, refW: 400, map: { zones: [{ poly: OCC_0510, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 5.0, lat: 50.9, w: 620, tilt: 28 }, { t: 9, lon: 5.2, lat: 51.2, w: 420, tilt: 32 }, { t: 14, lon: 4.3, lat: 50.8, w: 430, tilt: 32 }, { t: 20.6, lon: 4.6, lat: 50.4, w: 520, tilt: 30 }],
    arrows: [
      { id: 'hgb1', path: [P(6.6, 51.9), P(5.6, 51.9), P(4.6, 51.95)], t0: 5.6, t1: 9.0 },
      { id: 'hgb2', path: [P(6.2, 50.85), P(5.6, 50.8), P(4.9, 50.85), P(4.4, 50.9)], t0: 6.2, t1: 9.6 },
      { id: 'al1', path: [P(3.1, 50.55), P(3.7, 50.75), P(4.45, 50.82)], t0: 12.5, t1: 16.3, color: '#5d7a3c' },
      { id: 'al2', path: [P(3.9, 50.2), P(4.4, 50.45), P(4.7, 50.6)], t0: 13.0, t1: 16.6, color: '#4a6684' },
    ],
    units: [{ id: 'fj', model: 'plane', side: 'de', path: [P(6.2, 50.9), P(5.68, 50.795)], t0: 9.4, t1: 12.2, alt: 4 },
      { id: 'u_al', model: 'truck', side: 'al', path: [P(3.1, 50.55), P(3.7, 50.75), P(4.45, 50.82)], t0: 12.5, t1: 16.3 },
      { id: 'u_fr', model: 'tank', side: 'fr', path: [P(3.9, 50.2), P(4.4, 50.45), P(4.7, 50.6)], t0: 13.0, t1: 16.6 }],
    pulses: [{ p: 'ebenemael', t0: 10.5, out: 14, km: 14 }],
    labels: [...LAB_BASE, { p: 'ebenemael', text: 'Eben-Emael', t0: 9.8 }, { p: 'bruessel', text: 'Brüssel', t0: 1 }, { p: 'rotterdam', text: 'Rotterdam', t0: 1 }, { p: 'paris', text: 'Paris', t0: 1 }, { p: 'lille', text: 'Lille', t0: 1 }],
    tags: [{ text: 'HEERESGRUPPE B', lon: 6.2, lat: 51.4, t0: 5.8, out: 12 }, { text: 'BRITEN + FRANZOSEN', lon: 3.6, lat: 50.4, t0: 13, dy: 60 }],
    cards: { title: 'Fall Gelb', date: '10. MAI 1940', stamps: [{ text: 'EINE FALLE', t0: 17.6 }] },
  },
  // 02:19.2–02:30.3 Ardennen
  m03a_ardennen: {
    dur: 11.1, unitScale: 9, refW: 200, map: { zones: [{ poly: OCC_0510, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 5.0, lat: 50.3, w: 520, tilt: 30 }, { t: 5, lon: 5.6, lat: 50.0, w: 230, tilt: 38 }, { t: 11.1, lon: 5.4, lat: 49.9, w: 190, tilt: 42, yaw: 8 }],
    areas: [{ poly: [P(4.6, 50.25), P(5.4, 50.45), P(6.3, 50.35), P(6.3, 49.6), P(5.3, 49.6), P(4.7, 49.75)], color: '#7f9a62', opacity: 0.45, t0: 2.5 }],
    units: [{ id: 'k1', model: 'tank', side: 'de', path: [P(6.45, 50.1), P(5.9, 49.98)], t0: 4.5, t1: 11 }, { id: 'k2', model: 'tank', side: 'de', path: [P(6.6, 50.15), P(6.05, 50.02)], t0: 5, t1: 11 },
      { id: 'k3', model: 'truck', side: 'de', path: [P(6.75, 50.2), P(6.2, 50.07)], t0: 5.5, t1: 11 }],
    labels: [{ kind: 'region', text: 'ARDENNEN', lon: 5.45, lat: 50.08, size: 36, t0: 2.5 }, { p: 'sedan', text: 'Sedan', t0: 1 }, { p: 'luxemburg', text: 'Luxemburg', t0: 1 }, { p: 'bastogne', text: 'Bastogne', t0: 1 }],
    cards: { title: 'Der eigentliche Stoß', date: '10. MAI 1940', stamps: [{ text: 'UNPASSIERBAR?', t0: 7.6 }] },
  },
  // 02:49.2–03:12.5 Sichelschnitt: Sedan -> Kanal (camera follows tip)
  m03b_sichel: {
    dur: 23.3, unitScale: 9, refW: 220, map: { zones: [{ poly: OCC_0510, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 4.9, lat: 49.75, w: 300, tilt: 36 }, { t: 1.5, follow: 'sichel', w: 300, tilt: 36 }, { t: 11.5, follow: 'sichel', w: 280, tilt: 36 }, { t: 17, lon: 2.4, lat: 50.3, w: 420, tilt: 32 }, { t: 23.3, lon: 2.6, lat: 50.45, w: 470, tilt: 30 }],
    arrows: [{ id: 'sichel', path: SICHEL.slice(2), t0: 0.6, t1: 11.5, width: 2.6 }],
    units: [{ id: 'gud', model: 'tank', side: 'de', path: SICHEL.slice(2), t0: 0.6, t1: 11.5, scale: 1.2 }],
    areas: [{ poly: [P(4.9, 49.55), P(4.9, 49.85), P(3.9, 49.85), P(3.1, 50.02), P(2.3, 50.02), P(1.6, 50.25), P(1.55, 50.0), P(2.3, 49.75), P(3.1, 49.6), P(4.0, 49.5)], color: '#E2A797', opacity: 0.85, t0: 12 }],
    pulses: [{ p: 'noyelles', t0: 12.5, out: 17, km: 12 }],
    labels: [{ p: 'sedan', text: 'Sedan', big: true, t0: 0 }, { p: 'stquentin', text: 'Saint-Quentin', t0: 3 }, { p: 'amiens', text: 'Amiens', t0: 6 }, { p: 'abbeville', text: 'Abbeville', t0: 9 },
      { p: 'noyelles', text: 'Noyelles', t0: 11.5, left: true }, { p: 'paris', text: 'Paris', t0: 0 }, { p: 'lille', text: 'Lille', t0: 0 }, { p: 'arras', text: 'Arras', t0: 0 }, { kind: 'sea', text: 'ÄRMELKANAL', lon: 1.1, lat: 50.5, size: 28 }],
    tags: [{ text: 'GUDERIAN', unit: 'gud', t0: 1, out: 11.4 }, { text: '2. PANZER-DIVISION (WIEN)', p: 'noyelles', t0: 12.6, dy: -80, dx: 120, out: 22 }],
    cards: { title: 'Der Sichelschnitt', date: '13.–20. MAI 1940', stamps: [{ text: 'DURCHGESCHNITTEN', t0: 17.2 }] },
  },
  // 03:35.6–03:51.3 Arras (21. Mai)
  m04_arras: {
    dur: 15.7, unitScale: 9, refW: 120, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.75, lat: 50.4, w: 220, tilt: 34 }, { t: 6, lon: 2.75, lat: 50.29, w: 110, tilt: 40 }, { t: 15.7, lon: 2.7, lat: 50.27, w: 95, tilt: 42, yaw: -8 }],
    arrows: [{ id: 'arr', path: [P(2.85, 50.40), P(2.68, 50.32), P(2.62, 50.24)], t0: 1, t1: 5, color: '#5d7a3c' }],
    units: [{ id: 'mat1', model: 'tank', side: 'al', path: [P(2.85, 50.40), P(2.68, 50.32), P(2.62, 50.24)], t0: 1, t1: 5 },
      { id: 'mat2', model: 'tank', side: 'al', path: [P(2.90, 50.37), P(2.74, 50.29), P(2.68, 50.22)], t0: 1.3, t1: 5.3 },
      { id: 'r7', model: 'tank', side: 'de', path: [P(2.55, 50.20)], t0: 7.5, heading: 120 }, { id: 'r7b', model: 'gun', side: 'de', path: [P(2.66, 50.17)], t0: 8, heading: 110 }],
    labels: [{ p: 'arras', text: 'Arras', big: true, t0: 0 }, { p: 'lens', text: 'Lens', t0: 0 }, { p: 'cambrai', text: 'Cambrai', t0: 0 }],
    tags: [{ text: 'MATILDA-PANZER', unit: 'mat1', t0: 2, out: 7 }, { text: '7. PANZER-DIV. · ROMMEL', unit: 'r7', t0: 8.2, dy: 80 }],
    cards: { title: 'Arras', date: '21. MAI 1940' },
  },
  // 04:03.7–04:19.8 Die dünne Panzerspitze
  m04b_korridor: {
    dur: 16.1, unitScale: 9, refW: 300, map: { zones: [{ poly: OCC_0510, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 3.3, lat: 50.1, w: 480, tilt: 30 }, { t: 16.1, lon: 3.0, lat: 50.1, w: 380, tilt: 34 }],
    areas: [{ poly: [P(4.9, 49.55), P(4.9, 49.85), P(3.9, 49.85), P(3.1, 50.05), P(2.3, 50.05), P(1.6, 50.25), P(1.55, 50.0), P(2.3, 49.75), P(3.1, 49.6), P(4.0, 49.5)], color: '#E2A797', opacity: 0.9, t0: 0 }],
    arrows: [{ id: 'n', path: [P(3.0, 50.75), P(3.05, 50.25)], t0: 9, t1: 11.5, color: '#5d7a3c' }, { id: 's', path: [P(3.1, 49.2), P(3.1, 49.65)], t0: 9.3, t1: 11.8, color: '#4a6684' }],
    pulses: [{ lon: 3.05, lat: 49.95, t0: 12, km: 25 }],
    labels: [{ p: 'paris', text: 'Paris', t0: 0 }, { p: 'arras', text: 'Arras', t0: 0 }, { p: 'sedan', text: 'Sedan', t0: 0 }, { p: 'abbeville', text: 'Abbeville', t0: 0 }],
    tags: [{ text: '300 KM LANG', lon: 3.2, lat: 49.8, t0: 3, dy: 70 }],
    cards: { title: 'Die Panzerspitze', date: '21. MAI 1940', stamps: [{ text: 'ABGESCHNITTEN?', t0: 12.2 }] },
  },
  // 04:50.6–05:03.0 Fall Rot: Somme, französische Armee im Süden
  m04c_fallrot: {
    dur: 12.4, unitScale: 9, refW: 300, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.8, lat: 50.2, w: 420, tilt: 30 }, { t: 12.4, lon: 2.6, lat: 49.6, w: 480, tilt: 32 }],
    units: [{ id: 'f1', model: 'soldier', side: 'fr', path: [P(2.0, 49.55)], t0: 3.6 }, { id: 'f2', model: 'tank', side: 'fr', path: [P(2.9, 49.5)], t0: 4.0 }, { id: 'f3', model: 'soldier', side: 'fr', path: [P(3.7, 49.4)], t0: 4.4 },
      { id: 'pzr', model: 'tank', side: 'de', path: [P(2.6, 49.95)], t0: 8.2, heading: -90 }],
    arrows: [{ id: 'rot', path: [P(2.6, 49.92), P(2.5, 49.4), P(2.4, 49.0)], t0: 8.6, t1: 11.6, dash: 6 }],
    labels: [{ p: 'paris', text: 'Paris', big: true, t0: 0 }, { p: 'amiens', text: 'Amiens', t0: 0 }, { p: 'abbeville', text: 'Abbeville', t0: 0 }, { kind: 'region', text: 'SOMME', lon: 2.6, lat: 49.98, size: 22, color: '#4f6f88', t0: 2 }],
    cards: { title: 'Fall Rot', date: '23. MAI 1940', stamps: [{ text: 'JEDER PANZER ZÄHLT', t0: 9.2 }] },
  },
  // 05:47.3–05:58.4 Haltelinie (Lens–Béthune–Aire–Saint-Omer–Gravelines)
  m05_halt: {
    dur: 11.1, unitScale: 8, refW: 120, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.6, lat: 50.6, w: 190, tilt: 34 }, { t: 4.9, lon: 2.6, lat: 50.55, w: 150, tilt: 36 }, { t: 11.1, lon: 2.35, lat: 50.8, w: 140, tilt: 36, yaw: -5 }],
    arrows: [{ id: 'halt', path: AA_LINE.slice().reverse(), t0: 4.9, t1: 10.9, dashed: false, head: false, width: 2.0, color: '#B8322A' }],
    units: [{ id: 'h1', model: 'tank', side: 'de', path: [P(2.70, 50.42)], t0: 5.2, heading: 60 }, { id: 'h2', model: 'tank', side: 'de', path: [P(2.50, 50.50)], t0: 6.4, heading: 60 },
      { id: 'h3', model: 'tank', side: 'de', path: [P(2.30, 50.60)], t0: 8.3, heading: 60 }, { id: 'h4', model: 'tank', side: 'de', path: [P(2.12, 50.78)], t0: 9.4, heading: 60 }, { id: 'h5', model: 'tank', side: 'de', path: [P(2.02, 50.92)], t0: 10.2, heading: 60 }],
    labels: [{ p: 'lens', text: 'Lens', t0: 4.9 }, { p: 'bethune', text: 'Béthune', t0: 6.3 }, { p: 'aire', text: 'Aire', t0: 8.1, left: true }, { p: 'stomer', text: 'Saint-Omer', t0: 9.0, left: true },
      { p: 'gravelines', text: 'Gravelines', t0: 9.9, left: true }, { p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }, { p: 'lille', text: 'Lille', t0: 0 }],
    cards: { title: 'Der Haltebefehl', date: '24. MAI 1940', stamps: [{ text: 'HALT!', t0: 1.0, out: 4.5, size: 80 }] },
  },
  // 06:18.6–06:34.7 Guderian am Aa-Kanal
  m06_aa: {
    dur: 16.1, unitScale: 7, refW: 60, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.25, lat: 50.85, w: 110, tilt: 38 }, { t: 7, lon: 2.25, lat: 50.92, w: 60, tilt: 46, yaw: -10 }, { t: 16.1, lon: 2.3, lat: 50.97, w: 52, tilt: 50, yaw: -14 }],
    units: [{ id: 'g1', model: 'tank', side: 'de', path: [P(2.17, 50.90)], t0: 0, heading: 30, pop: false }, { id: 'g2', model: 'tank', side: 'de', path: [P(2.21, 50.86)], t0: 0, heading: 30, pop: false },
      { id: 'g3', model: 'soldier', side: 'de', path: [P(2.195, 50.885)], t0: 0, heading: 30, pop: false }, { id: 'tower', model: 'building', path: [P(2.377, 51.034)], t0: 5, scale: 1.4 },
      { id: 'tower2', model: 'building', path: [P(2.36, 51.03)], t0: 5.3, scale: 1.0 }],
    arrows: [{ id: 'sight', path: [P(2.20, 50.89), P(2.36, 51.025)], t0: 6.5, t1: 9.5, color: '#3b3b3b', width: 0.6, dash: 1.5, head: false }],
    labels: [{ p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }, { p: 'gravelines', text: 'Gravelines', t0: 0, left: true }, { p: 'bergues', text: 'Bergues', t0: 0 }],
    tags: [{ text: 'BRÜCKENKOPF', unit: 'g1', t0: 2.6, out: 9, dy: 70 }, { text: '~ 15 KM', lon: 2.29, lat: 50.96, t0: 9.6, dy: -50 }],
    cards: { title: 'Am Aa-Kanal', date: '24. MAI 1940', stamps: [{ text: 'SPRACHLOS', t0: 11.6 }] },
  },
  // 07:28.3–07:43.3 Rückzug zur Küste, Verteidigungsring
  m07_perimeter: {
    dur: 15.0, unitScale: 8, refW: 100, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.7, lat: 50.75, w: 170, tilt: 34 }, { t: 15, lon: 2.5, lat: 51.0, w: 90, tilt: 40, yaw: -6 }],
    arrows: [{ id: 'r1', path: [P(3.0, 50.62), P(2.75, 50.85), P(2.55, 51.0)], t0: 0.5, t1: 5, color: '#5d7a3c' }, { id: 'r2', path: [P(2.75, 50.6), P(2.55, 50.8), P(2.45, 50.98)], t0: 1, t1: 5.5, color: '#5d7a3c' },
      { id: 'r3', path: [P(3.3, 50.85), P(3.0, 50.95), P(2.7, 51.05)], t0: 1.5, t1: 6, color: '#4a6684' }],
    rings: [{ path: PERIMETER, closed: false, t0: 7.5, t1: 12.5, color: '#3f5a2a', width: 1.6 }],
    units: [{ id: 'b1', model: 'soldier', side: 'al', path: [P(2.434, 50.958)], t0: 9, heading: 180 }, { id: 'b2', model: 'gun', side: 'al', path: [P(2.585, 50.97)], t0: 10, heading: 200 }, { id: 'b3', model: 'soldier', side: 'al', path: [P(2.33, 50.965)], t0: 11, heading: 200 }],
    labels: [{ p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }, { p: 'bergues', text: 'Bergues', t0: 6.5 }, { p: 'veurne', text: 'Veurne', t0: 0 }, { p: 'lille', text: 'Lille', t0: 0 }, { p: 'depanne', text: 'De Panne', t0: 0 }],
    tags: [{ text: 'VERTEIDIGUNGSRING', lon: 2.5, lat: 50.96, t0: 12, dy: 80 }],
    cards: { title: 'Stunde 12', clock: { h0: 11.5, h1: 12, t0: 0, t1: 1 } },
  },
  // 07:48.0–08:16.0 Boulogne, Calais, Lille
  m08_ringsum: {
    dur: 28.0, unitScale: 8, refW: 150, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 1.75, lat: 50.8, w: 140, tilt: 36 }, { t: 5.5, lon: 1.75, lat: 50.8, w: 120, tilt: 38 }, { t: 9.5, lon: 1.9, lat: 50.92, w: 110, tilt: 38 }, { t: 13, lon: 3.0, lat: 50.6, w: 140, tilt: 36 }, { t: 22, lon: 3.0, lat: 50.6, w: 120, tilt: 38 }, { t: 28, lon: 2.6, lat: 50.85, w: 220, tilt: 32 }],
    pulses: [{ p: 'boulogne', t0: 3.0, out: 9, km: 8 }, { p: 'calais', t0: 5.6, out: 13, km: 8 }, { p: 'lille', t0: 10.4, km: 14 }],
    units: [{ id: 'c1', model: 'tank', side: 'de', path: [P(1.95, 50.88)], t0: 6.2, heading: 160 }, { id: 'c2', model: 'soldier', side: 'al', path: [P(1.86, 50.955)], t0: 6.4 },
      { id: 'l1', model: 'soldier', side: 'fr', path: [P(3.06, 50.6)], t0: 10.6 }, { id: 'l2', model: 'tank', side: 'de', path: [P(3.3, 50.5)], t0: 12, heading: 150 }, { id: 'l3', model: 'tank', side: 'de', path: [P(2.85, 50.48)], t0: 12.3, heading: 40 }],
    labels: [{ p: 'boulogne', text: 'Boulogne', big: true, t0: 0 }, { p: 'calais', text: 'Calais', big: true, t0: 0 }, { p: 'lille', text: 'Lille', big: true, t0: 0 }, { p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }],
    tags: [{ text: 'FÄLLT 25. MAI', p: 'boulogne', t0: 4.2, out: 9, dy: 70 }, { text: 'HÄLT BIS 26. MAI', p: 'calais', t0: 6.8, out: 13, dy: -70 }, { text: 'HÄLT BIS 31. MAI', p: 'lille', t0: 12.0, dy: 80 }],
    cards: { title: 'Stunde 24', clock: { h0: 23.5, h1: 24, t0: 0, t1: 1 } },
  },
  // 08:25.0–08:46.0 Dynamo beginnt / Panzer rollen wieder
  m09_dynamo: {
    dur: 21.0, unitScale: 8, refW: 140, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 1.9, lat: 51.15, w: 190, tilt: 32 }, { t: 9, lon: 2.0, lat: 51.15, w: 170, tilt: 34 }, { t: 14, lon: 2.35, lat: 50.95, w: 120, tilt: 38 }, { t: 21, lon: 2.4, lat: 50.98, w: 105, tilt: 40 }],
    arrows: [{ id: 'z', path: [P(1.35, 51.11), P(1.8, 51.06), P(2.32, 51.05)], t0: 2.5, t1: 7, color: '#2f4f6a', dash: 3 },
      { id: 'y', path: [P(1.45, 51.30), P(2.2, 51.3), P(2.5, 51.2), P(2.38, 51.06)], t0: 3.0, t1: 8, color: '#2f4f6a', dash: 3 },
      { id: 'pz1', path: [P(2.17, 50.9), P(2.30, 50.96)], t0: 13.5, t1: 16.5 }, { id: 'pz2', path: [P(2.45, 50.75), P(2.47, 50.93)], t0: 14, t1: 17 }],
    units: [{ id: 's1', model: 'ship', kind: 'destroyer', path: [P(1.35, 51.11), P(1.8, 51.06), P(2.32, 51.05)], t0: 2.5, t1: 9 }, { id: 's2', model: 'ship', kind: 'boat', path: [P(1.45, 51.30), P(2.2, 51.3), P(2.5, 51.2), P(2.38, 51.06)], t0: 3, t1: 10 },
      { id: 'p1', model: 'tank', side: 'de', path: [P(2.17, 50.9), P(2.30, 50.96)], t0: 13.5, t1: 16.5 }, { id: 'p2', model: 'tank', side: 'de', path: [P(2.45, 50.75), P(2.47, 50.93)], t0: 14, t1: 17 }],
    rings: [{ path: PERIMETER, closed: false, t0: 0, color: '#3f5a2a', width: 1.4 }],
    labels: [{ p: 'dover', text: 'Dover', big: true, t0: 0 }, { p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }, { p: 'calais', text: 'Calais', t0: 0 }, { p: 'ramsgate', text: 'Ramsgate', t0: 0 }],
    tags: [{ text: '26. MAI · 18:57 UHR', lon: 1.6, lat: 51.2, t0: 6.5, out: 12.5, dy: -60 }, { text: 'PANZER ROLLEN WIEDER', unit: 'p2', t0: 15, dy: 80 }],
    cards: { title: 'Operation Dynamo', clock: { h0: 48, h1: 50, t0: 0, t1: 8, redAt: 48 }, stamps: [{ text: 'ZU SPÄT?', t0: 18 }] },
  },
  // 09:55.1–10:05.6 Belgien kapituliert – Lücke
  m10_belgien: {
    dur: 10.5, unitScale: 8, refW: 130, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.9, lat: 50.95, w: 170, tilt: 34 }, { t: 10.5, lon: 2.75, lat: 51.0, w: 130, tilt: 38 }],
    areas: [{ poly: [P(2.75, 51.13), P(2.92, 51.235), P(3.20, 51.34), P(3.56, 51.20), P(3.72, 51.05), P(3.45, 50.78), P(2.95, 50.80), P(2.88, 50.95)], color: '#E2A797', opacity: 0.92, t0: 1.0 }],
    arrows: [{ id: 'gap', path: [P(3.3, 51.0), P(2.95, 51.0)], t0: 3.5, t1: 6.5 }, { id: 'plug', path: [P(2.6, 50.85), P(2.80, 50.98)], t0: 7.5, t1: 9.8, color: '#5d7a3c' }],
    units: [{ id: 'pl', model: 'truck', side: 'al', path: [P(2.6, 50.85), P(2.80, 50.98)], t0: 7.5, t1: 9.8 }],
    labels: [{ p: 'nieuwpoort', text: 'Nieuwpoort', t0: 0 }, { p: 'ypern', text: 'Ypern', t0: 0 }, { p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }, { kind: 'region', text: 'BELGIEN', lon: 3.4, lat: 51.05, size: 28, color: '#7a2e25', t0: 1 }],
    tags: [{ text: 'LÜCKE · 30 KM', lon: 2.92, lat: 50.95, t0: 4.6, dy: 70 }],
    cards: { title: 'Belgien kapituliert', date: '28. MAI 1940' },
  },
  // 11:31.4–12:00.8 Flandern: nasses Land, Kanäle, geflutet
  m11_flandern: {
    dur: 29.4, unitScale: 8, refW: 90, map: { zones: [{ poly: OCC_0524, color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.5, lat: 50.95, w: 120, tilt: 40 }, { t: 9, lon: 2.75, lat: 50.9, w: 150, tilt: 36 }, { t: 18, lon: 2.85, lat: 50.86, w: 90, tilt: 42 }, { t: 29.4, lon: 2.4, lat: 50.9, w: 80, tilt: 44 }],
    areas: [{ poly: [P(2.40, 50.99), P(2.62, 51.0), P(2.70, 51.06), P(2.55, 51.08), P(2.40, 51.03)], color: '#7FA3C6', opacity: 0.65, t0: 4.5 }, { poly: [P(2.72, 51.1), P(2.85, 51.06), P(2.82, 51.0), P(2.70, 51.04)], color: '#7FA3C6', opacity: 0.65, t0: 5 }],
    pulses: [{ p: 'ypern', t0: 12.5, out: 19, km: 7 }],
    units: [{ id: 'sold14', model: 'soldier', side: 'de', path: [P(2.86, 50.85)], t0: 11.5, out: 19 }, { id: 'td', model: 'tank', side: 'de', path: [P(2.25, 50.85), P(2.35, 50.94), P(2.40, 50.97)], t0: 23.5, t1: 28.5 }],
    arrows: [{ id: 'damm', path: [P(2.25, 50.85), P(2.35, 50.94), P(2.40, 50.97)], t0: 23.5, t1: 28.5 }],
    labels: [{ p: 'ypern', text: 'Ypern', big: true, t0: 11 }, { p: 'duenkirchen', text: 'Dünkirchen', big: true, t0: 0 }, { p: 'bergues', text: 'Bergues', t0: 0 }, { kind: 'region', text: 'FLANDERN', lon: 2.65, lat: 50.9, size: 30, t0: 1 }],
    tags: [{ text: 'GEFLUTET', lon: 2.55, lat: 51.03, t0: 5.5, out: 11, dy: -60 }, { text: '1914: GEFREITER HITLER', p: 'ypern', t0: 13.2, out: 19, dy: 80 }, { text: 'STRASSEN & DÄMME', unit: 'td', t0: 24.5, dy: 70 }],
    cards: { title: 'Erklärung 2: Das Gelände' },
  },
  // 16:00.4–16:06.6 England allein
  m12_england: {
    dur: 6.2, unitScale: 8, refW: 300, map: { zones: [{ poly: OCC_0524.concat([]), color: '#E2A797' }, { poly: [P(-5, 46), P(14, 46), P(14, 50.1), P(1.2, 50.1), P(-5, 48.5)], color: '#E2A797' }] },
    cam: [{ t: 0, lon: 2.0, lat: 50.4, w: 520, tilt: 30 }, { t: 6.2, lon: 0.6, lat: 51.2, w: 420, tilt: 34, yaw: 6 }],
    labels: [{ kind: 'region', text: 'ENGLAND', lon: -0.6, lat: 51.9, size: 40, color: '#43572f', t0: 0.5 }, { kind: 'sea', text: 'ÄRMELKANAL', lon: 0.6, lat: 50.45, size: 30 }, { p: 'london', text: 'London', big: true, t0: 0 }, { p: 'dover', text: 'Dover', t0: 0 }],
    cards: { title: 'Allein', date: 'JUNI 1940', stamps: [{ text: 'UNERREICHBAR?', t0: 2.6 }] },
  },
};
