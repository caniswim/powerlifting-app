#!/usr/bin/env node
/**
 * A TRAVA DA CAMADA DE ROTEAMENTO — `pergunta → tópico → claims`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ELE EXISTE, E POR QUE NÃO PODE SER UM TESTE UNITÁRIO
 *
 * O `busca.test.mjs` de 09/08 tem 35 casos sobre um corpus sintético de 12
 * claims. Ele prova que as FUNÇÕES funcionam; não prova que **o corpus real é
 * recuperável** — e o ataque cego mostrou o custo: desligar a vizinhança inteira
 * (`const relaxada = false`) deixava os 35 casos verdes.
 *
 * Aqui a base é a de verdade, as perguntas são na voz do atleta, e o que se
 * cobra é o que ele veria na tela.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AS DUAS REGRAS DE HIGIENE, E AS DUAS FORAM VIOLADAS EM 09/08
 *
 * 1. **Nenhuma trava lê a constante que ela verifica.** O `TETO_VIZINHANCA` era
 *    importado de `busca.mjs` pelo canário que o media: trocar 40 por 400 fazia
 *    o `check:kb` inteiro passar verde. Aqui o orçamento é `tela`, **campo do
 *    `ROTAS.json`**, e este arquivo **não importa nenhuma constante de
 *    `roteador.mjs`** — só as funções. Mudar `TETO_ROTEADO` na ferramenta não
 *    muda o que este arquivo cobra.
 * 2. **Nenhum lado é derivado do outro.** Os tópicos esperados são escritos à
 *    mão, do ponto de vista de quem pergunta; os ids vêm da base e são
 *    conferidos existir; e os `proibidos` vêm da medição de precisão de 09/08
 *    (`V170-34` — *supinar seis dias por semana* — injetado no topo de perguntas
 *    sobre sono, calorias e deload). O roteador não participou de escrever
 *    nenhum dos três.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AS TRÊS FAMÍLIAS
 *
 *   mapeia      — a pergunta resolve para tópicos NOMEADOS, e os ids que a
 *                 respondem saem dentro de `tela`. Cobra recall.
 *   nao-mapeia  — a pergunta NÃO é desta base, e o roteamento tem de dizer isso
 *                 com o `motivo` certo. Dizer "não sei" é resposta; devolver
 *                 lixo plausível não é. Cobra a recusa.
 *   sem-injecao — a pergunta é desta base, e ids de OUTRO assunto não podem
 *                 aparecer. Cobra precisão, que é o que nada media em 09/08 e
 *                 que já regrediu a zero uma vez.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * E A FAMÍLIA `sem-injecao` COBRA AS DUAS PORTAS, PORQUE O DEFEITO MORA NA VELHA
 *
 * Medido em 10/08/2026, e é a razão de o campo `tambemPelaBuscaLivre` existir:
 * o roteamento **não chama** `expandirPorVocabulario`, então a injeção de 09/08
 * é estruturalmente impossível pela porta nova. Rodadas 14 mutações contra
 * `roteador.mjs` — teto, piso, fração, afinidade, canal de param, peso ao
 * quadrado, tudo — e **nenhuma** delas conseguiu fazer T09/T10/T11 acusarem: as
 * regressões que existem aparecem como perda de RECALL na família `mapeia`.
 *
 * Um canário que nenhuma mutação faz morder é um canário que ocupa a vaga. E o
 * defeito que ele foi escrito para pegar continua vivo do outro lado: trocar
 * `longas.every` por `longas.some` em `busca.mjs:555` reinjeta V170-34 —
 * *supinar seis dias por semana* — nas três perguntas, e o `npm run check:kb`
 * inteiro passava verde.
 *
 * Então os `proibidos` são cobrados **também contra `recuperar()`**, que é a
 * porta que `--busca` usa. Um campo do JSON liga isso, não uma constante daqui.
 *
 * Uso:
 *   node research/tools/check-rotas.mjs [--rotas <arquivo>] [--extract <dir>] [--verbose]
 *
 * `--rotas` existe para que um conjunto de canários ESCRITO POR OUTRA PESSOA,
 * que este autor nunca viu, possa ser rodado contra esta camada sem tocar em
 * código. É a única forma honesta de medir alcance: um canário escrito por quem
 * fez a ferramenta mede a ferramenta contra si mesma.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { indexar, carregarVocabulario, recuperar } from './busca.mjs';
import { responder, perfilarTopicos, rotasValidas, termosDaPergunta } from './roteador.mjs';
import { carregarGlossario, indexarGlossario } from './glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};
const EXTRACT = arg('--extract') ?? join(ROOT, 'research/extract');
const ARQUIVO = arg('--rotas') ?? join(ROOT, 'research/kb/ROTAS.json');
const VERBOSE = process.argv.includes('--verbose');

if (!existsSync(ARQUIVO)) {
  console.error(`✗ ${ARQUIVO} não existe — sem canários de roteamento não há como saber se ele roteia`);
  process.exit(2);
}

const doc = JSON.parse(readFileSync(ARQUIVO, 'utf8'));
const { claims, porId } = carregarClaims(EXTRACT);
if (claims.length === 0) {
  console.error(`✗ nenhuma claim em ${EXTRACT}`);
  process.exit(2);
}

/**
 * ── O TETO DO TOPO É COBRADO AQUI, E POR ISSO DEIXOU DE SER LETRA MORTA ──────
 *
 * O `_leia` deste arquivo apresenta o orçamento de tela como a cura do modo de falha
 * nº 4 — o número mora no JSON e não em `roteador.mjs`. O ataque de 10/08/2026
 * mostrou que o campo do TOPO era decorativo: todos os 12 casos que precisam de
 * teto carregam o seu, `caso.tela ?? doc.tela` nunca caía no de
 * cima, e renomear a linha de cima para `"MORTO"` deixava este checker em
 * exit 0. Pior, a chamada de `responder` escrevia `teto: teto ?? 40` — o mesmo
 * 40 hardcoded dentro da ferramenta que o arquivo diz não poder tê-lo.
 *
 * Agora o teto do topo é lido ANTES de qualquer caso e a ausência dele é erro
 * de carga. Repro que passou a falhar:
 *   sed -i '' 's/^ "tela": {/ "MORTO": {/' research/kb/ROTAS.json
 *   node research/tools/check-rotas.mjs   → exit 2
 */
/**
 * ── E DESDE 13/08/2026 O ORÇAMENTO SÃO DOIS NÚMEROS, NÃO UM ─────────────────
 *
 * A resposta deixou de ser uma tela plana de N vagas: é uma SEÇÃO POR GAVETA
 * aberta. Então o orçamento é `porSecao` × `secoes`, e os dois são dado do
 * JSON pelo mesmo motivo de sempre — inflar `TETO_DA_SECAO` em
 * `roteador.mjs` não pode mudar uma linha do que este arquivo cobra.
 *
 * `porSecaoForcada` só é lido nos casos com `forcaTopico`: a gaveta que um
 * humano pediu tem teto próprio, e ele também é dado do canário.
 */
const telaValida = (t) => t && Number.isInteger(t.porSecao) && Number.isInteger(t.secoes);
/**
 * A PORTA VELHA (`--busca`, `recuperar()`) continua sendo uma tela PLANA, e o
 * teto dela é outro dado: as duas portas respondem a perguntas diferentes e
 * nenhuma das duas pode herdar o número da outra em silêncio.
 */
const TELA_DA_BUSCA_LIVRE = doc.telaDaBuscaLivre;
if (!Number.isInteger(TELA_DA_BUSCA_LIVRE)) {
  console.error(`\u2717 ${ARQUIVO}: falta "telaDaBuscaLivre" no topo (o teto da porta --busca).`);
  process.exit(2);
}
if (!telaValida(doc.tela)) {
  console.error(
    `✗ ${ARQUIVO}: falta "tela": { "porSecao": N, "secoes": M } no topo. Estes números são DADO do `
      + 'canário, nunca constante da ferramenta que ele mede. Os casos podem sobrescrevê-los; '
      + 'nenhum default vem daqui.\n'
      + '  (o antigo "tetoDeTela" morreu com a tela plana — ver roteador.mjs, bloco '
      + '"A TELA: UMA SEÇÃO POR GAVETA")',
  );
  process.exit(2);
}

const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
// Índice e perfil montados UMA vez. `responder` os refaria por caso, e um
// checker lento é um checker que sai do `check:kb`.
const INDICE = indexar(claims);
const PERFIS = perfilarTopicos(claims);

const FAMILIAS = new Set(['mapeia', 'nao-mapeia', 'sem-injecao']);
const MOTIVOS = new Set(['fora-de-dominio', 'sem-assunto']);
/**
 * Campo com typo é IGNORADO em silêncio, e um canário que perdeu sua âncora sem
 * avisar volta a ser prosa. Mesma regra do `check-canarios.mjs`, e pelo mesmo
 * motivo: já aconteceu aqui.
 */
const CAMPOS = new Set([
  'id', 'familia', 'pergunta', 'porque', 'topicos', 'topicosProibidos', 'sustenta', 'proibidos',
  'motivo', 'tela', 'forcaTopico', 'nota', 'tambemPelaBuscaLivre',
  'viaPaginaAoLado',
]);

const erros = [];
const linhas = [];
const idsVistos = new Set();

for (const caso of doc.casos ?? []) {
  const onde = `rota ${caso.id ?? '(sem id)'}`;
  const linha = { id: caso.id, familia: caso.familia, ok: true, detalhe: '' };

  for (const campo of ['id', 'familia', 'pergunta', 'porque']) {
    if (!String(caso[campo] ?? '').trim()) erros.push(`${onde}: campo "${campo}" vazio — canário sem ${campo} não é auditável`);
  }
  if (idsVistos.has(caso.id)) erros.push(`${onde}: id duplicado`);
  idsVistos.add(caso.id);
  for (const k of Object.keys(caso)) {
    if (!CAMPOS.has(k)) erros.push(`${onde}: campo "${k}" não existe no formato — um campo com typo é ignorado em silêncio`);
  }
  if (!FAMILIAS.has(caso.familia)) {
    erros.push(`${onde}: familia "${caso.familia}" fora de ${[...FAMILIAS].join(' / ')}`);
    linhas.push({ ...linha, ok: false });
    continue;
  }

  /**
   * O TETO É DADO DO ARQUIVO, e a ausência dele é ERRO — não um default
   * silencioso vindo da ferramenta. Um default aqui seria a mesma trava que se
   * testa a si mesma, com uma linha a menos.
   */
  const tela = caso.tela ?? doc.tela;
  if (caso.familia !== 'nao-mapeia' && !telaValida(tela)) {
    erros.push(
      `${onde}: sem "tela" (nem no caso nem no topo do arquivo). Estes números são DADO do `
        + 'canário, nunca constante da ferramenta que ele mede — foi assim que TETO_VIZINHANCA '
        + 'passou de 40 para 400 com o check:kb verde.',
    );
    linhas.push({ ...linha, ok: false });
    continue;
  }
  if (caso.forcaTopico && caso.tela && !Number.isInteger(caso.tela.porSecaoForcada)) {
    erros.push(
      `${onde}: usa "forcaTopico" e declara "tela" sem "porSecaoForcada". A seção que um humano `
        + 'pede por --topic tem teto próprio, e ele é dado do canário — sem isto o número vem de '
        + 'TETO_DA_SECAO_FORCADA em roteador.mjs, que é a trava lendo a constante que verifica.',
    );
    linhas.push({ ...linha, ok: false });
    continue;
  }
  const orcamento = `${tela.porSecao} por seção × ${tela.secoes} seção(ões)`;

  // ── os tópicos esperados existem na lista FECHADA? ────────────────────────
  //
  // É a checagem que só o roteamento por tópico torna possível, e é a razão
  // desta camada existir: alvo fechado é alvo conferível. Tópico com typo num
  // canário nunca casa, fica em zero para sempre, e zero é indistinguível de
  // "a camada quebrou".
  const foraDaLista = rotasValidas(
    [...(caso.topicos ?? []), ...(caso.topicosProibidos ?? []), ...(caso.forcaTopico ? [caso.forcaTopico] : [])],
    TOPICOS,
  );
  if (foraDaLista.length > 0) {
    erros.push(`${onde}: tópico(s) ${foraDaLista.join(', ')} fora do vocabulário fechado do PROTOCOLO-EXTRACAO.md`);
    linha.ok = false;
  }

  // ── os ids ainda existem? ─────────────────────────────────────────────────
  const mortos = [...(caso.sustenta ?? []), ...(caso.proibidos ?? [])].filter((i) => !porId.has(i));
  if (mortos.length > 0) {
    erros.push(
      `${onde}: ${mortos.length} id(s) não existem mais (${mortos.join(', ')}) — o canário parou de `
        + 'medir; reancore-o em ids vivos antes de confiar no verde dos outros',
    );
    linha.ok = false;
  }

  const r = responder(claims, caso.pergunta, {
    topicos: TOPICOS,
    glossario: GLOSSARIO,
    vocabulario: VOCAB,
    idx: INDICE,
    perfis: PERFIS,
    tela,
    forcar: caso.forcaTopico ? [caso.forcaTopico] : [],
  });
  const roteados = r.rotas.map((x) => x.topico);
  linha.rotas = roteados;

  if (caso.familia === 'nao-mapeia') {
    if (!MOTIVOS.has(caso.motivo)) {
      erros.push(`${onde}: familia "nao-mapeia" exige motivo em ${[...MOTIVOS].join(' / ')} — as duas mandam consertos opostos`);
      linha.ok = false;
    }
    if (roteados.length > 0) {
      linha.ok = false;
      erros.push(
        `${onde}: DEVERIA NÃO MAPEAR e mapeou para ${roteados.join(', ')}.\n`
          + `        "${caso.pergunta}" não é uma pergunta desta base, e devolver claims para ela é\n`
          + '        pior que devolver nada: a resposta sai plausível e sem fonte. Ou o piso do\n'
          + '        roteador afrouxou, ou o corpus mudou e este canário precisa ser reescrito.',
      );
    } else if (r.motivo !== caso.motivo) {
      linha.ok = false;
      erros.push(
        `${onde}: não mapeou (certo) mas pelo motivo errado — esperado "${caso.motivo}", saiu "${r.motivo}".\n`
          + '        `fora-de-dominio` (as palavras não existem na base) e `sem-assunto` (existem e não\n'
          + '        distinguem) mandam consertos OPOSTOS, e é a distinção que a MEDICAO-02 §2.2 mediu\n'
          + '        custar uma rodada de aquisição inteira.',
      );
    }
    linha.detalhe = `motivo ${r.motivo ?? '—'}`;
    linhas.push(linha);
    continue;
  }

  // ── mapeia / sem-injecao ──────────────────────────────────────────────────
  if (roteados.length === 0) {
    linha.ok = false;
    erros.push(
      `${onde}: NÃO MAPEOU PARA TÓPICO NENHUM — "${caso.pergunta}".\n`
        + `        Motivo dado pela ferramenta: ${r.motivo}. Os mais próximos: `
        + `${r.candidatos.slice(0, 3).map((c) => `${c.topico} ${c.score.toFixed(2)}`).join(', ') || '(nenhum)'}\n`
        + '        ISTO NÃO É FALTA DE CONTEÚDO. É o roteamento que parou de rotear.',
    );
  }

  const faltandoTopico = (caso.topicos ?? []).filter((t) => !roteados.includes(t));
  if (faltandoTopico.length > 0) {
    linha.ok = false;
    erros.push(
      `${onde}: roteou para [${roteados.join(', ')}] e NÃO para [${faltandoTopico.join(', ')}].\n`
        + `        A pergunta "${caso.pergunta}" é sobre ${faltandoTopico.join(' e ')}, e a gaveta certa\n`
        + '        não foi aberta. Conserte research/tools/roteador.mjs — não compre fonte nova.',
    );
  }

  /**
   * ── A GAVETA QUE NÃO PODE ABRIR (11/08/2026) ──────────────────────────────
   *
   * `topicos` cobra que a gaveta certa abra; `proibidos` cobra que um id de
   * outro assunto não apareça. Faltava a coisa do meio, e é ela que o
   * diagnóstico de 10/08 descreveu: a GAVETA ERRADA abrindo. `levantar peso já
   * conta como exercício pro coração` roteava para `peso-corporal` — nenhum id
   * proibido, nenhum tópico faltando, e a tela inteira errada.
   *
   * É também o único campo que consegue matar um afrouxamento: `topicos` e
   * `sustenta` só ficam vermelhos quando a camada aperta demais. Foi assim que
   * três mutações passaram verdes no ataque de 11/08 (o desempate do glossário
   * ignorado, a janela do casamento espalhado em 99, e o bônus de
   * `naoConfundirCom` em 2): as três só ABREM gaveta a mais.
   */
  const abriuProibido = (caso.topicosProibidos ?? []).filter((t) => roteados.includes(t));
  if (abriuProibido.length > 0) {
    linha.ok = false;
    erros.push(
      `${onde}: ABRIU GAVETA QUE NÃO PODE ABRIR — "${caso.pergunta}" roteou para `
        + `${abriuProibido.join(', ')}.\n`
        + `        Roteou para [${roteados.join(', ')}]. Uma gaveta a mais não é grátis: ela disputa as\n`
        + `        ${orcamento} da tela com a gaveta que tem a resposta, e sai com a mesma cara de\n`
        + '        certeza. É o defeito que `peso-corporal` cometeu no P16 — sem id proibido nenhum,\n'
        + '        sem tópico faltando, e a tela inteira errada.',
    );
  }

  const faltandoId = (caso.sustenta ?? []).filter((i) => porId.has(i) && !r.idsMostrados.has(i));
  if (faltandoId.length > 0) {
    linha.ok = false;
    erros.push(
      `${onde}: A CAMADA DE ROTEAMENTO REGREDIU — "${caso.pergunta}" não devolve `
        + `${faltandoId.join(', ')} dentro da tela (${orcamento}).\n`
        + '        Os ids existem e o conteúdo deles foi conferido acima. É a recuperação que\n'
        + '        parou de achar, e NÃO uma lacuna da base.',
    );
  }

  /**
   * ── O CANAL DA PÁGINA AO LADO, COBRADO PELO NOME ─────────────────────────
   *
   * `viaPaginaAoLado` são ids que só chegam à tela pelo canal `rota` de
   * `vizinhos` — a claim adjacente ao que o roteamento já pôs em detalhe. Não
   * basta exigir que o id apareça: `sustenta` já faz isso, e `sustenta` fica
   * satisfeito se o id vier por qualquer outro caminho.
   *
   * O ataque de 10/08/2026 mediu o preço da falta desta cobrança:
   * `DETALHE_ROTEADO 8 → 0` matava `vizRoteado` inteiro, a saída perdia 8 das
   * 10 linhas de A PÁGINA AO LADO, e `npm run check:kb` continuava em exit 0.
   * O único teste que citava o canal — V033-05 em roteador.test.mjs — passava
   * porque V033-05 vem de `vizParam`, o outro canal. Canário tem de morder
   * onde o defeito mora.
   */
  const viaLado = caso.viaPaginaAoLado ?? [];
  const foraDoCanal = viaLado.filter(
    (i) => porId.has(i) && !r.vizinhos.some((v) => v.c.id === i && v.canal === 'rota'),
  );
  if (foraDoCanal.length > 0) {
    linha.ok = false;
    erros.push(
      `${onde}: O CANAL "A PÁGINA AO LADO" DO ROTEAMENTO PAROU DE ENTREGAR — `
        + `${foraDoCanal.join(', ')} não saem mais como vizinhos de canal "rota" para\n`
        + `        "${caso.pergunta}". Hoje o canal traz `
        + `${r.vizinhos.filter((v) => v.canal === 'rota').length} claim(s).\n`
        + '        Estes ids são a claim IMEDIATAMENTE ao lado do que o roteamento já mostrou, e\n'
        + '        é por eles que o número da resposta chega à tela sem estar etiquetado no tópico.\n'
        + '        Olhe DETALHE_ROTEADO e o raio de vizinhança em research/tools/roteador.mjs.',
    );
  }
  if (viaLado.length > 0 && caso.familia === 'nao-mapeia') {
    erros.push(`${onde}: "viaPaginaAoLado" num caso nao-mapeia — a tela desse caso é vazia de propósito`);
  }

  const injetados = (caso.proibidos ?? []).filter((i) => r.idsMostrados.has(i));
  if (injetados.length > 0) {
    linha.ok = false;
    erros.push(
      `${onde}: PRECISÃO REGREDIU — "${caso.pergunta}" devolveu ${injetados.join(', ')},\n`
        + '        que é de outro assunto. Foi exatamente assim que, em 09/08, "quantas horas de\n'
        + '        sono por semana" devolveu *supinar seis dias por semana* em 1º lugar — para um\n'
        + '        atleta com o peitoral rompido há quatro meses.',
    );
  }

  /**
   * A MESMA PROIBIÇÃO, PELA PORTA VELHA — e é onde o defeito de 09/08 mora.
   *
   * `recuperar()` é o que `--busca` chama, com `piso: Infinity` (que é como a
   * CLI liga a vizinhança para uma pergunta em linguagem natural). É ele que
   * expande pelo `VOCABULARIO.md`, e é a expansão que injetava. O roteamento
   * não usa esse caminho, então sem esta cobrança a família `sem-injecao` fica
   * verde para sempre e não mede nada.
   */
  let injetadosLivre = [];
  if (caso.tambemPelaBuscaLivre) {
    if (!(caso.proibidos ?? []).length) {
      erros.push(`${onde}: "tambemPelaBuscaLivre" sem "proibidos" — não há o que cobrar`);
      linha.ok = false;
    }
    const rl = recuperar(claims, {
      grep: caso.pergunta, piso: Infinity, teto: TELA_DA_BUSCA_LIVRE, idx: INDICE, vocabulario: VOCAB,
    });
    injetadosLivre = (caso.proibidos ?? []).filter((i) => rl.idsMostrados.has(i));
    if (injetadosLivre.length > 0) {
      linha.ok = false;
      erros.push(
        `${onde}: PRECISÃO REGREDIU NA BUSCA LIVRE — --busca "${caso.pergunta}" devolveu `
          + `${injetadosLivre.join(', ')},\n`
          + '        que é de outro assunto. Este é o defeito medido em 09/08 e consertado no mesmo\n'
          + '        dia em busca.mjs (`longas.every`, expandirPorVocabulario): uma seção do índice\n'
          + '        disparava quando UMA palavra de 4+ letras casava, e `semana` está em toda\n'
          + '        pergunta. A porta nova (--pergunta) não passa por aí; a velha passa, e é ela\n'
          + '        que este canário cobra. Não reescreva o canário — reverta a regressão.',
      );
    }
  }

  linha.detalhe = [
    `${roteados.length} tópico(s)`,
    caso.tambemPelaBuscaLivre
      ? (injetadosLivre.length ? `${injetadosLivre.length} injetado(s) na busca livre` : 'busca livre limpa')
      : null,
    (caso.sustenta ?? []).length ? `${(caso.sustenta ?? []).length - faltandoId.length}/${(caso.sustenta ?? []).length} ids` : null,
    (caso.proibidos ?? []).length ? `${(caso.proibidos ?? []).length} proibido(s) fora` : null,
    (caso.topicosProibidos ?? []).length ? `${(caso.topicosProibidos ?? []).length} gaveta(s) fechada(s)` : null,
  ].filter(Boolean).join('  ');
  linhas.push(linha);
}

// ── as duas populações que fixam o piso ──────────────────────────────────────
//
// O piso do roteamento é julgamento, e julgamento sem a medição ao lado é
// palpite. As duas populações moram no `ROTAS.json` — escritas antes de o piso
// ter valor —, e o que este bloco cobra é a coisa que se quer verdadeira:
// **toda pergunta de dentro mapeia, nenhuma de fora mapeia**. Nunca "o piso é
// 0,65". Mover o piso para qualquer lado quebra um dos dois lados, e este
// arquivo continua sem saber que número ele é.
const cal = doc.calibracao;
if (cal) {
  const scoreDe = (p) => {
    const r = responder(claims, p, {
      topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS,
    });
    return { mapeou: r.rotas.length > 0, melhor: r.candidatos[0]?.score ?? 0, topo: r.candidatos[0]?.topico ?? '—' };
  };
  const dentro = (cal.dentro ?? []).map((p) => ({ p, ...scoreDe(p) }));
  const fora = (cal.fora ?? []).map((p) => ({ p, ...scoreDe(p) }));

  const mudos = dentro.filter((x) => !x.mapeou);
  const falantes = fora.filter((x) => x.mapeou);

  for (const x of mudos) {
    erros.push(
      `calibração: "${x.p}" É uma pergunta desta base e NÃO mapeou (melhor: ${x.topo} ${x.melhor.toFixed(2)}).\n`
        + '        Ou o piso subiu, ou o roteamento perdeu sinal. Recusar uma pergunta legítima é\n'
        + '        o defeito que a MEDICAO-02 mediu em 7 de 7 respostas ruins, com outra roupa.',
    );
  }
  for (const x of falantes) {
    erros.push(
      `calibração: "${x.p}" NÃO é uma pergunta desta base e mapeou para ${x.topo} (${x.melhor.toFixed(2)}).\n`
        + '        O piso afrouxou. Uma camada que devolve claims para qualquer pergunta produz\n'
        + '        resposta plausível com citação — que é a pior saída que esta base pode dar.',
    );
  }

  const menorDentro = Math.min(...dentro.map((x) => x.melhor));
  const maiorFora = Math.max(...fora.map((x) => x.melhor));
  console.log(
    `  ℹ  calibração do piso: ${dentro.length} perguntas de dentro (menor score ${menorDentro.toFixed(2)}) `
      + `× ${fora.length} de fora (maior ${maiorFora.toFixed(2)})`,
  );
  if (maiorFora >= menorDentro) {
    erros.push(
      `calibração: as duas populações se CRUZARAM — maior de fora ${maiorFora.toFixed(2)} ≥ menor de dentro `
        + `${menorDentro.toFixed(2)}.\n        Não existe piso que separe as duas; o roteamento precisa de sinal `
        + 'NOVO, não de um número diferente. Mexer no piso agora só escolhe qual dos dois erros cometer.',
    );
  }
}

// ── deriva da base desde que os canários foram escritos ──────────────────────
const naEpoca = doc.baseNoMomento?.claims;
if (Number.isInteger(naEpoca) && naEpoca !== claims.length) {
  console.log(
    `  ℹ  a base tinha ${naEpoca} claims quando este arquivo foi escrito e tem ${claims.length} agora `
      + `(${claims.length > naEpoca ? '+' : ''}${claims.length - naEpoca}).`,
  );
}

for (const l of linhas) {
  const marca = l.ok ? '✓' : '✗';
  if (!l.ok || VERBOSE) {
    console.log(`${marca} ${l.id} [${l.familia}] ${l.detalhe}${VERBOSE && l.rotas ? `  → ${l.rotas.join(', ')}` : ''}`);
  }
}

if (erros.length > 0) {
  console.error('');
  for (const e of erros) console.error(`✗ ${e}`);
  console.error(`\n✗ ${erros.length} problema(s) em ${linhas.length} canário(s) de roteamento`);
  process.exit(1);
}

const porFamilia = {};
for (const l of linhas) porFamilia[l.familia] = (porFamilia[l.familia] ?? 0) + 1;
console.log(
  `✓ ${linhas.length} canário(s) de roteamento verdes contra ${claims.length} claims `
    + `(${Object.entries(porFamilia).map(([k, v]) => `${v} ${k}`).join(' · ')})`,
);
process.exit(0);
