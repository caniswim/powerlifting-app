# Fontes adicionais — escopo e decisão de ingestão

> Passe de **escopo**, não de coleta. Nada foi baixado além de um PDF público para medir
> tamanho e de listagens de metadados via `yt-dlp --flat-playlist`. Nenhum manifesto foi
> criado; `research/corpus/` não foi tocado.

Data da pesquisa: **9 de agosto de 2026**. Todo número abaixo foi medido nesta data, na
máquina, com `yt-dlp 2026.07.04` ou `curl` — não é memória do modelo. Onde a verificação
não fechou, o nível de confiança está escrito no próprio parágrafo.

Leia junto com `research/kb/ROSTER-CURADO.md`. Os critérios de inclusão **(a)** função
probatória, **(b)** transferência de contexto, **(c)** cobertura de lacuna do Vena e
**(d)** contraponto estruturado são os de lá; este documento não os redefine, só os
aplica. O `ROSTER-CURADO.md` hoje termina na seção 0 — ele estabeleceu a régua e parou
antes dos verbetes. Este arquivo é a continuação natural, do lado da viabilidade.

---

## 0. A régua de escala — o número que governa toda decisão abaixo

O corpus do Matt Vena, inteiro, medido no `manifest.json`:

| | |
|---|---|
| vídeos | **197** (196 citáveis, `R000`–`R196`) |
| duração total | **15,1 horas** |
| palavras transcritas | **197.203** |
| densidade | 217 palavras/min |

**Quinze horas.** É essa a grandeza contra a qual "vale ingerir tudo?" tem que ser
respondida — e é por isso que quase toda resposta abaixo é *não*. Uma única fonte
proposta aqui (Iron Culture) tem **547 horas**, ou **36× a base inteira que já existe**.
Somando tudo o que este documento propõe sem recorte: ~**12,1 milhões de palavras**,
~**61× o corpus atual**.

O custo de *download* é praticamente zero — **todas as seis fontes de vídeo têm legenda
automática em inglês (`en-orig` + `en`), testada com `yt-dlp --list-subs`**, então não há
Whisper, não há GPU, não há fatura. O custo real é a **extração de claim**: cada hora de
transcrição vira trabalho de agente lendo, atomizando e verificando `verbatim` contra o
`at`, sob `PROTOCOLO-EXTRACAO.md`. É aí que 547 horas quebram o projeto, não no `curl`.

> **Consequência de design:** o gargalo não é obter o texto, é decidir o que merece virar
> claim. Todo veredito abaixo é, na prática, um orçamento de atenção.

---

## 1. O criador do app "Evolve" — resolvido

**Resposta: Garrett Blevins.** Confiança **alta**.

### A cadeia de evidência

| elo | evidência |
|---|---|
| Qual "Evolve" | **Evolve Training App / EvolveAI**, app de treino e nutrição para powerlifting, publicado por **Skynet Coaching Inc.** (bundle `com.skynetcoaching.expertsystem`). ~21.500 usuários declarados no site. É o **app oficial exclusivo da Powerlifting America** (afiliada IPF nos EUA) |
| Quem criou | **Garrett Blevins**, CEO, o **único** nome com biografia na home do site. Descrito como autor de "a patented AI system that provides lifters with highly personalized, flexible programming" |
| Ele tem canal | **Sim** — <https://www.youtube.com/@gjmjblevins>: **354 vídeos, 41,2 horas** |
| Ele tem podcast | **Sim** — o **Evolve Podcast**, publicado no canal do app <https://www.youtube.com/@Evolvetrainingapp>: **5 episódios**, 58–88 min cada (convidados: Joe Borenstein, Ashton Rouska, Sean Noriega, Marcellus Williams, Devin Williams) |

Isso fecha a descrição do dono ("tem um podcast e canal") **nas duas pontas**, com a
mesma pessoa. Não há chute aqui: o nome veio da home do site
(<https://www.evolvetrainingapp.com/>), o canal veio de busca por nome próprio e foi
confirmado por `yt-dlp` (354 itens, conteúdo de programação de powerlifting), e o podcast
foi confirmado pela listagem do canal do app.

### Credencial competitiva (OpenPowerlifting)

<https://www.openpowerlifting.org/u/garrettblevins> — melhor total **885,5 kg** raw na
classe **105 kg** (agacho 332,5 / supino 227,5 / terra 337,5), federações **USAPL, AMP,
NAPF, IPF**, ativo de 2013 a 2025, bronze e prata no **IPF World Classic** de 2017 e 2018.

**É o ponto que mais importa para nós: USAPL/IPF é federação testada.** O Vena compete
CPU/IPF, mas o dono já registrou a ressalva de que o teste não é o eixo dele; Blevins é um
medalhista mundial que passou uma década dentro do sistema antidoping da IPF. Ele satisfaz
os critérios **(b)** e **(d)** do roster com folga. A classe 105 kg está uma faixa acima
do atleta (83/93), o que é **muito mais perto** do que os 120 kg+ do Vena.

### Candidatos alternativos (registrados para não parecerem descartados por descuido)

- **Dr. Jacob Goodin** — *Chief Scientific Officer* da EvolveAI, professor de cinesiologia
  na Point Loma Nazarene. Tem canal (<https://www.youtube.com/c/DrJacobGoodin>, **273
  vídeos / 54,6 h**) e podcast (*The Sport Science Education Podcast*, **3 episódios**).
  **Não é "o criador"** — é o cientista-chefe. E o conteúdo dele é dirigido a
  estudantes de pós em ciência do esporte, não a atleta preparando meet: dos 273 vídeos,
  126 têm menos de 10 min e boa parte é *Exercise Technique Library* de 34 segundos.
  **Corte.** Baixa transferência.
- **Zac Robinson e Josh Pelland (Data Driven Strength)** — aparecem no canal do Evolve
  explicando o **"Genesis"**, o novo motor de treino do app
  (vídeo `VgBBGbDD9ic`, 29 min). São colaboradores do motor, **não criadores do app**.
  Mas essa descoberta é relevante por outro motivo — ver a fonte `D` na seção 3.

**Se o dono quis dizer outra pessoa, a leitura mais provável é Goodin** (também tem
podcast e canal), e o desempate técnico é fácil: o canal do Blevins é sobre programação de
powerlifting e o do Goodin é sobre pedagogia de ciência do esporte. Para este atleta,
Blevins ganha.

---

## 2. Stronger by Science — veredito e uma pedra no caminho

### Quem é hoje

| | |
|---|---|
| Site | <https://www.strongerbyscience.com/> — **641 URLs** no `post-sitemap.xml` |
| Equipe atual | **Greg Nuckols** (Head of Content, M.A., 3 recordes mundiais all-time nas classes 220/242 lb) e **Lyndsey Nuckols** (Director of Communications, toca também o MacroFactor). É basicamente isso |
| **Eric Trexler saiu** | Confirmado. Entrou em 2019, saiu; a produção regular do podcast se encerrou. Ele hoje co-apresenta o **Iron Culture** — ver fonte `C` |
| Canal YouTube | <https://www.youtube.com/@strongerbyscience> — **397 vídeos, 346,8 horas** |
| Podcast | *The Stronger By Science Podcast*, **encerrado** — o vídeo mais recente do canal é literalmente `SBS Podcast Final Q&A (Episode 144)`, 102 min |

### Em que formato o conteúdo está — a pergunta que o dono fez certo

**Nos três, e a divisão é limpa.** Medido no canal:

| faixa | itens | horas | o que é |
|---|---|---|---|
| ≥ 30 min | **172** | **318,7 h** (média **111 min**) | os episódios do podcast, íntegros |
| 10–30 min | 71 | ~17 h | artigos narrados e explicações |
| < 10 min | **154** | **10,7 h** | clipes recortados dos próprios episódios — **redundância pura** |

E o texto é **enorme e denso**: `how-to-squat` sozinho tem **~24.300 palavras**;
`hypertrophy-range-fact-fiction`, ~6.200. Estimando conservadoramente 3.500 palavras por
post × 641 posts ≈ **2,2 milhões de palavras** só de artigo.

**Veredito de formato: o SBS é uma fonte de TEXTO com um podcast anexo.** É a única fonte
desta lista onde o material canônico não é falado. E isso muda tudo, porque texto escrito
já vem editado, com referência e sem "uhm" — a razão sinal/palavra é várias vezes a de uma
transcrição automática.

### A pedra: o `robots.txt` do SBS proíbe ClaudeBot por nome

```
User-agent: *
Content-Signal: search=yes, ai-train=no, use=reference
User-agent: ClaudeBot     Disallow: /
User-agent: GPTBot        Disallow: /
User-agent: CCBot         Disallow: /
User-agent: Google-Extended   Disallow: /
User-agent: Applebot-Extended Disallow: /
```

Verificado com `curl https://www.strongerbyscience.com/robots.txt` em 9/8/2026.

Isto não é ambíguo e não é boilerplate — é uma lista nominal, e **ClaudeBot está nela**.
O sinal `use=reference` diz o que é aceito: **referenciar, sim; espelhar para dentro de um
sistema de IA, não.**

**Decisão recomendada:** não fazer *crawl* em massa dos 641 artigos. Duas alternativas que
não atropelam o sinal:

1. **Citar por URL, não copiar.** Registrar os artigos-âncora no roster como referência
   externa (tier `E`, que já exige URL) e deixar a leitura acontecer sob demanda quando o
   dono perguntar. Custo zero, atrito de consulta.
2. **Ingerir o podcast pelo YouTube.** As legendas do canal são um artefato do YouTube,
   fora do escopo do `robots.txt` do site próprio. Cobre boa parte do mesmo conteúdo (o
   podcast discute os artigos), com procedência citável (`at` + `verbatim`) — que é
   exatamente o que o `SCHEMA.md` exige e o que um artigo copiado *não* daria.

Confiança **alta** no fato do `robots.txt`; **média** em que a rota (2) esteja fora do
espírito do sinal. **Decisão do dono, não minha.** Registro o conflito em vez de resolvê-lo
sozinho.

### Veredito de ingestão do SBS

**Só seleção, e pelo YouTube.** Alvo: **25–35 episódios** dos 172 longos, ~50 h.
Regra de corte na seção 5.

---

## 3. As fontes propostas

Cinco, além do Evolve e do SBS. Cada uma paga a passagem cobrindo algo que o Vena
comprovadamente não cobre.

---

### `C` — Iron Culture (Eric Helms + Eric Trexler)

<https://www.youtube.com/c/ironculturepodcast> · feed: <https://ironculture.libsyn.com/rss>

**Por que entra — é a fonte de maior transferência da lista inteira.** Eric Helms é
**bodybuilder natural profissional (PNBA, pro desde 2011)** *e* **powerlifter raw que
compete na IPF em nível internacional**. Doutorado em Strength & Conditioning com tese em
**autorregulação no powerlifting**; co-fundador do **MASS Research Review** e Chief Science
Officer do 3DMJ, que coacha exclusivamente atletas *drug-free*.

Leia de novo o perfil do atleta: natural, IPF, quer força **e** estética, 80/20. **Helms é
literalmente esse atleta, vinte anos à frente e com PhD.** Ele cobre de uma vez as lacunas
de hipertrofia-como-objetivo, nutrição de categoria de peso, perspectiva do testado, e
autorregulação — critérios (a), (b), (c) e (d), os quatro.

Trexler é PhD em fisiologia do exercício, ex-SBS, bodybuilder natural, e o especialista de
referência em **adaptação metabólica** — o tema exato de quem vai descer de 87 para 83 kg.

| medição | valor |
|---|---|
| itens no canal | **354** — dos quais **351 têm ≥ 30 min** |
| horas | **547,8 h**, média **94 min/episódio** |
| legenda `en` automática | **sim** (testado em `RaE3vf2Szbs`) |
| feed RSS | 393 episódios, **sem** `podcast:transcript` |
| formato | áudio longo, conversacional, 2–3 vozes |

**Veredito: só seleção, e a mais dura de todas.** 547 h é 36× a base atual. Ingerir tudo
seria afogar o Vena em Helms e trocar um viés por outro. Alvo: **40–60 episódios,
~65–95 h**.

**Nota de custo escondido:** 94 min de conversa a três produz ~14 mil palavras de legenda
automática com muita fala social. A densidade de claim por hora aqui é a **mais baixa** da
lista. Isso é argumento para cortar mais, não para desistir.

---

### `T` — Reactive Training Systems / Mike Tuchscherer

<https://www.youtube.com/@ReactiveTrainingSystems> · feed:
<https://rss.libsyn.com/shows/62577/destinations/245002.xml>

**Por que entra — é o contraponto metodológico (critério d) e o dono do tema "pico".**
Tuchscherer fundou a RTS em 2008 e é quem trouxe **RPE e autorregulação** para o
powerlifting ocidental; é powerlifter da **USAPL/IPF**, testado. O material dele é
sistemático a ponto de ter métrica própria (*Stress Index*), o que é raro: uma fonte que
expõe o método em vez de só exibir o resultado.

Cobre diretamente três lacunas do Vena: **pico para competição**, **gestão de fadiga
mensurada** e **decisão em dia de meet** (há episódios como *"Navigating the Chaos: Game
Day Coaching"* e *"Three Perspectives On IPF Worlds 2026"*, de julho de 2026).

| medição | valor |
|---|---|
| itens no canal | **940** |
| horas totais | **223,7 h** |
| ≥ 30 min | **150** itens = **155,5 h**, média **62 min** — os episódios do podcast |
| < 10 min | **667** itens — clipes e cortes, **ruído** |
| legenda `en` automática | **sim** (testado em `3GM4Nz_993k`) |
| feed RSS | 100 itens expostos (Libsyn trunca), dez/2021 → jul/2026, ~1h20 médio, **sem transcrição** |

**Veredito: só seleção — e ignorar o RSS.** O feed não tem transcrição e exigiria Whisper;
o **YouTube tem os mesmos episódios com legenda de graça**. Alvo: **30–40 dos 150 longos**,
~35 h. Os 667 curtos: descartar em bloco.

---

### `N` — Jeff Nippard

<https://www.youtube.com/@JeffNippard>

**Por que entra — o 20% de estética, e um caso de transferência quase perfeito.** Ficha
de competição no OpenPowerlifting (<https://www.openpowerlifting.org/u/jeffnippard>):

> **227,5 / 160 / 235 — total 615 kg**, raw, classe **74 kg**, CPU (afiliada IPF), 2013–2015.

O `baseline.md` estima o atleta em **215 / 160 / 240, total ≈ 615 kg**. **Os totais
coincidem, e o supino coincide no quilo.** Nippard fez esse total pesando **74 kg**; o
atleta pesa 87. Nenhuma outra fonte desta lista chega perto desse alinhamento — e o
contraste (mesma força absoluta, 13 kg a menos de corpo) é material de conversa por si só.

É natural, competiu em federação testada, tem BSc em bioquímica e cita estudo com
referência na tela. Cobre **hipertrofia como objetivo próprio** e **seleção de exercício**,
que é a lacuna estética do Vena. É a fonte mais próxima de "influencer" da lista — e é
por isso que ela entra **com recorte apertado e tier de menor peso**: quando Nippard e
Helms discordarem, Helms ganha.

| medição | valor |
|---|---|
| itens no canal | **486** |
| horas | **128,5 h** |
| ≥ 20 min | 70 · 7–20 min: 338 · < 7 min: **78** (Shorts, descartar) |
| legenda `en` automática | **sim** (testado em `TBrlPpviaqY`) |
| formato | vídeo solo roteirizado, ~200 palavras/min, alta densidade |

**Veredito: seleção temática apertada.** Alvo: **40–60 vídeos, ~20 h**, só o eixo
hipertrofia/seleção de exercício/técnica. Descartar o conteúdo de desafio e transformação
("How Ripped Can I Get My Brother In 100 Days?"), que é entretenimento.

---

### `D` — Data Driven Strength (Dr. Zac Robinson + Josh Pelland)

<https://www.youtube.com/@datadrivenstrength> · <https://datadrivenstrength.com/>

**Por que entra — é a função probatória pura (critério a), e tem um laço direto com o
Evolve.** Robinson tem PhD (Florida Atlantic) com tese em **individualização de desenho de
programa para força e hipertrofia**; Pelland é PhD(c) na mesma instituição. Ambos publicam
meta-análise revisada por pares sobre **proximidade da falha, volume e frequência** — os
três parâmetros que mais aparecem em qualquer discussão de programação. Eles não citam a
literatura: **eles são a literatura**.

**E foram eles que explicaram o "Genesis", o novo motor de treino do Evolve, no canal do
próprio app** (`VgBBGbDD9ic`, 29 min). Ou seja: o app que o dono já apontou é, em parte,
a operacionalização do trabalho deles. Isso amarra `G` e `D` num par que se lê melhor
junto do que separado.

| medição | valor |
|---|---|
| itens no canal | **146** |
| horas | **104,5 h** |
| ≥ 30 min | **80** = **93,4 h**, média **70 min** |
| legenda `en` automática | **sim** (testado em `1TdSWI-R5XY`) |
| `robots.txt` do site | permissivo — só `/wp-admin/`. **Sem restrição a bot de IA** |
| artigos | <https://datadrivenstrength.com/articles/> — texto acessível, sem paywall |

**Veredito: a melhor razão sinal/hora da lista — ingerir a maioria dos longos.** Alvo:
**50–65 dos 80**, ~60 h. O canal é pequeno e quase tudo é sobre programação; o filtro por
palavra-chave nos títulos casa **70 de 80**, a maior taxa medida em todas as fontes. Vale
também puxar os artigos do site (permitido) como material de tier `L` quando trouxerem
DOI.

---

### `F` — IPF, documentação normativa oficial

<https://www.powerlifting.sport/rules/codes/info/technical-rules>

**Por que entra — porque nenhuma das outras é autoridade sobre isto, e o custo do erro é
uma luz vermelha.** O atleta nunca competiu e vai à IPF em ~12 meses. Comando, profundidade
legal, largura de pegada, equipamento aprovado, pesagem: isso não é opinião de coach, é
texto normativo. Perguntar a um podcast "o que conta como profundidade?" é a pergunta certa
feita à fonte errada.

| documento | medição |
|---|---|
| **2026 IPF Technical Rulebook** (vigente **01/03/2026**, v3) | PDF baixado e medido: **45 páginas, ~20.990 palavras**. Mudanças em vermelho no próprio texto |
| **2026 IPF Technical Rulebook Changes — Explanations** | PDF separado, explica cada alteração (ex.: a barra no agacho não pode ficar abaixo do deltoide posterior) |
| **Rulebook em português** | Existe. A página lista traduções em 16 idiomas, **duas em português** — checar vigência antes de usar, as traduções têm datas de 2021 a 2026 |
| Material de árbitro | Só formulário de *Referee's Clinic*; **não há handbook de arbitragem público** |
| Licença | **Nenhuma declaração de copyright ou licença na página.** Confiança **média** de que a redistribuição interna seja aceitável; é documento normativo público de federação, mas isso não é uma licença |

**Veredito: ingerir INTEGRAL, e é a única fonte da lista onde isso é verdade.** 21 mil
palavras é **um décimo** do corpus do Vena. É barato, é fechado, é autoritativo, e é a
única coisa aqui onde "quase certo" não serve.

**Cuidado de esquema — flagrado, não resolvido.** O `SCHEMA.md` tem enumerado **fechado**
de tier: `R` (vídeo, exige `at`+`verbatim`), `E` (roster, exige URL), `L` (literatura,
exige PMID/DOI), `I`, `U`. **O rulebook não é nenhum dos cinco**: não tem timestamp, não
tem DOI, e não é "alguém do roster". Colar em `E` funciona mas apaga a diferença entre
*"um coach disse"* e *"está escrito na regra vigente"* — e essa diferença é a razão de
ingerir o documento.

> **Proposta:** criar o tier **`O`** — *documento normativo oficial*. Exige `url`,
> `versao` (data de vigência) e `secao` (o número do artigo). O checker passa a poder
> recusar uma claim de regra que não aponte para um artigo. E `O` fica **reservado como
> tier, portanto proibido como prefixo de ref.**

---

### `W` — OpenPowerlifting (opcional, e não é fonte de claim)

<https://www.openpowerlifting.org/> · dump completo em CSV, licença **CC0**.

Não é criador de conteúdo, é **dado**. Serve a uma pergunta que nenhuma fonte narrativa
responde: *"que total, nas classes 83 e 93 kg raw da IPF, corresponde de fato a um
recorde?"* — que é literalmente o objetivo declarado do atleta. Também é o que permite
calibrar quão acima do atleta cada fonte está, sem depender de bio de site.

**Veredito: adotar depois, e não neste passe.** É tabela, não claim; entra por um caminho
diferente do `PROTOCOLO-EXTRACAO.md` e merece decisão própria. Registrado aqui para não
sumir.

---

## 4. O que foi cortado, e por quê

Corte é decisão, então tem que ter motivo escrito.

| cortado | motivo |
|---|---|
| **Dr. Jacob Goodin** (CSO da EvolveAI) | Público-alvo errado: pós-graduação em ciência do esporte, não atleta em preparação. 126 dos 273 vídeos têm < 10 min e boa parte é biblioteca de técnica de 34 s |
| **Renaissance Periodization / Mike Israetel** | Israetel declara publicamente uso de esteroides. **Critério técnico, não moral**: a prescrição de volume e frequência de quem recupera com auxílio farmacológico é justamente a que menos transfere para um natural de 87 kg. É a mesma régua aplicada ao Vena, só que mais dura |
| **MASS Research Review** | Conteúdo excelente, **paywall por assinatura**. Não é ingerível. O Helms via Iron Culture entrega parte do mesmo pensamento em canal aberto |
| **powerliftingtechnique.com** | Cobre regras da IPF em texto, mas é conteúdo secundário de SEO. Tendo o rulebook original (`F`), é intermediário sem função. Bônus: o site está atrás de challenge do Cloudflare — nem o `robots.txt` responde a `curl` |
| **Canal oficial da IPF no YouTube** | É transmissão de competição: milhares de horas de plataforma com quase nenhuma prosa explicativa. Densidade de claim perto de zero |
| **Juggernaut / Chad Wesley Smith** | Boa metodologia, mas o eixo é força equipada e atleta de nível muito acima; e Nuckols já foi Chief Content Director de lá, então o pensamento chega por `S` |

---

## 5. Recorte — e por que regex de título **não** serve

Testei o recorte óbvio: filtrar título por palavra-chave
(`strength|volume|periodi|hypertroph|squat|bench|peak|rpe|program|…`). Resultado medido:

| fonte | itens longos | batem no filtro |
|---|---|---|
| Stronger by Science | 172 | 77 |
| Iron Culture | 351 | 126 |
| RTS | 150 | 61 |
| Data Driven Strength | 80 | **70** |
| Jeff Nippard (≥ 7 min) | 408 | 157 |
| Garrett Blevins (≥ 5 min) | 208 | 113 |

**E o filtro erra feio.** Estes títulos **não** casaram, e todos são de alto valor:

- `How to Powerbuild (Episode 136)` — SBS. É o tema central do atleta.
- `Is Bulking REALLY Dead? (ft. Dr Eric Helms)` — SBS.
- `Ep 377 – MRV/MAV, Diet Breaks & Refeeds` — Iron Culture.
- `Beyond Powerbuilding: Principles and Advanced Applications` — DDS.
- `TEXAS METHOD Explained`, `Layne Norton's Ph3 Explained` — Blevins.
- `Skill Acquisition with Jacob Tsypkin` — RTS.

O jargão do domínio não mora no vocabulário do filtro. **Recall de regex sobre título é
ruim e a falha é silenciosa** — exatamente o modo de falha que o `SCHEMA.md` foi escrito
para impedir.

### O recorte que eu proponho, em três estágios

**Estágio 1 — filtro duro por formato.** Mecânico, verificável, sem julgamento:

| fonte | regra | sobra |
|---|---|---|
| `S` SBS | duração ≥ 30 min (derruba os 154 clipes, que são recortes dos próprios episódios) | 172 |
| `C` Iron Culture | ≥ 30 min | 351 |
| `T` RTS | ≥ 30 min (derruba **667** curtos) | 150 |
| `D` DDS | ≥ 30 min | 80 |
| `N` Nippard | ≥ 7 min (derruba 78 Shorts) | 408 |
| `G` Blevins | ≥ 5 min (derruba 146 vlogs e clipes de série) | 208 |

**Estágio 2 — triagem da lista de títulos por agente, não por regex.** São ~1.370 títulos
somados. Um agente lê a lista **inteira de uma vez**, com o perfil do atleta e as lacunas
`G1`…`G35` em mãos, e marca *entra / fora / dúvida*. Um passe. Barato comparado a
transcrever o que não deveria ter entrado, e sem o modo de falha silencioso do regex.

**Estágio 3 — piso de recência onde o campo se moveu.** Para hipertrofia (volume,
proximidade da falha, comprimento muscular), a literatura virou depois de ~2021: piso em
**2021**. Para regra da IPF, só o **documento vigente**. Para técnica e pico, sem piso —
não envelhece do mesmo jeito.

**Alvo depois dos três estágios:**

| fonte | de | para | horas |
|---|---|---|---|
| `F` IPF | 1 doc | **1 doc** (integral) | ~21 mil palavras |
| `G` Blevins | 354 | ~100 | ~15 h |
| `D` DDS | 146 | ~55 | ~60 h |
| `T` RTS | 940 | ~35 | ~35 h |
| `S` SBS | 397 | ~30 | ~50 h |
| `N` Nippard | 486 | ~50 | ~20 h |
| `C` Iron Culture | 354 | ~50 | ~80 h |
| **total** | **2.678** | **~320** | **~260 h** |

260 h ainda é **17× o corpus do Vena**. É por isso que a seção 7 propõe fazer em ondas e
reavaliar, em vez de comprometer tudo agora.

---

## 6. Prefixos de referência

Reservado e proibido como prefixo: **`R`** (corpus Vena), **`V`** (id de claim), **`E`**,
**`L`**, **`I`**, **`U`** (tiers), e **`O`** se o tier normativo proposto na fonte `F` for
aceito.

| prefixo | fonte | faixa sugerida | tier das claims |
|---|---|---|---|
| **`S`** | Stronger by Science (Nuckols; podcast + artigos) | `S001`– | `R` (vídeo) / `E` (artigo por URL) |
| **`G`** | Garrett Blevins / Evolve (canal + Evolve Podcast) | `G001`– | `R` |
| **`C`** | Iron Culture (Helms + Trexler) | `C001`– | `R` |
| **`T`** | Reactive Training Systems / Tuchscherer | `T001`– | `R` |
| **`N`** | Jeff Nippard | `N001`– | `R` |
| **`D`** | Data Driven Strength (Robinson + Pelland) | `D001`– | `R` / `L` quando houver DOI |
| **`F`** | IPF — regulamento técnico oficial | `F001`– | **`O`** (tier novo proposto) |
| **`W`** | OpenPowerlifting (opcional, dado) | `W001`– | a decidir |

Todos os oito são inequívocos: `S`tronger, `G`arrett, iron `C`ulture, `T`uchscherer,
`N`ippard, `D`ata Driven, `F`ederação, `W`orld records. Nenhum colide com tier.

Uma coisa **quebra** se isto for adotado: o `check-claims.mjs` valida `src` contra o
manifesto do Vena e recusa o que não estiver lá. Ou o manifesto passa a ser multi-fonte,
ou passa a haver um manifesto por fonte com um índice acima. **Decisão de arquitetura,
fora deste passe** — mas ela existe e vai aparecer no primeiro `S001`.

---

## 7. Ordem de ingestão recomendada

**Primeiro: `F`, o rulebook da IPF.** Vinte e um mil palavras, um PDF, tarde de trabalho.
É a maior razão valor/custo da lista por uma margem que não é discutível: cobre a lacuna
mais consequente (comando, profundidade legal, equipamento) para alguém que **nunca
competiu**, e é a única fonte onde uma resposta aproximadamente certa vira luz vermelha em
plataforma. Também é o que força a decisão de esquema (tier `O`, manifesto multi-fonte)
enquanto ela ainda é barata de tomar — com um documento, e não com trezentos vídeos já
baixados.

**Primeiro corpus de vídeo: `G`, Garrett Blevins.** Três razões: (1) foi a fonte que o
dono apontou; (2) é a única cuja escala é *comparável* à do Vena — 354 itens contra 197,
41 h contra 15 — então serve de teste real do pipeline multi-fonte sem apostar 550 horas
nele; (3) traz a perspectiva **IPF testada** de um medalhista mundial, que é exatamente o
viés que a base de fonte única não tem.

**Depois, nesta ordem:** `D` (maior densidade de claim por hora) → `C` (maior
transferência, maior custo) → `T` (pico e dia de meet) → `N` (estética) → `S` (por último,
porque a rota de ingestão dele ainda depende da decisão do dono sobre o `robots.txt`).

---

## 8. O que este passe NÃO verificou

Dito para não ser confundido com o que foi verificado.

- **Datas de publicação por vídeo.** `--flat-playlist` não devolve `upload_date` de forma
  confiável. O piso de recência do Estágio 3 é executável, mas só na hora de baixar.
- **Densidade real de claim por hora** em qualquer fonte nova. Todas as estimativas de
  esforço acima assumem que ela se parece com a do Vena. Pode ser bem pior nos formatos
  conversacionais de 94 min.
- **Qualidade da legenda automática** além de "existe". Não li nenhuma. Áudio de podcast
  com três vozes se sobrepondo degrada a legenda de um jeito que áudio de vídeo solo não
  degrada — e `verbatim` é requisito do checker, não enfeite.
- **Vigência da tradução em português do rulebook.** A página lista duas; não abri.
- **A situação de licença do PDF da IPF.** Não há declaração na página. Confiança média.
- **Se o dono quis dizer Goodin e não Blevins.** A evidência favorece Blevins e está toda
  escrita na seção 1; a pergunta cabe numa frase e vale fazer antes de baixar 354 vídeos.
