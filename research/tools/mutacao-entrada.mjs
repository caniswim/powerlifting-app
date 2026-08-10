#!/usr/bin/env node
/**
 * O ATAQUE DE MUTAÇÃO CONTRA O VOCABULÁRIO DE ENTRADA, virado ferramenta.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE ARQUIVO EXISTE
 *
 * Em 12/08/2026 o ataque cego mediu, contra o gate real: **trocar a lista
 * `entrada` inteira de um tópico por dez strings sem sentido deixava `npm run
 * check:kb` e `npm run check:gate` VERDES em 26 dos 74 tópicos** — entre eles
 * `descanso-entre-series`, a gaveta cuja falha criou esta camada inteira, e
 * `genetica`, `cinto`, `sono`, `rpe`, `mobilidade`, `profundidade`,
 * `training-max`, `recuperacao`, `terra`, `intensidade`, `comandos-ipf`.
 *
 * Trinta e cinco por cento do artefato que oito agentes escreveram não era
 * testado por NADA. É o modo de falha nº 4 desta casa — a trava que se testa a
 * si mesma — em escala nova, e a única forma de ele não voltar é a medição virar
 * um comando que qualquer um roda.
 *
 * Consertar sem medir de novo seria o modo de falha nº 5: relatório de agente
 * que diz sucesso sem sucesso, quatro ondas seguidas nesta casa. O número que
 * esta ferramenta imprime é o único número que vale.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ELE FAZ, EXATAMENTE
 *
 * Para cada um dos 74 tópicos, em ordem:
 *   1. reescreve a lista `entrada` daquele tópico, no lote de origem, com dez
 *      strings sem sentido (`zzqa`…`zzqj`);
 *   2. regera `research/kb/GLOSSARIO-TOPICOS.json` com o `build-glossario.mjs`
 *      — sem isso o `--check` do gerador acusaria a mutação e o resultado seria
 *      um falso VERMELHO que não prova nada sobre o vocabulário;
 *   3. roda o gate DE VERDADE, os comandos `check:kb` e `check:gate` lidos do
 *      `package.json` — e não uma lista de travas escrita aqui, que envelheceria
 *      em silêncio junto com o `package.json`;
 *   4. exige VERMELHO, e anota QUAL trava pegou.
 *
 * Tópico que sobrevive verde é gaveta **descoberta**: o vocabulário dela pode
 * apodrecer, ser editado por engano ou ser esvaziado por um merge, e nada acusa.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O PLACAR MEDIDO EM 12/08/2026, DEPOIS DO CONSERTO DESTA ONDA
 *
 *     ataque              antes    depois   quem sobra
 *     ─────────────────────────────────────────────────────────────────────
 *     lixo                 48/74    74/74   —
 *     enchimento           04/74    74/74   —
 *     enchimento-ptbr        —      70/74   cinto · comandos-ipf · core ·
 *                                           powerbuilding
 *     troca                  —      68/74   agacho · aprendizado-motor ·
 *                                           barra-alta · convencional ·
 *                                           core · intensidade
 *
 * O NÚMERO QUE VALE É O DO PIOR ATAQUE, não o do melhor. Dizer "74 de 74" com
 * base só no `lixo` seria verdade literal e mentira útil — foi contra o
 * `enchimento` que a camada estava em 4 de 74, e é contra a `troca` que ela está
 * em 68 hoje.
 *
 * E o resíduo é honesto, não arredondado. Nas quatro que sobrevivem ao
 * `enchimento-ptbr`, o ataque colhe do corpus a JARGONA REAL daquela gaveta:
 * `comandos-ipf` recebe `imovel · audivel · luzes · travados`, `core` recebe
 * `toracica · expansao · espinhais · caixa · neutra`. Isso não é apodrecimento —
 * é um vocabulário empobrecido que ainda roteia para a gaveta certa, e nenhuma
 * regra determinística consegue chamar isso de lixo sem chamar `fisgada`
 * também. As seis da `troca` são o buraco de verdade: uma gaveta com a entrada
 * de outra passa, e quem cobra isso é canário, não trava — por isso `core`
 * aparece nas duas listas e é a mais descoberta das 74.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE A MUTAÇÃO ACONTECE EM CÓPIA, E NÃO NO REPOSITÓRIO
 *
 * Cada worker monta um sandbox em `os.tmpdir()` com cópia real de
 * `research/kb`, `research/tools` e `scripts` — os diretórios que executam ou
 * que a mutação toca — e symlink para `research/extract`, `research/corpus`,
 * `src` e `node_modules`, que são grandes, só de leitura, e não contêm .mjs cujo
 * `import.meta.url` decida a raiz do repositório.
 *
 * Isso não é higiene decorativa. Um ataque que mutila o repositório de verdade
 * e restaura no fim deixa a árvore quebrada se alguém o interromper, e OUTRO
 * agente está editando `roteador.mjs` nesta mesma árvore agora. Sandbox também é
 * o que permite rodar 74 mutações em paralelo: em série são 74 × ~50 s.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ELE NÃO RODA NO `check:kb`, E ISSO É ESCOLHA
 *
 * Uma passada são ~7 minutos: 74 mutações × o gate inteiro. Pendurar isso no
 * gate faria o gate deixar de ser rodado, que é o pior resultado possível. Ele é
 * ferramenta de ONDA — roda quem mexe no vocabulário de entrada, quem mexe nas
 * travas dele, e quem for medir esta camada de fora. As travas que ele mediu
 * viraram casos baratos no `check-glossario.test.mjs`, e ESSAS rodam sempre.
 *
 * Uso:
 *   node research/tools/mutacao-entrada.mjs                    # os 74, ataque `lixo`
 *   node research/tools/mutacao-entrada.mjs --ataque enchimento-ptbr
 *   node research/tools/mutacao-entrada.mjs --topicos sono,rpe
 *   node research/tools/mutacao-entrada.mjs --jobs 4
 *   node research/tools/mutacao-entrada.mjs --json saida.json
 *   node research/tools/mutacao-entrada.mjs --constantes       # a 2a dívida
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const arg = (f, padrao = null) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : padrao;
};

/** As dez strings sem sentido do ataque original. Quatro letras porque o
 *  `MIN_TERMOS` do check-glossario é 10 e a âncora só olha palavra de 4+. */
const LIXO = ['zzqa', 'zzqb', 'zzqc', 'zzqd', 'zzqe', 'zzqf', 'zzqg', 'zzqh', 'zzqi', 'zzqj'];

/**
 * ── OS QUATRO ATAQUES, E POR QUE UM SÓ NÃO BASTA ─────────────────────────────
 *
 * `lixo` é o ataque que o cego rodou em 12/08 e é o mais fraco dos quatro: dez
 * strings que não existem em língua nenhuma. Qualquer trava que olhe para o
 * corpus o mata, e uma camada que só se defende dele está defendida contra a
 * ameaça que não vai acontecer. Vocabulário não apodrece virando `zzqa` — ele
 * apodrece virando palavra comum.
 *
 * `enchimento` é o ataque que encontrou o buraco de verdade. Ele não inventa
 * nada: colhe as dez palavras MAIS FREQUENTES da prosa da própria gaveta. É o
 * caminho de menor esforço para satisfazer qualquer trava de ancoragem — e é
 * exatamente o modo de falha nº 2, a trava estreita empurrando o dado para
 * dentro dela. Em 12/08 ele deixou **70 das 74 gavetas VERDES**, e o que ele
 * produzia era `your, that, some, more, with, just, like, this, going`: stopword
 * INGLESA, colhida do `verbatim`, passando por voz do atleta brasileiro.
 *
 * `enchimento-ptbr` é a versão que sobrevive à âncora ficar só na claim pt-BR:
 * colhe da prosa em português. Para `descanso-entre-series` produz `entre ·
 * series · tempo · treino · serie · ficar · fazer · cerca` — palavras reais,
 * ancoradas, e ponte para gaveta nenhuma.
 *
 * `troca` dá a uma gaveta a entrada de OUTRA. É o único dos quatro que esta
 * camada não promete matar, e ele está aqui para que isso apareça medido em vez
 * de ficar como nota de rodapé numa doc que ninguém roda.
 */
const ATAQUES = ['lixo', 'enchimento', 'enchimento-ptbr', 'troca'];

/** As palavras mais frequentes da prosa de cada gaveta, na base de verdade.
 *  `campos` decide se o inglês do `verbatim` entra. Termos que já são entrada de
 *  alguém ficam de fora: o ataque quer enchimento, não colisão. */
async function enchimentoPorTopico(campos) {
  const { carregarClaims } = await import('./kb.mjs');
  const { claims } = carregarClaims(join(ROOT, 'research/extract'));
  const SEM = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const PAL = (s) => SEM(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
  const jaEntrada = new Set();
  for (const rel of LOTES) {
    for (const t of JSON.parse(readFileSync(join(ROOT, rel), 'utf8')).topicos ?? []) {
      for (const e of t.entrada ?? []) for (const w of PAL(e)) jaEntrada.add(w);
    }
  }
  const freq = new Map();
  for (const c of claims) {
    const ws = PAL(campos.map((k) => c[k] ?? '').join(' '));
    for (const t of new Set(c.topic ?? [])) {
      if (!freq.has(t)) freq.set(t, new Map());
      const m = freq.get(t);
      for (const w of ws) m.set(w, (m.get(w) ?? 0) + 1);
    }
  }
  const saida = new Map();
  for (const [t, m] of freq) {
    saida.set(t, [...m].filter(([w]) => !jaEntrada.has(w)).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w]) => w));
  }
  return saida;
}

const LOTES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `research/kb/entrada/lote-${n}.json`);

/** Os comandos do gate saem do package.json, não de uma cópia escrita aqui.
 *  Duas listas do mesmo gate divergiriam em silêncio — modo de falha nº 3. */
function comandosDoGate() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const passos = [];
  for (const nome of ['check:kb', 'check:gate']) {
    const linha = pkg.scripts?.[nome];
    if (!linha) throw new Error(`package.json não tem o script "${nome}"`);
    for (const c of linha.split('&&').map((s) => s.trim())) passos.push({ script: nome, cmd: c });
  }
  return passos;
}

// ── o sandbox ────────────────────────────────────────────────────────────────

/** Copiado de verdade: contém .mjs executado (a raiz sai do import.meta.url) ou
 *  é o que a mutação reescreve. */
const COPIAR = [
  'research/kb', 'research/tools', 'scripts', 'package.json',
  // Os .md soltos da raiz de research/ são baratos e o `check-answer.test.mjs`
  // confere caminho citado contra o repositório: sem eles o sandbox nasce
  // vermelho por um motivo que não tem nada a ver com a mutação, e um baseline
  // vermelho faria TODA gaveta parecer coberta. É o falso verde ao contrário.
  'research/baseline.md', 'research/design.md', 'research/verification.md',
  'research/README.md', 'research/RETOMAR.md', 'research/RUNBOOK.md',
  'research/workflows',
];
/** Symlink: grande, só de leitura, e nada aqui dentro decide a raiz. */
const LIGAR = ['research/extract', 'research/corpus', 'research/fontes-brutas', 'src', 'node_modules'];
/** Dentro de research/tools, o que não precisa ser copiado (293 MB de venv). */
const NAO_COPIAR = new Set(['.venv-whisper', 'scan']);

/**
 * ── O MOLDE, E POR QUE ELE É TIRADO UMA VEZ SÓ ───────────────────────────────
 *
 * A primeira versão desta ferramenta montava cada sandbox lendo o repositório na
 * hora. Isso quebrou de verdade na primeira execução: OUTRO agente estava
 * editando `roteador.mjs` nesta mesma árvore, salvou no meio do ataque, e as
 * gavetas medidas depois disso rodaram contra um roteador diferente das medidas
 * antes — nove delas apareceram mortas por um motivo que não era a mutação.
 *
 * Um ataque de mutação só tem sentido se as 74 medições forem contra o MESMO
 * código. O molde é o instantâneo, tirado uma vez, conferido verde uma vez, e é
 * dele que os workers são clonados. O repositório de verdade nunca é tocado.
 */
let MOLDE = null;

function tirarMolde() {
  const base = join(tmpdir(), `mutacao-entrada-${process.pid}-molde`);
  rmSync(base, { recursive: true, force: true });
  mkdirSync(join(base, 'research'), { recursive: true });
  for (const rel of COPIAR) {
    cpSync(join(ROOT, rel), join(base, rel), {
      recursive: true,
      filter: (src) => !NAO_COPIAR.has(src.split('/').pop()),
    });
  }
  for (const rel of LIGAR) {
    const alvo = join(ROOT, rel);
    if (!existsSync(alvo)) continue;
    mkdirSync(dirname(join(base, rel)), { recursive: true });
    symlinkSync(alvo, join(base, rel));
  }
  MOLDE = base;
  return base;
}

function montarSandbox(id) {
  if (!MOLDE) tirarMolde();
  const base = join(tmpdir(), `mutacao-entrada-${process.pid}-${id}`);
  rmSync(base, { recursive: true, force: true });
  cpSync(MOLDE, base, { recursive: true, verbatimSymlinks: true });
  return base;
}

/** O conteúdo do lote como ele está NO MOLDE — não no repositório, que pode ter
 *  mudado desde que o instantâneo foi tirado. */
const loteDoMolde = (rel) => readFileSync(join(MOLDE, rel), 'utf8');

// ── a mutação ────────────────────────────────────────────────────────────────

function ondeMora() {
  const mapa = new Map();
  for (const rel of LOTES) {
    const doc = JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
    for (const t of doc.topicos ?? []) mapa.set(t.topico, rel);
  }
  return mapa;
}

function mutar(base, rel, topico, novaEntrada) {
  const arquivo = join(base, rel);
  const doc = JSON.parse(readFileSync(arquivo, 'utf8'));
  let achou = false;
  for (const t of doc.topicos ?? []) {
    if (t.topico !== topico) continue;
    t.entrada = novaEntrada;
    achou = true;
  }
  if (!achou) throw new Error(`tópico "${topico}" não está em ${rel}`);
  writeFileSync(arquivo, `${JSON.stringify(doc, null, 2)}\n`);
}

async function rodar(base, cmd) {
  const [bin, ...args] = cmd.split(/\s+/);
  try {
    await execFileP(bin, args, { cwd: base, timeout: 300_000, maxBuffer: 64 * 1024 * 1024 });
    return { ok: true };
  } catch (e) {
    return { ok: false, saida: `${e.stdout ?? ''}${e.stderr ?? ''}`.trim() };
  }
}

/** Uma mutação: reescreve, regera, roda o gate, devolve quem pegou. */
async function atacar(base, rel, topico, passos, novaEntrada = LIXO) {
  /**
   * TODOS os lotes voltam ao molde antes de cada ataque, e não só o que vai ser
   * mutado. Medido na primeira execução: o worker reaproveitava o sandbox e o
   * caminho de "morreu" saía sem restaurar, então a mutação da gaveta anterior
   * ficava em disco. Nove gavetas apareceram como medição inválida com a
   * mensagem `correção que não corrigiu nada: sumo.entrada` — a tabela de
   * correções do build tropeçando num lote que outra iteração tinha destruído.
   * Um ataque de mutação em que duas mutações coexistem não mede nenhuma das
   * duas.
   */
  for (const l of LOTES) writeFileSync(join(base, l), loteDoMolde(l));
  mutar(base, rel, topico, novaEntrada);

  const build = await rodar(base, 'node research/tools/build-glossario.mjs');
  if (!build.ok) {
    /**
     * Build quebrado tem dois significados OPOSTOS, e confundi-los é inventar
     * número nos dois sentidos:
     *
     *  · se a mensagem nomeia a gaveta ATACADA, o gate ficou vermelho por causa
     *    da mutação e isso é cobertura de verdade — é o caso de `dor` e `sumo`,
     *    cujas linhas na tabela `CORRECOES` do build deixam de se aplicar quando
     *    a lista some. Nada elegante, mas o gate acusa, que é o que se mede.
     *  · se a mensagem nomeia OUTRA gaveta, quem quebrou foi a ferramenta de
     *    medir, e contar isso como "morreu" seria o instrumento fabricando o
     *    próprio sucesso — o modo de falha nº 5 vindo de dentro.
     */
    const meu = new RegExp(`\\b${topico.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(build.saida);
    if (meu) {
      return { topico, morreu: true, quem: 'build-glossario.mjs (a mutação derruba a tabela de correções)', saida: build.saida };
    }
    return { topico, morreu: false, invalido: true, quem: 'build-glossario.mjs não gerou artefato', saida: build.saida };
  }
  for (const p of passos) {
    const r = await rodar(base, p.cmd);
    if (!r.ok) return { topico, morreu: true, quem: p.cmd.replace('node research/tools/', '').replace('node scripts/', ''), script: p.script, saida: r.saida };
  }
  return { topico, morreu: false };
}

// ── a segunda dívida: as constantes ──────────────────────────────────────────

/**
 * A MUTAÇÃO DE CONSTANTE, e por que ela é a mesma doença.
 *
 * 5 de 56 mutações de constante sobreviviam ao gate, e as cinco AFROUXAVAM:
 * `DETALHE_ROTEADO 8→80`, `DIFERENCA_MAXIMA_GLOSSARIO 5→50`, `MIN_TERMOS 10→0`,
 * `PESO_NOME_COMPOSTO 1.2→12`, `TETO_PARAM 12→120`. O padrão É o diagnóstico:
 * os testes só cobriam o lado que APERTA. Uma constante que só pode subir é uma
 * constante sem teto, e um teto sem teto não é teto.
 *
 * Cada linha aqui é `arquivo :: CONSTANTE :: valor`. A mutação é textual, feita
 * na cópia, sobre a linha da declaração — o que também prova que a constante é
 * lida de onde se diz que ela é lida.
 */
const CONSTANTES = [
  ['research/tools/roteador.mjs', 'DETALHE_ROTEADO', '80'],
  ['research/tools/roteador.mjs', 'PESO_NOME_COMPOSTO', '12'],
  ['research/tools/roteador.mjs', 'TETO_PARAM', '120'],
  ['research/tools/glossario.mjs', 'DIFERENCA_MAXIMA_GLOSSARIO', '50'],
  ['research/tools/check-glossario.mjs', 'MIN_TERMOS', '0'],
  ['research/tools/check-glossario.mjs', 'FRACAO_MINIMA_ANCORADA', '0'],
  ['research/tools/check-glossario.mjs', 'FRACAO_MINIMA_ANCORADA', '0.95'],
  ['research/tools/check-glossario.mjs', 'TETO_GENERICO', '1'],
  ['research/tools/check-glossario.mjs', 'LIMIAR_GENERICO', '74'],
  ['research/tools/roteador.mjs', 'TETO_ROTEADO', '400'],
  ['research/tools/roteador.mjs', 'MAX_TOPICOS', '50'],
  ['research/tools/roteador.mjs', 'PISO_ROTA', '0.065'],
  ['research/tools/roteador.mjs', 'FRACAO_DO_MELHOR', '0.04'],
  ['research/tools/roteador.mjs', 'TETO_AFINS', '600'],
  ['research/tools/roteador.mjs', 'MIN_CLAIMS_DO_TERMO', '0'],
  ['research/tools/glossario.mjs', 'PALAVRAS_ESPARSA', '20'],
  ['research/tools/glossario.mjs', 'JANELA_ESPARSA', '50'],
  ['research/tools/glossario.mjs', 'FRACAO_DA_PALAVRA_GLOSSARIO', '0.06'],
];

function mutarConstante(base, rel, nome, valor) {
  const arquivo = join(base, rel);
  const texto = readFileSync(join(MOLDE, rel), 'utf8');
  // `export const` e `const` puro: os limiares dos checadores não são exportados,
  // e uma regex que só casasse `export` deixaria justamente MIN_TERMOS de fora —
  // a constante cuja mutação 10 → 0 sobreviveu ao ataque de 12/08.
  const re = new RegExp(`^((?:export )?const ${nome}\\s*=\\s*)([^;]+)(;)`, 'm');
  if (!re.test(texto)) throw new Error(`constante ${nome} não declarada em ${rel}`);
  writeFileSync(arquivo, texto.replace(re, `$1${valor}$3`));
  return () => writeFileSync(arquivo, texto);
}

// ── execução ─────────────────────────────────────────────────────────────────

async function fila(itens, jobs, trabalho) {
  const saida = new Array(itens.length);
  let prox = 0;
  await Promise.all(
    Array.from({ length: Math.min(jobs, itens.length) }, async (_, w) => {
      const base = montarSandbox(w);
      try {
        for (;;) {
          const i = prox;
          prox += 1;
          if (i >= itens.length) break;
          saida[i] = await trabalho(base, itens[i], i);
        }
      } finally {
        rmSync(base, { recursive: true, force: true });
      }
    }),
  );
  return saida;
}

const passos = comandosDoGate();
const jobs = Number(arg('--jobs', '6'));
const t0 = Date.now();

/**
 * A CONFERÊNCIA DO BASELINE, e ela não é opcional.
 *
 * Uma mutação "morre" quando o gate fica vermelho. Se o SANDBOX já nascer
 * vermelho — um arquivo que não foi copiado, um caminho que não existe — então
 * todas as 74 gavetas aparecem cobertas e o relatório diz 74/74 sem que nada
 * tenha sido testado. Seria o modo de falha nº 5 fabricado pela própria
 * ferramenta de medição. Aconteceu na primeira execução desta: faltava
 * `research/baseline.md`, e o `check-answer.test.mjs` reprovava por citação
 * fabricada. Por isso o sandbox limpo é conferido ANTES, e um baseline vermelho
 * aborta em vez de virar número.
 */
/**
 * ── COBERTURA É RELATIVA AO MOLDE, E NÃO A "VERDE" ───────────────────────────
 *
 * A definição ingênua — "a mutação é coberta quando o gate fica vermelho" — só
 * vale se o gate estiver verde antes. Ela quebrou na primeira execução desta
 * ferramenta: OUTRO agente estava reescrevendo `roteador.mjs` nesta árvore, o
 * `roteador.test.mjs` reprovava sozinho, e como ele roda ANTES do
 * `check-glossario.mjs` no `check:kb`, toda mutação morria nele. O placar teria
 * saído 74/74 sem que uma única gaveta tivesse sido testada — o modo de falha
 * nº 5 fabricado pelo instrumento de medida.
 *
 * A definição certa é a de mutação de verdade: **a mutação é coberta quando ela
 * faz falhar um passo que passava sem ela.** Os passos que já falham no molde
 * são ANOTADOS e PULADOS — eles não têm nada a dizer sobre o vocabulário, e
 * pulá-los é o que torna a medição possível numa árvore compartilhada, além de
 * deixá-la mais rápida.
 *
 * O que continua sendo abortado é o caso em que não sobra passo nenhum para
 * medir: aí não há medição, e dizer um número seria inventá-lo.
 */
async function conferirBaseline() {
  const base = tirarMolde();
  const quebrados = [];
  for (const p of passos) {
    const r = await rodar(base, p.cmd);
    if (!r.ok) quebrados.push({ ...p, saida: r.saida });
  }
  return quebrados;
}

const quebradosNoMolde = await conferirBaseline();
if (quebradosNoMolde.length > 0) {
  console.error(
    `⚠  ${quebradosNoMolde.length} passo(s) do gate JÁ FALHAM no molde limpo, sem mutação nenhuma:\n`
      + quebradosNoMolde.map((p) => `     ${p.cmd}`).join('\n')
      + '\n   Eles são PULADOS — um passo que já está vermelho não prova nada sobre o vocabulário.\n'
      + '   A cobertura abaixo é medida só contra os passos que passam limpos.\n',
  );
}
const passosUteis = passos.filter((p) => !quebradosNoMolde.some((q) => q.cmd === p.cmd));
if (passosUteis.length === 0) {
  console.error('✗ nenhum passo do gate passa no molde limpo — não há o que medir. Conserte a árvore antes.');
  rmSync(MOLDE, { recursive: true, force: true });
  process.exit(2);
}
console.log(`✓ molde conferido — ${passosUteis.length} de ${passos.length} passos do gate servem de medida\n`);
process.on('exit', () => { if (MOLDE) rmSync(MOLDE, { recursive: true, force: true }); });

if (process.argv.includes('--constantes')) {
  const alvos = CONSTANTES;
  console.log(`Mutação de CONSTANTE — ${alvos.length} alvo(s), ${jobs} worker(s), gate real do package.json\n`);
  const res = await fila(alvos, jobs, async (base, [rel, nome, valor]) => {
    const restaura = mutarConstante(base, rel, nome, valor);
    try {
      for (const p of passosUteis) {
        const r = await rodar(base, p.cmd);
        if (!r.ok) return { alvo: `${nome}→${valor}`, morreu: true, quem: p.cmd.replace(/node \S+\//, '') };
      }
      return { alvo: `${nome}→${valor}`, morreu: false };
    } finally {
      restaura();
    }
  });
  const vivas = res.filter((r) => !r.morreu);
  for (const r of res) console.log(`  ${r.morreu ? '✓ morreu' : '✗ SOBREVIVEU'}  ${r.alvo.padEnd(38)} ${r.quem ?? ''}`);
  console.log(`\n${res.length - vivas.length} de ${res.length} mutações de constante morrem no gate.`);
  if (vivas.length > 0) console.log(`SOBREVIVEM: ${vivas.map((r) => r.alvo).join(', ')}`);
  process.exit(vivas.length > 0 ? 1 : 0);
}

const mapa = ondeMora();
const pedidos = arg('--topicos');
const alvos = (pedidos ? pedidos.split(',').map((s) => s.trim()) : [...mapa.keys()]).sort();
for (const t of alvos) if (!mapa.has(t)) throw new Error(`tópico "${t}" não existe nos lotes`);

const ataque = arg('--ataque', 'lixo');
if (!ATAQUES.includes(ataque)) throw new Error(`--ataque tem de ser um de: ${ATAQUES.join(', ')}`);

let substituto;
if (ataque === 'lixo') {
  substituto = () => LIXO;
} else if (ataque === 'troca') {
  const lista = [...mapa.keys()].sort();
  const entradaDe = new Map();
  for (const rel of LOTES) {
    for (const t of JSON.parse(readFileSync(join(ROOT, rel), 'utf8')).topicos ?? []) entradaDe.set(t.topico, t.entrada);
  }
  substituto = (t) => entradaDe.get(lista[(lista.indexOf(t) + 1) % lista.length]);
} else {
  const campos = ataque === 'enchimento' ? ['claim', 'verbatim', 'verbatimWhisper'] : ['claim'];
  const ench = await enchimentoPorTopico(campos);
  substituto = (t) => ench.get(t) ?? [];
}

const COMO = {
  lixo: `${LIXO.length} strings sem sentido (zzqa…zzqj)`,
  enchimento: 'as 10 palavras mais frequentes da prosa da própria gaveta (claim + verbatim inglês)',
  'enchimento-ptbr': 'as 10 palavras pt-BR mais frequentes da prosa da própria gaveta',
  troca: 'a lista `entrada` inteira da PRÓXIMA gaveta em ordem alfabética',
};
console.log(
  `Ataque "${ataque}" ao vocabulário de entrada — ${alvos.length} gaveta(s), ${jobs} worker(s).\n`
    + `Cada gaveta tem a lista \`entrada\` trocada por ${COMO[ataque]}, o artefato é regerado,\n`
    + 'e o gate real (check:kb + check:gate) tem de ficar VERMELHO.\n',
);

const res = await fila(alvos, jobs, async (base, topico, i) => {
  const nova = substituto(topico);
  if (!nova || nova.length === 0) {
    process.stderr.write(`  [${i + 1}/${alvos.length}] ${topico.padEnd(26)} MEDIÇÃO INVÁLIDA — sem substituto\n`);
    return { topico, morreu: false, invalido: true, quem: 'o ataque não produziu lista de substituição' };
  }
  const r = await atacar(base, mapa.get(topico), topico, passosUteis, nova);
  const rotulo = r.invalido ? `MEDIÇÃO INVÁLIDA — ${r.quem}` : (r.morreu ? `morreu em ${r.quem}` : 'SOBREVIVEU VERDE');
  process.stderr.write(`  [${i + 1}/${alvos.length}] ${topico.padEnd(26)} ${rotulo}\n`);
  if (r.invalido) process.stderr.write(`${(r.saida ?? '').split('\n').map((l) => `        │ ${l}`).join('\n')}\n`);
  return r;
});

const invalidas = res.filter((r) => r.invalido);
const vivas = res.filter((r) => !r.morreu && !r.invalido);
if (invalidas.length > 0) {
  console.error(`\n✗ ${invalidas.length} medição(ões) INVÁLIDA(S) — a mutação não chegou a gerar artefato:`);
  for (const r of invalidas) console.error(`    ${r.topico}: ${r.quem}`);
  console.error('  Estas não contam como cobertas nem como descobertas: não foram testadas.');
}
const porQuem = new Map();
for (const r of res.filter((x) => x.morreu)) porQuem.set(r.quem, (porQuem.get(r.quem) ?? 0) + 1);

const cobertas = res.filter((r) => r.morreu).length;
console.log(`\n${'═'.repeat(78)}`);
console.log(`ATAQUE "${ataque}": DE ${res.length} GAVETAS, ${cobertas} SÃO COBRADAS POR ALGUMA COISA.`);
console.log(`${'═'.repeat(78)}\n`);
console.log('quem pega a mutação:');
for (const [quem, n] of [...porQuem.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${quem}`);
if (vivas.length > 0) {
  console.log(`\n${vivas.length} GAVETA(S) DESCOBERTA(S) — o vocabulário delas pode virar lixo com o gate verde:`);
  for (const r of vivas) console.log(`  ✗ ${r.topico}`);
}
console.log(`\n(${((Date.now() - t0) / 1000).toFixed(0)} s)`);

const destino = arg('--json');
if (destino) {
  writeFileSync(destino, `${JSON.stringify({
    ataque,
    alvos: res.length,
    cobertas,
    descobertas: vivas.map((r) => r.topico),
    invalidas: invalidas.map((r) => r.topico),
    porQuem: [...porQuem],
  }, null, 2)}\n`);
}

process.exit(vivas.length + invalidas.length > 0 ? 1 : 0);
