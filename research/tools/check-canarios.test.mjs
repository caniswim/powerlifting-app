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

/**
 * ── A SEGUNDA BASE DE BOLSO, para a PORTA NOVA (`perguntaDoAtleta`) ──────────
 *
 * Ela é separada da primeira por uma razão só: os casos de cima contam claims
 * ("3 claim(s)", "2 claim(s)") e acrescentar linhas à primeira base quebraria
 * essas contagens por acidente — que é o defeito nº 1 desta casa, copiar a
 * convenção do vizinho sem olhar para o que ela sustenta.
 *
 * Três claims no mesmo tópico e uma fora dele. A ordem em que o roteamento as
 * devolve para a pergunta `cardio atrapalha o ganho de força?` é estável e
 * MEDIDA: V901-03, V901-01, V901-02. É isso que torna possível provar que
 * `tela.porSecao` é limite de POSIÇÃO DENTRO DA SEÇÃO — com 1 entra só a
 * primeira, com 2 entram duas, com 3 entram as três — sem importar constante
 * nenhuma da ferramenta.
 *
 * Os casos da porta nova passam `lado: 0` e `ligacoes: 0` de propósito: as
 * quatro claims são do MESMO `src`, então a página ao lado traria as vizinhas e
 * o que se quer medir aqui é o teto da seção, não o canal de complemento.
 */
const BASE2 = [
  {
    id: 'V901-01', src: 'R901', at: '01:00', tier: 'R', scope: 'GERAL', modo: 'prescricao',
    topic: ['cardio'],
    claim: 'Ele manda fazer cardio de zona 2 na esteira.',
    verbatim: 'do zone two cardio on the treadmill',
    params: [],
  },
  {
    id: 'V901-02', src: 'R901', at: '02:00', tier: 'R', scope: 'PESSOAL', modo: 'narrativa',
    topic: ['cardio'],
    claim: 'Ele mesmo faz vinte minutos de bicicleta.',
    verbatim: 'i do twenty minutes on the bike',
    params: [{ name: 'tempo', value: 20, unit: 'min', frame: 'min' }],
  },
  {
    id: 'V901-03', src: 'R901', at: '03:00', tier: 'R', scope: 'GERAL', modo: 'fato',
    topic: ['cardio'],
    claim: 'O cardio leve não atrapalha o ganho de força.',
    verbatim: 'light cardio does not kill your gains',
    params: [],
  },
  {
    id: 'V901-04', src: 'R901', at: '04:00', tier: 'R', scope: 'GERAL', modo: 'opiniao',
    topic: ['tecnica'],
    claim: 'A maioria agacha ereto demais.',
    verbatim: 'most people squat way too upright',
    params: [],
  },
];
const dir2 = mkdtempSync(join(tmpdir(), 'canarios-porta-'));
writeFileSync(join(dir2, 'R901.jsonl'), BASE2.map((c) => JSON.stringify(c)).join('\n'));

/** O canário da porta nova, com o bloco inteiro escrito à mão neste arquivo. */
const daPorta = (bloco, extra = {}) => ({
  id: 'T01',
  familia: 'presente-escondido',
  // `conjunto` é obrigatório na porta nova desde 12/08/2026 — sem ele o placar
  // somaria o conjunto que o construtor enxergava com o conjunto cego e
  // imprimiria uma média. Ver o bloco `placarPorConjunto` em check-canarios.mjs.
  conjunto: 'teste',
  pergunta: 'cardio atrapalha o ganho de força?',
  porque: 'porque de teste',
  esperado: 'esperado de teste',
  sustenta: ['V901-01', 'V901-02', 'V901-03'],
  frases: ['cardio'],
  perguntaDoAtleta: {
    descricao: 'descrição de teste',
    topicoDaResposta: 'cardio',
    medidoEm: '2026-08-10',
    abriuOTopico: true,
    gavetasComResposta: ['cardio'],
    ...bloco,
  },
  ...extra,
});

const canario = (extra) => ({
  id: 'T01',
  familia: 'impossivel',
  pergunta: 'pergunta de teste',
  porque: 'porque de teste',
  esperado: 'esperado de teste',
  ...extra,
});

/**
 * O `tetoDeTela` é DADO do arquivo de canários, não constante de `busca.mjs` — e
 * este harness escreve 40 à mão, LITERAL, sem importar nada da ferramenta. É a
 * regra de higiene do `ONDA-2B.md` §1.1: até 10/08/2026 o checker importava
 * `TETO_VIZINHANCA` da própria ferramenta que ele mede, e trocar 40 por 400
 * deixava `npm run check:kb` inteiro verde.
 *
 * `topo` permite a um caso omitir ou mudar o campo, que é o que fixa os dois
 * lados: um caso exige a RECUSA quando ele falta, e outro exige que o número
 * cobrado seja o do arquivo e não o da ferramenta.
 */
function roda(canarios, topo = { tetoDeTela: 40 }, extract = dir) {
  const f = join(extract, `canarios-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(f, JSON.stringify({ ...topo, gerado: '2026-08-09', canarios }, null, 1));
  try {
    return { passou: true, saida: execFileSync('node', [CHECKER, '--extract', extract, '--canarios', f, '--verbose'], { encoding: 'utf8', stdio: 'pipe' }) };
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
  // ── o teto de tela é DADO do arquivo, e os dois lados são cobrados ────────
  //
  // ONDA-2B §1.1: até 10/08/2026 o checker importava `TETO_VIZINHANCA` de
  // `busca.mjs` — a ferramenta que ele mede — e trocar 40 por 400 deixava o
  // `check:kb` inteiro verde. Os dois casos abaixo neutralizam os DOIS lados,
  // que é a instrução literal do item: um cobra a recusa quando o número some
  // do arquivo, o outro prova que o número IMPRESSO é o do arquivo.
  {
    nome: 'arquivo de canários sem tetoDeTela é recusado — o teto não pode vir da ferramenta',
    topo: {},
    canarios: [canario({ vazio: { descricao: 'tier L', filtro: { tier: 'L' } } })],
    esperado: /falta "tetoDeTela" no topo/,
  },
  {
    // O alvo é de outro vídeo e não compartilha raiz nenhuma com a busca cega:
    // a recuperação não o alcança em teto nenhum. O que estes dois casos medem
    // não é o alcance — é o NÚMERO IMPRESSO na mensagem, que tem de ser o do
    // arquivo. Se voltar a sair 40 quando o arquivo diz 1, o checker voltou a
    // ler a constante de `busca.mjs`.
    nome: 'o teto cobrado é o do arquivo (1), não o default de busca.mjs (40)',
    topo: { tetoDeTela: 1 },
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['V900-01'],
      frases: ['agacha ereto demais'],
      buscaCega: { descricao: 'busca de outro assunto', termos: ['treadmills'] },
    })],
    esperado: /dentro das 1 primeiras/,
  },
  {
    // O mesmo canário com outro número no arquivo. Dois valores diferentes,
    // duas mensagens diferentes: é a prova de que o número vem de fora.
    nome: 'o mesmo canário com tetoDeTela 7 imprime 7',
    topo: { tetoDeTela: 7 },
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['V900-01'],
      frases: ['agacha ereto demais'],
      buscaCega: { descricao: 'busca de outro assunto', termos: ['treadmills'] },
    })],
    esperado: /dentro das 7 primeiras/,
  },
  {
    // E o override por canário, que é o que o T14 do ROTAS.json usa para a
    // gaveta que cabe inteira na tela.
    nome: 'buscaCega.tetoDeTela sobrescreve o do topo',
    topo: { tetoDeTela: 40 },
    canarios: [canario({
      familia: 'presente-escondido',
      sustenta: ['V900-01'],
      frases: ['agacha ereto demais'],
      buscaCega: { descricao: 'busca de outro assunto', termos: ['treadmills'], tetoDeTela: 3 },
    })],
    esperado: /dentro das 3 primeiras/,
  },

  // ── A PORTA NOVA: `perguntaDoAtleta` ──────────────────────────────────────
  //
  // Os oito casos abaixo neutralizam o bloco que mede a recuperação por
  // roteamento. Três coisas precisam de prova, e são as três que o ataque de
  // 10/08/2026 mostrou faltarem em alguma trava desta casa:
  //
  //   1. `tela.porSecao` é limite de POSIÇÃO e vem do canário. Os três primeiros
  //      casos rodam o MESMO canário com 1, 2 e 3, e a lista de ids muda junto.
  //      Um checker que lesse o teto de `roteador.mjs` daria a mesma resposta
  //      nos três.
  //   2. A comparação contra o registro morde NOS DOIS SENTIDOS. Piorar acusa, e
  //      MELHORAR acusa — sem isso, um canário registrado como vermelho ficaria
  //      verde para sempre e voltaria a ser prosa.
  //   3. O canário não pode declarar um tópico da resposta que não guarda a
  //      resposta: seria medir a abertura da gaveta errada, que é o P16.
  {
    nome: 'porta nova: tela.porSecao 1 deixa entrar só a 1ª da seção',
    base: dir2,
    aprova: true,
    canarios: [daPorta({ tela: { porSecao: 1, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-03'], veredito: 'falha' })],
  },
  {
    nome: 'porta nova: tela.porSecao 2 deixa entrar duas — o teto é POSIÇÃO',
    base: dir2,
    aprova: true,
    canarios: [daPorta({ tela: { porSecao: 2, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-01', 'V901-03'], veredito: 'falha' })],
  },
  {
    nome: 'porta nova: tela.porSecao 3 entrega as três e o veredito vira "passa"',
    base: dir2,
    aprova: true,
    canarios: [daPorta({ tela: { porSecao: 3, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-01', 'V901-02', 'V901-03'], veredito: 'passa' })],
  },
  {
    // O mesmo registro do caso anterior, com o teto em 1: se o número do JSON
    // não estivesse ligado, este caso continuaria verde.
    nome: 'porta nova: baixar o teto para 1 com o registro de 3 ACUSA',
    base: dir2,
    canarios: [daPorta({ tela: { porSecao: 1, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-01', 'V901-02', 'V901-03'], veredito: 'passa' })],
    esperado: /A MEDIDA DA PORTA NOVA MUDOU[\s\S]*agora \[V901-03\]/,
  },
  {
    nome: 'porta nova: MELHORAR também acusa — canário vermelho não fica verde em silêncio',
    base: dir2,
    canarios: [daPorta({ tela: { porSecao: 3, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: [], veredito: 'falha' })],
    esperado: /veredito: registrado "falha", agora "passa"/,
  },
  {
    nome: 'porta nova: sem "tela" é recusado — o orçamento é dado do canário',
    base: dir2,
    canarios: [daPorta({ recuperados: [], veredito: 'falha' })],
    esperado: /O orçamento da\s+tela é dado do canário/,
  },
  {
    nome: 'porta nova: topicoDaResposta que não etiqueta nenhum id de sustenta é recusado',
    base: dir2,
    canarios: [daPorta({
      tela: { porSecao: 3, secoes: 5, lado: 0, ligacoes: 0 }, topicoDaResposta: 'sono', abriuOTopico: false,
      recuperados: ['V901-01', 'V901-02', 'V901-03'], veredito: 'passa',
    })],
    esperado: /o tópico da resposta é palpite/,
  },
  // ── o placar é POR CONJUNTO, e a média é proibida ─────────────────────────
  //
  // Em 12/08/2026 os 12 canários CEGOS entraram ao lado dos 18 PÚBLICOS e o
  // placar único passou a imprimir `8 de 30`, que é a média de `8 de 18` com
  // `0 de 12`. A média apaga a DISTÂNCIA entre os dois, que é a única coisa que
  // um conjunto cego mede. Os dois casos abaixo fixam os dois lados: a recusa
  // quando o campo falta, e a separação de fato quando ele está lá.
  {
    nome: 'porta nova: canário sem "conjunto" é recusado — placar somado esconde a distância',
    base: dir2,
    canarios: [(() => { const c = daPorta({ tela: { porSecao: 3, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-01', 'V901-02', 'V901-03'], veredito: 'passa' }); delete c.conjunto; return c; })()],
    esperado: /sem "conjunto"[\s\S]*esconde a distância/,
  },
  {
    nome: 'porta nova: dois conjuntos imprimem DOIS placares, não a média',
    base: dir2,
    aprova: true,
    canarios: [
      daPorta({ tela: { porSecao: 3, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-01', 'V901-02', 'V901-03'], veredito: 'passa' }, { id: 'T01', conjunto: 'publico' }),
      daPorta({ tela: { porSecao: 1, secoes: 5, lado: 0, ligacoes: 0 }, recuperados: ['V901-03'], veredito: 'falha' }, { id: 'T02', conjunto: 'cego' }),
    ],
    // um placar diz 1 de 1 e o outro diz 0 de 1; a média (1 de 2) nunca aparece sozinha
    esperado: /conjunto "publico"[\s\S]*1 de 1 devolvem TODOS[\s\S]*conjunto "cego"[\s\S]*0 de 1 devolvem TODOS/,
  },
  {
    nome: 'presente-escondido sem buscaCega e sem perguntaDoAtleta é recusado',
    base: dir2,
    canarios: [{
      id: 'T01',
      familia: 'presente-escondido',
      pergunta: 'cardio atrapalha o ganho de força?',
      porque: 'porque de teste',
      esperado: 'esperado de teste',
      sustenta: ['V901-03'],
      frases: ['cardio'],
    }],
    esperado: /exige buscaCega\.termos ou perguntaDoAtleta/,
  },
];

console.log('\nTeste do recontador de canários');
console.log(`  base de bolso: ${BASE.length} claims sintéticas\n`);

let falhas = 0;
for (const caso of CASOS) {
  const r = roda(caso.canarios, caso.topo ?? { tetoDeTela: 40 }, caso.base ?? dir);
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
rmSync(dir2, { recursive: true, force: true });

if (falhas > 0) {
  console.error(`\n${falhas} de ${CASOS.length} caso(s) falharam — os canários não estão sendo recontados de verdade.\n`);
  process.exit(1);
}
console.log(`\n✓ o recontador cumpre os ${CASOS.length} casos que promete\n`);
