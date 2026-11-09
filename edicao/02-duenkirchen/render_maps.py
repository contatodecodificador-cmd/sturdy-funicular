import json, os, subprocess, concurrent.futures as cf
HERE=os.path.dirname(os.path.abspath(__file__)); S=json.load(open(f'{HERE}/edl.json'))
OUT=f'{HERE}/render/maps'; os.makedirs(OUT,exist_ok=True)
ENG=f'{HERE}/../../tools/mapengine/render.js'
jobs=[]
for i,s in enumerate(S,1):
    if s['type']!='M': continue
    sc,off=(s['src'].split('@')+['0'])[:2]
    out=f'{OUT}/{i:03d}_{sc}.mp4'
    if os.path.exists(out): continue
    jobs.append((sc,float(off),s['t1']-s['t0']+0.4,out))
jobs.sort(key=lambda j:-j[2])
def run(j):
    sc,off,ln,out=j
    r=subprocess.run(['node',ENG,sc,out+'.tmp.mp4','--from',str(off),'--len',f'{ln:.2f}'],capture_output=True,text=True)
    if r.returncode==0: os.replace(out+'.tmp.mp4',out)
    return out, r.returncode, r.stderr[-200:]
with cf.ThreadPoolExecutor(3) as ex:
    for out,rc,err in ex.map(run,jobs): print(rc, os.path.basename(out), '' if rc==0 else err, flush=True)
print('MAPSDONE')
