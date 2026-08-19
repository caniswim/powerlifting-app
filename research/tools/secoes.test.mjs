#!/usr/bin/env node
/**
 * A INVARIANTE DE NÃO-DILUIÇÃO, E OS CANÁRIOS DAS CONSTANTES DA TELA POR SEÇÃO.
 *
 * Substitui o `alocacao.test.mjs`, que media a repartição de um orçamento único
 * — a coisa que deixou de existir em 13/08/2026.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ESTE ARQUIVO EXISTE PARA IMPEDIR
 *
 * O defeito medido em 12/08: a resposta era UMA tela plana de 40 vagas
 * repartida entre as gavetas abertas, então cada gaveta a mais diluía as
 * outras. Medido na D05, cujos três ids moram todos em `convencional`:
 *
 *     --pergunta … --topic convencional  → 3 de 3
 *     --pergunta … (sem --topic)         → 1 de 3, com as vagas repartidas
 *                                          pernas 8 · convencional 9 · sumo 3
 *
 * A forma nova promete que isso não pode mais acontecer:
 *
 *     **Acrescentar uma gaveta ao conjunto roteado NUNCA remove um id que já
 *     aparecia na seção de outra gaveta.**
 *
 * É uma propriedade verificável por compilador e é o coração desta camada. O
 * teste abaixo a cobra sobre a base REAL e sobre TODAS as perguntas dos
 * canários — os 61 do `CANARIOS.json` e os 19 do `ROTAS.json` —, e não sobre
 * três casos escolhidos a dedo.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A REGRA DE HIGIENE, E ELA É POR QUE ESTE ARQUIVO NÃO IMPORTA CONSTANTE NENHUMA
 *
 * **Nenhuma trava pode ler a constante que ela verifica.** Os números aqui são
 * literais escritos à mão a partir da medição do `medir-secoes.mjs`, e os ids
 * são os que a base tem. Se `TETO_DA_SECAO` virar 140, este arquivo não muda de
 * opinião junto — ele fica vermelho, que é o ponto.
 *
 * Cada constante tem DOIS casos: um que fica vermelho se ela diminuir e outro
 * se ela aumentar. Um caso só é meia trava — as cinco mutações que sobreviveram
 * ao ataque de 11/08 estavam todas do lado que AFROUXA.
 *
 * Uso: node research/tools/secoes.test.mjs
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { indexar, carregarVocabulario } from './busca.mjs';
// Só FUNÇÕES. Nenhuma constante de `roteador.mjs` é importada aqui.
import {
  responder, perfilarTopicos, termosDaPergunta, telaDaResposta,
} from './roteador.mjs';
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
 * A TELA, e ela é a MESMA projeção que a CLI imprime e que o `check-canarios`
 * conta: `telaDaResposta()`, uma só, em `roteador.mjs`. Em 11/08 havia quatro
 * cópias desta função e a CLI tinha uma quinta conta implícita — a divergência
 * produziu um erro de relatório.
 *
 * O que este arquivo NÃO importa de lá são os NÚMEROS.
 */
const idsDaSecao = (s) => [
  ...s.principais.map((x) => x.c.id),
  ...s.ligacoes.map((v) => v.c.id),
  ...s.lado.map((v) => v.c.id),
];
const porChave = (r) => new Map(r.secoes.map((s) => [s.chave, idsDaSecao(s)]));

console.log('\nA TELA POR SEÇÃO — a invariante, e as constantes nos dois sentidos\n');

// ═════════════════════════════════════════════════════════════════════════════
// 1. A INVARIANTE, SOBRE TODA PERGUNTA DE CANÁRIO QUE EXISTE
// ═════════════════════════════════════════════════════════════════════════════
{
  const cans = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8'));
  const rotasDoc = JSON.parse(readFileSync(join(ROOT, 'research/kb/ROTAS.json'), 'utf8'));
  const PERGUNTAS = [
    ...(cans.canarios ?? []).map((c) => c.pergunta),
    ...(rotasDoc.casos ?? []).map((c) => c.pergunta),
    ...(rotasDoc.calibracao?.dentro ?? []),
    // O caso que originou a onda, com as três gavetas que disputam.
    'eu puxo de pernas abertas, preciso treinar do jeito tradicional tambem e quanto disso',
    'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',
  ].filter((p) => String(p ?? '').trim());

  const violacoes = [];
  let comparacoes = 0;
  let comMaisDeUma = 0;
  for (const p of PERGUNTAS) {
    const saidas = [];
    for (let n = 1; n <= 6; n += 1) {
      saidas.push(perguntar(p, { tela: { porSecao: 18, secoes: n } }));
    }
    if (saidas[5].secoes.filter((s) => s.tipo === 'gaveta').length > 1) comMaisDeUma += 1;
    for (let n = 0; n < saidas.length - 1; n += 1) {
      const antes = porChave(saidas[n]);
      const depois = porChave(saidas[n + 1]);
      for (const [chave, ids] of antes) {
        comparacoes += 1;
        const agora = depois.get(chave);
        if (!agora) {
          violacoes.push(`"${p.slice(0, 40)}…" n=${n + 1}→${n + 2}: a seção \`${chave}\` SUMIU`);
          continue;
        }
        const perdidos = ids.filter((i) => !agora.includes(i));
        if (perdidos.length > 0) {
          violacoes.push(
            `"${p.slice(0, 40)}…" n=${n + 1}→${n + 2}: a seção \`${chave}\` perdeu ${perdidos.join(', ')}`,
          );
        }
      }
    }
  }

  ok(
    `INVARIANTE: em ${PERGUNTAS.length} perguntas reais e ${comparacoes} comparações de seção, `
      + 'acrescentar uma gaveta NUNCA removeu um id da seção de outra',
    violacoes.length === 0,
    violacoes.slice(0, 5).join('\n    '),
  );
  ok(
    'e a amostra tem substância: a maioria das perguntas abre MAIS DE UMA gaveta',
    comMaisDeUma >= PERGUNTAS.length / 2,
    `só ${comMaisDeUma} de ${PERGUNTAS.length} abrem duas ou mais — sem disputa não há diluição a medir`,
  );

  // ── O caso NOMEADO que originou a onda, cobrado à parte ────────────────────
  //
  // Não porque a varredura acima não o cubra, mas porque um número agregado que
  // fica verde escondendo o caso caro é como esta casa já errou cinco vezes.
  const D05 = 'eu puxo de pernas abertas, preciso treinar do jeito tradicional tambem e quanto disso';
  const so = perguntar(D05, { forcar: ['convencional'], tela: { porSecao: 18, secoes: 5, porSecaoForcada: 60 } });
  const tudo = perguntar(D05, { tela: { porSecao: 18, secoes: 5 } });
  const tres = ['V088-01', 'V088-16', 'V088-21'];
  const naSecao = tudo.secoes.find((s) => s.chave === 'convencional');
  ok(
    'D05: as três claims de `convencional` chegam com a gaveta FORÇADA (a premissa do caso)',
    tres.every((i) => so.idsMostrados.has(i)),
    `faltam: ${tres.filter((i) => !so.idsMostrados.has(i)).join(', ')}`,
  );
  /**
   * ── E O QUE A INVARIANTE **NÃO** CONSERTA, MEDIDO E ESCRITO ────────────────
   *
   * A D05 continua falhando sem `--topic`, e o motivo NÃO é diluição entre
   * gavetas: a seção de `convencional` é bit a bit a mesma com uma ou com cinco
   * gavetas abertas (é o que as comparações acima provam). O que falta é
   * TAMANHO DE SEÇÃO — dentro de `convencional`, contando só as declaradas, os
   * três ids estão em 17º, 25º e 27º, e a seção entrega 18: chega UM.
   *
   * A diferença entre `--topic convencional` e a seção roteada de
   * `convencional` é, hoje, só o teto: 60 contra 14. **O soterramento restante
   * é DENTRO da gaveta, e é ordenação, não apresentação.** Está registrado no
   * `RECUPERACAO.md` §23 como a falha aberta desta onda, e este caso cobra que
   * ele não PIORE em silêncio.
   */
  const dentro = naSecao ? idsDaSecao(naSecao).filter((i) => tres.includes(i)).length : -1;
  ok(
    `D05: a seção de \`convencional\` entrega ${dentro} dos 3 ids sem --topic (falha ABERTA e medida)`,
    dentro === 1,
    'se subiu, reescreva este caso e o §23 do RECUPERACAO.md; se caiu abaixo de zero, algo quebrou',
  );
  ok(
    'D05: e a seção de `convencional` é a MESMA com 1 e com 5 gavetas abertas — não é diluição',
    (() => {
      const so1 = perguntar(D05, { tela: { porSecao: 18, secoes: 1 } });
      const a = so1.secoes.find((s) => s.chave === 'convencional');
      const b = naSecao;
      return !a || !b || idsDaSecao(a).join('|') === idsDaSecao(b).join('|');
    })(),
    'se mudou, a invariante furou justamente no caso que originou a onda',
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. O CASO QUE MAIS CUSTA A ESTE ATLETA
// ═════════════════════════════════════════════════════════════════════════════
//
// Histórico de ruptura de peitoral, bloco de reexposição do supino, e a pergunta
// é um aviso durante a série. As cinco claims que carregam o limiar de dor têm
// de chegar SEM `--topic`, e têm de chegar JUNTAS — na seção `dor`, que é onde
// quem lê vai procurar.
const FISGADA = 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?';
{
  const r = perguntar(FISGADA);
  const cinco = ['V079-34', 'V001-06', 'V138-19', 'V086-21', 'V027-23'];
  const linhas = telaDaResposta(r);
  const onde = (id) => linhas.find((x) => x.id === id);
  const fora = cinco.filter((i) => !onde(i));
  ok('FISGADA: as CINCO claims do limiar de dor chegam à tela, sem --topic',
    fora.length === 0,
    `faltam ${fora.join(', ')}`);
  ok('FISGADA: e as CINCO estão na MESMA seção — `dor`, que é onde quem lê procura',
    fora.length === 0 && cinco.every((i) => onde(i).secao === 'dor'),
    cinco.map((i) => `${i}@${onde(i) ? `${onde(i).secao}#${onde(i).posicaoNaSecao}` : '—'}`).join(' '));
  const prescricoes = cinco.filter((i) => onde(i) && onde(i).canal === 'rota');
  ok('FISGADA: e as duas PRESCRIÇÕES saem no corpo da seção, não só no rodapé dela',
    prescricoes.length >= 2,
    cinco.map((i) => `${i}:${onde(i)?.canal ?? '—'}`).join(' '));
}

// ── E A MESMA PERGUNTA SEM O JARGÃO. ─────────────────────────────────────────
//
// `fisgada`, `3/10` e `supino pausado` são vocabulário de quem já sabe. O atleta
// que manda mensagem às 22h não escreve assim, e em 12/08 a paráfrase caía de
// 5 para 3 das cinco. O caso entra como MEDIÇÃO e não como exigência: o número
// abaixo é o que a camada entrega hoje, escrito à mão, e ele tem de não cair.
const PARAFRASE = 'senti uma pontada nível 3 de 10 no peito na 3ª série do supino com pausa, sigo o treino';
{
  const r = perguntar(PARAFRASE);
  const cinco = ['V079-34', 'V001-06', 'V138-19', 'V086-21', 'V027-23'];
  const achadas = cinco.filter((i) => r.idsMostrados.has(i));
  ok(`PARÁFRASE sem jargão: entrega ao menos 3 das 5 (hoje ${achadas.length})`,
    achadas.length >= 3,
    `achou ${achadas.join(', ') || '(nenhuma)'} — gavetas: ${r.rotas.map((x) => x.topico).join(', ')}`);
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. AS CONSTANTES DA TELA, NOS DOIS SENTIDOS
// ═════════════════════════════════════════════════════════════════════════════

// ── TETO_DA_SECAO ────────────────────────────────────────────────────────────
{
  /**
   * ── O TAMANHO DA SEÇÃO É UM NÚMERO SÓ, E ELE É 24 ─────────────────────────
   *
   * A conta está escrita no contrato: a seção tem `TETO_DA_SECAO` vagas para
   * declaradas e `AFINS_DA_SECAO` para afins, e a afim herda a SOBRA quando a
   * gaveta inteira cabe. Some os dois casos extremos e dá o mesmo número:
   *
   *     18 declaradas + 6 afins                    = 24
   *     12 declaradas + (6 + 6 de sobra) afins     = 24
   *
   * 24 é literal e escrito à mão. É o caso que mata as duas constantes pelo
   * lado que AFROUXA: `TETO_DA_SECAO 18 → 22` e `AFINS_DA_SECAO 6 → 60` passam
   * por cima dele, e nenhum canário de recall os pegaria — tela cheia não
   * derruba recall, a resposta continua lá no meio do despejo.
   */
  const varias = [
    perguntar('como melhorar meu agacho?'),
    perguntar(FISGADA),
    perguntar('quanto descansar entre as séries?'),
    perguntar('o cinto pode ter mais de 13 mm de espessura na IPF'),
  ];
  const gavetas = varias.flatMap((r) => r.secoes.filter((s) => s.tipo === 'gaveta'));
  const maior = Math.max(...gavetas.map((s) => s.principais.length));
  ok('TETO_DA_SECAO + AFINS_DA_SECAO ↑: nenhuma seção passa de 24 claims, nem na gaveta de 990',
    maior <= 24,
    `a maior seção devolveu ${maior} — ${gavetas.map((s) => `${s.chave}:${s.declaradas.length}+${s.afins.length}`).join(' ')}`);
  const daGrande = varias[0].secoes.find((s) => s.tipo === 'gaveta');
  ok('TETO_DA_SECAO ↓: e a seção da gaveta grande entrega ao menos 16',
    Boolean(daGrande) && daGrande.principais.length >= 16,
    `a seção de \`${daGrande?.chave}\` devolveu ${daGrande?.principais.length}`);
  ok('MAX_TOPICOS ↑: no máximo 5 seções de gaveta, mais a do nome-do-dado',
    varias.every((r) => r.secoes.filter((s) => s.tipo === 'gaveta').length <= 5 && r.secoes.length <= 6),
    varias.map((r) => `${r.secoes.length}`).join(' '));
}

// ── AFINS_DA_SECAO, os dois lados ────────────────────────────────────────────
//
// A afinidade conserta etiqueta esquecida e não pode virar a gaveta. O caso é o
// T05: V038-07 fala de descansar 8 minutos e NÃO está etiquetada em
// `descanso-entre-series`.
{
  const r = perguntar('quanto descansar entre as séries?');
  const s = r.secoes.find((x) => x.chave === 'descanso-entre-series');
  ok('AFINS_DA_SECAO ↓: a claim AFIM continua chegando — V038-07 na seção da gaveta certa',
    Boolean(s) && s.afins.some((x) => x.c.id === 'V038-07'),
    `afins da seção: ${s ? s.afins.map((x) => x.c.id).join(' ') : '(seção ausente)'}`);
  const declarado = (claims.find((c) => c.id === 'V038-07')?.topic ?? []);
  ok('a premissa do caso acima continua verdadeira (V038-07 NÃO é do tópico)',
    !declarado.includes('descanso-entre-series'),
    `V038-07 hoje é ${declarado.join(', ')} — se foi reetiquetada, este caso parou de medir afinidade`);
  // ↑: a afim NÃO pode empurrar a declarada para fora. É a diluição de DENTRO da
  //    gaveta, medida na D06: com uma fila só, F001-11 (34ª declarada de
  //    `comandos-ipf`) some atrás das 60 afins vindas das gavetas grandes.
  const gavetas = r.secoes.filter((x) => x.tipo === 'gaveta');
  const invadida = gavetas.filter((x) => x.afins.length > x.declaradas.length && x.oferecidas > x.declaradas.length);
  ok('AFINS_DA_SECAO ↑: em nenhuma seção a afim ocupa mais lugar que a declarada quando a gaveta não coube',
    invadida.length === 0,
    invadida.map((x) => `${x.chave}: ${x.declaradas.length} declaradas × ${x.afins.length} afins`).join(' · '));
  ok('AFINS_DA_SECAO ↑: e as declaradas vêm ANTES das afins dentro da seção',
    gavetas.every((x) => x.principais.slice(0, x.declaradas.length).every((y) => y.comoEntrou === 'declarado')),
    'a ordem do bloco é o que separa "a gaveta diz" de "a gaveta parece dizer"');
}

// ── O LEDGER DA SEÇÃO, os dois lados (teto DERIVADO de FOCO_DA_SECAO) ────────
{
  const r = perguntar(FISGADA);
  const s = r.secoes.find((x) => x.chave === 'dor');
  ok('LEDGER ↓: o ledger de `dor` traz V086-21 e V138-19, que não casam palavra nenhuma',
    Boolean(s) && ['V086-21', 'V138-19'].every((i) => s.ligacoes.some((v) => v.c.id === i)),
    `ledger de dor: ${s ? s.ligacoes.map((v) => v.c.id).join(' ') : '(seção ausente)'}`);
  const maior = Math.max(...r.secoes.map((x) => x.ligacoes.length));
  // ↑: 8 é literal. Sem teto, uma seção com 14 prescrições × 4 ligações cada
  //    devolveria 56 linhas de ledger e o canal deixaria de completar para
  //    passar a soterrar.
  /**
   * O teto do ledger é DERIVADO (`FOCO_DA_SECAO × LIGACOES_POR_FOCO`), e 16 é o
   * produto escrito à mão. Medido sobre os 61 canários, o máximo real é 7 — e
   * foi por isso que a constante própria que existia aqui foi removida: acima
   * de 16 ela era matematicamente inerte, que é a forma mais barata de uma
   * constante mentir.
   */
  ok('LEDGER ↑: nenhuma seção passa de 16 linhas de ledger (4 focos × 4 por foco)',
    maior <= 16, `a maior devolveu ${maior}`);
  /**
   * ── E O RESÍDUO DE MUTAÇÃO FICA ESCRITO, PORQUE ELE É ARITMÉTICA ──────────
   *
   * `LIGACOES_POR_FOCO 4 → 40` SOBREVIVE ao `check:kb`, e a maior parte disso é
   * o teto da BASE e não o da ferramenta: nenhuma claim desta base declara mais
   * do que 6 ligações somando `conditions` e `conflicts`, então qualquer valor
   * ACIMA DE 6 devolve exatamente o mesmo. Sobra uma faixa real de 4 a 6 sem
   * trava, e ela está registrada como dívida no `RECUPERACAO.md` §23. O caso
   * abaixo prova o fato aritmético — se uma claim passar a declarar 10, ele
   * fica vermelho e a constante volta a poder mentir de verdade.
   */
  const maisLigada = Math.max(...claims.map(
    (c) => (c.conditions ?? []).length + (c.conflicts ?? []).length,
  ));
  ok(`LIGACOES_POR_FOCO ↑ é inerte acima de 6 por ARITMÉTICA: nenhuma claim declara mais ligações (máximo ${maisLigada})`,
    maisLigada <= 6,
    'uma claim passou a declarar mais ligações que o porFoco — a constante voltou a ser escolha e precisa de trava');
}

// ── A PÁGINA AO LADO e FOCO_DA_SECAO, os dois lados ──────────────────────────
{
  const r = perguntar('quanto baixar o peso quando o RPE vem acima do alvo?');
  const v = r.vizinhos.find((x) => x.c.id === 'V033-05');
  ok('PÁGINA AO LADO ↓: V033-05 (3 % são 25 lb) entra pela página ao lado de V033-04',
    Boolean(v) && v.deQuem === 'V033-04',
    `vizinhos: ${r.vizinhos.map((x) => `${x.c.id}<-${x.deQuem}`).slice(0, 8).join(' ')}`);
  /**
   * O TETO É POR SEÇÃO DE GAVETA. A seção do NOME DO DADO tem o seu, e é maior
   * de propósito: V033-05 é a claim ao lado de V033-04, que é a 10ª linha do
   * canal de param — um orçamento de 8 nunca chega ao 10º foco, e o número que
   * traduz 3 % em 25 lb some da tela.
   */
  const maior = Math.max(...r.secoes.filter((x) => x.tipo === 'gaveta').map((x) => x.lado.length));
  const maiorParam = Math.max(0, ...r.secoes.filter((x) => x.tipo === 'param').map((x) => x.lado.length));
  // Teto derivado: um vizinho por foco, e os focos são `FOCO_DA_SECAO`
  // declaradas mais `FOCO_DA_SECAO` afins.
  ok('PÁGINA AO LADO ↑: nenhuma seção de gaveta passa de 8 vizinhos (2 × 4 focos)',
    maior <= 8, `a maior devolveu ${maior}`);
  ok('e a seção do nome-do-dado não passa de 12, que é o tamanho do próprio canal',
    maiorParam <= 12, `a do param devolveu ${maiorParam}`);
  ok('a página ao lado é do MESMO vídeo e a no máximo 2 ids de distância',
    r.vizinhos.filter((x) => x.canal !== 'ligacao').every((x) => Math.abs(
      Number(x.c.id.split('-')[1]) - Number(x.deQuem.split('-')[1]),
    ) <= 2),
    'um "vizinho" a 5 ids não é abrir a página ao lado');
}

// ── O TETO DE SEÇÕES CORTA A SEÇÃO INTEIRA, E DIZ QUE CORTOU ─────────────────
{
  const cheio = perguntar(FISGADA, { tela: { porSecao: 18, secoes: 5 } });
  const cortado = perguntar(FISGADA, { tela: { porSecao: 18, secoes: 2 } });
  const gavetasCheio = cheio.secoes.filter((s) => s.tipo === 'gaveta').map((s) => s.chave);
  const gavetasCortado = cortado.secoes.filter((s) => s.tipo === 'gaveta').map((s) => s.chave);
  ok('teto de seções ↓: com 2 seções saem as DUAS primeiras inteiras, e não pedaços de cinco',
    gavetasCortado.length === 2
      && gavetasCortado.every((t, i) => t === gavetasCheio[i]),
    `cheio: ${gavetasCheio.join(', ')} · cortado: ${gavetasCortado.join(', ')}`);
  const idsCortadas = cortado.secoes.filter((s) => s.tipo === 'gaveta')
    .map((s) => idsDaSecao(s).join('|'));
  const idsCheio = cheio.secoes.filter((s) => gavetasCortado.includes(s.chave))
    .map((s) => idsDaSecao(s).join('|'));
  ok('teto de seções: e as seções que sobraram são IDÊNTICAS às de cinco — o corte não come vaga',
    idsCortadas.join('¶') === idsCheio.join('¶'),
    'se as vagas fossem redistribuídas, o soma-zero teria voltado pela porta dos fundos');
  ok('teto de seções: e a resposta DIZ quais gavetas ficaram de fora',
    cortado.rotasCortadas.length === gavetasCheio.length - 2
      && cortado.rotasCortadas.every((t) => gavetasCheio.includes(t.topico)),
    `rotasCortadas: ${cortado.rotasCortadas.map((t) => t.topico).join(', ') || '(vazio)'}`);
}

// ── A GAVETA FORÇADA ─────────────────────────────────────────────────────────
{
  /**
   * O teto da gaveta forçada, cobrado SEM passar `porSecaoForcada` — é a única
   * chamada do arquivo que usa o default da ferramenta, e por isso é a única
   * que mata `TETO_DA_SECAO_FORCADA` pelo lado que afrouxa. `agacho` tem 990
   * claims: sem teto próprio, `--topic agacho` despeja a gaveta inteira.
   */
  const grande = perguntar('como melhorar meu agacho?', { forcar: ['agacho'] });
  const n = grande.secoes[0]?.principais.length ?? 0;
  ok('TETO_DA_SECAO_FORCADA ↑: --topic numa gaveta de 990 devolve no máximo 60',
    n <= 60, `devolveu ${n}`);
  ok('TETO_DA_SECAO_FORCADA ↓: e devolve bem mais que uma seção roteada (≥ 40)',
    n >= 40, `devolveu ${n}`);
}
{
  const r = perguntar('que dimensões de cinto o regulamento permite?', {
    forcar: ['cinto'], tela: { porSecao: 18, secoes: 5, porSecaoForcada: 60 },
  });
  ok('--topic força a gaveta, ela sai SEM afins e as duas dimensões da IPF chegam',
    r.secoes.filter((s) => s.tipo === 'gaveta').length === 1
      && r.secoes[0].afins.length === 0
      && r.idsMostrados.has('F001-83') && r.idsMostrados.has('F001-84'),
    `seção: ${r.secoes[0]?.chave} · afins ${r.secoes[0]?.afins.length} · `
      + `83:${r.idsMostrados.has('F001-83')} 84:${r.idsMostrados.has('F001-84')}`);
}

// ── SABER DEVOLVER POUCO ─────────────────────────────────────────────────────
//
// 32 de 33 perguntas devolviam exatamente 40 em 11/08 — tela sempre cheia é
// indistinguível de tela que achou.
{
  /**
   * A afirmação não é sobre uma pergunta em particular — é sobre a DISTRIBUIÇÃO.
   * Uma camada que devolve sempre o mesmo tamanho não está respondendo, está
   * preenchendo, e nenhum canário de id pega isso.
   *
   * E o tamanho da tela é dominado pelo número de SEÇÕES, que é roteamento: por
   * isso o que se cobra aqui é que a tela de UMA gaveta seja muito menor que a
   * de cinco, e que os tamanhos se espalhem.
   */
  const amostra = [
    'o cinto pode ter mais de 13 mm de espessura na IPF',
    'como melhorar meu agacho?',
    'quanto descansar entre as séries?',
    'quantas horas de sono por semana?',
    'quanto de proteína por dia?',
    'vale a pena fazer deload?',
    'quantos comandos tem o supino na IPF',
    'a barra tem de encostar no peito no supino',
    'quanto baixar o peso quando o RPE vem acima do alvo?',
    'posso supinar seis vezes por semana?',
  ].map((q) => perguntar(q));
  const tamanhos = amostra.map((r) => r.tela.length);
  const distintos = new Set(tamanhos).size;
  ok('a tela NÃO tem sempre o mesmo tamanho — 32 de 33 perguntas devolviam exatamente 40 em 11/08',
    distintos >= 8 && Math.max(...tamanhos) >= 3 * Math.min(...tamanhos),
    `${distintos} tamanhos distintos em 10 perguntas: ${tamanhos.join(' ')}`);
  const porSecoes = amostra.map((r) => [r.secoes.length, r.tela.length]);
  const deUma = porSecoes.filter(([n]) => n <= 2).map(([, t]) => t);
  const deCinco = porSecoes.filter(([n]) => n >= 5).map(([, t]) => t);
  ok('e a tela de uma/duas seções é MUITO menor que a de cinco ou mais',
    deUma.length > 0 && deCinco.length > 0
      && Math.max(...deUma) * 2 <= Math.min(...deCinco),
    `poucas seções: ${deUma.join(' ')} · muitas: ${deCinco.join(' ')}`);
  const fora = perguntar('qual a capital da França?');
  ok('a pergunta FORA DE DOMÍNIO devolve tela vazia e diz o motivo',
    fora.secoes.length === 0 && fora.tela.length === 0 && fora.motivo === 'fora-de-dominio',
    `${fora.tela.length} linhas, motivo ${fora.motivo}`);
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. O CUSTO EM BYTES — a única trava que mata o lado que AFROUXA de todas elas
// ═════════════════════════════════════════════════════════════════════════════
//
// Todas as constantes acima têm um lado que só ENCHE a tela, e tela cheia não
// derruba nenhum canário de recall: a resposta continua lá, no meio do despejo.
// Foi assim que `DETALHE_ROTEADO 8→80` e `TETO_PARAM 12→120` sobreviveram
// verdes ao ataque de 11/08.
//
// Este caso roda a CLI de verdade e mede o que ela IMPRIME. Os dois números são
// literais escritos à mão. O de cima é o orçamento de contexto: a resposta é
// para um agente de conversa, e 40 kB por consulta destrói a consulta seguinte.
// O de baixo existe porque uma tela vazia também passaria no de cima.
{
  const bytes = (q) => Buffer.byteLength(execFileSync(
    process.execPath,
    [join(ROOT, 'research/tools/check-evidence.mjs'), '--pergunta', q],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  ), 'utf8') / 1024;

  /**
   * A pergunta mais LARGA que se mediu — abre cinco gavetas e é a que fixa o
   * teto. A curva, medida em 13/08 (`TETO_DA_SECAO` → kB desta pergunta):
   *
   *     18 → 31,0    22 → 33,9    24 → 35,2    40 → 45,5
   *
   * O teto de 34 kB é o orçamento de contexto e é ele que ESCOLHE o 18: a regra
   * é *o maior teto de seção que cabe*, e não um número de gosto. Uma mutação
   * `TETO_DA_SECAO 18 → 22` fica vermelha aqui — e em lugar nenhum mais, porque
   * tela cheia não derruba canário de recall nenhum: a resposta continua lá, no
   * meio do despejo. Foi assim que `DETALHE_ROTEADO 8→80` e `TETO_PARAM 12→120`
   * sobreviveram verdes ao ataque de 11/08.
   */
  const larga = bytes('o cinto pode ter mais de 13 mm de espessura na IPF');
  const dor = bytes(FISGADA);
  ok(`CUSTO ↑: a saída mais larga cabe num prompt (${larga.toFixed(1)} kB ≤ 34)`,
    larga <= 34,
    'alguma constante da tela inflou; nenhum canário de recall pega isto, só este');
  ok(`CUSTO ↑: e a da fisgada também (${dor.toFixed(1)} kB ≤ 34)`, dor <= 34);
  ok(`CUSTO ↓: e nenhuma das duas está vazia (${dor.toFixed(1)} kB ≥ 12)`,
    dor >= 12 && larga >= 12,
    'a tela encolheu a ponto de não ser mais uma resposta');
  /**
   * E ELA IMPRIME A CLAIM INTEIRA NO TOPO DE CADA SEÇÃO. `DETALHE_ROTEADO 8→0`
   * sobreviveu VERDE ao ataque de 10/08 porque nada cobrava o que a tela MOSTRA
   * — só quais ids ela lista. Um índice de 100 linhas sem um verbatim é um
   * catálogo, não uma resposta: quem lê teria de abrir id por id.
   */
  ok('CUSTO ↓: a CLI imprime o verbatim das primeiras de CADA seção, e não só o índice',
    (() => {
      const saida = execFileSync(
        process.execPath,
        [join(ROOT, 'research/tools/check-evidence.mjs'), '--pergunta', FISGADA],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
      );
      const r = perguntar(FISGADA);
      const gavetas = r.secoes.filter((s) => s.tipo === 'gaveta').length;
      return (saida.match(/verbatim:/g) ?? []).length >= 2 * gavetas;
    })(),
    'a saída virou índice puro — DETALHE_ROTEADO foi a zero');
  {
    const saida = execFileSync(
      process.execPath,
      [join(ROOT, 'research/tools/check-evidence.mjs'), '--pergunta', FISGADA],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    const r = perguntar(FISGADA);
    const tela = [...r.idsMostrados];
    const faltando = tela.filter((i) => !saida.includes(i));
    /**
     * A DICA CARREGA O DIAGNÓSTICO, e não só a moral da história.
     *
     * Este caso reprovou em 19/08/2026 na Vercel e passava em toda máquina local
     * — inclusive num clone limpo e sob Node 22 e 26. A mensagem antiga dizia o
     * que o defeito SIGNIFICA e nada do que ele É, então cada rodada de
     * investigação custava um deploy inteiro para descobrir um número.
     *
     * O que está aqui é o mínimo que separa as hipóteses vivas: o tamanho da
     * saída (a mesma execução relatou 22,8 kB lá contra 28,4 kB aqui), quantos
     * ids a tela calculou, quais faltaram, e o começo da saída — que revela de
     * imediato se a pergunta chegou íntegra ao subprocesso, já que ela carrega
     * acento e viaja por `argv`.
     */
    ok('CUSTO: e a CLI imprime a tela INTEIRA — todo id de `tela` aparece na saída',
      faltando.length === 0,
      'calcular sem imprimir faz o canário passar por linha que não está na tela'
      + ` · saída ${Buffer.byteLength(saida, 'utf8')} B`
      + ` · tela ${tela.length} ids, faltando ${faltando.length}: ${faltando.slice(0, 15).join(' ')}`
      + ` · primeiras linhas da CLI: ${JSON.stringify(saida.split('\n').slice(0, 4).join(' | ').slice(0, 400))}`);
  }
}

// ── O BYTE NUL, que fez `grep` mentir em silêncio por três rodadas ───────────
{
  const bytes = readFileSync(join(ROOT, 'research/tools/roteador.mjs'));
  ok('roteador.mjs não tem byte NUL — com ele, `grep` devolve ZERO linhas sem avisar',
    !bytes.includes(0),
    'o separador de chave do memo voltou a ser um NUL literal; use a sequência \\u0000');
}

// ═════════════════════════════════════════════════════════════════════════════

if (falhas > 0) {
  console.error(`\n✗ ${falhas} de ${total} casos falharam em secoes.test.mjs`);
  process.exit(1);
}
console.log(`\n✓ secoes.test.mjs: ${total} casos sobre ${claims.length} claims reais`);
process.exit(0);
