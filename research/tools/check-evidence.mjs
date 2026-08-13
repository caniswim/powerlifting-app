#!/usr/bin/env node
/**
 * Resolve ids de claim citados por um agente.
 *
 * Existe porque a avaliação da base tinha o mesmo defeito que a base tinha antes
 * do `check-claims.mjs`: um agente escrevia "sustentado por V014-03, V052-11" e
 * ninguém conferia se aqueles ids existiam. Id inventado é indistinguível de id
 * real numa string, e uma medição que aceita evidência fabricada mede o agente,
 * não a base.
 *
 * Aqui a citação vira consulta: ou o id resolve para uma claim de verdade, e ela
 * é impressa para o julgador ler, ou o id não existe e isso aparece em letras
 * garrafais. O julgador não precisa confiar em quem respondeu.
 *
 * Também aceita `--grep <termo>` para o caminho inverso — descobrir se algo está
 * na base antes de declarar ausente —, porque a distinção entre "ninguém disse"
 * e "está lá e não foi achado" governa consertos opostos e é a mais fácil de
 * errar.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE MUDOU EM 09/08/2026, E POR QUÊ
 *
 * A `MEDICAO-02.md` mediu que **7 de 7** respostas não-`bem` falharam pelo mesmo
 * defeito: declararam ausente o que a base tem, com id e `param` na mão. O
 * `--grep` era regex literal sobre `claim` e `verbatim`, e esse é exatamente o
 * instrumento que erra `six days a week` quando se digitou `six times`.
 *
 * Quatro coisas entraram, todas em `busca.mjs`, e nenhuma delas pede esforço do
 * agente:
 *
 *   1. o literal passou a casar TODO campo (inclusive `params.name`, onde
 *      `freq_supino` mora) — e o que casou fora da prosa sai numa seção própria,
 *      para nenhuma contagem antiga mudar em silêncio;
 *   2. resultado POBRE ou VAZIO dispara a vizinhança: busca por raiz e por
 *      número, ancorada nos poucos resultados literais;
 *   3. a vizinhança vem com os termos que o CANAL usa naquele tópico, porque o
 *      problema é não saber a palavra;
 *   4. com filtro ativo, cada filtro é removido em separado — e os de segurança
 *      também são removidos TODOS JUNTOS, porque no caso Q11 tirar um por vez
 *      não revela nada (a claim é barrada pelo outro) e a saída diria, com ar de
 *      rigor, que o filtro não escondia coisa alguma.
 *
 * Uso:
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE MUDOU EM 10/08/2026 — `--pergunta`, e a porta de entrada trocou
 *
 * A camada de 09/08 reprovou no ataque cego, e o diagnóstico foi que ela estava
 * resolvendo *pergunta → texto* um problema que a base já resolvia: existe um
 * vocabulário FECHADO de 74 tópicos, e no caso em que a busca livre errou feio
 * (`descanso-entre-series`) o `--topic` devolvia a resposta na hora.
 *
 * `--pergunta` resolve **pergunta → tópico → claims**. O texto livre desceu um
 * nível: deixou de ser a porta e virou a ORDENAÇÃO dentro do tópico roteado. Ver
 * `research/tools/roteador.mjs` e `research/kb/RECUPERACAO.md` §4.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE MUDOU EM 11/08/2026 — `--topicos`, e ela é a porta PRINCIPAL
 *
 * `--pergunta` é determinística e é a porta que o `check:kb` consegue medir,
 * porque não há chave de API neste repositório. Mas quem consome esta base em
 * produção é um agente de conversa, ou seja, um MODELO — e um modelo não precisa
 * de heurística nenhuma para escolher uma gaveta: ele precisa VER as 74 com a
 * glosa e o tamanho, e escolher. `--topicos` é essa lista, enxuta o bastante
 * para caber num prompt, com o comando pronto ao lado de cada gaveta.
 *
 * As duas portas leem o MESMO artefato (`research/kb/GLOSSARIO-TOPICOS.json`).
 * Se fossem dois, divergiriam em silêncio — modo de falha nº 3 desta casa.
 *
 * Uso:
 *   node research/tools/check-evidence.mjs V014-03 V052-11 …
 *   node research/tools/check-evidence.mjs --topicos            # as 74 gavetas
 *   node research/tools/check-evidence.mjs --topicos --verbose  # com termos de entrada
 *   node research/tools/check-evidence.mjs --pergunta "quanto descansar entre as séries?"
 *   node research/tools/check-evidence.mjs --pergunta "…" --topic agacho   # gaveta forçada
 *   node research/tools/check-evidence.mjs --grep "training max"
 *   node research/tools/check-evidence.mjs --busca "quanto baixar o peso por RPE"
 *   node research/tools/check-evidence.mjs --topic profundidade --modo prescricao
 *   node research/tools/check-evidence.mjs --topic agacho --limit 0   # sem corte
 *   node research/tools/check-evidence.mjs --genero review-de-programa --modo prescricao
 *   node research/tools/check-evidence.mjs --vocab frequencia
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GENEROS, carregarGeneroPorRef, carregarTopicos } from './kb.mjs';
import {
  recuperar, indexar, vocabularioDoTopico, carregarVocabulario,
  PISO_POBRE, TETO_VIZINHANCA, DETALHE_VIZINHANCA,
} from './busca.mjs';
import {
  responder, perfilarTopicos, assinaturaDoTopico, termosDaPergunta, DETALHE_ROTEADO,
  MAX_TOPICOS, FRACAO_DO_MELHOR,
} from './roteador.mjs';
import { carregarGlossario, indexarGlossario, catalogoDeTopicos } from './glossario.mjs';
import {
  parsearEndereco, toleranciaDaGrade, resolverEndereco, indexarPorFonte,
} from './enderecos.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};

const topico = arg('--topic');
const modo = arg('--modo');
const scope = arg('--scope');
const tier = arg('--tier');

/**
 * `--busca` é `--grep` com o piso no infinito: a vizinhança sai SEMPRE, mesmo
 * que o literal já tenha devolvido muito. Existe porque as duas perguntas são
 * diferentes — `--grep` pergunta *"quem diz exatamente isto?"* e `--busca`
 * pergunta *"do que a base fala quando eu falo assim?"* — e porque um agente
 * que já desconfia de estar procurando a palavra errada não deveria ter de
 * fingir um resultado pobre para conseguir ajuda.
 */
const buscaTermo = arg('--busca');

/**
 * `--pergunta` é a PORTA DE ENTRADA de 10/08/2026, e ela não é mais uma variação
 * de `--grep`.
 *
 * `--grep` e `--busca` resolvem *pergunta → texto*. `--pergunta` resolve
 * **pergunta → tópico → claims**: o alvo é o vocabulário FECHADO de 74 tópicos
 * do `PROTOCOLO-EXTRACAO.md`, e o texto livre só entra depois, para ORDENAR
 * dentro do que foi roteado. Ver o cabeçalho de `roteador.mjs` para o porquê, e
 * o `RECUPERACAO.md` §4 para a medição.
 *
 * As duas portas continuam existindo porque respondem a perguntas diferentes:
 * `--grep` é *"quem diz exatamente isto?"* e continua sendo o instrumento certo
 * para conferir uma citação; `--pergunta` é *"do que a base fala quando eu
 * pergunto isto?"*, que é o que um agente respondendo ao atleta quer.
 */
const perguntaTermo = arg('--pergunta');
const grepTermo = arg('--grep') ?? buscaTermo;
const PISO = buscaTermo && !arg('--grep') ? Infinity : Number(arg('--piso') ?? PISO_POBRE);
const VIZINHOS = Number(arg('--vizinhos') ?? TETO_VIZINHANCA);
const vocabPedido = arg('--vocab');

/**
 * `--topicos` é a PORTA A: as 74 gavetas com a glosa de uma linha e o tamanho.
 * Não roteia nada — mostra o alvo e deixa quem lê escolher. É a porta que vale
 * em produção, porque quem lê é um modelo.
 */
const listarTopicos = process.argv.includes('--topicos');
const VERBOSE_TOPICOS = process.argv.includes('--verbose');

/**
 * `--genero` filtra pela propriedade do VÍDEO, não da claim, resolvendo `src`
 * contra os manifestos. É o que transforma "o que revisar" de julgamento em
 * consulta: `--genero review-de-programa --modo prescricao` devolve, hoje, as
 * exatas claims em que o imperativo de outra pessoa foi gravado como ordem do
 * canal. Sem isto o campo seria decorativo — um dado que só o compilador lê é
 * um dado que ninguém audita.
 *
 * Valor fora do enumerado sai com a lista e código 2, e não com zero resultados:
 * "0 claims para genero=review" e "esse gênero não existe" mandam consertos
 * opostos, e a segunda mensagem é a que um typo produz.
 */
const genero = arg('--genero');
if (genero && !GENEROS.has(genero)) {
  console.error(`--genero "${genero}" não existe. Os que existem: ${[...GENEROS].join(', ')}`);
  process.exit(2);
}
const GENERO_POR_REF = carregarGeneroPorRef(ROOT);

/**
 * O DEFAULT DE `--limit`, e por que 120.
 *
 * O default era 40, calibrado para uma base que não existe mais: com 6.909
 * claims em 74 tópicos, 62 dos 74 tópicos passavam de 40 e a saída padrão era
 * quase sempre um pedaço. O aviso de corte existia, mas cabia numa linha no meio
 * do cabeçalho, e "40 de 990" lido de passagem vira "eu vi o assunto".
 *
 * 120 é a MEDIANA do tamanho dos tópicos hoje. É o único número não arbitrário
 * disponível: metade dos tópicos sai completa, e o outro lado sai cortado mas com
 * um aviso que não dá para não ver. Aumentar até cobrir `agacho` (990 claims,
 * ~6.000 linhas) não é opção — despejar isso no contexto de um agente destrói a
 * consulta seguinte, e um corte anunciado é melhor do que um contexto estourado.
 *
 * Se a base crescer, este número deve ser recalculado, não chutado: a mediana
 * sai de contar `topic` em `research/extract/*.jsonl`.
 *
 * `--limit 0` desliga o corte.
 */
const LIMITE_PADRAO = 120;
const limiteArg = arg('--limit');
const LIMITE = limiteArg === null ? LIMITE_PADRAO : Number(limiteArg);
if (!Number.isFinite(LIMITE) || LIMITE < 0) {
  console.error(`--limit "${limiteArg}" não é número ≥ 0 (use 0 para "sem corte")`);
  process.exit(2);
}
const SEM_CORTE = LIMITE === 0;

const ids = process.argv
  .slice(2)
  .filter((a) => /^[A-Z]\d{3}-\d+$/.test(a));

/**
 * ENDEREÇOS `[Rnn @mm:ss]` — o formato que esta ferramenta descartava em SILÊNCIO.
 *
 * O `PROGRAMA.md` não cita a base por id: cita por endereço. O filtro acima só
 * reconhece `Vnnn-nn`, então `check-evidence.mjs "R79 @03:35" V089-25` imprimia
 * "Resolvendo 1 id(s)" — o endereço ia para o lixo sem uma linha de aviso, e é
 * por isso que cinco endereços errados do §1.2 sobreviveram a seis ondas.
 *
 * A regra de resolução (e por que a tolerância é medida da grade, não chutada)
 * está inteira no cabeçalho de `enderecos.mjs`, com a medição que a sustenta.
 */
const enderecos = process.argv
  .slice(2)
  .map(parsearEndereco)
  .filter(Boolean);

if (!existsSync(EXTRACT)) {
  console.error(`✗ ${EXTRACT} não existe`);
  process.exit(2);
}

const claims = [];
for (const f of readdirSync(EXTRACT).filter((x) => x.endsWith('.jsonl')).sort()) {
  const linhas = readFileSync(join(EXTRACT, f), 'utf8').split('\n');
  for (const linha of linhas) {
    if (!linha.trim()) continue;
    try {
      claims.push(JSON.parse(linha));
    } catch {
      /* o check-claims.mjs é quem reclama de JSON quebrado; aqui só não trava */
    }
  }
}
const porId = new Map(claims.map((c) => [c.id, c]));

const mostrar = (c) => {
  const cond = c.conditions?.length ? `  condições: ${c.conditions.join(', ')}` : '';
  const conf = c.conflicts?.length ? `  conflita: ${c.conflicts.join(', ')}` : '';
  const par = (c.params ?? [])
    .map((p) => `${p.name}=${p.value}${p.unit ? ' ' + p.unit : ''} [${p.frame}]`)
    .join('  ');
  const g = GENERO_POR_REF.get(c.src);
  return (
    `${c.id}  ${c.src}@${c.at}  tier:${c.tier} scope:${c.scope ?? '—'} modo:${c.modo ?? '—'} ` +
    `genero:${g ?? '—'} ${c.certainty ?? ''}\n` +
    `  tópicos: ${(c.topic ?? []).join(', ')}\n` +
    `  ${c.claim}\n` +
    (par ? `  params: ${par}\n` : '') +
    `  verbatim: "${c.verbatim ?? ''}"\n` +
    (cond ? `${cond}\n` : '') +
    (conf ? `${conf}\n` : '')
  );
};

/** A linha de índice: o que basta para decidir QUAL id abrir. Um único
 *  formatador compacto no repositório, pela mesma razão que `mostrar` é um só. */
const compacto = (c) => {
  const g = GENERO_POR_REF.get(c.src);
  const p = (c.params ?? []).map((x) => `${x.name}=${x.value}`).join(' ');
  return `    ${c.id.padEnd(9)} ${String(c.scope ?? '—').padEnd(7)} ${String(c.modo ?? '—').padEnd(21)} ${String(g ?? '—').padEnd(18)} ${(c.claim ?? '').slice(0, 74)}${p ? `  [${p.slice(0, 40)}]` : ''}`;
};

let saiuRuim = false;

if (ids.length > 0) {
  console.log(`\nResolvendo ${ids.length} id(s) contra ${claims.length} claims:\n`);
  for (const id of ids) {
    const c = porId.get(id);
    if (!c) {
      console.log(`✗ ${id}  NÃO EXISTE — esta citação é fabricada, descarte a evidência\n`);
      saiuRuim = true;
    } else {
      console.log(`✓ ${mostrar(c)}`);
    }
  }
}

if (enderecos.length > 0) {
  const { passo, tolerancia } = toleranciaDaGrade(claims);
  const porSrc = indexarPorFonte(claims);

  console.log(
    `\nResolvendo ${enderecos.length} endereço(s) [Rnn @mm:ss] contra ${claims.length} claims.`,
  );
  console.log(
    `Grade de \`at\` medida no corpus: passo mediano de ${passo} s; `
      + `tolerância = metade = ±${tolerancia} s.`,
  );
  console.log(
    'O endereço cita o instante FALADO e a claim guarda o início do BLOCO: '
      + 'exigir igualdade\nseria condenar a maioria dos endereços corretos. '
      + 'Leia o `scope` e o `modo` abaixo — o\ndefeito mais caro destes endereços '
      + 'nunca foi o segundo errado, foi o rótulo errado.\n',
  );

  for (const e of enderecos) {
    const r = resolverEndereco(e, porSrc.get(e.src), tolerancia);

    if (r.veredito === 'sem-fonte') {
      console.log(`✗ ${e.original}  FONTE ${e.src} NÃO EXISTE na base — descarte a evidência\n`);
      saiuRuim = true;
      continue;
    }

    if (r.veredito === 'fora-de-faixa') {
      const perto = r.proximas
        .map((x) => `${x.claim.src}@${x.claim.at} (${x.claim.id}, ${x.distancia}s)`)
        .join(' · ');
      console.log(
        `✗ ${e.original}  FORA DE FAIXA — nenhuma claim de ${e.src} a ±${tolerancia} s desta marca.`,
      );
      console.log(`    mais próximas: ${perto}`);
      console.log(
        '    Isto NÃO é o mesmo que "fabricado": a claim que o texto cita pode existir e\n'
          + '    estar em outra marca. Confira as vizinhas acima e corrija o endereço para o id.\n',
      );
      saiuRuim = true;
      continue;
    }

    const exato = r.dentro.some((x) => x.distancia === 0);
    console.log(
      `✓ ${e.original}  →  ${r.dentro.length} claim(s) no bloco `
        + `(${exato ? 'marca exata' : `a ${r.dentro[0].distancia}s da marca citada`}):`,
    );
    for (const x of r.dentro) console.log(compacto(x.claim));
    console.log(
      '    ⚠️ O endereço resolve. Isso NÃO garante que o texto que o cita atribuiu o\n'
        + '    `scope` e o `modo` certos, nem que citou a claim certa DENTRO do bloco.\n',
    );
  }
}

const VOCAB = carregarVocabulario(ROOT);
const GLOSSARIO_DOC = carregarGlossario(ROOT);
const GLOSSARIO = indexarGlossario(GLOSSARIO_DOC, termosDaPergunta);

// ── `--vocab <topico>`: o índice escrito à mão, mais o que o corpus mostra ────
//
// Duas listas lado a lado de propósito. A de cima é julgamento humano com nota
// de procedência; a de baixo é contagem. Quando as duas discordam, é a de cima
// que está velha — e é assim que se descobre que uma seção precisa de revisão.
if (vocabPedido) {
  const TOPICOS = carregarTopicos(ROOT);
  if (!TOPICOS.has(vocabPedido)) {
    console.error(`--vocab "${vocabPedido}" não é tópico do vocabulário fechado do PROTOCOLO-EXTRACAO.md`);
    process.exit(2);
  }
  const e = VOCAB.entradas.find((x) => x.topico === vocabPedido);
  console.log(`\nVOCABULÁRIO de "${vocabPedido}"\n`);
  if (e) {
    console.log(`  escrito à mão (research/kb/VOCABULARIO.md):`);
    console.log(`     usa .......: ${e.usa.map((t) => `\`${t}\``).join(' · ')}`);
    if (e.naoUsa.length) console.log(`     NÃO usa ...: ${e.naoUsa.map((t) => `\`${t}\``).join(' · ')}  (casam zero na base — a nota do arquivo diz por quê)`);
  } else {
    console.log('  research/kb/VOCABULARIO.md ainda NÃO tem seção para este tópico');
    console.log('  (64 dos 74 tópicos não têm; a lista abaixo é derivada e não substitui a leitura)');
  }
  const v = vocabularioDoTopico(indexar(claims), vocabPedido, 16, new Set([...TOPICOS].flatMap((t) => t.split('-'))));
  console.log(`\n  derivado do corpus agora (${v.claims} claims neste tópico):`);
  console.log(`     termos ....: ${v.unigramas.map((x) => `${x.termo}(${x.claims})`).join(' ')}`);
  console.log(`     expressões : ${v.bigramas.map((x) => `${x.termo}(${x.claims})`).join(' ')}\n`);
  process.exit(0);
}

// ── `--pergunta`: PERGUNTA → TÓPICO → CLAIMS ─────────────────────────────────
//
// A saída é desenhada para a leitura que ela precisa induzir, e cada peça dela
// existe contra um erro medido:
//   · os tópicos saem com o PORQUÊ (que palavra, em quantas claims do tópico,
//     em quantas da base) — roteamento sem justificativa é a mesma expansão
//     opaca que injetou `supino 6x/semana` numa pergunta sobre sono;
//   · o tamanho do tópico sai ao lado do nome, porque `agacho` tem 990 e ver
//     40 delas não é ver o assunto;
//   · `declarado` × `afim` sai marcado, porque afirmar que uma claim está num
//     tópico em que ela não está é mentira barata e cara de descobrir;
//   · "não mapeia" sai em banner, com as duas variedades separadas.
const linhaGrossa = '━'.repeat(74);

function imprimirRoteamento(texto, { comoComplemento = false } = {}) {
  const TOPICOS = carregarTopicos(ROOT);
  if (topico && !TOPICOS.has(topico)) {
    console.error(`--topic "${topico}" não é tópico do vocabulário fechado do PROTOCOLO-EXTRACAO.md`);
    process.exit(2);
  }
  const r = responder(claims, texto, {
    topicos: TOPICOS,
    glossario: GLOSSARIO,
    vocabulario: VOCAB.entradas,
    forcar: topico ? [topico] : [],
  });

  console.log(`\n${linhaGrossa}`);
  console.log(`  PERGUNTA → TÓPICO → CLAIMS${comoComplemento ? '  (a mesma consulta, pela porta nova)' : ''}`);
  console.log(`  "${texto}"`);
  console.log(linhaGrossa);
  console.log(`  palavras de assunto: ${r.termos.join(' ') || '(nenhuma)'}`);
  if (r.desconhecidos.length > 0) {
    console.log(`  ⚠  ${r.desconhecidos.length} NÃO existe(m) em claim nenhuma: ${r.desconhecidos.join(', ')}`);
  }

  if (r.rotas.length === 0) {
    console.log(`\n  ⚠  ESTA PERGUNTA NÃO MAPEIA PARA NENHUM DOS ${TOPICOS.size} TÓPICOS.`);
    console.log(r.motivo === 'fora-de-dominio'
      ? '     FORA DE DOMÍNIO: nenhuma palavra de assunto desta pergunta aparece em\n'
        + '     claim nenhuma. A base não fala disto, e dizer isso é a resposta certa.'
      : '     SEM ASSUNTO: as palavras existem na base, mas nenhuma DISTINGUE um tópico\n'
        + '     — são palavras que aparecem em todo lugar. Reescreva a pergunta com o\n'
        + '     substantivo do assunto (o exercício, a variável, o equipamento), ou use\n'
        + '     --topic <tópico> para escolher a gaveta você mesmo.');
    if (r.candidatos.length > 0) {
      console.log(`\n     os mais próximos, TODOS abaixo do piso de ${r.piso}:`);
      for (const c of r.candidatos.slice(0, 5)) {
        console.log(`       ${c.topico.padEnd(24)} ${c.score.toFixed(2)}  (${c.porQue.slice(0, 3).map((x) => x.termo).join(', ')})`);
      }
    }
    console.log('\n     ISTO NÃO É "A BASE NÃO TEM". É "esta pergunta não achou a gaveta".');
    console.log('     node research/tools/check-evidence.mjs --topic <um dos 74> --limit 0');
    console.log(`${linhaGrossa}\n`);
    return r;
  }

  console.log(`\n  ROTEOU PARA ${r.rotas.length} de ${TOPICOS.size} tópicos do vocabulário FECHADO,`);
  console.log('  e CADA UM GANHA A PRÓPRIA SEÇÃO abaixo — nenhuma gaveta divide orçamento com outra.');
  for (const t of r.rotas) {
    const grande = t.claims > LIMITE_PADRAO ? '  ← GRANDE' : '';
    console.log(`     ${t.topico.padEnd(24)} score ${t.score.toFixed(2)}  ·  ${String(t.claims).padStart(4)} claims etiquetadas${grande}`);
  }

  /**
   * ── A GAVETA QUE PONTUOU E FICOU DE FORA — e ela sai IMPRESSA ─────────────
   *
   * `rotear()` sempre calculou `candidatos` (os 8 primeiros com score), e até
   * 12/08/2026 essa lista só era impressa no ramo do "NÃO MAPEIA". Ou seja:
   * quando a pergunta não achava gaveta nenhuma, a tela dizia o que quase
   * achou; quando ela achava três de quatro, a tela ficava CHEIA e MUDA. É o
   * pior dos dois, e está registrado no `RUNBOOK.md` §8.37: *"o perigo não é
   * responder errado, é responder com ar de completa"*.
   *
   * O caso medido é o do peitoral deste atleta. Em
   * `fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?`
   * abrem `peito` (2,26), `supino` (1,71) e `dor` (1,64); **`lesao` pontua 0,74,
   * fica ACIMA do piso de 0,65 e mesmo assim não abre** — perde na fração do
   * primeiro colocado (0,4 × 2,26 = 0,90). Três das cinco claims que carregam o
   * limiar de 2–3/10 estão em `lesao`, e `dor` ainda declara
   * `naoConfundirCom: autorregulacao`, que também fica fechada. Nada disso
   * aparecia na tela.
   *
   * Isto é DIAGNÓSTICO, não recuperação: nenhuma claim entra ou sai por causa
   * deste bloco. Ele não toca `responder()` nem `idsMostrados`, que é o que os
   * canários medem — a tela ganha o aviso sem que a medida se mexa.
   */
  {
    const abertos = new Set(r.rotas.map((x) => x.topico));
    // O corte e o número de vagas vêm de `roteador.mjs` porque esta é a CLI que
    // IMPRIME o roteamento, não a trava que o verifica: repetir 0,4 aqui criaria
    // um segundo lugar para divergir, que é o modo de falha nº 3 desta casa.
    const corte = (r.rotas[0]?.score ?? 0) * FRACAO_DO_MELHOR;
    const fechados = r.candidatos.filter((c) => !abertos.has(c.topico) && c.score > 0);
    // Quem uma gaveta ABERTA declara que se confunde com ela, e que ficou de
    // fora: é o único canal em que a base diz, por escrito, que faltou olhar ali.
    const avisadas = new Map();
    for (const a of abertos) {
      for (const b of GLOSSARIO.confusao?.get(a) ?? []) {
        if (abertos.has(b)) continue;
        if (!avisadas.has(b)) avisadas.set(b, []);
        avisadas.get(b).push(a);
      }
    }
    /**
     * A GAVETA TEM DE TER PONTUADO SOZINHA PARA SER NOMEADA — a mesma condição
     * que `rotear()` exige para dar o bônus de `naoConfundirCom`, e pelo mesmo
     * motivo: *o aviso levanta um candidato que já existe, nunca inventa um.*
     * Aplicar aqui uma regra diferente da que a camada aplica lá seria criar um
     * segundo critério para divergir do primeiro.
     *
     * Sem isso a tela vira ruído, e foi medido: `descanso-entre-series` declara
     * que se confunde com `sono`, então *quanto descansar entre as séries* — a
     * pergunta mais bem roteada desta base, um tópico só, score 3,45 — passava a
     * imprimir `sono` como gaveta "não lida". Trocar uma tela muda por uma tela
     * de ruído não é conserto.
     *
     * Entram duas coisas, e as duas pontuaram por conta própria:
     *   · o candidato ACIMA DO PISO que perdeu a vaga no corte — pela definição
     *     da própria camada, `score >= piso` quer dizer "esta pergunta é sobre
     *     esta gaveta"; perder para um primeiro colocado mais forte esconde isso
     *     mas não o desfaz. É o `lesao` a 0,74 da pergunta do peitoral;
     *   · o candidato que uma gaveta ABERTA declara como confundível — o
     *     `naoConfundirCom` é o único canal em que a base diz, por escrito, que
     *     quem procura ali também tem de olhar aqui.
     *
     * LIMITAÇÃO CONHECIDA, e ela é a mesma de `rotear()`: `autorregulacao`
     * etiqueta V001-06 e V138-19 — duas das cinco claims de limiar de dor — e
     * NÃO é nomeada na pergunta da fisgada, porque não casou nada sozinha.
     * Gaveta que a pergunta não toca por canal nenhum continua invisível às duas
     * portas. Está registrado no RECUPERACAO.md §21.
     */
    const nomes = fechados
      .filter((c) => c.score >= r.piso || avisadas.has(c.topico))
      .slice(0, 5);
    if (nomes.length > 0) {
      console.log('\n  ⚠  GAVETAS QUE PONTUARAM E **NÃO** ABRIRAM — a tela abaixo não as inclui.');
      console.log(`     Vagas: ${r.rotas.length} de ${MAX_TOPICOS} · corte = ${Math.round(FRACAO_DO_MELHOR * 100)} % do 1º lugar`
        + ` = ${corte.toFixed(2)} · piso de mapeamento = ${r.piso}`);
      for (const c of nomes) {
        const quem = avisadas.get(c.topico);
        const porQue = c.score >= r.piso ? 'acima do piso, perdeu a vaga no corte' : 'abaixo do piso';
        console.log(`       ${c.topico.padEnd(22)} ${c.score.toFixed(2)}  ${porQue}`
          + `${quem ? `  ←  ${quem.join(' e ')} declara(m) "não confundir com ${c.topico}"` : ''}`);
        console.log(`         abrir mesmo assim: node research/tools/check-evidence.mjs --pergunta ${JSON.stringify(texto)} --topic ${c.topico}`);
      }
      console.log('     Uma tela cheia não é uma tela completa. Estas gavetas existem e não foram lidas.');
    }
  }

  /**
   * ── A TELA, E ELA É UMA SEÇÃO POR GAVETA ──────────────────────────────────
   *
   * Não há mais orçamento único a repartir entre as gavetas abertas. Cada uma
   * entrega as SUAS melhores claims, com o ledger e a página ao lado DELA, num
   * bloco rotulado — que é literalmente o que `--topic <gaveta>` já produzia,
   * um de cada vez.
   *
   * **O que é impresso aqui é exatamente `r.tela`**, o mesmo objeto que
   * `telaDaResposta()` devolve e que o `check-canarios.mjs` e o
   * `check-rotas.mjs` contam. Até 12/08 havia duas contas — o `telaDe()`
   * cortava em 40 e esta função imprimia 68 linhas — e a divergência produziu um
   * erro de relatório. Agora há uma só, e ela mora em `roteador.mjs`.
   *
   * A claim que está em DUAS gavetas abertas aparece nas DUAS seções: é o preço
   * da invariante de não-diluição, e sai como um ponteiro de uma linha para a
   * seção onde ela já saiu inteira — o custo em bytes é a linha, não a claim.
   */
  console.log(`\n  ${r.tela.length} linha(s) em ${r.secoes.length} seção(ões), ordenadas pela sua pergunta DENTRO de cada gaveta`);
  console.log('  (raridade recontada dentro do tópico: `squat` não distingue nada entre 990).');
  console.log(`  ORÇAMENTO: até ${r.orcamento.porSecao} claims por seção × até ${r.orcamento.secoes} seções.`);
  console.log('  NENHUMA seção rouba vaga de outra — acrescentar gaveta só ACRESCENTA bloco.');
  if (r.rotasCortadas.length > 0) {
    console.log(`  ⚠  ${r.rotasCortadas.length} seção(ões) CORTADA(S) INTEIRA(S) pelo teto de seções: `
      + `${r.rotasCortadas.map((t) => t.topico).join(', ')} — abra com --topic <nome>.`);
  }
  console.log('  NENHUM filtro de modo/scope/tier foi aplicado — filtro de segurança estreita');
  console.log('  a saída, não a busca, e foi ele que escondeu V033-03/04/05 da Q11.');

  const jaSaiu = new Map();
  r.secoes.forEach((s, iSecao) => {
    const cab = s.tipo === 'param'
      ? `SEÇÃO ${iSecao + 1}/${r.secoes.length} · O NOME DO DADO · ${s.total} claim(s) com \`param\` que nomeia 2+ palavras da pergunta`
      : `SEÇÃO ${iSecao + 1}/${r.secoes.length} · GAVETA \`${s.topico}\`${s.forcado ? ' (forçada por --topic)' : ''}`
        + `  ·  score ${s.score.toFixed(2)}  ·  ${s.principais.length} de ${s.daGaveta} claims etiquetadas`;
    console.log(`\n${linhaGrossa}`);
    console.log(`  ${cab}`);
    if (s.tipo === 'gaveta') {
      for (const w of (s.porQue ?? []).slice(0, 3)) {
        const onde = w.canal === 'corpus'
          ? `em ${w.dentro} das ${w.deQuantas} claims do tópico, ${w.naBase} na base`
          : w.canal;
        const veio = w.comoNaBase && w.comoNaBase !== w.termo ? `${w.termo} → ${w.comoNaBase}` : w.termo;
        console.log(`     abriu por ${String(w.peso.toFixed(2)).padStart(5)}  ${veio.padEnd(26)} ${onde}`);
      }
      console.log(`     a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic ${s.topico} --limit 0`
        + `${s.daGaveta <= LIMITE_PADRAO ? '   (cabe numa leitura)' : ''}`
        + `${s.cortou > 0 ? `   ·  ${s.cortou} desta seção ficaram fora do corte de ${r.orcamento.porSecao}` : ''}`);
    } else {
      console.log('     Este canal lê o dado TIPADO e não a prosa, e por isso não passa por gaveta');
      console.log('     nenhuma: foi ele que achou V033-03 (peso por RPE) quando a prosa dizia "subir"');
      console.log('     e a pergunta dizia "baixar".');
    }
    console.log(linhaGrossa);

    s.principais.forEach((x, i) => {
      const antes = jaSaiu.get(x.c.id);
      const etiqueta = s.tipo === 'param'
        ? `nomeia: ${(x.pecas ?? []).join(' + ')}`
        : (x.comoEntrou === 'afim' ? `${s.topico}(afim)` : s.topico);
      if (antes) {
        console.log(`  ${String(i + 1).padStart(2)}º  ${x.c.id}  ← já saiu inteira na seção \`${antes}\` (a claim é das duas gavetas)`);
        return;
      }
      jaSaiu.set(x.c.id, s.chave);
      if (i < DETALHE_ROTEADO) {
        console.log(`  ${String(i + 1).padStart(2)}º  ${etiqueta}`);
        console.log(`      ${mostrar(x.c).trimEnd().split('\n').join('\n      ')}\n`);
      } else {
        console.log(`${compacto(x.c)}`);
      }
    });

    /**
     * O LEDGER DA SEÇÃO, e ele é o único canal que não casa palavra nenhuma: a
     * claim chega porque a prescrição que está NESTA seção declara, no campo
     * `conditions`, que depende dela. Prescrição sem a condição que a desarma é
     * a forma perigosa de acertar.
     */
    if (s.ligacoes.length > 0) {
      console.log(`\n     O QUE A PRESCRIÇÃO DESTA SEÇÃO DECLARA — ${s.ligacoes.length} claim(s) por \`conditions\`/\`conflicts\`:`);
      for (const v of s.ligacoes) {
        jaSaiu.set(v.c.id, s.chave);
        console.log(`${compacto(v.c)}   ← ${v.vinculo} ${v.deQuem}`);
      }
    }
    /**
     * A PÁGINA AO LADO DESTA SEÇÃO. O extrator emitiu as claims na ordem em que
     * o assunto foi dito, então a de ao lado costuma ser a que completa: a
     * condição que desarma a prescrição, ou o número que a frase prometeu.
     */
    if (s.lado.length > 0) {
      console.log(`\n     A PÁGINA AO LADO — ${s.lado.length} claim(s) adjacentes, no MESMO vídeo:`);
      for (const v of s.lado) {
        jaSaiu.set(v.c.id, s.chave);
        console.log(`${compacto(v.c)}   ← ao lado de ${v.deQuem}`);
      }
    }
  });
  console.log('');

  const grandes = r.rotas.filter((t) => t.claims > LIMITE_PADRAO);
  if (grandes.length > 0 && r.estreitar.length > 0) {
    console.log(`\n  ⚠  TÓPICO GRANDE: ${grandes.map((t) => `${t.topico} tem ${t.claims}`).join(', ')} claims, e você viu ${r.claims.length}.`);
    console.log('     Cruzar dois tópicos é conjunto — verificável — e estreita de verdade.');
    console.log('     Entre as que saíram, os tópicos que mais aparecem junto:');
    for (const e of r.estreitar) {
      console.log(`       ${e.topico.padEnd(24)} em ${e.n} das ${r.claims.length}`
        + `   →  node research/tools/check-evidence.mjs --pergunta ${JSON.stringify(texto)} --topic ${e.topico}`);
    }
    console.log(`     Ou a gaveta inteira:  node research/tools/check-evidence.mjs --topic ${grandes[0].topico} --limit 0`);
    console.log('');
  }
  return r;
}

/**
 * A PORTA NOVA VEM PRIMEIRO, e quando ela é usada sozinha a saída é só dela.
 * Misturar as duas telas por padrão era refazer o defeito de 09/08 com outro
 * nome: o agente lê a primeira metade e decide.
 */
if (listarTopicos) {
  const TOPICOS = carregarTopicos(ROOT);
  const catalogo = catalogoDeTopicos(GLOSSARIO_DOC, claims);
  const foraDaLista = catalogo.map((c) => c.topico).filter((t) => !TOPICOS.has(t));
  if (foraDaLista.length > 0) {
    console.error(`✗ o glossário lista tópico fora do vocabulário fechado: ${foraDaLista.join(', ')}`);
    process.exit(2);
  }
  const faltando = [...TOPICOS].filter((t) => !catalogo.some((c) => c.topico === t));
  if (faltando.length > 0) {
    console.error(`✗ o glossário não cobre ${faltando.length} dos 74 tópicos: ${faltando.join(', ')}`);
    process.exit(2);
  }
  console.log(`\n${linhaGrossa}`);
  console.log('  AS 74 GAVETAS DESTA BASE — escolha uma e abra');
  console.log(`  ${claims.length} claims · glosas de research/kb/GLOSSARIO-TOPICOS.json`);
  console.log(linhaGrossa);
  const largura = Math.max(...catalogo.map((c) => c.topico.length));
  for (const c of catalogo) {
    console.log(`  ${c.topico.padEnd(largura)}  ${String(c.claims).padStart(4)}  ${c.glosa}`);
    if (VERBOSE_TOPICOS) {
      const e = GLOSSARIO_DOC.topicos.find((x) => x.topico === c.topico);
      console.log(`  ${' '.repeat(largura)}        entrada: ${e.entrada.join(' · ')}`);
      if (c.naoConfundirCom.length) {
        console.log(`  ${' '.repeat(largura)}        não confundir com: ${c.naoConfundirCom.join(', ')}`);
      }
    }
  }
  console.log(`\n  a gaveta inteira ....: node research/tools/check-evidence.mjs --topic <nome> --limit 0`);
  console.log('  ordenada por pergunta: node research/tools/check-evidence.mjs --pergunta "…" --topic <nome>');
  console.log('  o porquê de cada nome: node research/tools/check-evidence.mjs --topicos --verbose\n');
  process.exit(0);
}

if (perguntaTermo) {
  imprimirRoteamento(perguntaTermo);
  if (!grepTermo && !modo && !scope && !tier && !genero) process.exit(0);
}

const filtrando = grepTermo || topico || modo || scope || tier || genero;
if (filtrando) {
  const casarGenero = (c, v) => GENERO_POR_REF.get(c.src) === v;
  const r = recuperar(claims, {
    grep: grepTermo,
    filtros: {
      topic: topico, modo, scope, tier, genero,
    },
    casarGenero,
    piso: PISO,
    teto: VIZINHOS,
    vocabulario: VOCAB.entradas,
  });
  const achados = r.literal;
  const filtro = [
    grepTermo && `/${grepTermo}/i`,
    topico && `topic=${topico}`,
    modo && `modo=${modo}`,
    scope && `scope=${scope}`,
    tier && `tier=${tier}`,
    genero && `genero=${genero}`,
  ]
    .filter(Boolean)
    .join(' · ');
  // Os mesmos filtros, mas na forma de linha de comando — o aviso de corte
  // devolve o comando pronto para copiar, e um comando que o leitor precisa
  // remontar à mão é um comando que ninguém roda.
  const filtroCmd = [
    grepTermo && `--grep ${JSON.stringify(grepTermo)}`,
    topico && `--topic ${topico}`,
    modo && `--modo ${modo}`,
    scope && `--scope ${scope}`,
    tier && `--tier ${tier}`,
    genero && `--genero ${genero}`,
  ]
    .filter(Boolean)
    .join(' ');
  const cortou = !SEM_CORTE && achados.length > LIMITE;
  const mostrados = cortou ? achados.slice(0, LIMITE) : achados;
  const ocultas = achados.length - mostrados.length;

  /**
   * O AVISO DE CORTE, e por que ele é grande.
   *
   * Antes era um parêntese no cabeçalho: `990 claim(s) para topic=agacho
   * (mostrando 40)`. Tecnicamente correto e praticamente invisível — quem lê
   * "40 de 990" de passagem conclui que viu o assunto, e decide com 4 % da
   * evidência achando que decidiu com tudo. Essa é a leitura errada mais cara
   * que esta ferramenta pode induzir, porque ela produz exatamente a confiança
   * que a ferramenta existe para tirar.
   *
   * Então o aviso aparece DUAS vezes — antes da listagem e depois dela, porque
   * saída longa se lê pelas pontas —, diz quantas ficaram fora em vez de quantas
   * entraram, declara que o corte é por ordem de arquivo e não por relevância, e
   * mostra a composição do que sumiu. Ver "ficaram 850 fora, sendo 62
   * prescrições" torna impossível confundir a amostra com o assunto.
   */
  const banner = (titulo) => {
    const linha = '━'.repeat(74);
    const porChave = (fn) => {
      const t = {};
      for (const c of achados.slice(mostrados.length)) {
        const k = fn(c) ?? '—';
        t[k] = (t[k] ?? 0) + 1;
      }
      return Object.entries(t)
        .sort((a, b) => b[1] - a[1])
        .map(([k, n]) => `${k} ${n}`)
        .join(' · ');
    };
    const cmd = ['node research/tools/check-evidence.mjs', filtroCmd, '--limit 0'].join(' ');
    return (
      `\n${linha}\n` +
      `  ⚠  ${titulo}\n` +
      `     VOCÊ ESTÁ VENDO ${mostrados.length} DE ${achados.length}. FICARAM ${ocultas} CLAIMS DE FORA.\n` +
      `     O corte é por ordem de arquivo, NÃO por relevância — as ${ocultas} que\n` +
      `     sumiram não são as menos importantes, são as que vieram depois no disco.\n` +
      `     entre as ocultas, por modo:  ${porChave((c) => c.modo)}\n` +
      `     entre as ocultas, por tier:  ${porChave((c) => c.tier)}\n` +
      `     Para ver tudo:  ${cmd}\n` +
      `     Enquanto não vir tudo, a frase "a base diz X sobre isto" não se sustenta.\n` +
      `${linha}\n`
    );
  };

  const linha = '━'.repeat(74);

  console.log(`\n${achados.length} claim(s) para ${filtro}:`);
  if (grepTermo && r.foraDaProsa.length > 0) {
    console.log(
      `  (${r.prosa.length} casaram em claim/verbatim — a contagem que os relatórios antigos citam — e\n`
      + `   ${r.foraDaProsa.length} casaram SÓ em params/tópico, que o --grep de antes não olhava. As duas estão listadas.)`,
    );
  }
  console.log('');
  if (cortou) console.log(banner('SAÍDA TRUNCADA'));
  for (const c of mostrados) console.log(mostrar(c));
  if (cortou) console.log(banner('SAÍDA TRUNCADA — fim da amostra'));

  /**
   * ── VAZIO E POBRE, SEPARADOS EM VOZ ALTA ──────────────────────────────────
   *
   * `MEDICAO-02` §2.2: `nao-encontravel` e `conteudo-ausente` mandam consertos
   * OPOSTOS — um manda buscar melhor, o outro manda comprar fonte. Quatro das
   * sete respostas ruins mandariam a próxima rodada comprar fonte que já se
   * tem, e §4.4 já orçou uma rodada inteira contra o sintoma errado. Antes
   * daqui, zero e quatro tinham a mesma cara na tela.
   */
  if (r.pobre) {
    const titulo = r.vazio
      ? 'RESULTADO VAZIO — este VOCABULÁRIO não acha. Não é o mesmo que ausência.'
      : `RESULTADO POBRE — ${achados.length} de ${claims.length}, abaixo do piso de ${r.piso}.`;
    console.log(`\n${linha}\n  ⚠  ${titulo}`);
    console.log(r.vazio
      ? '     Zero é o que uma palavra errada produz, e é indistinguível de ausência aqui.\n'
        + '     Precedente (MEDICAO-02): as duas buscas cegas medidas devolveram 4 e 2, não\n'
        + '     zero, e as duas foram lidas como "vi o assunto". Leia a vizinhança antes de\n'
        + '     escrever lacuna de conteúdo.'
      : '     Precedente (MEDICAO-02): `six times` devolveu 4, a resposta concluiu que a base\n'
        + '     só tinha log pessoal, e as duas claims GERAL+prescricao estavam sob `six days a\n'
        + '     week`. Poucos resultados são a BEIRADA do assunto, não o assunto.');
    console.log(linha);

    if (r.expansao.length > 0) {
      console.log('\n  A consulta foi EXPANDIDA pelo research/kb/VOCABULARIO.md:');
      for (const e of r.expansao) {
        console.log(`     ## ${e.topico}  (casou \`${e.gatilho}\`)  →  ${e.termos.map((t) => `\`${t}\``).join(' · ')}`);
      }
      console.log('     (termos emprestados entram com peso baixo: eles desempatam, não decidem)');
    }

    if (r.relaxada.length > 0) {
      console.log(`\n  VIZINHANÇA — ${r.relaxada.length} claim(s) por raiz e por número, ordenadas por raridade`);
      console.log('  do termo, proximidade de tópico e MESMO VÍDEO. As primeiras vêm inteiras; o resto');
      console.log('  é índice — resolva o id que interessar. NENHUM filtro de modo/scope foi aplicado aqui.\n');
      r.relaxada.slice(0, DETALHE_VIZINHANCA).forEach((x, i) => {
        const casou = x.casou.slice(0, 6).join(', ') + (x.casou.length > 6 ? ` …+${x.casou.length - 6}` : '');
        console.log(`  ${String(i + 1).padStart(2)}º  casou: ${casou}${x.perto.length ? `  ·  ${x.perto.join('  ·  ')}` : ''}`);
        console.log(`      ${mostrar(x.c).trimEnd().split('\n').join('\n      ')}\n`);
      });
      if (r.relaxada.length > DETALHE_VIZINHANCA) {
        console.log(`  ${DETALHE_VIZINHANCA + 1}º–${r.relaxada.length}º, em índice:`);
        for (const x of r.relaxada.slice(DETALHE_VIZINHANCA)) console.log(compacto(x.c));
        console.log('');
      }
    }

    /**
     * A Q19 parou DOZE IDS ANTES da claim que respondia, no mesmo vídeo que já
     * estava citando. Estas linhas são a página ao lado — ±3 ids no mesmo `src`
     * a partir do que já está na tela. Sai em índice porque o valor delas é
     * dizer QUAL id abrir, não despejar o conteúdo.
     */
    if (r.vizinhosDeArquivo.length > 0) {
      console.log(`\n  A PÁGINA AO LADO — ${r.vizinhosDeArquivo.length} claim(s) vizinhas, no mesmo vídeo, a até 3 ids`);
      console.log('  do que apareceu acima. A Q19 da MEDICAO-02 parou doze ids antes da resposta,');
      console.log('  no mesmo vídeo que já estava citando.\n');
      for (const v of r.vizinhosDeArquivo) console.log(`${compacto(v.c)}   ← ao lado de ${v.deQuem}`);
    }

    for (const v of r.vizinhanca) {
      const e = VOCAB.entradas.find((x) => x.topico === v.topico);
      console.log(`\n  O QUE O CANAL DIZ EM "${v.topico}" (${v.claims} claims) — a palavra que você não adivinha:`);
      console.log(`     termos ....: ${v.unigramas.map((x) => `${x.termo}(${x.claims})`).join(' ')}`);
      console.log(`     expressões : ${v.bigramas.map((x) => `${x.termo}(${x.claims})`).join(' ')}`);
      console.log(e
        ? `     índice ....: research/kb/VOCABULARIO.md ## ${v.topico} — leia a nota, ela diz por que a busca ingênua falha aqui`
        : `     índice ....: research/kb/VOCABULARIO.md NÃO cobre "${v.topico}" ainda (10 dos 74 tópicos têm seção)`);
    }
    console.log('');
  }

  /**
   * ── O FILTRO COMO SUSPEITO (o caso Q11) ───────────────────────────────────
   *
   * A melhor resposta de disciplina do lote virou `parcial` porque
   * `--modo prescricao --scope GERAL` escondeu V033-03/04/05, que moram em
   * PESSOAL + `fato`. O filtro de segurança é o mesmo filtro de recuperação.
   * Ele continua certo para decidir o que vira treino, e continua errado para
   * decidir o que EXISTE — então aqui ele é sempre reportado, e o banner grande
   * sai quando o resultado é pobre, que é quando alguém está prestes a escrever
   * "a base não tem".
   */
  if (r.alargamento.length > 0) {
    const grande = r.pobre;
    if (grande) console.log(`${linha}\n  ⚠  O FILTRO É QUE ESTREITOU — não necessariamente a base.`);
    else console.log('  filtros que estão escondendo material:');
    for (const a of r.alargamento) {
      const cmd = ['node research/tools/check-evidence.mjs', a.conjunto
        ? [grepTermo && `--grep ${JSON.stringify(grepTermo)}`, topico && `--topic ${topico}`].filter(Boolean).join(' ')
        : filtroCmd.replace(new RegExp(`--${a.filtro} \\S+`), '').replace(/\s+/g, ' ').trim()].join(' ');
      console.log(a.conjunto
        ? `     ${a.valor} JUNTOS: ${a.com} com eles, ${a.sem} sem eles — escondem ${a.revela.length} claim(s)`
        : `     --${a.filtro} ${a.valor}: ${a.com} COM ele, ${a.sem} SEM ele — esconde ${a.revela.length} claim(s)`);
      console.log(`        ${a.amostra.map((c) => `${c.id}(${c.scope}/${c.modo})`).join(' ')}${a.revela.length > a.amostra.length ? ` …+${a.revela.length - a.amostra.length}` : ''}`);
      if (grande) console.log(`        sem eles: ${cmd}`);
    }
    if (grande) {
      console.log('     REGRA: declaração de ausência não vale se a busca que a sustenta carregava');
      console.log('     --modo ou --scope. Busque primeiro SEM filtro; classifique depois.');
      console.log(linha);
    }
    console.log('');
  }
}

/**
 * `--busca` continua existindo e continua sendo a busca por TEXTO. O roteamento
 * sai depois dela, na mesma tela, porque foi exatamente esta consulta que o
 * ataque cego reprovou — e quem digita `--busca` hoje é quem ainda não sabe que
 * existe uma porta melhor. Um ponteiro em prosa no fim de um documento não é
 * conserto; a saída ao lado é.
 */
if (buscaTermo && !arg('--grep')) imprimirRoteamento(buscaTermo, { comoComplemento: true });

if (ids.length === 0 && enderecos.length === 0 && !filtrando && !perguntaTermo && !listarTopicos) {
  console.error('nada a fazer: passe ids (V014-03), endereços ("R79 @03:47"), uma pergunta'
    + ' (--pergunta), a lista de gavetas (--topicos), uma busca (--grep/--busca) ou um filtro'
    + ' (--topic/--modo/--scope/--tier/--genero), ou --vocab <topico>');
  process.exit(2);
}

process.exit(saiuRuim ? 1 : 0);
