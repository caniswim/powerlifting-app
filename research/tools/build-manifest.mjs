#!/usr/bin/env node
/**
 * Constrói o manifesto de um corpus: a ponte entre `[Rxxx]`/`[Gxxx]` e o vídeo
 * no YouTube.
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
 * PARA FONTE NOVA A LIÇÃO É A MESMA, SÓ QUE ANTES DO ESTRAGO. Uma fonte que
 * ainda não tem citação não tem âncora semântica para amarrar — não há
 * `research/recuperado/` do Blevins. O que dá para gravar é o estado do canal no
 * instante do build: `builtAt` e `channelItemCount`. Numa reconstrução futura,
 * comparar a contagem de hoje com a gravada dá o deslocamento na hora
 * (`+3 vídeos publicados desde 2026-08-09` → todas as refs andariam 3) em vez de
 * a base sofrer em silêncio como quase aconteceu com o Vena. É o mínimo que
 * transforma "regerei e ficou diferente" numa pergunta respondível.
 *
 * A data de publicação por vídeo entra no mesmo passo, e não é enfeite: a base
 * resolve contradição por recência, e sem data essa regra vira julgamento de
 * quem estiver lendo. `--flat-playlist` lista o canal barato mas NÃO traz data
 * (medido: `upload_date`, `timestamp` e `release_timestamp` vêm todos nulos),
 * então é uma chamada de rede por vídeo, concorrente e com checkpoint.
 *
 * Uso: node research/tools/build-manifest.mjs [--source blevins] [--refresh] [--skip-dates]
 *   sem --source, opera sobre o corpus do Vena, nos caminhos de sempre.
 *   sem --refresh, recusa sobrescrever um manifesto existente.
 */

import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveSource, paths, channelVideosUrl, refOf } from './sources.mjs';

const exec = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const SOURCE = resolveSource();
const P = paths(SOURCE, ROOT);
const OUT = P.manifest;

/**
 * Baixo de propósito. Outro processo yt-dlp costuma estar rodando na máquina em
 * paralelo, e o throttle do YouTube é por IP: passar de 3 aqui atrasa os dois.
 */
const DATE_CONCURRENCY = 3;

if (existsSync(OUT) && !process.argv.includes('--refresh')) {
  console.error(`${OUT} já existe. Use --refresh para reconstruir (e rode verify-manifest depois).`);
  process.exit(1);
}

mkdirSync(P.dir, { recursive: true });

const channelUrl = channelVideosUrl(SOURCE);
console.log(`Listando ${SOURCE.name} (${channelUrl})…`);
const raw = execFileSync(
  'yt-dlp',
  ['--skip-download', '--flat-playlist', '--dump-json', channelUrl],
  { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
);

const videos = raw
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));

console.log(`  ${videos.length} vídeos.`);

const entries = videos.map((v, i) => {
  const rNumber = i + 1 - SOURCE.postRun1; // Vena: índice 1 → 0, índice 2 → 1, …
  return {
    // R000 é o vídeo novo; ele existe no manifesto para o corpus ficar completo,
    // mas nenhuma citação do PROGRAMA.md pode apontar para ele. Fonte nova tem
    // postRun1 = 0, então começa direto em 001 e não carrega essa exceção.
    ref: refOf(SOURCE, rNumber),
    rNumber,
    postRun1: rNumber < 1,
    videoId: v.id,
    title: v.title,
    durationSec: v.duration ?? null,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    date: null, // ISO, preenchido logo abaixo
    // Preenchido pelo pipeline de transcrição.
    transcript: null,
    source: null, // 'captions' | 'whisper' | 'captions+whisper'
  };
});

const manifest = {
  source: SOURCE.id,
  channel: { id: SOURCE.channelId ?? null, handle: SOURCE.handle ?? null, name: SOURCE.name, url: channelUrl },
  refPrefix: SOURCE.refPrefix,
  builtFor: 'run2',
  /** Estado do canal no instante do build — é o que torna deslocamento detectável. */
  builtAt: new Date().toISOString().slice(0, 10),
  channelItemCount: videos.length,
  postRun1Count: SOURCE.postRun1,
  videoCount: entries.length,
  citableCount: entries.filter((e) => !e.postRun1).length,
  totalDurationSec: entries.reduce((s, e) => s + (e.durationSec ?? 0), 0),
  videos: entries,
};

const save = () => writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`);
save();

/** yt-dlp entrega YYYYMMDD; a base compara datas como string, então ISO. */
const toIso = (yyyymmdd) => {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(String(yyyymmdd).trim());
  if (!m) throw new Error(`data ilegível: ${JSON.stringify(yyyymmdd)}`);
  return `${m[1]}-${m[2]}-${m[3]}`;
};

/**
 * `upload_date` é o campo que sempre existe; `release_date` só aparece em vídeo
 * que foi estreia/agendado. Pedir os dois na mesma chamada evita uma segunda ida
 * à rede só para descobrir que o primeiro veio vazio.
 */
async function fetchDate(v) {
  const { stdout } = await exec(
    'yt-dlp',
    ['--skip-download', '--no-warnings', '--print', '%(upload_date)s|%(release_date)s', v.url],
    { maxBuffer: 4 * 1024 * 1024 },
  );
  const [upload, release] = stdout.trim().split('|');
  const pick = [upload, release].find((d) => d && d !== 'NA');
  if (!pick) throw new Error('sem data de publicação');
  return toIso(pick);
}

if (!process.argv.includes('--skip-dates')) {
  const queue = entries.slice();
  const total = queue.length;
  let done = 0;
  let failed = 0;
  console.log(`\nDatando ${total} vídeo(s) (uma chamada por vídeo)…`);

  await Promise.all(
    Array.from({ length: DATE_CONCURRENCY }, async () => {
      for (;;) {
        const v = queue.shift();
        if (!v) return;
        try {
          v.date = await fetchDate(v);
          done += 1;
        } catch {
          failed += 1;
        }
        if ((done + failed) % 25 === 0) {
          console.log(`  ${done + failed}/${total} · ok ${done} · falha ${failed}`);
          save(); // Ctrl-C no minuto 12 não custa os 12 minutos.
        }
      }
    }),
  );
  save();
  console.log(`  datas: ${done} ok · ${failed} falha(s)`);

  /**
   * A numeração assume que a ordem do canal é cronológica decrescente. Uma
   * inversão aqui não é bug deste script: é o canal (republicação, estreia
   * agendada, ordenação do YouTube por outra coisa) desmentindo a premissa. Só
   * reporta — consertar exigiria renumerar citações, e isso é decisão humana.
   */
  const dated = entries.filter((e) => e.date);
  const inversions = dated.filter((e, i) => i > 0 && e.date > dated[i - 1].date);
  if (inversions.length === 0) {
    console.log('  ✓ ordem cronológica limpa: nenhuma inversão.');
  } else {
    console.log(`  ⚠ ${inversions.length} inversão(ões) cronológica(s):`);
    for (const e of inversions.slice(0, 10)) console.log(`      ${e.ref} ${e.date} — ${e.title}`);
  }
}

const h = (manifest.totalDurationSec / 3600).toFixed(1);
const iso = entries.map((e) => e.date).filter(Boolean).sort();
console.log(`\n✓ ${OUT}`);
console.log(
  `  ${manifest.videoCount} vídeos · ${manifest.citableCount} citáveis ` +
    `(${refOf(SOURCE, 1)}–${refOf(SOURCE, manifest.citableCount)}) · ${h} h`,
);
if (iso.length > 0) console.log(`  publicados de ${iso[0]} a ${iso[iso.length - 1]}`);
