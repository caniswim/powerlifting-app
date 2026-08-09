#!/usr/bin/env node
/**
 * Quem verifica o roteamento — e o faz sobre a BASE REAL.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A REGRA QUE ESTE ARQUIVO EXISTE PARA CUMPRIR
 *
 * *"Teste sobre corpus sintético não prova recuperação. O que prova é a base
 * real. Se você escrever teste, que ele quebre quando a fiação quebra."*
 *
 * O precedente é do dia anterior: `busca.test.mjs` tem 35 casos sobre 12 claims
 * sintéticas, e a mutação `const relaxada = false` — que apaga a vizinhança
 * inteira — deixava os 35 verdes. As funções estavam certas; a fiação, não.
 *
 * Então aqui a divisão é explícita:
 *   · a PRIMEIRA metade testa as peças e usa um corpus de bolso, porque um
 *     teste de peça precisa de um corpus cujo conteúdo ele conheça exatamente;
 *   · a SEGUNDA metade chama `responder()` — a mesma função da CLI e do
 *     `check-rotas.mjs` — sobre `research/extract/*.jsonl`, e afirma coisas que
 *     só são verdadeiras se o caminho inteiro estiver ligado.
 *
 * E a regra de higiene: **nenhum número esperado aqui é importado de
 * `roteador.mjs`.** Os tetos, os postos e os limiares são literais escritos à
 * mão. Uma trava que lê a constante que verifica é o modo de falha nº 4 desta
 * casa, e ele aconteceu três vezes num dia só.
 *
 * Uso: node research/tools/roteador.test.mjs
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims, carregarTopicos } from './kb.mjs';
import { indexar, carregarVocabulario } from './busca.mjs';
import {
  termosDaPergunta, perfilarTopicos, familiaDoTermo, pesoDoTermo, pesoDaPalavra,
  rotasValidas, responder, conjuntoDoTopico, nomeiaOParam, assinaturaDoTopico,
} from './roteador.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

let falhas = 0;
let total = 0;
const ok = (nome, cond, detalhe = '') => {
  total += 1;
  if (!cond) {
    falhas += 1;
    console.error(`✗ ${nome}${detalhe ? `\n    ${detalhe}` : ''}`);
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// PARTE 1 — as peças, sobre um corpus de bolso
// ═════════════════════════════════════════════════════════════════════════════

const BOLSO = [
  {
    id: 'V900-01', src: 'R900', at: '01:00', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['descanso-entre-series'],
    claim: 'Descansar oito minutos entre as séries pesadas é melhor que cinco.',
    verbatim: 'resting eight minutes between sets beats five',
    params: [{ name: 'descanso_longo', value: 8, unit: 'min', frame: 'min' }],
  },
  {
    id: 'V900-02', src: 'R900', at: '02:00', tier: 'R', scope: 'GERAL', modo: 'opiniao',
    topic: ['descanso-entre-series'],
    claim: 'O descanso curto entre as séries prejudica a série seguinte.',
    verbatim: 'short rest between sets hurts the next set',
    params: [],
  },
  {
    id: 'V901-01', src: 'R901', at: '01:00', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['agacho'],
    claim: 'No agachamento pesado o joelho segue a linha do pé.',
    verbatim: 'in the heavy squat the knee tracks over the foot',
    params: [],
  },
  {
    id: 'V901-02', src: 'R901', at: '02:00', tier: 'R', scope: 'GERAL', modo: 'mecanismo',
    topic: ['agacho'],
    claim: 'O agachamento com barra baixa muda o braço de momento do quadril.',
    verbatim: 'low bar squat changes the hip moment arm',
    params: [],
  },
  {
    id: 'V902-01', src: 'R902', at: '01:00', tier: 'R', scope: 'PESSOAL', modo: 'fato',
    topic: ['rpe'],
    claim: 'Para ele, subir um ponto de RPE vale dois por cento de peso.',
    verbatim: 'one RPE is about two percent of weight',
    params: [{ name: 'peso_por_rpe', value: 2, unit: '%', frame: 'pct' }],
  },
];
const perfilBolso = perfilarTopicos(BOLSO);
const topicosBolso = new Set(['descanso-entre-series', 'agacho', 'rpe', 'supino']);

ok(
  'termosDaPergunta tira interrogativa e palavra vazia',
  (() => {
    const t = termosDaPergunta('quanto tempo devo descansar entre as séries?');
    return !t.has('quanto') && !t.has('devo') && t.has('descansar') && t.has('serie');
  })(),
);

ok(
  'termosDaPergunta NÃO deixa número virar sinal de assunto',
  !termosDaPergunta('quantas 5 séries em 6 semanas').has('5'),
);

// A família de prefixo, nos dois sentidos. Estes pares são a especificação —
// não derivados de nada; se a regra mudar, é aqui que se vê.
for (const [a, b] of [['agachando', 'agachamento'], ['descansar', 'descanso'], ['supinar', 'supino'],
  ['peitoral', 'peito'], ['aquecer', 'aquecimento'], ['agacho', 'agachamento']]) {
  const perfil = perfilarTopicos([{ id: 'X-1', topic: [], claim: b, verbatim: '', params: [] }]);
  ok(`familiaDoTermo junta "${a}" com "${b}"`, familiaDoTermo(perfil, a).includes(b), `família: ${familiaDoTermo(perfil, a).join(', ')}`);
}
for (const [a, b] of [['powerlifting', 'powerbuilding'], ['pesado', 'pesagem'], ['cinto', 'cintura'],
  ['banco', 'bancada'], ['powerlifting', 'power'], ['cardio', 'cardiovascular']]) {
  const perfil = perfilarTopicos([{ id: 'X-1', topic: [], claim: b, verbatim: '', params: [] }]);
  ok(`familiaDoTermo NÃO junta "${a}" com "${b}"`, !familiaDoTermo(perfil, a).includes(b), `família: ${familiaDoTermo(perfil, a).join(', ')}`);
}

ok(
  'pesoDoTermo zera termo que aparece em menos de duas claims do tópico',
  pesoDoTermo(perfilBolso, 'agacho', 'joelho') === 0,
);
// `pesoDoTermo` e `pesoDaPalavra` NÃO são testados no corpus de bolso: com 5
// claims, a suavização de Laplace (que existe para impedir que um tópico de 3
// claims ganhe de um de 900) domina qualquer sinal e todo peso dá zero. Testá-los
// aqui exigiria desligar a suavização no teste — que é medir outra função. Eles
// estão na Parte 2, sobre a base real.

ok(
  'rotasValidas recusa tópico fora da lista fechada',
  rotasValidas(['agacho', 'agachamento'], topicosBolso).join(',') === 'agachamento',
);

ok(
  'nomeiaOParam exige DUAS peças do nome do param',
  (() => {
    const um = nomeiaOParam(perfilBolso, termosDaPergunta('quanto peso levantar'), BOLSO[4]);
    const dois = nomeiaOParam(perfilBolso, termosDaPergunta('quanto peso por RPE'), BOLSO[4]);
    return um.length < 2 && dois.length >= 2;
  })(),
);

ok(
  'conjuntoDoTopico separa o declarado do afim',
  (() => {
    const c = conjuntoDoTopico(BOLSO, perfilBolso, 'descanso-entre-series');
    return c.declarado.has('V900-01') && !c.declarado.has('V901-01');
  })(),
);

// ═════════════════════════════════════════════════════════════════════════════
// PARTE 2 — a FIAÇÃO, sobre a base real
//
// Tudo daqui para baixo passa por `responder()`, que é a função que a CLI
// imprime e o `check-rotas.mjs` cobra. Quebrar o caminho quebra estes casos.
// ═════════════════════════════════════════════════════════════════════════════

const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const INDICE = indexar(claims);
const PERFIS = perfilarTopicos(claims);

ok(
  'a base real está carregada (>6000 claims, 74 tópicos)',
  claims.length > 6000 && TOPICOS.size === 74,
  `claims=${claims.length} topicos=${TOPICOS.size}`,
);

ok(
  'pesoDoTermo premia o termo distintivo do tópico sobre a palavra comum',
  pesoDoTermo(PERFIS, 'agacho', 'agachamento') > pesoDoTermo(PERFIS, 'agacho', 'treino'),
  `agachamento=${pesoDoTermo(PERFIS, 'agacho', 'agachamento').toFixed(3)} treino=${pesoDoTermo(PERFIS, 'agacho', 'treino').toFixed(3)}`,
);
ok(
  'pesoDoTermo zera a palavra que não distingue nada (lift <= 1)',
  pesoDoTermo(PERFIS, 'agacho', 'treino') === 0 || pesoDoTermo(PERFIS, 'sono', 'agachamento') === 0,
);
ok(
  'pesoDaPalavra atravessa a conjugação e DIZ qual palavra da base respondeu',
  pesoDaPalavra(PERFIS, 'descanso-entre-series', 'descansar').termo === 'descanso',
  `respondeu: ${pesoDaPalavra(PERFIS, 'descanso-entre-series', 'descansar').termo}`,
);

const perguntar = (pergunta, extra = {}) => responder(claims, pergunta, {
  topicos: TOPICOS, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS, ...extra,
});

// ── a fiação do ROTEAMENTO ───────────────────────────────────────────────────
{
  const r = perguntar('quanto descansar entre as séries?');
  ok('fiação: a pergunta de descanso abre a gaveta `descanso-entre-series`',
    r.rotas.some((x) => x.topico === 'descanso-entre-series'),
    `rotas: ${r.rotas.map((x) => x.topico).join(', ') || '(nenhuma)'}`);
  ok('fiação: o roteamento explica POR QUE — termo, quantas claims dentro, quantas na base',
    r.rotas[0].porQue.length > 0 && r.rotas[0].porQue.every((p) => typeof p.peso === 'number'),
    'porQue vazio ou sem peso — roteamento sem justificativa é expansão opaca com outro nome');
}

// ── a fiação da AFINIDADE — a peça que conserta a etiqueta ───────────────────
{
  const r = perguntar('quanto descansar entre as séries?');
  const naTela = r.idsMostrados;
  const posAfim = r.claims.findIndex((x) => x.c.id === 'V038-07') + 1;
  ok('fiação: alcança V038-07, que fala de descanso e NÃO está etiquetada em descanso-entre-series',
    naTela.has('V038-07') && posAfim > 0 && posAfim <= 25,
    `posição ${posAfim || 'ausente'} — sem a afinidade, rotear para a gaveta certa devolve 1 das 3 claims que respondem. `
      + 'O 25 é literal e escrito à mão de propósito: se ele viesse do ROTAS.json, afrouxar o tetoDeTela de lá '
      + 'desligaria os dois lados da medição de uma vez.');
  const declarado = (claims.find((c) => c.id === 'V038-07')?.topic ?? []);
  ok('a premissa do caso acima continua verdadeira (V038-07 NÃO é do tópico)',
    !declarado.includes('descanso-entre-series'),
    `V038-07 hoje é ${declarado.join(', ')} — se ela foi reetiquetada, este caso parou de medir afinidade`);
}

// ── a fiação da ORDENAÇÃO DENTRO do tópico ───────────────────────────────────
{
  const r = perguntar('posso supinar seis vezes por semana?');
  const pos = r.claims.findIndex((x) => x.c.id === 'V170-34') + 1;
  ok('fiação: V170-34 (freq_supino=6, GERAL+prescricao) sai entre as 10 primeiras',
    pos > 0 && pos <= 10,
    `posição ${pos || 'ausente'} — este é o caso Q05, e a resposta medida concluiu que a base só tinha log pessoal`);
}

// ── a fiação do canal de PARAM ───────────────────────────────────────────────
{
  const r = perguntar('quanto baixar o peso quando o RPE vem acima do alvo?');
  ok('fiação: o canal do nome do param alcança V033-03 (peso_por_rpe_min)',
    r.params.lista.some((x) => x.c.id === 'V033-03'),
    'a ONDA-2B §10 mediu esta formulação devolvendo ZERO; quem acha aqui é o nome do dado, não a prosa');
  ok('fiação: e o que ele achou entra em idsMostrados (o contrato do canário)',
    r.idsMostrados.has('V033-03'));
}

// ── a fiação da RECUSA ───────────────────────────────────────────────────────
{
  const fora = perguntar('qual a capital da França?');
  ok('fiação: pergunta fora de domínio NÃO devolve claim nenhuma',
    fora.rotas.length === 0 && fora.claims.length === 0,
    `rotas: ${fora.rotas.map((x) => x.topico).join(', ')}`);
  ok('fiação: e o motivo é `fora-de-dominio` (as palavras não existem na base)',
    fora.motivo === 'fora-de-dominio', `motivo: ${fora.motivo}`);

  const perto = perguntar('quem ganhou o Oscar de melhor filme?');
  ok('fiação: pergunta com palavra da base mas sem assunto é `sem-assunto`, não `fora-de-dominio`',
    perto.rotas.length === 0 && perto.motivo === 'sem-assunto',
    `rotas: ${perto.rotas.map((x) => x.topico).join(', ')} motivo: ${perto.motivo}`);
}

// ── a fiação da PRECISÃO ─────────────────────────────────────────────────────
{
  const sono = perguntar('quantas horas de sono por semana?');
  ok('fiação: a pergunta de sono NÃO injeta V170-34 (supinar seis dias por semana)',
    !sono.idsMostrados.has('V170-34'),
    'foi exatamente isto que a expansão de vocabulário fazia em 09/08, e nada media');
  ok('fiação: e ela devolve claims de sono de verdade',
    sono.claims.some((x) => (x.c.topic ?? []).includes('sono')));
}

// ── a fiação do TÓPICO GRANDE ────────────────────────────────────────────────
{
  const r = perguntar('como melhorar meu agacho?');
  ok('fiação: `agacho` é roteado mesmo o corpus quase não escrevendo essa palavra',
    r.rotas.some((x) => x.topico === 'agacho'),
    `rotas: ${r.rotas.map((x) => x.topico).join(', ')}`);
  ok('fiação: e a saída declara o tamanho da gaveta (mais de 900 claims)',
    (r.rotas.find((x) => x.topico === 'agacho')?.claims ?? 0) > 900);
  ok('fiação: e oferece cruzamento com outros tópicos para estreitar',
    r.estreitar.length > 0 && r.estreitar.every((e) => TOPICOS.has(e.topico)),
    'sem estreitamento, ver 40 de 990 é a leitura errada mais cara que esta ferramenta induz');
}

// ── a fiação do TÓPICO FORÇADO ───────────────────────────────────────────────
{
  const r = perguntar('que dimensões de cinto o regulamento permite?', { forcar: ['cinto'], teto: 60 });
  ok('fiação: --topic força a gaveta e ela sai sem afins (a gaveta é o conjunto etiquetado)',
    r.rotas.length === 1 && r.rotas[0].topico === 'cinto'
      && r.claims.every((x) => (x.c.topic ?? []).includes('cinto')),
    'com afins junto, F001-83/84 caíam para 64º e 67º');
  ok('fiação: e as duas dimensões do regulamento IPF saem',
    r.idsMostrados.has('F001-83') && r.idsMostrados.has('F001-84'));
}

// ── o ORÇAMENTO DE TELA, cobrado sem importar a constante ────────────────────
//
// O outro lado da regra de higiene. `check-rotas.mjs` recebe o teto do
// ROTAS.json e por isso NÃO percebe se a ferramenta passar a despejar 400 claims
// por pergunta. Este caso percebe, e o 40 aqui é literal: em 09/08 o canário
// importava `TETO_VIZINHANCA` da ferramenta que media, e a mutação 40 → 400
// deixava o `check:kb` inteiro verde.
{
  const r = perguntar('como melhorar meu agacho?');
  ok('a saída PADRÃO cabe numa leitura: no máximo 40 claims sem teto explícito',
    r.claims.length <= 40,
    `saíram ${r.claims.length} — despejar isso no contexto de um agente destrói a consulta seguinte`);
  ok('e o padrão não é tão apertado que deixe de ser uma amostra (>= 20)',
    r.claims.length >= 20, `saíram ${r.claims.length}`);
}

// ── o invariante que só o alvo FECHADO torna possível ────────────────────────
{
  const perguntas = [
    'quanto descansar entre as séries?', 'como melhorar meu agacho?',
    'quantas horas de sono por semana?', 'qual a capital da França?',
    'quanto de proteína por dia?', 'vale a pena fazer deload?',
  ];
  const invalidos = perguntas.flatMap((p) => rotasValidas(perguntar(p).rotas, TOPICOS));
  ok('INVARIANTE: nenhuma pergunta produz tópico fora dos 74 do vocabulário fechado',
    invalidos.length === 0,
    `inventados: ${invalidos.join(', ')} — é o que separa roteamento de busca por texto`);
}

// ── a assinatura derivada, que é como se audita o perfil ─────────────────────
{
  const a = assinaturaDoTopico(PERFIS, 'periodizacao', 20).map((x) => x.termo);
  ok('a assinatura de `periodizacao` traz as DUAS línguas (é o que dispensa dicionário)',
    a.includes('ciclo') && a.includes('cycle'),
    `assinatura: ${a.slice(0, 12).join(' ')} — o RECUPERACAO.md §8.1 declarava este par inalcançável`);
}

// ═════════════════════════════════════════════════════════════════════════════

if (falhas > 0) {
  console.error(`\n✗ ${falhas} de ${total} casos falharam em roteador.test.mjs`);
  process.exit(1);
}
console.log(`✓ roteador.test.mjs: ${total} casos (peças em corpus de bolso + fiação sobre ${claims.length} claims reais)`);
process.exit(0);
