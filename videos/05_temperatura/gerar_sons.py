import json,urllib.request,os,sys,time
H={"xi-api-key":"x","Content-Type":"application/json"}
MUS={
"m1_corredor":("Dark cinematic documentary intro score. Opens with near silence, a deep breath-like low drone and faint icy glass textures; a slow heartbeat-like sub pulse enters; tension builds steadily with cold shimmering high strings on one side and warm low brass rumble on the other; at around 45 seconds a restrained rhythmic pulse grows into a big suspenseful swell, then drops to a calm, curious minimal piano motif for the last 15 seconds. No vocals, no heavy drums.",80000),
}
SFX={
"respiracao":("a single slow deep human breath in the dark, close and intimate, quiet",2.5),
"gelo":("ice cracking and creaking softly, frozen corridor, cold wind hiss",3.5),
"fogo":("low fire crackle and heat roar, embers popping, close",3.5),
"porta":("heavy metal door handle turning and door creaking open slowly",2.5),
"passagem":("fast cinematic whoosh pass-by, airy, subtle",1.5),
"coracao":("two slow heartbeats, deep and soft, cinematic",2.0),
"carimbo":("rubber stamp hitting paper, single clean thud",1.0),
"monitor":("hospital heart monitor beeping, three beeps, soft",2.5),
}
def post(url,body,out):
    req=urllib.request.Request(url,data=json.dumps(body).encode(),headers=H)
    for a in range(4):
        try:
            with urllib.request.urlopen(req,timeout=600) as r: open(out,'wb').write(r.read()); print(out,'ok',os.path.getsize(out)); return
        except urllib.error.HTTPError as e:
            print(out,'ERRO',e.code,e.read()[:200]); time.sleep(8)
for k,(p,ms) in MUS.items():
    if not os.path.exists(f'musica/{k}.mp3'): post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192",{"prompt":p,"music_length_ms":ms,"model_id":"music_v1","force_instrumental":True},f'musica/{k}.mp3')
for k,(p,d) in SFX.items():
    if not os.path.exists(f'sfx/{k}.mp3'): post("https://api.elevenlabs.io/v1/sound-generation",{"text":p,"duration_seconds":d,"prompt_influence":0.5},f'sfx/{k}.mp3')
