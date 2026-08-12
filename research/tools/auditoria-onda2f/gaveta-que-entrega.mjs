#!/usr/bin/env node
/**
 * POR QUE O ID NÃO VEIO — e a resposta NÃO é a mesma nos três casos que falharam.
 *
 * O placar diz quantas vezes a tela mostrou o id. Ele não diz a CAUSA, e as
 * causas mandam consertos opostos:
 *
 *   A. o roteador escolheu gaveta que NÃO CONTÉM o id      → conserto no prompt
 *   B. escolheu a gaveta certa e o id caiu abaixo do corte  → conserto na ordenação
 *   C. o id não está etiquetado em gaveta nenhuma plausível → conserto na BASE
 *
 * E o achado que reordena o placar inteiro: `--pergunta X --topic t` NÃO
 * acrescenta a gaveta `t` à rota automática — ele DESCARTA a rota e mostra
 * SÓ `t`. A documentação dentro do próprio `check-evidence.mjs` afirma o
 * contrário ("NENHUMA seção rouba vaga de outra"). Conferido aqui, não lembrado.
 *
 * Uso: node research/tools/auditoria-onda2f/gaveta-que-entrega.mjs
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims, carregarTopicos } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { perfilarTopicos, conjuntoDoTopico, ordenarNoTopico, TETO_DA_SECAO_FORCADA } from '../roteador.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');
const rodar = (a) => execFileSync('node', [CLI, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const CANARIOS = [
  ['E01', 'descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha', ['V089-24', 'V089-25']],
  ['E02', 'abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar', ['V167-17', 'V167-18']],
  ['E03', 'eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita', ['F001-37', 'F001-47']],
  ['E04', 'seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos', ['F001-14', 'F001-28']],
  ['E05', 'o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo', ['F001-79']],
  ['E06', 'meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda', ['V174-12', 'V174-16']],
  ['E07', 'durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao', ['V015-10', 'V015-12']],
  ['E08', 'na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso', ['G031-37', 'G031-38', 'G029-17']],
  ['E09', 'uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida', ['G008-27', 'G008-29', 'G008-43']],
  ['E10', 'posso passar esparadrapo no dedao pra segurar melhor a barra no terra', ['F001-100']],
  ['E11', 'no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa', ['F001-30']],
  ['E12', 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca', ['V127-15', 'V127-13']],
];

const ESCOLHAS = {
  'roteador 1': { E01: ['dor', 'recuperacao', 'lesao'], E02: ['supino', 'ombros', 'tecnica'], E03: ['supino', 'erro-comum', 'regras-ipf'], E04: ['pegada', 'regras-ipf', 'erro-comum'], E05: ['equipamento', 'sapato', 'terra'], E06: ['teste-de-forca', 'equipamento', 'training-max'], E07: ['sono', 'recuperacao'], E08: ['agacho', 'antropometria', 'profundidade', 'mobilidade'], E09: ['carga-de-treino', 'volume', 'intensidade'], E10: ['equipamento', 'regras-ipf', 'pegada'], E11: ['supino', 'erro-comum', 'regras-ipf', 'setup'], E12: ['ombros', 'dor', 'selecao-exercicio', 'supino'] },
  'roteador 2': { E01: ['dor', 'peito', 'recuperacao', 'lesao'], E02: ['ombros', 'supino', 'aprendizado-motor'], E03: ['supino', 'regras-ipf', 'erro-comum'], E04: ['pegada', 'regras-ipf', 'erro-comum'], E05: ['equipamento', 'sapato', 'terra'], E06: ['teste-de-forca', 'equipamento', 'competicao'], E07: ['sono', 'recuperacao'], E08: ['agacho', 'profundidade', 'antropometria', 'mobilidade'], E09: ['carga-de-treino', 'volume', 'intensidade'], E10: ['equipamento', 'regras-ipf', 'pegada', 'terra'], E11: ['erro-comum', 'regras-ipf', 'supino', 'setup'], E12: ['ombros', 'dor', 'lesao', 'selecao-exercicio'] },
  'roteador 3': { E01: ['dor', 'lesao', 'peito'], E02: ['tecnica', 'ombros', 'dor'], E03: ['regras-ipf', 'erro-comum', 'supino'], E04: ['pegada', 'regras-ipf', 'erro-comum'], E05: ['equipamento', 'regras-ipf', 'terra'], E06: ['teste-de-forca', 'equipamento', 'competicao'], E07: ['sono', 'recuperacao'], E08: ['agacho', 'antropometria', 'mobilidade', 'profundidade'], E09: ['carga-de-treino', 'volume', 'intensidade'], E10: ['equipamento', 'regras-ipf', 'pegada'], E11: ['erro-comum', 'regras-ipf', 'supino', 'setup'], E12: ['lesao', 'ombros', 'selecao-exercicio'] },
};

const { claims } = carregarClaims(join(ROOT, 'research/extract'));
carregarVocabulario(ROOT);
carregarTopicos(ROOT);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);
const porId = new Map(claims.map((c) => [c.id, c]));

// ── 1. `--topic` SUBSTITUI a rota, não acrescenta ───────────────────────────
console.log('='.repeat(78));
console.log('1. O QUE `--topic` FAZ COM A ROTA AUTOMÁTICA');
console.log('='.repeat(78));
{
  const q = CANARIOS[2][1];
  const auto = [...rodar(['--pergunta', q]).matchAll(/GAVETA `([a-z0-9-]+)`/g)].map((m) => m[1]);
  const forc = [...rodar(['--pergunta', q, '--topic', 'supino']).matchAll(/GAVETA `([a-z0-9-]+)`/g)].map((m) => m[1]);
  console.log(`  sem --topic : ${auto.length} seções → ${auto.join(', ')}`);
  console.log(`  --topic supino: ${forc.length} seção  → ${forc.join(', ')}`);
  console.log(forc.length === 1
    ? '  `--topic` SUBSTITUI a rota inteira. O comentário do check-evidence.mjs diz\n'
      + '  "NENHUMA seção rouba vaga de outra — acrescentar gaveta só ACRESCENTA bloco".\n'
      + '  Isso é FALSO para --topic: ele descarta as outras 4 gavetas. Modo de falha nº 3.'
    : '  --topic acrescenta à rota.');
}

// ── 2. ONDE CADA ID ESPERADO MORA, e se o roteador tocou nessa gaveta ───────
console.log(`\n${'='.repeat(78)}`);
console.log('2. A GAVETA QUE DE FATO CONTÉM O ID (campo topic[] da claim)');
console.log('='.repeat(78));
const causas = [];
for (const [caso, q, esperados] of CANARIOS) {
  for (const id of esperados) {
    const c = porId.get(id);
    if (!c) { console.log(`  ${caso} ${id}: NÃO EXISTE NA BASE`); continue; }
    const donas = c.topic ?? [];
    console.log(`\n  ${caso} ${id}  topic[] = [${donas.join(', ')}]`);
    for (const [nome, esc] of Object.entries(ESCOLHAS)) {
      const ts = esc[caso];
      const acertou = ts.filter((t) => donas.includes(t));
      // onde o id cai na fila da gaveta forçada, para separar B de A
      const posicoes = ts.map((t) => {
        const so = conjuntoDoTopico(claims, PERFIS, t, { afins: 0 });
        const fila = ordenarNoTopico(IDX, so, q, { teto: 5000 });
        const p = fila.findIndex((x) => x.c.id === id) + 1;
        return `${t}:${p ? `#${p}/${fila.length}` : '—'}`;
      });
      let causa;
      if (acertou.length === 0) causa = 'A · gaveta escolhida não contém o id';
      else {
        const dentroDoCorte = acertou.some((t) => {
          const so = conjuntoDoTopico(claims, PERFIS, t, { afins: 0 });
          const fila = ordenarNoTopico(IDX, so, q, { teto: 5000 });
          const p = fila.findIndex((x) => x.c.id === id) + 1;
          return p > 0 && p <= TETO_DA_SECAO_FORCADA;
        });
        causa = dentroDoCorte ? 'entregue' : `B · gaveta certa, caiu abaixo do corte de ${TETO_DA_SECAO_FORCADA}`;
      }
      causas.push({ caso, id, nome, causa });
      console.log(`     ${nome}: tocou [${acertou.join(', ') || 'nenhuma'}]  ${posicoes.join('  ')}`);
      console.log(`        → ${causa}`);
    }
  }
}

console.log(`\n${'='.repeat(78)}`);
console.log('3. RESUMO DAS CAUSAS (36 pares roteador×id)');
console.log('='.repeat(78));
const cont = {};
for (const x of causas) {
  const k = x.causa.split(' ·')[0];
  cont[k] = (cont[k] ?? 0) + 1;
}
for (const [k, v] of Object.entries(cont)) console.log(`  ${k.padEnd(10)} ${v}`);
