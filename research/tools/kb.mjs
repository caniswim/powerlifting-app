/**
 * Os enumerados fechados do SCHEMA.md e o carregador do extract, num lugar só.
 *
 * Eles moraram dentro do `check-claims.mjs` enquanto ele era o único que
 * precisava deles. Deixou de ser: `check-canarios.mjs` também precisa validar
 * `frame`, `topic` e `modo` — porque um canário com typo no filtro fica em zero
 * para sempre, e "zero" é exatamente o resultado que ele reporta como sucesso.
 * Um predicado com typo é um canário morto que se declara vivo.
 *
 * Copiar as listas para o segundo arquivo repetiria o defeito que o próprio
 * SCHEMA.md documenta na abertura: enumerado crescendo em um lugar enquanto o
 * outro descreve outra coisa, em silêncio, por meses. Então elas moram aqui e
 * todo mundo importa daqui.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const TIERS = new Set(['R', 'E', 'L', 'I', 'U', 'O']);
export const SCOPES = new Set(['GERAL', 'PESSOAL']);
export const CERTAINTY = new Set(['explicit', 'implied']);

/**
 * `modo` — QUE TIPO de afirmação é, ortogonal a `scope`. Estava no SCHEMA.md
 * desde o começo e nunca teve trava: durante toda a extração do Blevins, 1.819
 * claims gravaram `modo` sem nada conferir se o valor pertencia à lista. Um
 * `prescrição` acentuado ou um `prescription` em inglês teria passado, e a
 * consulta que mais importa — filtrar o que pode virar programa — devolveria
 * menos do que existe, sem uma linha de reclamação.
 */
export const MODOS = new Set([
  'prescricao', 'opiniao', 'mecanismo', 'fato', 'estudo', 'anedota', 'narrativa',
  // Ver ENUMERADOS.md para o registro da decisão. Em resumo: metade do corpus do
  // Blevins é ele descrevendo o programa DE OUTRA PESSOA (5/3/1, Candito, PHUL,
  // StrongLifts) ou corrigindo a técnica de um desconhecido a partir de um vídeo
  // enviado. Sem estes dois valores, as duas coisas caem em `prescricao`, e
  // `prescricao` é o único modo que pode virar treino. Um consumidor filtrando
  // `scope: GERAL` + `modo: prescricao` receberia "o nSuns manda AMRAP a 95 % do
  // training max" como se fosse o Blevins mandando você fazer isso.
  'relato-de-programa',
  'avaliacao-de-terceiro',
]);

/**
 * Enumerado fechado, mas não pequeno por esporte: faltar gaveta é pior do que
 * ter gaveta demais. Sem `semanas` e `contagem`, o primeiro lote escreveu os
 * números por extenso para não inventar frame — a trava empurrou o dado para
 * fora da trava, que é o oposto do que ela existe para fazer.
 *
 * `mm` e `m` entraram com o regulamento: a IPF mede equipamento em milímetro e
 * metro (13 mm de cinto, 1 m de faixa de punho). Sem essas duas gavetas, 13 mm
 * viraria 1,3 cm na conversão do agente — que é exatamente o erro de unidade que
 * o enumerado existe para barrar.
 */
export const FRAMES = new Set([
  '1RM_treino', '1RM_legal', 'TM', 'pct_TM', 'pct_1RM',
  'RPE', 'RIR', 'kg', 'lb', 'reps', 'series', 'pct', 'cm',
  'seg', 'min', 'horas', 'dias', 'semanas', 'meses', 'anos', 'x_semana',
  'contagem', 'idade', 'DOTS',
  'g', 'kcal', 'ml', 'graus', 'bpm', 'pct_FCmax', 'mmHg', 'g_por_kg', 'g_por_lb',
  'polegadas', 'escala_dor', 'n_amostra', 'IMC',
  'mm', 'm',

  // ── Ampliação de 2026-08-09, antes do passe que preenche `modo` e
  // `conditions` em 6.909 claims. Justificativa completa em ENUMERADOS.md; o
  // resumo de cada uma está aqui porque é aqui que o próximo agente vai olhar.

  /** % de um XRM que NÃO é 1RM ("85 % do seu 5RM"). Mesma forma de `pct_1RM`,
   *  dose completamente diferente: confundir os dois é o bug dos 215 kg outra
   *  vez. Exige o param companheiro `xrm_base` dizendo qual é o X. */
  'pct_XRM',
  /** Dígito que identifica POSIÇÃO numa sequência e não mede quantidade:
   *  semana 3, bloco 2, onda 1, tentativa 2, tier 2. Sem esta gaveta os lotes
   *  escreveram "fase um" por extenso (G019-12/13/23) para fugir da trava —
   *  ou, pior, gravaram a posição como duração (`semanas`). */
  'ordinal',
  /** Dígito que faz parte de um NOME: 5/3/1, 5x5, Ph3, T1. Não mede nada, não
   *  soma, não converte. Foi a falta desta gaveta que fez `G019-20` declarar
   *  `series: 5` e `reps: 5` para a frase "o StrongLifts 5x5 traz menos terra",
   *  que não prescreve série nenhuma — a trava fabricando a medida que ela
   *  existe para proteger. */
  'rotulo',
  /** Escala subjetiva arbitrária 0–10 que não é dor nem RPE ("foco 2 de 10").
   *  `escala_dor` continua separado: é instrumento clínico com significado
   *  próprio, e fundir os dois perderia isso. */
  'escala_subjetiva',
  /** A unidade do *stress index* (Tuchscherer/Bromley): ~1 série dura em RPE
   *  8–9. É magnitude de verdade — soma, compara, tem banda alvo —, e não tem
   *  nenhuma outra gaveta onde caiba sem virar `contagem` de coisa nenhuma. */
  'indice_estresse',
  /** Hora do relógio, que NÃO é duração. `V171-32` gravou "dormir das 22 h às
   *  6 h" com frame `horas`, e "6" com frame de duração se lê como seis horas
   *  de sono. Dois dos params já traziam `unit: "hora do dia"` — o agente
   *  documentou o empréstimo por escrito porque não tinha para onde ir. */
  'hora_do_dia',
  'grau_C', 'grau_F',   // temperatura. `graus` é ÂNGULO e continua sendo.
  'l',                  // litro. `V112-22` gravou "meio litro" como `kg`.
  'xicara',             // medida culinária. Alternativa era o agente converter para ml — e conversão de agente é o que este enumerado existe para impedir.
  'pes',                // pé/ft. Mesma razão: sem a gaveta, o agente converte para cm sozinho.
]);

/**
 * Frames de DOSE — os que fazem uma prescrição virar treino de verdade.
 *
 * Serve à checagem que o SCHEMA.md prometia desde o primeiro dia e que nunca
 * existiu: prescrição com dose e sem `conditions` é o defeito mais grave que a
 * auditoria de escopo encontrou ("supino 6× por semana" extraído sem "nunca
 * acima de RPE 5"). Separada da condição, a prescrição não fica incompleta —
 * fica perigosa, porque parece completa.
 */
export const FRAMES_DOSE = new Set([
  'series', 'reps', 'x_semana', 'RPE', 'RIR',
  'pct_1RM', 'pct_TM', 'pct_XRM', 'TM', '1RM_treino', '1RM_legal', 'kg', 'lb',
]);

/**
 * Frames que carregam ESCALA FECHADA — e o intervalo que a escala admite.
 *
 * `RPE 12` não é um valor alto, é um valor que não existe: a escala vai a 10.
 * A base tinha um, `V033-10`, e ele nasceu de legenda quebrada — "2 and a half
 * to 3 RPE" saiu do ASR como "2 and 12 to 3", e o extrator gravou o `12` como
 * se fosse um RPE. Passou por toda trava porque `12` é um número sintaticamente
 * válido num campo numérico, e é exatamente a mesma família dos gramas gravados
 * como `kg`: o frame existe, o valor não cabe nele, e ninguém pergunta.
 *
 * Os limites são frouxos de propósito. `pct_1RM` vai a 150 e não a 100 porque
 * overload excêntrico e trabalho supramáximo existem; `RIR` vai a 15 porque
 * acessório em rep alta declara RIR alto de verdade. A trava é contra o
 * impossível, não contra o incomum — trava estreita empurra o dado para fora
 * dela, que é o modo de falha nº 2 deste projeto.
 */
export const FRAMES_ESCALA = new Map([
  ['RPE', [0, 10]],
  ['RIR', [0, 15]],
  ['escala_dor', [0, 10]],
  ['pct_1RM', [0, 150]],
  ['pct_TM', [0, 150]],
  ['pct_XRM', [0, 150]],
  ['pct_FCmax', [0, 100]],
]);

/**
 * `suspectWhy` — enumerado fechado desde o PROTOCOLO-EXTRACAO.md, nunca travado.
 *
 * O protocolo fecha em dois valores e escreve o porquê: "é o mesmo passe de
 * reparo com Whisper que resolve os dois, e ele PRECISA SABER O QUE PROCURAR".
 * Sem o campo, `list-suspects.mjs` assume `numero`, e a família `negacao` passa
 * a depender inteiramente de heurística — a marcação de quem leu o trecho é
 * jogada fora. Mesmo padrão do `modo`: caixa alta no documento, zero linha no
 * código, até 2026-08-09.
 */
export const SUSPECT_WHY = new Set(['numero', 'negacao']);

/**
 * O vocabulário de tópicos, lido do PRÓPRIO protocolo.
 *
 * `PROTOCOLO-EXTRACAO.md` diz, em caixa alta, que o vocabulário é FECHADO — e
 * durante toda a extração nada verificou isso. Uma claim usou o tópico `idade`,
 * que nunca existiu na lista, e passou. Regra sem trava é sugestão, e uma gaveta
 * inventada é pior do que parece: sem banco vetorial, `topic` É o mecanismo de
 * recuperação, e um sinônimo solto esconde a claim de quem procura.
 *
 * A lista é lida do markdown em vez de duplicada aqui porque já erramos assim
 * uma vez: o enumerado de `frame` cresceu no código e o SCHEMA.md ficou
 * descrevendo outra coisa. Documento e trava precisam ser o mesmo objeto.
 */
export function carregarTopicos(root) {
  const md = readFileSync(join(root, 'research/kb/PROTOCOLO-EXTRACAO.md'), 'utf8');
  const bloco = /## Vocabulário de tópicos[^\n]*\n[\s\S]*?```\n([\s\S]*?)```/.exec(md);
  if (!bloco) throw new Error('vocabulário de tópicos não encontrado em PROTOCOLO-EXTRACAO.md');
  return new Set(bloco[1].split(/\s+/).filter(Boolean));
}

// ── números: a regra ÚNICA de leitura de dígito ──────────────────────────────
//
// Ela morava duplicada no `check-answer.mjs` e no `check-canarios.mjs`, e as duas
// cópias JÁ tinham divergido: a segunda não sabia separador de milhar (`1.500`
// virava 1,5) nem número por extenso, embora o comentário dela dissesse "mesma
// regra do check-answer.mjs". É o defeito que a abertura do SCHEMA.md descreve —
// duas descrições da mesma coisa afastando-se em silêncio — cometido dentro do
// próprio instrumento que existe para pegá-lo.

/**
 * `1.500` é mil e quinhentos; `1.5` é um e meio; `92,5` é noventa e dois e meio.
 * Sem esta distinção um separador de milhar viraria decimal e a comparação nunca
 * casaria — o falso positivo mais chato possível, porque a resposta ESTÁ certa.
 */
export function paraNumero(bruto) {
  let s = String(bruto).trim();
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
  else s = s.replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export const RX_NUMERO = /\d+(?:[.,]\d+)*/g;

/** Os dígitos do texto, com posição — o lado da RESPOSTA precisa do índice. */
export function numerosCrus(texto) {
  const out = [];
  for (const m of String(texto ?? '').matchAll(RX_NUMERO)) {
    const n = paraNumero(m[0]);
    if (n !== null) out.push({ n, bruto: m[0], idx: m.index });
  }
  return out;
}

const EXTENSO = new Map(Object.entries({
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5,
  seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13,
  quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18,
  dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60,
  setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100, mil: 1000,
  meio: 0.5, meia: 0.5, metade: 0.5, dúzia: 12, duzia: 12,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000, half: 0.5, dozen: 12, couple: 2,
}));

export function numerosPorExtenso(texto) {
  const out = [];
  const palavras = String(texto ?? '').toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  for (let i = 0; i < palavras.length; i += 1) {
    const v = EXTENSO.get(palavras[i]);
    if (v === undefined) continue;
    out.push(v);
    // "setenta e cinco" / "twenty five": dezena redonda seguida de unidade também
    // é UM número, e é a forma como o ASR escreve percentual falado.
    if (v >= 20 && v <= 90 && v % 10 === 0) {
      const prox = palavras[i + 1] === 'e' ? palavras[i + 2] : palavras[i + 1];
      const u = EXTENSO.get(prox);
      if (u !== undefined && u >= 1 && u <= 9) out.push(v + u);
    }
  }
  return out;
}

/** Tudo o que uma claim pode legitimamente ter emprestado a uma resposta. */
export function numerosDaClaim(c) {
  const alvo = [
    c.claim, c.verbatim, c.verbatimWhisper,
    ...(c.params ?? []).map((p) => String(p.value)),
  ].filter(Boolean).join(' \n ');
  return [...numerosCrus(alvo).map((x) => x.n), ...numerosPorExtenso(alvo)];
}

/**
 * Lê o extract inteiro. JSON quebrado é ignorado aqui de propósito: quem
 * reclama de sintaxe é o `check-claims.mjs`, e uma linha corrompida não pode
 * derrubar a ferramenta que está tentando medir a base.
 */
export function carregarClaims(extractDir) {
  if (!existsSync(extractDir)) return { claims: [], porId: new Map() };
  const claims = [];
  for (const f of readdirSync(extractDir).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const linha of readFileSync(join(extractDir, f), 'utf8').split('\n')) {
      if (!linha.trim()) continue;
      try {
        claims.push(JSON.parse(linha));
      } catch {
        /* o check-claims.mjs é quem reclama de JSON quebrado */
      }
    }
  }
  return { claims, porId: new Map(claims.map((c) => [c.id, c])) };
}
