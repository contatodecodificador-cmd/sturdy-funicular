"""Trilhas por andar + efeitos do vídeo 6 completo (ElevenLabs: music_v1 e sound-generation)."""
import json, urllib.request, os, time
H = {"xi-api-key": "x", "Content-Type": "application/json"}
N = " Instrumental only, no vocals, subtle documentary underscore that sits under narration, no sudden loud hits, no drops."
MUS = {
 "m2_andar1": ("Curious, grounded documentary bed about small hidden earthquakes in Brazil: soft low pulse, light marimba and muted plucks, gentle ticking like a seismograph, warm but slightly uneasy, steady and unobtrusive, slowly gains a little tension toward the end." + N, 150000),
 "m3_andar2": ("Deep, mysterious documentary bed about the largest earthquake inside Brazil and invisible deep earthquakes under the Amazon: sustained low strings, distant hollow percussion, sense of depth and scale, restrained and cinematic, slowly evolving." + N, 150000),
 "m4_andar3": ("Tense documentary bed about distant earthquakes shaking Brazilian buildings and an ancient tsunami: pulsing low synth ostinato, taut strings, distant rumble textures, building suspense without climax, controlled and serious." + N, 160000),
 "m5_andar4": ("Dark, epic but restrained documentary bed for a hypothetical magnitude 9.5 earthquake: low brass swells, slow heavy drums far away, sub rumble, tension rises to a solemn peak around the middle then resolves into calm reflective chords at the end." + N, 160000),
 "m6_fecho": ("Calm, warm, hopeful documentary ending: soft piano and light strings, gentle resolution, peaceful afternoon feeling, ends softly." + N, 45000),
}
SFX = {
 "louca": ("porcelain dishes and cups rattling on a wooden shelf during a small earthquake, kitchen", 4.0),
 "quadro": ("picture frame scraping and tilting on a wall nail, small creak", 1.5),
 "range": ("old house wooden structure creaking and groaning during an earthquake, low", 4.0),
 "arrasta": ("wooden chairs and table legs scraping and sliding on a tiled floor during an earthquake", 4.0),
 "racha": ("plaster wall cracking, ceramic tiles splitting, dry crack sounds", 3.0),
 "quebra": ("plates and cups falling from a shelf and shattering on a tiled kitchen floor", 3.0),
 "entulho": ("small pieces of plaster and dust falling from a ceiling, debris pattering on floor and furniture", 4.0),
 "tremor_forte": ("strong earthquake deep roar, ground shaking, rattling house, sustained, no explosions", 5.0),
 "pousa_copo": ("a glass of water being set down gently on a table with a cloth, soft tap and small water movement", 1.2),
 "agua_mexe": ("water sloshing gently inside a drinking glass", 2.5),
 "ambiente_cozinha": ("quiet kitchen room tone in the afternoon, faint wall clock ticking, distant birds outside the window", 6.0),
 "vento_sertao": ("dry hot wind in a rural village in the Brazilian backcountry, distant rooster", 5.0),
 "noite_vila": ("quiet night in a small town, crickets, distant dog", 5.0),
 "passaros_serra": ("open savanna landscape with wind and distant birds, Mato Grosso", 5.0),
 "mar": ("ocean waves on a calm beach, gentle surf", 5.0),
 "onda_grande": ("a large tsunami wave rushing in, water roar, no voices", 4.0),
 "cidade": ("busy city avenue traffic ambience, distant horns, Sao Paulo", 5.0),
 "sirene": ("distant emergency siren in a city, far away", 4.0),
 "sino": ("old church bells ringing in a distant European city, eighteenth century", 4.0),
 "notificacao": ("smartphone message notification sound, soft", 0.8),
 "papel": ("paper card sliding onto a desk, soft", 1.0),
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
