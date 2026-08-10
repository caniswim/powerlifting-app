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
  carregarGlossario, indexarGlossario, casarGlossario, idfDoGlossario,
  gavetasDaPalavra, catalogoDeTopicos, familiaNoGlossario,
} from './glossario.mjs';
import {
  termosDaPergunta, perfilarTopicos, familiaDoTermo, pesoDoTermo, pesoDaPalavra,
  rotasValidas, responder, conjuntoDoTopico, nomeiaOParam, porNomeDeParam, assinaturaDoTopico,
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
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
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
  topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS, ...extra,
});

// ═════════════════════════════════════════════════════════════════════════════
// O GLOSSÁRIO DE ENTRADA — as peças, sobre o artefato de verdade
//
// Nenhum número esperado aqui vem de `glossario.mjs`: o que se afirma são
// RELAÇÕES ("esta palavra discrimina mais que aquela") e FATOS sobre a base
// ("`fisgada` não existe em claim nenhuma"), que é a coisa que se quer
// verdadeira. Um teste que importasse `PESO_FRASE` para conferir `PESO_FRASE`
// seria o modo de falha nº 4 outra vez.
// ═════════════════════════════════════════════════════════════════════════════
{
  const GDOC = carregarGlossario(ROOT);
  ok('o glossário cobre as 74 gavetas do vocabulário fechado',
    GDOC.topicos.length === TOPICOS.size && GDOC.topicos.every((t) => TOPICOS.has(t.topico)),
    `${GDOC.topicos.length} tópicos no glossário contra ${TOPICOS.size} na lista fechada`);
  ok('e toda gaveta tem glosa — a glosa É a Porta A',
    GDOC.topicos.every((t) => String(t.glosa ?? '').trim().length > 0));

  // A PREMISSA DA ONDA INTEIRA, e ela é sobre a BASE, não sobre a ferramenta:
  // o termo mais importante do glossário não existe no corpus. Se um dia
  // existir, o canal do corpus passa a alcançá-lo e este teste avisa.
  const temFisgada = claims.some((c) => /fisgada/i.test(`${c.claim ?? ''} ${c.verbatim ?? ''}`));
  ok('PREMISSA: `fisgada` não aparece em NENHUMA das claims — por isso o corpus era cego para ela',
    !temFisgada,
    'se passou a aparecer, o roteamento léxico voltou a alcançar o caso do peitoral e este teste precisa ser reescrito');

  const W = termosDaPergunta('senti uma fisgada no peitoral, continuo?');
  const casou = casarGlossario(GLOSSARIO, 'senti uma fisgada no peitoral, continuo?', W);
  ok('o glossário casa `fisgada` em `dor` e em `lesao` — as duas gavetas do sintoma',
    casou.has('dor') && casou.has('lesao'),
    `casou: ${[...casou.keys()].join(', ')}`);

  // A raridade mudou de espaço, e é aqui que o bug do `peso` morre. A afirmação
  // é uma DESIGUALDADE medida, não um número copiado.
  ok('idf do glossário: `coracao` discrimina mais que `peso`, e `peso` mais que `treino`',
    idfDoGlossario(GLOSSARIO, 'coracao') > idfDoGlossario(GLOSSARIO, 'peso')
      && idfDoGlossario(GLOSSARIO, 'peso') > idfDoGlossario(GLOSSARIO, 'treino'),
    `coracao=${idfDoGlossario(GLOSSARIO, 'coracao').toFixed(2)} `
      + `peso=${idfDoGlossario(GLOSSARIO, 'peso').toFixed(2)} `
      + `treino=${idfDoGlossario(GLOSSARIO, 'treino').toFixed(2)} `
      + `(gavetas: ${gavetasDaPalavra(GLOSSARIO, 'coracao')}, ${gavetasDaPalavra(GLOSSARIO, 'peso')}, `
      + `${gavetasDaPalavra(GLOSSARIO, 'treino')})`);

  // O DESEMPATE MANDA, e ele manda na montagem do índice.
  const c2 = casarGlossario(GLOSSARIO, 'vale a pena trocar pra pegada fechada no supino?',
    termosDaPergunta('vale a pena trocar pra pegada fechada no supino?'));
  const porQueBracos = (c2.get('bracos')?.porQue ?? []).map((x) => x.termo);
  ok('o desempate tira `pegada fechada` de `bracos` — o par bracos×setup não co-etiqueta claim nenhuma',
    !porQueBracos.some((t) => /pegada fechada/i.test(String(t))),
    `bracos casou por: ${porQueBracos.join(' · ') || '(nada)'}`);

  // A família de prefixo do glossário é a MESMA regra do roteador, e ela vive
  // sem tocar o corpus — porque o corpus não sabe o que é `fisgada`.
  ok('familiaNoGlossario atravessa a conjugação (`supinando`→`supino`, `agachando`→`agacho`)',
    familiaNoGlossario(GLOSSARIO, 'supinando').includes('supino')
      && familiaNoGlossario(GLOSSARIO, 'agachando').includes('agacho'),
    `supinando → ${familiaNoGlossario(GLOSSARIO, 'supinando').join(', ')} | `
      + `agachando → ${familiaNoGlossario(GLOSSARIO, 'agachando').join(', ')}`);
  ok('e NÃO junta `power` com `powerlifting` nem `powerbuilding`',
    !familiaNoGlossario(GLOSSARIO, 'power').some((t) => /power(lifting|building)/.test(t)),
    `power → ${familiaNoGlossario(GLOSSARIO, 'power').join(', ')}`);
  /**
   * ── E O CASO ACIMA NÃO PROVA A REGRA DE PREFIXO, porque `power` É termo do
   *    glossário e o curto-circuito da palavra exata o resolve antes das três
   *    condições rodarem. Medido em 12/08/2026 por mutação: com o teste de
   *    `power` sozinho, `FRACAO_DA_PALAVRA_GLOSSARIO 0.6 → 0` passava VERDE no
   *    `check:kb` inteiro — a constante que separa `powerlifting` de
   *    `powerbuilding` no espaço do glossário não tinha canário nenhum.
   *
   *    `powerlift` NÃO é termo do glossário, então ele cai no balde de prefixo e
   *    as três condições decidem de verdade: prefixo comum `power` (5) sobre
   *    `powerbuilding` (13) dá 5 < 0,6 × 9, e só a fração recusa esse par —
   *    a diferença de comprimento (4) passaria. É o par que esta base declara
   *    ter opinião oposta um sobre o outro.
   */
  ok('e a regra de prefixo do glossário RODA: `powerlift` alcança `powerlifting` e recusa `powerbuilding`',
    familiaNoGlossario(GLOSSARIO, 'powerlift').includes('powerlifting')
      && !familiaNoGlossario(GLOSSARIO, 'powerlift').includes('powerbuilding'),
    `powerlift → ${familiaNoGlossario(GLOSSARIO, 'powerlift').join(', ')} — `
      + 'sem a fração da palavra mais curta, os dois assuntos viram um só');
  /**
   * ── E A TERCEIRA CONDIÇÃO, `DIFERENCA_MAXIMA_GLOSSARIO`, TAMBÉM PRECISA DA
   *    SUA — porque ela é a que sobrou sem canário depois que `powerlift`
   *    cobriu a fração.
   *
   * Medido por mutação em 12/08/2026: `DIFERENCA_MAXIMA_GLOSSARIO 5 → 50`
   * sobrevivia VERDE ao `check:kb` inteiro. Era uma das cinco mutações de
   * constante que passavam, e as cinco AFROUXAVAM — o padrão é o diagnóstico:
   * os testes cobriam só o lado que aperta.
   *
   * `fisiculturista` é o par certo para cobrar esta condição especificamente,
   * e não por acaso:
   *   · não é termo do glossário, então o curto-circuito da palavra exata não
   *     resolve nada e as três condições rodam de verdade;
   *   · o prefixo comum com `fisico` é `fisi` … na verdade `fisic` (5) sobre
   *     mínimo 6, que PASSA na fração de 0,6 — quem recusa o par é só a
   *     diferença de comprimento (14 contra 6, oito letras).
   *
   * Com a constante em 5 ele alcança `fisiculturismo` e mais nada. Com 50 ele
   * arrasta `fisico` e `fisica`, que são termos de OUTRAS gavetas — e aí uma
   * pergunta sobre fisiculturismo passa a pontuar gaveta de físico. É o bug do
   * `power`/`powerlifting` remontado no eixo do comprimento.
   */
  ok('e a DIFERENÇA DE COMPRIMENTO roda: `fisiculturista` não arrasta `fisico`/`fisica`',
    familiaNoGlossario(GLOSSARIO, 'fisiculturista').includes('fisiculturismo')
      && !familiaNoGlossario(GLOSSARIO, 'fisiculturista').some((t) => /^fisic[oa]$/.test(t)),
    `fisiculturista → ${familiaNoGlossario(GLOSSARIO, 'fisiculturista').join(', ')} — `
      + 'oito letras de diferença não é conjugação, é outra palavra');
  ok('e o mesmo no eixo do `cardio`: `cardiaco` não alcança `cardiovascular`',
    !familiaNoGlossario(GLOSSARIO, 'cardiaco').includes('cardiovascular'),
    `cardiaco → ${familiaNoGlossario(GLOSSARIO, 'cardiaco').join(', ')}`);
  ok('e a palavra que JÁ é termo do glossário fica sozinha, sem arrastar vizinho de prefixo',
    familiaNoGlossario(GLOSSARIO, 'fisgada').join(',') === 'fisgada',
    `fisgada → ${familiaNoGlossario(GLOSSARIO, 'fisgada').join(', ')} — `
      + 'sem este curto-circuito, `descanso` arrastaria `descarga` e dois canários do ROTAS.json ficam vermelhos');

  // A PORTA A, que é a que vale em produção.
  const cat = catalogoDeTopicos(GDOC, claims);
  ok('a Porta A entrega as 74 gavetas com glosa e com o TAMANHO contado na base',
    cat.length === 74 && cat.every((x) => x.glosa && Number.isInteger(x.claims))
      && cat.find((x) => x.topico === 'agacho').claims > 900
      && cat.find((x) => x.topico === 'carga-de-treino').claims < 50,
    'sem o tamanho, escolher uma gaveta de 990 e uma de 13 parece a mesma decisão');
}

// ── O GLOSSÁRIO É OBRIGATÓRIO, E A FALHA É BARULHENTA ───────────────────────
//
// Se ele fosse opcional, apagar a linha que o carrega em qualquer chamador
// devolveria a camada em silêncio ao roteador léxico de 10/08 — e o check:kb
// continuaria verde em tudo que o corpus ainda resolve sozinho.
{
  let explodiu = false;
  try {
    responder(claims, 'quanto descansar entre as séries?', {
      topicos: TOPICOS, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS,
    });
  } catch (e) {
    explodiu = /glossário/i.test(e.message);
  }
  ok('responder() SEM glossário explode em vez de rotear pior em silêncio', explodiu,
    'degradação muda é como uma camada volta ao estado anterior sem ninguém notar');
}

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

/**
 * ── O TETO DO CANAL DE PARAM, pelo mesmo motivo e com o mesmo cuidado ────────
 *
 * Medido por mutação em 12/08/2026: `TETO_PARAM 12 → 120` sobrevivia VERDE ao
 * `check:kb` inteiro. O canal de param é o único que lê o dado TIPADO em vez do
 * texto, e ele não passa pelo roteamento — então nenhum canário de gaveta o
 * alcança, e o orçamento de tela do `responder()` o esconde: sem teto próprio,
 * *quantas séries e repetições por semana com que percentual* devolve 31 linhas.
 *
 * O 12 aqui é literal e escrito à mão. Se ele viesse de `roteador.mjs`, a trava
 * leria a constante que verifica — que é o modo de falha nº 4 e é exatamente
 * como esta mutação sobreviveu.
 */
{
  const solto = porNomeDeParam(claims, INDICE, PERFIS, 'quantas series e repeticoes por semana com que percentual', { teto: 500 });
  const padrao = porNomeDeParam(claims, INDICE, PERFIS, 'quantas series e repeticoes por semana com que percentual');
  ok('o canal de param tem teto PRÓPRIO, e ele é de tela: no máximo 12 linhas',
    padrao.lista.length <= 12,
    `saíram ${padrao.lista.length} — o canal de param não passa por gaveta nenhuma, então nada mais o segura`);
  ok('e o teto está de fato MORDENDO nesta pergunta (senão o caso acima não prova nada)',
    solto.lista.length > 12,
    `sem teto saem ${solto.lista.length}: se não passar de 12, troque a pergunta — um teto que nunca corta não é medido`);
}

/**
 * ── O NOME COMPOSTO NÃO PODE FECHAR AS OUTRAS GAVETAS ────────────────────────
 *
 * Medido por mutação em 12/08/2026: `PESO_NOME_COMPOSTO 1,2 → 12` sobrevivia
 * VERDE. Era uma das cinco que passavam, e as cinco AFROUXAVAM — nesta casa os
 * testes cobriam só o lado que aperta.
 *
 * O dano de um peso dez vezes maior não é o número do score, é o SILÊNCIO que
 * ele produz: as rotas são filtradas por `FRACAO_DO_MELHOR` do melhor score,
 * então um canal que sozinho vale 12 empurra toda gaveta legítima para baixo do
 * corte. A pergunta abaixo nomeia uma gaveta pelo nome composto inteiro E
 * carrega a palavra que abre outra; as duas têm de sair. Com o peso em 12, a
 * segunda desaparece — e o atleta com histórico de peitoral perde a gaveta do
 * peitoral por ter escrito o nome de um assunto de descanso.
 *
 * Este caso afirma uma RELAÇÃO ("a segunda gaveta sobrevive ao lado da
 * nomeada"), não um número importado — é o que o torna legível quando a
 * alocação de vagas mudar embaixo dele.
 */
{
  const r = perguntar('descanso entre series com fisgada no peitoral');
  const rotas = r.rotas.map((x) => x.topico);
  ok('o nome composto NOMEIA a gaveta e ela vem em 1º',
    rotas[0] === 'descanso-entre-series', `rotas: ${rotas.join(', ')}`);
  ok('e o nome composto NÃO fecha a gaveta que a outra palavra abriu',
    rotas.some((t) => ['peito', 'dor', 'lesao'].includes(t)),
    `rotas: ${r.rotas.map((x) => `${x.topico}:${x.score.toFixed(2)}`).join(' ')} — `
      + 'um nome que vale 10x sozinho apaga toda gaveta legítima pelo corte de FRACAO_DO_MELHOR');
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

// ── a fiação da PÁGINA AO LADO ───────────────────────────────────────────────
//
// Regra 3 do protocolo do `RECUPERACAO.md`, e o caso é o da Q11: V033-05 (*3 %
// são 25 lb para mim*) não chega por canal nenhum — `pct_por_rpe` nomeia uma
// peça só da pergunta e a prosa dela fala de 800 lb, não de RPE. Ela chega por
// ser a claim IMEDIATAMENTE adjacente a V033-04, no mesmo vídeo.
//
// Os números aqui são literais escritos à mão: quem verifica não importa
// `DETALHE_ROTEADO` nem `TETO_PARAM` de `roteador.mjs`.
{
  const r = perguntar('quanto baixar o peso quando o RPE vem acima do alvo?');
  const v = r.vizinhos.find((x) => x.c.id === 'V033-05');
  ok('fiação: V033-05 entra pela página ao lado, e a saída DIZ de quem ela é vizinha',
    Boolean(v) && v.deQuem === 'V033-04',
    `vizinhos: ${r.vizinhos.map((x) => `${x.c.id}<-${x.deQuem}`).slice(0, 6).join(' ')}`);
  ok('fiação: o que entra pela página ao lado conta como MOSTRADO',
    r.idsMostrados.has('V033-05'),
    'calcular sem imprimir faria o canário passar por linha que não existe na tela');
  ok('a página ao lado é do MESMO vídeo e a no máximo 2 ids de distância',
    r.vizinhos.every((x) => x.c.src === (r.claims.find((y) => y.c.id === x.deQuem)?.c.src
      ?? r.params.lista.find((y) => y.c.id === x.deQuem)?.c.src)
      && Math.abs(Number(x.c.id.split('-')[1]) - Number(x.deQuem.split('-')[1])) <= 2),
    'um "vizinho" de outro vídeo, ou a 5 ids, não é abrir a página ao lado');
}

// ── a fiação DOS DOIS CASOS DO DIAGNÓSTICO DE 10/08 ─────────────────────────
//
// Estes dois passam por `responder()` inteiro e afirmam a coisa que o
// diagnóstico disse ser falsa. Os canários equivalentes moram no ROTAS.json
// (T16 e T17) e cobram os ids; aqui se cobra a GAVETA, que é o que a onda
// atacou, e o `porQue` que a justifica.
{
  const r = perguntar('fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?');
  const rotas = r.rotas.map((x) => x.topico);
  ok('fiação: a fisgada no peitoral ABRE `dor` — a gaveta que o roteador léxico nunca abria',
    rotas.includes('dor'),
    `rotas: ${rotas.join(', ')} — a palavra "fisgada" não existe em claim nenhuma, e é o glossário que a conhece`);
  const porQueDor = r.rotas.find((x) => x.topico === 'dor')?.porQue ?? [];
  ok('fiação: e a saída DIZ que quem abriu foi o glossário, com o termo',
    porQueDor.some((x) => /glossário/.test(String(x.canal)) && /fisgada/i.test(String(x.termo))),
    `porQue de dor: ${porQueDor.map((x) => `${x.termo}[${x.canal}]`).join(' · ')}`);
}
{
  const r = perguntar('levantar peso já conta como exercício pro coração');
  const rotas = r.rotas.map((x) => x.topico);
  ok('fiação: `levantar peso ... pro coração` abre `cardio`, e não é mais o `peso-corporal` em 1º',
    rotas.includes('cardio') && rotas[0] !== 'peso-corporal',
    `rotas: ${rotas.join(', ')} — em 10/08 saía peso-corporal em 1º com 0,73 e cardio não saía`);
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
