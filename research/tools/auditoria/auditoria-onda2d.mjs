#!/usr/bin/env node
/**
 * AUDITORIA CEGA DA ONDA 2D — mede, nao acredita.
 * Tela = telaDe() do check-canarios.mjs, cortada em tetoDeTela do CANARIOS.json (40).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { responder, perfilarTopicos, termosDaPergunta } from '../roteador.mjs';
import { carregarGlossario, indexarGlossario } from '../glossario.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const EXTRACT = join(ROOT, 'research', 'extract');

const { claims, porId } = carregarClaims(EXTRACT);
const TOPICS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const INDICE = indexar(claims);
const PERFIS = perfilarTopicos(claims);
const TETO = JSON.parse(readFileSync(join(ROOT, 'research', 'kb', 'CANARIOS.json'), 'utf8')).tetoDeTela;

function telaDe(r) {
  const ordem = []; const visto = new Set();
  const push = (c, canal) => { if (visto.has(c.id)) return; visto.add(c.id); ordem.push({ id: c.id, canal }); };
  for (const x of r.claims) push(x.c, 'rota');
  for (const x of r.params.lista) push(x.c, 'param');
  for (const v of r.vizinhos) push(v.c, v.canal ?? 'viz');
  return ordem;
}

export function medir(pergunta, opts = {}) {
  const teto = opts.teto ?? TETO;
  const r = responder(claims, pergunta, {
    topicos: TOPICS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS, teto,
    ...(opts.forcar ? { forcar: opts.forcar } : {}),
  });
  const ordemToda = telaDe(r);
  const tela = ordemToda.slice(0, teto);
  return {
    r,
    rotas: r.rotas.map((x) => x.topico),
    vagas: r.vagas,
    tela,
    telaIds: tela.map((x) => x.id),
    ordemToda,
    tamanhoTela: tela.length,
    naoAbriram: (r.estreitar ?? r.naoAbriram ?? []),
  };
}
export { claims, porId, TOPICS, TETO };

export function medirCru(pergunta, opts = {}) {
  const teto = opts.teto ?? TETO;
  const r = responder(claims, pergunta, {
    topicos: TOPICS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS, teto,
    ...(opts.forcar ? { forcar: opts.forcar } : {}),
    ...(opts.vagas ? { vagas: opts.vagas } : {}),
    ...(opts.canais ? { canais: opts.canais } : {}),
  });
  const ordem = telaDe(r);
  return { r, rotas: r.rotas.map((x) => x.topico), ordemToda: ordem, tela: ordem.slice(0, teto), telaIds: ordem.slice(0, teto).map((x) => x.id) };
}
