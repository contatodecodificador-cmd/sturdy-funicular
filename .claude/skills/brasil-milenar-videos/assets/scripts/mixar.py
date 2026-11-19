import json,subprocess
D=json.load(open('render/src/data.json'))
P=[p['t'] for p in D['paragrafos']]; S=[s['start'] for s in D['segmentos']]
FIM=D['fim_audio']+4.0
# trilhas: (arquivo, inicio, fim, volume_base)
TR=[('musica/1_intro.mp3',0,S[1]+2.5,1.25),('musica/2_ato1.mp3',S[1]-1,S[6]+1.5,1.0),
    ('musica/3_ato2.mp3',S[6]-0.5,S[13]+1.5,1.0),('musica/4_ato3.mp3',S[13]-0.5,S[20]+1.5,1.0),('musica/5_fecho.mp3',S[20]-1,FIM,1.1)]
cont=[0.1,P[1],P[4],P[8],P[13],P[18],P[23],P[28],P[29],P[33],P[38],P[42],P[46],P[50],P[55],P[56],P[63],P[67],P[71],P[75],P[79]]
SFX=[('sfx/contador.mp3',t,0.16) for t in cont]
SFX+=[('sfx/whoosh.mp3',t-0.6,0.22) for t in [S[1],S[6],S[13],S[20]]]
imp=[e['t'] for e in D['eventos']['palavra'] if e['cor']=='impacto']
SFX+=[('sfx/pop.mp3',t,0.10) for t in imp]
SFX+=[('sfx/ondas.mp3',S[1],0.16),('sfx/ondas.mp3',S[16],0.14),('sfx/ondas.mp3',P[88],0.16),
      ('sfx/impacto.mp3',S[15]+3.0,0.32),('sfx/vento_espaco.mp3',S[8],0.13),('sfx/vento_espaco.mp3',S[11],0.12),('sfx/calor.mp3',P[83]+4,0.18)]
args=['ffmpeg','-y','-loglevel','error','-i','voz_tratada.wav']
fl=[]; n=1; mus=[]
for f,a,b,v in TR:
    args+=['-stream_loop','-1','-i',f]; L=b-a
    fl.append(f"[{n}:a]atrim=0:{L:.2f},asetpts=PTS-STARTPTS,loudnorm=I=-23:TP=-3,volume={v},afade=t=in:d=2.5,afade=t=out:st={L-3:.2f}:d=3,adelay={int(a*1000)}|{int(a*1000)},apad=whole_dur={FIM}[m{n}]")
    mus.append(f"[m{n}]"); n+=1
fl.append("".join(mus)+f"amix=inputs={len(mus)}:normalize=0,atrim=0:{FIM}[mus]")
sf=[]
for f,t,v in SFX:
    args+=['-i',f]; d=int(max(0,t)*1000)
    fl.append(f"[{n}:a]volume={v},adelay={d}|{d}[s{n}]"); sf.append(f"[s{n}]"); n+=1
fl.append("".join(sf)+f"amix=inputs={len(sf)}:normalize=0,apad=whole_dur={FIM},atrim=0:{FIM}[sfx]")
fl.append(f"[0:a]aformat=channel_layouts=stereo,apad=whole_dur={FIM},atrim=0:{FIM},asplit=2[voz][sc]")
fl.append("[mus]aformat=channel_layouts=stereo[mus2]")
fl.append("[mus2][sc]sidechaincompress=threshold=0.04:ratio=5:attack=40:release=500:makeup=1[duck]")
fl.append("[voz][duck][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1:LRA=9[out]")
args+=['-filter_complex',';'.join(fl),'-map','[out]','-ar','48000','-c:a','pcm_s16le','mix_final.wav']
subprocess.run(args,check=True)
print('ok',len(SFX),'efeitos')
