import json,sys,time,subprocess,urllib.parse,os,re
S=sys.argv[1]; Q=json.load(open(f'{S}/queries.json'))
UA='ClaudeCode-StoryboardTool/1.0 (https://claude.ai/code; educational video research)'
def curl(url):
    r=subprocess.run(['curl','-sS','-A',UA,'-w','\n%{http_code}',url],capture_output=True,text=True)
    body,code=r.stdout.rsplit('\n',1); return code,body
tf=f'{S}/titles.json'; T=json.load(open(tf)) if os.path.exists(tf) else {}
for key,qs in Q.items():
    if key in T and len(T[key])>=4: continue
    titles=[]
    for q in qs[:2]:
        typ='video' if 'filetype:video' in q else 'image'; q=q.replace(' filetype:video','')
        code,body=curl('https://commons.wikimedia.org/w/index.php?'+urllib.parse.urlencode({'search':q,'title':'Special:MediaSearch','type':typ}))
        for m in re.findall(r'File:[^"&\\<>]+?\.(?:jpe?g|png|webm|ogv|tiff?|gif|webp)',body,re.I):
            m=urllib.parse.unquote(m).replace('_',' ')
            if m not in titles: titles.append(m)
        time.sleep(1.5)
        if len(titles)>=6: break
    T[key]=titles[:8]; json.dump(T,open(tf,'w'),ensure_ascii=False); print('S',key,len(titles),flush=True)
info=json.load(open(f'{S}/info.json')) if os.path.exists(f'{S}/info.json') else {}
allt=[t for v in T.values() for t in v if t not in info]
for i in range(0,len(allt),45):
    b=allt[i:i+45]
    url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','titles':'|'.join(b),'iiprop':'url|extmetadata|size|mime','iiurlwidth':500})
    for a in range(20):
        code,body=curl(url)
        if code=='200': break
        print(code,flush=True); time.sleep(30)
    d=json.loads(body) if code=='200' else {}
    norm={x['to']:x['from'] for x in d.get('query',{}).get('normalized',[])}
    for p in d.get('query',{}).get('pages',{}).values():
        if 'imageinfo' not in p: continue
        ii=p['imageinfo'][0];m=ii.get('extmetadata',{})
        info[p['title']]={'url':ii['url'],'thumb':ii.get('thumburl'),'w':ii['width'],'h':ii['height'],'mime':ii['mime'],
          'lic':m.get('LicenseShortName',{}).get('value',''),'artist':re.sub('<[^>]+>','',m.get('Artist',{}).get('value','')).strip()[:80],'page':ii.get('descriptionurl')}
    json.dump(info,open(f'{S}/info.json','w'),ensure_ascii=False); print('I',i,len(info),flush=True); time.sleep(8)
OK=('cc0','public domain','pd','cc by','cc-by','attribution','no restrictions')
C={}
for key,ts in T.items():
    res=[]
    for t in ts:
        x=info.get(t)
        if not x: continue
        l=x['lic'].lower(); toks=re.split('[- ]',l)
        if 'nc' in toks or 'nd' in toks or 'fair' in l or not any(o in l for o in OK): continue
        res.append(dict(title=t,**x))
    C[key]=res
json.dump(C,open(f'{S}/cands.json','w'),ensure_ascii=False); print('DONE',flush=True)
