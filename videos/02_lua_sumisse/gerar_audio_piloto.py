"""Gera trilhas (ElevenLabs Music) e efeitos (Sound Effects) do piloto. Pula o que já existe."""
import json,urllib.request,os,sys
from concurrent.futures import ThreadPoolExecutor
H={"xi-api-key":"proxy-injected","Content-Type":"application/json"}
M={
 "m1_intro":("Mysterious cinematic documentary intro underscore. Deep warm sub bass pulse, low evolving synth drones, distant sparse piano notes, rising suspense and wonder, slow 70 bpm, no drums, no vocals. Builds gently, sparse and spacious, leaving room for narration.",42000),
 "m2_luz":("Curious light documentary underscore, soft ticking clock-like pluck pattern, warm pads, gentle pizzicato strings, inquisitive and calm, slow 80 bpm, no drums, no vocals. Minimal, steady, loopable, ends fading into darkness.",32000),
 "m3_escuro":("Dark sparse ambient underscore, very low drone, faint night atmosphere, slow and suspenseful, minimal, almost silent, no melody, no drums, no vocals.",30000),
 "m4_estrelas":("Ethereal wonder ambient underscore, airy shimmering pads, soft celesta twinkles, slow evolving, sense of vastness under a starry sky, hopeful, no drums, no vocals. Steady, gentle swell.",40000),
}
S={
 "pororoca":("distant rumbling river tidal bore wave rushing upstream, low water roar, calm, cinematic, subtle",6),
 "apagar":("soft deep cinematic whoomp, a light fading out, airy low swell with gentle tail, subtle",2.5),
 "tic":("single soft mechanical stopwatch click, clean, quiet",0.6),
 "cronometro":("soft stopwatch ticking seconds, quiet, clean, subtle",4),
 "whoosh":("very soft airy whoosh transition, smooth, subtle",1.2),
 "pulso":("soft shimmering light pulse traveling, gentle sci-fi sweep, subtle, quiet",1.5),
 "grilos":("night in the Brazilian sertão, crickets and distant insects, calm, quiet ambience",10),
 "brilho":("gentle magical sparkle twinkle shimmer, stars appearing, soft, subtle",3),
 "impacto":("deep distant soft cinematic boom, low rumble, subtle",3),
 "pop":("very soft subtle UI pop, gentle, minimal",0.5),
}
def music(k):
    out=f"musica/{k}.mp3"
    if os.path.exists(out): return k+' existe'
    p,ms=M[k]; body={"prompt":p,"music_length_ms":ms,"model_id":"music_v1","force_instrumental":True}
    r=urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",data=json.dumps(body).encode(),headers=H)
    try:
        with urllib.request.urlopen(r,timeout=600) as x: open(out,'wb').write(x.read())
        return k+' ok'
    except urllib.error.HTTPError as e: return f'{k} ERRO {e.code} {e.read()[:300]}'
def sfx(k):
    out=f"sfx/{k}.mp3"
    if os.path.exists(out): return k+' existe'
    p,d=S[k]; body={"text":p,"duration_seconds":d,"prompt_influence":0.5}
    r=urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",data=json.dumps(body).encode(),headers=H)
    try:
        with urllib.request.urlopen(r,timeout=300) as x: open(out,'wb').write(x.read())
        return k+' ok'
    except urllib.error.HTTPError as e: return f'{k} ERRO {e.code} {e.read()[:300]}'
with ThreadPoolExecutor(1) as ex:
    for r in ex.map(sfx,S): print(r,flush=True)
    for r in ex.map(music,M): print(r,flush=True)
