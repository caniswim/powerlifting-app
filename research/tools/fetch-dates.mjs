#!/usr/bin/env node
/**
 * Colhe a data de publicação de cada vídeo do corpus.
 *
 * A base resolve contradição por recência: quando dois vídeos discordam, o mais
 * recente vence. Sem data isso não é regra, é opinião de quem estiver lendo na
 * hora — o agente "acha" que R012 é mais novo que R104 e a decisão muda a cada
 * run. Com `dates.json` a regra vira comparação de string ISO, executável e
 * auditável.
 *
 * A data também é o único jeito de testar a premissa que sustenta a numeração
 * inteira: as refs foram atribuídas pela ordem do canal (R000 mais recente,
 * R196 mais antigo). Se essa ordem não for cronológica, `[Rxxx]` está mentindo
 * sobre recência em algum ponto — e é melhor descobrir aqui.
 *
 * NÃO ESCREVE NO MANIFESTO. O manifesto é escrito por outros passos do pipeline
 * que podem estar rodando agora; duas mãos no mesmo JSON perdem trabalho em
 * silêncio. A saída é um arquivo próprio, e o merge é decisão de outro passo.
 *
 * `--flat-playlist` lista o canal barato mas não traz data, então não tem jeito:
 * é uma chamada de rede por vídeo.
 *
 * Uso: node research/tools/fetch-dates.mjs [--only R159] [--force]
 *   Resumível: pula o que já está em dates.json, salvo --force.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const exec = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = join(ROOT, 'research/corpus/manifest.json');
const OUT = join(ROOT, 'research/corpus/dates.json');

/**
 * Baixo de propósito. Outro processo yt-dlp costuma estar rodando na máquina em
 * paralelo, e o throttle do YouTube é por IP: passar de 3 aqui atrasa os dois.
 */
const CONCURRENCY = 3;
/** Grava a cada N vídeos para que Ctrl-C no minuto 12 não custe os 12 minutos. */
const CHECKPOINT_EVERY = 20;

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const force = process.argv.includes('--force');
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;

/** Retoma o que já foi colhido; o arquivo é a fonte de verdade do progresso. */
const dates = existsSync(OUT) && !force ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

/** yt-dlp entrega YYYYMMDD; a base compara datas como string, então ISO. */
const toIso = (yyyymmdd) => {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(yyyymmdd.trim());
  if (!m) throw new Error(`data ilegível: ${JSON.stringify(yyyymmdd)}`);
  return `${m[1]}-${m[2]}-${m[3]}`;
};

/**
 * `upload_date` é o campo que sempre existe; `release_date` só aparece em vídeo
 * que foi estreia/agendado. Pedir os dois na mesma chamada evita uma segunda
 * ida à rede só para descobrir que o primeiro veio vazio.
 */
async function fetchOne(v) {
  const { stdout } = await exec(
    'yt-dlp',
    [
      '--skip-download',
      '--no-warnings',
      '--print',
      '%(upload_date)s|%(release_date)s',
      v.url,
    ],
    { maxBuffer: 4 * 1024 * 1024 },
  );

  const [upload, release] = stdout.trim().split('|');
  const pick = [upload, release].find((d) => d && d !== 'NA');
  if (!pick) throw new Error('sem data de publicação');
  return toIso(pick);
}

const queue = manifest.videos.filter((v) => {
  if (only && v.ref !== only) return false;
  return force || !dates[v.ref];
});

const save = () => {
  // Ordenado por ref para o diff do git ser legível a cada checkpoint.
  const sorted = Object.fromEntries(Object.keys(dates).sort().map((k) => [k, dates[k]]));
  writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
};

console.log(`${queue.length} vídeo(s) a datar (de ${manifest.videos.length}).\n`);

let done = 0;
let failed = 0;
const failures = [];

async function worker() {
  for (;;) {
    const v = queue.shift();
    if (!v) return;
    try {
      dates[v.ref] = await fetchOne(v);
      done += 1;
    } catch (err) {
      failed += 1;
      failures.push({ ref: v.ref, title: v.title, why: String(err.message ?? err).slice(0, 160) });
    }
    if ((done + failed) % CHECKPOINT_EVERY === 0) {
      console.log(`  ${done + failed}/${done + failed + queue.length} · ok ${done} · falha ${failed}`);
      save();
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
save();

const have = Object.keys(dates).length;
const iso = Object.values(dates).sort();
console.log(`\n✓ ${OUT}`);
console.log(`  ${have}/${manifest.videos.length} datas · ${iso[0]} → ${iso[iso.length - 1]}`);

if (failures.length > 0) {
  console.log(`\n${failures.length} falha(s):`);
  for (const f of failures) console.log(`  ✗ ${f.ref} ${f.title} — ${f.why}`);
}

/**
 * A numeração `[Rxxx]` assume que a ordem do canal é cronológica decrescente.
 * Uma inversão aqui não é bug deste script: é o canal (republicação, estreia
 * agendada, ordenação do YouTube por outra coisa) desmentindo a premissa. Só
 * reporta — consertar exigiria renumerar citações, e isso é decisão humana.
 */
const inRefOrder = manifest.videos.filter((v) => dates[v.ref]);
const inversions = [];
for (let i = 1; i < inRefOrder.length; i += 1) {
  const prev = inRefOrder[i - 1];
  const cur = inRefOrder[i];
  if (dates[cur.ref] > dates[prev.ref]) {
    inversions.push({ prev, cur });
  }
}

if (inversions.length === 0) {
  console.log('\n✓ ordem cronológica limpa: nenhuma inversão.');
} else {
  console.log(`\n⚠ ${inversions.length} inversão(ões) cronológica(s):`);
  for (const { prev, cur } of inversions) {
    console.log(`  ${prev.ref} ${dates[prev.ref]} → ${cur.ref} ${dates[cur.ref]}  (${cur.title})`);
  }
}
