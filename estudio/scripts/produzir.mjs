// Roda a linha de produção de um vídeo já roteirizado e aprovado: voz -> vídeo -> capa -> stories.
// Uso: node scripts/produzir.mjs <pasta-do-video> [--teste] [--rascunho] [--sem-voz (reaproveita voz.mp3/tempos.json)]
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const pasta = path.resolve(process.argv[2] || '.');
const flags = process.argv.slice(3);
const dir = path.dirname(new URL(import.meta.url).pathname);
for (const f of ['roteiro.json', 'capa.json']) if (!fs.existsSync(path.join(pasta, f))) throw new Error(`falta ${f} em ${pasta}`);
// Node só usa o proxy do ambiente (necessário na nuvem) com NODE_USE_ENV_PROXY=1
const env = { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' };
if (fs.existsSync('/root/.ccr/ca-bundle.crt')) env.NODE_EXTRA_CA_CERTS = '/root/.ccr/ca-bundle.crt';
const run = (s, extra = []) => execFileSync('node', [path.join(dir, s), pasta, ...extra], { stdio: 'inherit', env });
run('validar.mjs');
if (!flags.includes('--sem-voz')) run('voz.mjs', flags.filter((f) => f === '--teste'));
run('render.mjs', flags.filter((f) => f === '--rascunho'));
run('capa.mjs');
run('stories.mjs');
