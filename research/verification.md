# Arquitetura de verificação — como o programa não alucina

Vale para o Bloco 1 e para todo ciclo futuro (semana, mesociclo, macrociclo).

## Princípio

> **Onde um compilador pode verificar, agente não deve.**

Revisão por agente é o instrumento errado para erro aritmético e violação de
restrição: é cara, não é repetível, e o revisor alucina pelos mesmos mecanismos que o
autor. Agente só verifica o que **não dá para compilar** — sobretudo se uma afirmação
corresponde à fonte que ela cita.

Corolário: cada vez que eu descubro um erro novo, a pergunta certa não é "quem revisa
melhor?", é **"que checagem determinística teria pego isso?"**. Erro achado por revisão
humana ou de agente que possa virar invariante, vira invariante.

## Superfície de risco (o que de fato dá errado)

| # | Falha | Camada que pega |
|---|---|---|
| 1 | Erro aritmético — %, incremento, progressão composta | 1 (invariante) |
| 2 | Citação fabricada — atribui cue/número a um `[R<n>]` que não diz aquilo | 2 (verificação de citação) |
| 3 | Incoerência interna — volume contradiz frequência declarada; sessão estoura o tempo | 1 (invariante) |
| 4 | Deriva silenciosa do desenho — o agente redesenha em vez de implementar | 3 (lente de fidelidade) |
| 5 | Violação de restrição — equipamento inexistente, duas variáveis técnicas no mesmo lift | 1 (invariante) |
| 6 | Dose errada mas internamente coerente — passa em tudo e ainda assim é ruim | 3 (lente fisiológica) |
| 7 | Regressão entre versões — alguém edita o gerado à mão | 4 (hash + `--check`) |

Note que só **6** exige julgamento. Todo o resto é mecânico — e é onde o volume de erro
realmente está.

## Camada 1 — Invariantes executáveis

`scripts/validate-program.mjs`, encadeado no `npm run build`. Quebra o build.

Verifica: 18 semanas × 5 dias; frequência semanal por levantamento (agacho 3 / supino 4
/ terra 2) conferida **por semana**, não no agregado; semanas 1–3 sem percentual, só
RPE com teto 6/7/8; percentual nunca acima de 92%; incremento coerente com +2,5 kg na
barra sobre as marcas **legais** (215/160/240) e não sobre as declaradas; progressão
líquida do bloco em 1,5–4%; nenhum exercício fora do equipamento disponível (**não
existe GHD**); nenhum exercício de altura fixa em suporte (pin/box/Anderson saíram do
programa por §3 do desenho); duração estimada de sessão ≤ 100 min; todo `exerciseId`
registrado.

Relata sem falhar: séries de trabalho por levantamento por semana, e volume por grupo
muscular por semana. Essa tabela é o que eu leio para conferir a dose.

## Camada 2 — Verificação de citação

Toda nota técnica do programa carrega `[R<n>]` na própria célula, ou `[interpretação]`
quando é leitura minha e não da base. Um agente confere cada `[R<n>]` contra
`extract/` por busca literal. Binário: ou a claim existe naquele R, ou não existe.

O verificador é instruído a **refutar**, não a concordar — o viés padrão de um revisor
é validar, e isso precisa ser contrariado explicitamente no prompt.

## Camada 3 — Revisão adversarial com lentes distintas

Não N revisores iguais: revisores idênticos erram juntos e a concordância deles não é
informação. Quatro lentes que falham de formas diferentes:

1. **Dose fisiológica** — o volume e a intensidade produzem a adaptação pretendida?
2. **Legalidade e segurança IPF** — algo ilegal pela regra 2026, ou perigoso dado o
   histórico de lesão de peitoral?
3. **Orçamento** — cabe em 75–100 min? A recuperação fecha entre as sessões?
4. **Fidelidade** — o programa é o que `design.md` mandou, ou o agente redesenhou?

## Camada 4 — Determinismo do pipeline

Markdown é fonte de verdade. `generated.ts` carrega o sha256 da origem e o modo
`--check` quebra o build se divergir. Padrão já existente no repositório
(`build-program.mjs`) — só está sendo estendido. Consequência: **o programa não
consegue derivar em silêncio**, e ninguém edita o gerado à mão sem o build acusar.

## Aplicação aos ciclos futuros

O mesmo esqueleto governa a conversa semanal:

- `kb/DECISION_RULES.md` dá a cada regra um **gatilho observável** nos dados da semana.
  Uma recomendação minha fica rastreável até *uma regra* e *um dado*, em vez de eu ir
  deslizando semana a semana.
- `kb/GAPS.md` é a lista do que a base **não** responde. Serve para eu não prescrever
  com falsa confiança em terreno onde não há apoio — e para marcar onde a resposta terá
  que vir dos dados dele e não da literatura.
- O briefing semanal vem do Firestore com agregados **pré-calculados na escrita**, não
  reconstruídos na leitura. Reconstruir agregado na hora da análise é onde erro de
  aritmética entra sem ser visto.
- Mudança de mesociclo passa pela Camada 1 de novo: regenerar e revalidar, nunca
  editar o gerado.

## O que esta arquitetura NÃO garante

- Que a dose esteja **certa** para ele. Garante que ela seja a dose que o desenho
  pediu, e que o desenho seja rastreável à base. Se a base estiver errada ou não se
  aplicar a ele, nada aqui pega — só os dados dele pegam, ao longo das semanas.
- Que a base esteja completa. Por isso `GAPS.md` é entregável, não subproduto.
- Que as marcas legais estimadas (215/160/240) estejam certas. São estimativa; as
  semanas 1–3 existem exatamente para substituí-las por medida.
