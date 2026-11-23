"""Trilhas por bloco + efeitos novos do vídeo 8 (ElevenLabs music_v1 e sound-generation). Reaproveita efeitos do vídeo 7."""
import json, urllib.request, os, sys, time, shutil
H = {"xi-api-key": "x", "Content-Type": "application/json"}
N = " Instrumental only, no vocals, subtle documentary underscore that sits under narration, no sudden loud hits, no drops."
MUS = {
 "m1_intro": ("Mysterious cinematic documentary opening set in the Amazon at dawn: low tense drone, distant tribal frame drum pulse, eerie high strings, ominous sense of something falling from the sky, restrained." + N, 82000),
 "m2_manha": ("Eerie Amazon rainforest morning turning strange: soft wooden percussion, low cello drones, subtle unsettling harmonics, slow building tension, documentary." + N, 130000),
 "m3_frei": ("Historical documentary bed about a 1930s missionary traveling by canoe: gentle nylon guitar and soft strings, contemplative, slightly melancholic, steady." + N, 120000),
 "m4_detetives": ("Investigative science documentary bed: steady pulsing low synth, ticking percussion, curious piano motif, sense of solving a mystery, evolving slowly." + N, 200000),
 "m5_regua": ("Tense scale-comparison documentary bed about meteor explosions: building low brass and synth swells, taut and restrained, growing intensity without climax." + N, 100000),
 "m6_hoje": ("Hopeful modern science documentary bed: light electronic pulse, warm pads, curiosity, people watching the sky, gentle." + N, 120000),
 "m7_fecho": ("Reflective documentary ending: soft piano and warm strings over a calm river at sunrise, open question, gentle resolution." + N, 65000),
}
SFX = {
 "assobio": ("high pitched whistling of a falling meteor getting louder and closer", 4.0),
 "explosao_longe": ("distant deep explosion rumble far away across a forest, muffled boom with long echo", 3.5),
 "rio": ("calm amazon river at dawn, water lapping on a wooden canoe, distant birds", 6.0),
 "pena": ("old fountain pen writing on paper, scratching", 3.0),
 "folhear": ("turning pages of an old book", 1.5),
 "vidro": ("many windows shattering at once in the distance", 2.5),
 "pedras_caindo": ("small rocks falling from the sky hitting dry ground and a tin roof", 3.0),
 "sismografo": ("old mechanical seismograph drum turning, pen scratching paper", 4.0),
}
def post(url, body, out):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=H)
    for a in range(3):
        try:
            with urllib.request.urlopen(req, timeout=900) as r:
                open(out, 'wb').write(r.read()); print(out, 'ok', flush=True); return True
        except urllib.error.HTTPError as e:
            print(out, 'ERRO', e.code, e.read()[:300], flush=True); time.sleep(15)
        except Exception as e:
            print(out, 'ERRO', e, flush=True); time.sleep(15)
    return False
os.makedirs('sfx', exist_ok=True); os.makedirs('musica', exist_ok=True)
for f in ['clarao', 'impacto', 'tique', 'papel', 'carimbo', 'floresta', 'pop', 'espaco', 'telegrafo', 'glitch', 'fogo_papel', 'zumbido']:
    if not os.path.exists(f'sfx/{f}.mp3'): shutil.copy(f'../07_tempestade_solar/sfx/{f}.mp3', f'sfx/{f}.mp3')
so = sys.argv[1:]
for k, (p, d) in SFX.items():
    if (not so or k in so) and not os.path.exists(f'sfx/{k}.mp3'):
        post("https://api.elevenlabs.io/v1/sound-generation", {"text": p, "duration_seconds": d, "prompt_influence": 0.5}, f'sfx/{k}.mp3')
for k, (p, ms) in MUS.items():
    if (not so or k in so) and not os.path.exists(f'musica/{k}.mp3'):
        post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {"prompt": p, "music_length_ms": ms, "model_id": "music_v1", "force_instrumental": True}, f'musica/{k}.mp3')
print('FIM')
