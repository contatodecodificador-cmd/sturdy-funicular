import {feature, mesh} from 'topojson-client';
import {geoCentroid, geoMercator, geoOrthographic, geoPath, GeoProjection} from 'd3-geo';
// @ts-ignore
import world from 'world-atlas/countries-50m.json';

const topo: any = world;
const all: any[] = (feature(topo, topo.objects.countries) as any).features;

export const brasil = all.find((f) => f.id === '076');
export const americaSul = all.filter((f) => {
  const [lon, lat] = geoCentroid(f);
  return lon < -33 && lon > -90 && lat < 13 && lat > -60;
});
export const africa = all.filter((f) => {
  const [lon, lat] = geoCentroid(f);
  return lon > -20 && lon < 52 && lat > -36 && lat < 38 && !(lat > 30 && lon > 30);
});
export const mundo = all;
export const fronteiras = mesh(topo, topo.objects.countries, (a: any, b: any) => a !== b);

export const mercator = (center: [number, number], scale: number, w = 1920, h = 1080) =>
  geoMercator().center(center).scale(scale).translate([w / 2, h / 2]);
export const orto = (rot: [number, number], scale: number, w = 1920, h = 1080) =>
  geoOrthographic().rotate(rot).scale(scale).translate([w / 2, h / 2]).clipAngle(90);

export const pathOf = (proj: GeoProjection) => geoPath(proj);
export const pt = (proj: GeoProjection, lon: number, lat: number) => proj([lon, lat]) as [number, number];
