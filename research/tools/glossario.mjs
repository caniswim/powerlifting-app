/**
 * O VOCABULÁRIO DE ENTRADA — a ponte entre a pergunta do atleta e o nome da
 * gaveta, e a razão de o roteamento ter deixado de ser casamento léxico.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O DEFEITO QUE ESTE ARQUIVO EXISTE PARA IMPEDIR
 *
 * O roteador de 10/08/2026 tirava o sinal do CORPUS: para cada tópico, que
 * raízes aparecem muito nele e pouco fora. É uma boa medida de "como esta gaveta
 * fala" e é a medida errada para "o que este atleta digitou", e os dois casos que
 * fecharam o diagnóstico daquele dia mostram por quê:
 *
 *   · `fisgada de 3/10 no peitoral na terceira série de supino pausado,
 *     continuo?` roteava para `peito` e `supino`, devolvia 40 claims e NENHUMA
 *     das cinco que carregam o limiar de dor. `dor` e `lesao` nunca abriam
 *     porque a palavra `fisgada` **não existe em claim nenhuma** — a ferramenta
 *     até avisava isso e roteava errado assim mesmo. Um sinal derivado do corpus
 *     é cego para a palavra que o corpus não tem, e a palavra que o corpus não
 *     tem é justamente a que o atleta usa quando está com medo.
 *   · `levantar peso já conta como exercício pro coração` roteava para
 *     `peso-corporal` com 0,73 porque `peso` aparece em 141 das 238 claims
 *     daquela gaveta. `cardio` — 230 claims que respondem exatamente isso —
 *     nunca abria. O corpus não tem como saber que o `peso` de *levantar peso* é
 *     outro peso.
 *
 * Aqui o sinal vem de `research/kb/GLOSSARIO-TOPICOS.json`: 74 gavetas, cada uma
 * com uma glosa e 20–40 termos **na voz do atleta**, escritos por oito agentes
 * que leram as gavetas. `fisgada` está lá porque é o que se digita, não porque
 * alguém a encontrou no corpus.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A RARIDADE MUDOU DE ESPAÇO, E É AQUI QUE O BUG DO `peso` MORRE
 *
 * O roteador antigo pesava um termo por raridade no CORPUS. Este pesa por
 * raridade **no glossário**: em quantas das 74 gavetas aquela palavra aparece.
 * São dois números completamente diferentes e o segundo é o que a pergunta pede:
 *
 *     coracao   → 3 gavetas de 74   → idf 0,745
 *     fisgada   → 3 gavetas          → idf 0,745
 *     peso      → 15 gavetas         → idf 0,371
 *     treino    → 38 gavetas         → idf 0,155
 *
 * `peso` continua valendo alguma coisa — zerá-lo seria a trava estreita do modo
 * de falha nº 2 — mas deixou de decidir sozinho para onde a pergunta vai. Uma
 * palavra que 15 dos 74 tópicos reivindicam não é evidência de nenhum deles, e
 * `treino`, que 38 reivindicam, é quase ruído puro.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OS DOIS CANAIS, E POR QUE A FRASE VALE MAIS QUE A PALAVRA
 *
 * `categoria de peso` casado INTEIRO é `peso-corporal` sem ambiguidade nenhuma;
 * `peso` sozinho não é nada. Por isso a frase (termo de duas ou mais palavras
 * casado por completo na pergunta) tem peso próprio e não passa pelo idf: quem
 * escreveu a frase inteira já desambiguou. A palavra solta paga o idf, e paga
 * também por ONDE ela mora: uma palavra que é um termo inteiro do tópico
 * (`cardio` em `cardio`) vale mais que uma palavra que só aparece dentro de uma
 * frase maior (`peso` dentro de `categoria de peso`).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O DESEMPATE É DADO, E ELE MANDA
 *
 * 114 termos são reivindicados por mais de um tópico. Cada um tem uma regra
 * declarada no artefato, com `vence` e `porque`, e a regra é aplicada AQUI, na
 * montagem do índice: um tópico que perde um termo não recebe nem o termo nem as
 * palavras dele. É o que torna a regra load-bearing — trocar um `vence` muda o
 * roteamento, e é assim que se prova que ela não é decoração.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizar, palavras, raiz, sequencia } from './busca.mjs';

/**
 * O peso de um termo de DUAS OU MAIS palavras casado inteiro na pergunta.
 *
 * Não paga idf de propósito: `categoria de peso` só é reivindicado por
 * `peso-corporal`, e mesmo quando a frase colide (`faixa de punho` é de
 * `equipamento` e de `faixa`) quem digitou a frase inteira já disse de que
 * assunto está falando. É o canal mais preciso dos dois e o mais raro de casar.
 */
export const PESO_FRASE = 1.0;

/**
 * O peso de um termo de duas ou mais palavras cujas palavras TODAS aparecem na
 * pergunta, mas separadas.
 *
 * Medido, e é o canário P11 que o exige: *de quantas em quantas semanas eu
 * preciso pegar leve* tem as duas palavras de `semana leve` — o termo de entrada
 * de `deload` — e não tem a frase. Com só o casamento contíguo, `deload` ficava
 * em 0,50 (dois pedaços soltos de frase), a pergunta não mapeava para tópico
 * nenhum e o candidato mais alto era `aprendizado-motor`, por causa de *pegar*.
 *
 * 0,7 e não 1,0 porque a ordem é informação: quem escreveu *semana leve* junto
 * disse mais do que quem espalhou as duas palavras por uma frase de onze. E não
 * 0,5 porque as duas palavras juntas, em qualquer ordem, já são o termo — é o
 * mesmo raciocínio do bônus de frase da `buscarRelaxada`.
 */
export const PESO_FRASE_ESPARSA = 0.7;


/**
 * ── O CASAMENTO ESPALHADO VALE PARA O TERMO DE EXATAMENTE DUAS PALAVRAS ─────
 *
 * Duas medições, uma de cada lado, e é por isso que este número é uma igualdade
 * e não uma faixa:
 *
 * · **Menos que duas** é o `peso` voltando pela porta dos fundos, e ele voltou
 *   de verdade antes deste número existir. `quanto eu peso` e `fazer o peso`
 *   são termos de três palavras de `peso-corporal` cujo conteúdo, depois de
 *   tirar interrogativa e palavra vazia, é UMA palavra: `peso`. Aceitando uma,
 *   cada um casava "espalhado" por 0,70 e a pergunta do coração devolvia
 *   `peso-corporal` em 3º com 0,98 — o lixo plausível de 10/08 com um canal novo
 *   debaixo. Espalhado só faz sentido quando há duas coisas espalhadas.
 * · **Mais que duas** foi medido e não sobreviveu à conta: com o teto em 9, o
 *   placar da porta nova caiu de 9 para 6 canários com algum id e `cardio` saiu
 *   de 2º para 5º no P16. Termo de cinco palavras espalhado por uma pergunta de
 *   doze é coincidência com aparência de frase.
 */
export const PALAVRAS_ESPARSA = 2;

/**
 * E as palavras espalhadas precisam estar PERTO uma da outra na pergunta.
 *
 * Medido, e é a segunda correção do mesmo canal: só o teto de duas palavras não
 * bastou. `semana` e `leve` estão a quatro palavras de distância em *de quantas
 * em quantas semanas eu preciso pegar leve* e são o termo `semana leve`;
 * `exercício` e `peso` a seis palavras de distância numa pergunta sobre cardio
 * não são termo nenhum, e sem a janela o placar da porta nova caía de 9 para 6
 * canários com algum id, com `peso-corporal` voltando à tela do P16.
 *
 * Cinco é a distância que atravessa a conjugação e o artigo (`semanas eu preciso
 * pegar leve`) e não atravessa uma oração inteira.
 */
export const JANELA_ESPARSA = 5;

/**
 * O peso de uma palavra da pergunta que é, sozinha, um termo de entrada do
 * tópico (`cardio`, `fisgada`, `deload`). Multiplicado pelo idf do glossário.
 */
export const PESO_TERMO_UNICO = 1.0;

/**
 * O peso de uma palavra da pergunta que só aparece DENTRO de um termo maior
 * (`peso` dentro de `categoria de peso`). Metade, e não zero: `coração` só
 * existe dentro de `saúde do coração` em `saude`, e zerar este canal fecharia a
 * gaveta certa para a pergunta que o diagnóstico de 10/08 escolheu como pior
 * caso. Metade porque quem escreveu a frase escreveu a frase — a palavra solta é
 * um pedaço dela, não o termo.
 */
export const PESO_PALAVRA_EM_FRASE = 0.5;

/** Quantas letras iniciais em comum fazem duas palavras serem a mesma dentro do
 *  glossário. Mesma regra e mesmos números do roteador — `peitorais` casa
 *  `peitoral`, `supinar` casa `supino`, e `power` não casa `powerlifting`. */
export const PREFIXO_GLOSSARIO = 5;
export const FRACAO_DA_PALAVRA_GLOSSARIO = 0.6;
export const DIFERENCA_MAXIMA_GLOSSARIO = 5;

/** A forma canônica de um termo. Tem de ser a MESMA do `build-glossario.mjs`, e
 *  é por isso que ela é uma linha só e mora aqui, importada pelos dois. */
export const chaveDoTermo = (t) => normalizar(t).trim().replace(/\s+/g, ' ');

export function carregarGlossario(root) {
  return JSON.parse(readFileSync(join(root, 'research/kb/GLOSSARIO-TOPICOS.json'), 'utf8'));
}

/**
 * O ÍNDICE DO GLOSSÁRIO.
 *
 * `termosDe` é o tokenizador da PERGUNTA, passado de fora de propósito: os
 * termos do glossário e as palavras da pergunta têm de ser quebrados pela mesma
 * função, ou o índice fica cheio de chaves que nenhuma pergunta consegue
 * produzir. Duas cópias do mesmo tokenizador divergiriam em silêncio, que é o
 * modo de falha nº 3 desta casa.
 */
export function indexarGlossario(doc, termosDe) {
  const vence = new Map();
  for (const d of doc.desempate ?? []) vence.set(d.termo, new Set(d.vence));

  const glosa = new Map();
  const frases = new Map();
  const porPalavra = new Map();
  const tamanhoDaEntrada = new Map();
  const confusao = new Map();

  for (const t of doc.topicos ?? []) {
    glosa.set(t.topico, t.glosa);
    frases.set(t.topico, []);
    tamanhoDaEntrada.set(t.topico, (t.entrada ?? []).length);
    confusao.set(t.topico, (t.naoConfundirCom ?? []).map((n) => n.topico));
    for (const bruto of t.entrada ?? []) {
      const chave = chaveDoTermo(bruto);
      const quem = vence.get(chave);
      // O DESEMPATE MANDA: tópico que perdeu o termo não recebe nem o termo nem
      // as palavras dele. É aqui que a regra declarada vira comportamento.
      if (quem && !quem.has(t.topico)) continue;
      const ws = [...termosDe(chave)];
      const nPalavras = palavras(chave).length;
      if (nPalavras > 1 && ws.length > 0) {
        frases.get(t.topico).push({ texto: bruto, chave, seq: sequencia(chave), palavras: new Set(ws) });
      }
      for (const w of ws) {
        if (!porPalavra.has(w)) porPalavra.set(w, new Map());
        const alvo = porPalavra.get(w);
        const antes = alvo.get(t.topico);
        const unico = nPalavras === 1;
        if (!antes) alvo.set(t.topico, { unico, via: bruto });
        else if (unico && !antes.unico) alvo.set(t.topico, { unico: true, via: bruto });
      }
    }
  }

  const porPrefixo = new Map();
  for (const w of porPalavra.keys()) {
    if (w.length < PREFIXO_GLOSSARIO) continue;
    const k = w.slice(0, PREFIXO_GLOSSARIO);
    if (!porPrefixo.has(k)) porPrefixo.set(k, []);
    porPrefixo.get(k).push(w);
  }

  const nTopicos = (doc.topicos ?? []).length;
  return { glosa, frases, porPalavra, porPrefixo, nTopicos, vence, tamanhoDaEntrada, confusao };
}

/** Quantas gavetas de 74 reivindicam esta palavra. É o denominador do idf, e é o
 *  número que separa `coracao` (3) de `peso` (28). */
export const gavetasDaPalavra = (idxG, w) => (idxG.porPalavra.get(w)?.size ?? 0);

/**
 * O idf do GLOSSÁRIO, normalizado para (0, 1]: palavra de uma gaveta só vale 1,
 * palavra de todas as 74 vale 0.
 */
export function idfDoGlossario(idxG, w) {
  const df = gavetasDaPalavra(idxG, w);
  if (df <= 0) return 0;
  return Math.log(idxG.nTopicos / df) / Math.log(idxG.nTopicos);
}

/**
 * A família de prefixo DENTRO do glossário — sem tocar o corpus, porque o corpus
 * não sabe o que é `fisgada`. Mesmas três condições do roteador: cinco letras
 * iniciais, 60 % da palavra mais curta, no máximo cinco letras de diferença.
 * `supinando` acha `supino`, `agachando` acha `agacho`, e `power` não acha
 * `powerlifting`.
 *
 * ── O CURTO-CIRCUITO DA PALAVRA EXATA, e ele é load-bearing ─────────────────
 *
 * Se a palavra da pergunta JÁ é uma palavra do glossário, ela fica sozinha e não
 * arrasta o balde de prefixo. Medido, e não é micro-otimização: `descanso` e
 * `descarga` compartilham `desca`, têm o mesmo tamanho e passam nas três
 * condições. Sem o curto-circuito, *quanto descansar entre as séries* passa a
 * pontuar `deload` (dono de `semana de descarga`) e dois canários do ROTAS.json
 * ficam vermelhos. A família existe para atravessar a conjugação de uma palavra
 * que o glossário NÃO tem; quando ele tem a palavra, não há o que atravessar.
 */
export function familiaNoGlossario(idxG, termo) {
  if (idxG.porPalavra.has(termo)) return [termo];
  if (termo.length < PREFIXO_GLOSSARIO) return [];
  const balde = idxG.porPrefixo.get(termo.slice(0, PREFIXO_GLOSSARIO)) ?? [];
  return balde.filter((cand) => {
    if (Math.abs(cand.length - termo.length) > DIFERENCA_MAXIMA_GLOSSARIO) return false;
    let i = 0;
    while (i < cand.length && i < termo.length && cand[i] === termo[i]) i += 1;
    return i >= FRACAO_DA_PALAVRA_GLOSSARIO * Math.min(cand.length, termo.length);
  });
}

/**
 * PERGUNTA → {tópico → peso}, pelo glossário e por mais nada.
 *
 * Devolve, para cada tópico que casou alguma coisa, o peso somado e a lista do
 * QUE casou — que sai impressa na tela. "Casou por glossário" sem dizer com que
 * termo é a mesma expansão opaca que destruiu a precisão em 09/08.
 *
 * `W` são as raízes da pergunta, produzidas pelo mesmo tokenizador que montou o
 * índice.
 */
export function casarGlossario(idxG, pergunta, W) {
  const seqQ = ` ${sequencia(pergunta)} `;
  const porTopico = new Map();
  const anota = (topico, peso, linha, cobre = []) => {
    if (!porTopico.has(topico)) porTopico.set(topico, { peso: 0, porQue: [], cobriu: new Set() });
    const a = porTopico.get(topico);
    a.peso += peso;
    a.porQue.push(linha);
    for (const w of cobre) a.cobriu.add(w);
  };

  // De cada palavra da PERGUNTA para as palavras do glossário que ela alcança —
  // calculado uma vez, e não 74 vezes. É o mapa que decide se uma frase casou
  // espalhada e é o que diz, no fim, quantas palavras da pergunta o tópico
  // explicou.
  const alcance = new Map();
  const alcancadas = new Set();
  for (const w of W) {
    const fam = familiaNoGlossario(idxG, w).filter((c) => idxG.porPalavra.has(c));
    alcance.set(w, fam);
    for (const c of fam) alcancadas.add(c);
  }

  // Onde cada palavra do glossário aparece na pergunta, em posição de palavra.
  // É o que a janela do casamento espalhado consulta.
  const posicoes = new Map();
  const tokens = sequencia(pergunta).split(' ');
  tokens.forEach((tk, i) => {
    for (const c of alcance.get(tk) ?? []) {
      if (!posicoes.has(c)) posicoes.set(c, []);
      posicoes.get(c).push(i);
    }
  });
  /** Existe uma janela de `JANELA_ESPARSA` palavras da pergunta que contém uma
   *  ocorrência de CADA palavra do termo? */
  const cabeNaJanela = (ws) => {
    const listas = [...ws].map((w) => posicoes.get(w) ?? []);
    if (listas.some((l) => l.length === 0)) return false;
    const todas = [...new Set(listas.flat())].sort((a, b) => a - b);
    return todas.some((ini) => listas.every((l) => l.some((p) => p >= ini && p - ini <= JANELA_ESPARSA)));
  };

  for (const [topico, lista] of idxG.frases) {
    const cobertas = new Set();
    for (const f of lista) {
      const contigua = seqQ.includes(` ${f.seq} `);
      const espalhada = !contigua
        && f.palavras.size === PALAVRAS_ESPARSA
        && [...f.palavras].every((w) => alcancadas.has(w))
        && cabeNaJanela(f.palavras);
      if (!contigua && !espalhada) continue;
      const peso = contigua ? PESO_FRASE : PESO_FRASE_ESPARSA;
      const daPergunta = [...W].filter((w) => (alcance.get(w) ?? []).some((c) => f.palavras.has(c)));
      anota(topico, peso, {
        termo: f.texto,
        peso,
        canal: contigua ? 'glossário (frase inteira)' : 'glossário (frase espalhada)',
        gavetas: idxG.vence.has(f.chave) ? idxG.vence.get(f.chave).size : 1,
      }, daPergunta);
      for (const w of f.palavras) cobertas.add(w);
    }
    if (porTopico.has(topico)) porTopico.get(topico).cobertas = cobertas;
  }

  for (const w of W) {
    for (const cand of familiaNoGlossario(idxG, w)) {
      const donos = idxG.porPalavra.get(cand);
      if (!donos) continue;
      const idf = idfDoGlossario(idxG, cand);
      for (const [topico, info] of donos) {
        // Palavra já contada por uma FRASE deste tópico não conta de novo: a
        // frase é a evidência forte e a palavra é um pedaço dela.
        if (porTopico.get(topico)?.cobertas?.has(cand)) continue;
        const base = info.unico ? PESO_TERMO_UNICO : PESO_PALAVRA_EM_FRASE;
        const peso = base * idf;
        if (peso <= 0) continue;
        const ja = porTopico.get(topico)?.porQue?.find((x) => x.palavraDaPergunta === w);
        if (ja) {
          if (peso > ja.peso) {
            porTopico.get(topico).peso += peso - ja.peso;
            Object.assign(ja, { peso, termo: info.via, gavetas: donos.size, comoNoGlossario: cand });
          }
          continue;
        }
        anota(topico, peso, {
          palavraDaPergunta: w,
          comoNoGlossario: cand,
          termo: info.via,
          peso,
          gavetas: donos.size,
          canal: info.unico ? 'glossário (termo)' : 'glossário (dentro de frase)',
        }, [w]);
      }
    }
  }

  for (const a of porTopico.values()) delete a.cobertas;
  return porTopico;
}

/**
 * A PORTA A, em dado: as 74 gavetas com glosa e tamanho. Quem consome esta base
 * em produção é um modelo — ele não precisa de heurística, precisa ver a lista e
 * escolher. `n` é o tamanho da gaveta na base de verdade, contado agora.
 */
export function catalogoDeTopicos(doc, claims) {
  const n = new Map();
  for (const c of claims) for (const t of new Set(c.topic ?? [])) n.set(t, (n.get(t) ?? 0) + 1);
  return (doc.topicos ?? []).map((t) => ({
    topico: t.topico,
    glosa: t.glosa,
    claims: n.get(t.topico) ?? 0,
    naoConfundirCom: (t.naoConfundirCom ?? []).map((x) => x.topico),
  }));
}
