#!/usr/bin/env node
/**
 * Quem verifica o verificador do manifesto.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE ──────────────────────────────────────────────
 *
 * `verify-manifest.mjs` é o único lugar do repositório que exige `genero` em
 * todo vídeo. E `genero` não é um campo decorativo: `check-claims.mjs` conta
 * `modo: prescricao` vinda de vídeo `review-de-programa`/`form-check`/
 * `coaching-call` contra um teto por `src`, e a forma como essa trava se
 * desliga não é com erro — é com silêncio. Um manifesto reconstruído sem passar
 * pelo `seed-genero.mjs` deixa `genero` ausente, `GENEROS_SEM_PRESCRICAO` deixa
 * de casar com coisa nenhuma, e a contagem de violações cai para zero. Zero
 * violações é exatamente o resultado que a trava reporta como sucesso.
 *
 * Até 09/08/2026 a resposta a isso era uma frase no `GENERO.md` dizendo que o
 * invariante estava coberto por este verificador. Frase sobre código que ninguém
 * executou é o modo de falha nº 4 desta casa: a trava que se declara viva e
 * passa verde quando o alvo foi apagado. Então cada invariante que o
 * `verify-manifest.mjs` promete vira aqui um manifesto deliberadamente quebrado
 * daquele jeito específico, e exige-se que ele reprove COM A MENSAGEM CERTA.
 *
 * A mensagem importa tanto quanto o código de saída. Um manifesto mutilado
 * reprova por muitos motivos ao mesmo tempo; sem casar o texto, um teste ficaria
 * verde porque o verificador reclamou de outra coisa — e continuaria verde no
 * dia em que a checagem de `genero` fosse apagada.
 *
 * ── COMO ────────────────────────────────────────────────────────────────────
 *
 * O manifesto de partida é o REAL, copiado para um temporário e mutado ali. Um
 * manifesto escrito à mão poderia passar (ou falhar) por acidente de algo que
 * eu mesmo inventei; partindo de um que o verificador já aprova, qualquer
 * reprovação depois da mutação é atribuível à mutação. É a mesma regra do
 * `check-claims.test.mjs`.
 *
 * `--manifest` redireciona só o arquivo do manifesto: o `PROGRAMA.md` que ancora
 * o offset e as transcrições continuam sendo os de verdade, então a reprovação
 * nunca é por arquivo ausente.
 *
 * Uso: node research/tools/verify-manifest.test.mjs
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VERIFICADOR = join(ROOT, 'research/tools/verify-manifest.mjs');

const MANIFESTOS = {
  vena: join(ROOT, 'research/corpus/manifest.json'),
  blevins: join(ROOT, 'research/corpus/blevins/manifest.json'),
};

const original = (fonte) => JSON.parse(readFileSync(MANIFESTOS[fonte], 'utf8'));

/** Roda o verificador sobre um manifesto no disco temporário. */
function roda(fonte, manifest) {
  const dir = mkdtempSync(join(tmpdir(), 'manifest-test-'));
  const file = join(dir, 'manifest.json');
  try {
    writeFileSync(file, JSON.stringify(manifest, null, 2));
    execFileSync('node', [VERIFICADOR, '--source', fonte, '--manifest', file], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { passou: true, saida: '' };
  } catch (err) {
    return { passou: false, saida: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * O índice de um vídeo qualquer que não seja o primeiro. Mutar o primeiro é
 * tentador e é pior: ele é o mais provável de estar em qualquer amostra que
 * alguém olhe à mão, e um defeito que só se manifesta no meio da lista é o que
 * este verificador existe para pegar.
 */
const ALVO = 7;

const CASOS = [
  {
    fonte: 'vena',
    nome: 'vídeo sem `genero` — o manifesto reconstruído sem o seed-genero',
    esperado: /sem `genero`.*seed-genero/s,
    mutar: (m) => { delete m.videos[ALVO].genero; },
  },
  {
    fonte: 'blevins',
    nome: 'vídeo sem `genero` na segunda fonte (a que tem os vídeos de review)',
    esperado: /sem `genero`.*seed-genero/s,
    mutar: (m) => { delete m.videos[ALVO].genero; },
  },
  {
    fonte: 'vena',
    nome: '`genero` nulo não passa por ausência de chave',
    esperado: /sem `genero`/,
    mutar: (m) => { m.videos[ALVO].genero = null; },
  },
  {
    fonte: 'blevins',
    nome: '`genero` fora do enumerado de kb.mjs',
    esperado: /genero "vlog" fora do enumerado/,
    // `vlog` de propósito: é o valor que o ESTADO.md sugeriu e o GENERO.md
    // recusou. Um typo qualquer provaria menos — este é o valor que alguém de
    // fato tentaria escrever.
    mutar: (m) => { m.videos[ALVO].genero = 'vlog'; },
  },
  {
    fonte: 'blevins',
    nome: 'um único vídeo de review perdendo o gênero derruba a fonte inteira',
    esperado: /G001: sem `genero`/,
    mutar: (m) => {
      const v = m.videos.find((x) => x.ref === 'G001');
      if (v?.genero !== 'review-de-programa') {
        throw new Error('G001 deixou de ser review-de-programa — o caso perdeu o alvo, reescreva-o');
      }
      delete v.genero;
    },
  },
  {
    // O REBAIXAMENTO, que é o buraco que o `genero` ausente NÃO cobria. `aula` é
    // um valor legítimo do enumerado, o campo continua lá, e `check-claims.mjs`
    // aceita numa boa — as 7 violações do `G020` somem e o build fica verde. É o
    // atalho que um build vermelho convida a tomar, porque é mais rápido do que
    // reabrir a claim.
    fonte: 'blevins',
    nome: 'vídeo de review rebaixado para `aula` — o jeito fácil de desligar a trava',
    esperado: /G020: genero rebaixado de "review-de-programa" para "aula"/,
    mutar: (m) => { m.videos.find((x) => x.ref === 'G020').genero = 'aula'; },
  },
  {
    // O mesmo no Vena, que tem UM vídeo restrito só: um roster que só valesse
    // para a fonte grande deixaria `R047` sem cobertura e ninguém notaria.
    fonte: 'vena',
    nome: 'o único review do Vena rebaixado para `log-de-treino`',
    esperado: /R047: genero rebaixado de "review-de-programa"/,
    mutar: (m) => { m.videos.find((x) => x.ref === 'R047').genero = 'log-de-treino'; },
  },
  {
    // Rebaixar de um restrito para OUTRO restrito também é reclassificação a
    // registrar — e este caso é o que impede a checagem de virar "está em algum
    // gênero restrito", que aceitaria `form-check` virar `coaching-call` calado.
    fonte: 'blevins',
    nome: 'form check reclassificado como coaching call, sem passar pelo roster',
    esperado: /G029: genero rebaixado de "form-check" para "coaching-call"/,
    mutar: (m) => { m.videos.find((x) => x.ref === 'G029').genero = 'coaching-call'; },
  },
  {
    fonte: 'blevins',
    nome: 'vídeo do roster sumindo do manifesto leva a trava dele junto',
    esperado: /G242 está no roster de gênero travado e não existe mais/,
    mutar: (m) => {
      // A cauda do manifesto é cortada, como num build feito antes de o canal
      // ter aqueles vídeos. Cortar da CAUDA e não do meio é o ponto: o ref é
      // posicional, então tirar do meio renumeraria tudo e a reprovação viria de
      // rebaixamento em cascata — falhar pelo motivo errado é teste verde sem
      // prova. Cortando o fim, `G001`–`G241` seguem intactos e só `G242` some.
      const corte = m.videos.findIndex((x) => x.ref === 'G242');
      m.videos = m.videos.slice(0, corte);
      m.videoCount = m.videos.length;
      m.citableCount = m.videos.filter((v) => !v.postRun1).length;
    },
  },
  // ── Os invariantes que este arquivo já prometia antes do `genero`, e que
  //    também nunca tinham sido executados por ninguém. Estão aqui porque o
  //    custo é uma linha cada e porque deslocamento silencioso é o defeito que
  //    dá nome ao verificador.
  {
    fonte: 'vena',
    nome: 'rNumber que não bate com a posição (manifesto editado à mão)',
    esperado: /rNumber 999 não bate com a posição/,
    mutar: (m) => { m.videos[ALVO].rNumber = 999; },
  },
  {
    fonte: 'vena',
    nome: 'ref duplicado — duas citações resolvendo para o mesmo vídeo',
    esperado: /duplicado/,
    mutar: (m) => { m.videos[ALVO].ref = m.videos[ALVO - 1].ref; },
  },
  {
    fonte: 'vena',
    nome: 'âncora semântica quebrada — o canal publicou e ninguém ajustou postRun1',
    esperado: /deveria casar/,
    mutar: (m) => {
      const v = m.videos.find((x) => x.rNumber === 1);
      v.title = 'um título que não é o do vídeo âncora';
    },
  },
];

console.log('\nTeste do verificador de manifesto');

let falhas = 0;

// Controle: os dois manifestos reais, copiados sem mutação, têm de passar. Sem
// isto, um caminho quebrado no harness faria TODOS os casos abaixo ficarem
// verdes de graça — cada um deles espera reprovação.
for (const fonte of Object.keys(MANIFESTOS)) {
  const r = roda(fonte, original(fonte));
  if (r.passou) {
    console.log(`  ✓ controle: o manifesto real de ${fonte} passa`);
  } else {
    console.error(`  ✗ CONTROLE: o manifesto real de ${fonte} não passou sem mutação nenhuma.`);
    console.error(r.saida.split('\n').slice(0, 12).join('\n'));
    process.exit(1);
  }
}

for (const caso of CASOS) {
  const m = original(caso.fonte);
  caso.mutar(m);
  const r = roda(caso.fonte, m);

  if (r.passou) {
    console.error(`  ✗ ${caso.nome}\n      o verificador APROVOU um manifesto que deveria recusar`);
    falhas += 1;
  } else if (!caso.esperado.test(r.saida)) {
    console.error(
      `  ✗ ${caso.nome}\n      reprovou pelo motivo ERRADO — nada casou ${caso.esperado}\n` +
        `      ${r.saida.split('\n').filter((l) => l.includes('✗')).slice(0, 3).join('\n      ')}`,
    );
    falhas += 1;
  } else {
    console.log(`  ✓ ${caso.nome}`);
  }
}

/**
 * O outro lado, sem o qual o roster de gênero travado seria uma trava que recusa
 * coisa legítima. A checagem é de MÃO ÚNICA: marcar um vídeo novo como restrito
 * é o lado seguro e não passa por registro nenhum. Se este caso ficar vermelho,
 * a checagem virou bidirecional e o custo caiu em cima de quem está fazendo a
 * coisa certa — que é como se ensina alguém a ignorar o aviso.
 */
const CASOS_QUE_PASSAM = [
  {
    fonte: 'blevins',
    nome: 'vídeo que GANHA gênero restrito passa sem estar no roster',
    mutar: (m) => {
      const v = m.videos.find((x) => x.genero === 'log-de-treino');
      v.genero = 'review-de-programa';
    },
  },
  {
    fonte: 'blevins',
    nome: 'vídeo fora do roster trocando de gênero não-restrito passa',
    mutar: (m) => {
      const v = m.videos.find((x) => x.genero === 'log-de-treino');
      v.genero = 'clipe';
    },
  },
];

for (const caso of CASOS_QUE_PASSAM) {
  const m = original(caso.fonte);
  caso.mutar(m);
  const r = roda(caso.fonte, m);
  if (r.passou) {
    console.log(`  ✓ aceita: ${caso.nome}`);
  } else {
    console.error(
      `  ✗ FALSO POSITIVO: ${caso.nome}\n      ` +
        r.saida.split('\n').filter((l) => l.includes('✗')).slice(0, 3).join('\n      '),
    );
    falhas += 1;
  }
}

const TOTAL = CASOS.length + CASOS_QUE_PASSAM.length;
if (falhas > 0) {
  console.error(`\n✗ ${falhas} de ${TOTAL} casos falharam — o verificador de manifesto não pega o que promete\n`);
  process.exit(1);
}

console.log(`\n✓ o verificador de manifesto cumpre os ${TOTAL} casos que promete\n`);
