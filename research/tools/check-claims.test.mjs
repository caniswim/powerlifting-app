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

/**
 * Uma claim real de um vídeo ESPECÍFICO. Os casos de `genero` precisam disso: a
 * trava depende do vídeo de onde a claim veio, e trocar o `src` de uma claim
 * qualquer levaria junto um `verbatim` que não existe na transcrição de destino
 * — o checker reprovaria pelo motivo errado e o teste ficaria verde por engano.
 */
function claimDoArquivo(ref, filtro = () => true) {
  for (const line of readFileSync(join(EXTRACT, `${ref}.jsonl`), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const c = JSON.parse(line);
    if (c.tier === 'R' && c.scope === 'GERAL' && c.verbatim?.length > 30 && filtro(c)) return c;
  }
  throw new Error(`nenhuma claim de ${ref}.jsonl serve de base para o teste`);
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
    // A saída sai mesmo quando o checker PASSA: caso de aviso precisa ler o
    // texto do aviso, e sem isso "o checker passou" seria a única informação
    // disponível — que é exatamente o que um aviso não emitido também produz.
    const out = execFileSync('node', [CHECKER, '--extract', dir, '--verbose'], { encoding: 'utf8', stdio: 'pipe' });
    return { passou: true, saida: out };
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
    // `modo` governa a consulta que decide o que pode virar treino. Um valor
    // fora do enumerado não quebra nada visivelmente — a claim simplesmente
    // some do filtro `modo: prescricao` e ninguém percebe a ausência.
    nome: 'modo fora do enumerado fechado',
    esperado: /modo .* fora do enumerado/,
    mutar: (c) => { c.modo = 'prescrição'; },
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
    // `conditions` é, pelo SCHEMA.md, "a aresta mais importante da base", e foi a
    // única lista de ids sem trava até 2026-08-09. Condição que não abre é pior
    // do que condição ausente: parece que a prescrição está qualificada.
    nome: 'conditions apontando para claim inexistente',
    esperado: /conditions aponta/,
    mutar: (c) => { c.conditions = ['V999-99']; },
  },
  {
    // "A limita B" e "B limita A" ao mesmo tempo não descreve limitação nenhuma:
    // uma das duas arestas está invertida. A auditoria achou 5 pares mútuos, e o
    // molde é sempre o mesmo — a regra geral apontada como condição do exemplo
    // que ela própria gera, que é `basis` com nome errado.
    nome: 'ciclo em conditions: duas claims apontando uma para a outra',
    esperado: /conditions é assimétrica/,
    montar: (clone) => {
      const a = clone(); const b = clone();
      a.id = `${a.id.split('-')[0]}-90`; b.id = `${b.id.split('-')[0]}-91`;
      a.conditions = [b.id]; b.conditions = [a.id];
      return [a, b];
    },
  },
  {
    // `RPE 12` não é um valor alto, é um valor que não existe. O único caso da
    // base nasceu de legenda quebrada e passou por toda trava porque 12 é um
    // número sintaticamente válido num campo numérico.
    nome: 'valor fora da escala fechada do próprio frame',
    esperado: /só admite 0–10/,
    mutar: (c) => { c.params = [{ name: 'rpe_alvo', value: 12, unit: 'RPE', frame: 'RPE' }]; c.claim = 'O alvo é RPE 12.'; },
  },
  {
    nome: 'suspectWhy com valor fora do enumerado fechado',
    esperado: /suspectWhy .* fora do enumerado/,
    mutar: (c) => { c.suspect = true; c.suspectWhy = 'achei estranho'; },
  },
  {
    nome: 'suspectWhy sem suspect — razão da suspeita que ninguém lê',
    esperado: /suspectWhy sem suspect/,
    mutar: (c) => { c.suspectWhy = 'numero'; },
  },
  {
    // A catraca do `suspectWhy`, no mesmo desenho da do `modo`: teto declarado
    // que só desce, para o campo virar obrigatório sozinho quando a dívida
    // acabar. Sem ela, lote novo volta a marcar `suspect` sem dizer o quê.
    nome: 'lote estourando o teto de suspect sem suspectWhy',
    esperado: /teto declarado é 53/,
    montar: (clone, base) => {
      const pref = base.id.split('-')[0];
      return Array.from({ length: 54 }, (_, i) => {
        const c = clone();
        c.id = `${pref}-${String(i + 1).padStart(2, '0')}`;
        c.suspect = true;
        delete c.suspectWhy;
        return c;
      });
    },
  },
  {
    // A catraca da `anedota`. O `PROTOCOLO-EXTRACAO.md` proibiu o valor em lote
    // novo em 9/8/2026 e `MODOS` continua aceitando-o — tem de continuar, porque
    // as 243 claims que estão lá só migram na onda 2. Sem catraca, a proibição é
    // markdown puro e a janela entre ela e a onda 2 é exatamente quando a dívida
    // cresce, com dezoito agentes ingerindo em paralelo.
    //
    // O caso é montado no prefixo do Blevins (teto 47) e não num prefixo fora do
    // mapa porque é o cenário real: a fonte que ainda está sendo ingerida. Se
    // alguém subir `TETO_ANEDOTA.G` para deixar um lote passar, este teste cai.
    nome: 'lote novo estourando o teto de anedota',
    esperado: /teto declarado para G é 47/,
    montar: (clone, base) => {
      const pref = base.id.split('-')[0];
      return Array.from({ length: 48 }, (_, i) => {
        const c = clone();
        c.id = `${pref}-${String(i + 1).padStart(2, '0')}`;
        c.modo = 'anedota';
        c.scope = 'PESSOAL';
        return c;
      });
    },
  },
  {
    // O esquema define `PESSOAL` ("ele descreve o que ELE faz") e `prescricao`
    // ("ele diz para VOCÊ fazer") como mutuamente excludentes. A base tinha 13
    // ocorrências do par e 10 estavam erradas.
    nome: 'scope PESSOAL com modo prescricao é sinalizado',
    aviso: true,
    esperado: /PESSOAL com modo prescricao/,
    mutar: (c) => { c.scope = 'PESSOAL'; c.modo = 'prescricao'; },
  },
  {
    // A válvula da trava de escala. `suspect: true` quer dizer "este número está
    // declarado como provável defeito de ASR e o passe de Whisper é o dono".
    // Sem a válvula, a única forma de o build passar seria adivinhar o número
    // que a fonte disse — o defeito que esta base existe para não ter. Caso de
    // aviso e não de aceitação muda: tem de sobrar RASTRO, não silêncio.
    nome: 'valor fora da escala, mas declarado suspect, vira aviso e não erro',
    aviso: true,
    esperado: /declarado suspect, é alvo do passe de Whisper/,
    mutar: (c) => {
      c.params = [{ name: 'rpe_alvo', value: 12, unit: 'RPE', frame: 'RPE' }];
      c.claim = 'O alvo é RPE 12.';
      c.suspect = true; c.suspectWhy = 'numero';
    },
  },
  {
    nome: 'id fora da forma que o check-evidence.mjs resolve',
    esperado: /não tem a forma/,
    // Exatamente o que 702 claims do Blevins tinham: irresolvível, em silêncio.
    mutar: (c) => { c.id = `V${c.id}`; },
  },
  {
    nome: 'id que não pertence ao arquivo em que está',
    esperado: /não pertence a/,
    mutar: (c) => { c.id = 'Z777-01'; },
  },
  {
    nome: 'percentual de XRM sem dizer qual XRM',
    esperado: /xrm_base/,
    mutar: (c) => { c.params[0].frame = 'pct_XRM'; },
  },
  {
    // A mensagem do caso acima sempre disse "(frame reps)" e nada conferia.
    // `xrm_base` em kg é a CARGA do XRM, não o X: o "85 %" volta a ficar sem
    // base declarada, que é o buraco inteiro que o `pct_XRM` foi aberto para
    // fechar.
    nome: 'xrm_base declarado, mas com frame que não é reps',
    esperado: /o X de um XRM é número de repetições/,
    mutar: (c) => {
      c.claim = 'A carga de trabalho fica em 85% do máximo de referência.';
      c.params = [
        { name: 'intensidade', value: 85, unit: '% do XRM', frame: 'pct_XRM' },
        { name: 'xrm_base', value: 100, unit: 'kg', frame: 'kg' },
      ];
    },
  },
  {
    nome: 'regra normativa carregando modo',
    esperado: /tier O não leva modo/,
    mutar: (c) => { c.tier = 'O'; c.modo = 'fato'; },
  },
  {
    nome: 'verbatim curto demais para ser evidência',
    esperado: /curto demais/,
    mutar: (c) => { c.verbatim = 'the squat'; },
  },
  {
    // FURO REAL, achado atacando a trava. `REF_NA_PROSA` usava `[^\]]*`, que é
    // guloso: um ref NU na prosa (`R159`, sem colchete) fazia o casamento correr
    // até o fim da frase por falta de um `]` que o parasse, e todo número depois
    // dele sumia da checagem de procedência — a trava que impede um fator
    // inventado de entrar, desligada por uma citação.
    nome: 'número solto depois de um ref nu na prosa',
    esperado: /número sem procedência/,
    mutar: (c) => {
      c.claim = 'Como ele já dizia em R159, o volume sobe para 47 séries por semana.';
      c.params = [];
    },
  },
  {
    nome: 'número solto depois de um ref entre colchetes',
    esperado: /número sem procedência/,
    mutar: (c) => {
      c.claim = 'Como em [G042 @03:05], o volume sobe para 47 séries por semana.';
      c.params = [];
    },
  },
  {
    nome: 'JSON inválido no meio do arquivo',
    esperado: /JSON inválido/,
    bruto: true,
  },
  {
    // FURO REAL. O teto era um número global, e um número global vaza pelo
    // caminho mais óbvio: preencher `modo` numa claim antiga abre uma vaga para
    // uma claim nova nascer sem ele. O passe seguinte faz as duas coisas ao
    // mesmo tempo. Aqui a claim nova tem prefixo `G`, que não tem dívida
    // declarada, e por isso precisa falhar por si só — sem depender de contagem
    // de mais ninguém.
    nome: 'claim nova (prefixo sem dívida declarada) nascendo sem modo',
    esperado: /sem modo com id G###|teto declarado para G/,
    mutar: (c) => { delete c.modo; },
  },
  {
    // A trava do `genero`. `G003` é resenha do template do Alexander Bromley e
    // hoje tem ZERO claims em `prescricao`, então não aparece no
    // `TETO_PRESCRICAO_EM_GENERO_RESTRITO` e o teto dele vale zero. Uma
    // prescrição nascendo ali é o defeito exato que o campo existe para pegar:
    // o imperativo é do Bromley, não do Blevins, e sem esta trava ele entraria
    // no filtro que vira treino com a autoridade errada.
    //
    // O vídeo é escolhido de propósito entre os que estão FORA do mapa: um caso
    // montado sobre `G020` (teto 7) passaria por folga e o teste ficaria verde
    // sem provar nada — que é o modo de falha nº 4 desta casa, a trava que se
    // testa a si mesma com o alvo apagado.
    nome: 'prescricao nascendo em vídeo de review de programa sem teto declarado',
    esperado: /vindas de G003, que é review-de-programa/,
    montar: () => {
      const c = claimDoArquivo('G003');
      c.modo = 'prescricao';
      return [c];
    },
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
  } else if (caso.montar) {
    // Defeito que só existe entre DUAS claims (ciclo em `conditions`) não cabe
    // numa mutação de registro único.
    r = roda(caso.montar(clone, base));
  } else {
    const c = clone();
    caso.mutar(c);
    r = roda([c]);
  }

  // Caso de AVISO: o checker tem de continuar passando (aviso não é erro) e o
  // texto do aviso tem de estar na saída. Sem as duas metades, um aviso apagado
  // do código passa despercebido — ele some exatamente como um aviso não emitido.
  if (caso.aviso) {
    if (r.passou && caso.esperado.test(r.saida)) {
      console.log(`  ✓ ${caso.nome}`);
    } else {
      console.error(
        `  ✗ ${caso.nome}\n      ${r.passou ? 'o checker passou mas NÃO emitiu o aviso' : 'o checker reprovou — aviso virou erro'}`,
      );
      falhas += 1;
    }
    continue;
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

/**
 * O outro lado, e ele não é decorativo: um checker fica "correto" na hora em que
 * recusa tudo. Estes casos são registros LEGÍTIMOS que ele precisa aceitar, e
 * cada um existe porque a trava já empurrou o dado para fora dela uma vez.
 */
const CASOS_QUE_PASSAM = [
  {
    // Sem `rotulo` e sem extrair os dígitos de dentro de um valor textual, a
    // trava de "número sem procedência" obrigava o agente a declarar
    // `series: 5, reps: 5` para uma frase que não prescreve série nenhuma.
    nome: 'nome de programa com dígito declarado como rotulo',
    mutar: (c) => {
      c.claim = 'O StrongLifts 5x5 é o programa comparado aqui.';
      c.params = [{ name: 'programa', value: '5x5', unit: 'nome', frame: 'rotulo' }];
    },
  },
  {
    nome: 'posição numa sequência declarada como ordinal',
    mutar: (c) => {
      c.claim = 'Na fase 2 os incrementos ficam menores.';
      c.params = [{ name: 'fase', value: 2, unit: 'fase', frame: 'ordinal' }];
    },
  },
  {
    // O outro lado da catraca da `anedota`, e ele decide se a trava é usável.
    // `'anedota'` ainda é valor LEGAL de `MODOS` — tem de ser, porque 243 claims
    // vivem lá até a onda 2 migrá-las. Uma catraca que reprovasse a dívida
    // existente derrubaria o build hoje, e o conserto pelo caminho mais fácil
    // seria afrouxá-la. O teto do Blevins é 47: 47 tem de passar.
    nome: 'anedota existente dentro do teto continua passando',
    montar: () => Array.from({ length: 47 }, (_, i) => {
      const c = clone();
      c.id = `${base.id.split('-')[0]}-${String(i + 1).padStart(2, '0')}`;
      c.modo = 'anedota';
      c.scope = 'PESSOAL';
      return c;
    }),
  },
  {
    // O outro lado da trava do `genero`, e ele é o que impede a leitura
    // preguiçosa "vídeo do Blevins com programa no título = suspeito". `G008` é
    // a régua DELE para julgar programa (stress index): é `aula`, prescrição
    // ali é dele, e reprovar isso seria trava falsa sobre claim legítima — pior
    // do que trava ausente.
    nome: 'prescricao vinda de vídeo de aula, que é o gênero sem restrição',
    montar: () => {
      const c = claimDoArquivo('G008');
      c.modo = 'prescricao';
      return [c];
    },
  },
  {
    // E o gênero restrito NÃO barra o modo certo: um form check cheio de
    // `avaliacao-de-terceiro` é exatamente o que se espera dele.
    nome: 'avaliacao-de-terceiro vinda de vídeo de form check',
    montar: () => {
      const c = claimDoArquivo('G027');
      c.modo = 'avaliacao-de-terceiro';
      return [c];
    },
  },
  {
    nome: 'percentual de XRM com o xrm_base declarado',
    mutar: (c) => {
      c.claim = 'A carga de trabalho fica em 85% do 5RM.';
      c.params = [
        { name: 'intensidade', value: 85, unit: '% do XRM', frame: 'pct_XRM' },
        { name: 'xrm_base', value: 5, unit: 'reps', frame: 'reps' },
      ];
    },
  },
];

for (const caso of CASOS_QUE_PASSAM) {
  let r;
  if (caso.montar) {
    r = roda(caso.montar());
  } else {
    const c = clone();
    caso.mutar(c);
    r = roda([c]);
  }
  if (r.passou) {
    console.log(`  ✓ aceita: ${caso.nome}`);
  } else {
    console.error(
      `  ✗ aceita: ${caso.nome}\n      o checker RECUSOU um registro legítimo\n` +
        `      ${r.saida.split('\n').find((l) => l.includes('✗'))?.trim() ?? '(sem linha de erro)'}`,
    );
    falhas += 1;
  }
}

if (falhas > 0) {
  console.error(`\n${falhas} caso(s) de ${CASOS.length + CASOS_QUE_PASSAM.length} falharam.\n`);
  process.exit(1);
}
const nAviso = CASOS.filter((c) => c.aviso).length;
console.log(
  `\n✓ o compilador RECUSA os ${CASOS.length - nAviso} defeitos que promete recusar, ` +
    `SINALIZA os ${nAviso} que promete sinalizar sem reprovar, ` +
    `e ACEITA os ${CASOS_QUE_PASSAM.length} registros legítimos que a trava já expulsou\n`,
);
