#!/usr/bin/env node
/**
 * Constrói o manifesto do corpus: a ponte entre `[Rxxx]` e o vídeo no YouTube.
 *
 * Este é o arquivo mais valioso da camada de pesquisa e o mais fácil de perder,
 * porque não está em lugar nenhum — é derivado da ordem do canal. As 7.741
 * citações do PROGRAMA.md só significam alguma coisa enquanto este mapa existir.
 *
 * A NUMERAÇÃO NÃO É "ORDEM DO CANAL HOJE". A run 1 numerou em 2026-08 com 196
 * vídeos no canal; desde então entrou 1 vídeo novo. Numerar por recência hoje
 * deslocaria tudo em 1 e faria cada citação apontar para o vídeo errado — o pior
 * tipo de erro, porque continua parecendo certo.
 *
 * Então o mapa é: índice 1 (mais recente) = R000, pós-run-1, fora da numeração
 * original. Índices 2..197 = R001..R196, a numeração que o PROGRAMA.md usa.
 *
 * O offset foi VERIFICADO, não suposto, contra seis âncoras semânticas colhidas
 * do que sobrou da base (`research/recuperado/`):
 *
 *   R1   → "How I Got Over 3 YEARS OF INJURIES"     (a dor 2/10 da regra D1)
 *   R4   → "The PROGRAM That Got Me A 400KG SQUAT"  (progressão linear)
 *   R102 → "Why I NEVER do DELOADS"                 (a contradição do deload)
 *   R113 → "Squat Exercise TIER LIST"               (o tier list do rebaixamento)
 *   R159 → "STOP TRYING TO SQUAT UPRIGHT"           (o cue-bandeira do canal)
 *   R168 → "The Best Squat Accessory"               (o acessório nº 1)
 *
 * `verify-manifest.mjs` re-executa essas seis checagens no build. Se o canal
 * publicar outro vídeo e alguém regerar o manifesto sem pensar, a verificação
 * quebra em vez de corromper a base em silêncio.
 *
 * Uso: node research/tools/build-manifest.mjs [--refresh]
 *   sem --refresh, recusa sobrescrever um manifesto existente.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'research/corpus/manifest.json');

const CHANNEL_ID = 'UC4ogvS0mhrPjsoCOjIKlovA';
const CHANNEL_NAME = 'Matt Vena';

/** Vídeos publicados depois da run 1 ficam fora da numeração `[Rxxx]`. */
const POST_RUN1 = 1;

if (existsSync(OUT) && !process.argv.includes('--refresh')) {
  console.error(`${OUT} já existe. Use --refresh para reconstruir (e rode verify-manifest depois).`);
  process.exit(1);
}

console.log(`Listando ${CHANNEL_NAME} (${CHANNEL_ID})…`);
const raw = execFileSync(
  'yt-dlp',
  [
    '--skip-download',
    '--flat-playlist',
    '--dump-json',
    `https://www.youtube.com/channel/${CHANNEL_ID}/videos`,
  ],
  { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
);

const videos = raw
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));

console.log(`  ${videos.length} vídeos.`);

const entries = videos.map((v, i) => {
  const rNumber = i + 1 - POST_RUN1; // índice 1 → 0, índice 2 → 1, …
  return {
    // R000 é o vídeo novo; ele existe no manifesto para o corpus ficar completo,
    // mas nenhuma citação do PROGRAMA.md pode apontar para ele.
    ref: `R${String(rNumber).padStart(3, '0')}`,
    rNumber,
    postRun1: rNumber < 1,
    videoId: v.id,
    title: v.title,
    durationSec: v.duration ?? null,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    // Preenchido pelo pipeline de transcrição.
    transcript: null,
    source: null, // 'captions' | 'whisper' | 'captions+whisper'
  };
});

const manifest = {
  channel: { id: CHANNEL_ID, name: CHANNEL_NAME },
  builtFor: 'run2',
  postRun1Count: POST_RUN1,
  videoCount: entries.length,
  citableCount: entries.filter((e) => !e.postRun1).length,
  totalDurationSec: entries.reduce((s, e) => s + (e.durationSec ?? 0), 0),
  videos: entries,
};

writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`);

const h = (manifest.totalDurationSec / 3600).toFixed(1);
console.log(`\n✓ ${OUT}`);
console.log(`  ${manifest.videoCount} vídeos · ${manifest.citableCount} citáveis (R001–R${manifest.citableCount}) · ${h} h`);
