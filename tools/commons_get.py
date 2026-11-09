"""Download Wikimedia Commons files by exact name via upload.wikimedia.org (no API). usage: commons_get.py listfile outdir"""
import hashlib, urllib.parse, urllib.request, sys, os, time
UA = "HistoryDocVideoBot/1.0 (https://www.mediawiki.org/wiki/API:Etiquette; educational documentary) python-urllib/3.13"
lst, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
for line in open(lst, encoding="utf-8"):
    line = line.strip()
    if not line or line.startswith("#"): continue
    key, name = line.split("|", 1) if "|" in line else (None, line)
    name = name.strip().replace(" ", "_")
    h = hashlib.md5(name.encode()).hexdigest()
    ext = os.path.splitext(name)[1].lower()
    q = urllib.parse.quote(name)
    if ext in (".jpg", ".jpeg", ".png"):
        url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/1920px-{q}"
    elif ext == ".webm" and "--transcode" in sys.argv:
        url = f"https://upload.wikimedia.org/wikipedia/commons/transcoded/{h[0]}/{h[:2]}/{q}/{q}.1080p.vp9.webm"
    else:
        url = f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{q}"
    dest = os.path.join(out, (key.strip() + ext) if key else name)
    if os.path.exists(dest) and os.path.getsize(dest) > 10000: print("skip", dest); continue
    for i in range(12):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=600) as r, open(dest + ".part", "wb") as f:
                while True:
                    b = r.read(1 << 20)
                    if not b: break
                    f.write(b)
            os.replace(dest + ".part", dest); print("ok", dest, os.path.getsize(dest) // 1024, "KB"); break
        except Exception as e:
            print("  retry", i, name[:60], e); time.sleep(min(600, 60 * (i + 1)))
    else:
        print("FAIL", name)
    time.sleep(20)
