#!/usr/bin/env node
/**
 * A TRAVA DA TRAVA — `check-glossario.mjs` conferido contra glossários sintéticos.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE ARQUIVO EXISTE
 *
 * O `check-glossario.mjs` roda contra o artefato de verdade e ele passa. Isso
 * prova que o artefato está bom; não prova NADA sobre o checador. Um checador
 * cujos números foram afrouxados até não recusar mais nada continua imprimindo
 * ✓ contra o artefato bom — e é assim que uma trava morre sem ninguém notar.
 *
 * O ataque de mutação de 12/08/2026 mediu isso na casa inteira: **5 de 56
 * mutações de constante sobreviviam ao gate, e as CINCO afrouxavam** —
 * `MIN_TERMOS 10→0`, `DETALHE_ROTEADO 8→80`, `DIFERENCA_MAXIMA_GLOSSARIO 5→50`,
 * `PESO_NOME_COMPOSTO 1,2→12`, `TETO_PARAM 12→120`. O padrão É o diagnóstico:
 * os testes cobriam só o lado que APERTA. Uma constante que só pode subir não é
 * um limite, é uma decoração com nome de limite.
 *
 * Aqui os quatro números do `check-glossario.mjs` são cobrados **nos dois
 * sentidos**, e o segundo sentido é o que quase nunca é escrito:
 *
 *   · AFROUXAR — uma lista curta, uma de lixo e uma de enchimento têm de ser
 *     REPROVADAS. Zerar `MIN_TERMOS`, `FRACAO_MINIMA_ANCORADA` ou subir
 *     `TETO_GENERICO` faz um destes casos ficar verde, e o teste morre.
 *   · APERTAR — uma lista de SLANG PURO, sem nenhuma palavra no corpus, tem de
 *     ser APROVADA. Esse caso existe porque o modo de falha nº 2 desta casa é a
 *     trava estreita empurrando o dado para fora dela, e aqui ele tem endereço:
 *     `fisgada` não aparece em nenhuma das 6.912 claims e é o termo mais
 *     importante do artefato. Um futuro agente que "reforce" a âncora para 100 %
 *     estaria destruindo exatamente a ponte que a camada existe para construir,
 *     e agora isso fica vermelho na hora.
 *
 * O checador é rodado como SUBPROCESSO, contra fixtures em disco, e não
 * importado. Importar deixaria o teste avaliar o módulo com estado próprio; o
 * subprocesso mede o que o gate mede.
 *
 * Uso:  node research/tools/check-glossario.test.mjs
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../..');
const CHECADOR = join(AQUI, 'check-glossario.mjs');

let falhas = 0;
let casos = 0;
const ok = (cond, nome, detalhe = '') => {
  casos += 1;
  if (cond) {
    console.log(`  ✓ ${nome}`);
    return;
  }
  falhas += 1;
  console.log(`  ✗ ${nome}`);
  if (detalhe) console.log(`      ${detalhe.split('\n').slice(0, 6).join('\n      ')}`);
};

/**
 * ── O FIXTURE PARTE DO ARTEFATO REAL, E ISSO É DE PROPÓSITO ──────────────────
 *
 * As travas 1 e 2 do checador exigem os 74 nomes fechados, cada um com glosa. Um
 * glossário sintético de dois tópicos seria reprovado pelas 72 gavetas que
 * faltam, e todo caso deste arquivo passaria pelo motivo errado — verde, ou
 * vermelho, por acidente. Partir do artefato real e trocar SÓ a gaveta em teste
 * é o que isola a regra que está sendo medida.
 *
 * A base contra a qual tudo é conferido é o `research/extract` de verdade: as
 * regras de âncora e de enchimento são afirmações sobre ELA, e medi-las contra
 * uma base de mentira mediria a base de mentira.
 */
function glossarioCom(topico, entrada) {
  const doc = JSON.parse(readFileSync(join(ROOT, 'research/kb/GLOSSARIO-TOPICOS.json'), 'utf8'));
  for (const t of doc.topicos) if (t.topico === topico) t.entrada = entrada;
  // A `entrada` trocada pode desfazer colisões que as regras de desempate
  // declaram. Regra órfã é erro legítimo do checador e contaminaria o caso, então
  // o desempate é recalculado para o conjunto que sobrou.
  const dono = new Map();
  for (const t of doc.topicos) {
    for (const e of t.entrada) {
      const k = e.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
      if (!dono.has(k)) dono.set(k, new Set());
      dono.get(k).add(t.topico);
    }
  }
  doc.desempate = (doc.desempate ?? []).filter((r) => (dono.get(r.termo)?.size ?? 0) > 1
    && [...dono.get(r.termo)].sort().join(',') === [...r.topicos].sort().join(','));
  return doc;
}

const tmp = mkdtempSync(join(tmpdir(), 'check-glossario-test-'));
const EXTRACT_REAL = join(ROOT, 'research/extract');

/** Roda o checador contra um glossário em disco. Devolve verde/vermelho e o que
 *  ele disse — o teste confere a MENSAGEM, não só o código de saída, para não
 *  passar por acidente quando outra trava do arquivo reprovar o caso. */
function rodar(doc, extract = EXTRACT_REAL) {
  const arquivo = join(tmp, `g-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(arquivo, `${JSON.stringify(doc, null, 2)}\n`);
  try {
    const saida = execFileSync('node', [CHECADOR, '--arquivo', arquivo, '--extract', extract], { encoding: 'utf8', stdio: 'pipe' });
    return { verde: true, saida };
  } catch (e) {
    return { verde: false, saida: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

console.log('\ncheck-glossario.test.mjs — a trava conferida contra glossário sintético\n');

// ── o artefato de verdade continua passando ─────────────────────────────────
{
  const doc = glossarioCom('__nenhum__', []);
  const r = rodar(doc);
  ok(r.verde, 'o artefato real, intocado, passa (senão todo caso abaixo é ruído)', r.saida);
}

// ── AFROUXAR: os três casos que a trava tem de recusar ──────────────────────
console.log('\n  o lado que AFROUXA — o que a trava tem de recusar:');
{
  const r = rodar(glossarioCom('sono', ['zzqa', 'zzqb', 'zzqc', 'zzqd', 'zzqe', 'zzqf', 'zzqg', 'zzqh', 'zzqi', 'zzqj']));
  ok(!r.verde && /parentesco/.test(r.saida),
    'lista de LIXO é reprovada pela âncora — mata FRACAO_MINIMA_ANCORADA → 0', r.saida);
}
{
  // Nove termos legítimos: só o mínimo de tamanho pode reprovar isto.
  const nove = ['dormir', 'sono ruim', 'insonia', 'acordar cansado', 'cochilo', 'nao durmo', 'noite mal dormida', 'cafeina a noite', 'hora de dormir'];
  const r = rodar(glossarioCom('sono', nove));
  ok(!r.verde && /mínimo 10/.test(r.saida),
    'lista de 9 termos é reprovada pelo mínimo — mata MIN_TERMOS → 0', r.saida);
}
{
  // Stopword INGLESA colhida do verbatim: era isto que deixava 70 de 74 verdes.
  const ingles = ['your', 'that', 'some', 'more', 'with', 'just', 'like', 'this', 'going', 'stuff'];
  const r = rodar(glossarioCom('sono', ingles));
  ok(!r.verde && /parentesco/.test(r.saida),
    'stopword INGLESA do verbatim é reprovada — mata a âncora voltar a ler `verbatim`', r.saida);
}
{
  // Enchimento pt-BR: palavras que a base inteira usa. Ancoram, e não são ponte.
  const ench = ['tempo', 'treino', 'series', 'fazer', 'entre', 'ficar', 'coisa', 'gente', 'muito', 'quando'];
  const r = rodar(glossarioCom('descanso-entre-series', ench));
  ok(!r.verde && /ENCHIMENTO/.test(r.saida),
    'enchimento pt-BR é reprovado — mata TETO_GENERICO → 1 e LIMIAR_GENERICO → 74', r.saida);
}

// ── APERTAR: o caso que a trava NÃO pode recusar ────────────────────────────
console.log('\n  o lado que APERTA — o que a trava não pode recusar:');
{
  /**
   * A MAIORIA SLANG, e é o caso mais importante deste arquivo.
   *
   * Vinte termos: oito com parentesco na prosa de `sono`, doze que não existem
   * em claim nenhuma — é o caso `fisgada`, multiplicado por doze. Ancora 40 %,
   * cinco pontos acima do piso, e TEM de passar.
   *
   * Quem quebrar este caso apertou a âncora até ela cobrar do vocabulário
   * justamente o que ele existe para NÃO ser: `fisgada` não aparece em nenhuma
   * das 6.912 claims e é o termo mais importante do artefato; a gaveta real mais
   * frouxa, `dor`, é 49 % de termos sem âncora nenhuma. O conserto de um vermelho
   * aqui não é acolchoar a lista com jargão da base — é desfazer o aperto.
   *
   * O LIMITE DECLARADO, para ninguém confiar demais: uma gaveta 100 % slang é
   * reprovada, e isso é uma escolha, não um descuido. A âncora é o que separa
   * vocabulário de LIXO, e não há como distinguir doze gírias reais de doze
   * strings inventadas sem sair do determinismo. O preço é este: uma gaveta pode
   * ser maioria slang, não totalidade. Se algum dia uma gaveta legítima for
   * slang puro, o conserto é baixar FRACAO_MINIMA_ANCORADA com o motivo escrito
   * ao lado — e este caso é o que obriga a conversa a acontecer.
   */
  const ancorados = [
    'dormir', 'dormir mal', 'dormir pouco', 'sono ruim',
    'nao consigo dormir', 'poucas horas de sono', 'quantas horas dormir', 'higiene do sono',
  ];
  const slang = [
    'deu uma fisgada', 'travou tudo', 'ferrou o negocio', 'destruiu geral',
    'apagou de vez', 'zerou o gas', 'baque feio', 'esculachou legal',
    'perdi a linha', 'foi pro saco', 'lascou bonito', 'deu tilt total',
  ];
  const r = rodar(glossarioCom('sono', [...ancorados, ...slang]));
  ok(r.verde, 'gaveta com 60 % de slang SEM ÂNCORA NENHUMA continua passando — mata FRACAO_MINIMA_ANCORADA subir', r.saida);
}
{
  // E a gaveta real mais frouxa das 74 tem de continuar cabendo com folga.
  const r = rodar(glossarioCom('__nenhum__', []));
  const m = r.saida.match(/a mais frouxa é "(\S+)" com \d+\/\d+ \((\d+) %\)/);
  ok(m && Number(m[2]) >= 45,
    `a gaveta real mais frouxa fica com folga sobre o piso de 35 % (${m ? `${m[1]} em ${m[2]} %` : 'não medido'})`, r.saida);
  const g = r.saida.match(/a mais carregada é "(\S+)" com \d+\/\d+ \((\d+) %\)/);
  ok(g && Number(g[2]) <= 15,
    `a gaveta real com mais enchimento fica com folga sob o teto de 25 % (${g ? `${g[1]} em ${g[2]} %` : 'não medido'})`, r.saida);
}

// ── as travas de FORMA, que já existiam e agora têm caso ────────────────────
console.log('\n  as travas de forma:');
{
  const doc = glossarioCom('__nenhum__', []);
  doc.topicos.push({ topico: 'gaveta-inventada', glosa: 'x', entrada: ['aaaa'], naoConfundirCom: [] });
  const r = rodar(doc);
  ok(!r.verde && /FORA do vocabulário fechado/.test(r.saida), 'tópico fora dos 74 é reprovado', r.saida);
}
{
  const doc = glossarioCom('__nenhum__', []);
  for (const t of doc.topicos) if (t.topico === 'sono') t.glosa = '  ';
  const r = rodar(doc);
  ok(!r.verde && /não tem glosa/.test(r.saida), 'gaveta sem glosa é reprovada', r.saida);
}
{
  // O bug do `peso`: dois tópicos reivindicam o mesmo termo e ninguém desempata.
  const doc = glossarioCom('__nenhum__', []);
  const dormir = doc.topicos.find((t) => t.topico === 'sono').entrada[0];
  doc.topicos.find((t) => t.topico === 'fadiga').entrada.push(dormir);
  const r = rodar(doc);
  ok(!r.verde && /AMBIGUIDADE SILENCIOSA/.test(r.saida), 'colisão sem regra de desempate é reprovada', r.saida);
}

rmSync(tmp, { recursive: true, force: true });

console.log('');
if (falhas > 0) {
  console.error(`✗ ${falhas} de ${casos} casos falharam em check-glossario.test.mjs`);
  process.exit(1);
}
console.log(`✓ ${casos} casos verdes em check-glossario.test.mjs — a trava recusa lixo, curto e enchimento, e NÃO recusa slang`);
process.exit(0);
