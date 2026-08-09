#!/usr/bin/env node
/**
 * Passe de reparo de `frame`.
 *
 * O enumerado de `frame` do checker nasceu pequeno demais: não tinha gaveta
 * para semanas, meses, dias, horas, gramas, calorias, polegadas nem contagem.
 * Os lotes de extração contornaram enfiando o número numa gaveta de dimensão
 * errada — `g` em `frame: "kg"`, `semanas` em `"anos"`, `horas` em `"min"`,
 * `polegadas` em `"cm"` — e os lotes seguintes leram os vizinhos e replicaram
 * a convenção errada. Erro em dado virou norma.
 *
 * A regra deste script: quando o `unit` do param contradiz o `frame`, o `unit`
 * está certo. O agente registrou a unidade real e só errou a gaveta.
 *
 * O QUE ESTE SCRIPT NUNCA FAZ: converter valor. Se `unit` diz gramas e `frame`
 * dizia kg, o número continua exatamente o mesmo — o defeito é o rótulo, não o
 * valor. Converter introduziria um erro pior do que o que está sendo consertado
 * (é literalmente o bug da run 1: 215 kg lido como training max).
 *
 * Uso: node research/tools/repair-frames.mjs [--dry]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');
const DRY = process.argv.includes('--dry');

/** F001 é o regulamento da IPF, já revisado à mão. Fora do passe. */
const SKIP = new Set(['F001.jsonl']);

/**
 * Tabela de trocas, chaveada por `unit|frame` exato.
 *
 * Só entra aqui par em que a DIMENSÃO do `unit` contradiz a dimensão do
 * `frame`. Unidade de taxa cujo numerador já bate com o frame (`lb/semana` →
 * `lb`, `séries/semana` → `series`, `dias/semana` → `x_semana`) fica de fora:
 * ali o frame guarda o numerador de propósito, e não há enumerado melhor.
 */
const SWAPS = new Map(Object.entries({
  // comprimento: polegada não é centímetro
  'polegadas|cm': 'polegadas',
  'polegada|cm': 'polegadas',

  // tempo: semana não é ano, nem minuto, nem frequência semanal
  'semanas|x_semana': 'semanas',
  'semanas|anos': 'semanas',
  'semanas|min': 'semanas',
  'semana|x_semana': 'semanas',
  'semana do ciclo|anos': 'semanas',
  'meses|anos': 'meses',
  'meses|min': 'meses',
  'dias|anos': 'dias',
  'dias|contagem': 'dias',
  'dia|x_semana': 'dias',
  'h|min': 'horas',
  'h/semana|min': 'horas',
  'horas|min': 'horas',
  'horas/semana|min': 'horas',
  'hora/semana|min': 'horas',
  'hora/dia|min': 'horas',

  // massa e energia: grama não é quilo, caloria não é nada disso
  'g|kg': 'g',
  'kcal|kg': 'kcal',
  'lb|kg': 'lb',

  // proteína por peso corporal: a razão tem gaveta própria
  'g/lb|lb': 'g_por_lb',
  'g por lb de peso corporal|lb': 'g_por_lb',
  'g/kg|kg': 'g_por_kg',

  // fisiologia
  '% FCmax|pct': 'pct_FCmax',
  'pct_FCmax|pct': 'pct_FCmax',
  'bpm|min': 'bpm',
  'bpm|contagem': 'bpm',
  'IMC|pct': 'IMC',
  'escala 0-10|contagem': 'escala_dor',
  'dor_0a10|pct': 'escala_dor',

  // contagem genérica travestida de repetição/série/segundo
  'contagem|seg': 'contagem',
  'passos|reps': 'contagem',
  'ciclos|reps': 'contagem',
  'atletas|reps': 'contagem',
  'meets|reps': 'contagem',
  'tentativas|series': 'contagem',
  'sessoes|series': 'contagem',
  'ciclos/ano|anos': 'contagem',
}));

/**
 * Trocas em que `unit` e `frame` concordam mas ambos apontam para a gaveta
 * antiga porque a específica não existia quando o lote foi escrito. Chave é
 * `id|param`, para não pegar homônimo de outro lote por acidente.
 */
const BY_ID = new Map(Object.entries({
  'V060-01|idade': 'idade',
  'V079-29|idade_amostra': 'idade',
  'V080-15|idade_media_amostra': 'idade',
  'V092-22|n_powerlifters_estudo': 'n_amostra',
}));

const tally = new Map();
let touchedLines = 0;
let touchedFiles = 0;

for (const file of readdirSync(EXTRACT).filter((f) => f.endsWith('.jsonl')).sort()) {
  if (SKIP.has(file)) continue;
  const path = join(EXTRACT, file);
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split('\n');
  let dirty = false;

  const out = lines.map((line) => {
    if (!line.trim()) return line;
    const c = JSON.parse(line);
    let changed = false;
    for (const p of c.params ?? []) {
      if (!p.frame) continue;
      const byId = BY_ID.get(`${c.id}|${p.name}`);
      const swap = byId ?? SWAPS.get(`${p.unit}|${p.frame}`);
      if (!swap || swap === p.frame) continue;
      const key = `${JSON.stringify(p.unit)} : ${p.frame} → ${swap}`;
      tally.set(key, (tally.get(key) ?? 0) + 1);
      p.frame = swap; // valor intocado, de propósito
      changed = true;
    }
    if (!changed) return line;
    dirty = true;
    touchedLines++;
    return JSON.stringify(c);
  });

  if (!dirty) continue;
  touchedFiles++;
  if (!DRY) writeFileSync(path, out.join('\n'));
}

const total = [...tally.values()].reduce((a, b) => a + b, 0);
console.log(`\n${DRY ? '[dry] ' : ''}${total} param(s) corrigido(s) em ${touchedLines} claim(s), ${touchedFiles} lote(s)\n`);
for (const [k, n] of [...tally].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${k}`);
}
console.log('\n  nenhum valor numérico foi alterado — só o rótulo\n');
