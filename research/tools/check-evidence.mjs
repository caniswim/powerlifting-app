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
 * Uso:
 *   node research/tools/check-evidence.mjs V014-03 V052-11 …
 *   node research/tools/check-evidence.mjs --grep "training max"
 *   node research/tools/check-evidence.mjs --topic profundidade --modo prescricao
 *   node research/tools/check-evidence.mjs --topic agacho --limit 0   # sem corte
 *   node research/tools/check-evidence.mjs --genero review-de-programa --modo prescricao
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GENEROS, carregarGeneroPorRef } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};

const grepTermo = arg('--grep');
const topico = arg('--topic');
const modo = arg('--modo');
const scope = arg('--scope');
const tier = arg('--tier');

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

const filtrando = grepTermo || topico || modo || scope || tier || genero;
if (filtrando) {
  const rx = grepTermo ? new RegExp(grepTermo, 'i') : null;
  const achados = claims.filter(
    (c) =>
      (!rx || rx.test(c.claim ?? '') || rx.test(c.verbatim ?? '')) &&
      (!topico || (c.topic ?? []).includes(topico)) &&
      (!modo || c.modo === modo) &&
      (!scope || c.scope === scope) &&
      (!tier || c.tier === tier) &&
      (!genero || GENERO_POR_REF.get(c.src) === genero),
  );
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

  console.log(`\n${achados.length} claim(s) para ${filtro}:\n`);
  if (cortou) console.log(banner('SAÍDA TRUNCADA'));
  for (const c of mostrados) console.log(mostrar(c));
  if (cortou) console.log(banner('SAÍDA TRUNCADA — fim da amostra'));

  // Zero resultado NÃO é prova de ausência — é prova de que este vocabulário não
  // acha. Quem lê isto tende a concluir a coisa errada, então o aviso vem junto.
  if (achados.length === 0) {
    console.log('  (zero resultados diz que ESTE termo não acha, não que o assunto está ausente —');
    console.log('   tente inglês, gíria, e o termo do canal antes de declarar lacuna de conteúdo)\n');
  }
}

if (ids.length === 0 && !filtrando) {
  console.error('nada a fazer: passe ids (V014-03) ou um filtro (--grep/--topic/--modo/--scope/--tier/--genero)');
  process.exit(2);
}

process.exit(saiuRuim ? 1 : 0);
