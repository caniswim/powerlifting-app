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

A entidade brasileira filiada à IPF é a **Confederação Brasileira de Levantamentos Básicos (CBLB)**.

Sobre a confusão de domínios levantada:
- `powerlifting-ipf.com.br` — **está no ar** (HTTP 200, verificado 2026-08-09) e retorna como identidade "Confederação Brasileira de Levantamentos Básicos". É o domínio vigente.
- `cblb.org.br` — **não resolve** (sem resposta DNS/HTTP).
- `cblb.com.br` — **redireciona (301) para `cblbh.com.br`**, que é a **Confederação Brasileira de Luta de Braço e Halterofilismo** — luta de braço, entidade *diferente*, sem relação com powerlifting IPF. É uma colisão de sigla, e é a origem provável da confusão.
- `powerliftingbrazil.wixsite.com/cblb` — site legado da CBLB, ainda acessível, com páginas de HISTÓRIA e FEDERAÇÕES.
  https://powerliftingbrazil.wixsite.com/cblb/copia-powerlifting
- No OpenPowerlifting, todos os 7.773 registros da federação `CBLB` têm `ParentFederation = IPF` e `Sanctioned = Yes` — confirmação independente do vínculo IPF.

> **Nota de confiabilidade:** a CBLB não publica, em domínio próprio de fácil acesso, um regulamento antidoping, um edital de campeonato citando coleta, nem um relatório de testagem. Ver §2.4.

### 1.2 O que a filiação à IPF obriga

A IPF é signatária do Código Mundial Antidoping. A consequência formal para uma filiada nacional é padrão em federação signatária:

1. Adotar regras antidoping conformes ao Código Mundial e à Lista de Substâncias Proibidas da WADA.
2. Reconhecer sanções impostas por qualquer outro signatário (uma suspensão em qualquer federação WADA vale na IPF, e vice-versa).
3. Submeter atletas de nível internacional a controle em e fora de competição.
4. Reportar resultados via ADAMS.

**O ponto que importa:** essas obrigações são de *reconhecimento e conformidade normativa*. Nenhuma delas garante volume de coleta doméstica. É exatamente aí que a norma e a realidade se separam no Brasil — a CBLB pode estar formalmente em conformidade e, ao mesmo tempo, ter ~0 amostras coletadas por ano em seus campeonatos. Uma coisa não contradiz a outra.

### 1.3 Vínculo com a ABCD

A **ABCD (Autoridade Brasileira de Controle de Dopagem)** é a Organização Nacional Antidopagem (NADO) do Brasil, criada em 2011, reconhecida pela WADA como autoridade principal para coleta de amostras, gestão de resultados e julgamento em âmbito nacional.
https://www.gov.br/esporte/pt-br/composicao/orgaos-especificos/esporte/autoridade-brasileira-de-controle-de-dopagem

Toda modalidade sob entidade nacional de administração do desporto está, em tese, sob jurisdição da ABCD. Powerlifting incluído. A questão não é jurisdição — é execução.

---

## 2. O que de fato acontece, em número

### 2.1 Amostras de Powerlifting no Brasil — o número central

Fonte: WADA *Anti-Doping Testing Figures*, tabela "AIMS Sport — Powerlifting", quebrada por Testing Authority.

| Ano | Amostras de Powerlifting pela ABCD | Total mundial Powerlifting | Total geral ABCD (todas modalidades) |
|---|---|---|---|
| 2022 | **1** (1 urina, fora de competição) | 3.119 | 4.384 |
| 2023 | **0** (ABCD não aparece na tabela) | 3.712 (155 AAF, 4,2%) | 4.318 |
| 2024 | **6** (6 urina, em competição), 1 AAF | 3.853 | 4.880 |

- 2024: https://www.wada-ama.org/sites/default/files/2025-12/2024_Anti-Doping%20Testing%20Figures%20Report_FINAL_v3.pdf
- 2023: https://www.wada-ama.org/sites/default/files/2025-06/2023_anti_doping_testing_figures_en_0.pdf
- 2022: https://www.wada-ama.org/sites/default/files/2024-04/2022_anti-doping_testing_figures_en.pdf

**Sete amostras em três anos.** Contra 4.638 testes da ABCD só em 2025, distribuídos em 91 modalidades.

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

**Contraponto importante — e é o achado mais desconfortável do levantamento:** no Relatório de Gestão ABCD 2023, **"Levantamento de Peso" foi a modalidade com MAIS resultados analíticos adversos do Brasil naquele ano: 7 casos, de 40 RAAs totais.**
https://www.gov.br/abcd/pt-br/acesso-a-informacao/dados-abertos/relatorios/relatorios-de-gestao-anos-anteriores/RelatrioGeralABCD2023Word.pdf

Isto é: quando se testa levantamento de peso no Brasil, acha-se muito. O RAA global de Powerlifting em 2023 foi **4,2% (155 em 3.712)**, contra 0,9% do total geral da ABCD — ou seja, quase 5x a taxa média de qualquer esporte. A raridade dos casos brasileiros de powerlifting na lista de sancionados **não é evidência de campo limpo; é evidência de campo não testado**. Um caso publicado com 6 amostras coletadas não é uma taxa baixa — é uma taxa de 17%.

**Lista de suspensos da IPF:** a IPF publica lista de sancionados. Nesta rodada não consegui fixar a URL canônica e a contagem de brasileiros com confiança suficiente para publicar número — `goodlift.info`, onde parte desse conteúdo vive, desautoriza crawl por robots.txt e não foi acessado. **Tratar como lacuna.** A conclusão deste documento não depende dessa contagem.

### 2.4 Regulamento antidoping da CBLB

**Não há dado público** de regulamento antidoping próprio, edital de Campeonato Brasileiro citando coleta, ou relatório de testagem publicado pela CBLB em domínio acessível. A ausência não prova que não exista internamente; prova que não é verificável por um atleta antes de se inscrever.

### 2.5 Comparação com a testagem da IPF internacional

A IPF, como Testing Authority, coletou **811 amostras de Powerlifting em 2023, com 6% de AAF** — sendo o maior testador da modalidade no mundo. Atrás dela: NADA/Alemanha 464, Noruega 230.
(mesmo PDF WADA 2023)

**A ordem de grandeza:** a IPF sozinha, em eventos internacionais, coleta em um ano ~135x o que a ABCD coletou em powerlifting em três anos somados. Um Campeonato Mundial IPF é um ambiente com testagem real. Um Campeonato Paranaense não é.

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
| **GPC-Brazil / GPC** | Global Powerlifting Committee. **Maior operação untested do país** — 4.889 inscrições somadas, 42 meets. | **Não. Untested por desenho.** | "Recorde brasileiro GPC". Sem relação com IPF, sem reconhecimento internacional olímpico. Permite wraps e equipado. |
| **WRPF-Brazil** | World Raw Powerlifting Federation. 914 inscrições, 17 meets. | **Não.** (A WRPF tem divisões tested em alguns países; no Brasil o dump não registra nenhum meet testado.) | "Recorde WRPF Brasil". Circuito de força bruta, wraps liberados. |
| **GPA / GPA-Brazil** | Global Powerlifting Alliance. 749 inscrições. | **Não.** | Idem — recorde de sigla. |
| **IPL** | International Powerlifting League. 66 inscrições, 2 meets. Presença marginal. | **Não** nos meets brasileiros registrados. | Marginal no Brasil. |
| **WPPO / WABDL / WPPL-Brazil** | Nichos (para-powerlifting, bench/deadlift). | WPPO e WABDL marcados testados; WPPL não. | Fora do escopo do full power convencional. |

**O ponto que um estreante precisa entender:** "recorde brasileiro" não é uma coisa. São pelo menos cinco listas paralelas, com regras de equipamento diferentes, padrões de profundidade diferentes e reconhecimento internacional diferente. Um número maior numa sigla untested com wraps não é comparável a um número menor na CBLB em clássico — não são a mesma prova. Só o recorde CBLB entra em ranking IPF.

---

## 5. Conclusão honesta

**A premissa dele bate em parte.**

**O que é verdade, com alta confiança (dado primário WADA/ABCD, §2.1):**
A fiscalização antidoping do powerlifting no Brasil é, em volume, praticamente inexistente: **1 / 0 / 6 amostras em 2022 / 2023 / 2024**, zero fora de competição nos dois últimos anos, e ~80% da competição do país acontecendo em nível estadual onde a probabilidade de coleta é indistinguível de zero. A CBLB opera sob regra WADA, e essa regra não é acompanhada de execução doméstica mensurável. Ele **não** está se preocupando à toa quanto ao sistema.

**Reforço do lado incômodo, confiança média-alta:**
Levantamento de peso foi a modalidade com mais RAAs do Brasil em 2023 (7 de 40), e a taxa global de AAF em powerlifting é 4,2% — ~5x a média de qualquer esporte. Nas raras vezes em que se testa, encontra-se. A quase ausência de sancionados brasileiros de powerlifting reflete ausência de teste, não ausência de uso.

**O que NÃO se sustenta, com confiança média-alta (n=113 mil atletas, §3.2):**
A inferência de que ele estará competindo contra um campo inflado. Na faixa 74–93 kg raw, **a mediana de meets testados e não testados é a mesma (535,0 kg)**. O efeito aparece só acima do p99. Traduzindo para a situação dele: se o alvo for entrar no top da classe, o ambiente de testagem não muda materialmente a barreira. Se o alvo for **vencer o Brasileiro ou bater recorde nacional**, aí sim ele está disputando exatamente a região da distribuição onde a diferença existe.

**Onde o dado é fraco — e é importante dizer:**
- Não há dado público da ABCD quebrando amostras por modalidade; os números de powerlifting vêm da WADA, não da ABCD. A ABCD publica só total e contagem de modalidades.
- Não há dado público sobre coleta em competição estadual. A inferência de "≈0" é derivada do total nacional, não medida.
- `Tested=Yes` no OpenPowerlifting é regra, não coleta — a comparação de §3.2 mede ambiente normativo.
- Não fixei a contagem de brasileiros na lista de suspensos da IPF (§2.3). Lacuna assumida.
- Não há dado público de regulamento ou edital antidoping da CBLB.
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
3. **O alvo tático correto é qualificar-se para competição internacional IPF**, não dominar o nacional. É lá que a testagem é real (811 amostras/ano pela IPF, 6% de AAF), e é lá que um resultado dele significa o que ele quer que signifique.
4. **O campo está endurecendo rápido.** Atletas distintos na CBLB por ano: 100 (2019) → 135 (2021) → 728 (2024) → **1.543 (2025)**. Crescimento de ~12x em quatro anos. O 5º lugar no Brasileiro 93 Open passou de 625 kg (2018) para 675 kg (2025). Qualquer alvo de colocação precisa ser projetado contra o campo de 2027, não o de hoje.

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

**Federação brasileira**
- https://powerlifting-ipf.com.br/
- https://powerliftingbrazil.wixsite.com/cblb/copia-powerlifting

**Dados de resultado**
- OpenPowerlifting, dump aberto 2026-08-08 (3.999.319 linhas) — https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip
- Subconjunto IPF — https://openpowerlifting.gitlab.io/opl-csv/files/openipf-latest.zip

**Nota de conformidade:** `goodlift.info` não foi acessado — o robots.txt do site desautoriza o ClaudeBot nominalmente e proíbe extração. Todo o dado de resultado veio do dump aberto do OpenPowerlifting.
