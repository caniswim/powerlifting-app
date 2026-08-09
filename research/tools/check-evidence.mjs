#!/usr/bin/env node
/**
 * Resolve ids de claim citados por um agente.
 *
 * Existe porque a avaliação da base tinha o mesmo defeito que a base tinha antes
 * do `check-claims.mjs`: um agente escrevia "sustentado por V014-03, V052-11" e
 * ninguém conferia se aqueles ids existiam. Id inventado é indistinguível de id
 * real numa string, e uma medição que aceita evidência fabricada mede o agente,
 * não a base.
 *
 * Aqui a citação vira consulta: ou o id resolve para uma claim de verdade, e ela
 * é impressa para o julgador ler, ou o id não existe e isso aparece em letras
 * garrafais. O julgador não precisa confiar em quem respondeu.
 *
 * Também aceita `--grep <termo>` para o caminho inverso — descobrir se algo está
 * na base antes de declarar ausente —, porque a distinção entre "ninguém disse"
 * e "está lá e não foi achado" governa consertos opostos e é a mais fácil de
 * errar.
 *
 * Uso:
 *   node research/tools/check-evidence.mjs V014-03 V052-11 …
 *   node research/tools/check-evidence.mjs --grep "training max"
 *   node research/tools/check-evidence.mjs --topic profundidade --modo prescricao
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};

const grepTermo = arg('--grep');
const topico = arg('--topic');
const modo = arg('--modo');
const scope = arg('--scope');
const tier = arg('--tier');
const LIMITE = Number(arg('--limit') ?? 40);

const ids = process.argv
  .slice(2)
  .filter((a) => /^[A-Z]\d{3}-\d+$/.test(a));

if (!existsSync(EXTRACT)) {
  console.error(`✗ ${EXTRACT} não existe`);
  process.exit(2);
}

const claims = [];
for (const f of readdirSync(EXTRACT).filter((x) => x.endsWith('.jsonl')).sort()) {
  const linhas = readFileSync(join(EXTRACT, f), 'utf8').split('\n');
  for (const linha of linhas) {
    if (!linha.trim()) continue;
    try {
      claims.push(JSON.parse(linha));
    } catch {
      /* o check-claims.mjs é quem reclama de JSON quebrado; aqui só não trava */
    }
  }
}
const porId = new Map(claims.map((c) => [c.id, c]));

const mostrar = (c) => {
  const cond = c.conditions?.length ? `  condições: ${c.conditions.join(', ')}` : '';
  const conf = c.conflicts?.length ? `  conflita: ${c.conflicts.join(', ')}` : '';
  const par = (c.params ?? [])
    .map((p) => `${p.name}=${p.value}${p.unit ? ' ' + p.unit : ''} [${p.frame}]`)
    .join('  ');
  return (
    `${c.id}  ${c.src}@${c.at}  tier:${c.tier} scope:${c.scope ?? '—'} modo:${c.modo ?? '—'} ${c.certainty ?? ''}\n` +
    `  tópicos: ${(c.topic ?? []).join(', ')}\n` +
    `  ${c.claim}\n` +
    (par ? `  params: ${par}\n` : '') +
    `  verbatim: "${c.verbatim ?? ''}"\n` +
    (cond ? `${cond}\n` : '') +
    (conf ? `${conf}\n` : '')
  );
};

let saiuRuim = false;

if (ids.length > 0) {
  console.log(`\nResolvendo ${ids.length} id(s) contra ${claims.length} claims:\n`);
  for (const id of ids) {
    const c = porId.get(id);
    if (!c) {
      console.log(`✗ ${id}  NÃO EXISTE — esta citação é fabricada, descarte a evidência\n`);
      saiuRuim = true;
    } else {
      console.log(`✓ ${mostrar(c)}`);
    }
  }
}

const filtrando = grepTermo || topico || modo || scope || tier;
if (filtrando) {
  const rx = grepTermo ? new RegExp(grepTermo, 'i') : null;
  const achados = claims.filter(
    (c) =>
      (!rx || rx.test(c.claim ?? '') || rx.test(c.verbatim ?? '')) &&
      (!topico || (c.topic ?? []).includes(topico)) &&
      (!modo || c.modo === modo) &&
      (!scope || c.scope === scope) &&
      (!tier || c.tier === tier),
  );
  const filtro = [
    grepTermo && `/${grepTermo}/i`,
    topico && `topic=${topico}`,
    modo && `modo=${modo}`,
    scope && `scope=${scope}`,
    tier && `tier=${tier}`,
  ]
    .filter(Boolean)
    .join(' · ');
  console.log(`\n${achados.length} claim(s) para ${filtro}${achados.length > LIMITE ? ` (mostrando ${LIMITE})` : ''}:\n`);
  for (const c of achados.slice(0, LIMITE)) console.log(mostrar(c));
  // Zero resultado NÃO é prova de ausência — é prova de que este vocabulário não
  // acha. Quem lê isto tende a concluir a coisa errada, então o aviso vem junto.
  if (achados.length === 0) {
    console.log('  (zero resultados diz que ESTE termo não acha, não que o assunto está ausente —');
    console.log('   tente inglês, gíria, e o termo do canal antes de declarar lacuna de conteúdo)\n');
  }
}

if (ids.length === 0 && !filtrando) {
  console.error('nada a fazer: passe ids (V014-03) ou um filtro (--grep/--topic/--modo/--scope/--tier)');
  process.exit(2);
}

process.exit(saiuRuim ? 1 : 0);
