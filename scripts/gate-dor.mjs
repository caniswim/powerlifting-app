/**
 * Leitor da tabela do gate de dor de peitoral (PROGRAMA.md §1.2).
 *
 * A tabela do §1.2 é um protocolo de SEGURANÇA: o atleta tem histórico de lesão
 * de peitoral e o bloco inteiro foi desenhado em torno de reexposição gradual do
 * supino. Até esta revisão o gate existia em dois lugares — a prosa aqui e um
 * `if` no rollup semanal — e os dois divergiram em silêncio: o programa manda
 * congelar a 2/10 e o app só levantava bandeira a partir de 6/10.
 *
 * Este módulo existe para que passem a ser um objeto só. A tabela do markdown é
 * a FONTE ÚNICA; ela é lida aqui, emitida como `VENA_BLOCK1_PAIN_GATE` em
 * `generated.ts` pelo gerador, e consumida pelo código em `src/domain/painGate.ts`.
 * Nenhum limiar é digitado em código. `scripts/check-pain-gate.mjs` fecha o
 * circuito exercitando o rollup real contra o que esta função leu.
 *
 * O parser é deliberadamente rígido: reformatar a tabela quebra o build em vez
 * de silenciosamente deixar de reconhecer um degrau. Faltar degrau aqui é o modo
 * de falha caro — o gate deixaria de disparar sem ninguém notar.
 */

/** Rótulo da seção que contém a tabela. Mudou o título, o build para. */
const SECTION = '### 1.2 Gate de dor de peitoral';

/** Ações reconhecidas, da mais grave para a menos grave. A ORDEM importa. */
const ACTIONS = [
  { id: 'encerra_sessao', severidade: 3, match: /encerra a sess[ãa]o/i },
  { id: 'recua_degrau', severidade: 2, match: /recua um degrau/i },
  { id: 'congela', severidade: 1, match: /congela/i },
];

/** Tira negrito, código e itálico — sobra o texto que o parser lê. */
function plain(cell) {
  return cell.replace(/\*\*/g, '').replace(/`/g, '').replace(/\*/g, '').trim();
}

function sectionBody(md) {
  const start = md.indexOf(SECTION);
  if (start < 0) throw new Error(`Seção "${SECTION}" não encontrada em PROGRAMA.md`);
  const rest = md.slice(start + SECTION.length);
  const end = rest.search(/\n---\n|\n## /);
  return rest.slice(0, end < 0 ? rest.length : end);
}

/**
 * Lê a tabela `| Sinal | Ação |` do §1.2.
 *
 * Devolve os degraus de agravamento (ordenados por severidade) e a regra de
 * retorno. Toda linha da tabela tem de ser reconhecida: linha sobrando é erro,
 * degrau faltando é erro.
 */
export function parseGateDor(md) {
  const body = sectionBody(md);

  const escalaM = body.match(/escala\s+(\d+)\s*[–-]\s*(\d+)/);
  if (!escalaM) throw new Error('§1.2 sem a escala declarada ("escala 0–10")');
  const escala = [Number(escalaM[1]), Number(escalaM[2])];

  const rows = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && l.endsWith('|'))
    .map((l) => l.slice(1, -1).split('|').map((c) => c.trim()))
    .filter((c) => c.length === 2)
    .filter(([a]) => !/^-+$/.test(a) && plain(a).toLowerCase() !== 'sinal');

  if (rows.length === 0) throw new Error('§1.2 sem nenhuma linha de tabela reconhecida');

  const degraus = [];
  let retorno = null;

  for (const [rawSinal, rawAcao] of rows) {
    const sinal = plain(rawSinal);
    const acao = plain(rawAcao);

    if (/^RETORNO$/i.test(sinal)) {
      const m = acao.match(/(\d+)\s+semanas consecutivas com pico\s*≤\s*(\d+)\/10/);
      if (!m) throw new Error(`Linha RETORNO não reconhecida: "${acao}"`);
      retorno = { sinal, acao, semanas: Number(m[1]), picoMaximo: Number(m[2]) };
      continue;
    }

    const lim = sinal.match(/≥\s*(\d+)\/10/);
    if (!lim) throw new Error(`Sinal sem limiar "≥N/10": "${sinal}"`);
    const ev = sinal.match(/^(\d+)\s+eventos?\b/);
    const janela = sinal.match(/em\s+(\d+)\s+sess[õo]es/);
    const action = ACTIONS.find((a) => a.match.test(acao));
    if (!action) {
      throw new Error(`Ação não reconhecida (nenhuma de ${ACTIONS.map((a) => a.id).join(', ')}): "${acao}"`);
    }

    degraus.push({
      id: action.id,
      severidade: action.severidade,
      sinal,
      acao,
      eventos: ev ? Number(ev[1]) : 1,
      limiar: Number(lim[1]),
      janelaSessoes: janela ? Number(janela[1]) : null,
      // "estiramento agudo" é evento qualitativo: dispara o degrau sem número.
      estiramentoAgudo: /estiramento agudo/i.test(sinal),
    });
  }

  // --- Travas de sanidade sobre o que foi lido -------------------------------

  if (!retorno) throw new Error('§1.2 sem linha RETORNO');

  const ids = degraus.map((d) => d.id);
  const esperados = ACTIONS.map((a) => a.id).sort();
  if ([...new Set(ids)].length !== ids.length) {
    throw new Error(`Degrau duplicado em §1.2: ${ids.join(', ')}`);
  }
  if ([...ids].sort().join(',') !== esperados.join(',')) {
    throw new Error(`§1.2 devia declarar exatamente ${esperados.join(', ')}; leu ${ids.join(', ')}`);
  }

  degraus.sort((a, b) => b.severidade - a.severidade);

  for (const d of degraus) {
    if (d.limiar < escala[0] || d.limiar > escala[1]) {
      throw new Error(`Limiar ${d.limiar} fora da escala ${escala[0]}–${escala[1]} (${d.id})`);
    }
    if (d.eventos < 1) throw new Error(`Degrau "${d.id}" com ${d.eventos} eventos`);
    if (d.eventos > 1 && d.janelaSessoes === null) {
      throw new Error(`Degrau "${d.id}" exige ${d.eventos} eventos sem declarar janela de sessões`);
    }
  }

  const encerra = degraus.find((d) => d.id === 'encerra_sessao');
  const congela = degraus.find((d) => d.id === 'congela');
  if (encerra.limiar <= congela.limiar) {
    throw new Error(
      `Ordem invertida: encerrar sessão a ${encerra.limiar}/10 não pode ser ≤ congelar a ${congela.limiar}/10`,
    );
  }
  if (retorno.picoMaximo >= congela.limiar) {
    throw new Error(
      `Pico de retorno (≤${retorno.picoMaximo}/10) não pode alcançar o limiar de congelamento (≥${congela.limiar}/10)`,
    );
  }
  // RETORNO é a única linha da tabela que AFROUXA, e é consumida por código
  // desde que o `WeekDoc` passou a carregar histórico entre semanas. Zero
  // semanas exigidas tornaria o retorno automático — e as travas de truncagem
  // do rollup, que fatiam pelas últimas N semanas, degeneram em "todas".
  if (!Number.isInteger(retorno.semanas) || retorno.semanas < 1) {
    throw new Error(`RETORNO exige ao menos 1 semana limpa; leu ${retorno.semanas}`);
  }
  if (retorno.picoMaximo < escala[0]) {
    throw new Error(`Pico de retorno ${retorno.picoMaximo} abaixo da escala ${escala[0]}–${escala[1]}`);
  }

  return {
    secao: '§1.2',
    escala,
    /** Menor intensidade que exige QUALQUER ação. É o limiar da bandeira. */
    limiarMinimo: Math.min(...degraus.map((d) => d.limiar)),
    degraus,
    retorno,
  };
}
