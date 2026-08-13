#!/usr/bin/env node
/**
 * SÉRIES SEMANAIS SOBRE O PEITORAL — a curva medida, e o critério que a torna
 * auditável.
 *
 * POR QUE ESTE SCRIPT EXISTE. Ficou escrito nos documentos de pesquisa que "o
 * volume semanal sobre o peitoral é invariante em 22 séries por construção".
 * A parte "por construção" vinha de duas derivações reais do PROGRAMA.md:
 *
 *     FP-SETS  = 7 − SUP-V1        (linha 307)
 *     FP4-SETS = 5 − SUP-V4        (linha 308)
 *
 * Elas de fato amarram DOIS PARES em soma constante. O erro foi concluir daí
 * que o TOTAL semanal sobre o peitoral é constante — e é essa conclusão que
 * este script mede. As derivações não falam de `db_press_inclinado` nem de
 * `crucifixo_peck_deck`, que também carregam peitoral e que RAMPLAM ao longo
 * do bloco. Somar só as duas linhas de barra (o que `conta-peito.mjs` faz) dá
 * 22 invariante; somar TUDO que carrega peitoral não dá.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * O CRITÉRIO DE CONTAGEM, declarado. É ele que torna o número auditável, e
 * qualquer um dos três eixos abaixo mudado muda o número:
 *
 *   1. QUAIS EXERCÍCIOS CONTAM. Conta como "peitoral" todo exercício cujo
 *      `muscleMap.peito > 0` no registro do PRÓPRIO APP
 *      (`src/domain/exerciseRegistry.ts`). Não é lista escrita à mão aqui: é o
 *      mesmo mapa que o app usa para atribuir músculo na tela. No Bloco 1 isso
 *      resolve para exatamente 4 exercícios, todos com peso 1 (o script
 *      imprime a lista resolvida no cabeçalho, então ela é conferível a cada
 *      execução, e não confiável de cor):
 *
 *        supino_pausado_competicao   Supino Pausado (Competição)
 *        floor_press                 Floor Press (Barra)
 *        db_press_inclinado          Supino Inclinado com Halter
 *        crucifixo_peck_deck         Crucifixo no Peck Deck
 *
 *      Fora da conta ficam tríceps, deltoide e todo o resto: `peito` = 0.
 *
 *   2. O QUE É UMA "SÉRIE". Conta `sets` — SÉRIES DE TRABALHO. Aquecimento
 *      (`warmupSets`) NÃO entra no total; é reportado em coluna separada
 *      justamente para que a escolha fique visível em vez de escondida. Esta
 *      é a mesma convenção da restrição R3 do programa ("supino ≥ 22
 *      séries/semana", que conta só trabalho).
 *
 *   3. QUE SEMANAS. O bloco é S1–S16. S17 e S18 são taper e simulado de
 *      competição e não são parte da curva sob teste — aparecem na tabela
 *      marcadas, mas ficam fora do veredito.
 *
 * Nenhum número é digitado neste arquivo: tudo sai de `venaBlock1Weeks`, o
 * programa GERADO por `scripts/build-vena-block1.mjs`.
 *
 * Uso: node research/tools/auditoria-peito/series-peito.mjs
 */
import '../../../scripts/ts-resolve.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

// O registro de exercícios se popula por efeito colateral destes três imports.
await import(join(ROOT, 'src/data/exercises/definitions.ts'));
await import(join(ROOT, 'src/data/exercises/powerbuilding.ts'));
await import(join(ROOT, 'src/data/exercises/vena.ts'));
const { getExerciseMuscleMap } = await import(join(ROOT, 'src/domain/exerciseRegistry.ts'));
const { venaBlock1Weeks } = await import(join(ROOT, 'src/data/program/vena-block1/generated.ts'));

const SEMANAS_DO_BLOCO = 16;
const contaComoPeitoral = (id) => (getExerciseMuscleMap(id).peito ?? 0) > 0;

// ── 1. O critério, resolvido contra o registro e impresso ────────────────────
const catalogo = new Map();
for (const w of venaBlock1Weeks) {
  for (const d of w.days ?? []) {
    for (const b of d.exercises ?? []) {
      if (!catalogo.has(b.exerciseId)) {
        catalogo.set(b.exerciseId, { nome: b.exerciseName, peito: getExerciseMuscleMap(b.exerciseId).peito ?? 0 });
      }
    }
  }
}
const contados = [...catalogo].filter(([id]) => contaComoPeitoral(id));
const descartados = [...catalogo].filter(([id]) => !contaComoPeitoral(id));

console.log('# CRITÉRIO — "peitoral" = muscleMap.peito > 0 no registro do app');
console.log(`  exercícios do Bloco 1 que ENTRAM na conta (${contados.length} de ${catalogo.size}):`);
for (const [id, v] of contados) console.log(`    peito=${v.peito}  ${id.padEnd(28)} ${v.nome}`);
console.log(`  descartados (peito = 0): ${descartados.length} exercícios`);
console.log('  a unidade contada é `sets` (séries de TRABALHO); `warmupSets` fica em coluna à parte');
console.log();

// ── 2. A curva, semana a semana ──────────────────────────────────────────────
const porSemana = [];
for (const w of venaBlock1Weeks) {
  const porExercicio = new Map();
  let total = 0;
  let aquecimento = 0;
  for (const d of w.days ?? []) {
    for (const b of d.exercises ?? []) {
      if (!contaComoPeitoral(b.exerciseId)) continue;
      const s = b.sets ?? 0;
      total += s;
      aquecimento += b.warmupSets ?? 0;
      porExercicio.set(b.exerciseId, (porExercicio.get(b.exerciseId) ?? 0) + s);
    }
  }
  porSemana.push({ semana: w.weekNumber, total, aquecimento, porExercicio });
}

const idsContados = contados.map(([id]) => id);
console.log('# A CURVA — séries de trabalho sobre o peitoral, por semana');
console.log(
  'sem | TOTAL | aquec | ' + idsContados.map((id) => id.slice(0, 12).padStart(12)).join(' | ') + ' | escopo',
);
for (const r of porSemana) {
  console.log(
    [
      String(r.semana).padStart(3),
      String(r.total).padStart(5),
      String(r.aquecimento).padStart(5),
      ...idsContados.map((id) => String(r.porExercicio.get(id) ?? 0).padStart(12)),
      r.semana <= SEMANAS_DO_BLOCO ? 'bloco' : 'taper/simulado — fora do veredito',
    ].join(' | '),
  );
}

// ── 3. O veredito sobre a afirmação derrubada ────────────────────────────────
const bloco = porSemana.filter((r) => r.semana <= SEMANAS_DO_BLOCO);
const curva = bloco.map((r) => r.total);
const distintos = [...new Set(curva)].sort((a, b) => a - b);
const min = Math.min(...curva);
const max = Math.max(...curva);

console.log();
console.log('# VEREDITO — "o total é invariante em 22 séries por construção"');
console.log(`  curva S1–S${SEMANAS_DO_BLOCO}: ${curva.join(',')}`);
console.log(`  valores distintos: {${distintos.join(', ')}}`);
console.log(`  semanas em que o total é 22: ${bloco.filter((r) => r.total === 22).length} de ${bloco.length}`);
console.log(
  distintos.length === 1
    ? `  -> INVARIANTE em ${distintos[0]}.`
    : `  -> NÃO É INVARIANTE. Sobe de ${min} a ${max} ao longo do bloco. E nunca vale 22:`
      + ` o 22 conta só as duas linhas de BARRA (supino pausado + floor press) e ignora`
      + ` supino inclinado com halter e peck deck.`,
);

// ── 4. O que SOBREVIVE: as duas derivações de par ────────────────────────────
// FP-SETS = 7 − SUP-V1 (D1) e FP4-SETS = 5 − SUP-V4 (D4). Reconstruídas do
// GERADO, não da grade markdown: SUP-V1 é o supino pausado de papel `volume` no
// D1 e FP-SETS o floor press do mesmo dia; idem no D4.
const linhaDe = (w, dia, f) => {
  const d = (w.days ?? [])[dia - 1];
  return (d?.exercises ?? []).find(f) ?? null;
};
const paresEsperados = { 'D1  SUP-V1 + FP-SETS': 7, 'D4  SUP-V4 + FP4-SETS': 5 };

console.log();
console.log('# O QUE SOBREVIVE — as duas derivações de par, 1:1');
console.log('sem | SUP-V1 | FP-SETS | soma(=7?) | SUP-V4 | FP4-SETS | soma(=5?)');
let paresOk = true;
for (const w of venaBlock1Weeks) {
  if (w.weekNumber > SEMANAS_DO_BLOCO) continue;
  const supV1 = linhaDe(w, 1, (b) => b.countsAs === 'supino_pausado' && b.role === 'volume')?.sets ?? null;
  const fp1 = linhaDe(w, 1, (b) => b.exerciseId === 'floor_press')?.sets ?? null;
  const supV4 = linhaDe(w, 4, (b) => b.countsAs === 'supino_pausado' && b.role === 'volume')?.sets ?? null;
  const fp4 = linhaDe(w, 4, (b) => b.exerciseId === 'floor_press')?.sets ?? null;
  const s1 = supV1 + fp1;
  const s4 = supV4 + fp4;
  if (s1 !== paresEsperados['D1  SUP-V1 + FP-SETS'] || s4 !== paresEsperados['D4  SUP-V4 + FP4-SETS']) paresOk = false;
  console.log(
    [
      String(w.weekNumber).padStart(3),
      String(supV1).padStart(6),
      String(fp1).padStart(7),
      `${String(s1).padStart(4)} ${s1 === 7 ? 'ok' : 'FUROU'}`.padStart(9),
      String(supV4).padStart(6),
      String(fp4).padStart(8),
      `${String(s4).padStart(4)} ${s4 === 5 ? 'ok' : 'FUROU'}`.padStart(9),
    ].join(' | '),
  );
}
console.log();
console.log(
  paresOk
    ? '  -> AS DUAS SOMAS SÃO INVARIANTES (7 e 5) em todas as S1–S16. Consequência prática\n'
      + '     intacta: recuar um degrau de SUP-V1 ou SUP-V4 adiciona uma série de floor press\n'
      + '     na proporção 1:1 e portanto NÃO reduz a carga total sobre o peitoral.'
    : '  -> ALGUMA SOMA FUROU. As derivações do PROGRAMA.md não descrevem o gerado.',
);
