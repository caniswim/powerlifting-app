#!/usr/bin/env node
/**
 * Quem verifica o recontador de canários.
 *
 * O `check-canarios.mjs` tem um modo de falha assimétrico e particularmente
 * feio: se o casamento de predicado parar de casar — uma chave renomeada, um
 * `return false` a mais, um filtro que deixou de ser aplicado —, TODA contagem
 * `vazio` vai a zero e ele imprime que está tudo impossível. Verde permanente,
 * medição morta. É exatamente o defeito que ele existe para impedir, cometido
 * por ele mesmo.
 *
 * Então os casos aqui vêm em pares: para cada dimensão do filtro, um canário
 * cujo predicado TEM de casar (e portanto reprovar) e um cujo predicado NÃO pode
 * casar. Um checker que só sabe dizer "zero" falha na primeira metade; um que
 * casa tudo falha na segunda.
 *
 * As claims são sintéticas de propósito: o teste precisa de uma base cujo
 * conteúdo ele conheça exatamente, e não de uma amostra do extract que muda
 * quando alguém ingere um vídeo.
 *
 * Uso: node research/tools/check-canarios.test.mjs
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CHECKER = join(ROOT, 'research/tools/check-canarios.mjs');

const dir = mkdtempSync(join(tmpdir(), 'canarios-test-'));

/** Uma base de bolso com todas as dimensões que o filtro sabe consultar. */
const BASE = [
  {
    id: 'G900-01', src: 'G900', at: '01:00', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['volume', 'deload'],
    claim: 'Ele manda fazer 5 séries no principal.',
    verbatim: 'he wants five sets on the main lift',
    params: [{ name: 'series', value: 5, unit: 'séries', frame: 'series' }],
  },
  {
    id: 'G900-02', src: 'G900', at: '02:00', tier: 'R', scope: 'PESSOAL', modo: 'narrativa',
    topic: ['cardio'],
    claim: 'Ele mesmo faz 20 minutos de esteira.',
    verbatim: 'i do twenty minutes on the treadmill',
    params: [{ name: 'tempo', value: 20, unit: 'min', frame: 'min' }],
  },
  {
    id: 'V900-01', src: 'R900', at: '03:00', tier: 'R', scope: 'GERAL', modo: 'opiniao',
    topic: ['tecnica'],
    claim: 'Ele acha que a maioria agacha ereto demais.',
    verbatim: 'most people squat way too upright',
    params: [],
  },
];
writeFileSync(join(dir, 'G900.jsonl'), BASE.filter((c) => c.src === 'G900').map((c) => JSON.stringify(c)).join('\n'));
writeFileSync(join(dir, 'R900.jsonl'), BASE.filter((c) => c.src === 'R900').map((c) => JSON.stringify(c)).join('\n'));

const canario = (extra) => ({
  id: 'T01',
  familia: 'impossivel',
  pergunta: 'pergunta de teste',
  porque: 'porque de teste',
  esperado: 'esperado de teste',
  ...extra,
});

function roda(canarios) {
  const f = join(dir, `canarios-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(f, JSON.stringify({ gerado: '2026-08-09', canarios }, null, 1));
  try {
    return { passou: true, saida: execFileSync('node', [CHECKER, '--extract', dir, '--canarios', f, '--verbose'], { encoding: 'utf8', stdio: 'pipe' }) };
  } catch (err) {
    return { passou: false, saida: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

const CASOS = [
  // ── o predicado precisa CASAR quando devia ────────────────────────────────
  {
    nome: 'impossível que deixou de ser impossível (filtro por tier)',
    canarios: [canario({ vazio: { descricao: 'claims tier R', filtro: { tier: 'R' } } })],
    esperado: /DEIXOU DE SER IMPOSSÍVEL.*3 claim/s,
  },
  {
    nome: 'filtro por srcPrefix realmente filtra por corpus',
    canarios: [canario({ vazio: { descricao: 'corpus G', filtro: { srcPrefix: 'G' } } })],
    esperado: /DEIXOU DE SER IMPOSSÍVEL.*2 claim/s,
  },
  {
    nome: 'filtro por tópico realmente filtra por tópico',
    canarios: [canario({ vazio: { descricao: 'cardio', filtro: { topicQualquer: ['cardio'] } } })],
    esperado: /G900-02/,
  },
  {
    nome: 'filtro por scope realmente filtra por scope',
    canarios: [canario({ vazio: { descricao: 'pessoal', filtro: { scope: 'PESSOAL' } } })],
    esperado: /G900-02/,
  },
  {
    nome: 'filtro por modo realmente filtra por modo',
    canarios: [canario({ vazio: { descricao: 'opinião', filtro: { modo: 'opiniao' } } })],
    esperado: /V900-01/,
  },
  {
    nome: 'filtro por frame realmente filtra por frame',
    canarios: [canario({ vazio: { descricao: 'séries', filtro: { frame: 'series' } } })],
    esperado: /G900-01/,
  },
  {
    nome: 'filtro por temParam realmente distingue claim com número',
    canarios: [canario({ vazio: { descricao: 'sem param', filtro: { temParam: false } } })],
    esperado: /V900-01/,
  },
  {
    nome: 'grep casa contra claim e verbatim',
    canarios: [canario({ vazio: { descricao: 'esteira', filtro: { grep: 'treadmill' } } })],
    esperado: /G900-02/,
  },
  {
    nome: 'lista de filtros é união, não interseção',
    canarios: [canario({ vazio: { descricao: 'união', filtro: [{ modo: 'opiniao' }, { topicQualquer: ['cardio'] }] } })],
    esperado: /2 claim/,
  },
  {
    nome: 'armadilha que parou de armar (ruído abaixo do mínimo)',
    canarios: [canario({
      familia: 'armadilha',
      vazio: { descricao: 'nada', filtro: { tier: 'O' } },
      ruido: { descricao: 'material vizinho', filtro: { topicQualquer: ['cardio'] }, minimo: 50 },
    })],
    esperado: /PAROU DE ARMAR/,
  },
  {
    nome: 'presente cujos ids sumiram da base',
    canarios: [canario({ familia: 'presente', sustenta: ['G900-01', 'V999-99'] })],
    esperado: /não existem mais.*V999-99/s,
  },
  {
    nome: 'presente cujo número deixou de ser derivável',
    canarios: [canario({ familia: 'presente', sustenta: ['G900-01'], numeros: [5, 9999] })],
    esperado: /os números 9999 não aparecem mais/,
  },

  // ── o predicado NÃO pode casar quando não devia ───────────────────────────
  {
    nome: 'CONTROLE: impossível que continua impossível',
    canarios: [canario({ vazio: { descricao: 'tier L', filtro: { tier: 'L' } } })],
    aprova: true,
  },
  {
    nome: 'interseção dentro de um filtro é E, não OU',
    // Nenhuma claim é do corpus G E do tópico técnica ao mesmo tempo.
    canarios: [canario({ vazio: { descricao: 'G + tecnica', filtro: { srcPrefix: 'G', topicQualquer: ['tecnica'] } } })],
    aprova: true,
  },
  {
    nome: 'topic exige TODOS os tópicos da lista',
    canarios: [canario({ vazio: { descricao: 'volume E cardio', filtro: { topic: ['volume', 'cardio'] } } })],
    aprova: true,
  },
  {
    nome: 'grepNao exclui o que casaria',
    canarios: [canario({ vazio: { descricao: 'cardio menos esteira', filtro: { topicQualquer: ['cardio'], grepNao: 'treadmill' } } })],
    aprova: true,
  },
  {
    nome: 'armadilha completa: vazio zerado e ruído suficiente',
    canarios: [canario({
      familia: 'armadilha',
      vazio: { descricao: 'tier O', filtro: { tier: 'O' } },
      ruido: { descricao: 'vizinhança', filtro: { tier: 'R' }, minimo: 3 },
    })],
    aprova: true,
  },
  {
    nome: 'presente íntegro passa',
    canarios: [canario({ familia: 'presente', sustenta: ['G900-01'], numeros: [5] })],
    aprova: true,
  },
  {
    nome: 'presente ancorado por frase que continua no texto passa',
    canarios: [canario({ familia: 'presente', sustenta: ['V900-01'], frases: ['agacha ereto demais'] })],
    aprova: true,
  },

  // ── os buracos que o ataque de 09/08/2026 abriu ───────────────────────────
  {
    // O ataque: reescrever as 9 claims de C02 e C04 para "O sol é quadrado".
    // Os ids continuavam vivos e os dois canários continuavam ✓ — inclusive o
    // que existe justamente para medir fidelidade de PROSA.
    nome: 'presente cuja frase sumiu do texto das claims que o sustentam',
    canarios: [canario({ familia: 'presente', sustenta: ['G900-01'], frases: ['o sol é quadrado'] })],
    esperado: /sumiram do texto das claims de sustenta/,
  },
  {
    nome: 'presente sem numeros e sem frases só prova que o id existe — recusado',
    canarios: [canario({ familia: 'presente', sustenta: ['G900-01'] })],
    esperado: /só prova que os ids EXISTEM/,
  },

  // ── a quarta família: `presente-escondido` ────────────────────────────────
  //
  // Ela cobra DUAS coisas em direções opostas, e os casos abaixo vêm em trio
  // por isso: a busca cega tem de continuar cega, a recuperação tem de achar, e
  // o caso de controle tem de passar. Um checker que só soubesse dizer "achei"
  // passaria no primeiro e reprovaria o segundo; um que só soubesse dizer "não
  // achei", o contrário.
  {
    // `treadmills` não casa `treadmill` por substring, e casa por RAIZ. É o
    // mecanismo do caso Q05 (`six times` × `six days a week`) em miniatura.
    nome: 'CONTROLE: escondido que a recuperação encontra por raiz',
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['G900-02'],
      frases: ['treadmill'],
      buscaCega: { descricao: 'plural que o literal não casa', termos: ['treadmills'] },
    })],
    aprova: true,
  },
  {
    nome: 'escondido que a busca cega já acha sozinha deixou de medir recuperação',
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['G900-02'],
      frases: ['treadmill'],
      buscaCega: { descricao: 'acha literal', termos: ['treadmill'] },
    })],
    esperado: /DEIXOU DE SER ESCONDIDO/,
  },
  {
    nome: 'escondido que a recuperação não alcança acusa a camada de busca, não a base',
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['G900-02'],
      frases: ['treadmill'],
      buscaCega: { descricao: 'termo sem ponte nenhuma', termos: ['zumbizinho'] },
    })],
    esperado: /RECUPERAÇÃO REGREDIU[\s\S]*NÃO saia comprando fonte nova/,
  },
  {
    nome: 'escondido sem buscaCega é recusado — seria um presente comum',
    canarios: [canario({ familia: 'presente-escondido', sustenta: ['G900-02'], frases: ['treadmill'] })],
    esperado: /exige buscaCega\.termos/,
  },
  {
    nome: 'chave inventada em buscaCega.filtro é recusada',
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['G900-02'],
      frases: ['treadmill'],
      buscaCega: { termos: ['treadmills'], filtro: { autor: 'vena' } },
    })],
    esperado: /buscaCega\.filtro: chave "autor" não existe/,
  },
  {
    nome: 'modo com typo em buscaCega.filtro é recusado',
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['G900-02'],
      frases: ['treadmill'],
      buscaCega: { termos: ['treadmills'], filtro: { modo: 'prescrição' } },
    })],
    esperado: /buscaCega\.filtro: modo "prescrição" fora do enumerado/,
  },
  {
    // O grep é o único campo de texto livre e o único que não era conferido.
    // `kreatin` em vez de `creatin` deixava o canário em zero, com ✓ e exit 0.
    nome: 'grep morto que narrowa outro filtro é recusado, não lido como zero',
    canarios: [canario({ vazio: { descricao: 'typo', filtro: { tier: 'R', grep: 'kreatin|dopping' } } })],
    esperado: /não casa NENHUMA claim na base inteira/,
  },
  {
    // O contra-caso que impede o conserto de virar dogma: quando o grep É o
    // predicado inteiro (o `PMID` de C06), zero É a medida.
    nome: 'grep sozinho pode ser zero — é o predicado, não um filtro auxiliar',
    canarios: [canario({ vazio: { descricao: 'literatura', filtro: { grep: 'PMID|\\b10\\.\\d{4,9}/' } } })],
    aprova: true,
  },
  {
    nome: 'campo de canário com typo é recusado em vez de ignorado',
    canarios: [canario({ familia: 'presente', sustenta: ['G900-01'], numeros: [5], frazes: ['x'] })],
    esperado: /campo "frazes" não existe no formato/,
  },

  // ── o canário mal escrito não pode passar por canário vivo ────────────────
  {
    // O typo é a falha silenciosa central: um filtro que nunca casa fica em zero
    // para sempre, e zero é o resultado que "impossível" reporta como sucesso.
    nome: 'tópico com typo é recusado em vez de virar zero permanente',
    canarios: [canario({ vazio: { descricao: 'typo', filtro: { topicQualquer: ['cardios'] } } })],
    esperado: /fora do vocabulário fechado/,
  },
  {
    nome: 'frame com typo é recusado',
    canarios: [canario({ vazio: { descricao: 'typo', filtro: { frame: 'seriess' } } })],
    esperado: /frame "seriess" fora do enumerado/,
  },
  {
    nome: 'tier com typo é recusado',
    canarios: [canario({ vazio: { descricao: 'typo', filtro: { tier: 'X' } } })],
    esperado: /tier "X" fora do enumerado/,
  },
  {
    nome: 'modo com typo é recusado',
    canarios: [canario({ vazio: { descricao: 'typo', filtro: { modo: 'prescrição' } } })],
    esperado: /modo "prescrição" fora do enumerado/,
  },
  {
    nome: 'chave de filtro inventada é recusada',
    canarios: [canario({ vazio: { descricao: 'chave', filtro: { autor: 'blevins' } } })],
    esperado: /chave de filtro "autor" não existe/,
  },
  {
    nome: 'srcPrefix de corpus que não existe é recusado',
    canarios: [canario({ vazio: { descricao: 'corpus', filtro: { srcPrefix: 'Z' } } })],
    esperado: /srcPrefix "Z" não existe na base/,
  },
  {
    nome: 'impossível sem predicado é recusado — seria canário sem prova',
    canarios: [canario({})],
    esperado: /exige vazio\.filtro/,
  },
  {
    nome: 'armadilha sem ruído é recusada',
    canarios: [canario({ familia: 'armadilha', vazio: { descricao: 'x', filtro: { tier: 'O' } } })],
    esperado: /exige ruido\.filtro/,
  },
  {
    nome: 'canário sem o porquê é recusado',
    canarios: [{ id: 'T02', familia: 'impossivel', pergunta: 'p', esperado: 'e', vazio: { filtro: { tier: 'L' } } }],
    esperado: /campo "porque" vazio/,
  },
  {
    nome: 'família inventada é recusada',
    canarios: [canario({ familia: 'talvez' })],
    esperado: /familia "talvez" fora de/,
  },
  {
    nome: 'id de canário duplicado é recusado',
    canarios: [
      canario({ vazio: { descricao: 'a', filtro: { tier: 'L' } } }),
      canario({ vazio: { descricao: 'b', filtro: { tier: 'E' } } }),
    ],
    esperado: /id duplicado/,
  },
];

console.log('\nTeste do recontador de canários');
console.log(`  base de bolso: ${BASE.length} claims sintéticas\n`);

let falhas = 0;
for (const caso of CASOS) {
  const r = roda(caso.canarios);
  if (caso.aprova) {
    if (r.passou) console.log(`  ✓ ${caso.nome}`);
    else {
      console.error(
        `  ✗ ${caso.nome}\n      recontou como quebrado um canário íntegro\n` +
          `      ${r.saida.split('\n').find((l) => l.includes('✗'))?.trim() ?? ''}`,
      );
      falhas += 1;
    }
    continue;
  }
  if (r.passou) {
    console.error(`  ✗ ${caso.nome}\n      APROVOU um canário que já não mede nada`);
    falhas += 1;
  } else if (!caso.esperado.test(r.saida)) {
    console.error(
      `  ✗ ${caso.nome}\n      reprovou pelo motivo errado — esperava ${caso.esperado}\n` +
        `      obteve: ${r.saida.split('\n').find((l) => l.includes('✗'))?.trim() ?? '(sem linha de erro)'}`,
    );
    falhas += 1;
  } else {
    console.log(`  ✓ ${caso.nome}`);
  }
}

rmSync(dir, { recursive: true, force: true });

if (falhas > 0) {
  console.error(`\n${falhas} de ${CASOS.length} caso(s) falharam — os canários não estão sendo recontados de verdade.\n`);
  process.exit(1);
}
console.log(`\n✓ o recontador cumpre os ${CASOS.length} casos que promete\n`);
