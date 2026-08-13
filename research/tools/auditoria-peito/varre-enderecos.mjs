#!/usr/bin/env node
/**
 * VARREDURA DE ENDERECOS `[Rnnn @mm:ss]` — o formato que `check-evidence.mjs`
 * descarta em silencio.
 *
 * `check-evidence.mjs` so resolve `Vnnn-nn`. Todo endereco escrito como
 * `[R79 @03:35]` passa por ele sem ser visto. Este script resolve o formato:
 * para cada `[Rn @mm:ss]` encontrado num arquivo, confere se existe alguma
 * claim daquele `src` naquela marca em research/extract/<SRC>.jsonl.
 *
 * Uso:
 *   node research/tools/auditoria-peito/varre-enderecos.mjs <arquivo...>
 *   (sem argumento: varre PROGRAMA.md e os scripts da auditoria)
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const EXTRACT = join(ROOT, 'research/extract');

const alvos = process.argv.slice(2);
if (!alvos.length) {
  alvos.push(join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md'));
  const dir = join(ROOT, 'research/tools/auditoria-peito');
  for (const f of readdirSync(dir)) if (f.endsWith('.mjs')) alvos.push(join(dir, f));
}

/** Cache de marcas por src. */
const marcas = new Map();
function marcasDe(src) {
  if (marcas.has(src)) return marcas.get(src);
  const p = join(EXTRACT, `${src}.jsonl`);
  if (!existsSync(p)) { marcas.set(src, null); return null; }
  const set = new Map();
  for (const l of readFileSync(p, 'utf8').trim().split('\n')) {
    if (!l.trim()) continue;
    const o = JSON.parse(l);
    if (!set.has(o.at)) set.set(o.at, []);
    set.get(o.at).push(o.id);
  }
  marcas.set(src, set);
  return set;
}

/** `[R79 @03:35]`, `[R11 @02:36-03:07]`, `[R170 @08:30]`. */
const RE = /\[R(\d{1,3})\s*@\s*(\d{1,2}:\d{2})(?:-(\d{1,2}:\d{2}))?\]/g;

let total = 0; let fabricados = 0; let semFonte = 0;
const achados = [];
for (const arq of alvos) {
  const txt = readFileSync(arq, 'utf8');
  const linhas = txt.split('\n');
  linhas.forEach((linha, i) => {
    for (const m of linha.matchAll(RE)) {
      total += 1;
      const src = 'R' + String(m[1]).padStart(3, '0');
      const at = m[2].length === 4 ? '0' + m[2] : m[2];
      const set = marcasDe(src);
      if (set === null) { semFonte += 1; achados.push({ arq, linha: i + 1, txt: m[0], veredito: 'SEM ARQUIVO DE FONTE' }); continue; }
      if (set.has(at)) continue;
      // fim de faixa tambem vale (ex.: @02:36-03:07)
      if (m[3] && set.has(m[3].length === 4 ? '0' + m[3] : m[3])) continue;
      fabricados += 1;
      const perto = [...set.keys()].sort()
        .map((k) => ({ k, d: Math.abs(seg(k) - seg(at)) }))
        .sort((a, b) => a.d - b.d).slice(0, 2)
        .map((x) => `${x.k} (${set.get(x.k).join(',')})`);
      achados.push({ arq, linha: i + 1, txt: m[0], veredito: 'NAO EXISTE', perto });
    }
  });
}
function seg(t) { const [a, b] = t.split(':').map(Number); return a * 60 + b; }

for (const a of achados) {
  console.log(`${a.veredito.padEnd(20)} ${a.txt.padEnd(20)} ${a.arq.replace(ROOT + '/', '')}:${a.linha}`
    + (a.perto ? `  mais proximas: ${a.perto.join(' · ')}` : ''));
}
console.log();
console.log(`enderecos [Rnn @mm:ss] encontrados: ${total}`);
console.log(`   nao existem na base: ${fabricados}`);
console.log(`   sem arquivo de fonte: ${semFonte}`);
console.log(`   resolvem: ${total - fabricados - semFonte}`);
