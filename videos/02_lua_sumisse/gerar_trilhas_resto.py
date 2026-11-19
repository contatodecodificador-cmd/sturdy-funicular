"""Trilhas do resto do vídeo 2, uma por clima do roteiro (ElevenLabs Music, 1 pedido por vez)."""
import json,urllib.request,os,time
H={"xi-api-key":"proxy-injected","Content-Type":"application/json"}
NO=" No drums, no vocals. Sparse and spacious, leaving room for narration, loopable, no big climax."
M={
 "m5_mare":("Calm curious documentary underscore, gentle ocean-like swelling pads, soft marimba plucks, steady and reassuring, 75 bpm."+NO,60000),
 "m6_pororoca":("Melancholic documentary underscore, warm cello and soft piano, slow, a feeling of loss of something beautiful in nature, gentle."+NO,55000),
 "m7_mangue":("Organic curious underscore, soft Brazilian-flavored acoustic guitar plucks and light shaker texture, mangrove nature documentary, calm and alive, 85 bpm. No vocals, very soft percussion only, sparse.",50000),
 "m8_carnaval":("Light playful Brazilian samba-inspired underscore, soft cavaquinho and gentle pandeiro, cheerful but restrained, documentary background, 100 bpm. No vocals, sparse, low energy, leaving room for narration.",50000),
 "m9_eclipse":("Wonder then loss, ethereal celestial pads, soft choir-like synth (no words), slow, bittersweet, cosmic documentary."+NO,45000),
 "m10_oceano":("Deep contemplative ocean underscore, low warm drones, slow evolving, slightly melancholic and serious."+NO,60000),
 "m11_mitos":("Light curious playful documentary underscore, pizzicato strings and soft clarinet, myth-busting tone, gentle and smart, 95 bpm."+NO,50000),
 "m12_virada":("Rising cinematic transition, time accelerating, swelling strings and synth arpeggio building tension for 20 seconds then holding a deep sustained tone."+NO,30000),
 "m13_freio":("Grand deep-time documentary underscore, slow low brass and strings, ancient and majestic, slow 60 bpm."+NO,60000),
 "m14_eixo":("Tense epic cosmic underscore, low pulsing synth, slow building suspense, planetary scale, serious, evolving."+NO,110000),
 "m15_resposta":("Hopeful reflective underscore, warm piano and soft strings, gentle reassurance, slow."+NO,40000),
 "m16_fecho":("Emotional documentary ending, gentle piano with soft strings swelling slowly, warm, a moonlit river at night, hopeful resolution."+NO.replace(", loopable, no big climax",""),75000),
}
for k,(p,ms) in M.items():
    out=f"musica/{k}.mp3"
    if os.path.exists(out): print(k,'existe',flush=True); continue
    for tent in range(4):
        body={"prompt":p,"music_length_ms":ms,"model_id":"music_v1","force_instrumental":True}
        r=urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",data=json.dumps(body).encode(),headers=H)
        try:
            with urllib.request.urlopen(r,timeout=600) as x: open(out,'wb').write(x.read())
            print(k,'ok',flush=True); break
        except urllib.error.HTTPError as e:
            print(k,'ERRO',e.code,e.read()[:150],flush=True); time.sleep(20)
