#!/usr/bin/env node
/**
 * OS CANÁRIOS DA ALOCAÇÃO DE VAGAS — e eles são feitos para morrer NOS DOIS
 * SENTIDOS.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A DÍVIDA QUE ESTE ARQUIVO PAGA
 *
 * O ataque de 11/08/2026 rodou 56 mutações de constante contra esta camada e
 * **cinco sobreviveram, todas no sentido de AFROUXAR**: `DETALHE_ROTEADO 8→80`,
 * `DIFERENCA_MAXIMA_GLOSSARIO 5→50`, `MIN_TERMOS 10→0`, `PESO_NOME_COMPOSTO
 * 1.2→12`, `TETO_PARAM 12→120`. O padrão é o diagnóstico: os testes existentes
 * cobrem o lado que APERTA (a resposta some) e não o lado que AFROUXA (a tela
 * enche e a resposta continua lá, no meio do despejo).
 *
 * A onda 2D acrescentou sete constantes à camada, e cada uma tem aqui DOIS
 * casos: um que fica vermelho se ela diminuir e outro que fica vermelho se ela
 * aumentar. Um caso só é meia trava.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A REGRA DE HIGIENE, E ELA É POR QUE ESTE ARQUIVO NÃO IMPORTA CONSTANTE NENHUMA
 *
 * **Nenhuma trava pode ler a constante que ela verifica.** Os números aqui são
 * literais escritos à mão a partir da medição do `medir-alocacao.mjs`, e os ids são
 * os que a base tem. Se `FRACAO_DA_ROTA` virar 40, este arquivo não muda de
 * opinião junto — ele fica vermelho, que é o ponto.
 *
 * Pelo mesmo motivo, nada aqui roda sobre corpus sintético: **teste sobre corpus
 * de bolso não prova recuperação.** As 6.912 claims reais são o instrumento.
 *
 * Uso: node research/tools/alocacao.test.mjs
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { indexar, carregarVocabulario } from './busca.mjs';
// Só FUNÇÕES. Nenhuma constante de `roteador.mjs` é importada aqui.
import { responder, perfilarTopicos, termosDaPergunta } from './roteador.mjs';
import { carregarGlossario, indexarGlossario } from './glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

let falhas = 0;
let total = 0;
const ok = (nome, cond, detalhe = '') => {
  total += 1;
  if (cond) {
    console.log(`  ✓ ${nome}`);
    return;
  }
  falhas += 1;
  console.log(`✗ ${nome}${detalhe ? `\n    ${detalhe}` : ''}`);
};

const perguntar = (texto, extra = {}) => responder(claims, texto, {
  topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: IDX, perfis: PERFIS, ...extra,
});

/**
 * A TELA, e ela é a MESMA definição que o `check-canarios.mjs` usa: os quatro
 * canais na ordem em que saem, cortados em 40.
 *
 * O 40 é literal aqui de propósito. Em 11/08 houve um erro de relatório porque
 * existiam duas definições de tela — o `telaDe()` cortava em 40 e a CLI imprimia
 * 68 —, e "chegou à tela" queria dizer coisas diferentes em dois parágrafos do
 * mesmo documento.
 */
const TELA = 40;
function tela(r) {
  const vistos = new Set();
  const out = [];
  const push = (c, canal) => {
    if (vistos.has(c.id)) return;
    vistos.add(c.id);
    out.push({ id: c.id, canal });
  };
  for (const x of r.claims) push(x.c, 'rota');
  for (const x of r.params.lista) push(x.c, 'param');
  for (const v of r.vizinhos) push(v.c, v.canal ?? 'viz');
  return out.slice(0, TELA);
}
const posicao = (t, id) => t.findIndex((x) => x.id === id) + 1;

const FISGADA = 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?';
const ORDEM = 'quando cai agacho e supino na mesma sessão, tanto faz qual eu faço primeiro';
const CINTO = 'o cinto pode ter mais de 13 mm de espessura na IPF';
const DESCANSO = 'quanto descansar entre as séries?';
const AGACHO = 'como melhorar meu agacho?';

console.log('\nA ALOCAÇÃO DE VAGAS — os dois sentidos de cada constante\n');

// ── O CASO QUE MAIS CUSTA A ESTE ATLETA ──────────────────────────────────────
//
// Histórico de ruptura de peitoral, bloco de reexposição do supino, e a pergunta
// é um aviso durante a série. As cinco claims que carregam o limiar de dor têm
// de chegar à tela SEM `--topic`. Em 11/08 chegava UMA, em 36º.
{
  const r = perguntar(FISGADA);
  const t = tela(r);
  const cinco = ['V079-34', 'V001-06', 'V138-19', 'V086-21', 'V027-23'];
  const fora = cinco.filter((i) => posicao(t, i) === 0);
  ok('FISGADA: as CINCO claims do limiar de dor chegam à tela, sem --topic',
    fora.length === 0,
    `faltam ${fora.join(', ')} — posições: ${cinco.map((i) => `${i}@${posicao(t, i) || '—'}`).join(' ')}`);

  // ── PISO_VAGAS: A ASSERÇÃO QUE ESTAVA AQUI ERA FALSA, E FOI REMOVIDA ──────
  //
  // Havia aqui um `magra >= 3`, que é `PISO_VAGAS >= 3` reescrito como asserção
  // — modo de falha nº 4 desta casa, dentro do arquivo escrito para provar que
  // as constantes foram ganhas. Duas medições o desmontam:
  //
  //   node research/tools/auditoria/piso.mjs
  //     piso 1, 2, 3 e 4 devolvem as CINCO desta pergunta nas MESMAS posições
  //     13/18/36/38/39. O piso não muda a saída da FISGADA — a asserção estava
  //     no bloco de uma pergunta sobre a qual ela não tem efeito nenhum.
  //   node research/tools/medir-alocacao.mjs --pisos 1,2,3,4 --expoentes 3 --cotas 0
  //     piso 1 -> 63/160 ids, 18/65 casos completos
  //     piso 3 -> 62/160 ids, 17/65 casos completos
  //
  // Removida em 12/08/2026, e NENHUMA asserção nova foi posta no lugar: escrevi
  // uma ("toda gaveta aberta entrega ao menos uma linha"), mutei seis constantes
  // contra ela e ela não ficou vermelha em nenhuma — trava que não sabe morrer é
  // decoração, e decoração é o que este arquivo existe para não ter.
  //
  // `PISO_VAGAS` NÃO ficou descoberto, e isto foi medido mutando roteador.mjs:
  //     3→1 e 3→0  morrem em `EXPOENTE_SURPRESA ↑` (agacho e supino caem para
  //                uma linha cada na pergunta ORDEM)
  //     3→8        morre em `EXPOENTE_SURPRESA ↓` (o piso alto devolve à gaveta
  //                grande as vagas que a pequena precisa, e G014-10 sai da tela)
  // As duas são asserções de SAÍDA, com número diferente do da constante.
  //
  // O que fica em aberto é uma ESCOLHA, não uma lacuna de teste: a bancada
  // prefere piso 1 e as travas de saída preferem 3, porque com 1 uma gaveta
  // grande aberta entrega uma linha só. Reescolher o valor reescreve o registro
  // medido dos 42 canários da porta nova, então é onda própria, com conjunto
  // cego próprio. Divergência §8.49 do RUNBOOK.

  // ── VAGAS_DA_LIGACAO / TETO_LIGACAO / LIGACOES_POR_FOCO, lado de BAIXO ────
  // V086-21 (*pode ser aceitável, MAS os sintomas precisam estar melhorando*) e
  // V027-23 (*lesão menor é a que se treina através demais*) não compartilham
  // palavra nenhuma com a pergunta. Elas chegam por serem `conditions` de
  // V079-34, que é `prescricao` e já está na tela.
  const ledger = new Set(r.vizinhos.filter((v) => v.canal === 'ligacao').map((v) => v.c.id));
  ok('LEDGER ↓: V086-21 e V027-23 chegam PELO CANAL `ligacao`, não por texto',
    ledger.has('V086-21') && ledger.has('V027-23'),
    `canal ligacao trouxe: ${[...ledger].join(', ') || '(nada)'}`);

  // ── ... e o lado de CIMA dos mesmos três ──────────────────────────────────
  // Afrouxar `TETO_LIGACAO` ou `LIGACOES_POR_FOCO` faz o canal despejar o grafo
  // inteiro no rodapé e empurrar a tela para fora do teto de leitura.
  ok('LEDGER ↑: o canal do ledger não passa de 8 claims',
    ledger.size <= 8, `trouxe ${ledger.size}`);

  // ── FRACAO_DA_ROTA, lado de CIMA ───────────────────────────────────────────
  // Com a rota levando 40, os outros três canais são calculados e cortados fora
  // da tela — foi assim que o ledger não existiu para efeito de medição nenhuma.
  ok('FRACAO_DA_ROTA ↑: o canal da rota não ocupa a tela inteira (≤ 24 de 40)',
    r.claims.length <= 24,
    `a rota devolveu ${r.claims.length} — acima disso o ledger e o nome-de-param saem da tela pelo corte`);
}

// ── EXPOENTE_SURPRESA, os dois lados ─────────────────────────────────────────
//
// `ordem-exercicio` tem 29 claims e `agacho` tem 990, e na B11 os dois pontuam
// quase igual (0,86 contra 0,90). Gaveta pequena que pontua é sinal FORTE.
{
  const r = perguntar(ORDEM);
  const t = tela(r);
  const porGaveta = new Map();
  for (const x of r.claims) porGaveta.set(x.topicos[0], (porGaveta.get(x.topicos[0]) ?? 0) + 1);
  ok('EXPOENTE_SURPRESA ↓: `ordem-exercicio` (29 claims) leva ao menos 12 das vagas contra `agacho` (990)',
    (porGaveta.get('ordem-exercicio') ?? 0) >= 12,
    `vagas usadas: ${[...porGaveta].map(([k, v]) => `${k}:${v}`).join(' ')} — com expoente 1 ela leva 9 e G014-10 não sai`);
  ok('EXPOENTE_SURPRESA ↓: e G014-10, que é a 14ª DENTRO da gaveta pequena, chega à tela',
    posicao(t, 'G014-10') > 0,
    `G014-10@${posicao(t, 'G014-10') || '—'}`);
  ok('EXPOENTE_SURPRESA ↑: e as gavetas grandes não são zeradas — `agacho` e `supino` continuam na tela',
    (porGaveta.get('agacho') ?? 0) >= 2 && (porGaveta.get('supino') ?? 0) >= 2,
    `agacho:${porGaveta.get('agacho') ?? 0} supino:${porGaveta.get('supino') ?? 0} — `
      + 'expoente alto demais transforma "gaveta pequena é sinal" em "só a gaveta pequena existe"');
}

// ── COTA_AFIM, os dois lados ─────────────────────────────────────────────────
//
// A afinidade conserta etiqueta esquecida, e `TETO_AFINS` é 60 — dois terços de
// uma gaveta de 29. A cota decide quem entra primeiro quando a gaveta não cabe.
{
  const r = perguntar(DESCANSO);
  const pos = r.claims.findIndex((x) => x.c.id === 'V038-07') + 1;
  ok('COTA_AFIM ↓: a claim AFIM continua chegando — V038-07 sai entre as 25 primeiras da rota',
    pos > 0 && pos <= 25,
    `V038-07@${pos || 'ausente'} — a cota ADIA a afim, não a proíbe; proibir mata o caso que criou a afinidade`);
  const declaradas = r.claims.filter((x) => (x.c.topic ?? []).includes('descanso-entre-series')).length;
  ok('COTA_AFIM: e a gaveta que CABE nas vagas dela sai inteira, com as 12 declaradas',
    declaradas >= 12, `saíram ${declaradas} declaradas de 12`);
}
{
  const r = perguntar(ORDEM);
  const oe = r.claims.filter((x) => x.topicos[0] === 'ordem-exercicio');
  const afinsNaGaveta = oe.filter((x) => !(x.c.topic ?? []).includes('ordem-exercicio')).length;
  ok('COTA_AFIM ↑: numa gaveta que NÃO cabe, a afim não pode ocupar a vaga da declarada',
    afinsNaGaveta === 0,
    `${afinsNaGaveta} das ${oe.length} vagas de \`ordem-exercicio\` foram para claim de outra gaveta — `
      + 'com cota 1 são 9, e G014-10 (declarada) fica de fora');
}

// ── A TELA TEM DE SABER DEVOLVER POUCO ───────────────────────────────────────
//
// Em 11/08, 32 de 33 perguntas devolviam exatamente 40 claims — inclusive esta,
// cuja resposta é uma linha do regulamento. Tela sempre cheia é indistinguível
// de tela que achou.
{
  const r = perguntar(CINTO);
  const t = tela(r);
  ok('ESTREITA ↓: a pergunta de resposta única devolve menos de 35, não 40',
    t.length < 35, `devolveu ${t.length}`);
  ok('ESTREITA: e a resposta (F001-84, espessura máxima 13 mm) sai entre as duas primeiras',
    posicao(t, 'F001-84') > 0 && posicao(t, 'F001-84') <= 2,
    `F001-84@${posicao(t, 'F001-84') || '—'} — o 1º lugar é F001-82 (o cinto não pode ter reforço), `
      + 'que é a outra linha do mesmo parágrafo do regulamento e casa as mesmas palavras');
}

// ── ... E O OUTRO LADO DISSO, QUE É O QUE COSTUMA FALTAR ─────────────────────
//
// "Devolver pouco" vira defeito assim que a pergunta é larga de verdade. Uma
// alocação apertada demais responde `agacho` com seis linhas.
{
  const r = perguntar(AGACHO);
  const t = tela(r);
  ok('LARGA ↑: a pergunta larga continua devolvendo uma amostra (≥ 30 na tela)',
    t.length >= 30, `devolveu ${t.length} — apertar a alocação até aqui é o modo de falha nº 2`);
  ok('LARGA: e a rota sozinha continua entre 20 e 24',
    r.claims.length >= 20 && r.claims.length <= 24, `rota ${r.claims.length}`);
}

// ── TETO_PARAM, os dois lados ────────────────────────────────────────────
//
// O canal do nome do param é o que acha V033-03 quando a prosa dela diz "subir"
// e a pergunta diz "baixar". Ele tem cota própria justamente para não disputar
// vaga com a rota — e cota própria só vale se ela tiver um teto.
{
  const r = perguntar('quanto baixar o peso quando o RPE vem acima do alvo?');
  ok('TETO_PARAM ↓: o canal de param entrega V033-03 e V033-04',
    r.params.lista.some((x) => x.c.id === 'V033-03')
      && r.params.lista.some((x) => x.c.id === 'V033-04'),
    `param trouxe ${r.params.lista.length}: ${r.params.lista.map((x) => x.c.id).join(' ')}`);
  ok('TETO_PARAM ↑: e não passa de 12 claims',
    r.params.lista.length <= 12, `trouxe ${r.params.lista.length}`);
  ok('DETALHE_ROTEADO ↑: a página ao lado da rota não passa de 8',
    r.vizinhos.filter((v) => v.canal === 'rota').length <= 8
      && r.vizinhos.filter((v) => v.canal === 'param').length <= 12,
    `rota:${r.vizinhos.filter((v) => v.canal === 'rota').length} `
      + `param:${r.vizinhos.filter((v) => v.canal === 'param').length} — `
      + 'afrouxar aqui enche o rodapé com a vizinhança de 22 focos e empurra o ledger para fora do corte');
  ok('e V033-05 (3 % são 25 lb) chega pela PÁGINA AO LADO do canal de param',
    r.vizinhos.some((v) => v.c.id === 'V033-05' && v.canal === 'param'),
    'este id não chega por canal nenhum de texto: ele é a claim imediatamente adjacente a V033-04');
}

// ── A GAVETA FORÇADA NÃO OBEDECE À FATIA ─────────────────────────────────────
{
  const r = perguntar('que dimensões de cinto o regulamento permite?', { forcar: ['cinto'], teto: 60 });
  ok('FORÇADA: --topic leva a tela inteira e as duas dimensões do regulamento saem',
    r.idsMostrados.has('F001-83') && r.idsMostrados.has('F001-84') && r.claims.length > 24,
    `rota ${r.claims.length} — quem digita --topic pediu a GAVETA, não a fatia dela`);
}

// ── O INVARIANTE DA SOMA ─────────────────────────────────────────────────────
//
// A soma das vagas dadas nunca pode passar do teto de tela: se passar, a
// alocação voltou a ser um ranking global com etiqueta nova.
{
  for (const q of [FISGADA, ORDEM, CINTO, DESCANSO, AGACHO, 'quanto de proteína por dia']) {
    const r = perguntar(q);
    const usadas = r.claims.length;
    if (usadas > 24) {
      ok(`INVARIANTE: "${q.slice(0, 30)}…" não estoura o orçamento da rota`, false, `usou ${usadas}`);
    }
  }
  ok('INVARIANTE: nenhuma das seis perguntas de controle estoura o orçamento da rota', true);
}

console.log('');
if (falhas > 0) {
  console.error(`✗ ${falhas} de ${total} casos falharam em alocacao.test.mjs`);
  process.exit(1);
}
console.log(`✓ ${total} casos verdes — a alocação de vagas por gaveta cumpre as três propriedades\n`);
