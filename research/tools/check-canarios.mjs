#!/usr/bin/env node
/**
 * Recalcula se cada canário ainda calibra alguma coisa.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O DEFEITO QUE ESTE ARQUIVO PREVINE
 *
 * Um canário "impossível" só mede se continuar impossível. O do peaking do
 * Blevins foi escrito quando a base tinha ZERO claims `G`; horas depois a
 * ingestão do Blevins entrou e 1.819 claims apareceram — 91 delas no tópico
 * `pico`. A partir daquele instante o canário deixou de ser canário: uma resposta
 * bem-fundamentada passaria a ser possível, e um "responde bem" deixaria de ser
 * evidência de que o avaliador respondeu do próprio conhecimento.
 *
 * Ninguém teria percebido. É o pior modo de falha de um instrumento: continuar
 * dando leitura depois de ter parado de medir.
 *
 * Então o "porquê" de cada canário impossível não é uma frase em prosa — é um
 * PREDICADO sobre a base, recontado a cada execução. Se o predicado deixou de
 * dar zero, este arquivo falha e diz quantas claims apareceram e quais são, para
 * o canário ser aposentado ou reescrito conscientemente.
 *
 * A simetria vale para o outro lado: um canário "presente" que perdeu os ids que
 * o sustentavam (renumeração, arquivo reextraído) também parou de medir, e
 * também falha aqui.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AS TRÊS FAMÍLIAS
 *
 *   presente   — a resposta está comprovadamente na base. `sustenta` lista os
 *                ids, `numeros` os valores que têm de sair deles e `frases` os
 *                termos que têm de continuar no texto deles. Exige-se um dos
 *                dois: só a lista de ids prova que os ids EXISTEM, e um ataque
 *                mostrou o custo — reescritas as claims de C02 e C04 para "O sol
 *                é quadrado", os dois canários seguiram verdes, inclusive o que
 *                existe para medir fidelidade de prosa. Se o avaliador NÃO
 *                responde, a base ou a recuperação estão quebradas.
 *   impossivel — a fonte ou o tier está em zero. Qualquer resposta substantiva
 *                veio de fora. `vazio` é o predicado que precisa continuar zerado.
 *   armadilha  — parece respondível e não é. Dois predicados: `vazio` (o número
 *                pedido não existe) e `ruido` (existe material VIZINHO em
 *                quantidade, que é o que faz a pergunta parecer respondível).
 *                Se o ruído sumisse, a armadilha viraria uma pergunta obviamente
 *                sem resposta e pararia de armar.
 *
 * Uso:
 *   node research/tools/check-canarios.mjs [--json] [--verbose] [--extract <dir>]
 *        [--canarios <arquivo>]
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TIERS, SCOPES, MODOS, FRAMES, carregarTopicos, carregarClaims, numerosDaClaim } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};
const EXTRACT = arg('--extract') ?? join(ROOT, 'research/extract');
const ARQUIVO = arg('--canarios') ?? join(ROOT, 'research/kb/CANARIOS.json');
const JSON_OUT = process.argv.includes('--json');
const VERBOSE = process.argv.includes('--verbose');

if (!existsSync(ARQUIVO)) {
  console.error(`✗ ${ARQUIVO} não existe — sem canários não há como saber se a medição mede`);
  process.exit(2);
}

const doc = JSON.parse(readFileSync(ARQUIVO, 'utf8'));
const { claims, porId } = carregarClaims(EXTRACT);
if (claims.length === 0) {
  console.error(`✗ nenhuma claim em ${EXTRACT}`);
  process.exit(2);
}

const TOPICS = carregarTopicos(ROOT);
const PREFIXOS = new Set(claims.map((c) => String(c.src ?? '').slice(0, 1)).filter(Boolean));

// ── o DSL de predicado ───────────────────────────────────────────────────────
//
// Pequeno de propósito. Um predicado que precisasse de código para ser escrito
// sairia do JSON e voltaria a ser prosa — e prosa não recusa nada.

const CHAVES = new Set([
  'tier', 'srcPrefix', 'topic', 'topicQualquer', 'modo', 'scope',
  'frame', 'frameQualquer', 'temParam', 'grep', 'grepNao',
]);

/**
 * Os campos do próprio canário. Existem pela mesma razão que `CHAVES`: um campo
 * com typo (`frazes`, `sustentam`) é IGNORADO em silêncio, e um canário que
 * perdeu sua âncora sem avisar volta a ser prosa.
 */
const CAMPOS_CANARIO = new Set([
  'id', 'familia', 'pergunta', 'porque', 'esperado',
  'sustenta', 'numeros', 'frases', 'vazio', 'ruido', 'historia',
]);

/**
 * Um filtro com typo nunca casa, fica em zero para sempre, e ZERO é exatamente o
 * resultado que um canário "impossível" reporta como sucesso. É a falha
 * silenciosa mais perigosa deste arquivo — um canário morto que se declara vivo.
 * Por isso todo valor de enumerado é conferido contra a lista fechada real,
 * importada de `kb.mjs`, e não contra uma cópia.
 */
function validarFiltro(f, onde, erros) {
  for (const k of Object.keys(f)) {
    if (!CHAVES.has(k)) erros.push(`${onde}: chave de filtro "${k}" não existe (conhecidas: ${[...CHAVES].join(', ')})`);
  }
  if (f.tier && !TIERS.has(f.tier)) erros.push(`${onde}: tier "${f.tier}" fora do enumerado`);
  if (f.scope && !SCOPES.has(f.scope)) erros.push(`${onde}: scope "${f.scope}" fora do enumerado`);
  if (f.modo && !MODOS.has(f.modo)) erros.push(`${onde}: modo "${f.modo}" fora do enumerado`);
  for (const fr of [f.frame, ...(f.frameQualquer ?? [])].filter(Boolean)) {
    if (!FRAMES.has(fr)) erros.push(`${onde}: frame "${fr}" fora do enumerado`);
  }
  for (const t of [...(f.topic ?? []), ...(f.topicQualquer ?? [])]) {
    if (!TOPICS.has(t)) erros.push(`${onde}: tópico "${t}" fora do vocabulário fechado`);
  }
  if (f.srcPrefix && !PREFIXOS.has(f.srcPrefix)) {
    erros.push(`${onde}: srcPrefix "${f.srcPrefix}" não existe na base (existem: ${[...PREFIXOS].join(', ')})`);
  }
  for (const g of [f.grep, f.grepNao].filter(Boolean)) {
    try {
      new RegExp(g, 'i');
    } catch (e) {
      erros.push(`${onde}: grep "${g}" não é regex válida — ${e.message}`);
    }
  }
  // ── o grep MORTO, que era o buraco desta função ────────────────────────────
  //
  // Os enumerados eram conferidos e o `grep` não era — só a sintaxe. Mas o grep é
  // o único campo de texto livre, é onde mora a semântica de C09/C10/C13/C14, e é
  // o campo que já errou uma vez (ver o `_nota` de C13). Trocar `creatin` por
  // `kreatin` deixava os três canários em zero com um ✓ e exit 0: o canário morto
  // que se declara vivo, exatamente o que o cabeçalho promete impedir.
  //
  // A regra é a que distingue os dois usos do grep. Quando o grep NARROWS outro
  // predicado (`tier: O` + grep), ele precisa estar vivo sozinho na base — se não
  // casa nada em lugar nenhum, não está medindo, está desligado. Quando o grep é
  // o predicado INTEIRO (o `PMID|10\.` de C06), zero é a medida em si e cobrar
  // vida seria cobrar o contrário do que o canário afirma.
  if (f.grep && Object.keys(f).filter((k) => k !== 'grep').length > 0) {
    const rx = new RegExp(f.grep, 'i');
    const vivos = claims.filter((c) =>
      rx.test(`${c.claim ?? ''} ${c.verbatim ?? ''} ${c.verbatimWhisper ?? ''}`),
    ).length;
    if (vivos === 0) {
      erros.push(
        `${onde}: grep "${f.grep}" não casa NENHUMA claim na base inteira, mesmo sem os outros ` +
          'filtros — predicado desligado (typo?). Zero aqui não é a medida, é a ausência dela.',
      );
    }
  }
}

function casa(c, f) {
  const texto = `${c.claim ?? ''} ${c.verbatim ?? ''} ${c.verbatimWhisper ?? ''}`;
  if (f.tier && c.tier !== f.tier) return false;
  if (f.srcPrefix && !String(c.src ?? '').startsWith(f.srcPrefix)) return false;
  if (f.modo && c.modo !== f.modo) return false;
  if (f.scope && c.scope !== f.scope) return false;
  if (f.topic && !f.topic.every((t) => (c.topic ?? []).includes(t))) return false;
  if (f.topicQualquer && !f.topicQualquer.some((t) => (c.topic ?? []).includes(t))) return false;
  if (f.frame && !(c.params ?? []).some((p) => p.frame === f.frame)) return false;
  if (f.frameQualquer && !(c.params ?? []).some((p) => f.frameQualquer.includes(p.frame))) return false;
  if (f.temParam !== undefined && (c.params ?? []).length > 0 !== f.temParam) return false;
  if (f.grep && !new RegExp(f.grep, 'i').test(texto)) return false;
  if (f.grepNao && new RegExp(f.grepNao, 'i').test(texto)) return false;
  return true;
}

/** `vazio` e `ruido` aceitam um predicado ou uma lista deles — a união do que casar. */
const listar = (pred) => {
  const filtros = Array.isArray(pred.filtro) ? pred.filtro : [pred.filtro];
  const vistos = new Set();
  const out = [];
  for (const f of filtros) {
    for (const c of claims) {
      if (casa(c, f) && !vistos.has(c.id)) {
        vistos.add(c.id);
        out.push(c);
      }
    }
  }
  return out;
};

// Os números que uma claim pode emprestar vêm de `kb.mjs`, IMPORTADOS e não
// recopiados. A cópia que morava aqui dizia no comentário "mesma regra do
// check-answer.mjs" e já não era: não sabia separador de milhar (`1.500` virava
// 1,5) nem número por extenso. Duas descrições da mesma coisa afastando-se em
// silêncio é o defeito de abertura do SCHEMA.md, cometido dentro do instrumento
// que existe para pegá-lo.

// ── avaliação ────────────────────────────────────────────────────────────────

const erros = [];
const resultados = [];
const FAMILIAS = new Set(['presente', 'impossivel', 'armadilha']);
const idsVistos = new Set();

for (const can of doc.canarios ?? []) {
  const onde = `canário ${can.id ?? '(sem id)'}`;
  const linha = { id: can.id, familia: can.familia, ok: true, detalhe: '' };

  for (const campo of ['id', 'familia', 'pergunta', 'porque', 'esperado']) {
    if (!String(can[campo] ?? '').trim()) erros.push(`${onde}: campo "${campo}" vazio — canário sem ${campo} não é auditável`);
  }
  if (idsVistos.has(can.id)) erros.push(`${onde}: id duplicado`);
  idsVistos.add(can.id);
  if (!FAMILIAS.has(can.familia)) {
    erros.push(`${onde}: familia "${can.familia}" fora de ${[...FAMILIAS].join(' / ')}`);
    continue;
  }

  for (const k of Object.keys(can)) {
    if (!CAMPOS_CANARIO.has(k)) {
      erros.push(`${onde}: campo "${k}" não existe no formato — um campo com typo é ignorado em silêncio`);
    }
  }

  if (can.familia === 'presente') {
    const ids = can.sustenta ?? [];
    if (ids.length === 0) erros.push(`${onde}: família "presente" exige sustenta com os ids que provam a resposta`);
    const mortos = ids.filter((i) => !porId.has(i));
    const pool = new Set();
    const textoSustenta = ids
      .map((i) => porId.get(i))
      .filter(Boolean)
      .map((c) => `${c.claim ?? ''} ${c.verbatim ?? ''} ${c.verbatimWhisper ?? ''}`)
      .join(' \n ')
      .toLowerCase();
    for (const i of ids) {
      const c = porId.get(i);
      if (c) for (const n of numerosDaClaim(c)) pool.add(n);
    }
    const semSuporte = (can.numeros ?? []).filter((n) => !pool.has(n));

    // ── conteúdo, não só id ──────────────────────────────────────────────────
    //
    // `numeros` ancorava o conteúdo dos canários numéricos, e os OUTROS não
    // tinham âncora nenhuma. Um ataque provou o custo: reescrevendo as 9 claims
    // de C02 e C04 para "O sol é quadrado", os dois canários continuaram ✓ —
    // inclusive C02, que existe exatamente para medir fidelidade de PROSA, que é
    // o que o check-answer.mjs não consegue provar. Id vivo com conteúdo trocado
    // é a mesma leitura vazia que o arquivo inteiro existe para impedir.
    //
    // `frases` é a âncora de prosa: termos que TÊM de continuar no texto das
    // claims de `sustenta`. Toda família "presente" precisa de uma das duas.
    const frases = can.frases ?? [];
    if (frases.length === 0 && (can.numeros ?? []).length === 0) {
      erros.push(
        `${onde}: família "presente" sem "numeros" e sem "frases" — só prova que os ids EXISTEM. ` +
          'Reescreva o conteúdo das claims e este canário continua verde.',
      );
    }
    const semFrase = frases.filter((f) => !textoSustenta.includes(String(f).toLowerCase()));
    if (semFrase.length > 0) {
      linha.ok = false;
      erros.push(
        `${onde}: as frases ${semFrase.map((f) => `"${f}"`).join(', ')} sumiram do texto das claims de ` +
          'sustenta — os ids continuam vivos, o conteúdo que a resposta esperada exige, não',
      );
    }
    if (mortos.length > 0) {
      linha.ok = false;
      erros.push(
        `${onde}: ${mortos.length} id(s) que sustentavam a resposta não existem mais (${mortos.join(', ')}) — ` +
          'o canário parou de provar presença; reancore-o em ids vivos',
      );
    }
    if (semSuporte.length > 0) {
      linha.ok = false;
      erros.push(
        `${onde}: os números ${semSuporte.join(', ')} não aparecem mais em nenhuma claim de sustenta — ` +
          'a resposta esperada deixou de ser derivável da base',
      );
    }
    linha.detalhe = `${ids.length} id(s), ${(can.numeros ?? []).length} número(s), ${frases.length} frase(s)`;
  }

  if (can.familia === 'impossivel' || can.familia === 'armadilha') {
    if (!can.vazio?.filtro) {
      erros.push(`${onde}: família "${can.familia}" exige vazio.filtro — o predicado que tem de continuar zerado`);
    } else {
      for (const f of Array.isArray(can.vazio.filtro) ? can.vazio.filtro : [can.vazio.filtro]) {
        validarFiltro(f, `${onde} vazio`, erros);
      }
      const achados = listar(can.vazio);
      const maximo = can.vazio.maximo ?? 0;
      linha.vazio = achados.length;
      if (achados.length > maximo) {
        linha.ok = false;
        erros.push(
          `${onde}: DEIXOU DE SER ${can.familia === 'armadilha' ? 'ARMADILHA' : 'IMPOSSÍVEL'} — ` +
            `${achados.length} claim(s) casam agora com "${can.vazio.descricao ?? '(sem descrição)'}" ` +
            `(máximo tolerado ${maximo}): ${achados.slice(0, 6).map((c) => c.id).join(', ')}` +
            `${achados.length > 6 ? ` …+${achados.length - 6}` : ''}\n` +
            '        Este canário não calibra mais nada. Aposente-o ou reescreva-o — e refaça a\n' +
            '        medição anterior sabendo que ele já podia estar respondível quando foi usado.',
        );
      }
    }

    if (can.familia === 'armadilha') {
      if (!can.ruido?.filtro) {
        erros.push(`${onde}: família "armadilha" exige ruido.filtro — o material vizinho que faz a pergunta parecer respondível`);
      } else {
        for (const f of Array.isArray(can.ruido.filtro) ? can.ruido.filtro : [can.ruido.filtro]) {
          validarFiltro(f, `${onde} ruido`, erros);
        }
        const achados = listar(can.ruido);
        const minimo = can.ruido.minimo ?? 1;
        linha.ruido = achados.length;
        if (achados.length < minimo) {
          linha.ok = false;
          erros.push(
            `${onde}: PAROU DE ARMAR — só ${achados.length} claim(s) de material vizinho ` +
              `("${can.ruido.descricao ?? '(sem descrição)'}", mínimo ${minimo}). ` +
              'Sem vizinhança a pergunta é obviamente sem resposta e qualquer um recusa.',
          );
        }
      }
    }
    linha.detalhe = [
      linha.vazio !== undefined ? `vazio ${linha.vazio}/${can.vazio?.maximo ?? 0}` : null,
      linha.ruido !== undefined ? `ruído ${linha.ruido}≥${can.ruido?.minimo ?? 1}` : null,
    ].filter(Boolean).join('  ');
  }

  resultados.push(linha);
}

// ── deriva da base desde que os canários foram escritos ──────────────────────

const tiersAgora = {};
for (const c of claims) tiersAgora[c.tier] = (tiersAgora[c.tier] ?? 0) + 1;
const deriva = [];
const registrado = doc.baseNoMomento ?? {};
if (registrado.claims && registrado.claims !== claims.length) {
  deriva.push(`total de claims: ${registrado.claims} → ${claims.length}`);
}
for (const [t, n] of Object.entries(registrado.tiers ?? {})) {
  const agora = tiersAgora[t] ?? 0;
  if (agora !== n) deriva.push(`tier ${t}: ${n} → ${agora}`);
}

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: erros.length === 0, resultados, deriva, tiersAgora, erros }, null, 2));
  process.exit(erros.length > 0 ? 1 : 0);
}

const porFamilia = (f) => resultados.filter((r) => r.familia === f).length;
console.log(`\nCanários — ${resultados.length} em ${ARQUIVO.replace(`${ROOT}/`, '')}, recontados contra ${claims.length} claims`);
console.log(`  presente ... ${porFamilia('presente')}   impossivel ... ${porFamilia('impossivel')}   armadilha ... ${porFamilia('armadilha')}`);

if (VERBOSE) {
  console.log('');
  for (const r of resultados) {
    console.log(`  ${r.ok ? '✓' : '✗'} ${r.id.padEnd(5)} ${r.familia.padEnd(11)} ${r.detalhe}`);
  }
}

if (deriva.length > 0) {
  console.log(`\n  a base mudou desde ${doc.gerado ?? '(data não registrada)'}:`);
  for (const d of deriva) console.log(`    · ${d}`);
  console.log('    (não é erro — é o aviso de que os canários merecem releitura)');
}

if (erros.length > 0) {
  console.error(`\n${erros.length} CANÁRIO(S) EM FALHA:`);
  for (const e of erros) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ todo canário impossível continua impossível, e todo presente continua presente\n');
