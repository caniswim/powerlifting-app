# Antidoping no powerlifting brasileiro — levantamento factual

**Data do levantamento:** 2026-08-09
**Escopo:** estrutura formal, volume real de testagem, sinal indireto nos dados de resultado, cenário das federações, e implicação estratégica para um atleta natural, masculino, 87 kg, estreante, mirando IPF no Brasil em ~12 meses.

**Como ler este documento:** cada número tem fonte e URL. Onde não há dado público, está escrito "não há dado público" — a ausência é, aqui, informação. Nenhuma pessoa é acusada; a única menção nominal possível seria a de sancionado por órgão oficial, e mesmo essa foi mantida como contagem, não como nome.

---

## RESPOSTA CURTA

A premissa **bate em parte, e pela razão errada**.

- **Bate:** a testagem antidoping estatal em powerlifting no Brasil é praticamente inexistente em número. A ABCD reportou à WADA **1 amostra de Powerlifting em 2022, 0 em 2023 e 6 em 2024**, contra ~4.300–4.900 amostras totais/ano da própria ABCD. Na prática, competir na CBLB no Brasil hoje é competir num ambiente de risco de detecção próximo de zero.
- **Não bate:** a consequência que ele deduziu — "os totais que eu enfrento são inflados por enhanced" — **não aparece nos dados**. Globalmente, na faixa 74–93 kg masculino, raw, sem wraps, a mediana de meets testados e não testados é **idêntica (535,0 kg vs 535,0 kg)**. A diferença só aparece na cauda extrema (p99: 755 vs 770 kg).

Ou seja: ele está certo sobre o sistema e errado sobre o efeito prático na faixa em que vai competir. O problema dele não é o campo — é o topo do campo.

---

## 1. A estrutura formal

### 1.1 Qual é a federação

A entidade brasileira filiada à IPF é a **Confederação Brasileira de Levantamentos Básicos (CBLB)**. Confirmado na lista oficial de membros da IPF:
https://www.powerlifting.sport/federation/regions/south-america
— entrada Brasil: *"Confederacao Brasileira de Levantamentos Basicos (CBLB)"*, com site `powerlifting-ipf.com.br`. (A IPF não tem página `/members`; a lista vive por região.)

Sobre a confusão de domínios levantada:
- `powerlifting-ipf.com.br` — **está no ar** (HTTP 200, verificado 2026-08-09) e retorna como identidade "Confederação Brasileira de Levantamentos Básicos". É o domínio vigente.
- `cblb.org.br` — **não resolve** (sem resposta DNS/HTTP).
- `cblb.com.br` — **redireciona (301) para `cblbh.com.br`**, que é a **Confederação Brasileira de Luta de Braço e Halterofilismo** — luta de braço, entidade *diferente*, sem relação com powerlifting IPF. É uma colisão de sigla, e é a origem provável da confusão.
- `powerliftingbrazil.wixsite.com/cblb` — site Wix **legado da mesma CBLB** (mesmo endereço social, Rua Frei Caneca 430, SP; resultados param em 2020). **Não são duas entidades** — é um site antigo que ficou no ar.
  https://powerliftingbrazil.wixsite.com/cblb/copia-powerlifting
- No OpenPowerlifting, todos os 7.773 registros da federação `CBLB` têm `ParentFederation = IPF` e `Sanctioned = Yes` — confirmação independente do vínculo IPF.

Correções a duas siglas que circulam como "federações rivais" e não são:
- **FEPERJ** (https://feperj.org/) **não está fora da IPF** — é a federação **estadual do Rio de Janeiro filiada à CBLB**, listada em https://www.powerlifting-ipf.com.br/paginas/federacoes.php
- **ABPO** não existe como entidade de powerlifting (a sigla pertence à Associação Brasileira do Papelão Ondulado). **Não há dado público.**

### 1.2 O que a filiação à IPF obriga

A IPF **é signatária do Código Mundial Antidoping**, e o diz literalmente nas suas próprias regras:

> *"As a Signatory to the World Anti-Doping Code ('the Code'), the IPF has adopted and implemented anti-doping policies and rules which conform with the Code."*

- Página: https://www.powerlifting.sport/anti-doping/ipf-anti-doping-rules
- PDF vigente (desde 27/06/2023): https://www.powerlifting.sport/fileadmin/ipf/data/anti-doping/IPF_Anti-Doping_Rules__2021__Amended_2023.pdf

**O que a IPF obriga da filiada nacional — texto literal, não paráfrase.** IPF Anti-Doping Rules, Art. 18.1:

> *"All National Federations and their members shall comply with the Code, International Standards, and these Anti-Doping Rules. All National Federations and other members shall include in their policies, rules and programs the provisions necessary to ensure that IPF may enforce these Anti-Doping Rules (including carrying out Testing) directly…"*

Art. 18.2 exige que cada federação nacional **incorpore as regras no seu estatuto**, direta ou por referência. E o Art. 12 prevê **sanção da IPF contra a própria federação nacional** em caso de não conformidade: 21 dias para sanar, sob pena de multa, suspensão e exclusão de eventos.

A Constituição da IPF reforça (art. 3.3 e 15.1): https://www.powerlifting.sport/fileadmin/ipf/data/about-ipf/constitution-by-laws/IPF_Con_By-Laws_2018.pdf

**Quem coleta, na prática.** A IPF **não** delegou seu programa à ITA — a IPF não consta na lista de parceiros da ITA (https://ita.sport/partners/; entre esportes de força, só IWF e IFBB). O modelo é:
- A IPF pode requisitar uma NADO, uma RADO ou um prestador privado como *Sample Collection Authority* — https://www.powerlifting.sport/anti-doping/testing
- **A seleção dos atletas a testar é sempre do CCES** (Canadian Centre for Ethics in Sport), por regra técnica: *"The selection of lifters for drug testing shall always be made by the CCES"* — IPF Technical Rulebook 2026, cláusula 10 do Júri.
  https://www.powerlifting.sport/fileadmin/ipf/data/rules/technical-rules/english/2026_IPF_Technical_Rulebook__effective_01_March_2026__v3.pdf

Isso importa: a seleção ser de um terceiro independente (CCES), e não da federação sede, é uma salvaguarda real contra captura local — e é uma salvaguarda que só opera em evento IPF.

**O ponto que importa:** essas obrigações são de *reconhecimento e conformidade normativa*. Nenhuma delas garante volume de coleta doméstica. É exatamente aí que a norma e a realidade se separam no Brasil — a CBLB pode estar formalmente em conformidade e, ao mesmo tempo, ter ~0 amostras coletadas por ano em seus campeonatos. Uma coisa não contradiz a outra. É o que os números de §2.1 mostram: nenhuma autoridade brasileira de powerlifting reportou coleta ao ADAMS além das 7 amostras da ABCD em três anos.

### 1.3 Vínculo com a ABCD

A **ABCD (Autoridade Brasileira de Controle de Dopagem)** é a Organização Nacional Antidopagem (NADO) do Brasil, criada em 2011, reconhecida pela WADA como autoridade principal para coleta de amostras, gestão de resultados e julgamento em âmbito nacional.
https://www.gov.br/esporte/pt-br/composicao/orgaos-especificos/esporte/autoridade-brasileira-de-controle-de-dopagem

Toda modalidade sob entidade nacional de administração do desporto está, em tese, sob jurisdição da ABCD. Powerlifting incluído. A questão não é jurisdição — é execução.

---

## 2. O que de fato acontece, em número

### 2.1 Amostras de Powerlifting no Brasil — o número central

Fonte: WADA *Anti-Doping Testing Figures*, **Tabela 111/112 "AIMS Sport — Powerlifting"**, quebrada por Testing Authority. Os três PDFs foram baixados e lidos diretamente (`pdftotext`), não via resumo — os números abaixo são leitura literal da tabela.

| Ano | Amostras de Powerlifting pela ABCD | Total mundial Powerlifting | AAF mundial em Powerlifting | Total geral ABCD (todas modalidades) |
|---|---|---|---|---|
| 2022 | **1** (1 urina, **fora** de competição, 0 AAF) | 3.119 | 119 — **3,8%** | 4.384 (0,8%) |
| 2023 | **0** — a ABCD **não aparece na tabela** | 3.712 | 155 — **4,2%** | 4.318 (0,9%) |
| 2024 | **6** (6 urina, **em** competição), **1 AAF** | 3.853 | 110 — **2,8%** | 4.880 (0,7%) |

A coluna que importa é a quarta: **o powerlifting mundial roda a 2,8–4,2% de resultado analítico adverso, contra 0,7–0,9% do conjunto de todas as modalidades testadas pela ABCD.** É um esporte com prevalência de detecção 3 a 5 vezes acima da média — e é justamente onde o Brasil não coleta.

- 2024: https://www.wada-ama.org/sites/default/files/2025-12/2024_Anti-Doping%20Testing%20Figures%20Report_FINAL_v3.pdf (Tabela 112, p. 72+)
- 2023: https://www.wada-ama.org/sites/default/files/2025-06/2023_anti_doping_testing_figures_en_0.pdf (Tabela 111)
- 2022: https://www.wada-ama.org/sites/default/files/2024-04/2022_anti-doping_testing_figures_en.pdf (Tabela 111)

**Sete amostras em três anos.** Contra 4.638 testes da ABCD só em 2025, distribuídos em 91 modalidades.

**Achado adicional, e é definitivo:** na tabela de Powerlifting de 2024, que lista ~80 autoridades de testagem no mundo, **a ABCD é a única entidade brasileira presente — não há linha para a CBLB nem para qualquer outra autoridade do Brasil.** Ou seja: não existe um programa de coleta paralelo, conduzido pela própria federação, que estivesse escapando da contabilidade da ABCD. Se a CBLB coletasse amostras e as reportasse ao ADAMS, apareceria ali. Não aparece. Em 2023 nem a ABCD aparece.

Onde isso coloca o Brasil entre os pares (Powerlifting, 2024, amostras totais na Tabela 112):

| Autoridade | Amostras de Powerlifting 2024 |
|---|---|
| IPF (federação internacional) | **870** |
| NADA / Alemanha | ~400 (210 IC + 97 OOC + sangue) |
| Anti-Doping Sweden | 121 IC + 89 OOC |
| Canadá (CCES) | 79 IC + 93 OOC |
| Anti-Doping Norway | 95 IC + 54 OOC |
| **ABCD / Brasil** | **6** |

O Brasil aparece na 58ª posição de ~80 autoridades listadas. Não é uma questão de o país ser pequeno no esporte — o Brasil tem um dos maiores calendários de powerlifting das Américas (§3.1). É uma questão de a modalidade não estar no plano de distribuição de testes.

Para calibrar o quanto isso é pouco, dentro da própria ABCD e em esportes vizinhos:

| Modalidade | Amostras ABCD 2023 | Amostras ABCD 2024 |
|---|---|---|
| Powerlifting | **0** | **6** |
| Levantamento de peso olímpico | 72 | 43 |
| Para-Powerlifting | 72 | 105 |

O Para-Powerlifting brasileiro — modalidade paralímpica, com muito menos praticantes — recebeu **17x mais amostras** que o powerlifting convencional em 2024.

### 2.2 Estadual vs. nacional

Não há dado público que quebre as (pouquíssimas) amostras brasileiras entre campeonato nacional e estadual. Mas a estrutura do calendário torna a conclusão quase aritmética.

Volume de competição da CBLB (OpenPowerlifting, dump 2026-08-08):

| Ano | Meets nacionais | Inscrições | Meets estaduais/regionais | Inscrições |
|---|---|---|---|---|
| 2022 | 2 | 266 | 6 | 935 |
| 2023 | 1 | 281 | 5 | 309 |
| 2024 | 3 | 379 | 7 | 787 |
| 2025 | 3 | 550 | **18** | **2.213** |
| 2026 (parcial) | 5 | 613 | 3 | 313 |

Em 2025, **80% das inscrições da CBLB (2.213 de 2.763) ocorreram em campeonato estadual**. Com 6 amostras/ano no país inteiro, e assumindo que o pouco que existe se concentra no Campeonato Brasileiro, a taxa de testagem em estadual é indistinguível de zero.

**Testagem fora de competição no Brasil para powerlifting:** 1 amostra em 2022, 0 em 2023, 0 em 2024 (as 6 de 2024 são todas em competição). Efetivamente inexistente. Isso importa porque o teste fora de competição é o único que detecta uso em bloco de preparação — o teste em competição, anunciado, é o mais fácil de contornar.

### 2.3 Violações publicadas

**Lista de atletas suspensos da ABCD** (atualizada 06/08/2026):
https://www.gov.br/abcd/pt-br/coordenacoes/gestao-de-resultados/atletas-suspensos

- Lista definitiva, ~66 atletas: **1 em "Levantamento de Pesos Básicos"** (4 anos, androsterona, pendente de recurso).
- Lista anterior (16/10/2025), ~68 atletas: **1 em "Levantamento de Peso Básico"**.
- Suspensão provisória (07/08/2026): **nenhum** de levantamentos básicos.
- Distribuição por modalidade na lista vigente: Ciclismo 18, Atletismo 7, Levantamento de Peso (olímpico) 6, Levantamento de Pesos Básicos 1.

**Contraponto importante — mas leia a nomenclatura com cuidado:** no Relatório de Gestão ABCD 2023 (p. verificada por extração direta), a lista dos esportes com mais resultados analíticos adversos do Brasil é: **"a) Levantamento de Peso: 7 casos; b) Basquete e Triatlo: 5 casos; c) Futebol: 3 casos"**, de 40 RAAs totais no ano. Das 40 violações, 27 foram por S1 – Agentes Anabolizantes.
https://www.gov.br/abcd/pt-br/acesso-a-informacao/dados-abertos/relatorios/relatorios-de-gestao-anos-anteriores/RelatrioGeralABCD2023Word.pdf

> **Ressalva de nomenclatura — não conflacionar:** na terminologia da ABCD, **"Levantamento de Peso" é o halterofilismo olímpico**, e o powerlifting aparece como **"Levantamentos Básicos"**. A própria lista de suspensos separa as duas rubricas (Levantamento de Peso: 6; Levantamento de Pesos Básicos: 1). Portanto **os 7 RAAs de 2023 são de halterofilismo olímpico, não de powerlifting.** Seria desonesto apresentá-los como caso do esporte dele.

O que esse número *legitimamente* diz: o esporte de força adjacente, quando testado (72 amostras da ABCD em 2023), produziu 7 RAAs — **~10% de taxa de detecção**, e foi o maior gerador de violações do país. E o powerlifting mundial roda a 2,8–4,2% de AAF, contra 0,7–0,9% da média ABCD.

**A conclusão que se sustenta:** a raridade de sancionados brasileiros de powerlifting **não é evidência de campo limpo; é evidência de campo não testado.** Um caso publicado sobre 6 amostras coletadas em 2024 não é uma taxa baixa — é uma taxa de 17%. Com n=6, esse 17% não é estatisticamente informativo, e é exatamente esse o problema: **não existe amostra suficiente para afirmar nada sobre a prevalência real no powerlifting brasileiro, em nenhuma direção.**

**Lista de suspensos da IPF — o cruzamento pedido.** A IPF publica um registro público de sanções:
- Página: https://www.powerlifting.sport/anti-doping/sanctions
- PDF "IPF Sanction Registry", versão 17/07/2026: https://www.powerlifting.sport/fileadmin/ipf/data/anti-doping/2026/IPF_-_Sanction_Registry_20260717.pdf

**96 atletas no registro, dos quais 3 com nacionalidade BRA.** Nações com mais sancionados: Índia 9, Ucrânia 8, Mongólia 8, Noruega 6, Polônia/Cazaquistão/Irã 5 cada.

**Cruzamento das duas listas (ABCD × IPF):** a ABCD tem 1 sancionado de levantamentos básicos; a IPF tem 3 brasileiros. Os conjuntos não são idênticos e nenhuma das duas listas se apresenta como espelho da outra. O total combinado é da ordem de **3–4 brasileiros sancionados no esporte** ao longo de todo o histórico publicado. Contra ~1.500 atletas ativos só na CBLB em 2025 (§6). **Isso não mede prevalência — mede volume de coleta.** Com 7 amostras domésticas em três anos, o número esperado de detecções domésticas é ≈0 mesmo sob prevalência alta.

**A CBLB não publica lista própria de suspensos.** Ela declara expressamente que remete às outras duas: *"as informações dos atletas suspensos por doping estão sob controle da Autoridade Brasileira de Controle de Dopagem e da IPF"* — https://www.powerlifting-ipf.com.br/paginas/informativo.php

### 2.4 Regulamento antidoping da CBLB — existe, mas está defasado

A CBLB **tem** página e documentação antidoping publicadas. O problema não é ausência — é validade.

- Página antidoping: https://www.powerlifting-ipf.com.br/paginas/antidoping.php — declara aplicar o Código Mundial Antidopagem em todas as competições nacionais e nas federações filiadas.
- **"Código CBLB" publicado = REGULAMENTO ANTI-DOPING de 2015**: https://www.powerlifting-ipf.com.br/paginas/antidoping/Codigo%20CBLB.pdf
- **Lista de substâncias proibidas em português = lista WADA de 2021**: https://www.powerlifting-ipf.com.br/paginas/antidoping/Substancias%20Proibidas%20em%20Portugues.pdf

**Por que isso importa concretamente para ele:** a Lista de Proibidos da WADA é **revisada e republicada todo ano**, com entradas que entram e saem. Um atleta que consultar a lista publicada pela sua confederação em 2026 estará lendo a lista de **2021** — cinco revisões atrasada. Para alguém natural que usa suplementos ou toma medicação prescrita, essa defasagem é um risco real e evitável.

**Recomendação operacional:** conferir substâncias sempre na fonte viva, nunca no PDF da CBLB — a lista vigente da WADA (https://www.wada-ama.org/en/prohibited-list) e o canal da ABCD (https://www.gov.br/abcd/pt-br). E, se usar qualquer medicação de uso contínuo, resolver a Autorização de Uso Terapêutico (AUT/TUE) **antes** da primeira competição, não depois.

**Não há dado público** de edital de Campeonato Brasileiro especificando coleta, nem de relatório de testagem publicado pela CBLB.

### 2.5 Comparação com a testagem da IPF internacional

A IPF, como Testing Authority própria, é o maior testador de powerlifting do mundo. Série verificada nas Tabelas 111/112:

| Ano | Amostras IPF | Taxa de AAF |
|---|---|---|
| 2022 | **744** | 3% |
| 2023 | **811** | 6% |
| 2024 | **870** | 2% |

Em 2024 são 698 urinas em competição + 69 fora de competição + sangue — ou seja, a IPF faz testagem **fora de competição**, a única modalidade de teste que realmente detecta uso em bloco de preparação.

**A ordem de grandeza:** a IPF sozinha coletou 2.425 amostras em 2022–2024. A ABCD coletou **7**, no mesmo período, no Brasil. Razão de ~350:1. Um Campeonato Mundial IPF é um ambiente com testagem real e com 2–6% de AAF. Um Campeonato Paranaense não é um ambiente de testagem.

O último relatório antidoping publicado pela própria IPF é de **2021**: **437 testes / 451 amostras** (295 em competição, 156 fora de competição), **16 AAFs**, pool de *whereabouts* de ~74 atletas de 25 países, 7 AUTs.
https://www.powerlifting.sport/fileadmin/ipf/data/anti-doping/reports/2021-IPF-Anti-Doping-Report-v2.pdf

*(Ressalva de transparência que corta para os dois lados: a IPF **não publica relatório desde 2021**, e os relatórios nacionais por região param em 2019 — https://www.powerlifting.sport/anti-doping/archives. Os números de 2022–2024 usados aqui vêm da WADA, não da IPF. A IPF testa muito mais do que qualquer NADO no esporte, mas sua própria prestação de contas está parada há quatro anos.)*

**Consequência prática, e é a mais útil de todo o documento:** a fronteira entre "testado de verdade" e "testado no papel" não é entre federações brasileiras — é entre **competir no Brasil** e **competir num evento IPF internacional**. Ambos rodam sob a mesma regra, o mesmo código e a mesma lista. Só um dos dois tem coleta, e só num deles a seleção de quem sopra é feita por terceiro independente (CCES).

---

## 3. O sinal indireto nos dados de resultado

**Fonte:** dump aberto do OpenPowerlifting, `openpowerlifting-latest.zip`, versão **2026-08-08**, 3.999.319 linhas.
URL: https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip
(`data.openpowerlifting.org` está fora do ar; o mirror GitLab acima é o endereço vigente. `openipf-latest.zip`, no mesmo diretório, traz só o subconjunto IPF.)

**Caveat de método, que muda a leitura:** a coluna `Tested` do OpenPowerlifting marca se o *meet foi realizado sob regras drug-tested*, **não** se algum atleta foi de fato testado. Todos os 67 meets da CBLB no dump aparecem como `Tested=Yes`. Cruzando com §2.1, sabemos que essa marcação, no Brasil, é uma declaração de regra, não um registro de coleta. `Tested=Yes` para meets brasileiros deve ser lido como "nominalmente testado".

### 3.1 Federações que operam no Brasil, por volume

Todos os meets realizados em território brasileiro no dump:

| Federação | Inscrições | Meets | Meets `Tested=Yes` | Parent |
|---|---|---|---|---|
| CBLB | 7.773 | 67 | **67** | IPF |
| GPC-Brazil | 3.683 | 37 | 0 | GPC |
| FESUPO | 1.681 | 19 | **19** | IPF |
| GPC | 1.206 | 5 | 0 | GPC |
| WRPF-Brazil | 914 | 17 | 0 | WRPF |
| GPA | 655 | 5 | 0 | GPA |
| WPPO | 339 | 4 | **4** | — (paralímpico) |
| IPF | 227 | 1 | **1** | IPF |
| GPA-Brazil | 94 | 1 | 0 | GPA |
| IPL | 66 | 2 | 0 | IPL |
| WABDL | 33 | 1 | **1** | — |
| WPPL-Brazil | 29 | 1 | 0 | WPPL |

**Agregado:** 10.053 inscrições (60%) em federações nominalmente testadas, 6.647 (40%) em federações abertamente untested.

### 3.2 Tested vs. untested nos totais — o teste da hipótese

Recorte: masculino, SBD (full power), melhor total por atleta (deduplicado, para não enviesar por quem compete muito), 2018 em diante, peso corporal 74,0–93,0 kg — a faixa que engloba as classes 83 e 93.

**Controle crítico:** federações untested usam *wraps* de joelho massivamente; a IPF proíbe wraps em clássico. Wraps valem dezenas de quilos no agachamento. Misturar os dois cria uma diferença falsa. Por isso os grupos abaixo estão separados por equipamento.

**GLOBAL — Raw (sem wraps):**

| Grupo | n | média | **mediana** | p90 | p99 | máx |
|---|---|---|---|---|---|---|
| Testado | 91.032 | 533,2 | **535,0** | 652,5 | 755,0 | 930,0 |
| Untested | 22.586 | 534,6 | **535,0** | 657,5 | 770,0 | 1022,5 |

**Medianas idênticas.** p90 difere em 5 kg (+0,8%). A diferença só cresce em p99 (+15 kg, +2,0%) e no recorde absoluto (+92,5 kg).

**GLOBAL — Wraps:**

| Grupo | n | média | mediana | p90 | p99 | máx |
|---|---|---|---|---|---|---|
| Testado | 6.364 | 522,7 | 525,0 | 635,0 | 727,5 | 842,5 |
| Untested | 12.132 | 553,4 | 550,0 | 696,3 | 817,5 | 997,5 |

Aqui a diferença é grande — mas boa parte dela é o próprio wrap e o perfil de quem escolhe federação untested, não uma medida de farmacologia.

**BRASIL:**

| Grupo | n | média | mediana | p90 | máx |
|---|---|---|---|---|---|
| Testado / Raw | 802 | 542,6 | 542,8 | 656,0 | 812,5 |
| Untested / Raw | 43 | 514,5 | 495,0 | 662,5 | 690,0 |
| Untested / Wraps | 340 | 552,3 | 557,5 | 705,0 | 815,0 |
| Testado / Wraps | 0 | — | — | — | — |

**Leitura honesta dos três blocos:**

1. Na faixa dele, no corpo da distribuição, **não há diferença mensurável** entre meets testados e não testados. A mediana global é 535,0 kg dos dois lados.
2. A diferença é **exclusivamente de cauda**. Acima de p99 os untested vão mais alto, e o recorde absoluto untested (1022,5 kg) supera o testado (930,0 kg) em 92,5 kg. Faz sentido: doping não move a mediana de um campo majoritariamente amador, move o teto de quem já é elite.
3. No Brasil especificamente, o campo untested raw é **pequeno demais para conclusão** (n=43) e, no que existe, é *mais fraco* que o campo CBLB, não mais forte. O untested brasileiro vive quase todo em wraps.

**Confundidores que impedem tratar isso como prova:** o pool de atletas difere (a IPF atrai a elite mundial e tem via olímpica/World Games; untested atrai força bruta recreativa e equipado); os padrões de juizamento diferem entre siglas; e — decisivo — "testado" no OpenPowerlifting significa regra, não coleta. A comparação mede **ambiente de regra**, não **status farmacológico dos indivíduos**. Ninguém tem o dado que mediria isso direito.

---

## 4. O cenário das federações no Brasil

| Sigla | O que é no Brasil | Testa? | O que um "recorde" ali significa |
|---|---|---|---|
| **CBLB** | Confederação nacional filiada à IPF. Único caminho para Mundial IPF, Sul-Americano, World Games. 67 meets, 7.773 inscrições. | Regra drug-tested WADA. **Coleta real doméstica ~0** (§2.1). | Recorde brasileiro oficial reconhecido pela IPF. É o único "recorde brasileiro" que a IPF reconhece e que conversa com ranking mundial. Regra limpa; fiscalização doméstica fraca. |
| **FESUPO** | Federação sul-americana, parent IPF. Sedia Sul-Americano e Arnold Classic Brazil no país. | Regra IPF/WADA. | Recorde sul-americano, não brasileiro. Nível bem acima do Brasileiro (mediana 620 kg em 93 no Sul-Americano 2025). |
| **GPC-Brazil / GPC** | Global Powerlifting Committee. **Maior operação não-IPF do país** — 4.889 inscrições somadas, 42 meets. https://www.gpcbrasil.com/ | **Untested — por ausência documentada.** O rulebook oficial em português da GPC tem **zero ocorrências** de "doping"/"antidoping". Nenhuma página declara "untested" explicitamente; é inferência a partir do silêncio do regulamento, não declaração da entidade. | "Recorde brasileiro GPC". Sem relação com IPF, sem reconhecimento internacional. Permite wraps e equipado. |
| **WRPF-Brazil** | World Raw Powerlifting Federation Brasil. 914 inscrições, 17 meets. https://wrpfbrasil.wixsite.com/wrpfbrasil (o domínio `wrpfbrasil.com.br` está morto) | **Tem as duas divisões — e é a única com testagem declarada em fonte primária em português.** Regulamento §1.2: *"Divisões: • Com teste antidoping • Sem teste antidoping"*. §1.8: *"10% das melhores pontuações de Wilks serão testadas imediatamente ao final da competição"*. | Depende da divisão. Um recorde na divisão **testada** da WRPF Brasil tem lastro declarado (e um protocolo de topo-10% que, no papel, é mais específico do que qualquer coisa que a CBLB publique). Não é reconhecido pela IPF. |
| **GPA / GPA-Brazil ("Powerlifting Brazil")** | Global Powerlifting Alliance / IPO. 749 inscrições. https://www.powerliftingbrasil.com.br/ | **Não** na divisão principal. A GPA mantém braços drug-free como federações *separadas* (GPA-D, IPO-D). Se o afiliado brasileiro opera divisão testada: **não há dado público.** | Recorde de sigla, sem reconhecimento IPF. |
| **IPL** | International Powerlifting League. 66 inscrições, 2 meets. Presença marginal. | **Não** nos meets brasileiros registrados. A IPL é *non-tested* por padrão; meets testados são sancionados à parte (rulebook 2025 §1.8 e Parte 12). O Brasil **não aparece** na lista de afiliados: https://powerlifting-ipl.com/country-affiliates/ | Marginal no Brasil. |
| **WPPL-Brazil** | https://wppl.info/brazil/ — 29 inscrições, 1 meet. | **Untested por ausência** — o site não tem nenhuma seção de doping. Inferência, não declaração. | Irrelevante em volume. |
| **WPPO / WABDL / WPPL-Brazil** | Nichos (para-powerlifting, bench/deadlift). | WPPO e WABDL marcados testados; WPPL não. | Fora do escopo do full power convencional. |

**Tensão que vale registrar, sem resolver:** o regulamento da WRPF Brasil prevê divisão testada com protocolo explícito (10% dos melhores Wilks testados ao fim da prova), mas **nenhum** dos 17 meets da WRPF-Brazil no dump do OpenPowerlifting está marcado como testado. Ou os meets brasileiros rodam só a divisão untested, ou a divisão testada existe no papel e não no calendário, ou a classificação do OPL está incompleta. **Não há dado público** que decida entre as três. Registrar como incerteza, não como acusação.

**Sem afiliado brasileiro verificado** (checado nas listas oficiais de cada uma): WPC/AWPC, IPL/USPA, SPF. WPA e "WPF" não têm site oficial respondendo — **não há dado público**.

**O ponto que um estreante precisa entender:** "recorde brasileiro" não é uma coisa. São pelo menos cinco listas paralelas, com regras de equipamento diferentes, padrões de profundidade diferentes e reconhecimento internacional diferente. Um número maior numa sigla untested com wraps não é comparável a um número menor na CBLB em clássico — não são a mesma prova. Só o recorde CBLB entra em ranking IPF.

---

## 5. Conclusão honesta

**A premissa dele bate em parte.**

**O que é verdade, com alta confiança — os três PDFs da WADA foram lidos diretamente, não por intermediário (§2.1):**
A fiscalização antidoping do powerlifting no Brasil é, em volume, praticamente inexistente: **1 / 0 / 6 amostras em 2022 / 2023 / 2024**, zero fora de competição nos dois últimos anos, e ~80% da competição do país acontecendo em nível estadual onde a probabilidade de coleta é indistinguível de zero. Reforçando: **a ABCD é a única autoridade brasileira que aparece na tabela mundial de Powerlifting** — não há programa de coleta da própria CBLB reportado ao ADAMS. A CBLB opera sob regra WADA, e essa regra não é acompanhada de execução doméstica mensurável. Ele **não** está se preocupando à toa quanto ao sistema.

**Reforço do lado incômodo, confiança média-alta:**
Levantamento de peso foi a modalidade com mais RAAs do Brasil em 2023 (7 de 40), e a taxa global de AAF em powerlifting é 4,2% — ~5x a média de qualquer esporte. Nas raras vezes em que se testa, encontra-se. A quase ausência de sancionados brasileiros de powerlifting reflete ausência de teste, não ausência de uso.

**O que NÃO se sustenta, com confiança média-alta (n=113 mil atletas, §3.2):**
A inferência de que ele estará competindo contra um campo inflado. Na faixa 74–93 kg raw, **a mediana de meets testados e não testados é a mesma (535,0 kg)**. O efeito aparece só acima do p99. Traduzindo para a situação dele: se o alvo for entrar no top da classe, o ambiente de testagem não muda materialmente a barreira. Se o alvo for **vencer o Brasileiro ou bater recorde nacional**, aí sim ele está disputando exatamente a região da distribuição onde a diferença existe.

**Onde o dado é fraco — e é importante dizer:**
- Não há dado público da ABCD quebrando amostras por modalidade; os números de powerlifting vêm da WADA, não da ABCD. A ABCD publica só total e contagem de modalidades.
- Não há dado público sobre coleta em competição estadual. A inferência de "≈0" é derivada do total nacional, não medida.
- `Tested=Yes` no OpenPowerlifting é regra, não coleta — a comparação de §3.2 mede ambiente normativo.
- A IPF não publica relatório antidoping desde 2021; os números 2022–2024 vêm da WADA, não dela.
- O status "untested" da GPC e da WPPL no Brasil é **inferido do silêncio dos regulamentos**, não declarado por elas. A WRPF Brasil declara divisão testada que não aparece no calendário registrado (§4).
- Não há dado público de edital de campeonato brasileiro especificando coleta, nem de relatório de testagem da CBLB.
- A comparação tested/untested é observacional, com pools de atletas diferentes. Não é um experimento controlado e ninguém tem um que seja.

**Não suavizando:** ele vai competir num esporte onde, no Brasil, ninguém está olhando. Isso é real e não tem conserto por parte dele.
**Não dramatizando:** isso não significa que o cara ao lado dele na classe 93 esteja enhanced, e os dados não dão nenhum suporte a essa leitura no meio do campo.

---

## 6. Implicação estratégica

**Onde competir.** CBLB, sem hesitação. É a única sigla no Brasil cujo resultado tem significado transferível: entra em ranking IPF, dá acesso a Sul-Americano e Mundial, e o recorde nacional é o único reconhecido internacionalmente. A fiscalização doméstica fraca é uma crítica ao sistema, não uma razão para migrar — as alternativas são *abertamente* untested, o que é estritamente pior para quem quer que o próprio resultado signifique algo.

**Calibração de expectativa — onde o total dele o coloca.**
CBLB, masculino, raw, SBD, 2024+, melhor total por atleta:

| Total | Percentil na classe 83 (n=295) | Percentil na classe 93 (n=298) |
|---|---|---|
| 550 kg | p59 | p48 |
| 600 kg | p77 | p68 |
| 650 kg | p91 | p87 |
| 700 kg | p98 | p93 |
| 750 kg | p100 | p98 |

E o nível de pódio no **Campeonato Brasileiro Open**, classe 93 raw:
- 2023 (n=14): 780,0 / 687,5 / 677,5
- 2024 (n=20): 798,5 / 740,0 / 680,0
- 2025 (n=20): 775,0 / 757,5 / 745,0

Classe 83 Open, 2025 (n=28): 710,0 / 707,5 / 692,5.

**Nacional vs. internacional.** O campo brasileiro testado **não é fraco** — a mediana CBLB está apenas 10–23 kg abaixo da mediana IPF mundial (83: 528 vs 538; 93: 552 vs 575). A diferença real está no topo:

| | CBLB p99 | IPF mundo p99 | CBLB máx | IPF mundo máx |
|---|---|---|---|---|
| 83 kg | 715 | 755 | 738 | 900 |
| 93 kg | 782 | 791 | 800 | 930 |

Top-5 do Mundial Clássico Open 2026, 93 kg: 927,5 / 900,0 / 897,5 / 897,5 / 875,0. Isso é ~125 kg acima do que venceu o Brasileiro 2025.

**O que isso significa para o plano de 12 meses:**

1. **Mirar recorde nacional é uma meta de vários anos, não de 12 meses**, e é a única meta dele onde a questão do doping é materialmente relevante — porque é exatamente na cauda que a diferença aparece. O melhor total brasileiro registrado no dump em 93 raw open é 812,5 kg.
2. **A meta realista para a primeira temporada é entrar no circuito e ranquear**, não bater recorde. Um total de 650 kg em 93 já o coloca em p87 da CBLB. 700 kg, em p93.
3. **O alvo tático correto é qualificar-se para competição internacional IPF**, não dominar o nacional. É lá que a testagem é real (744 / 811 / 870 amostras da IPF em 2022 / 2023 / 2024, com 2–6% de AAF, incluindo coleta fora de competição e seleção pelo CCES), e é lá que um resultado dele significa o que ele quer que signifique.
4. **O campo está endurecendo rápido.** Atletas distintos na CBLB por ano: 100 (2019) → 135 (2021) → 728 (2024) → **1.543 (2025)**. Crescimento de ~12x em quatro anos. O 5º lugar no Brasileiro 93 Open passou de 625 kg (2018) para 675 kg (2025). Qualquer alvo de colocação precisa ser projetado contra o campo de 2027, não o de hoje.

**Duas providências práticas que decorrem deste levantamento, e que custam pouco:**

- **Não usar o PDF de substâncias proibidas da CBLB como referência** — é a lista WADA de 2021 (§2.4). Conferir sempre na lista vigente da WADA. Para um atleta natural, o risco real não é o adversário; é tomar algo banal que entrou na lista depois de 2021.
- **Se houver medicação de uso contínuo, resolver a AUT/TUE antes da primeira competição.** Com 6 amostras/ano no país a chance de ser testado no Brasil é baixíssima — mas se o plano de 3–4 anos passa por evento IPF internacional (§6, item 3), lá a chance é real, e AUT retroativa é uma dor de cabeça evitável.

**Nota final sobre a pergunta original.** Se o objetivo dele é que o resultado *signifique* algo, o caminho não muda: CBLB, porque é a única porta para o ambiente onde a testagem é real. A fraqueza da fiscalização doméstica é um argumento para **atravessar** o circuito nacional rumo ao internacional — não para abandoná-lo, e muito menos para migrar a uma federação que nem no papel testa.

---

## Fontes

**Estatísticas de testagem**
- WADA Anti-Doping Testing Figures 2024 — https://www.wada-ama.org/sites/default/files/2025-12/2024_Anti-Doping%20Testing%20Figures%20Report_FINAL_v3.pdf
- WADA Anti-Doping Testing Figures 2023 — https://www.wada-ama.org/sites/default/files/2025-06/2023_anti_doping_testing_figures_en_0.pdf
- WADA Anti-Doping Testing Figures 2022 — https://www.wada-ama.org/sites/default/files/2024-04/2022_anti-doping_testing_figures_en.pdf

**ABCD**
- Página institucional — https://www.gov.br/esporte/pt-br/composicao/orgaos-especificos/esporte/autoridade-brasileira-de-controle-de-dopagem
- Relatórios (índice) — https://www.gov.br/abcd/pt-br/acesso-a-informacao/dados-abertos/relatorios
- Relatório de Gestão 2025 — https://www.gov.br/abcd/pt-br/acesso-a-informacao/dados-abertos/relatorios/relatorios-de-gestao-anos-anteriores/RelatriodeGestoABCD2025revisado.pdf
- Relatório de Gestão 2024 — https://www.gov.br/abcd/pt-br/acesso-a-informacao/dados-abertos/relatorios/relatorios-de-gestao-anos-anteriores/RelatrioGesto2024ABCDFinal.pdf
- Relatório de Gestão 2023 (RAAs por modalidade) — https://www.gov.br/abcd/pt-br/acesso-a-informacao/dados-abertos/relatorios/relatorios-de-gestao-anos-anteriores/RelatrioGeralABCD2023Word.pdf
- Atletas suspensos (índice) — https://www.gov.br/abcd/pt-br/coordenacoes/gestao-de-resultados/atletas-suspensos
- Lista definitiva 06/08/2026 — https://www.gov.br/abcd/pt-br/coordenacoes/gestao-de-resultados/atletas-suspensos/atletas-suspensos-em-definitivo-06-08-26.pdf
- Lista definitiva 16/10/2025 — https://www.gov.br/abcd/pt-br/coordenacoes/gestao-de-resultados/atletas-suspensos/Atletassuspensosemdefinitivo16102025.pdf
- Suspensão provisória 07/08/2026 — https://www.gov.br/abcd/pt-br/coordenacoes/gestao-de-resultados/atletas-suspensos/atletas-suspensao-provisoria-07-08-2026.pdf

**IPF**
- Membros da América do Sul (confirma CBLB) — https://www.powerlifting.sport/federation/regions/south-america
- IPF Anti-Doping Rules (página) — https://www.powerlifting.sport/anti-doping/ipf-anti-doping-rules
- IPF Anti-Doping Rules 2021, emendadas 2023 (PDF) — https://www.powerlifting.sport/fileadmin/ipf/data/anti-doping/IPF_Anti-Doping_Rules__2021__Amended_2023.pdf
- IPF Constitution & By-Laws — https://www.powerlifting.sport/fileadmin/ipf/data/about-ipf/constitution-by-laws/IPF_Con_By-Laws_2018.pdf
- IPF Technical Rulebook 2026 (seleção de testados pelo CCES) — https://www.powerlifting.sport/fileadmin/ipf/data/rules/technical-rules/english/2026_IPF_Technical_Rulebook__effective_01_March_2026__v3.pdf
- Testing — https://www.powerlifting.sport/anti-doping/testing
- Sanções (página) — https://www.powerlifting.sport/anti-doping/sanctions
- IPF Sanction Registry 17/07/2026 (96 atletas, 3 BRA) — https://www.powerlifting.sport/fileadmin/ipf/data/anti-doping/2026/IPF_-_Sanction_Registry_20260717.pdf
- IPF Anti-Doping Report 2021 (último publicado) — https://www.powerlifting.sport/fileadmin/ipf/data/anti-doping/reports/2021-IPF-Anti-Doping-Report-v2.pdf
- Arquivo de relatórios (para até 2019 por região) — https://www.powerlifting.sport/anti-doping/archives
- ITA — parceiros (IPF ausente) — https://ita.sport/partners/

**CBLB e federações brasileiras**
- CBLB (site vigente) — https://powerlifting-ipf.com.br/
- CBLB — página antidoping — https://www.powerlifting-ipf.com.br/paginas/antidoping.php
- CBLB — "Código CBLB" / Regulamento Anti-Doping 2015 — https://www.powerlifting-ipf.com.br/paginas/antidoping/Codigo%20CBLB.pdf
- CBLB — lista de substâncias proibidas em português (base WADA 2021) — https://www.powerlifting-ipf.com.br/paginas/antidoping/Substancias%20Proibidas%20em%20Portugues.pdf
- CBLB — informativo (remete suspensos a ABCD e IPF) — https://www.powerlifting-ipf.com.br/paginas/informativo.php
- CBLB — federações estaduais filiadas — https://www.powerlifting-ipf.com.br/paginas/federacoes.php
- CBLB (site Wix legado) — https://powerliftingbrazil.wixsite.com/cblb/copia-powerlifting
- FESUPO (sul-americana, IPF) — https://www.powerlifting-fesupo.com/
- FEPERJ (estadual RJ, filiada à CBLB) — https://feperj.org/
- WRPF Brasil — https://wrpfbrasil.wixsite.com/wrpfbrasil · https://www.wrpflatam.com/
- GPC Brasil — https://www.gpcbrasil.com/ · rulebook PT — https://www.worldgpc.com/index.php/downloads/category/16-rulebook?download=64:gpc-rulebook-portuguese
- GPA/IPO Brasil — https://www.powerliftingbrasil.com.br/ · https://globalpowerliftingalliance.com/gpaipo_membership.html
- WPPL Brasil — https://wppl.info/brazil/
- IPL — afiliados por país (Brasil ausente) — https://powerlifting-ipl.com/country-affiliates/
- WPC/AWPC — afiliados (Brasil ausente) — https://worldpowerliftingcongress.com/wpc-affiliates/

**Referência viva para o atleta**
- Lista de Substâncias e Métodos Proibidos da WADA (vigente) — https://www.wada-ama.org/en/prohibited-list
- ABCD — https://www.gov.br/abcd/pt-br

**Dados de resultado**
- OpenPowerlifting, dump aberto 2026-08-08 (3.999.319 linhas) — https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip
- Subconjunto IPF — https://openpowerlifting.gitlab.io/opl-csv/files/openipf-latest.zip

**Nota de verificação:** os três relatórios da WADA (2022, 2023, 2024) foram baixados e convertidos com `pdftotext -layout`; os números de powerlifting por autoridade de testagem são leitura literal das Tabelas 111/112, conferida linha a linha, e não dependem de resumo de terceiro. Os domínios `cblb.org.br`, `cblb.com.br` e `powerlifting-ipf.com.br` foram testados por requisição HTTP em 2026-08-09. As estatísticas de resultado vêm de processamento local do dump completo do OpenPowerlifting (3.999.319 linhas).

**Nota de conformidade:** `goodlift.info` não foi acessado — o robots.txt do site desautoriza o ClaudeBot nominalmente e proíbe extração. Todo o dado de resultado veio do dump aberto do OpenPowerlifting.
