// Gera a locução (ElevenLabs, com timestamps por caractere) e o mapa de tempos do vídeo.
// Uso: NODE_USE_ENV_PROXY=1 node scripts/voz.mjs <pasta-do-video> [--teste]   (ou via produzir.mjs, que já ajusta o proxy)
//   --teste: não chama a API (não gasta créditos); gera tempos falsos e um áudio mudo.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'config.json'), 'utf8'));

const pasta = path.resolve(process.argv[2] || '.');
const teste = process.argv.includes('--teste');
const roteiro = JSON.parse(fs.readFileSync(path.join(pasta, 'roteiro.json'), 'utf8'));

// Monta o texto completo. Palavras entre *asteriscos* são palavras-chave (sublinhadas na legenda).
let texto = '';
const palavras = []; // {txt, chave, ini, fim (índices de caractere), cena}
const cenasCh = [];
roteiro.cenas.forEach((c, i) => {
  if (texto) texto += ' ';
  const iniCena = texto.length;
  for (const bruto of c.fala.trim().split(/\s+/)) {
    const chave = /\*/.test(bruto);
    const limpo = bruto.replace(/\*/g, '');
    if (!limpo) continue;
    if (texto.length > iniCena) texto += ' ';
    palavras.push({ txt: limpo, chave, ini: texto.length, fim: texto.length + limpo.length, cena: i });
    texto += limpo;
  }
  cenasCh.push({ ini: iniCena, fim: texto.length });
});

let inicios, fins, duracaoAudio;
const mp3 = path.join(pasta, 'voz.mp3');

if (teste) {
  // ~2,6 palavras por segundo, como os vídeos de referência
  const porChar = 1 / 15.5;
  inicios = [...texto].map((_, i) => i * porChar);
  fins = inicios.map((t) => t + porChar);
  duracaoAudio = texto.length * porChar + 0.3;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(duracaoAudio), '-q:a', '4', mp3]);
} else if (process.argv.includes('--audio')) {
  // Áudio gravado/gerado fora (ex.: ElevenLabs no site): alinhamento forçado devolve o tempo de cada letra.
  const arq = path.resolve(process.argv[process.argv.indexOf('--audio') + 1]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', arq, '-ar', '44100', '-b:a', '192k', mp3]);
  // Transcrição com tempo por palavra (Scribe) + casamento com o roteiro (LCS).
  // Números ditos ("126") cobrem várias palavras do roteiro ("cento e vinte e seis"): o tempo é repartido.
  const fd = new FormData();
  fd.append('file', new Blob([fs.readFileSync(mp3)], { type: 'audio/mpeg' }), 'voz.mp3');
  fd.append('model_id', 'scribe_v1'); fd.append('language_code', 'por'); fd.append('timestamps_granularity', 'word');
  const r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY || 'proxy' }, body: fd });
  if (!r.ok) throw new Error(`ElevenLabs transcrição ${r.status}: ${await r.text()}`);
  const stt = (await r.json()).words.filter((w) => w.type === 'word');
  const nz = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const A = palavras.map((p) => nz(p.txt)), B = stt.map((w) => nz(w.text));
  const L = Array.from({ length: A.length + 1 }, () => new Int16Array(B.length + 1));
  for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const par = new Array(A.length).fill(-1);
  for (let i = 0, j = 0; i < A.length && j < B.length;) { if (A[i] === B[j]) { par[i] = j; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  const ini = new Array(A.length), fim = new Array(A.length);
  par.forEach((j, i) => { if (j >= 0) { ini[i] = stt[j].start; fim[i] = stt[j].end; } });
  for (let i = 0; i < A.length;) {
    if (ini[i] !== undefined) { i++; continue; }
    let k = i; while (k < A.length && ini[k] === undefined) k++;
    const a = i > 0 ? fim[i - 1] : 0, b = k < A.length ? ini[k] : (stt.at(-1)?.end ?? a + 1);
    const passo = (b - a) / (k - i);
    for (let q = i; q < k; q++) { ini[q] = a + passo * (q - i); fim[q] = a + passo * (q - i + 1); }
    i = k;
  }
  inicios = new Array(texto.length).fill(0); fins = new Array(texto.length).fill(0);
  let ult = 0;
  palavras.forEach((p, i) => {
    const n = p.fim - p.ini, d = Math.max(0.01, fim[i] - ini[i]);
    for (let c = 0; c < n; c++) { inicios[p.ini + c] = ini[i] + (d * c) / n; fins[p.ini + c] = ini[i] + (d * (c + 1)) / n; }
    for (let c = ult; c < p.ini; c++) { inicios[c] = i > 0 ? fim[i - 1] : 0; fins[c] = inicios[c]; }
    ult = p.fim;
  });
  duracaoAudio = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString());
  console.log(`alinhamento por transcrição: ${par.filter((j) => j >= 0).length}/${A.length} palavras casadas`);
} else {
  const v = cfg.voz;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice_id}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY || 'proxy' },
    body: JSON.stringify({
      text: texto,
      model_id: v.model_id,
      language_code: 'pt',
      voice_settings: { stability: v.stability, similarity_boost: v.similarity_boost, style: v.style, speed: v.velocidade, use_speaker_boost: true },
    }),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
  const j = await r.json();
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
  const al = j.alignment;
  if (al.characters.join('') !== texto) console.warn('aviso: alinhamento difere do texto; usando índices mesmo assim');
  inicios = al.character_start_times_seconds;
  fins = al.character_end_times_seconds;
  duracaoAudio = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString());
}

const t = (i) => inicios[Math.min(i, inicios.length - 1)];
const tf = (i) => fins[Math.min(i, fins.length - 1)];
const cenas = cenasCh.map((c, i) => ({
  ini: i === 0 ? 0 : t(c.ini) - 0.12,
  fim: i === cenasCh.length - 1 ? duracaoAudio + 1.6 : t(cenasCh[i + 1].ini) - 0.12,
}));
const ws = palavras.map((p) => ({
  txt: p.txt, chave: p.chave, cena: p.cena,
  ini: t(p.ini), fim: tf(p.fim - 1),
  // tempos de cada letra (efeito máquina de escrever)
  letras: [...p.txt].map((_, k) => t(p.ini + k)),
}));

const tempos = { texto, duracao: cenas.at(-1).fim, duracaoAudio, cenas, palavras: ws, teste };
fs.writeFileSync(path.join(pasta, 'tempos.json'), JSON.stringify(tempos));
console.log(`voz ok: ${duracaoAudio.toFixed(1)}s de fala, vídeo ${tempos.duracao.toFixed(1)}s, ${texto.length} caracteres${teste ? ' (TESTE, sem API)' : ''}`);
