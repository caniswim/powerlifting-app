/**
 * Uso único: acrescenta source/refPrefix/builtAt/channelItemCount ao manifesto do
 * Vena SEM reconstruí-lo (reconstruir arriscaria a numeração). Temp + rename.
 */
import { readFileSync, writeFileSync, renameSync } from 'node:fs';

const OUT = '/Users/brunnovert/Documents/Dev/powerlifting-app/research/corpus/manifest.json';
const m = JSON.parse(readFileSync(OUT, 'utf8'));
if (m.videos.length !== 197) throw new Error(`esperava 197 vídeos, achei ${m.videos.length}`);
if (m.source) throw new Error('manifesto já tem source — nada a fazer');

// Mesma ordem de chaves que build-manifest.mjs escreve, para um diff futuro entre
// manifesto legado e manifesto regerado ser legível.
const patched = {
  source: 'vena',
  channel: m.channel,
  refPrefix: 'R',
  builtFor: m.builtFor,
  builtAt: '2026-08-09',
  channelItemCount: 197,
  postRun1Count: m.postRun1Count,
  videoCount: m.videoCount,
  citableCount: m.citableCount,
  totalDurationSec: m.totalDurationSec,
  videos: m.videos,
};
for (const k of Object.keys(m)) {
  if (!(k in patched)) throw new Error(`campo ${k} ficaria de fora do manifesto`);
}

const tmp = `${OUT}.tmp`;
writeFileSync(tmp, `${JSON.stringify(patched, null, 2)}\n`);
// Só troca depois que o arquivo inteiro está no disco: um Ctrl-C no meio da
// escrita não pode deixar 7.741 citações apontando para um JSON truncado.
renameSync(tmp, OUT);
console.log('ok:', Object.keys(patched).join(', '));
