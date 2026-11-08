// Valida roteiro.json e capa.json antes de gastar créditos de voz. Sai com erro e lista os problemas.
// Uso: node scripts/validar.mjs <pasta-do-video>
import fs from 'node:fs';
import path from 'node:path';
import { preparaGeo } from './lib/geo.mjs';

const pasta = path.resolve(process.argv[2] || '.');
const erros = [];
const avisos = [];
let roteiro;
try { roteiro = JSON.parse(fs.readFileSync(path.join(pasta, 'roteiro.json'), 'utf8')); } catch (e) { console.error('roteiro.json ilegível:', e.message); process.exit(1); }

const VIS = ['mapa', 'lista', 'cta'];
if (!Array.isArray(roteiro.cenas) || roteiro.cenas.length < 4) erros.push('roteiro precisa de pelo menos 4 cenas');
if (!roteiro.fontes) erros.push('falta "fontes" (aparece no rodapé do vídeo inteiro)');
let palavras = 0;
roteiro.cenas?.forEach((c, i) => {
  const n = `cena ${i + 1}`;
  if (!c.fala?.trim()) erros.push(`${n}: falta "fala"`);
  palavras += (c.fala || '').split(/\s+/).filter(Boolean).length;
  if (c.visual && !VIS.includes(c.visual)) erros.push(`${n}: visual "${c.visual}" inválido (${VIS.join('/')})`);
  if (!c.capitulo && !c.continua) avisos.push(`${n}: sem "capitulo"`);
  if (c.visual === 'lista' && !(c.itens?.length)) erros.push(`${n}: lista sem itens`);
  const ex = (r) => r && fs.existsSync(path.resolve(pasta, r));
  if (c.noticia) {
    if (!c.noticia.manchete) erros.push(`${n}: noticia sem "manchete"`);
    if (c.noticia.imagem && !ex(c.noticia.imagem)) avisos.push(`${n}: noticia.imagem "${c.noticia.imagem}" não existe (o card sai sem imagem)`);
  }
  if (c.foto && !ex(c.foto.arquivo)) avisos.push(`${n}: foto.arquivo "${c.foto.arquivo}" não existe (o card será pulado)`);
  if (c.video && !ex(c.video.arquivo)) avisos.push(`${n}: video.arquivo "${c.video.arquivo}" não existe${ex(c.video.miniatura) ? ' (usa a miniatura)' : ' e sem miniatura (o card será pulado)'}`);
  if (c.video?.miniatura && !ex(c.video.miniatura)) avisos.push(`${n}: video.miniatura "${c.video.miniatura}" não existe`);
  if ((c.itens?.length || 0) > 4) erros.push(`${n}: máximo 4 itens na lista`);
  if ((c.notas?.length || 0) > 4) erros.push(`${n}: máximo 4 notas`);
  if (c.titulo && c.titulo !== 'manter' && c.titulo.numero !== undefined && typeof c.titulo.numero !== 'number') erros.push(`${n}: titulo.numero deve ser número (sem aspas)`);
});
const ult = roteiro.cenas?.at(-1);
if (ult && ult.visual !== 'cta') avisos.push('última cena não é "cta"');
if (palavras < 120 || palavras > 260) avisos.push(`texto com ${palavras} palavras (ideal 150–220 para 65–85s)`);
try { preparaGeo(roteiro, 720, 1280); } catch (e) { erros.push(e.message); }

const capaF = path.join(pasta, 'capa.json');
if (fs.existsSync(capaF)) {
  const capa = JSON.parse(fs.readFileSync(capaF, 'utf8'));
  if (!Array.isArray(capa.titulo) || capa.titulo.length !== 2) erros.push('capa.titulo deve ser ["parte branca", "parte amarela"]');
  if (capa.cena !== undefined && (capa.cena < 0 || capa.cena >= roteiro.cenas.length)) erros.push('capa.cena fora do intervalo');
}
const stF = path.join(pasta, 'stories.json');
if (fs.existsSync(stF)) {
  try {
    const st = JSON.parse(fs.readFileSync(stF, 'utf8'));
    if (!Array.isArray(st.manchete) || st.manchete.length < 1) erros.push('stories.manchete deve ser lista de 1 a 2 linhas');
    if (st.cena !== undefined && (st.cena < 0 || st.cena >= roteiro.cenas.length)) erros.push('stories.cena fora do intervalo');
  } catch (e) { erros.push('stories.json ilegível: ' + e.message); }
} else avisos.push('sem stories.json (stories não serão gerados)');
avisos.forEach((a) => console.log('aviso:', a));
if (erros.length) { erros.forEach((e) => console.error('ERRO:', e)); process.exit(1); }
console.log(`roteiro válido: ${roteiro.cenas.length} cenas, ${palavras} palavras (~${Math.round(palavras / 2.6)}s)`);
