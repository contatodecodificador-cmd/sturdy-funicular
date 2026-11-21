"""Trilhas por ato (seguem a tensão do roteiro) + efeitos extras. Sequencial (limite de 2 pedidos simultâneos)."""
import json,urllib.request,os,time
H={"xi-api-key":"x","Content-Type":"application/json"}
N=" Instrumental only, no vocals, subtle documentary underscore, mixed low, no sudden loud hits."
MUS={
"m2_frio":("Cold, fragile medical suspense: slow ticking pulse, icy glassy pads, soft low heartbeat-like bass, sparse high piano notes, growing unease; at the end a gentle emotional resolution with warm strings."+N,150000),
"m3_calor":("Warm rising tension: dry desert-like drones, slow pulsing rhythm that speeds up gradually, heat shimmer textures, then a calm reflective ending with soft piano."+N,90000),
"m4_terra":("Curious, adventurous documentary bed for travelling around the planet's extremes: light rhythmic pulse, cold wind textures and plucked strings, wonder and discovery, steady and loopable."+N,180000),
"m5_lab":("Curious and playful science-experiment underscore: pizzicato strings, light marimba, subtle 18th-century harpsichord color, inquisitive mood, steady medium tempo."+N,150000),
"m6_lava_gelo":("Deep volcanic rumble turning into a frozen polar night: low brass drones, slow ominous pulse, then airy icy pads and distant wind; vast and serious."+N,90000),
"m7_espaco":("Ethereal deep-space ambient: vacuum-like silence, slow evolving synth pads, sparse twinkling tones, mysterious and vast, then a bright electric tension for lightning and a majestic warm swell for the Sun."+N,150000),
"m8_virada":("Precise, ingenious human-achievement score: clockwork-like pulses, building layered strings and synths, growing sense of awe, ending in a powerful but restrained triumphant climax."+N,170000),
"m9_fecho":("Emotional reflective ending: gentle solo piano with soft warm strings, small and intimate, hopeful, a sense of a small warm flame in a vast cold universe, slow fade."+N,70000),
}
SFX={"trovao":("distant thunder rumble after lightning, cinematic, soft",4.0),"vento":("cold polar wind howling softly, continuous",5.0),"bolhas":("underwater bubbles rising, muffled",3.0),"plasma":("low electric hum of a fusion reactor, magnetic buzz, subtle",4.0),"spray":("aerosol spray can hiss, short",2.0),"colisao":("deep cinematic boom with bright shimmer, particle collision, not too loud",3.0),"lava":("bubbling molten lava, low rumble",4.0),"sauna":("water poured on hot sauna stones, sizzling steam",3.0)}
def post(url,body,out):
    req=urllib.request.Request(url,data=json.dumps(body).encode(),headers=H)
    for a in range(4):
        try:
            with urllib.request.urlopen(req,timeout=900) as r: open(out,'wb').write(r.read()); print(out,'ok',os.path.getsize(out),flush=True); return
        except urllib.error.HTTPError as e:
            print(out,'ERRO',e.code,e.read()[:200],flush=True); time.sleep(10)
for k,(p,d) in SFX.items():
    if not os.path.exists(f'sfx/{k}.mp3'): post("https://api.elevenlabs.io/v1/sound-generation",{"text":p,"duration_seconds":d,"prompt_influence":0.5},f'sfx/{k}.mp3')
for k,(p,ms) in MUS.items():
    if not os.path.exists(f'musica/{k}.mp3'): post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192",{"prompt":p,"music_length_ms":ms,"model_id":"music_v1","force_instrumental":True},f'musica/{k}.mp3')
