#!/usr/bin/env node
/**
 * Quem verifica o verificador.
 *
 * `check-claims.mjs` carimba milhares de claims como "toda citação resolve, todo
 * verbatim existe, todo número tem frame". Toda a confiança na base repousa
 * nisso. Mas ninguém testava se ele ainda pega alguma coisa — e um checker
 * silenciosamente quebrado é PIOR do que checker nenhum: sem checker você
 * desconfia, com um checker quebrado você para de desconfiar.
 *
 * O modo de falha é concreto e nada exótico. A checagem de verbatim compara
 * texto normalizado; basta alguém "melhorar" a normalização até ela apagar
 * caracteres demais para que qualquer string vire prefixo de qualquer outra e
 * tudo passe. O `✓` continua saindo verde. Ninguém percebe.
 *
 * Então cada defeito que o checker promete pegar vira aqui um caso de teste:
 * monta-se um extract sintético com a claim quebrada daquele jeito específico e
 * exige-se que o checker falhe. Se ele passar, o teste falha — é a única forma
 * de a garantia significar alguma coisa.
 *
 * Uso: node research/tools/check-claims.test.mjs
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CHECKER = join(ROOT, 'research/tools/check-claims.mjs');
const EXTRACT = join(ROOT, 'research/extract');

/**
 * A claim base tem que ser REAL, colhida do extract, e não escrita à mão: uma
 * claim inventada por mim poderia passar por acidente de um verbatim que também
 * inventei. Partindo de uma que o checker já aprovou, qualquer falha depois da
 * mutação é atribuível à mutação.
 */
function claimBoaDeVerdade() {
  for (const f of readdirSync(EXTRACT).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const line of readFileSync(join(EXTRACT, f), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      const c = JSON.parse(line);
      // Precisa ter param, para os testes de frame terem o que quebrar.
      if (c.tier === 'R' && c.verbatim?.length > 30 && (c.params ?? []).length > 0) return c;
    }
  }
  throw new Error('nenhuma claim de corpus com param encontrada para servir de base');
}

function roda(claims) {
  const dir = mkdtempSync(join(tmpdir(), 'claims-test-'));
  try {
    const porArquivo = new Map();
    for (const c of claims) {
      const f = `${c.src ?? 'R001'}.jsonl`;
      porArquivo.set(f, [...(porArquivo.get(f) ?? []), JSON.stringify(c)]);
    }
    for (const [f, linhas] of porArquivo) writeFileSync(join(dir, f), `${linhas.join('\n')}\n`);
    execFileSync('node', [CHECKER, '--extract', dir], { encoding: 'utf8', stdio: 'pipe' });
    return { passou: true, saida: '' };
  } catch (err) {
    return { passou: false, saida: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const base = claimBoaDeVerdade();
const clone = () => JSON.parse(JSON.stringify(base));

/**
 * Cada caso: um defeito que o checker PROMETE pegar, e um trecho que precisa
 * aparecer na mensagem de erro. Checar a mensagem evita o falso verde de o
 * checker falhar pelo motivo errado — um teste que aceita qualquer erro é
 * satisfeito por um typo no próprio teste.
 */
const CASOS = [
  {
    nome: 'verbatim que não existe na transcrição',
    esperado: /verbatim NÃO aparece/,
    mutar: (c) => { c.verbatim = 'this exact sentence was never said by anyone on this channel'; },
  },
  {
    nome: 'verbatim real, mas em instante muito diferente do declarado',
    esperado: /não em|passa da duração/,
    mutar: (c) => { c.at = '59:59'; },
  },
  {
    nome: 'citação para vídeo que não existe',
    esperado: /não existe no manifesto/,
    mutar: (c) => { c.src = 'R999'; },
  },
  {
    // O checker resolve `src` contra a UNIÃO dos manifestos, para claims `G###`
    // do Blevins serem validáveis sem a claim declarar a fonte. Este caso é o
    // preço disso: a união não pode virar "aceita qualquer coisa". `G999` tem
    // prefixo legítimo e número que não existe — exatamente o erro que passaria
    // despercebido se a generalização tivesse trocado o índice por um `if`.
    nome: 'citação com prefixo de outro corpus e número inexistente lá',
    esperado: /não existe no manifesto/,
    mutar: (c) => { c.src = 'G999'; },
  },
  {
    nome: 'citação com prefixo que não pertence a nenhuma fonte',
    esperado: /não pertence a nenhuma fonte/,
    mutar: (c) => { c.src = 'Z042'; },
  },
  {
    nome: 'elite sem source com nome e URL',
    esperado: /tier E exige source\./,
    mutar: (c) => { c.tier = 'E'; c.source = { name: 'alguém forte' }; },
  },
  {
    nome: 'elite com URL que não é URL',
    esperado: /source\.url navegável/,
    mutar: (c) => { c.tier = 'E'; c.source = { name: 'alguém forte', url: 'me contaram' }; },
  },
  {
    nome: 'claim do usuário sem a data da conversa',
    esperado: /tier U exige source\.date/,
    mutar: (c) => { c.tier = 'U'; c.source = { canal: 'conversa' }; },
  },
  {
    nome: 'citação para vídeo pós-run-1, fora da numeração',
    esperado: /pós-run-1/,
    mutar: (c) => { c.src = 'R000'; },
  },
  {
    nome: 'número na claim sem param que o sustente',
    esperado: /número sem procedência/,
    mutar: (c) => { c.claim = 'ele prescreve 7 séries de agachamento por semana'; c.params = []; },
  },
  {
    nome: 'param sem frame — o bug dos 215 kg',
    esperado: /sem frame/,
    mutar: (c) => { delete c.params[0].frame; },
  },
  {
    nome: 'param com frame fora do enumerado',
    esperado: /fora do enumerado/,
    mutar: (c) => { c.params[0].frame = 'quilos_mais_ou_menos'; },
  },
  {
    nome: 'tier fora do enumerado fechado',
    esperado: /tier .* fora do enumerado/,
    mutar: (c) => { c.tier = 'X'; },
  },
  {
    nome: 'interpretação sem basis — a lavagem de I para R',
    esperado: /exige basis/,
    mutar: (c) => { c.tier = 'I'; delete c.basis; },
  },
  {
    nome: 'literatura sem PMID nem DOI',
    esperado: /exige source com PMID ou DOI/,
    mutar: (c) => { c.tier = 'L'; c.source = { titulo: 'um estudo qualquer' }; },
  },
  {
    nome: 'claim de corpus sem scope',
    esperado: /exige scope/,
    mutar: (c) => { delete c.scope; },
  },
  {
    nome: 'conflicts apontando para claim inexistente',
    esperado: /conflicts aponta/,
    mutar: (c) => { c.conflicts = ['V999-99']; },
  },
  {
    nome: 'verbatim curto demais para ser evidência',
    esperado: /curto demais/,
    mutar: (c) => { c.verbatim = 'the squat'; },
  },
  {
    nome: 'JSON inválido no meio do arquivo',
    esperado: /JSON inválido/,
    bruto: true,
  },
];

console.log('\nTeste do compilador de claims');
console.log(`  claim-base real: ${base.id} (${base.src} @${base.at})\n`);

// Sanidade: a claim intocada tem que passar. Se não passar, todo o resto do
// teste vira ruído — um falso positivo em cada linha.
const controle = roda([clone()]);
if (!controle.passou) {
  console.error('✗ CONTROLE: a claim real não passou sem nenhuma mutação.');
  console.error(controle.saida.split('\n').slice(0, 12).join('\n'));
  process.exit(1);
}
console.log('  ✓ controle: claim intacta passa');

let falhas = 0;
for (const caso of CASOS) {
  let r;
  if (caso.bruto) {
    const dir = mkdtempSync(join(tmpdir(), 'claims-test-'));
    try {
      writeFileSync(join(dir, `${base.src}.jsonl`), `${JSON.stringify(clone())}\n{isto não é json}\n`);
      execFileSync('node', [CHECKER, '--extract', dir], { encoding: 'utf8', stdio: 'pipe' });
      r = { passou: true, saida: '' };
    } catch (err) {
      r = { passou: false, saida: `${err.stdout ?? ''}${err.stderr ?? ''}` };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  } else {
    const c = clone();
    caso.mutar(c);
    r = roda([c]);
  }

  if (r.passou) {
    console.error(`  ✗ ${caso.nome}\n      o checker APROVOU uma claim que deveria recusar`);
    falhas += 1;
  } else if (!caso.esperado.test(r.saida)) {
    console.error(
      `  ✗ ${caso.nome}\n      recusou, mas pelo motivo errado — esperava ${caso.esperado}\n` +
        `      obteve: ${r.saida.split('\n').find((l) => l.includes('✗'))?.trim() ?? '(sem linha de erro)'}`,
    );
    falhas += 1;
  } else {
    console.log(`  ✓ ${caso.nome}`);
  }
}

if (falhas > 0) {
  console.error(`\n${falhas} de ${CASOS.length} defeito(s) passariam despercebidos pelo checker.\n`);
  process.exit(1);
}
console.log(`\n✓ o compilador pega os ${CASOS.length} defeitos que promete pegar\n`);
