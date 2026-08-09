# Relato do agente das dívidas do gate de dor

> Recuperado do journal do workflow `wf_626a69ef-699`, que foi pausado antes de fechar.
> As mudanças de código e de claim já estão no repositório; isto é o raciocínio.

Ambas as dívidas fechadas. `npm run check:kb`, `npm run check:gate` e `npm run build` verdes (exit 0).

## 1. A trava — o eixo era `modo`, e `modo` é julgamento de extrator

**Diagnóstico.** A trava tinha *dois* eixos e os dois estavam errados, um consertado de manhã (`escala_dor` fora de `FRAMES_DOSE`) e o outro não: `check-claims.mjs` exigia `modo === 'prescricao'`. O par que decide o desenho:

| claim | verbatim | `modo` |
|---|---|---|
| `V079-34` | *"**Anecdotally, I have found that** two to three out of 10 pain level is a good amount to push at"* | `prescricao` |
| `V138-19` | *"**anecdotally** … on the pain scale of 1 to 10 **I find** the usual level to be around the 2 to four"* | `opiniao` |

Mesmo autor, mesma forma de frase, mesmo número para a mesma decisão do leitor, gavetas diferentes. Uma lista de **inclusão** com dois modos seria desligada pela mesma deriva na terceira vez (modo de falha nº 2).

**Eixo escolhido, por EXCLUSÃO:** `escala_dor` × `scope: GERAL` × `modo ∉ MODOS_DESCRITIVOS = {mecanismo, fato, estudo}`. Os três excluídos descrevem o mundo — *"nociceptores respondem a partir de X"* não manda. Medição que sustenta a restrição a `escala_dor`: alargar `opiniao` para **todos** os frames de dose acrescentaria 43 avisos `GERAL` + 19 `PESSOAL` sobre os 23 de hoje.

**Erro e não aviso**, porque `escala_dor` são 3 claims em 6.912 e as três já têm `conditions` — a trava acusa zero hoje, então não tem como degenerar em lista ignorada: ou está calada, ou parou o build.

**Prova por mutação, executada:**
```
✗ R138.jsonl:19 V138-19: número de dor (escala_min=1, escala_max=10, limiar_min=2, limiar_max=4)
  em GERAL/opiniao sem conditions — um limiar de dor servido cru vira alvo. …
exit mutado=1   ·   exit restaurado=0   ·   R138.jsonl idêntico ao pré-mutação (diff limpo)
```
Dois casos novos em `check-claims.test.mjs` (37 recusas / 2 sinalizações / 7 aceitações): o que **recusa** é montado em `opiniao` de propósito — em `prescricao` ficaria verde pela trava velha e não provaria nada; o que **aceita** é `mecanismo` com número de dor, e é ele que separa "trava com eixo" de "varreu tudo".

Arquivos: `/Users/brunnovert/Documents/Dev/powerlifting-app/research/tools/kb.mjs` (`MODOS_DESCRITIVOS` + guarda de subconjunto contra `MODOS`), `research/tools/check-claims.mjs`, `research/tools/check-claims.test.mjs`.

## 2. As quatro cruas — três abriram condição que estava no próprio verbatim

Transcrição de `R138` lida inteira. Nenhuma ressalva inventada; todas as arestas são do mesmo autor.

- **`V138-08`** → `V138-18`, `V027-23`. É a autorização inteira para continuar carregando o tecido, e o argumento dela é *mental* (`V138-06`/`V138-07` são as duas frases anteriores). A irmã `V138-05` já abria em `V138-18`; esta é a mesma instrução dita de novo e tinha ficado sem.
- **`V138-13`** → `V138-18`. **Deliberadamente sem `V027-23`**: aquela fala de lesão *menor* movida demais, e `V138-13` é o ramo da lesão *grave* em que a carga já é peso corporal. Pendurar por semelhança de assunto seria a ressalva fabricada que o §6 recusa.
- **`V138-24`** → `V138-18`, `V138-30`. A condição está dentro do verbatim (*"staying under **our pain threshold**"*); `V138-30` é para a promessa da segunda metade (*"back to our old strength levels"*), que o mesmo vídeo manda desconfiar 45 s depois.
- **`V138-18`** → `V138-33`. Ela **é** a ressalva das outras — a única que manda reduzir. O que faltava é o hedge da frase seguinte, 15 s depois e sobre este exato limiar. Sem ciclo (`V138-33` não tem `conditions`).

**Uma quinta apareceu ao fechar as quatro: `V138-21`** (*"stay under **this pain threshold** easily"*) → `V138-18`. Não estava nas nove do §2 porque não tem número nem palavra do vocabulário da varredura. Isso revela que **"o verbatim nomeia algo que a claim não carrega em `conditions`"** é um predicado mecânico que ainda ninguém rodou sobre a base — registrado no §4.4 como dívida, não como feito.

Base: `conditions` 507 → **511** claims, 695 → **701** arestas. Zero claims novas.

## 3. O teste comportamental — e o defeito que ele achou

A pergunta literal do atleta **não chega no cluster**:
```
--busca "senti uma fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?"
→ 0 direto · VIZINHANÇA: V145-26 · G007-28 · G022-28 · G003-23 · V118-17 · V142-25
```
Casou `terceira série`, `supino`, `pausado` e foi para pegada fechada e índice de estresse. `3/10` vira dois números soltos; `fisgada` não está no `VOCABULARIO.md`. **É defeito da camada de busca, de outro dono — não toquei `check-evidence.mjs`**, e está registrado no §9.3 com a saída junto. O efeito é conservador por acidente, não por desenho.

Com a palavra que a base usa, a claim aparece **com o freio grudado**, que é o que o conserto tinha de provar:
```
--busca "dor 3 de 10 no supino, continuo?"
 1º  V079-34  … 2 a 3 numa escala de 10 é uma boa faixa para empurrar …
     condições: V079-39 ("Be cautious still"), V027-23 (lesão menor é movida mais do que
                deveria), V086-21 (sintomas têm de estar melhorando)
     conflita:  V027-25 (anos de tendão de peitoral no supino, patinando)
```
`--busca "limiar de dor para continuar treinando"` devolve `V001-05 · V138-19 · V138-21 · V138-22 · V177-11 · V079-34` — as seis com `condições` preenchidas. Nenhum número de dor sai cru por nenhum caminho de renderização.

O §9.3 também deixa escrito o que a resposta correta ainda tem de dizer e que nenhuma claim diz: o 2–3/10 é escolha de carga *antes* da série, julgada de sessão para sessão; a fisgada nova no meio da terceira série é a pergunta (b), a base não responde (§6.1), e quem responde congela em ≥2/10 e encerra em ≥4/10 **pelo `PROGRAMA.md` §1.2, dizendo que é o §1.2 que está mandando**.

## Divergência doc×código que também fechei
`research/kb/SCHEMA.md` listava a checagem de dose só como aviso. Acrescentei ali a exceção do número de dor apontando para `DOR-E-TREINO.md` §5 — uma frase, aditiva. `PROGRAMA.md` continua intocado (§7-2 do documento explica por quê).