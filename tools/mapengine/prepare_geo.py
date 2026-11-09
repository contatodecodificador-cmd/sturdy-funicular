"""Clip Natural Earth data to the Western-Front-1940 region and export compact JSON for the map engine."""
import json, sys, os
import shapefile
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union

ND = os.path.join(os.path.dirname(__file__), "../../assets/mapdata")
BBOX = box(-6.0, 46.0, 14.0, 55.5)  # lon/lat


def load(name):
    r = shapefile.Reader(os.path.join(ND, name, name + ".shp"), encoding="utf-8")
    fields = [f[0] for f in r.fields[1:]]
    for sr in r.iterShapeRecords():
        yield dict(zip(fields, sr.record)), shape(sr.shape.__geo_interface__)


def rnd(geom, tol):
    g = geom.simplify(tol, preserve_topology=True)
    m = mapping(g)

    def r(c):
        if isinstance(c[0], (float, int)):
            return [round(c[0], 4), round(c[1], 4)]
        return [r(x) for x in c]
    return {"type": m["type"], "coordinates": r(m["coordinates"])}


out = {"bbox": list(BBOX.bounds), "countries": {}, "lakes": [], "rivers": [], "cities": []}
# 1940 political grouping
REICH = {"Germany", "Austria", "Czechia", "Luxembourg"}  # Luxembourg occupied 10 May; drawn separately below
for rec, g in load("ne_10m_admin_0_countries"):
    n = rec["ADMIN"]
    if not g.intersects(BBOX):
        continue
    out["countries"][n] = rnd(g.intersection(BBOX), 0.004)

for rec, g in load("ne_10m_lakes"):
    if g.intersects(BBOX) and g.area > 0.002:
        out["lakes"].append(rnd(g.intersection(BBOX), 0.003))

KEEP_RIVERS = {"Rhine", "Rhein", "Meuse", "Maas", "Somme", "Seine", "Scheldt", "Schelde", "Escaut", "Moselle", "Mosel",
               "Oise", "Aisne", "Marne", "Thames", "Lys", "Aa", "Sambre", "Waal", "Main", "Neckar", "Saar", "Loire", "Yser"}
for rec, g in load("ne_10m_rivers_lake_centerlines"):
    nm = rec.get("name") or rec.get("NAME") or ""
    if g.intersects(BBOX) and (nm in KEEP_RIVERS or (rec.get("scalerank", 9) <= 6)):
        out["rivers"].append({"name": nm, "geom": rnd(g.intersection(BBOX), 0.003)})

json.dump(out, open(os.path.join(os.path.dirname(__file__), "geo_west1940.json"), "w"), separators=(",", ":"))
print("countries:", list(out["countries"].keys()))
print("rivers:", sorted({r['name'] for r in out['rivers']}))
print(os.path.getsize(os.path.join(os.path.dirname(__file__), "geo_west1940.json")) // 1024, "KB")
