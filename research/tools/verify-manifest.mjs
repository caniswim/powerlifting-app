#!/usr/bin/env node
/**
 * Trava o manifesto de um corpus contra deslocamento silencioso.
 *
 * O manifesto é derivado da ordem do canal, e a ordem do canal muda toda vez que
 * o autor publica um vídeo. Se alguém regerar sem ajustar o `postRun1` da fonte,
 * todo `[Rxxx]` passa a apontar para o vizinho — e nada quebra, nada avisa, a
 * base inteira fica um vídeo fora de fase. É o tipo de erro que só aparece
 * quando você já treinou seis semanas em cima dele.
 *
 * Então a suposição vira invariante executável, como no parser de notas: seis
 * âncoras semânticas, colhidas do que sobrou da run 1 (`research/recuperado/`),
 * onde o conteúdo do vídeo identifica o número sem ambiguidade.
 *
 * MAS ÂNCORA NÃO É UNIVERSAL. Ela só existe onde já havia citação anterior para
 * amarrar número a assunto. Uma fonte nova (Blevins) não tem `recuperado/`, não
 * tem documento citando `[Gxxx]`, e portanto NÃO TEM COMO ter o alinhamento
 * verificado — inventar uma âncora ali seria eu confirmando meu próprio palpite,
 * e passar em silêncio seria pior ainda: carimbaria de "verificado" o que
 * ninguém verificou. Para essas fontes este arquivo valida o que dá (integridade,
 * unicidade de ref, ordem cronológica) e DIZ, na saída, que a checagem de
 * deslocamento não se aplica.
 *
 * Uso: node research/tools/verify-manifest.mjs [--source blevins] [--manifest <caminho>]
 *   sem --source, verifica o corpus do Vena.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveSource, paths } from './sources.mjs';
import { GENEROS } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE = resolveSource();

/**
 * `--manifest <caminho>` redireciona SÓ o arquivo do manifesto; todo o resto dos
 * caminhos (o `PROGRAMA.md` que ancora o offset, as transcrições) continua
 * apontando para o repositório de verdade.
 *
 * Existe para `verify-manifest.test.mjs`, e a estreiteza é o ponto: este arquivo
 * é o ÚNICO lugar que exige `genero` no manifesto, e é dele que a trava de
 * `prescricao` em gênero restrito depende para não se desligar em silêncio. Sem
 * uma forma de encenar um manifesto quebrado, "o verificador exige gênero" era
 * uma afirmação sobre código que ninguém tinha executado — que é o modo de falha
 * nº 4 desta casa (a trava que passa verde quando o alvo é apagado).
 *
 * Um `--root` faria o mesmo e seria pior: mudaria junto o caminho do
 * `PROGRAMA.md` e das transcrições, e o teste passaria a reprovar por arquivo
 * ausente — falha pelo motivo errado, que é teste verde sem prova.
 */
const iManifest = process.argv.indexOf('--manifest');
const MANIFEST = iManifest >= 0 ? process.argv[iManifest + 1] : paths(SOURCE, ROOT).manifest;
if (iManifest >= 0 && !MANIFEST) {
  console.error('--manifest exige um caminho');
  process.exit(1);
}

/**
 * Cada âncora casa um número `[Rxxx]` com um padrão que só o título daquele
 * vídeo satisfaz. A procedência é o arquivo recuperado que amarra o número ao
 * assunto — sem ela isto seria eu confirmando meu próprio palpite.
 *
 * `citando` é o documento cujas citações precisam resolver: é dele que sai a
 * prova de unicidade do offset. Fonte sem entrada aqui é fonte ainda não citada.
 */
const ANCORAGEM = {
  vena: {
    citando: 'src/data/program/vena-block1/source/PROGRAMA.md',
    anchors: [
      { r: 1, re: /3 YEARS OF INJURIES/i, why: 'kb-sintese: [R1] é a régua de dor ~2/10 (regra D1)' },
      { r: 4, re: /PROGRAM That Got Me A 400KG SQUAT/i, why: 'kb-sintese: [R4] é a progressão linear declarada' },
      { r: 102, re: /NEVER do DELOADS/i, why: 'kb-sintese: [R102] é o "never deload" da contradição do taper' },
      { r: 113, re: /Squat Exercise TIER LIST/i, why: 'kb-sintese: [R113] é o tier list que rebaixa para tier B' },
      { r: 159, re: /STOP TRYING TO SQUAT UPRIGHT/i, why: 'kb-sintese: [R159] é "o cue-bandeira do canal"' },
      { r: 168, re: /Best Squat Accessory/i, why: 'kb-sintese: [R168] é "o acessório de agacho nº 1 dele"' },
    ],
  },
};

const ancoragem = ANCORAGEM[SOURCE.id] ?? null;

/**
 * OS VÍDEOS CUJO GÊNERO NÃO PODE CAIR SOZINHO.
 *
 * A trava de `check-claims.mjs` só conta `prescricao` quando o gênero do vídeo
 * está em `GENEROS_SEM_PRESCRICAO`. Exigir que o campo EXISTA e esteja no
 * enumerado — que é o que a checagem logo abaixo faz — fecha o caso do
 * manifesto reconstruído sem seed. Não fecha o caso mais fácil de todos:
 * **trocar o valor por outro válido**.
 *
 *     node -e "…G020.genero = 'aula'…"   →  verify-manifest passa
 *                                            check-claims passa
 *                                            7 violações somem, exit 0
 *
 * `aula` é um gênero legítimo, o campo continua lá, e a única pegada é a linha
 * de resumo caindo de 76 para 69 — indistinguível de alguém ter consertado sete
 * claims. É o modo de falha nº 4 desta casa outra vez: a trava que passa verde
 * quando o alvo é apagado. E é o caminho que um build vermelho convida a tomar,
 * porque rebaixar o gênero é mais rápido do que reabrir a claim.
 *
 * Então o roster abaixo congela os 39 vídeos que HOJE declaram gênero restrito.
 * Um deles mudar de valor é erro, e o conserto é editar esta lista à mão, com o
 * motivo — que é exatamente a fricção que se quer.
 *
 * **A checagem é de mão única, de propósito.** Vídeo que GANHA gênero restrito
 * não precisa ser registrado aqui: mais trava é o lado seguro, e obrigar
 * registro no lado seguro é a fricção que faz alguém desistir de marcar. É a
 * mesma assimetria do `GENERO.md` §3.
 *
 * Note quem está na lista sem ter claim nenhuma extraída (`G101`, `G106`, a
 * série PPST, `G135`, `G176`, `G242`): é lá que o roster paga mais, porque um
 * rebaixamento silencioso ali não mexe em número nenhum de hoje e só apareceria
 * como prescrição aceita numa extração futura.
 */
const GENERO_TRAVADO = {
  vena: {
    R047: 'review-de-programa',
  },
  blevins: {
    G001: 'review-de-programa', G002: 'review-de-programa', G003: 'review-de-programa',
    G005: 'review-de-programa', G007: 'review-de-programa', G009: 'review-de-programa',
    G010: 'review-de-programa', G011: 'review-de-programa', G012: 'review-de-programa',
    G013: 'review-de-programa', G014: 'review-de-programa', G015: 'review-de-programa',
    G016: 'review-de-programa', G017: 'review-de-programa', G018: 'review-de-programa',
    G019: 'review-de-programa', G020: 'review-de-programa', G027: 'form-check',
    G028: 'form-check', G029: 'form-check', G030: 'form-check', G031: 'form-check',
    G101: 'coaching-call', G106: 'coaching-call', G135: 'review-de-programa',
    G176: 'review-de-programa', G182: 'review-de-programa', G185: 'review-de-programa',
    G191: 'review-de-programa', G195: 'review-de-programa', G196: 'review-de-programa',
    G197: 'review-de-programa', G198: 'review-de-programa', G199: 'review-de-programa',
    G200: 'review-de-programa', G202: 'review-de-programa', G203: 'review-de-programa',
    G242: 'review-de-programa',
  },
};

const travados = GENERO_TRAVADO[SOURCE.id] ?? {};

if (!existsSync(MANIFEST)) {
  console.error(
    `\n${MANIFEST} não existe.\n` +
      `  → node research/tools/build-manifest.mjs --source ${SOURCE.id}\n`,
  );
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const videos = manifest.videos ?? [];
const byRef = new Map(videos.map((v) => [v.rNumber, v]));

const errors = [];
const warnings = [];

// 0. O manifesto tem que declarar de quem ele é. Sem `source`/`refPrefix` não dá
//    para saber se `--source blevins` abriu o arquivo do Blevins ou o do Vena; e
//    sem `builtAt`/`channelItemCount` não dá para responder "o canal andou quanto
//    desde o build?", que é a única defesa de uma fonte sem âncora semântica.
for (const f of ['source', 'refPrefix', 'builtAt', 'channelItemCount']) {
  if (manifest[f] === undefined || manifest[f] === null) {
    errors.push(`manifesto sem \`${f}\` — deslocamento fica indetectável (ver build-manifest.mjs)`);
  }
}
if (manifest.source && manifest.source !== SOURCE.id) {
  errors.push(`manifesto declara source "${manifest.source}" mas foi aberto como "${SOURCE.id}"`);
}
if (manifest.refPrefix && manifest.refPrefix !== SOURCE.refPrefix) {
  errors.push(
    `manifesto declara refPrefix "${manifest.refPrefix}" mas a fonte "${SOURCE.id}" usa "${SOURCE.refPrefix}"`,
  );
}

// 1. INTEGRIDADE — vale para toda fonte, com ou sem âncora. Um ref repetido faria
//    duas citações diferentes resolverem para o mesmo vídeo (ou para o errado, a
//    depender de quem ganhasse o índice), que é deslocamento sob outro nome.
const vistos = new Map();
const generos = new Map();
for (const [i, v] of videos.entries()) {
  const onde = `índice ${i + 1}`;
  if (!v.ref) errors.push(`${onde}: vídeo sem ref`);
  else if (vistos.has(v.ref)) errors.push(`ref ${v.ref} duplicado (${vistos.get(v.ref)} e ${onde})`);
  else vistos.set(v.ref, onde);
  if (v.ref && !v.ref.startsWith(SOURCE.refPrefix)) {
    errors.push(`${onde}: ref ${v.ref} não usa o prefixo "${SOURCE.refPrefix}" da fonte`);
  }
  if (!v.videoId) errors.push(`${v.ref ?? onde}: sem videoId — a citação não reabre no YouTube`);
  // A numeração é posicional por definição; se ela deixar de bater com a posição,
  // alguém editou o manifesto à mão e todo ref abaixo dali é suspeito.
  const esperado = i + 1 - (manifest.postRun1Count ?? 0);
  if (v.rNumber !== esperado) {
    errors.push(`${v.ref ?? onde}: rNumber ${v.rNumber} não bate com a posição (esperado ${esperado})`);
  }
  if (v.postRun1 !== (v.rNumber < 1)) {
    errors.push(`${v.ref ?? onde}: flag postRun1 não bate com rNumber ${v.rNumber}`);
  }
  // `genero` é obrigatório e enumerado fechado. É a única propriedade do vídeo
  // de que uma trava de CLAIM depende (`check-claims.mjs` recusa mais
  // `prescricao` do que o teto num vídeo de review ou de form check), e uma
  // trava que depende de um campo ausente não falha: ela se desliga em silêncio.
  // Por isso a exigência mora aqui, no verificador do manifesto, e não só lá.
  if (v.genero === undefined || v.genero === null) {
    errors.push(`${v.ref ?? onde}: sem \`genero\` — rode \`node research/tools/seed-genero.mjs\` (ver research/kb/GENERO.md)`);
  } else if (!GENEROS.has(v.genero)) {
    errors.push(`${v.ref ?? onde}: genero "${v.genero}" fora do enumerado de kb.mjs`);
  } else {
    generos.set(v.genero, (generos.get(v.genero) ?? 0) + 1);
    // Rebaixamento: o campo continua lá, válido, e a trava de prescrição some.
    // Ver o comentário de `GENERO_TRAVADO`.
    const travado = travados[v.ref];
    if (travado && v.genero !== travado) {
      errors.push(
        `${v.ref}: genero rebaixado de "${travado}" para "${v.genero}" — esse vídeo está no roster ` +
          `de gênero travado de verify-manifest.mjs, e rebaixá-lo DESLIGA a trava de prescricao ` +
          `dele em check-claims.mjs sem quebrar nada. Se a reclassificação é intencional, edite o ` +
          `roster à mão, com o motivo`,
      );
    }
  }
}
// Ref do roster que sumiu do manifesto some junto com a trava dele, e some sem
// ruído: `travados[v.ref]` simplesmente nunca é consultado.
for (const ref of Object.keys(travados)) {
  if (!videos.some((v) => v.ref === ref)) {
    errors.push(
      `${ref} está no roster de gênero travado e não existe mais no manifesto — ou o ref deslocou, ` +
        `ou o vídeo saiu do canal; nos dois casos a trava de prescricao dele deixou de existir`,
    );
  }
}
if (manifest.videoCount !== videos.length) {
  errors.push(`videoCount ${manifest.videoCount} não bate com ${videos.length} vídeos no arquivo`);
}
const citaveis = videos.filter((v) => !v.postRun1).length;
if (manifest.citableCount !== citaveis) {
  errors.push(`citableCount ${manifest.citableCount} não bate com ${citaveis} vídeos citáveis`);
}

// 2. ORDEM CRONOLÓGICA — a numeração assume canal em ordem decrescente de data.
//    Fica em aviso, e não em erro, porque uma inversão é o canal desmentindo a
//    premissa (republicação, estreia agendada), não defeito do manifesto: o
//    conserto seria renumerar citações, e isso é decisão humana.
const datados = videos.filter((v) => v.date);
const inversoes = datados.filter((v, i) => i > 0 && v.date > datados[i - 1].date);
if (inversoes.length > 0) {
  warnings.push(
    `${inversoes.length} inversão(ões) cronológica(s): ${inversoes
      .slice(0, 5)
      .map((v) => `${v.ref} ${v.date}`)
      .join(', ')}`,
  );
}
if (datados.length < videos.length) {
  warnings.push(`${videos.length - datados.length} vídeo(s) sem data — "o recente vence" não é computável neles`);
}

// 3. ÂNCORAS + UNICIDADE DO OFFSET — só onde existe citação prévia para ancorar.
let pairs = [];
let rival = [];
let cited = new Set();
if (ancoragem) {
  for (const a of ancoragem.anchors) {
    const v = byRef.get(a.r);
    if (!v) {
      errors.push(`${SOURCE.refPrefix}${a.r} não existe no manifesto`);
      continue;
    }
    if (!a.re.test(v.title)) {
      errors.push(
        `${SOURCE.refPrefix}${a.r} deveria casar ${a.re} mas o manifesto traz "${v.title}"\n` +
          `      procedência: ${a.why}\n` +
          `      → o canal provavelmente publicou vídeo novo; ajuste \`postRun1\` da fonte "${SOURCE.id}" em research/tools/sources.mjs`,
      );
    }
  }

  const programa = readFileSync(join(ROOT, ancoragem.citando), 'utf8');
  const CITA = new RegExp(`\\[${SOURCE.refPrefix}(\\d+)(?:\\s|@|,|\\])`, 'g');
  const CITA_AT = new RegExp(`\\[${SOURCE.refPrefix}(\\d+)\\s*@\\s*([\\d:,\\s]+)\\]`, 'g');

  // 3a. Toda citação do documento tem que resolver para um vídeo citável.
  cited = new Set([...programa.matchAll(CITA)].map((m) => Number(m[1])));
  const unresolved = [...cited].filter((r) => !byRef.has(r) || byRef.get(r).postRun1);
  if (unresolved.length > 0) {
    errors.push(`citações sem vídeo correspondente: ${unresolved.sort((a, b) => a - b).join(', ')}`);
  }

  // 3b. Timestamps não podem passar da duração do vídeo.
  for (const m of programa.matchAll(CITA_AT)) {
    const v = byRef.get(Number(m[1]));
    if (!v?.durationSec) continue;
    for (const stamp of m[2].split(',')) {
      const parts = stamp.trim().split(':').map(Number);
      if (parts.some(Number.isNaN)) continue;
      const sec = parts.reduce((acc, p) => acc * 60 + p, 0);
      if (sec > v.durationSec) {
        errors.push(
          `[${SOURCE.refPrefix}${m[1]} @${stamp.trim()}] passa da duração do vídeo (${v.durationSec}s) — "${v.title}"`,
        );
      }
    }
  }

  // 3c. UNICIDADE DO OFFSET — a checagem que transforma "plausível" em "determinado".
  //     As âncoras confirmam o alinhamento; esta prova que nenhum outro alinhamento
  //     serve. Cada timestamp citado é um teste: sob o offset errado, citações de
  //     vídeo longo caem em vídeo curto e estouram a duração. Empate aqui significa
  //     que as âncoras estão medindo menos do que parecem.
  pairs = [...programa.matchAll(CITA_AT)].flatMap((m) =>
    m[2]
      .split(',')
      .map((s) => ({ r: Number(m[1]), sec: s.trim().split(':').map(Number).reduce((a, p) => a * 60 + p, 0) }))
      .filter((x) => !Number.isNaN(x.sec)),
  );
  const violations = (off) =>
    pairs.filter((p) => {
      const v = byRef.get(p.r + off);
      return !v?.durationSec || p.sec > v.durationSec;
    }).length;

  rival = [-2, -1, 1, 2].map((off) => ({ off, bad: violations(off) }));
  const best = rival.filter((c) => c.bad <= violations(0));
  if (best.length > 0) {
    errors.push(
      `offset não é único: ${best.map((c) => `${c.off >= 0 ? '+' : ''}${c.off} (${c.bad} violações)`).join(', ')} ` +
        `empata ou bate o adotado (${violations(0)}). A numeração não está determinada pelos dados.`,
    );
  }
}

console.log(
  `\nManifesto de ${SOURCE.name} (${SOURCE.id}) — ${manifest.videoCount} vídeos, ${manifest.citableCount} citáveis`,
);
console.log(`  build .................... ${manifest.builtAt ?? '?'} · ${manifest.channelItemCount ?? '?'} itens no canal`);
console.log(`  refs únicos e posicionais . ${vistos.size}/${videos.length}`);
console.log(`  com data .................. ${datados.length}/${videos.length}`);
console.log(
  `  gêneros ................... ${[...generos].sort((a, b) => b[1] - a[1]).map(([g, n]) => `${g}:${n}`).join('  ')}`,
);
if (ancoragem) {
  console.log(`  âncoras verificadas ....... ${ancoragem.anchors.length}`);
  console.log(
    `  offset determinado ........ ${pairs.length} timestamps · 0 violações vs ${rival.map((c) => c.bad).join('/')} nos vizinhos`,
  );
  console.log(`  ${SOURCE.refPrefix} distintos citados ....... ${cited.size}`);
} else {
  // Dito em voz alta de propósito: silêncio aqui seria lido como "verificado".
  console.log('  âncoras verificadas ....... 0 — NÃO SE APLICA');
  console.log(`  offset determinado ........ NÃO VERIFICADO: "${SOURCE.id}" não tem citação prévia para ancorar.`);
  console.log('                              Só a integridade do manifesto foi checada; se o canal tiver');
  console.log('                              publicado depois do build, compare `channelItemCount` com o de hoje.');
}
console.log(`  duração total ............. ${(manifest.totalDurationSec / 3600).toFixed(1)} h`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} aviso(s):`);
  for (const x of warnings.slice(0, 10)) console.log(`  ⚠ ${x}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 20)) console.error(`  ✗ ${e}`);
  if (errors.length > 20) console.error(`  … e mais ${errors.length - 20}`);
  console.error('');
  process.exit(1);
}

console.log(
  ancoragem
    ? '\n✓ numeração alinhada com a run 1 e toda citação do programa resolve\n'
    : `\n✓ manifesto íntegro — alinhamento de "${SOURCE.id}" fica sem prova até existir citação\n`,
);
