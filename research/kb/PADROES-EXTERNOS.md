# Padrões externos de base de conhecimento para agentes

Pesquisa feita em 9 de agosto de 2026 para orientar a reconstrução de `research/`.
Critério de filtro: só interessa o que sobrevive à nossa restrição dura — **o consumidor é
um LLM lendo arquivos do repo com grep, sem banco vetorial e sem servidor**.

Boa parte da literatura desse espaço pressupõe infra que não temos (Postgres, Neo4j,
embeddings, um daemon rodando). Onde é esse o caso, o veredito é negativo mesmo quando a
ideia é boa — e a ideia é registrada assim mesmo, porque às vezes o *princípio* migra
mesmo quando a *implementação* não migra.

---

## 1. OpenClaw (ex-Clawdbot, ex-Moltbot)

Assistente pessoal open-source construído sobre Claude Code, ~250 mil estrelas no GitHub.
Duas camadas de memória bem distintas, e é a distinção que interessa.

### 1.1 Memória base (núcleo do produto)

Fontes: <https://docs.openclaw.ai/concepts/memory> ·
<https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory.md> ·
<https://milvus.io/ai-quick-reference/how-does-openclawmoltbotclawdbots-persistent-memory-work>

Layout em disco, tudo Markdown e YAML sob `~/.openclaw/workspace/`:

```
workspace/
├── USER.md            # preferências e perfil, como diretivas imperativas
├── MEMORY.md          # fatos duráveis, curados, compactos
├── DREAMS.md          # sumários de revisão para leitura humana
└── memory/
    ├── YYYY-MM-DD.md          # notas diárias, camada de trabalho
    ├── YYYY-MM-DD-<slug>.md
    └── imports/{codex,claude-code,hermes}/
```

Decisões de design que importam:

- **Estratificação por custo de contexto, não por assunto.** `USER.md` e `MEMORY.md` entram
  no bootstrap de toda sessão; `memory/*.md` é indexado mas **não** injetado. Quando
  `MEMORY.md` estoura o orçamento ele é truncado no contexto (não no disco), e a doc trata
  isso explicitamente como sinal para mover detalhe para a camada de baixo.
- **Contradição em `USER.md` é resolvida por supersessão in-place**, com metadado de
  data-observada e `active`/`superseded`. Não se acumula conflito na camada quente.
- **Fatos com fronteira de ação** (expiram, dependem de aprovação, vêm de fonte não
  confiável) são marcados como tal. Relato de fonte não confiável fica como *evidência*, não
  vira memória durável até revisão.
- Recuperação é `memory_search` (híbrido vetorial + keyword, SQLite), `memory_get` (arquivo
  ou faixa de linhas) e `intent`.
- "Dreaming": consolidação em background que promove itens qualificados da camada diária
  para a durável.

**Veredito: aplicável com ressalva.** A estratificação por orçamento de contexto é a
melhor ideia da pesquisa inteira e é diretamente transplantável. O `memory_search` híbrido
não é — depende de provedor de embeddings e SQLite. A ressalva: o modelo deles é de memória
*episódica que decai*; a nossa base é *bibliográfica e imutável* (uma transcrição de 2021
não fica falsa, ela fica datada). Supersessão in-place seria destrutiva aqui: nosso caso
exige preservar as duas pontas da contradição, não achatar para a mais recente.

### 1.2 Plugin `memory-wiki` — o achado mais próximo do nosso problema

Fontes: <https://docs.openclaw.ai/plugins/memory-wiki> ·
<https://github.com/openclaw/openclaw/blob/main/docs/plugins/memory-wiki.md> ·
<https://github.com/openclaw/openclaw/tree/main/extensions/memory-wiki>

Introduzido no OpenClaw 2026.4.7 (8 de abril de 2026). Compila conhecimento durável num
vault navegável com "páginas determinísticas, claims estruturadas com evidência,
proveniência, dashboards e digests legíveis por máquina". A tagline oficial é quase o
enunciado do nosso problema: *structured claims + evidence, contradiction + freshness
tracking, compiled digests for agents, optional Obsidian-friendly vaults*.

Layout do vault:

```
<vault>/
├── AGENTS.md      WIKI.md      index.md     inbox.md
├── entities/      concepts/    syntheses/   sources/
├── reports/       _attachments/ _views/     .openclaw-wiki/
```

- **Claims em frontmatter**, não em prosa: cada claim tem `id`, `text`, `status`,
  `confidence`, e um array `evidence[]` cujos itens carregam `kind`, `sourceId`, `path`,
  `lines`, `weight`, `confidence`, `privacyTier`. A doc chama isso de transformar o wiki em
  "belief layer, not a passive note dump".
- **`reports/` é gerado, não escrito à mão**: `contradictions.md`, `open-questions.md`,
  `low-confidence.md`, `claim-health.md` (lacunas de evidência), `stale-pages.md`,
  `relationship-graph.md`. Dashboards de saúde da base, derivados do frontmatter.
- **Blocos gerados vs. blocos humanos convivem no mesmo arquivo**; a recompilação preserva o
  que foi escrito à mão. Fontes brutas marcam `<!-- openclaw:wiki:raw-source -->` para optar
  por fora da metadata automática.
- Bloco `## Related` determinístico: páginas-fonte, páginas que referenciam esta, páginas
  vizinhas que compartilham `sourceId`.
- `wiki_lint` faz validação estrutural, checagem de proveniência e detecção de contradição.
- Modos de busca nomeados (`find-person`, `route-question`, `source-evidence`, `raw-claim`),
  e o resultado devolve `matchedClaimId` e `matchedClaimStatus` — a busca sabe *qual claim*
  casou, não só qual arquivo.

**Veredito: aplicável, e é o modelo mais próximo do que precisamos.** Quatro coisas para
copiar quase literalmente: (1) claim como registro estruturado com evidência tipada e
`status`, não como bullet solto; (2) `reports/` derivado por script em vez de mantido à mão
— nossa `CONTRADICTIONS.md` e `GAPS.md` deveriam ser em parte geradas; (3) separação
`sources/` (o que a fonte disse) de `syntheses/` (o que concluímos) de `concepts/` (a
entrada temática); (4) `wiki_lint` como script de CI. O que **não** copiar: SQLite de
compile, digests compilados injetados no prompt, vaults por agente, modo bridge. Tudo isso
é infra de runtime que não temos e não precisamos.

---

## 2. "Hermes" — resolvido: **Hermes Agent, da Nous Research**

**Confiança: alta.** A evidência decisiva não veio de busca por nome, veio de dentro da doc
do OpenClaw: o diretório de importação é `memory/imports/{codex, claude-code, hermes}/` —
Hermes aparece como *par* de Codex CLI e Claude Code, ou seja, é um agente de terminal, não
uma série de modelos e não um engine JS. Confirmado em
<https://hermes-agent.nousresearch.com/docs/>, e o Hermes ships `hermes claw migrate`, que
importa configuração, memória, skills e chaves vindas do OpenClaw.

Portanto: candidato (a) acertou a **organização** (Nous Research) e errou o **artefato** —
o relevante não é o formato de function-calling da série Hermes de modelos, é o produto
*Hermes Agent*, lançado por volta de fevereiro de 2026. Candidato (c), o engine JS da Meta,
é ruído. Descartado com confiança alta.

Fontes: <https://www.mmntm.net/articles/hermes-memory-architecture> ·
<https://www.marktechpost.com/2026/02/26/nous-research-releases-hermes-agent-to-fix-ai-forgetfulness-with-multi-level-memory-and-dedicated-remote-terminal-access-support/> ·
<https://hermesatlas.com/guide/memory/> ·
<https://www.glukhov.org/ai-systems/hermes/hermes-agent-memory-system/>

### O design, que é uma inversão deliberada do OpenClaw

Memória persistente inteira em `~/.hermes/memories/`, **dois arquivos Markdown, 3.575
caracteres no total**:

- `MEMORY.md` — 2.200 caracteres (~800 tokens): fatos de ambiente, convenções, lições.
- `USER.md` — 1.375 caracteres (~500 tokens): preferências, estilo, identidade.

Entradas delimitadas por `§`. Três decisões que valem o estudo:

1. **Teto rígido, sem auto-compactação.** Quando enche, a escrita **falha com erro** e o
   agente precisa consolidar manualmente antes de tentar de novo. Isso cria pressão de
   seleção: entrada de baixo sinal é podada porque o espaço é disputado. O agente vê o
   próprio orçamento no system prompt: `[67% — 1.474/2.200 chars]`.
2. **Rejeição explícita de embeddings.** A busca é FTS5 (full-text do SQLite) sobre o
   histórico bruto de sessão, ~20 ms por query. O argumento: o conhecimento *destilado* já
   está nos 3.575 caracteres sempre carregados; o histórico bruto não precisa de
   recuperação semântica. A divisão de trabalho é **"memória persistente responde *o que eu
   sei*; busca de sessão responde *o que aconteceu*"**.
3. **Núcleo congelado no início da sessão**, para não invalidar o cache de prefixo do
   provedor. Edição dinâmica de memória resetaria o cache a cada turno.

Escrita é via três operações: `add`, `replace(old_text, text)`, `remove(old_text)`.
O ponto fraco reconhecido: o snapshot congelado significa que descobertas do meio da sessão
só entram na sessão seguinte. Staleness não é prevenida, é delegada à curadoria humana.

**Veredito: aplicável, e a tese central é a mais valiosa para nós.** A frase "conhecimento
destilado fica no núcleo carregado; busca lexical serve o corpus bruto" é exatamente a
arquitetura que a nossa restrição já nos impõe — a diferença é que aqui isso deixa de ser
limitação e vira o desenho. E o teto rígido com falha em vez de auto-poda é uma ideia forte
e barata de implementar: um lint que rejeita commit quando `DECISION_RULES.md` passa de N
caracteres força a hierarquização que a base precisa. A ressalva: 3.575 caracteres é o
orçamento *deles*, calibrado para memória pessoal; o nosso núcleo comporta uma ordem de
grandeza a mais. O que **não** copiar: as operações de escrita mediadas por tool (temos
`git` e um editor), e a ideia de congelar — nossa base é lida, não escrita, durante a conversa.

---

## 3. Convenções e projetos de fato

### 3.1 AGENTS.md

<https://agents.md/> · <https://agentsstandard.com/>

Convenção aberta sob o Linux Foundation, lida nativamente por 30+ ferramentas, ~60 mil
repos. O mecanismo relevante não é o formato (é Markdown livre) e sim a **resolução
hierárquica**: o agente lê o arquivo mais próximo na árvore de diretórios, e o mais próximo
vence. Cada subprojeto embarca instrução própria sem poluir a raiz.

Achado cético que vale registrar: um estudo citado na especificação encontrou que
`AGENTS.md` **gerado por LLM piorou a taxa de sucesso em 5 de 8 cenários** e adicionou
2,45–3,92 passos por tarefa. Instrução escrita à mão e específica bate instrução gerada.

**Veredito: aplicável.** Colocar um `AGENTS.md` curto em `research/` e outro em
`research/kb/` — descrevendo como ler a base, qual arquivo é entrada, o que significa cada
tier de procedência e a regra de citação `[Rxxx @mm:ss]` — é a forma mais barata de garantir
que qualquer agente que entre no repo pela primeira vez recupere direito. E escrever à mão.

### 3.2 Basic Memory

<https://github.com/basicmachines-co/basic-memory> · <https://basicmemory.com/>

Grafo semântico em Markdown puro, indexado em SQLite, compatível com Obsidian. O que
interessa é a **sintaxe**, que codifica um grafo dentro de Markdown legível:

```markdown
---
title: <título da entidade>
type: note
permalink: <slug-uri>
tags: [opcional]
---

## Observations
- [method] Pour over highlights subtle flavors
- [fact] Lighter roasts contain more caffeine than dark #brewing
- [question] How does temperature affect extraction?

## Relations
- pairs_well_with [[Chocolate Desserts]]
- requires [[Burr Grinder]]
- [[Alvo]]                      # link nu indexa como links_to
```

Observação = fato atômico prefixado por **categoria entre colchetes**. Relação = **verbo
tipado + wikilink**. Frontmatter carrega o `permalink` estável.

**Veredito: aplicável — a sintaxe, não o produto.** O produto traz busca vetorial FastEmbed
e reranking por cross-encoder, que descartamos. Mas `- [categoria] texto` e
`- verbo_tipado [[Alvo]]` são **tokens greppáveis e estáveis**, e essa é precisamente a
propriedade que nos falta. `grep -n '^\- \[contradiz\]'` é uma consulta de primeira classe.
Wikilink aqui não serve para renderizar grafo — serve porque `[[C07]]` é uma string única no
repo inteiro, e `grep -rn '\[\[C07\]\]'` devolve o fecho transitivo da contradição em um
comando. É indexação por convenção lexical.

### 3.3 Zep / Graphiti — grafo temporal bi-temporal

<https://arxiv.org/html/2501.13956v1> · <https://blog.getzep.com/beyond-static-knowledge-graphs/> ·
<https://github.com/getzep/graphiti>

Cada aresta (fato) carrega quatro timestamps: `valid_at` / `invalid_at` (quando o fato foi
verdadeiro **no mundo**) e `created_at` / `expired_at` (quando o sistema **soube** disso).
Quando informação nova contradiz um fato existente, a aresta **não é deletada** — recebe um
timestamp de invalidação. O grafo continua capaz de responder "o que se acreditava, e
quando", e nunca serve fato obsoleto como corrente.

**Veredito: não aplicável como implementação; o princípio é aplicável e é o mais importante
da seção.** Neo4j, ingestão por LLM e resolução de entidades estão fora de alcance. Mas a
**bitemporalidade** resolve com precisão o nosso caso mais delicado: o autor do canal se
contradiz ao longo dos anos, e a distinção entre "ele mudou de opinião em 2023" (tempo de
validade) e "descobrimos isso ao processar R014" (tempo de ingestão) é exatamente o que
impede de achatar a base. Traduz-se em dois campos de data por claim, sem grafo nenhum: a
data do vídeo e o status de supersessão. E a regra de ouro — *invalidar, nunca deletar* —
deve ser lei da base.

### 3.4 Letta / MemGPT — memória hierárquica

<https://www.letta.com/blog/memory-blocks/> · <https://www.letta.com/blog/sleep-time-compute/>

Core memory (blocos fixados no contexto, editáveis por tool) vs. recall/archival memory
(fora do contexto, consultada por tool call). A analogia é RAM/disco, e é a mesma
estratificação do OpenClaw e do Hermes, chegando por outro caminho. A contribuição própria
é o **sleep-time agent**: o agente primário *não* recebe as tools de editar a memória; um
segundo agente as recebe e reorganiza a base de forma assíncrona, o que tira a latência de
curadoria do caminho da resposta e melhora a qualidade da curadoria.

**Veredito: parcialmente aplicável.** A hierarquia já chega por duas outras fontes e é
consenso — vale adotar por triangulação, não por Letta. O sleep-time agent tem tradução
direta e barata no nosso mundo: **curadoria da base é um job de manutenção separado da
conversa**, feito por outro agente, em outro commit, nunca no meio de responder "vale a pena
migrar pra convencional?". O resto (servidor Letta, blocos versionados por API, agentes
statefully persistidos) é infra e fica fora.

### 3.5 MCP memory servers e o ecossistema de plugins

<https://github.com/NevaMind-AI/memU> · <https://github.com/yoloshii/clawmem> ·
<https://github.com/coolmanns/openclaw-memory-architecture>

Camada de servidores que expõem memória por tool call. Vale registrar o padrão dominante e
o alerta. O `memU` e o `clawmem` fazem RAG híbrido sobre notas Markdown; o
`openclaw-memory-architecture` anuncia "12 camadas de memória, grafo de 3 mil fatos, busca
semântica multilíngue a 7 ms em GPU".

**Veredito: não aplicável.** Servidor MCP pressupõe processo rodando, e a nossa premissa é
que não há. Mais importante: essa é a região do espaço com maior densidade de hype por
unidade de decisão de design. "12 camadas de memória" para 3 mil fatos é sobre-engenharia —
temos exatamente essa ordem de grandeza de claims e ela cabe confortavelmente em arquivos
lidos por grep. A curiosidade é que o nosso volume (3 mil claims) é o mesmo que projetos
assim usam para justificar GPU e grafo, o que é um bom indício de que a infra ali é
opcional.

---

## 4. O QUE ADOTAR

Recomendações concretas, em ordem de impacto.

### 4.1 Granularidade: três camadas, chaves naturais diferentes

**Não fazer um arquivo por claim.** Três mil arquivos destroem o `git diff`, tornam a
listagem de diretório inútil e não compram nada — grep já opera em nível de linha, que é a
granularidade da claim. O arquivo-por-claim só se paga quando existe um índice externo que
resolve ID→arquivo, e é justamente o que não temos.

Adotar:

| Camada | Granularidade | Chave | Volume | Como é lida |
|---|---|---|---|---|
| **Núcleo** | um arquivo por função | `INDEX.md`, `DECISION_RULES.md`, `CONTRADICTIONS.md`, `GAPS.md` | 4 arquivos, teto de caracteres | sempre carregada inteira |
| **Sínteses** | **um por tópico** | `synth/agachamento-profundidade.md` | 40–60 arquivos | carregada sob demanda, 1–3 por pergunta |
| **Claims** | **um por vídeo** | `extract/R014.md` | 197 arquivos | alvo de grep; raramente lida inteira |
| **Corpus** | um por vídeo | `corpus/captions/R014.json3.gz` | 197 | nunca carregada; só citada |

A escolha de **um arquivo de claims por vídeo** é a que mais importa e não é óbvia. Ela se
justifica por quatro razões que se reforçam: a chave `Rxxx` já é a chave da citação
`[Rxxx @mm:ss]`, então o caminho do arquivo é derivável da citação sem índice; a
regeneração vira idempotente por vídeo (reprocessar R014 reescreve exatamente um arquivo);
o `git diff` fica local quando uma transcrição é corrigida; e a procedência fica
estruturalmente garantida, porque uma claim não tem como existir fora do arquivo da fonte
dela. O agrupamento por `lote_NN` da base antiga era um artefato do pipeline de extração,
não uma propriedade do conhecimento — não reproduzir.

A camada de **sínteses por tópico é a que a conversa realmente consome**. "Vale a pena
migrar de sumo pra convencional?" quer um documento sobre esse tópico com as claims
já reunidas e as contradições anexadas, não 40 claims cruas espalhadas por 12 vídeos.

### 4.2 Nomenclatura

Slug em kebab-case, sem acento, sem número de ordem (numeração no nome apodrece na primeira
reordenação): `synth/terra-sumo-vs-convencional.md`. IDs estáveis e curtos com prefixo de
tipo, porque o prefixo é o que torna o ID greppável sem falso positivo:

- `R014` — fonte do corpus (já em uso, manter)
- `C07` — contradição
- `G12` — lacuna
- `D03` — regra de decisão
- `E05` — atleta de elite · `L21` — item de literatura (PMID vai no corpo)

Um ID **nunca** é reciclado. Removido vira `status: retirada` com nota, não some.

### 4.3 Índice de entrada — e é aqui que se resolve o retrieval

`kb/INDEX.md` é o único arquivo cujo caminho um agente precisa saber. Ele não é um sumário:
é **o substituto do embedding**. O modo de falha do grep não é performance, é **vocabulário**
— quem pergunta "abertura de pernas no terra" não casa com um arquivo que diz "sumo". Então
cada entrada do índice carrega uma linha de termos escrita à mão:

```markdown
## terra-sumo-vs-convencional
arquivo: synth/terra-sumo-vs-convencional.md
termos: sumo, convencional, conventional, abertura, stance, alavanca, braço de momento,
        biotipo, fêmur, quadril, deadlift, levantamento terra, migrar, trocar de estilo
claims: 84 · contradições: [[C03]] [[C11]] [[C19]] · lacunas: [[G07]]
tiers: corpus 61 · elite 14 · literatura 6 · interpretação 3
```

Um agente lê `INDEX.md` inteiro (barato), casa a pergunta contra as linhas `termos`, e sabe
exatamente quais dois ou três arquivos abrir e quais contradições vêm junto. Isso é
recuperação semântica feita por leitura, e é *melhor* que embedding no nosso caso, porque o
LLM que faz o matching é o mesmo que vai responder e já entende o domínio. A linha `termos`
deve incluir deliberadamente sinônimos, inglês, gíria de academia e erros comuns.

### 4.4 Procedência

Manter os cinco tiers (corpus / elite / literatura / interpretação / usuário) e marcá-los
**inline na linha da claim**, nunca em arquivo separado — o objetivo é que qualquer linha
que o grep devolva já chegue com o tier junto, sem exigir segunda leitura:

```markdown
- [corpus] Pausa no supino deve ter rampa própria de duração, não de carga.
  [R014 @12:33] "you don't add weight to the pause, you add time"
  ~ 2024-03-11 · conf: alta · ver [[C07]]
```

Ordem canônica: categoria, texto, citação, verbatim, data do vídeo, confiança, links. A data
é a **data do vídeo**, não a do processamento — é o `valid_at` do Zep, e é o que permite
resolver contradição por recência mais tarde. Convenção de precedência quando os tiers
divergem, declarada uma vez no `AGENTS.md` e não renegociada por resposta: literatura >
elite > corpus para afirmações de mecanismo; corpus > literatura para escolhas de
programação do autor. E `[interpretacao]` é **nossa**, jamais citável como se fosse do
autor — o lint deve rejeitar uma linha `[interpretacao]` que carregue `[Rxxx @mm:ss]`.

### 4.5 Contradição — o requisito central

Uma contradição é **entidade de primeira classe com arquivo próprio**, não uma nota de
rodapé. `kb/contradictions/C07.md`:

```markdown
---
id: C07
tipo: interna            # interna | contra-elite | contra-literatura
status: aberta           # aberta | resolvida-recencia | resolvida-tier | irreconciliavel
topicos: [supino-pausa, rampa-de-carga]
---
## Lado A
- [corpus] ... [R112 @03:20] "..."  ~ 2021-06-02
## Lado B
- [corpus] ... [R014 @12:33] "..."  ~ 2024-03-11
## Leitura
Por que divergem, o que mudou, e o que fazer quando a pergunta encosta nisso.
Se `status: aberta`, dizer isso na resposta é obrigatório — não escolher um lado em silêncio.
```

Três regras não negociáveis:

1. **Link bidirecional.** A síntese do tópico lista `[[C07]]`, e `C07.md` lista os tópicos.
   Sem isso a contradição existe mas não é recuperada, que é o pior dos mundos: catalogada e
   invisível. É esse link que faz as contradições *orbitarem* a pergunta — abrir o tópico
   arrasta as contradições sem nenhuma busca adicional.
2. **Invalidar, nunca deletar** (Zep). Lado perdedor vira `status: resolvida-recencia` com
   as duas datas visíveis. A base preserva que o autor mudou de ideia; isso é informação
   sobre o autor, não ruído.
3. **`status: irreconciliavel` é um resultado legítimo.** A pressão para fechar toda
   contradição é o que achata a base. Se não dá para decidir, o valor entregue na conversa é
   apresentar as duas pontas com as datas e os tiers.

### 4.6 Retrieval sem banco vetorial — o protocolo

Sem servidor, a recuperação é um procedimento escrito no `AGENTS.md` e seguido pelo agente:

1. Ler `kb/INDEX.md` inteiro. Casar a pergunta contra as linhas `termos`.
2. Abrir 1–3 sínteses de tópico. Elas já trazem as claims curadas e os IDs de contradição.
3. Abrir os `C*.md` referenciados. **Sempre** — não é opcional nem condicional.
4. Só descer para `extract/Rxxx.md` quando a síntese for insuficiente, e aí por
   `grep -rn` no termo, ou direto pelo `Rxxx` que a síntese citou.
5. Nunca abrir `corpus/`. Ele existe para reconstruir e auditar, não para responder.

O que torna isso confiável não é o grep, é a disciplina de escrita: a linha `termos` no
índice, os IDs com prefixo e os links bidirecionais. **A recuperação é uma propriedade do
formato de escrita, não uma ferramenta de leitura.** É o ponto que o Hermes acerta e que a
maioria do ecossistema resolve comprando embeddings.

### 4.7 Lint e relatórios gerados

Copiar `wiki_lint` e `reports/` do memory-wiki, em versão pobre: um script Node em
`research/tools/lint-kb.mjs` que falha o commit em (a) citação `[Rxxx @mm:ss]` cujo `Rxxx`
não existe no manifesto; (b) claim `[corpus]` sem verbatim; (c) ID referenciado que não
existe; (d) contradição sem link de volta a partir do tópico; (e) núcleo acima do teto de
caracteres; (f) linha `[interpretacao]` com citação de fonte. E um `build-reports.mjs` que
**gera** `GAPS.md`, a contagem por tier do `INDEX.md` e uma lista de claims sem citação.
Regra: o que pode ser derivado é derivado, e o que é derivado leva cabeçalho dizendo que não
se edita à mão — é o mesmo princípio que `verification.md` já registra ("onde um compilador
pode verificar, agente não deve").

### 4.8 Teto de caracteres no núcleo (Hermes)

Declarar teto explícito para a camada sempre-carregada — algo como 24 mil caracteres somando
`INDEX.md` + `DECISION_RULES.md` — e fazer o lint **falhar** quando estourar, sem
auto-podar. A falha é o mecanismo: força consolidar ou empurrar detalhe para a camada de
sínteses, e é o que impede o núcleo de virar despejo. Registrar a ocupação no topo do
arquivo, como o Hermes faz.

---

## 5. O QUE NÃO COPIAR

- **Embeddings, busca vetorial, híbrida ou reranking.** Sem infra, e o Hermes demonstra que
  para conhecimento destilado é dispensável. Nosso índice curado é mais preciso.
- **Um arquivo por claim.** Três mil arquivos sem índice resolvedor. Grep já é linha a linha.
- **Grafo (Neo4j/Graphiti), ingestão por LLM, resolução de entidades.** Guardar a
  bitemporalidade, jogar fora o grafo. Nosso "grafo" são wikilinks greppáveis.
- **Servidor MCP de memória, SQLite de compile, digests injetados.** Pressupõem processo
  rodando; a premissa do projeto é o contrário.
- **Supersessão in-place do `USER.md`.** Destrutiva. Nossa contradição é o produto, não o
  defeito.
- **"12 camadas de memória", decay/ativação, meditação, dreaming.** Vocabulário de hype para
  volumes que cabem em arquivo. A base é bibliográfica e imutável: não decai, não sonha.
- **`AGENTS.md` gerado por LLM.** Evidência de que piora o desempenho. Escrever à mão.
- **Escrita de memória mediada por tool** (`add`/`replace`/`remove` do Hermes, blocos do
  Letta). Temos editor e `git`, que dão versionamento e diff de graça — que é justamente o
  que essas APIs tentam reconstruir.
- **Curadoria durante a conversa.** Lição do sleep-time compute do Letta: reorganizar a base
  é commit separado, nunca no caminho da resposta.

---

## Fontes

- OpenClaw, memória: <https://docs.openclaw.ai/concepts/memory> · <https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory.md>
- OpenClaw, memory-wiki: <https://docs.openclaw.ai/plugins/memory-wiki> · <https://github.com/openclaw/openclaw/tree/main/extensions/memory-wiki>
- Hermes Agent (Nous Research): <https://hermes-agent.nousresearch.com/docs/> · <https://www.mmntm.net/articles/hermes-memory-architecture> · <https://hermesatlas.com/guide/memory/> · <https://www.marktechpost.com/2026/02/26/nous-research-releases-hermes-agent-to-fix-ai-forgetfulness-with-multi-level-memory-and-dedicated-remote-terminal-access-support/>
- Basic Memory: <https://github.com/basicmachines-co/basic-memory> · <https://basicmemory.com/>
- Zep / Graphiti: <https://arxiv.org/html/2501.13956v1> · <https://blog.getzep.com/beyond-static-knowledge-graphs/> · <https://github.com/getzep/graphiti>
- Letta / MemGPT: <https://www.letta.com/blog/memory-blocks/> · <https://www.letta.com/blog/sleep-time-compute/>
- AGENTS.md: <https://agents.md/> · <https://agentsstandard.com/>
- Ecossistema: <https://github.com/NevaMind-AI/memU> · <https://github.com/yoloshii/clawmem> · <https://github.com/coolmanns/openclaw-memory-architecture> · <https://milvus.io/ai-quick-reference/how-does-openclawmoltbotclawdbots-persistent-memory-work>
