#!/usr/bin/env node
/**
 * `params-gaveta-errada.mjs` — enumera os params cujo NÚMERO está tipado numa
 * gaveta que não é a dele.
 *
 * Por que existe: o `ESTADO.md` §3 trazia esta lista COPIADA À MÃO, e o §4 dela
 * derivava "19 params". A contagem mecânica dá **22** params de gaveta errada
 * (em 15 claims) mais **11** params com `value` string (em 10 claims). Lista
 * copiada é o modo de falha nº 3 desta casa: documento e código divergindo em
 * silêncio. Aqui o número vira comando.
 *
 * O QUE ESTA FERRAMENTA É, E O QUE NÃO É. É um DETECTOR com regras estreitas e
 * declaradas, não um verificador. Ela não entra no `check:kb` e não reprova
 * nada: as gavetas que faltam (ano de calendário, índice adimensional) ainda
 * não existem em `kb.mjs`, e travar contra um destino que não existe empurraria
 * o dado para fora da trava — modo de falha nº 2. Quando a onda 2 abrir as
 * gavetas e reparar os params, o passo final é transformar cada regra daqui
 * numa recusa do `check-claims.mjs`, e ESTE arquivo some.
 *
 * O recall NÃO é 100 %: as regras foram escritas a partir das famílias já
 * conhecidas. O que ela garante é que, para essas famílias, a lista é a mesma
 * hoje e depois de qualquer edição — ninguém precisa confiar na cópia.
 *
 *   node research/tools/params-gaveta-errada.mjs           # relatório por família
 *   node research/tools/params-gaveta-errada.mjs --ids     # só os ids, um por linha
 *   node research/tools/params-gaveta-errada.mjs --json    # para outro script consumir
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function carregarClaims() {
  const dir = join(raiz, 'research', 'extract');
  const saida = [];
  for (const arquivo of readdirSync(dir).filter((f) => f.endsWith('.jsonl'))) {
    const texto = readFileSync(join(dir, arquivo), 'utf8');
    for (const linha of texto.split('\n')) {
      if (!linha.trim()) continue;
      try {
        const c = JSON.parse(linha);
        c._arquivo = arquivo;
        saida.push(c);
      } catch {
        /* o check-claims.mjs é quem reprova JSONL quebrado; aqui é só leitura */
      }
    }
  }
  return saida;
}

const norm = (s) => String(s ?? '').toLowerCase().trim();

/**
 * As regras. Cada uma diz: a família, como se reconhece, para onde o param vai,
 * e se a gaveta de destino JÁ EXISTE em `kb.mjs`. A última coluna é a que
 * decide se a onda 2 pode reparar direto ou precisa antes ampliar o enumerado.
 */
const REGRAS = [
  {
    familia: 'volume em litro tipado como outra coisa',
    destino: 'l',
    destinoExiste: true,
    casa: (p) => /^(litro|litros|l)$/.test(norm(p.unit)) && p.frame !== 'l',
  },
  {
    familia: 'comprimento em pé (ft) tipado como cm',
    destino: 'pes',
    destinoExiste: true,
    casa: (p) => /^(pe|pes|pé|pés|ft|feet)$/.test(norm(p.unit)) && p.frame !== 'pes',
  },
  {
    familia: 'hora do relógio tipada como duração',
    destino: 'hora_do_dia',
    destinoExiste: true,
    // ESTA REGRA É UM PADRÃO DE NOME, e o recall dela fora dos casos conhecidos
    // é DESCONHECIDO. `unit: "h"` sozinha não decide: 15 dos 20 params com essa
    // unidade são duração de verdade (`duracao_treino`, `sono_alvo`,
    // `sono_perdido`). O que separa é o nome falar de um MOMENTO — `hora_leite`,
    // `almoco_hora` — e não de quanto tempo durou. Singular de propósito:
    // `horas_semana` e `duracao_alternativa_horas` são duração e não podem cair
    // aqui.
    casa: (p) =>
      /^(h|hora do dia)$/.test(norm(p.unit)) &&
      /^hora_|_hora$/.test(norm(p.name)) &&
      p.frame !== 'hora_do_dia',
  },
  {
    familia: 'ano de CALENDÁRIO tipado como duração ou contagem',
    destino: 'ano_calendario (NÃO EXISTE em kb.mjs)',
    destinoExiste: false,
    // Regra dupla: ou a unidade diz "ano" e o valor é um ano plausível, ou o
    // frame é de duração e o valor é grande demais para ser duração humana.
    casa: (p) =>
      typeof p.value === 'number' &&
      p.value >= 1900 &&
      p.value <= 2100 &&
      (/^anos?$/.test(norm(p.unit)) || ['anos', 'contagem', 'ordinal'].includes(p.frame)),
  },
  {
    familia: 'índice ADIMENSIONAL tipado como percentual',
    destino: 'indice_adimensional (NÃO EXISTE em kb.mjs)',
    destinoExiste: false,
    casa: (p) => /^(bri|r2|r²|r\^2)$/.test(norm(p.unit)) && p.frame === 'pct',
  },
  {
    familia: 'TAXA (algo por período) tipada como a duração sozinha',
    destino: 'sem gaveta para "horas por semana"; decidir gaveta ou tirar o número',
    destinoExiste: false,
    novo: true,
    // ACHADO NOVO desta passagem: a lista à mão do ESTADO.md §3 só tinha
    // `V102-25` (MET-min/semana). São 19, e a família é a mesma do bug dos
    // gramas gravados como `kg`: falta gaveta, então o denominador cai fora.
    // "4 h/semana de cardio" fica gravado como `4` com frame `horas`, ao lado
    // de "treino de 3 h" gravado como `3` com frame `horas` — quem filtra por
    // frame soma laranja com maçã. O `unit` guarda o "/semana", mas `unit` é
    // texto livre e `frame` é a gaveta que o consumidor lê.
    casa: (p) => norm(p.unit).includes('/') && ['min', 'seg', 'horas'].includes(p.frame),
  },
  {
    familia: 'dinheiro, que está declarado FORA de escopo (ENUMERADOS.md §5)',
    destino: 'o param sai da claim',
    destinoExiste: false,
    casa: (p) => /^(usd|eur|brl|r\$|\$|dolar|dólar|dolares|dólares)$/.test(norm(p.unit)),
  },
  {
    familia: '`value` string — foge de toda aritmética do checker',
    destino: 'fração vira número; rótulo perde o param',
    destinoExiste: true,
    casa: (p) => typeof p.value === 'string',
  },
];

/**
 * Fora das regras porque não é gaveta errada: é o número não medindo NADA.
 * Fica no relatório porque a onda 2 decide os dois no mesmo passe.
 */
const NAO_MEDE_NADA = new Map([
  ['V013-15', 'percentual de convicção — "100 % convicto" não é uma medida de nada'],
  ['V166-05', 'a claim é uma NOTA DE ARTEFATO de extração ("o número que a transcrição registra é 45 lb, valor implausível") ocupando gaveta de `fato`, com o número quebrado tipado num param'],
]);

const claims = carregarClaims();
const achados = [];

for (const c of claims) {
  for (const p of c.params ?? []) {
    for (const r of REGRAS) {
      if (!r.casa(p)) continue;
      achados.push({
        id: c.id,
        arquivo: c._arquivo,
        familia: r.familia,
        destino: r.destino,
        destinoExiste: r.destinoExiste,
        param: p.name,
        value: p.value,
        unit: p.unit,
        frame: p.frame,
      });
      break; // uma família por param: contar o mesmo param duas vezes inflaria o tamanho do passe
    }
  }
}

const args = new Set(process.argv.slice(2));

if (args.has('--json')) {
  console.log(JSON.stringify({ achados, naoMedeNada: [...NAO_MEDE_NADA] }, null, 2));
  process.exit(0);
}

const ids = [...new Set(achados.map((a) => a.id))].sort();

if (args.has('--ids')) {
  for (const id of ids) console.log(id);
  process.exit(0);
}

console.log(`\nParams em gaveta errada — ${claims.length} claims lidas de research/extract\n`);

const porFamilia = new Map();
for (const a of achados) {
  if (!porFamilia.has(a.familia)) porFamilia.set(a.familia, []);
  porFamilia.get(a.familia).push(a);
}

for (const [familia, lista] of porFamilia) {
  const r = REGRAS.find((x) => x.familia === familia);
  const marca = r.destinoExiste ? 'gaveta pronta' : 'GAVETA FALTANDO';
  const novo = r.novo ? '  [FAMÍLIA NOVA — não estava na lista à mão do ESTADO.md §3]' : '';
  console.log(`  ${lista.length}× ${familia}${novo}`);
  console.log(`      → ${r.destino}   [${marca}]`);
  for (const a of lista) {
    console.log(`      ${a.id}  ${a.param} = ${JSON.stringify(a.value)} ${a.unit} · frame ${a.frame}`);
  }
  console.log('');
}

console.log('  Números que não medem nada (não é gaveta errada; mesmo passe)');
for (const [id, porque] of NAO_MEDE_NADA) console.log(`      ${id}  ${porque}`);

// Gaveta aberta e nunca usada é meio conserto: o enumerado cresceu, o dado não
// se mexeu. É a contraprova barata de que o passe de reparo não aconteceu.
const usados = new Set();
for (const c of claims) for (const p of c.params ?? []) usados.add(p.frame);
const ABERTAS_EM_9_8 = ['pes', 'l', 'xicara', 'hora_do_dia', 'rotulo', 'ordinal',
  'pct_XRM', 'indice_estresse', 'escala_subjetiva', 'grau_C', 'grau_F', 'mm', 'm'];
const vazias = ABERTAS_EM_9_8.filter((f) => !usados.has(f));

const semGaveta = achados.filter((a) => !a.destinoExiste).length;
console.log(`\n  total: ${achados.length} params em ${ids.length} claims`);
console.log(`  dos quais ${semGaveta} não têm para onde ir sem ampliar o enumerado de kb.mjs`);
if (vazias.length) {
  console.log(`\n  gavetas abertas em 9/8 e ainda com ZERO uso: ${vazias.join(', ')}`);
  console.log('  — ampliar o enumerado sem mover o dado para dentro dele é meio conserto.');
}
console.log('\n  Como se verifica que ficou certo: este comando volta a imprimir ZERO,');
console.log('  e cada regra daqui vira uma recusa de check-claims.mjs — com o caso de');
console.log('  teste correspondente em check-claims.test.mjs, senão a trava nasce morta.\n');
