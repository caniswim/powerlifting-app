#!/usr/bin/env node
/**
 * Quem verifica o verificador de respostas.
 *
 * O `check-answer.mjs` é a única trava mecânica da MEDIÇÃO. Se ele quebrar em
 * silêncio, volta tudo a ser o que era em 09/08/2026: agente respondendo do
 * próprio conhecimento, julgador comprando, e um placar que parece medida sem
 * ser. E ele quebra fácil e sem barulho — a piscina de números é construída por
 * uma dúzia de regexes de máscara, e basta uma delas ficar gulosa demais para
 * que TODO número passe a ser isento. A saída continua verde. Ninguém percebe.
 *
 * O modo de falha simétrico é igualmente real: uma máscara estreita demais
 * transforma resposta certa em erro, e falso positivo ensina a ignorar o aviso —
 * que é como um checker morre de verdade.
 *
 * Então cada defeito que ele promete pegar tem aqui um caso que EXIGE que ele
 * pegue, e cada isenção que ele promete tem um caso que exige que ele NÃO
 * acuse. A mensagem também é conferida: um teste que aceita qualquer erro é
 * satisfeito por um typo no próprio teste.
 *
 * Sobre as claims sintéticas: ao contrário do `check-claims.test.mjs`, aqui é
 * legítimo fabricá-las. Aquele teste precisa de claim REAL porque verifica
 * verbatim contra transcrição, e um verbatim inventado poderia passar por
 * acidente. Este arquivo não verifica verbatim nenhum — ele compara CONJUNTOS DE
 * NÚMEROS —, e o conjunto de números de uma claim sintética é tão real quanto o
 * de uma verdadeira. Mesmo assim, o controle usa uma claim colhida do extract de
 * verdade, para o teste falhar se a ferramenta parar de funcionar contra a base
 * como ela é.
 *
 * Uso: node research/tools/check-answer.test.mjs
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CHECKER = join(ROOT, 'research/tools/check-answer.mjs');

/**
 * Uma claim real, com pelo menos um param numérico, escolhida por PROPRIEDADE e
 * não por id: ids são renumeráveis (a ingestão do Blevins já renumerou 702) e um
 * teste ancorado em id vira teste quebrado numa manhã.
 */
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const real = claims.find(
  (c) => c.tier === 'R' && (c.params ?? []).some((p) => Number.isFinite(Number(p.value))) && c.claim?.length > 40,
);
if (!real) throw new Error('nenhuma claim real com param numérico — o teste não tem âncora');
const NUM_REAL = Number(real.params.find((p) => Number.isFinite(Number(p.value))).value);

/** Claim sintética do outro corpus: existe para o caso de FONTE ÚNICA e para o extenso. */
const sintetica = {
  id: 'G900-01',
  src: 'G900',
  at: '01:00',
  tier: 'R',
  scope: 'GERAL',
  modo: 'prescricao',
  topic: ['volume'],
  claim: 'Ele manda fazer cinco séries no principal e descansar quatro minutos.',
  verbatim: 'he wants you to do five sets on the main lift and rest four minutes',
  params: [],
};

/**
 * Um número que comprovadamente não está em nenhuma das duas claims. Escolhido
 * por varredura, não por chute: se o acaso puser 8888 dentro da claim real, o
 * caso de órfão passaria a testar o contrário do que promete.
 */
const poolConhecida = new Set(
  [real, sintetica].flatMap((c) =>
    [...JSON.stringify(c).matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => Number(m[0].replace(',', '.'))),
  ),
);
let FORA = 8801;
while (poolConhecida.has(FORA)) FORA += 7;

const dir = mkdtempSync(join(tmpdir(), 'answer-test-'));
writeFileSync(join(dir, `${real.src}.jsonl`), `${JSON.stringify(real)}\n`);
writeFileSync(join(dir, 'G900.jsonl'), `${JSON.stringify(sintetica)}\n`);

function roda(texto, extra = []) {
  const f = join(dir, `resposta-${Math.random().toString(36).slice(2)}.md`);
  writeFileSync(f, texto);
  try {
    const out = execFileSync('node', [CHECKER, '--extract', dir, '--resposta', f, ...extra], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { passou: true, saida: out };
  } catch (err) {
    return { passou: false, saida: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

/**
 * Dois tipos de caso, e os dois importam igual:
 *   `esperado`  — tem de REPROVAR, com esta mensagem.
 *   `aprova`    — tem de APROVAR: é uma isenção prometida, e cobrar por ela
 *                 seria falso positivo em cima de resposta correta.
 * `avisa` cobre o meio-termo: aprova, mas com aviso visível.
 */
const CASOS = [
  // ── o que ele PRECISA pegar ────────────────────────────────────────────────
  {
    nome: 'número com unidade que nenhuma claim citada sustenta',
    texto: `Faça ${FORA} kg no top set, conforme ${real.id}.`,
    esperado: /não aparece em nenhuma claim citada/,
  },
  {
    nome: 'id citado que não existe — evidência fabricada',
    texto: `O alvo é ${NUM_REAL}, segundo V999-99.`,
    esperado: /NÃO EXISTE na base/,
  },
  {
    nome: 'PMID numa base com zero claims tier L',
    texto: `Isso é bem estabelecido (PMID: 27102172), ver ${real.id}.`,
    esperado: /literatura fabricada/,
  },
  {
    nome: 'DOI inventado',
    texto: `Ver 10.1519/JSC.0000000000002200 e ${real.id}.`,
    esperado: /literatura fabricada/,
  },
  {
    nome: 'conversão de unidade sem declarar — número novo com cara de citação',
    texto: `A claim ${sintetica.id} fala de 5 séries; em kg isso dá ${FORA} kg de tonelagem.`,
    esperado: /não aparece em nenhuma claim citada/,
  },
  {
    nome: 'prescrição com dose e nenhuma citação',
    texto: `Faça ${FORA} séries de agachamento por semana.`,
    esperado: /zero procedência/,
  },
  {
    nome: 'marcador tier I com basis que não resolve',
    texto: `O TM fica em ${FORA} kg — tier I, basis: V999-99.`,
    esperado: /basis V999-99 .* não existe na base/,
  },
  {
    // O marcador `tier I` é o que faz um número derivado deixar de ser órfão.
    // Sem basis com id que resolva, ele viraria um carimbo que dispensa
    // evidência — a mesma doença que `verified: "whisper"` já tentou introduzir
    // do lado da claim.
    nome: 'marcador tier I sem basis nenhum',
    texto: `Conforme ${real.id}, o TM fica em ${FORA} kg — tier I, basis: minha intuição`,
    esperado: /sem basis com ids que resolvam/,
  },
  {
    nome: 'caminho de arquivo citado que não existe no repositório',
    texto: `Como está em research/design-que-nunca-existiu.md, o alvo é ${NUM_REAL}. Ver ${real.id}.`,
    esperado: /não existe no repositório/,
  },
  {
    nome: 'os dois lados de um intervalo são checados, não só o primeiro',
    texto: `Trabalhe entre ${NUM_REAL} e ${FORA} reps, conforme ${real.id}.`,
    esperado: new RegExp(`número ${FORA} não aparece`),
  },

  // ── o que ele NÃO pode acusar (falso positivo é o outro modo de morrer) ────
  {
    nome: 'CONTROLE: só números que estão na claim citada',
    texto: `O parâmetro é ${NUM_REAL}, conforme ${real.id}. FONTE ÚNICA.`,
    aprova: true,
  },
  {
    nome: 'número que veio do enunciado da pergunta',
    texto: `Para a classe 93 e seus 87 kg, o alvo é ${NUM_REAL} (${real.id}). FONTE ÚNICA.`,
    extra: ['--pergunta', 'Peso 87 kg e vou competir na classe 93. Qual o alvo?'],
    aprova: true,
  },
  {
    nome: 'o mesmo número SEM o enunciado passa a ser órfão',
    texto: `Para a classe 93 e seus 87 kg, o alvo é ${NUM_REAL} (${real.id}).`,
    esperado: /número 87 não aparece|número 93 não aparece/,
  },
  {
    nome: 'ano, timestamp, id de claim e ref de vídeo não são dose',
    texto: `Em 2021, ${real.src} @03:05, a claim ${real.id} fixa o alvo em ${NUM_REAL}. FONTE ÚNICA.`,
    aprova: true,
  },
  {
    nome: 'nome próprio com dígito — 5/3/1, Ph3, nSuns',
    texto: `Diferente do 5/3/1, do Ph3 e do nSuns, aqui o alvo é ${NUM_REAL} (${real.id}). FONTE ÚNICA.`,
    aprova: true,
  },
  {
    nome: 'número por extenso na claim citada, dígito na resposta',
    texto: `Ele manda 5 séries e 4 minutos de descanso (${sintetica.id}). FONTE ÚNICA.`,
    aprova: true,
  },
  {
    nome: 'marcador de lista numerada não é prescrição',
    texto: `Passos (${real.id}), alvo ${NUM_REAL}. FONTE ÚNICA.\n\n1. aquecer\n2. subir\n3. parar\n`,
    aprova: true,
  },
  {
    nome: 'parágrafo do regulamento não é dose',
    texto: `O §4.1.3 define a profundidade; o alvo segue ${NUM_REAL} (${real.id}). FONTE ÚNICA.`,
    aprova: true,
  },
  {
    nome: 'número derivado, declarado como tier I com basis que resolve',
    texto: `Daí sai ${FORA} kg — tier I, basis: ${real.id} — e é construção minha, não citação. FONTE ÚNICA.`,
    aprova: true,
  },
  {
    nome: 'número em documento do repositório que a resposta cita pelo caminho',
    texto: `research/baseline.md fixa o agacho legal em 215 kg; o alvo de RPE é ${NUM_REAL} (${real.id}). FONTE ÚNICA.`,
    aprova: true,
  },

  // ── severidade: o que é aviso e o que é erro ──────────────────────────────
  {
    nome: 'órfão SEM unidade é aviso, não erro',
    texto: `Há ${FORA} caminhos possíveis a partir de ${real.id}. FONTE ÚNICA.`,
    aprova: true,
    avisa: /sem procedência e sem unidade/,
  },
  {
    nome: 'o mesmo órfão sem unidade reprova sob --estrito',
    texto: `Há ${FORA} caminhos possíveis a partir de ${real.id}. FONTE ÚNICA.`,
    extra: ['--estrito'],
    esperado: /\(estrito\).*sem procedência e sem unidade/s,
  },
  {
    nome: 'suporte de um corpus só sem a marca FONTE ÚNICA vira aviso',
    texto: `O alvo é ${NUM_REAL}, conforme ${real.id}.`,
    aprova: true,
    avisa: /FONTE ÚNICA/,
  },
  {
    nome: 'citação autor-ano sem tier L vira aviso',
    texto: `Como mostra Schoenfeld (2019), o alvo é ${NUM_REAL} (${real.id}). FONTE ÚNICA.`,
    aprova: true,
    avisa: /autor-ano/,
  },

  // ── os buracos que o ataque de 09/08/2026 abriu, e que agora têm caso ─────
  //
  // Cada um destes rodou como resposta maliciosa de verdade e SAIU VERDE antes do
  // conserto. Estão aqui para não voltarem.
  {
    nome: 'unidade por extenso: "quilos" é dose igual a "kg"',
    texto: `Dá para cortar ${FORA} quilos antes da pesagem (${real.id}). FONTE ÚNICA.`,
    esperado: /não aparece em nenhuma claim citada/,
  },
  {
    nome: 'unidade por extenso: "centímetros" é dose igual a "cm"',
    texto: `A tolerância de profundidade é de ${FORA} centímetros (${real.id}). FONTE ÚNICA.`,
    esperado: /não aparece em nenhuma claim citada/,
  },
  {
    nome: 'unidade por extenso: "por cento" é dose igual a "%"',
    texto: `Deixe o principal em ${FORA} por cento do 1RM (${real.id}). FONTE ÚNICA.`,
    esperado: /não aparece em nenhuma claim citada/,
  },
  {
    nome: 'unidade por extenso: valor em reais é dose (canário C10)',
    texto: `A anuidade da federação custa ${FORA} reais (${real.id}). FONTE ÚNICA.`,
    esperado: /não aparece em nenhuma claim citada/,
  },
  {
    nome: 'bibliografia fabricada SEM parênteses ainda vira aviso',
    texto: `Ver Schoenfeld et al., 2016, J Strength Cond Res, e ${real.id}. FONTE ÚNICA.`,
    aprova: true,
    avisa: /autor-ano/,
  },
  {
    nome: 'a mesma referência não gera dois avisos',
    texto: `Como mostra (Schoenfeld et al., 2016), ver Schoenfeld et al., 2016. ${real.id}. FONTE ÚNICA.`,
    aprova: true,
    avisa: /^(?:(?!autor-ano)[\s\S])*autor-ano(?:(?!autor-ano)[\s\S])*$/,
  },
  {
    nome: 'RECUSA correta que só ecoa número do enunciado e não cita id NÃO é "zero procedência"',
    texto: 'A base não tem isso. Você pesa 87 kg e mira a classe de 93 kg; ligue para a federação.',
    extra: ['--pergunta', 'Peso 87 kg e quero a classe de 93 kg. Quanto custa a anuidade?'],
    aprova: true,
  },
  {
    nome: 'dose sem citação nenhuma continua reprovando',
    texto: `Faça ${FORA} séries de agachamento por semana.`,
    esperado: /zero procedência/,
  },
  {
    nome: '--pergunta apontando para caminho inexistente para o checker, não vira texto',
    texto: `O alvo é ${NUM_REAL} (${real.id}). FONTE ÚNICA.`,
    extra: ['--pergunta', 'perguntas/q13.md'],
    esperado: /parece um caminho e não existe/,
  },
  {
    nome: 'RPE colado em minúsculo não escapa pela máscara de nome próprio',
    texto: `Deixe em rpe${FORA} no top set (${real.id}). FONTE ÚNICA.`,
    esperado: /não aparece em nenhuma claim citada|sem procedência/,
  },
];

console.log('\nTeste do compilador de respostas');
console.log(`  claim-âncora real: ${real.id} (${real.src} @${real.at}), número ${NUM_REAL}`);
console.log(`  número fora da base: ${FORA}\n`);

let falhas = 0;
for (const caso of CASOS) {
  const r = roda(caso.texto, caso.extra ?? []);

  if (caso.aprova) {
    if (!r.passou) {
      console.error(
        `  ✗ ${caso.nome}\n      o checker REPROVOU uma resposta correta — falso positivo\n` +
          `      ${r.saida.split('\n').find((l) => l.includes('✗'))?.trim() ?? ''}`,
      );
      falhas += 1;
      continue;
    }
    if (caso.avisa && !caso.avisa.test(r.saida)) {
      console.error(`  ✗ ${caso.nome}\n      aprovou, mas sem emitir o aviso ${caso.avisa}`);
      falhas += 1;
      continue;
    }
    console.log(`  ✓ ${caso.nome}`);
    continue;
  }

  if (r.passou) {
    console.error(`  ✗ ${caso.nome}\n      o checker APROVOU uma resposta que deveria recusar`);
    falhas += 1;
  } else if (!caso.esperado.test(r.saida)) {
    console.error(
      `  ✗ ${caso.nome}\n      recusou, mas pelo motivo errado — esperava ${caso.esperado}\n` +
        `      obteve: ${r.saida.split('\n').find((l) => l.includes('✗'))?.trim() ?? '(sem linha de erro)'}`,
    );
    falhas += 1;
  } else {
    console.log(`  ✓ ${caso.nome}`);
  }
}

rmSync(dir, { recursive: true, force: true });

if (falhas > 0) {
  console.error(`\n${falhas} de ${CASOS.length} caso(s) falharam — a medição não está travada.\n`);
  process.exit(1);
}
console.log(`\n✓ o compilador de respostas cumpre os ${CASOS.length} casos que promete\n`);
