#!/usr/bin/env node
/**
 * OS OITO LOTES → UM ARTEFATO SÓ: `research/kb/GLOSSARIO-TOPICOS.json`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ELE CONSOLIDA, E POR QUE A CONSOLIDAÇÃO É CÓDIGO E NÃO EDIÇÃO À MÃO
 *
 * Oito agentes leram as 74 gavetas e escreveram `research/kb/entrada/lote-N.json`:
 * para cada tópico, uma **glosa** de uma linha, 20–40 **termos de entrada na voz
 * do atleta** e uma lista **`naoConfundirCom`**. O material é bom e é a
 * matéria-prima desta onda; ele também tem os defeitos que oito autores
 * independentes sempre têm — dois nomes de tópico que não existem no vocabulário
 * fechado, termos repetidos dentro do mesmo tópico, e 114 termos reivindicados
 * por mais de um tópico.
 *
 * Consolidar à mão colaria os oito num nono arquivo e perderia a rastreabilidade:
 * ninguém saberia depois o que veio do lote e o que veio da cabeça do
 * consolidador. Aqui as correções são a tabela `CORRECOES` deste arquivo — cada
 * uma com o motivo escrito —, o resto é cópia literal, e `--check` reconstrói
 * tudo e compara byte a byte com o artefato commitado. Documento e código
 * divergirem em silêncio é o modo de falha nº 3 desta casa, e este `--check`
 * roda dentro do `npm run check:kb`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE **NÃO** ENTRA NO ARTEFATO: `exemplosDePergunta`
 *
 * Os lotes trazem 2–3 perguntas de exemplo por tópico, e elas ficam de fora de
 * propósito. Duas razões, e a segunda é a que decide:
 *
 *   1. Nenhuma das duas portas precisa delas — a Porta A mostra a GLOSA e o
 *      tamanho da gaveta, a Porta B casa os TERMOS DE ENTRADA.
 *   2. Um dos exemplos escritos pelo lote 1 é, palavra por palavra, a pergunta
 *      do canário P16 (`levantar peso já conta como exercício pro coração ou eu
 *      preciso de cardio separado?`). Carregar a pergunta do canário dentro do
 *      artefato que a camada consulta é exatamente a "trava que se testa a si
 *      mesma" — e do jeito mais barato de todos. Fora.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O DESEMPATE, e por que ele é a peça que faltava
 *
 * `peso` é o caso: o roteador de 10/08 lia `levantar peso` como peso CORPORAL,
 * abria `peso-corporal` com score 0,73 e `cardio` — 230 claims que respondem
 * exatamente a pergunta — nunca abria. O termo era ambíguo e a ambiguidade era
 * SILENCIOSA: nada no sistema sabia que existia.
 *
 * Aqui toda colisão sai declarada. Um termo reivindicado por dois ou mais
 * tópicos vira uma regra com `vence` (quem fica com o termo) e `porque`. E a
 * regra não é uma opinião solta: `coEtiquetadas` conta, contra a base de
 * verdade, quantas claims etiquetam os dois tópicos ao mesmo tempo — e o
 * `check-glossario.mjs` recusa um `vence` com dois tópicos que **nunca**
 * aparecem juntos numa claim. "Os dois" é uma afirmação sobre a base, não um
 * encolher de ombros.
 *
 * Uso:
 *   node research/tools/build-glossario.mjs            # reescreve o artefato
 *   node research/tools/build-glossario.mjs --check    # falha se divergir
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { normalizar } from './busca.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SAIDA = join(ROOT, 'research/kb/GLOSSARIO-TOPICOS.json');
const LOTES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `research/kb/entrada/lote-${n}.json`);
const CHECAR = process.argv.includes('--check');

/** A forma canônica de um termo de entrada: sem acento, minúscula, espaço único.
 *  É a mesma chave que o `glossario.mjs` usa para indexar e que o
 *  `check-glossario.mjs` usa para achar colisão — uma função só, importada, para
 *  as três não divergirem. */
export const chaveDoTermo = (t) => normalizar(t).trim().replace(/\s+/g, ' ');

/**
 * ── AS CORREÇÕES, UMA A UMA, COM O MOTIVO ────────────────────────────────────
 *
 * Toda diferença entre os oito lotes e o artefato está aqui. Nada é corrigido em
 * silêncio, e nada é corrigido fora desta tabela: o `--check` reconstrói o
 * artefato a partir dos lotes MAIS esta lista, então uma edição à mão no JSON
 * consolidado aparece como divergência.
 *
 * As duas primeiras são erro de nome: `dor-e-treino` e `recorde` não existem no
 * vocabulário fechado de 74 termos do `PROTOCOLO-EXTRACAO.md`. `DOR-E-TREINO.md`
 * é o nome de um documento, não de uma gaveta; e a própria `comoDistinguir` do
 * lote 7 diz "pode ser outro tópico de competição", que é `competicao`.
 *
 * As duas seguintes são termo repetido dentro do mesmo tópico depois de
 * normalizado (`sumô` e `sumo` são a mesma chave; `cãibra` e `caibra` também).
 * Repetido não muda roteamento nenhum — muda a contagem de termos, que é dado
 * que sai na Porta A.
 *
 * A quinta é a única que ACRESCENTA vocabulário, e por isso é a que mais precisa
 * de justificativa. `coração` é a palavra que o atleta usa para dizer `cardio`, e
 * ela está no lote 3 (`condicionamento`: *correr pra saúde do coração*) e no lote
 * 4 (`saude`: *saúde do coração*) — mas não no lote 1, que escreveu `cardio` com
 * `frequência cardíaca`, `batimento` e `fôlego` e esqueceu o órgão. Os três
 * tópicos etiquetam as MESMAS claims (V013-04 é `cardio, condicionamento,
 * saude`), então a ausência é inconsistência entre lotes e não julgamento de
 * conteúdo: dois dos três autores puseram a palavra. Está declarado aqui, em vez
 * de aparecer como se fosse dos lotes, porque quem for medir esta camada tem o
 * direito de descontar esta linha.
 */
export const CORRECOES = [
  {
    onde: 'lesao.naoConfundirCom[0].topico',
    de: 'dor-e-treino',
    para: 'dor',
    porque: '`dor-e-treino` não existe no vocabulário fechado — é o nome do documento research/kb/DOR-E-TREINO.md. A gaveta é `dor`.',
  },
  {
    onde: 'pico.naoConfundirCom[1].topico',
    de: 'recorde',
    para: 'competicao',
    porque: '`recorde` não existe no vocabulário fechado. A própria comoDistinguir do lote 7 diz "estratégia de tentativas/abridor no dia do meet", que é `competicao`.',
  },
  {
    onde: 'sumo.entrada',
    de: 'sumô',
    para: null,
    porque: 'chave repetida: `sumô` normaliza para `sumo`, que já é o primeiro termo do tópico.',
  },
  {
    onde: 'sumo.entrada',
    de: 'terra sumo',
    para: null,
    porque: 'chave repetida: `terra sumô` e `terra sumo` são a mesma chave depois de normalizar.',
  },
  {
    onde: 'dor.entrada',
    de: 'caibra',
    para: null,
    porque: 'chave repetida: `cãibra` e `caibra` são a mesma chave depois de normalizar.',
  },
  {
    onde: 'cardio.entrada',
    de: null,
    para: 'coração',
    porque: 'ACRÉSCIMO, e o único. `coração` é a palavra do atleta para `cardio`, está no lote 3 (`condicionamento`: correr pra saúde do coração) e no lote 4 (`saude`: saúde do coração), e falta no lote 1 — que escreveu frequência cardíaca, batimento e fôlego e pulou o órgão. Os três tópicos etiquetam as mesmas claims (V013-04: cardio, condicionamento, saude), então é inconsistência entre autores. Declarado aqui para poder ser descontado por quem medir.',
  },
];

/**
 * ── O DESEMPATE QUE NÃO É "OS DOIS" ──────────────────────────────────────────
 *
 * O padrão de uma colisão é `vence` = todos os que reivindicam, e ele só é
 * aceito quando cada par de vencedores de fato co-etiqueta alguma claim da base.
 * `pegada fechada` é a única colisão dos oito lotes em que isso não vale:
 * `bracos` e `setup` nunca aparecem juntos numa claim, e `bracos` reivindicar
 * *pegada fechada* é o tríceps puxando para si um termo que, nesta base, é de
 * supino. Fica com quem o par sobrevive à conferência.
 */
export const DESEMPATES_DECLARADOS = [
  {
    termo: 'pegada fechada',
    vence: ['pegada', 'supino'],
    porque: 'reivindicado por quatro (bracos, pegada, setup, supino) e é a única colisão dos lotes em que um par de reivindicantes NUNCA co-etiqueta claim nenhuma (bracos × setup = 0). Nesta base `close grip` é largura de pegada no supino: fica com `pegada` e `supino`. Quem procura tríceps digita tríceps.',
  },
];

// ── carga dos lotes ──────────────────────────────────────────────────────────

function lerLotes() {
  const topicos = [];
  for (const rel of LOTES) {
    const doc = JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
    for (const t of doc.topicos ?? []) topicos.push({ ...t, _lote: rel });
  }
  return topicos;
}

/** Aplica a tabela de correções. Devolve também quais linhas da tabela foram
 *  usadas — regra de correção que não corrige nada é regra podre, e o `--check`
 *  reclama dela. */
function aplicarCorrecoes(topicos) {
  const usadas = new Set();
  for (const t of topicos) {
    // nomes de tópico inválidos em naoConfundirCom
    (t.naoConfundirCom ?? []).forEach((n, i) => {
      for (const [k, c] of CORRECOES.entries()) {
        if (c.onde === `${t.topico}.naoConfundirCom[${i}].topico` && n.topico === c.de) {
          n.topico = c.para;
          usadas.add(k);
        }
      }
    });
    // termos removidos e acrescentados
    const fora = new Set(
      CORRECOES.filter((c) => c.onde === `${t.topico}.entrada` && c.para === null).map((c) => chaveDoTermo(c.de)),
    );
    const vistos = new Set();
    const entrada = [];
    for (const e of t.entrada ?? []) {
      const k = chaveDoTermo(e);
      if (vistos.has(k)) {
        if (fora.has(k)) {
          CORRECOES.forEach((c, i) => {
            if (c.onde === `${t.topico}.entrada` && c.para === null && chaveDoTermo(c.de) === k) usadas.add(i);
          });
        }
        continue;
      }
      vistos.add(k);
      entrada.push(e);
    }
    for (const [i, c] of CORRECOES.entries()) {
      if (c.onde === `${t.topico}.entrada` && c.de === null && c.para) {
        if (!vistos.has(chaveDoTermo(c.para))) {
          entrada.push(c.para);
          vistos.add(chaveDoTermo(c.para));
        }
        usadas.add(i);
      }
    }
    t.entrada = entrada;
  }
  return usadas;
}

// ── as colisões e o desempate ────────────────────────────────────────────────

function coEtiquetagem(claims) {
  const co = new Map();
  for (const c of claims) {
    const ts = [...new Set(c.topic ?? [])].sort();
    for (let i = 0; i < ts.length; i += 1) {
      for (let j = i + 1; j < ts.length; j += 1) {
        const k = `${ts[i]}×${ts[j]}`;
        co.set(k, (co.get(k) ?? 0) + 1);
      }
    }
  }
  return co;
}

function montarDesempate(topicos, co) {
  const dono = new Map();
  for (const t of topicos) {
    for (const e of t.entrada ?? []) {
      const k = chaveDoTermo(e);
      if (!dono.has(k)) dono.set(k, new Set());
      dono.get(k).add(t.topico);
    }
  }
  const regras = [];
  for (const [termo, quem] of [...dono.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (quem.size < 2) continue;
    const reivindicam = [...quem].sort();
    const declarado = DESEMPATES_DECLARADOS.find((d) => d.termo === termo);
    const vence = declarado ? [...declarado.vence].sort() : reivindicam;
    const pares = {};
    for (let i = 0; i < vence.length; i += 1) {
      for (let j = i + 1; j < vence.length; j += 1) {
        pares[`${vence[i]}×${vence[j]}`] = co.get([vence[i], vence[j]].sort().join('×')) ?? 0;
      }
    }
    const menor = Math.min(...Object.values(pares));
    regras.push({
      termo,
      topicos: reivindicam,
      vence,
      coEtiquetadas: pares,
      porque: declarado
        ? declarado.porque
        : `os ${vence.length} tópicos são donos legítimos do termo — na base eles co-etiquetam claim de verdade (o par mais fraco tem ${menor}), então a pergunta que usa esta palavra toca os ${vence.length}.`,
    });
  }
  return regras;
}

// ── montagem ─────────────────────────────────────────────────────────────────

const fechados = carregarTopicos(ROOT);
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const brutos = lerLotes();
const usadas = aplicarCorrecoes(brutos);

const problemas = [];
if (usadas.size !== CORRECOES.length) {
  const podres = CORRECOES.map((c, i) => (usadas.has(i) ? null : c.onde)).filter(Boolean);
  problemas.push(`correção que não corrigiu nada: ${podres.join(', ')} — o lote mudou embaixo da tabela`);
}
const vistos = new Set();
for (const t of brutos) {
  if (!fechados.has(t.topico)) problemas.push(`tópico "${t.topico}" (${t._lote}) fora do vocabulário fechado`);
  if (vistos.has(t.topico)) problemas.push(`tópico "${t.topico}" aparece em dois lotes`);
  vistos.add(t.topico);
}
for (const t of fechados) if (!vistos.has(t)) problemas.push(`tópico "${t}" do vocabulário fechado não tem lote — buraco de matéria-prima, não de consolidação`);
if (problemas.length > 0) {
  for (const p of problemas) console.error(`✗ ${p}`);
  process.exit(2);
}

const co = coEtiquetagem(claims);
const ordenados = [...brutos].sort((a, b) => a.topico.localeCompare(b.topico));
const doc = {
  _leia: [
    'O VOCABULÁRIO DE ENTRADA DAS 74 GAVETAS — a ponte entre a pergunta do atleta',
    'e o nome da gaveta. Gerado por research/tools/build-glossario.mjs a partir de',
    'research/kb/entrada/lote-1.json … lote-8.json. NÃO EDITE À MÃO: o --check do',
    'gerador roda dentro do npm run check:kb e reconstrói este arquivo dos lotes.',
    '',
    'PARA QUE SERVE, e são duas portas com o MESMO artefato:',
    '  · Porta A (--topicos) — as 74 gavetas com glosa e tamanho, enxutas o',
    '    bastante para caber num prompt. Quem consome esta base em produção é um',
    '    modelo de janela grande: ele não precisa de heurística, precisa VER as',
    '    gavetas e escolher. É a porta principal e a mais barata.',
    '  · Porta B (--pergunta) — o roteamento determinístico, que casa os termos de',
    '    `entrada` contra a pergunta. É a porta que o check:kb mede, porque não há',
    '    chave de API neste repositório e teste que precisa de modelo não roda no',
    '    compilador.',
    '',
    'O QUE É `entrada`, E O QUE ELA NÃO É. São as palavras que o ATLETA usa, não',
    'as que a base escreve. `fisgada` não existe em claim nenhuma das 6.912 — é',
    'exatamente por isso que ela está aqui. Não confunda com research/kb/',
    'VOCABULARIO.md, que faz o contrário: lá os termos TÊM de casar a prosa do',
    'corpus (check-vocabulario.mjs recusa termo morto), porque aquele arquivo',
    'expande a busca por TEXTO. Aqui termo morto no corpus é o caso normal, e',
    'cobrar vida seria cobrar o oposto do que este arquivo é.',
    '',
    'O DESEMPATE. Um termo reivindicado por dois tópicos sem regra declarada é o',
    'bug do `peso-corporal`: em 10/08/2026 `levantar peso já conta como exercício',
    'pro coração` roteava para `peso-corporal` com score 0,73 porque a palavra',
    '`peso` foi lida como peso CORPORAL, e `cardio` — 230 claims que respondem',
    'exatamente isso — nunca abria. Ambiguidade declarada é dado; ambiguidade',
    'silenciosa é aquele bug. Cada colisão vira uma regra com `vence` e `porque`, e',
    '`coEtiquetadas` conta contra a base quantas claims etiquetam cada par de',
    'vencedores ao mesmo tempo — check-glossario.mjs recusa um `vence` cujo par',
    'nunca apareça junto numa claim.',
    '',
    'O QUE FICOU DE FORA: `exemplosDePergunta` dos lotes. Nenhuma das duas portas',
    'precisa deles, e um dos exemplos do lote 1 é palavra por palavra a pergunta',
    'do canário P16. Artefato que carrega a pergunta do canário dentro é a trava',
    'que se testa a si mesma pelo caminho mais barato.',
  ],
  gerado: '2026-08-10',
  fonte: LOTES,
  baseNoMomento: {
    claims: claims.length,
    topicos: fechados.size,
    comoFoiContado: 'carregarClaims(research/extract) e carregarTopicos(PROTOCOLO-EXTRACAO.md), na geração deste arquivo.',
  },
  correcoes: CORRECOES,
  topicos: ordenados.map((t) => ({
    topico: t.topico,
    glosa: String(t.glosa ?? '').trim(),
    entrada: t.entrada,
    naoConfundirCom: (t.naoConfundirCom ?? []).map((n) => ({
      topico: n.topico,
      termoAmbiguo: n.termoAmbiguo,
      comoDistinguir: n.comoDistinguir,
    })),
  })),
  desempate: montarDesempate(ordenados, co),
};

const texto = `${JSON.stringify(doc, null, 2)}\n`;

if (CHECAR) {
  let atual = null;
  try {
    atual = readFileSync(SAIDA, 'utf8');
  } catch {
    console.error(`✗ ${SAIDA.replace(`${ROOT}/`, '')} não existe — rode node research/tools/build-glossario.mjs`);
    process.exit(1);
  }
  if (atual !== texto) {
    console.error(
      `✗ ${SAIDA.replace(`${ROOT}/`, '')} divergiu dos lotes de research/kb/entrada/.\n`
        + '  Ou alguém editou o consolidado à mão, ou um lote mudou e o consolidado não foi refeito.\n'
        + '  Rode: node research/tools/build-glossario.mjs',
    );
    process.exit(1);
  }
  console.log(
    `✓ GLOSSARIO-TOPICOS.json bate com os 8 lotes (${doc.topicos.length} tópicos, `
      + `${doc.desempate.length} desempate(s), ${CORRECOES.length} correção(ões) declarada(s))`,
  );
  process.exit(0);
}

writeFileSync(SAIDA, texto);
console.log(
  `✓ ${SAIDA.replace(`${ROOT}/`, '')}: ${doc.topicos.length} tópicos, `
    + `${doc.topicos.reduce((a, t) => a + t.entrada.length, 0)} termos de entrada, `
    + `${doc.desempate.length} colisão(ões) com desempate, ${CORRECOES.length} correção(ões).`,
);
