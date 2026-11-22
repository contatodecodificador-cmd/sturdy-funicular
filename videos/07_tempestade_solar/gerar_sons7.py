"""Trilhas por bloco + efeitos do vídeo 7 (ElevenLabs: music_v1 e sound-generation)."""
import json, urllib.request, os, time
H = {"xi-api-key": "x", "Content-Type": "application/json"}
N = " Instrumental only, no vocals, subtle documentary underscore that sits under narration, no sudden loud hits, no drops."
MUS = {
 "m1_intro": ("Cinematic space documentary opening: quiet deep drone, slow ticking clock pulse, distant shimmering synths, tension slowly building like a countdown, a soft swell around 26 seconds then a steady anxious pulse, restrained and elegant." + N, 92000),
 "m2_ondas": ("Curious and awe-filled science documentary bed about the Sun and Earth's magnetic field: soft arpeggiated synths, warm pads, gentle pulse, sense of wonder and scale, steady." + N, 95000),
 "m3_arquivo": ("Mysterious historical documentary bed: archival feeling, muted piano notes, soft strings, distant ticking, nineteenth-century telegraph era atmosphere, slowly evolving, a little darker near the end." + N, 165000),
 "m4_impacto": ("Tense documentary bed for a solar storm hitting Earth: pulsing low synth ostinato, taut strings, electric crackle textures, urgency that keeps building without a climax, controlled." + N, 130000),
 "m5_virada": ("Eerie revelation documentary bed: deep sustained low tones, cold high harmonics, slow heartbeat-like pulse, sense of hidden danger above Brazil, cinematic and restrained." + N, 105000),
 "m6_fecho": ("Calm reflective documentary ending: soft piano and warm strings, sunrise feeling, hopeful and gentle, slow resolution, ends softly." + N, 80000),
}
SFX = {
 "clarao": ("bright cosmic flash shimmer, airy high whoosh with a soft deep boom underneath, cinematic but not loud", 2.5),
 "tique": ("single soft clock tick, clean, close", 0.6),
 "plasma": ("deep slow rushing whoosh of hot plasma in space, rumbling, cinematic", 4.0),
 "faisca": ("electric sparks crackling from an old telegraph wire, short arcs", 3.0),
 "telegrafo": ("nineteenth century telegraph key clicking morse code", 3.0),
 "estatica": ("shortwave radio signal fading into static noise", 3.0),
 "papel": ("paper card sliding onto a wooden desk", 1.0),
 "carimbo": ("rubber stamp pressed firmly on paper, single thump", 0.8),
 "gaveta": ("old metal filing cabinet drawer sliding open", 1.5),
 "fogo_papel": ("paper tape catching fire, small flames crackling", 3.0),
 "espaco": ("deep space ambience, low soft drone with faint shimmer", 6.0),
 "impacto": ("massive deep magnetic shockwave rumble, low frequency, eerie, no explosion", 4.0),
 "zumbido": ("electrical transformer hum getting stronger, buzzing power station", 4.0),
 "glitch": ("short digital signal glitch, data error beeps", 1.2),
 "pix": ("short pleasant smartphone payment notification ping", 0.8),
 "luz_pisca": ("electric power flicker, lights buzzing off and on", 1.5),
 "trator": ("tractor engine idling in an open field", 4.0),
 "aurora": ("soft magical shimmering ambience at night, gentle wind, crickets far away", 5.0),
 "agua_represa": ("strong waterfall rushing from a dam spillway, distant", 4.0),
 "floresta": ("amazon rainforest ambience, birds and insects, river nearby", 5.0),
 "chuva": ("light rain falling, soft", 4.0),
 "pop": ("soft UI pop sound, subtle", 0.5),
 "neve": ("cold winter wind at night, quiet", 4.0),
 "beep_sat": ("satellite telemetry beeps, soft electronic", 2.0),
}
def post(url, body, out):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=H)
    for a in range(4):
        try:
            with urllib.request.urlopen(req, timeout=900) as r:
                open(out, 'wb').write(r.read()); print(out, 'ok', flush=True); return
        except urllib.error.HTTPError as e:
            print(out, 'ERRO', e.code, e.read()[:200], flush=True); time.sleep(10)
        except Exception as e:
            print(out, 'ERRO', e, flush=True); time.sleep(10)
os.makedirs('sfx', exist_ok=True); os.makedirs('musica', exist_ok=True)
for k, (p, d) in SFX.items():
    if not os.path.exists(f'sfx/{k}.mp3'):
        post("https://api.elevenlabs.io/v1/sound-generation", {"text": p, "duration_seconds": d, "prompt_influence": 0.5}, f'sfx/{k}.mp3')
for k, (p, ms) in MUS.items():
    if not os.path.exists(f'musica/{k}.mp3'):
        post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {"prompt": p, "music_length_ms": ms, "model_id": "music_v1", "force_instrumental": True}, f'musica/{k}.mp3')
print('FIM')
