import json,sys,os,urllib.request
VOICE="jZ0KzfdIFfYFdHDyYgUn"; MODEL="eleven_multilingual_v2"
b=json.load(open('tts_blocos.json'))
ids=json.load(open('audio/request_ids.json')) if os.path.exists('audio/request_ids.json') else {}
for i in [int(x) for x in sys.argv[1:]]:
    out=f'audio/{i:02d}.mp3'
    if os.path.exists(out): print(i,'já existe, pulando'); continue
    body={"text":b[i]['texto'],"model_id":MODEL,
          "voice_settings":{"stability":0.5,"similarity_boost":0.75,"style":0.0,"use_speaker_boost":True},
          "previous_text":b[i-1]['texto'][-300:] if i>0 else None,
          "next_text":b[i+1]['texto'][:300] if i+1<len(b) else None}
    prev=[ids[str(i-1)]] if str(i-1) in ids else []
    if prev: body["previous_request_ids"]=prev
    req=urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),headers={"xi-api-key":"proxy-injected","Content-Type":"application/json"})
    try:
        with urllib.request.urlopen(req,timeout=180) as r:
            open(out,'wb').write(r.read()); ids[str(i)]=r.headers.get('request-id')
            print(i,'ok',os.path.getsize(out),'bytes', 'chars',r.headers.get('character-cost'))
    except urllib.error.HTTPError as e:
        print(i,'ERRO',e.code,e.read()[:300]); break
    json.dump(ids,open('audio/request_ids.json','w'))
