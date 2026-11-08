// Áudio do editor: efeitos sintetizados (sem direitos autorais), trilhas e mixagem a -14 LUFS.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);

export const SFX = {
  whoosh: 'anoisesrc=d=0.6:c=pink:a=0.6,highpass=f=500,lowpass=f=6000,afade=t=in:d=0.28,afade=t=out:st=0.28:d=0.32,volume=0.55',
  swish: 'anoisesrc=d=0.32:c=pink:a=0.5,highpass=f=1200,afade=t=in:d=0.12,afade=t=out:st=0.12:d=0.2,volume=0.3',
  pop: "aevalsrc='0.5*sin(2*PI*(700+900*t*8)*t)*exp(-t*38)':d=0.12",
  check: "aevalsrc='0.35*sin(2*PI*1500*t)*exp(-t*45)+0.2*sin(2*PI*2250*t)*exp(-t*60)':d=0.1",
  impacto: "aevalsrc='0.8*sin(2*PI*(90-50*t)*t)*exp(-t*6)':d=0.6",
  trovao: 'anoisesrc=d=2.2:c=brown:a=0.9,lowpass=f=500,afade=t=in:d=0.04,afade=t=out:st=0.25:d=1.9,volume=1.6',
  clique: "aevalsrc='0.5*sin(2*PI*2400*t)*exp(-t*90)':d=0.05",
  // tranco curto de câmera: baque grave + estalo
  punch: "aevalsrc='0.9*sin(2*PI*(150-90*t*4)*t)*exp(-t*26)+0.25*sin(2*PI*900*t)*exp(-t*90)':d=0.22",
  // vento forte (tornado): ruído grave com ondulação
  vento: "anoisesrc=d=3:c=brown:a=0.9,highpass=f=120,lowpass=f=1400,tremolo=f=1.3:d=0.5,afade=t=in:d=0.6,afade=t=out:st=2.2:d=0.8,volume=1.4",
  // tique de contador
  tick: "aevalsrc='0.4*sin(2*PI*2100*t)*exp(-t*160)+0.15*sin(2*PI*3100*t)*exp(-t*200)':d=0.04",
};

export function geraSfx(build) {
  for (const [n, f] of Object.entries(SFX)) ff(['-f', 'lavfi', '-i', f, '-ar', '44100', '-ac', '1', path.join(build, `sfx_${n}.wav`)]);
}

// trilha de tensão contínua (drone grave + nota alta discreta)
export function trilhaDrone(build, dur) {
  ff(['-f', 'lavfi', '-i', `aevalsrc='(0.06*sin(2*PI*55*t)+0.05*sin(2*PI*82.4*t)+0.035*sin(2*PI*110*t))*(0.75+0.25*sin(2*PI*0.15*t))+0.006*sin(2*PI*1318.5*t)*(0.6+0.4*sin(2*PI*0.4*t))':d=${dur}:s=44100`,
    '-af', `lowpass=f=1800,afade=t=in:d=1.5,afade=t=out:st=${Math.max(0, dur - 2)}:d=2`, '-ac', '1', path.join(build, 'trilha.wav')]);
}

// trilha de story: pulso de 120 bpm + baixo + pad, sem voz
export function trilhaStory(build, dur) {
  ff(['-f', 'lavfi', '-i', `aevalsrc='0.55*sin(2*PI*(52+40*exp(-mod(t,0.5)*30))*t)*exp(-mod(t,0.5)*9)+0.18*sin(2*PI*55*t)*(0.6+0.4*sin(2*PI*1*t))+0.10*sin(2*PI*82.4*t)*(0.5+0.5*sin(2*PI*0.25*t))+0.05*sin(2*PI*220*t)*exp(-mod(t+0.25,0.5)*14)':d=${dur}:s=44100`,
    '-af', `lowpass=f=2200,afade=t=in:d=0.4,afade=t=out:st=${Math.max(0, dur - 1.2)}:d=1.2`, '-ac', '1', path.join(build, 'trilha.wav')]);
}

// voz (opcional) + trilha + efeitos -> mix.wav na meta de LUFS
export function mixa({ build, dur, eventos, voz, lufs }) {
  const ins = [], filtros = [], etiquetas = [];
  let n = 0;
  if (voz) {
    ins.push('-i', voz);
    filtros.push(`[${n}:a]aresample=44100,pan=mono|c0=c0,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,equalizer=f=3000:t=q:w=1:g=2[v]`);
    etiquetas.push('[v]'); n++;
  }
  ins.push('-i', path.join(build, 'trilha.wav')); etiquetas.push(`[${n}:a]`); n++;
  eventos.forEach((e, k) => {
    ins.push('-i', path.join(build, `sfx_${e.tipo === 'varrer' ? 'swish' : e.tipo}.wav`));
    const ms = Math.max(0, Math.round(e.t * 1000));
    const vol = { trovao: 0.9, punch: 0.5, tick: 0.35, vento: 0.5 }[e.tipo] ?? 0.55;
    filtros.push(`[${n}:a]adelay=${ms}|${ms},volume=${vol}[e${k}]`);
    etiquetas.push(`[e${k}]`); n++;
  });
  filtros.push(`${etiquetas.join('')}amix=inputs=${etiquetas.length}:normalize=0:duration=longest,atrim=0:${dur},loudnorm=I=${lufs}:LRA=4:TP=-1[a]`);
  const audio = path.join(build, 'mix.wav');
  ff([...ins, '-filter_complex', filtros.join(';'), '-map', '[a]', '-ar', '44100', '-ac', '2', audio]);
  // 2ª passada: mede e corrige o ganho até a meta
  const mI = [...execFileSync('sh', ['-c', `ffmpeg -nostats -i "${audio}" -af ebur128 -f null - 2>&1 | grep -E "^ +I:" | tail -1`]).toString().matchAll(/-?\d+\.\d/g)].map((m) => +m[0])[0];
  if (Number.isFinite(mI)) {
    const audio2 = path.join(build, 'mix2.wav');
    ff(['-i', audio, '-af', `volume=${(lufs - mI).toFixed(2)}dB,alimiter=limit=0.89:level=false`, audio2]);
    fs.renameSync(audio2, audio);
  }
  return audio;
}
