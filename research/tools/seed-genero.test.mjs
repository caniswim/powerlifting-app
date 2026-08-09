#!/usr/bin/env node
/**
 * Quem verifica a semeadura do `genero`.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE ──────────────────────────────────────────────
 *
 * `genero` é o campo do manifesto de que a trava de `prescricao` em gênero
 * restrito depende (`check-claims.mjs`, `TETO_PRESCRICAO_EM_GENERO_RESTRITO`), e
 * `seed-genero.mjs` é o único lugar que sabe escrevê-lo. `verify-manifest.mjs`
 * recusa manifesto com vídeo sem gênero e manda, na mensagem de erro, rodar o
 * seed. Ou seja: o seed é o CONSERTO documentado de uma trava vermelha.
 *
 * Até 09/08/2026 esse conserto não funcionava, e mentia dizendo que tinha
 * funcionado. O laço que gravava o campo copiava o valor velho por cima do
 * recém-derivado sempre que a chave `genero` já existisse — inclusive com o
 * `genero: null` que o `build-manifest.mjs` escreve numa reconstrução. O script
 * imprimia "354 de 551 vídeos receberam gênero" e "→ manifesto escrito", e o
 * arquivo saía inalterado. Ver `comGenero` em `kb.mjs` para o defeito literal.
 *
 * A prova que existia antes deste arquivo era `--refresh --dry`, e ela não podia
 * pegar o defeito: `--dry` compara o valor derivado com o valor no arquivo e
 * **nunca passa pelo caminho da escrita**. É a forma mais barata de um teste
 * verde sem prova — mede o que o script pensa, não o que ele grava.
 *
 * Então o caso central aqui é ponta a ponta e destrutivo: zera o `genero` dos
 * 354 vídeos do Blevins (exatamente como um `build-manifest.mjs --refresh`
 * deixaria), roda o seed sobre o arquivo encenado e exige que os 354 voltem
 * **iguais aos que estão commitados**. Isso prova de uma vez a gravação e a
 * reprodutibilidade da classificação — que é a afirmação da qual o `GENERO.md`
 * inteiro depende.
 *
 * Uso: node research/tools/seed-genero.test.mjs
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { comGenero, GENEROS, GENEROS_SEM_PRESCRICAO } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SEED = join(ROOT, 'research/tools/seed-genero.mjs');
const VERIFICADOR = join(ROOT, 'research/tools/verify-manifest.mjs');

const MANIFESTOS = {
  vena: join(ROOT, 'research/corpus/manifest.json'),
  blevins: join(ROOT, 'research/corpus/blevins/manifest.json'),
};

let falhas = 0;
const ok = (nome) => console.log(`  ✓ ${nome}`);
const falhou = (nome, detalhe) => {
  console.error(`  ✗ ${nome}\n      ${detalhe}`);
  falhas += 1;
};

console.log('\nTeste da semeadura de gênero');

// ── 1. `comGenero`, o laço de gravação isolado ───────────────────────────────
//
// Cada caso é uma forma que o vídeo do manifesto assume na vida real, e o do
// meio é o defeito.

const CASOS_UNITARIOS = [
  {
    nome: 'vídeo sem a chave `genero` recebe o valor',
    v: { ref: 'G001', title: 'x', durationSec: 10 },
    genero: 'review-de-programa',
  },
  {
    nome: '`genero: null` (o que build-manifest.mjs escreve) recebe o valor derivado',
    v: { ref: 'G001', title: 'x', genero: null, durationSec: 10 },
    genero: 'review-de-programa',
  },
  {
    nome: '`genero` antigo é SUBSTITUÍDO pelo derivado (é o que --refresh promete)',
    v: { ref: 'G001', title: 'x', genero: 'aula', durationSec: 10 },
    genero: 'review-de-programa',
  },
];

for (const caso of CASOS_UNITARIOS) {
  const out = comGenero(caso.v, caso.genero);
  if (out.genero !== caso.genero) {
    falhou(caso.nome, `gravou "${out.genero}" e devia gravar "${caso.genero}"`);
  } else {
    ok(caso.nome);
  }
}

{
  // A ordem das chaves é uma promessa escrita no código ("`genero` logo depois
  // de `title`, porque é lido junto com ele") e é o que faz o manifesto
  // continuar legível à mão. Um objeto remontado erra isso fácil.
  const nome = '`genero` fica logo depois de `title` e o resto mantém a ordem';
  const chaves = Object.keys(comGenero({ ref: 'G001', title: 'x', genero: 'aula', durationSec: 10, url: 'u' }, 'clipe'));
  const esperado = ['ref', 'title', 'genero', 'durationSec', 'url'];
  if (chaves.join(',') !== esperado.join(',')) falhou(nome, `ordem ${chaves.join(',')}`);
  else ok(nome);
}

// ── 2. Ponta a ponta, pelo caminho da escrita ────────────────────────────────

/** Roda o seed sobre uma cópia encenada e devolve o manifesto resultante. */
function semear(fonte, mutar, extraArgs = []) {
  const dir = mkdtempSync(join(tmpdir(), 'seed-genero-test-'));
  const file = join(dir, 'manifest.json');
  try {
    const m = JSON.parse(readFileSync(MANIFESTOS[fonte], 'utf8'));
    mutar(m);
    writeFileSync(file, `${JSON.stringify(m, null, 2)}\n`);
    const saida = execFileSync('node', [SEED, '--source', fonte, '--manifest', file, ...extraArgs], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { manifest: JSON.parse(readFileSync(file, 'utf8')), saida, file, dir };
  } catch (err) {
    rmSync(dir, { recursive: true, force: true });
    throw err;
  }
}

for (const fonte of Object.keys(MANIFESTOS)) {
  const nome = `${fonte}: manifesto reconstruído (todo genero null) volta IGUAL ao commitado`;
  const commitado = new Map(
    JSON.parse(readFileSync(MANIFESTOS[fonte], 'utf8')).videos.map((v) => [v.ref, v.genero]),
  );
  let r;
  try {
    r = semear(fonte, (m) => { for (const v of m.videos) v.genero = null; });
  } catch (err) {
    falhou(nome, `o seed quebrou: ${err.message}`);
    continue;
  }

  const nulos = r.manifest.videos.filter((v) => v.genero === null || v.genero === undefined);
  const divergentes = r.manifest.videos.filter((v) => v.genero !== commitado.get(v.ref));

  if (nulos.length > 0) {
    falhou(nome, `${nulos.length} de ${r.manifest.videos.length} vídeos continuaram sem gênero (ex.: ${nulos.slice(0, 3).map((v) => v.ref).join(', ')})`);
  } else if (divergentes.length > 0) {
    falhou(
      nome,
      `${divergentes.length} vídeos re-derivaram para outro valor — a classificação não é reproduzível ` +
        `(ex.: ${divergentes.slice(0, 3).map((v) => `${v.ref} ${commitado.get(v.ref)}→${v.genero}`).join(', ')})`,
    );
  } else {
    ok(`${nome} (${r.manifest.videos.length} vídeos)`);
  }

  // E o manifesto ressemeado tem que passar pelo verificador — inclusive pela
  // exigência de `genero`, que é o que fecha o círculo entre a trava e o
  // conserto que ela manda fazer.
  const nomeV = `${fonte}: o manifesto ressemeado passa no verify-manifest`;
  try {
    execFileSync('node', [VERIFICADOR, '--source', fonte, '--manifest', r.file], { encoding: 'utf8', stdio: 'pipe' });
    ok(nomeV);
  } catch (err) {
    falhou(nomeV, `${err.stdout ?? ''}${err.stderr ?? ''}`.split('\n').filter((l) => l.includes('✗')).slice(0, 3).join(' | '));
  }
  rmSync(r.dir, { recursive: true, force: true });
}

{
  // O caso que prova que a escrita é seletiva e não um "reescreve tudo": UM
  // vídeo restrito perde o gênero, o seed devolve exatamente aquele vídeo ao
  // valor certo, e nenhum outro se mexe.
  const nome = 'blevins: um único vídeo de review perdendo o gênero é devolvido a review-de-programa';
  const commitado = new Map(
    JSON.parse(readFileSync(MANIFESTOS.blevins, 'utf8')).videos.map((v) => [v.ref, v.genero]),
  );
  if (commitado.get('G001') !== 'review-de-programa') {
    falhou(nome, 'G001 deixou de ser review-de-programa — o caso perdeu o alvo, reescreva-o');
  } else {
    const r = semear('blevins', (m) => { delete m.videos.find((v) => v.ref === 'G001').genero; });
    const g = r.manifest.videos.find((v) => v.ref === 'G001').genero;
    const outros = r.manifest.videos.filter((v) => v.ref !== 'G001' && v.genero !== commitado.get(v.ref));
    if (g !== 'review-de-programa') falhou(nome, `G001 ficou "${g}"`);
    else if (outros.length > 0) falhou(nome, `${outros.length} vídeos que ninguém tocou mudaram de gênero`);
    else ok(nome);
    rmSync(r.dir, { recursive: true, force: true });
  }
}

{
  // A garantia de que a semeadura não consegue inventar valor fora do enumerado
  // — e, de quebra, que o enumerado e os restritos não divergiram.
  const nome = 'todo gênero commitado está no enumerado de kb.mjs';
  const fora = [];
  for (const f of Object.keys(MANIFESTOS)) {
    for (const v of JSON.parse(readFileSync(MANIFESTOS[f], 'utf8')).videos) {
      if (!GENEROS.has(v.genero)) fora.push(`${v.ref}="${v.genero}"`);
    }
  }
  if (fora.length > 0) falhou(nome, fora.slice(0, 5).join(', '));
  else ok(nome);

  const nomeR = 'os gêneros restritos existem no enumerado (nome trocado desligaria a trava)';
  const orfaos = [...GENEROS_SEM_PRESCRICAO].filter((g) => !GENEROS.has(g));
  if (orfaos.length > 0) falhou(nomeR, `${orfaos.join(', ')} não está em GENEROS`);
  else ok(nomeR);
}

if (falhas > 0) {
  console.error(`\n✗ ${falhas} caso(s) falharam — a semeadura de gênero não faz o que promete\n`);
  process.exit(1);
}

console.log('\n✓ a semeadura de gênero grava o que diz que grava, e re-derivar devolve o mesmo\n');
