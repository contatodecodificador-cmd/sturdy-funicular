import json, sys, time, urllib.request, urllib.parse
UA = "HistoryDocVideo/1.0 (educational documentary research; python-urllib)"
API = "https://commons.wikimedia.org/w/api.php"
def get(params, tries=6):
    url = API + "?" + urllib.parse.urlencode(params)
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.loads(r.read())
        except Exception as e:
            wait = 5 * 2**i
            print(f"  retry {i} ({e}); wait {wait}s", file=sys.stderr)
            time.sleep(wait)
    return {}
queries = [l.strip() for l in open(sys.argv[1]) if l.strip()]
out = {}
for q in queries:
    d = get({"action":"query","format":"json","generator":"search","gsrsearch":q,"gsrnamespace":6,
             "gsrlimit":25,"prop":"imageinfo","iiprop":"url|size|extmetadata|mime","iiurlwidth":1920})
    res = []
    for p in (d.get("query",{}).get("pages",{}) or {}).values():
        ii = (p.get("imageinfo") or [{}])[0]; md = ii.get("extmetadata",{})
        res.append({"title":p["title"],"url":ii.get("url"),"thumb":ii.get("thumburl"),"w":ii.get("width"),"h":ii.get("height"),
            "mime":ii.get("mime"),"license":md.get("LicenseShortName",{}).get("value"),
            "artist":md.get("Artist",{}).get("value","")[:120],"desc":md.get("ImageDescription",{}).get("value","")[:200],
            "page":ii.get("descriptionurl")})
    out[q]=res
    print(q, len(res), file=sys.stderr)
    time.sleep(3)
json.dump(out, open(sys.argv[2],"w"), indent=1, ensure_ascii=False)
