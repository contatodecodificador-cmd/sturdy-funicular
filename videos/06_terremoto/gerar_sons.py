import json,urllib.request,os,time
H={"xi-api-key":"x","Content-Type":"application/json"}
N=" Instrumental only, no vocals, subtle documentary underscore, no sudden loud hits."
MUS={"m1_abertura":("Mysterious, tense documentary opening: near silence with a low sub drone and faint metallic creaks, a slow uneasy pulse enters like distant tremors, cold sparse piano notes, tension grows steadily, at about 45 seconds a deep rumbling swell rises, then settles into a curious suspenseful bed with a soft ticking rhythm until the end."+N,95000)}
SFX={"lustre":("old chandelier chain creaking slowly while swinging, quiet room",3.0),
"ronco":("deep low earthquake rumble, distant, building softly, no crash",4.0),
"agulha":("seismograph pen scratching on paper, fast mechanical scribble, quiet",2.5),
"passos":("people walking quickly down a stairwell and out of a building, muffled voices, calm evacuation",4.0),
"marcatexto":("highlighter marker swipe on paper, single stroke",1.0),
"copo":("glass of water gently clinking on a wooden table from a small vibration",1.5),
"whoosh":("soft cinematic whoosh transition",1.0)}
def post(url,body,out):
    req=urllib.request.Request(url,data=json.dumps(body).encode(),headers=H)
    for a in range(4):
        try:
            with urllib.request.urlopen(req,timeout=900) as r: open(out,'wb').write(r.read()); print(out,'ok',flush=True); return
        except urllib.error.HTTPError as e: print(out,'ERRO',e.code,e.read()[:150],flush=True); time.sleep(10)
for k,(p,d) in SFX.items():
    if not os.path.exists(f'sfx/{k}.mp3'): post("https://api.elevenlabs.io/v1/sound-generation",{"text":p,"duration_seconds":d,"prompt_influence":0.5},f'sfx/{k}.mp3')
for k,(p,ms) in MUS.items():
    if not os.path.exists(f'musica/{k}.mp3'): post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192",{"prompt":p,"music_length_ms":ms,"model_id":"music_v1","force_instrumental":True},f'musica/{k}.mp3')
