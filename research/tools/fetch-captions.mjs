#!/usr/bin/env node
/**
 * Baixa as legendas automáticas do canal e as converte em transcrição citável.
 *
 * A run 1 rodou Whisper large-v3-turbo em vídeo inteiro sempre que o ASR do
 * YouTube "parecia ruim" — caro, e o critério era subjetivo. Aqui a legenda do
 * YouTube é a base para todo mundo, e o Whisper vira instrumento cirúrgico
 * (`list-suspects.mjs` → `verify-suspects.mjs` → `whisper-window.py`) aplicado só
 * onde errar de verdade importa: em cima de número. `squadrons` no lugar de
 * `squatters` não muda nenhuma claim; "3 séries" virando "30 séries" envenena a
 * base inteira.
 *
 * O formato de saída existe para uma coisa só: tornar `[Rxxx @mm:ss]`
 * verificável por máquina. Cada linha carrega o segundo em que começa, então
 * `check-claims.mjs` consegue pegar a citação, abrir a janela certa da
 * transcrição e conferir se o verbatim está mesmo lá.
 *
 * Uso: node research/tools/fetch-captions.mjs [--source blevins] [--only R159] [--force]
 *   sem --source, opera sobre o corpus do Vena, nos caminhos de sempre.
 *   Resumível: pula o que já tem transcrição, salvo --force.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { resolveSource, paths } from './sources.mjs';

const exec = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const SOURCE = resolveSource();
const P = paths(SOURCE, ROOT);
const MANIFEST = P.manifest;
const TRANSCRIPTS = P.transcripts;
const CAPTIONS = P.captions;
const TMP = P.tmp;

/** Quantos segundos de fala cada linha da transcrição agrupa. */
const WINDOW_SEC = 15;
/** Downloads simultâneos. Acima disso o YouTube começa a atrasar resposta. */
const CONCURRENCY = 4;

for (const d of [TRANSCRIPTS, CAPTIONS, TMP]) mkdirSync(d, { recursive: true });

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const force = process.argv.includes('--force');
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;

const mmss = (sec) => {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
};

const slug = (t) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 60);

/**
 * json3 → linhas com timestamp.
 *
 * O ASR do YouTube não pontua e não capitaliza, então não existe "frase" para
 * quebrar. Agrupar por janela de tempo fixa é o que dá uma unidade estável o
 * bastante para uma citação apontar — e o `@mm:ss` da citação cai sempre dentro
 * de exatamente uma linha.
 */
function toLines(json3) {
  const events = (json3.events ?? []).filter((e) => e.segs);
  const words = [];
  for (const e of events) {
    for (const s of e.segs) {
      const text = (s.utf8 ?? '').replace(/\n/g, ' ');
      if (!text.trim()) continue;
      words.push({ t: (e.tStartMs + (s.tOffsetMs ?? 0)) / 1000, text });
    }
  }
  if (words.length === 0) return [];

  const lines = [];
  let bucketStart = words[0].t;
  let buffer = [];
  for (const w of words) {
    if (w.t - bucketStart >= WINDOW_SEC && buffer.length > 0) {
      lines.push({ t: bucketStart, text: buffer.join(' ').replace(/\s+/g, ' ').trim() });
      bucketStart = w.t;
      buffer = [];
    }
    buffer.push(w.text.trim());
  }
  if (buffer.length > 0) {
    lines.push({ t: bucketStart, text: buffer.join(' ').replace(/\s+/g, ' ').trim() });
  }
  return lines;
}

/** yt-dlp entrega YYYYMMDD; a base compara datas como string, então ISO. */
const toIso = (d) => {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(String(d).trim());
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
};

async function fetchOne(v) {
  const base = join(TMP, v.videoId);
  // `--print` no MESMO comando: a extração de metadado é o que custa caro (~10 s
  // por vídeo, latência, não banda), e ela já está acontecendo aqui para achar a
  // trilha de legenda. Pedir a data numa segunda passada dobraria o tempo do
  // corpus inteiro por um campo que veio de graça nesta.
  const { stdout } = await exec(
    'yt-dlp',
    [
      '--skip-download',
      '--write-auto-subs',
      '--sub-langs',
      'en-orig,en',
      '--sub-format',
      'json3',
      '--no-warnings',
      '--print',
      '%(upload_date)s|%(release_date)s',
      '-o',
      base,
      v.url,
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );

  const [upload, release] = stdout.trim().split('|');
  const date = [upload, release].map(toIso).find(Boolean) ?? null;

  // Prefere a trilha original; `en` costuma ser a mesma coisa re-rotulada.
  const found = readdirSync(TMP).filter((f) => f.startsWith(v.videoId) && f.endsWith('.json3'));
  const pick =
    found.find((f) => f.includes('.en-orig.')) ?? found.find((f) => f.includes('.en.')) ?? found[0];
  if (!pick) throw new Error('sem legenda em inglês');

  const rawPath = join(TMP, pick);
  const raw = readFileSync(rawPath, 'utf8');
  const lines = toLines(JSON.parse(raw));
  if (lines.length === 0) throw new Error('legenda vazia');

  // O bruto fica guardado comprimido — é barato e evita depender do YouTube
  // para reconstruir timing por palavra depois.
  writeFileSync(join(CAPTIONS, `${v.ref}.json3.gz`), gzipSync(raw));
  for (const f of found) unlinkSync(join(TMP, f));

  const name = `${v.ref}-${slug(v.title)}.md`;
  const words = lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0);
  const body = lines.map((l) => `[${mmss(l.t)}] ${l.text}`).join('\n');
  const front = [
    '---',
    `ref: ${v.ref}`,
    `videoId: ${v.videoId}`,
    `title: ${JSON.stringify(v.title)}`,
    `url: ${v.url}`,
    `durationSec: ${v.durationSec ?? ''}`,
    'source: captions',
    `words: ${words}`,
    '---',
    '',
  ].join('\n');

  writeFileSync(join(TRANSCRIPTS, name), `${front}${body}\n`);
  // Caminho relativo à raiz do repo: é o que `check-claims.mjs` abre para
  // conferir verbatim. Para o Vena resolve exatamente no caminho de sempre.
  return { file: `${SOURCE.dir}/transcripts/${name}`, words, date };
}

const queue = manifest.videos.filter((v) => {
  if (only && v.ref !== only) return false;
  return force || !v.transcript;
});

console.log(`${queue.length} vídeo(s) a buscar (de ${manifest.videos.length}).\n`);

let done = 0;
let failed = 0;
const failures = [];

async function worker() {
  for (;;) {
    const v = queue.shift();
    if (!v) return;
    try {
      const r = await fetchOne(v);
      v.transcript = r.file;
      v.source = 'captions';
      v.words = r.words;
      // Só preenche buraco, nunca sobrescreve. A data canônica é a que o passe
      // de datação gravou (o Vena tem nos 197); a que vem de carona aqui serve
      // para vídeo que falhou lá, e não pode reabrir uma decisão já tomada.
      if (r.date && v.date === null) v.date = r.date;
      done += 1;
    } catch (err) {
      failed += 1;
      failures.push({ ref: v.ref, title: v.title, why: String(err.message ?? err).slice(0, 120) });
    }
    if ((done + failed) % 20 === 0) {
      console.log(`  ${done + failed}/${done + failed + queue.length} · ok ${done} · falha ${failed}`);
      writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`); // checkpoint
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

const totalWords = manifest.videos.reduce((s, v) => s + (v.words ?? 0), 0);
console.log(`\n✓ ${done} transcrição(ões) · ${totalWords.toLocaleString('pt-BR')} palavras`);
if (failures.length > 0) {
  console.log(`\n${failures.length} falha(s):`);
  for (const f of failures) console.log(`  ✗ ${f.ref} ${f.title} — ${f.why}`);
}
