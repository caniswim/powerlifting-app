#!/usr/bin/env node
/**
 * Quem verifica a trava de endereços `[Rnn @mm:ss]`.
 *
 * Esta trava nasceu porque a ANTERIOR não existia: por seis ondas, passar
 * `"R79 @03:35"` para `check-evidence.mjs` era o mesmo que não passar nada. O
 * modo de falha, então, não é "a trava reprova o que devia aprovar" — é "a trava
 * some e ninguém nota", que é silencioso por definição. Por isso os casos vêm em
 * pares, como em `busca.test.mjs`: para cada mecanismo, um caso que TEM de ser
 * aceito e um que TEM de ser recusado. Um resolvedor que aceitasse tudo passaria
 * só na primeira metade; um que exigisse igualdade exata, só na segunda.
 *
 * O segundo modo de falha, e o caro, é a tolerância virar número mágico. Já
 * houve uma onda que mediu por igualdade exata e concluiu que 87 % do
 * `PROGRAMA.md` era fabricado. Os testes de `toleranciaDaGrade` fixam que ela é
 * DERIVADA da grade do corpus — dobre o passo da grade e a tolerância dobra —, e
 * não uma constante escondida.
 *
 * Uso: node research/tools/enderecos.test.mjs
 */

import {
  parsearEndereco, toleranciaDaGrade, resolverEndereco, indexarPorFonte,
  emSegundos, normalizarMarca, marcaDeTempo,
} from './enderecos.mjs';

let passaram = 0;
let falharam = 0;

function test(nome, fn) {
  try {
    fn();
    passaram += 1;
    console.log(`  ✓ ${nome}`);
  } catch (e) {
    falharam += 1;
    console.log(`  ✗ ${nome}: ${e.message}`);
  }
}

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

/**
 * Corpus de bolso com a MESMA grade do real: marcas de 15 em 15 s. É o que
 * torna a tolerância esperada (7) previsível sem depender do extract.
 */
const claim = (id, src, at, extra = {}) => ({ id, src, at, scope: 'GERAL', modo: 'prescricao', claim: id, ...extra });
const BASE = [
  claim('V900-01', 'R900', '01:00'),
  claim('V900-02', 'R900', '01:00'),
  claim('V900-03', 'R900', '01:15'),
  claim('V900-04', 'R900', '01:30'),
  claim('V900-05', 'R900', '01:45'),
  claim('V900-06', 'R900', '02:00'),
  claim('V901-01', 'R901', '00:15'),
  claim('V901-02', 'R901', '00:30'),
  claim('V901-03', 'R901', '00:45'),
  // R902 tem um BURACO de 60 s entre as duas marcas. É o único formato em que
  // "fora de faixa" pode acontecer — ver o teste que explica por quê.
  claim('V902-01', 'R902', '00:15'),
  claim('V902-02', 'R902', '01:15'),
  // Fonte sem marca de tempo: o F001 do corpus real endereça por §, e a grade
  // não pode contá-lo nem quebrar por causa dele.
  claim('F001-01', 'IPF-TR2026', '§4.1.3'),
];

console.log('\nEndereços [Rnn @mm:ss] — parser, grade e resolução');

// --- 1. O parser reconhece o que o documento escreve -------------------------

test('reconhece a forma com colchetes, como no PROGRAMA.md', () => {
  const e = parsearEndereco('[R79 @03:35]');
  assert(e !== null, 'não reconheceu');
  assert(e.src === 'R079', `src veio ${e.src}, esperava R079 (com zero à esquerda)`);
  assert(e.marcas[0] === '03:35', `marca veio ${e.marcas[0]}`);
});

test('reconhece a forma sem colchetes, que é como se digita na linha de comando', () => {
  const e = parsearEndereco('R1 @01:04');
  assert(e !== null, 'não reconheceu');
  assert(e.src === 'R001', `src veio ${e.src}, esperava R001`);
});

test('reconhece FAIXA e guarda as duas pontas', () => {
  const e = parsearEndereco('[R11 @02:36-03:07]');
  assert(e !== null, 'não reconheceu a faixa');
  assert(e.marcas.length === 2, `esperava 2 marcas, veio ${e.marcas.length}`);
  assert(e.marcas[1] === '03:07', `2ª ponta veio ${e.marcas[1]}`);
});

test('normaliza `1:04` para `01:04`, que é como o corpus grava', () => {
  assert(normalizarMarca('1:04') === '01:04', 'não normalizou');
  assert(normalizarMarca('01:04') === '01:04', 'estragou a já normalizada');
});

// O par negativo: o que NÃO pode ser confundido com endereço.
test('NÃO confunde um id de claim com endereço', () => {
  assert(parsearEndereco('V079-34') === null, 'engoliu um id como endereço');
});

test('NÃO confunde uma flag da CLI com endereço', () => {
  assert(parsearEndereco('--topic') === null, 'engoliu uma flag');
  assert(parsearEndereco('dor') === null, 'engoliu um termo de busca');
});

test('emSegundos e marcaDeTempo concordam sobre o que é marca', () => {
  assert(emSegundos('03:35') === 215, `03:35 deu ${emSegundos('03:35')}`);
  assert(marcaDeTempo('03:35'), '03:35 devia ser marca');
  assert(!marcaDeTempo('§4.1.3'), '§4.1.3 NÃO é marca de tempo');
  assert(!marcaDeTempo(undefined), 'undefined NÃO é marca de tempo');
});

// --- 2. A tolerância é DERIVADA da grade, não constante ----------------------

test('a tolerância é metade do passo mediano da grade', () => {
  const { passo, tolerancia } = toleranciaDaGrade(BASE);
  assert(passo === 15, `passo medido ${passo}, esperava 15`);
  assert(tolerancia === 7, `tolerância ${tolerancia}, esperava floor(15/2) = 7`);
});

test('grade com o DOBRO do passo dobra a tolerância — ela não é um 7 fincado', () => {
  const dobrada = BASE.filter(marcaOk).map((c) => ({ ...c, at: dobrar(c.at) }));
  const { passo, tolerancia } = toleranciaDaGrade(dobrada);
  assert(passo === 30, `passo medido ${passo}, esperava 30`);
  assert(tolerancia === 15, `tolerância ${tolerancia}, esperava 15`);
});

function marcaOk(c) { return marcaDeTempo(c.at); }
function dobrar(at) {
  const s = emSegundos(at) * 2;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

test('corpus sem marca de tempo nenhuma cai para igualdade exata, não para folga infinita', () => {
  const { passo, tolerancia } = toleranciaDaGrade([claim('F001-01', 'IPF-TR2026', '§4.1.3')]);
  assert(passo === null, `passo devia ser null, veio ${passo}`);
  assert(tolerancia === 0, `sem grade medida a tolerância tem de ser 0, veio ${tolerancia}`);
});

test('a fonte sem marca de tempo não entra na grade nem a quebra', () => {
  const { passo } = toleranciaDaGrade(BASE);
  assert(passo === 15, `a IPF-TR2026 contaminou a grade: passo ${passo}`);
});

// --- 3. Resolução: os três vereditos, cada um com seu par --------------------

const PORFONTE = indexarPorFonte(BASE);
const { tolerancia: TOL } = toleranciaDaGrade(BASE);
const resolver = (txt) => resolverEndereco(parsearEndereco(txt), PORFONTE.get(parsearEndereco(txt).src), TOL);

test('marca EXATA resolve e devolve TODAS as claims do bloco', () => {
  const r = resolver('[R900 @01:00]');
  assert(r.veredito === 'resolve', `veredito ${r.veredito}`);
  assert(r.dentro.length === 2, `esperava as 2 claims de 01:00, veio ${r.dentro.length}`);
  assert(r.dentro.every((x) => x.distancia === 0), 'distância devia ser 0');
});

test('marca DENTRO da tolerância resolve — é o caso normal do PROGRAMA.md', () => {
  const r = resolver('[R900 @01:07]');
  assert(r.veredito === 'resolve', `7 s de distância devia resolver, veio ${r.veredito}`);
  assert(r.dentro[0].distancia === 7, `distância ${r.dentro[0].distancia}`);
});

/**
 * O PAR NEGATIVO, e ele ensinou uma propriedade que vale escrever.
 *
 * Numa grade DENSA de 15 s, a janela de ±7 s LADRILHA a linha: 01:08 está a 8 s
 * de 01:00 mas a 7 s de 01:15, então resolve. Não existe ponto entre duas marcas
 * consecutivas de 15 s que caia fora — e isso é o comportamento CERTO, porque
 * todo instante falado pertence a algum bloco extraído.
 *
 * Logo "fora de faixa" só pode significar uma coisa: o endereço caiu num BURACO
 * da grade, um trecho de onde a extração não tirou claim nenhuma. É exatamente o
 * sinal que se quer — a citação aponta para um lugar onde não há nada — e é o
 * caso real de `[R4 @02:33]`, que fica a 14 s e 16 s das duas bordas de um
 * buraco de 30 s.
 */
test('endereço num BURACO da grade é FORA DE FAIXA', () => {
  const r = resolver('[R902 @00:45]');
  assert(r.veredito === 'fora-de-faixa', `30 s de buraco devia reprovar, veio ${r.veredito}`);
  assert(r.dentro.length === 0, 'não podia ter claim dentro da faixa');
  assert(r.proximas.length > 0, 'tem de sugerir as vizinhas para quem for corrigir');
});

test('numa grade DENSA nada cai fora — a janela ladrilha a linha', () => {
  // A contrapositiva do teste acima: sem ela, um resolvedor que reprovasse tudo
  // passaria no caso do buraco e ninguém veria.
  for (const marca of ['01:00', '01:04', '01:08', '01:11', '01:15']) {
    const r = resolver(`[R900 @${marca}]`);
    assert(r.veredito === 'resolve', `${marca} devia resolver na grade densa, veio ${r.veredito}`);
  }
});

test('fora de faixa aponta as vizinhas ordenadas pela distância', () => {
  const r = resolver('[R902 @00:45]');
  const ds = r.proximas.map((x) => x.distancia);
  assert(ds[0] <= ds[1], `vizinhas fora de ordem: ${ds.join(',')}`);
  assert(ds[0] === 30, `a mais próxima devia estar a 30 s, veio ${ds[0]}`);
});

test('fonte inexistente é SEM-FONTE — o único caso em que "fabricado" cabe', () => {
  const e = parsearEndereco('[R999 @01:00]');
  const r = resolverEndereco(e, PORFONTE.get(e.src), TOL);
  assert(r.veredito === 'sem-fonte', `veredito ${r.veredito}`);
});

test('FAIXA resolve pela ponta certa, não só pela primeira', () => {
  // 00:15 está longe de 00:45, mas a faixa cobre as duas pontas.
  const e = parsearEndereco('[R901 @00:15-00:45]');
  const r = resolverEndereco(e, PORFONTE.get(e.src), TOL);
  assert(r.veredito === 'resolve', `veredito ${r.veredito}`);
  const ids = r.dentro.map((x) => x.claim.id);
  assert(ids.includes('V901-01') && ids.includes('V901-03'),
    `as duas pontas deviam resolver, veio ${ids.join(',')}`);
});

// --- 4. A regressão que motivou tudo ----------------------------------------

test('tolerância 0 NÃO condena o corpo da distribuição por acidente de assinatura', () => {
  // Com tolerância 0 só a marca exata passa: é o comportamento antigo, e ele
  // fica disponível de propósito (corpus sem grade). O que não pode é ser o
  // PADRÃO — e o teste da grade acima garante que não é.
  const r = resolverEndereco(parsearEndereco('[R900 @01:07]'), PORFONTE.get('R900'), 0);
  assert(r.veredito === 'fora-de-faixa', 'com tolerância 0, 7 s tem de reprovar');
});

console.log(`\n${passaram} passaram, ${falharam} falharam`);
process.exit(falharam > 0 ? 1 : 0);
