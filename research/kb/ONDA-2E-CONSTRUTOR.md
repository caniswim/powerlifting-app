# Relato do construtor da onda 2E — seções por gaveta

> Extraído do journal do workflow `wf_26412ad5-ace` na pausa de 10/08/2026.
> O código está no repositório; este é o raciocínio, que não estava em lugar nenhum.

A tela plana virou uma seção por gaveta. `npm run check:kb`, `npm run check:gate` e `npm run build` verdes.

## O que mudou

**Arquivos**: `research/tools/roteador.mjs` (bloco "A TELA: UMA SEÇÃO POR GAVETA" + `responder()` reescrito), `research/tools/check-evidence.mjs` (impressão por seção), `research/tools/secoes.test.mjs` (novo, no `check:kb`), `research/tools/medir-secoes.mjs` (novo), `research/tools/check-canarios.mjs`, `research/tools/check-rotas.mjs`, `research/tools/check-canarios.test.mjs`, `research/tools/roteador.test.mjs`, `research/tools/mutacao-entrada.mjs`, `research/kb/CANARIOS.json`, `research/kb/ROTAS.json`, `research/kb/RECUPERACAO.md` (veredito novo + PARTE VIII §27), `package.json`. Removidos: `alocacao.test.mjs`, `medir-alocacao.mjs`, `medir-vagas.mjs`, `auditoria/{piso,tres-saidas,duas-telas}.mjs`.

## O número

```
                              algum id       todos os ids
D01-D12 (era cego 12/08)      2 → 5 de 12    0 → 0 de 12
B01-B12 (era cego 12/08)      2 → 3 de 12    0 → 1 de 12
P01-P18 (público)             7 → 11 de 18   2 → 6 de 18
OS 42 JUNTOS                 11 → 19         2 → 7
```

## A invariante vale, por construção

`montarSecaoDeGaveta(claims, porId, rota, filas, …)` **não recebe as outras gavetas** — sem `vistos` compartilhado, sem cota global, sem dedup entre seções. `secoes.test.mjs` cobra sobre **107 perguntas reais e 1.644 comparações de seção**: zero violações. Também desacoplei `rotear()` do orçamento (`max` = `MAX_TOPICOS`, nunca `tela.secoes`), senão o teste compararia dois roteamentos.

## Dois achados que contradizem o briefing

1. **O caso canônico do diagnóstico não existe.** `--topic` lê UM valor; `sumo` e `terra` são descartados em silêncio. `--pergunta "<D05>" --topic convencional` e `--pergunta "<D05>" --topic convencional sumo terra` são o **mesmo comando** e devolvem as mesmas 3 claims. A "prova" de que abrir a gaveta certa mais uma vizinha é pior nunca existiu. O soma-zero era real (`pernas 8 · convencional 9 · sumo 3`), a demonstração não.
2. **A diluição maior era DENTRO da gaveta.** `conjuntoDoTopico` injeta até 60 claims afins vindas das gavetas grandes na mesma fila das declaradas. Em D06, F001-11 é a **34ª declarada** de `comandos-ipf` e some fora das 40. Era essa a diferença entre `--topic <gaveta certa>` (sem afins) e a mesma gaveta roteada. A seção agora tem bloco de declaradas e bloco de afins.
3. `PISO_VAGAS` já não era testado por `magra >= 3` — a asserção tinha sido removida em 12/08 e substituída por um comentário. Morreu junto com `alocarVagas`.

## Fisgada

As CINCO chegam sem `--topic`, **juntas na seção `dor`**: V079-34 #5, V001-06 #9 (corpo), V027-23 #28, V086-21 #30, V138-19 #31 (ledger da mesma seção, com `← condição de V079-34`). Paráfrase sem jargão: **5 de 5** (era 3), com V079-34 em 1º de `dor`.

## Falha aberta, registrada em vez de escondida

D05 entrega **1 de 3** sem `--topic`, e a seção de `convencional` é bit a bit a mesma com 1 ou 5 gavetas — **a invariante vale e não basta**. Os ids estão em 17º/25º/27º na ordenação da própria gaveta. `secoes.test.mjs` cobra o `1 de 3` como falha aberta. O próximo alvo é `ordenarNoTopico`.

## Uma definição de tela

Havia quatro cópias de `telaDe()` mais a conta implícita da CLI. Agora `telaDaResposta()` em `roteador.mjs`: a CLI imprime exatamente ela, toda trava conta exatamente ela, e o teste roda a CLI como processo e exige que todo id de `r.tela` apareça na saída. Os *números* seguem vindo do canário: `tela: { porSecao, secoes, porSecaoForcada }`; `tetoDeTela` em `perguntaDoAtleta` virou erro de carga.

## Constantes e mutação

`TETO_DA_SECAO = 18` escolhido por regra escrita: *o maior teto que mantém a CLI abaixo de 34 kB na pergunta mais larga* (18 → 31,0 kB; 22 → 33,9; 24 → 35,2; 40 → 45,5). 13 mutações mortas nos dois sentidos (tabela em §27.4). **`LIGACOES_DA_SECAO` e `LADO_DA_SECAO` nasceram e morreram no mesmo dia** — a mutação `→80` provou que eram matematicamente inertes; os tetos viraram derivados de `FOCO_DA_SECAO`. Dívida aberta: `LIGACOES_POR_FOCO 4→40` sobrevive, inerte acima de 6 por aritmética (nenhuma claim declara mais de 6 ligações — fato provado por teste); resta a faixa 4→6 sem trava.

## Preços

- Custo dobrou: ~14 kB → ~31 kB na pergunta mais larga. Para +2 ids por consulta, é caro.
- Precisão do topo depende da régua e **as duas estão publicadas**: concatenação plana 8 → 28 (pior, é aritmética — a tela tem mais linhas); dentro da seção rotulada, **6**.
- Público subiu mais que cego (2→6 vs 0→1 completos). As constantes foram varridas contra os 64 canários com id esperado, e B##/D## estão nesse conjunto desde que foram publicados.

Byte NUL removido de `roteador.mjs` (virou `\u0000`); `secoes.test.mjs` recusa a volta dele.
