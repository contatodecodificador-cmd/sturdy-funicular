import json,urllib.request,os,sys
M={
"1_intro":("Cinematic ambient documentary intro. Low pulsing synth drones, deep sub bass swells, slow rising tension, sparse distant piano notes, mysterious and vast. No drums, no vocals. Builds slowly then settles.",60000),
"2_ato1":("Minimal ambient documentary underscore. Warm soft pads, gentle sparse piano motif, curious and calm, slow tempo around 70 bpm, light and hopeful. No drums, no vocals. Steady, loopable, no big climax.",120000),
"3_ato2":("Ethereal space ambient underscore. Airy evolving pads, soft shimmering textures, slow and contemplative, sense of vastness and wonder under a southern night sky. No drums, no vocals. Steady, loopable, no big climax.",120000),
"4_ato3":("Dark cinematic ambient underscore. Deep low drones, slow tectonic rumble, subtle pulse, gradually growing tension, serious and grand. No drums, no vocals. Steady, loopable, no big climax.",120000),
"5_fecho":("Emotional ambient documentary ending. Gentle piano with soft strings, hopeful and reflective, slow gentle swell, warm resolution. No drums, no vocals.",80000),
}
for k in sys.argv[1:]:
    p,ms=M[k]; out=f"musica/{k}.mp3"
    if os.path.exists(out): print(k,'existe'); continue
    body={"prompt":p,"music_length_ms":ms,"model_id":"music_v1","force_instrumental":True}
    req=urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",data=json.dumps(body).encode(),headers={"xi-api-key":"proxy-injected","Content-Type":"application/json"})
    try:
        with urllib.request.urlopen(req,timeout=600) as r: open(out,'wb').write(r.read()); print(k,'ok',os.path.getsize(out))
    except urllib.error.HTTPError as e: print(k,'ERRO',e.code,e.read()[:300]); break
