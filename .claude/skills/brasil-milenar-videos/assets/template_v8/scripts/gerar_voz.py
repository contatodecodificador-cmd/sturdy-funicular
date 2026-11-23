"""Narração do vídeo 8 no ElevenLabs v4, voz profissional (PVC) Anderson Nogueira, em partes por parágrafo."""
import json, sys, urllib.request
VOZ = 'yadCDjzaN5V6nqbIkYiU'
pars = [p for p in open('texto_para_IA.txt').read().split('\n\n') if p.strip()]
# partes: intro (até "...caiu no Curuçá?") e o corpo em blocos de até ~3.800 caracteres
fim_intro = next(i for i, p in enumerate(pars) if 'caiu no Curuçá?' in p) + 1
partes, atual = [pars[:fim_intro]], []
for p in pars[fim_intro:]:
    if atual and sum(len(x) + 2 for x in atual) + len(p) > 3800: partes.append(atual); atual = []
    atual.append(p)
partes.append(atual)
quais = [int(x) for x in sys.argv[1:]] or range(len(partes))
for i in quais:
    t = '\n\n'.join(partes[i])
    body = {"text": t, "model_id": "eleven_v4", "language_code": "pt",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.0, "use_speaker_boost": True}}
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_192",
                                 data=json.dumps(body).encode(), headers={"xi-api-key": "x", "Content-Type": "application/json"})
    open(f'audio/parte{i}.mp3', 'wb').write(urllib.request.urlopen(req, timeout=600).read())
    print('parte', i, len(t), 'caracteres')
print('total de partes:', len(partes), [sum(len(x) for x in p) for p in partes])
