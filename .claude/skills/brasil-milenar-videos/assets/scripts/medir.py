import sys,subprocess,numpy as np
f=sys.argv[1]
raw=subprocess.run(["ffmpeg","-loglevel","error","-i",f,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
x=np.frombuffer(raw,np.int16).astype(np.float32)/32768
w=16000//10; e=np.array([np.sqrt((x[i:i+w]**2).mean()) for i in range(0,len(x)-w,w)])
db=20*np.log10(e+1e-9); speech=db>-45
blk=[]
for s in range(0,len(db),300):
    seg=db[s:s+300][speech[s:s+300]]
    blk.append(np.percentile(seg,75) if len(seg)>20 else np.nan)
blk=np.array(blk); v=blk[~np.isnan(blk)]
print("nivel de fala por bloco 30s (dB):",np.round(blk,1).tolist())
print("desvio:",round(v.std(),2),"faixa:",round(v.max()-v.min(),1))
