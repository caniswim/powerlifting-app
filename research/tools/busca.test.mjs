#!/usr/bin/env node
/**
 * Quem verifica a camada de recuperação.
 *
 * `busca.mjs` tem o mesmo modo de falha assimétrico dos outros checkers desta
 * pasta, e aqui ele é pior: se a expansão parar de expandir, nada quebra e nada
 * reclama — a saída volta a ser a do `--grep` literal, que é *plausível*. Uma
 * busca degradada é indistinguível de uma base que não tem o assunto, e essa
 * confusão é literalmente o defeito que a `MEDICAO-02` mediu em 7 de 7
 * respostas ruins.
 *
 * Então os casos vêm em pares, como no `check-canarios.test.mjs`: para cada
 * mecanismo, um caso que TEM de ser achado por ele e um que NÃO pode ser achado.
 * Um ranqueador que devolvesse a base inteira passaria na primeira metade e
 * falharia na segunda; um que devolvesse só o literal, o contrário.
 *
 * A base é sintética de propósito. O teste precisa de um corpus cujo conteúdo
 * ele conheça exatamente — a prova contra os casos REAIS medidos (Q05, Q16, Q19,
 * Q11) mora nos canários `presente-escondido` do `CANARIOS.json`, que rodam
 * contra o extract de verdade.
 *
 * Uso: node research/tools/busca.test.mjs
 */

import {
  raiz, termos, sequencia, indexar, buscarRelaxada, recuperar,
  alargarFiltro, parsearVocabulario, validarVocabulario, expandirPorVocabulario,
  vocabularioDoTopico, textoDaClaim, prosaDaClaim,
} from './busca.mjs';

/** Uma base de bolso desenhada em torno dos casos medidos, em miniatura. */
const BASE = [
  {
    // O alvo da Q05: só encontrável se `six times` alcançar `six days a week`.
    id: 'V900-34', src: 'R900', at: '07:30', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['supino', 'frequencia'],
    claim: 'A chave para o supino é seis dias por semana, bem submáximo.',
    verbatim: 'is just six days a week very sub maximal',
    params: [{ name: 'freq_supino', value: 6, unit: 'dias/semana', frame: 'x_semana' }],
    conditions: ['V900-36'],
  },
  {
    // A semente: é ela que o literal acha, e é dela que a vizinhança parte.
    id: 'V900-04', src: 'R900', at: '01:10', tier: 'R', scope: 'PESSOAL', modo: 'narrativa',
    topic: ['frequencia'],
    claim: 'A frequência dele é 6 vezes por semana no supino.',
    verbatim: 'six times on bench',
    params: [{ name: 'freq_supino', value: 6, unit: 'x/semana', frame: 'x_semana' }],
  },
  {
    // O alvo da Q19: mora ao lado de outra claim, no mesmo arquivo.
    id: 'V901-13', src: 'R901', at: '02:33', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['acessorios'],
    claim: 'No isolamento, 1 a 3 séries por músculo.',
    verbatim: 'one to three per muscle is usually what I find',
    params: [{ name: 'series_isolamento_max', value: 3, unit: 'séries', frame: 'series' }],
  },
  {
    id: 'V901-12', src: 'R901', at: '02:20', tier: 'R', scope: 'GERAL', modo: 'opiniao',
    topic: ['acessorios'],
    claim: 'O isolamento tem retorno decrescente rápido.',
    verbatim: 'isolation has fast diminishing returns',
    params: [],
  },
  {
    // O alvo da Q11: PESSOAL + fato, escondido por trás do filtro de segurança.
    id: 'V902-03', src: 'R902', at: '00:30', tier: 'R', scope: 'PESSOAL', modo: 'fato',
    topic: ['rpe'],
    claim: 'Para ele, 1 RPE equivale a 2 a 3% de peso.',
    verbatim: 'adding one RP to the bar is about 2 to 3% in weight',
    params: [{ name: 'peso_por_rpe_max', value: 3, unit: '%', frame: 'pct' }],
  },
  {
    id: 'V902-09', src: 'R902', at: '01:00', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['agacho'],
    claim: 'Fique 2 a 3% mais leve que o percentual do pause squat.',
    verbatim: 'maybe just 2 to 3% lighter than the regular pause squats',
    params: [],
  },
  {
    // Ruído deliberado: fala de outro assunto e contém números parecidos.
    id: 'V903-01', src: 'R903', at: '00:10', tier: 'R', scope: 'GERAL', modo: 'opiniao',
    topic: ['cardio'],
    claim: 'Ele faz 6 minutos de bicicleta antes de treinar.',
    verbatim: 'six minutes on the bike',
    params: [{ name: 'tempo', value: 6, unit: 'min', frame: 'min' }],
  },
];
const idx = indexar(BASE);

let falhas = 0;
const ok = (nome, cond, detalhe = '') => {
  if (cond) console.log(`  ✓ ${nome}`);
  else {
    console.error(`  ✗ ${nome}${detalhe ? `\n      ${detalhe}` : ''}`);
    falhas += 1;
  }
};
const ids = (lista) => new Set(lista.map((x) => (x.c ? x.c.id : x.id)));

console.log('\nTeste da camada de recuperação');
console.log(`  base de bolso: ${BASE.length} claims sintéticas\n`);

// ── radicalização: o mecanismo que separa `six times` de `six days` ──────────
ok('raiz junta singular e plural em inglês', raiz('times') === 'time' && raiz('days') === 'day' && raiz('sets') === 'set');
ok('raiz junta singular e plural em português', raiz('séries'.normalize('NFC')) !== '' && raiz('semanas') === 'semana' && raiz('vezes') === 'vez');
ok('raiz NÃO mutila palavra curta', raiz('rep') === 'rep' && raiz('mes') === 'mes');
ok('raiz não come "ss"', raiz('press') === 'press');

// ── números: a ponte bilíngue, com a regra ÚNICA do kb.mjs ───────────────────
ok('o número atravessa o idioma', termos('six times').has('#6') && termos('seis vezes').has('#6'));
ok('o dígito não vira termo de palavra', !termos('six times').has('6'));

// ── acento e caixa ───────────────────────────────────────────────────────────
ok('acento não separa termos', sequencia('frequência') === sequencia('frequencia'));

// ── todo campo, não só a prosa ───────────────────────────────────────────────
ok('params.name entra no texto indexado', textoDaClaim(BASE[0]).includes('freq_supino'));
ok('a prosa NÃO inclui params — as duas contagens continuam distinguíveis', !prosaDaClaim(BASE[0]).includes('freq_supino'));

// ── o caso Q05, em miniatura ─────────────────────────────────────────────────
{
  const literal = BASE.filter((c) => /six times/i.test(prosaDaClaim(c)));
  ok('CONTROLE: a busca cega continua cega no literal', !ids(literal).has('V900-34'), `literal achou ${[...ids(literal)]}`);
  const r = buscarRelaxada(idx, 'six times', { sementes: literal, excluir: ids(literal) });
  ok('`six times` alcança `six days a week` pela vizinhança', ids(r).has('V900-34'), `veio ${[...ids(r)]}`);
  ok('e NÃO arrasta os 6 minutos de bicicleta para a frente',
    r.findIndex((x) => x.c.id === 'V900-34') < r.findIndex((x) => x.c.id === 'V903-01') || !ids(r).has('V903-01'));
}

// ── o caso Q19: o vizinho de arquivo ─────────────────────────────────────────
{
  const r = recuperar(BASE, { grep: 'isolation has fast', idx });
  ok('o vizinho de arquivo entra na tela', r.idsMostrados.has('V901-13'), `mostrou ${[...r.idsMostrados]}`);
  ok('vizinho de arquivo declara de quem é vizinho', r.vizinhosDeArquivo.some((v) => v.deQuem === 'V901-12'));
}

// ── o caso Q11: o filtro como suspeito ───────────────────────────────────────
{
  const filtros = { modo: 'prescricao', scope: 'GERAL' };
  const rx = /2 a 3%/i;
  const a = alargarFiltro(BASE, { rx, filtros });
  const conjunto = a.find((x) => x.conjunto);
  ok('remoção de UM filtro por vez não revelaria nada aqui — e é por isso que ela não basta',
    a.filter((x) => !x.conjunto).length === 0);
  ok('os filtros de segurança removidos JUNTOS revelam a claim escondida',
    Boolean(conjunto) && conjunto.revela.includes('V902-03'), JSON.stringify(a));
  ok('e a saída conta o antes e o depois', Boolean(conjunto) && conjunto.com === 1 && conjunto.sem === 2);
}
{
  // O contra-caso: filtro que não esconde nada não pode gerar alarme. Alarme que
  // sempre toca é alarme desligado, e o aviso de filtro nasceria assim.
  ok('CONTROLE: filtro que não esconde nada não é reportado',
    alargarFiltro(BASE, { rx: /one to three per muscle/i, filtros: { scope: 'GERAL' } }).length === 0);
  // E o simétrico, que é o caso Q14: quando é o `--topic` que estreita, isso
  // também tem de aparecer — a Q14 buscou vocabulário de câmera e a resposta
  // morava em `profundidade`.
  ok('o --topic também é reportado quando é ELE que esconde',
    alargarFiltro(BASE, { rx: /2 a 3%/i, filtros: { topic: 'rpe' } })
      .some((a) => a.filtro === 'topic' && a.revela.includes('V902-09')));
}

// ── pobre × vazio: a distinção que decide consertos opostos ──────────────────
{
  const vazio = recuperar(BASE, { grep: 'periodizacao ondulatoria', idx });
  const pobre = recuperar(BASE, { grep: 'six times', idx });
  const farto = recuperar(BASE, { grep: 'a', idx, piso: 3 });
  ok('vazio é declarado vazio', vazio.vazio === true && vazio.pobre === true);
  ok('pobre é declarado pobre e NÃO vazio', pobre.pobre === true && pobre.vazio === false);
  ok('resultado farto não dispara vizinhança', farto.pobre === false && farto.relaxada.length === 0);
}

// ── o índice de vocabulário ──────────────────────────────────────────────────
{
  const md = [
    '## frequencia',
    '**usa:** `six days a week` · `freq_supino`',
    '**não usa:** `6x por semana`',
    'prosa que o parser ignora',
    '## acessorios',
    '**usa:** `per muscle`',
  ].join('\n');
  const entradas = parsearVocabulario(md);
  ok('o parser lê seção, usa e não usa', entradas.length === 2 && entradas[0].usa.length === 2 && entradas[0].naoUsa.length === 1);
  ok('a prosa é ignorada pelo parser', entradas[0].usa.every((t) => !t.includes('prosa')));

  const topicos = new Set(['frequencia', 'acessorios', 'rpe']);
  ok('índice íntegro passa', validarVocabulario(entradas, BASE, topicos).length === 0,
    JSON.stringify(validarVocabulario(entradas, BASE, topicos)));

  const morto = parsearVocabulario('## frequencia\n**usa:** `six times a week`');
  ok('termo morto em "usa" é recusado', /termo morto/.test(validarVocabulario(morto, BASE, topicos).join(' ')));

  const foraDoTopico = parsearVocabulario('## frequencia\n**usa:** `per muscle`');
  ok('termo vivo no tópico ERRADO é recusado, e a mensagem diz isso',
    /tópico errado/.test(validarVocabulario(foraDoTopico, BASE, topicos).join(' ')));

  const ressuscitou = parsearVocabulario('## frequencia\n**usa:** `six days a week`\n**não usa:** `six days a week`');
  ok('termo que ressuscitou em "não usa" é recusado',
    /virou falsa/.test(validarVocabulario(ressuscitou, BASE, topicos).join(' ')));

  const topicoInvalido = parsearVocabulario('## frequencias\n**usa:** `six days a week`');
  ok('seção com tópico fora do enumerado é recusada',
    /fora do vocabulário fechado/.test(validarVocabulario(topicoInvalido, BASE, topicos).join(' ')));

  const semTermo = parsearVocabulario('## rpe\nsó prosa, nenhum termo');
  ok('seção sem nenhum termo é recusada', /sem nenhum termo/.test(validarVocabulario(semTermo, BASE, topicos).join(' ')));

  // A expansão é o que torna o índice executável em vez de decorativo.
  const usados = expandirPorVocabulario('quantas séries por muscle', entradas);
  ok('a consulta é expandida pela seção que ela toca', usados.some((u) => u.topico === 'acessorios'));
  ok('e NÃO pela seção que ela não toca', !usados.some((u) => u.topico === 'frequencia'), JSON.stringify(usados));
}

// ── vocabulário derivado do corpus ───────────────────────────────────────────
{
  const v = vocabularioDoTopico(idx, 'acessorios', 8, new Set(['acessorios']));
  ok('o vocabulário derivado conta as claims do tópico', v.claims === 2);
  ok('e não devolve o próprio nome do tópico como descoberta', v.unigramas.every((u) => u.termo !== 'acessorios'));
}

if (falhas > 0) {
  console.error(`\n${falhas} caso(s) falharam — a camada de recuperação não faz o que promete.\n`);
  process.exit(1);
}
console.log('\n✓ a camada de recuperação cumpre o que promete\n');
