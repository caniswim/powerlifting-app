#!/usr/bin/env node
/**
 * AUDITORIA — "o eixo que mudou mais recentemente".
 *
 * A tabela do §1.2, segundo degrau, manda: *"recua um degrau do eixo QUE MUDOU
 * MAIS RECENTEMENTE"*. Este script pergunta se essa frase tem referente: para
 * cada semana, quais colunas do eixo `exposicao_peito` se moveram, e se existe
 * UMA resposta ou várias.
 *
 * Lê as GRADES B e C de `PROGRAMA.md` (a fonte) e cruza com o que o gerador
 * publicou. Nenhum valor digitado aqui.
 *
 * Uso: node research/tools/auditoria-peito/eixos-degrau.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const SRC = join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md');
const md = readFileSync(SRC, 'utf8');

/** Extrai uma grade markdown pelo titulo da secao. */
function grade(titulo) {
  const i = md.indexOf(titulo);
  if (i < 0) throw new Error(`grade nao encontrada: ${titulo}`);
  const linhas = md.slice(i).split('\n').filter((l) => l.trim().startsWith('|'));
  const cel = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
  const head = cel(linhas[0]);
  const rows = [];
  for (const l of linhas.slice(2)) {
    const c = cel(l);
    if (!/^\d+$/.test(c[0])) break;
    rows.push(c);
  }
  return { head, rows };
}

const B = grade('### GRADE B — supino');
const C = grade('### GRADE C — terra, peito alongado');

/** Colunas que o §1.2 lista como "degrau de exposicao". */
const EIXOS_GATE = ['SUP-V1', 'SUP-V4', 'PAUSA-P', 'PEC-SETS', 'FP-SETS', 'FP4-SETS', 'FP-RPE', 'FP4-RPE'];

const valores = {}; // eixo -> {semana: valor}
for (const { head, rows } of [B, C]) {
  head.forEach((nome, idx) => {
    if (idx === 0) return;
    for (const r of rows) {
      const semana = Number(r[0]);
      (valores[nome] ??= {})[semana] = r[idx];
    }
  });
}

// FP-SETS e FP4-SETS sao DERIVADAS (7 - SUP-V1 / 5 - SUP-V4) e nao tem coluna
// propria na grade: reconstruidas aqui a partir do bloco ```derivacoes```.
const derivacoes = md.match(/```derivacoes\n([\s\S]*?)```/)[1];
const derivadas = {};
for (const l of derivacoes.split('\n')) {
  const m = l.match(/^(FP-SETS|FP4-SETS)\s*=\s*(\d+)\s*-\s*([A-Z0-9-]+)/);
  if (m) derivadas[m[1]] = { base: Number(m[2]), de: m[3] };
}
for (const [nome, d] of Object.entries(derivadas)) {
  valores[nome] = {};
  for (const [s, v] of Object.entries(valores[d.de] ?? {})) {
    valores[nome][s] = /^\d+$/.test(v) ? String(d.base - Number(v)) : '—';
  }
}

const semanas = [...Array(16)].map((_, i) => i + 1);

console.log('=== VALOR POR SEMANA DAS 8 COLUNAS QUE O §1.2 CONGELA ===');
console.log('     ' + EIXOS_GATE.map((e) => e.padStart(9)).join(''));
for (const s of semanas) {
  console.log(`S${String(s).padStart(2)}  ` + EIXOS_GATE.map((e) => String(valores[e]?.[s] ?? '—').padStart(9)).join(''));
}

console.log('\n=== O QUE MUDOU EM CADA SEMANA (vs semana anterior) ===');
const mudancas = {};
for (const s of semanas.slice(1)) {
  const mud = EIXOS_GATE.filter((e) => {
    const a = valores[e]?.[s - 1]; const b = valores[e]?.[s];
    return a !== undefined && b !== undefined && a !== b;
  });
  mudancas[s] = mud;
  const dir = mud.map((e) => {
    const a = valores[e][s - 1]; const b = valores[e][s];
    const num = (x) => Number(String(x).replace(/[^\d.]/g, ''));
    const seta = num(b) > num(a) ? '↑' : '↓';
    return `${e} ${a}${seta}${b}`;
  });
  console.log(`S${String(s).padStart(2)}: ${mud.length} eixo(s)` + (mud.length ? ` — ${dir.join(' · ')}` : ' — NENHUM'));
}

console.log('\n=== "EIXO QUE MUDOU MAIS RECENTEMENTE", RESOLVIDO POR SEMANA ===');
console.log('(a regra do 2o degrau do §1.2 manda recuar ESTE eixo)');
for (const s of semanas) {
  let ultima = null;
  for (let k = s; k >= 2; k -= 1) if (mudancas[k]?.length) { ultima = k; break; }
  if (!ultima) { console.log(`S${String(s).padStart(2)}: NENHUM eixo mudou ainda no bloco — regra sem referente`); continue; }
  const set = mudancas[ultima];
  const veredito = set.length === 1 ? `UNICO: ${set[0]}` : `AMBIGUO (${set.length}): ${set.join(', ')}`;
  console.log(`S${String(s).padStart(2)}: ultima mudanca foi na S${ultima} → ${veredito}`);
}

console.log('\n=== SIMULTANEIDADE ESTRUTURAL ===');
const paresDerivados = Object.entries(derivadas).map(([d, { de }]) => [de, d]);
for (const [base, dep] of paresDerivados) {
  const juntos = semanas.slice(1).filter((s) => mudancas[s]?.includes(base) && mudancas[s]?.includes(dep));
  const soBase = semanas.slice(1).filter((s) => mudancas[s]?.includes(base) && !mudancas[s]?.includes(dep));
  console.log(`${dep} = ${derivadas[dep].base} − ${base}: mudam JUNTOS em ${juntos.length} semana(s) ${JSON.stringify(juntos)}; `
    + `${base} sozinho em ${soBase.length}`);
}

console.log('\n=== SEMANAS SEM NENHUM DEGRAU DE EXPOSICAO ===');
console.log(semanas.slice(1).filter((s) => !mudancas[s]?.length).map((s) => `S${s}`).join(' ') || '(nenhuma)');
