import json,re,sys,urllib.request
n=int(sys.argv[1])
txt=open('texto_para_IA_partes.txt').read()
parts=[p.strip() for p in re.split(r'===== PARTE \d de 4[^\n]*=====',txt) if p.strip()]
t=parts[n-1]
body={"text":t,"model_id":"eleven_v4","language_code":"pt",
      "voice_settings":{"stability":0.5,"similarity_boost":0.8,"style":0.0,"use_speaker_boost":True}}
req=urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/jZ0KzfdIFfYFdHDyYgUn?output_format=mp3_44100_192",
  data=json.dumps(body).encode(),headers={"xi-api-key":"x","Content-Type":"application/json"})
try:
  r=urllib.request.urlopen(req,timeout=600); open(f'audio/parte{n}.mp3','wb').write(r.read()); print('ok',n,len(t))
except urllib.error.HTTPError as e: print(e.code,e.read()[:500])
