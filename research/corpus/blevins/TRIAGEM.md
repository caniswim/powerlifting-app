# Triagem para extração — corpus `G` (Garrett Blevins)

> Gerado em 2026-08-09 a partir de `research/corpus/blevins/manifest.json`.
> **Isto não é extração.** Nenhuma claim foi emitida. É o orçamento de atenção:
> quais dos 354 vídeos merecem virar claim primeiro, e por quê.

| | |
|---|---|
| vídeos no canal | **354** (`G001`–`G354`) |
| duração total | **41,2 h** |
| transcrições obtidas | **333** · sem legenda em inglês: **21** |
| palavras transcritas | **462.205** |
| canal publica de | **2013-03-20** a **2025-06-11** |
| construído em | `builtAt: 2026-08-09` · `channelItemCount: 354` |

## Por que este canal não é "mais do mesmo"

O corpus `R` é 100 % Matt Vena: um atleta que agacha 400 kg e **não compete
testado**. Blevins compete USAPL/IPF desde 2013, é medalhista de Mundial IPF na
classe 105 kg com total de 885,5 kg, e é o criador do Evolve — o app oficial da
Powerlifting America. Ele é, ao mesmo tempo, **contraponto** (federação testada,
classe de peso muito mais perto do atleta) e **cobertura de lacuna** (pico para
competição, autorregulação, e a análise explícita de programa de terceiros, que o
Vena não faz).

O canal tem duas eras separadas por um hiato de quatro anos, e elas não valem o
mesmo:

- **2013–2018 — 329 vídeos.** Vlog de sessão quase diário (`C4W2D1`,
  `W7D3 KingRTS`), com uma minoria de vídeos didáticos longos enterrados no meio.
  Densidade de claim baixa por hora, mas os poucos longos (`G252`, `G257`,
  `G260`–`G263`, `G271`) são as peças de programação mais completas do canal
  inteiro. É também a era em que ele estava competindo na USAPL rumo ao Mundial.
- **2022–2025 — 25 vídeos.** Volta do hiato já como criador do Evolve.
  Traz a série *Professional Powerlifter Reviews* (2023–2024): ele pega um programa
  publicado (5/3/1, nSuns, Cube, Ph3, Candito, Texas Method) e disseca. Densidade
  de claim alta e, mais importante, **expõe o critério dele de julgar programa** —
  que é exatamente o que uma base de prescrição precisa e o que um vlog não dá.

### O problema de recência, dito antes de custar caro

A base resolve contradição por recência. Contra o corpus do Vena, que vai até
**2026-08-08**, o Blevins tem um problema estrutural: o vídeo mais novo dele é de
**2025-06-11**, e **93 %** do canal é de 2013–2018. Aplicada crua, a regra
de recência faz Blevins **perder quase todo empate**, e o corpus testado que ele
existe para trazer vira decoração.

Isso não é motivo para descartar a fonte — é motivo para não deixar a regra
decidir sozinha. Onde os dois discordam sobre **status testado, dose de volume
para natural, ou pico para IPF**, a credencial (medalhista IPF testado) e não a
data é que deveria pesar. Registrado aqui porque a alternativa é descobrir isso
depois, quando a contradição já estiver resolvida do jeito errado dentro de um
programa.

## O critério — explícito, e aplicado lendo título por título

O relatório de escopo (`research/kb/FONTES-ADICIONAIS.md`, seção 5) mediu que
filtro por regex de título **erra e erra em silêncio**: perdeu `How to Powerbuild`
e `TEXAS METHOD Explained`, que são centrais. Então a marca abaixo saiu de leitura
dos 354 títulos, um a um, não de padrão automático. A duração entra como sinal
secundário — um título metodológico em 1 min 30 s não tem prosa suficiente para
sustentar um verbatim de 12 caracteres com contexto — mas **nunca** como filtro
único.

**alta** — o assunto principal do vídeo é um método transferível:
programação e periodização, seleção de exercício, autorregulação e RPE, pico e
planejamento de competição, técnica ensinada de forma didática, ou algo
específico de **atleta testado**. É o que vira claim `GERAL` com procedência.

**média** — o método aparece, mas embutido: vlog de sessão cujo título nomeia um
conceito concreto (fadiga, volume, deload, forma, platô), programa dirigido a
novato (o método é explícito, o público é o errado para um intermediário de
87 kg), ou chamada de coaching aplicada a um caso. Rende claim, mas com menos
claim por minuto.

**baixa** — log de sessão puro (`CxWyDz` mais um número de PR), filmagem de
competição sem prosa, filmagem de terceiro, anúncio de canal ou oferta de
coaching, conversa de vida e fé, e clipes curtos sem fala. Despriorizado também
todo conteúdo de nutrição genérica.

**Nota sobre "reação a vídeo de terceiro".** A série *Professional Powerlifter
Reviews* **não** é reação a vídeo: é análise de um programa publicado, com o
raciocínio de avaliação à mostra. Reação de verdade — filmagem de outro atleta sem
comentário metodológico (`G311`, `G312`, `G313`, do Dan Green e do Jesse Norris) —
está em **baixa**, que é onde a instrução manda.

## Resultado

| prioridade | vídeos | horas | palavras |
|---|---|---|---|
| **alta** | **51** | 10,7 h | 121.207 |
| média | 75 | 10,4 h | 119.894 |
| baixa | 228 | 20,2 h | 221.104 |

Extrair só a faixa **alta** é 10,7 h e 121.207 palavras — cerca de
**61 %** das 197.203 palavras do corpus do Vena inteiro. É o que eu faria
primeiro, e sozinho já dobra a diversidade de fonte da base.

**alta + média** dá 126 vídeos e 241.101 palavras, acima do alvo de ~100
vídeos que o relatório de escopo estimou para esta fonte — o excedente está quase
todo em **média**, que é exatamente a faixa a cortar se o orçamento apertar.

A faixa **baixa** tem 221.104 palavras e vale muito pouco por palavra: são
228 vídeos de log de sessão. **Não vale extrair, mas vale ter baixado** — a
transcrição já existe, então se uma claim precisar de contexto de um dia
específico de treino, a evidência está lá para consultar sem nova ida à rede.

## A lista inteira

Ordenada do mais recente para o mais antigo, como o corpus do Vena. `sem legenda`
marca o vídeo que não tem transcrição — ele não é citável, qualquer que seja a
prioridade.

| ref | data | dur | prio | título | por quê |
|---|---|---|---|---|---|
| `G001` | 2025-06-11 | 23:00 | **alta** | A BRAND NEW Modernized Powerlifting Program: You Haven’t Heard of GENESIS Yet… But You Will! | programação: o motor GENESIS, que amarra Blevins ao Evolve e ao Data Driven Strength |
| `G002` | 2024-06-26 | 11:38 | **alta** | BULLMASTIFF: Alexander Bromley TOP TIER Strength Program: Old School Training | programação: análise de template de força (Bromley) |
| `G003` | 2024-05-24 | 9:40 | **alta** | 70s Powerlifter: BRUTALLY EFFECTIVE Powerlifting Program: Old School Training By Alexander Bromley | programação: análise de template de força (Bromley) |
| `G004` | 2024-05-09 | 15:11 | **alta** | You are WRONG about DELOADS and this is WHY \| The TRUTH about Programming | deload — contraponto frontal ao "never deload" do Vena [R102] |
| `G005` | 2024-02-20 | 14:19 | **alta** | Jonnie Candito 6 Week Program Review PART 2 \| Professional Powerlifter Reviews | programação: crítica de template (Candito), parte 2 |
| `G006` | 2024-02-19 | 12:17 | **alta** | PERIODIZATION: Most MISUNDERSTOOD Strength Programming Principle \| The TRUTH about Programming | periodização, o tema declarado como mais mal-entendido |
| `G007` | 2023-11-20 | 12:09 | **alta** | Jonnie Candito 6 Week Program Review \| Professional Powerlifter Reviews | programação: crítica de template (Candito) |
| `G008` | 2023-10-30 | 11:40 | **alta** | Stress Index: ULTIMATE tool for PROGRAMMING \| Is your program GOOD? \|  Analyze ANY strength program | meta-metodologia: régua declarada para julgar qualquer programa (Stress Index) |
| `G009` | 2023-10-23 | 8:56 | **alta** | PHUL by Brandon Campbell \| PowerBuilding at its FINEST! \| Professional Powerlifter Reviews | powerbuilding — o objetivo 80/20 do atleta, nomeado |
| `G010` | 2023-10-16 | 14:00 | **alta** | Layne Norton's Ph3 Explained \| The Most Scientific Template Ever? \| Professional Powerlifter Reviews | programação: template de alta intensidade (Ph3) |
| `G011` | 2023-10-09 | 14:40 | **alta** | nSuns 5/3/1 In-Depth Program Review \| Jim Wendler + Sheiko \| Progressional Powerlifter Reviews | programação: template de alto volume (nSuns) |
| `G012` | 2023-10-02 | 11:06 | **alta** | The Ultimate Cube Method Review \| 3-week X 3-waves Powerlifting Program | programação: template em ondas (Cube) |
| `G013` | 2023-09-25 | 11:28 | **alta** | PPL Push Pull Legs REVIEW \| Most Effective PowerBuilding Program? \| Professional Powerlifter Reviews | powerbuilding: divisão push/pull/legs como programa de força + estética |
| `G014` | 2023-09-18 | 8:52 | média | GreySkull LP \| The Most Effective Novice Program? \| Professional Powerlifter Reviews | programa de novato: método explícito, público errado |
| `G015` | 2023-09-11 | 18:06 | média | GZCLP Program Explained \| BEST program you NEVER heard of? \| Professional Powerlifter Reviews | programa de novato: método explícito, público errado |
| `G016` | 2023-08-21 | 12:44 | **alta** | 5/3/1 Program Explained \| The Most Popular Strength Program? \| Professional Powerlifter Reviews | programação: 5/3/1, o template mais difundido, com TM declarado |
| `G017` | 2023-08-14 | 8:04 | **alta** | TEXAS METHOD Explained \| OFFICIAL STARTING STRENGTH follow-up \| Professional Powerlifter Reviews | programação: Texas Method — título que o regex do relatório de escopo perdeu |
| `G018` | 2023-08-07 | 8:25 | média | Madcow 5x5 Program Review \| The MOST Complicated Novice Program? \| Professional Powerlifter Reviews | programa de novato: método explícito, público errado |
| `G019` | 2023-07-31 | 13:10 | média | STARTING STRENGTH Program Review \| Are You doing it WRONG? \| Professional Powerlifter Reviews | programa de novato: método explícito, público errado |
| `G020` | 2023-07-24 | 8:06 | média | StrongLifts 5x5 Review - Does it Work? \| Professional Powerlifter Reviews | programa de novato: método explícito, público errado |
| `G021` | 2023-07-13 | 11:56 | média | Squat & Deadlift Max Reboot 💪 \| EvolveAI Training Vlog 3 | vlog, mas com o app decidindo a sessão |
| `G022` | 2023-07-03 | 13:49 | média | Pushing My Bench Press with Fives \| EvolveAI Training vlog 2 | vlog, mas com o app decidindo a sessão |
| `G023` | 2023-06-20 | 7:15 | baixa | Back on Youtube after 5 Years! Smashing Bench with Dr. Goodin |  |
| `G024` | 2022-11-04 | 10:15 | **alta** | EvolveAI: Artificial Intelligence for Strength Training | o app Evolve explicado pelo criador: é a razão desta fonte existir |
| `G025` | 2022-11-03 | 0:40 | baixa | The FUTURE of Strength Training is here! EvolveAI! |  |
| `G026` | 2018-02-12 | 8:09 | **alta** | The BEST Powerlifting Program EVER! | meta-metodologia: o que ele considera um bom programa |
| `G027` | 2017-08-20 | 12:54 | média | FAS 6 | avaliação de forma de terceiros: técnica, densidade média |
| `G028` | 2017-08-05 | 10:08 | média | FAS 4 | avaliação de forma de terceiros: técnica, densidade média |
| `G029` | 2017-07-29 | 14:07 | média | Form Assessment Saturday (FAS) 3 | avaliação de forma de terceiros: técnica, densidade média |
| `G030` | 2017-07-21 | 11:13 | média | Form Assessment Saturday (FAS) 2 on a Friday? | avaliação de forma de terceiros: técnica, densidade média |
| `G031` | 2017-07-15 | 14:59 | média | Form Assessment Saturday 1 | avaliação de forma de terceiros: técnica, densidade média |
| `G032` | 2017-07-01 | 5:43 | baixa | IPF Classic Worlds 2017 - Garrett Blevins 862.5/1901 |  |
| `G033` | 2017-03-09 | 2:45 | baixa | Garrett Blevins - Arnold 2017 3 IPF World Records _(sem legenda)_ |  |
| `G034` | 2017-03-08 | 9:40 | média | Road to the Arnold weeks 3-1 | prep de competição em vlog |
| `G035` | 2017-02-12 | 10:32 | média | Arnold Prep Weeks 5 and 4 | prep de competição em vlog |
| `G036` | 2017-01-28 | 9:53 | média | Road to the Arnold 695S 460B 720D | prep de competição em vlog |
| `G037` | 2017-01-12 | 7:51 | **alta** | Road to the Arnold - Pay attention to fatigue (Deadlift Day) | fadiga dentro de prep de competição, com decisão tomada na hora |
| `G038` | 2017-01-05 | 7:25 | média | 10/9 Weeks out - Huge PRs 1Jn 2:3-6 | prep de competição em vlog |
| `G039` | 2016-12-25 | 13:54 | média | Road to the Arnold wk 11 (1 Jn 1/8-2/2) | prep de competição em vlog |
| `G040` | 2016-12-19 | 9:45 | média | Road to the Arnold (Wk 13-12) 1Jn 1/5-7 | prep de competição em vlog |
| `G041` | 2016-12-07 | 9:13 | média | Road to the Arnold Wk14-13  (1Jn 1:1-4) | prep de competição em vlog |
| `G042` | 2016-11-30 | 3:40 | baixa | BLEST Coaching Offer and Arnold Prep Update (Wk 16) |  |
| `G043` | 2016-11-24 | 8:51 | **alta** | SSB PR, Guided Programming, and Relative Intensity | intensidade relativa — parâmetro de dose que o corpus do Vena quase não nomeia |
| `G044` | 2016-11-08 | 6:05 | baixa | How To: chicken shake |  |
| `G045` | 2016-11-05 | 4:58 | **alta** | What Phase Potentiation looks like | potenciação de fase: periodização em bloco na prática |
| `G046` | 2016-10-31 | 0:42 | baixa | Week 2 SSB work |  |
| `G047` | 2016-10-25 | 4:23 | baixa | USAPL Raw Nationals 2016 |  |
| `G048` | 2016-09-26 | 10:30 | média | 675 Squat, 495 Bench, 695 Deadlift 3 weeks out | prep de competição: 3 semanas fora |
| `G049` | 2016-09-19 | 2:25 | baixa | 485 Bench (4 weeks to go!) |  |
| `G050` | 2016-09-17 | 5:01 | baixa | 660 Squat and 455x2 Bench |  |
| `G051` | 2016-09-12 | 8:55 | média | The Road to Nationals Heavy Bench and Deadlift | prep de competição em vlog |
| `G052` | 2016-09-08 | 5:10 | baixa | Road to USAPL Raw Nationals 645x1 Squat and 440x2 Bench |  |
| `G053` | 2016-09-05 | 27:15 | **alta** | Powerlifting Programming (Free Novice and Intermediate Programs) | programação completa para novato e intermediário, 27 min |
| `G054` | 2016-09-02 | 7:47 | baixa | Fun with Deadlifts |  |
| `G055` | 2016-08-29 | 9:47 | baixa | Squats, Bench, and Non-Violence? |  |
| `G056` | 2016-08-25 | 13:35 | média | PRs, "Free program" info, and workout progression | progressão de treino nomeada no título |
| `G057` | 2016-08-21 | 16:46 | **alta** | PEDs, Novice program, Squat form, and BB ramblings - USAPL Nationals W3D4 | PEDs — perspectiva de atleta testado, a lacuna central do corpus atual |
| `G058` | 2016-08-19 | 12:15 | média | Free Novice Program? Training Update (W3D3) | programa de novato + estado de treino |
| `G059` | 2016-08-18 | 8:57 | média | USAPL Raw Nationals Prep Update (Wk 2 of 11) | prep de competição em vlog |
| `G060` | 2016-07-22 | 5:59 | baixa | Garrett Blevins 1895@231 California State Games 2016 |  |
| `G061` | 2016-07-01 | 7:23 | baixa | Guided Programming Announcement |  |
| `G062` | 2016-06-30 | 9:26 | baixa | Big Lifts and Big Announcement! |  |
| `G063` | 2016-05-14 | 11:19 | baixa | W8-9 and Channel Update |  |
| `G064` | 2016-05-04 | 8:09 | média | Getting Specific - Week 7 | especificidade: a virada para o específico, nomeada |
| `G065` | 2016-04-25 | 14:13 | baixa | Massive HB PR - Week 6 Day 1 |  |
| `G066` | 2016-04-18 | 9:37 | **alta** | Making up days and Sumo Form Comparison | técnica: comparação de forma no sumo |
| `G067` | 2016-04-16 | 5:52 | média | Hook grip PR! Training around schedules | treinar em torno da agenda: restrição real do atleta |
| `G068` | 2016-04-10 | 10:33 | baixa | "Hello Grind! Nice to see you again." Week 4 |  |
| `G069` | 2016-04-04 | 8:04 | baixa | IG Announcement! Heavy Squat, Bench and Deadlift |  |
| `G070` | 2016-04-02 | 10:45 | média | Rebuilding my deadlift - DIY Deadlift jack 545x6 | reconstrução de terra depois de queda |
| `G071` | 2016-03-30 | 10:45 | baixa | I need your Help! Please watch, also some lifting |  |
| `G072` | 2016-03-25 | 6:44 | baixa | Getting back to it ! |  |
| `G073` | 2016-03-20 | 6:23 | baixa | More vlogs? Home Gym Time! |  |
| `G074` | 2016-03-15 | 4:56 | baixa | "Once more unto the breach" ADUP W1D1 |  |
| `G075` | 2016-03-12 | 6:54 | baixa | Training Update and BLEST Coaching |  |
| `G076` | 2016-03-01 | 6:40 | baixa | 837.5@110KG Spartan Raw Open 2016 Garrett Blevins |  |
| `G077` | 2016-02-09 | 1:49 | baixa | MASSIVE ALL TIME SQUAT PR! |  |
| `G078` | 2016-02-02 | 0:27 | baixa | 695@8 Squat 485@9 Bench _(sem legenda)_ |  |
| `G079` | 2016-01-30 | 14:05 | média | BCR Guided Programming | programação guiada, mas com viés de venda |
| `G080` | 2016-01-26 | 4:38 | baixa | My Best Squat EVER! |  |
| `G081` | 2016-01-24 | 4:48 | média | Pause Deadlift: The lift everyone loves to hate | seleção de exercício: terra com pausa |
| `G082` | 2016-01-21 | 6:46 | baixa | Coaching Announcement and Easing Back in 585 Squat, 655 Sumo |  |
| `G083` | 2016-01-19 | 3:08 | média | The Return of the Sumo! Recovering from Injury | retorno ao sumo depois de lesão |
| `G084` | 2016-01-10 | 13:14 | média | C2W4-C3W1 Injury, Volume, and Ethics | volume e lesão dentro de vlog |
| `G085` | 2015-12-28 | 10:05 | **alta** | Autoregulation C2W3 | autorregulação — o eixo metodológico dele |
| `G086` | 2015-12-02 | 14:58 | baixa | More Crazy PRs! C2W1 |  |
| `G087` | 2015-11-28 | 8:00 | baixa | Crazy Progress: PRs on all 3 lifts C1W5 |  |
| `G088` | 2015-11-24 | 9:35 | baixa | Massive DL PR C1W4-5 |  |
| `G089` | 2015-11-20 | 5:54 | baixa | 500lb Bench Attempt C1W4 |  |
| `G090` | 2015-11-15 | 13:50 | baixa | The Grind is here C1W3 |  |
| `G091` | 2015-11-08 | 16:39 | baixa | Easier and tougher at the same time C1W2 |  |
| `G092` | 2015-11-03 | 6:50 | média | Adapting to Volume C1W1D3-4 | adaptação a volume |
| `G093` | 2015-10-29 | 9:08 | média | Turn the volume to 11 C1W1D2 BLEST | volume alto: decisão de dose |
| `G094` | 2015-10-27 | 7:38 | baixa | Lifetime Bench PR! Starting over again |  |
| `G095` | 2015-10-19 | 7:11 | baixa | 835@105KG USAPL Raw Nationals 2015 - Garrett Blevins |  |
| `G096` | 2015-10-05 | 6:46 | média | 2 Weeks out from Nationals | pico: duas semanas fora |
| `G097` | 2015-09-22 | 4:43 | baixa | The Strongest I have ever been?? Fast 625 squats! C3W10D1 |  |
| `G098` | 2015-09-19 | 4:42 | baixa | Crushing a 455 Bench C3W9D3 |  |
| `G099` | 2015-09-17 | 6:00 | baixa | 605 Squat C3W9D1 |  |
| `G100` | 2015-09-13 | 12:52 | **alta** | Building the Optimal Program | programação: construir o programa do zero |
| `G101` | 2015-09-13 | 9:28 | média | Coaching Call #2 | chamada de coaching: raciocínio aplicado a caso |
| `G102` | 2015-09-12 | 9:06 | baixa | 445x2 Bench C3W8D2-3 |  |
| `G103` | 2015-09-09 | 6:42 | baixa | 590x2 Squat C3W8D1 |  |
| `G104` | 2015-09-07 | 15:11 | média | A Lifetime of Gains | trajetória de longo prazo |
| `G105` | 2015-09-05 | 7:21 | baixa | 425x2 Bench Press  C3W7D3 |  |
| `G106` | 2015-09-05 | 12:09 | média | Coaching Call #1 | chamada de coaching: raciocínio aplicado a caso |
| `G107` | 2015-09-02 | 5:47 | baixa | 585x2 Squat "It is starting to get heavy" C3W7D1 |  |
| `G108` | 2015-08-31 | 12:58 | média | FInal Week of Strength Block C3W6 | fim de bloco de força: transição de fase |
| `G109` | 2015-08-29 | 15:53 | baixa | Online Coaching with BLEST |  |
| `G110` | 2015-08-28 | 5:34 | **alta** | My Bench Press Tips | técnica de supino, didático |
| `G111` | 2015-08-24 | 12:43 | baixa | Upcoming Custom Program Announcement 540x5 SQ 390x5 BN C3W5D2 |  |
| `G112` | 2015-08-20 | 18:00 | baixa | My Best Squat Session Ever C3W4D3-W5D1 |  |
| `G113` | 2015-08-17 | 10:42 | baixa | Gaining Momentum C3W3D1 |  |
| `G114` | 2015-08-10 | 9:00 | baixa | Back home and back at it C3W2D3 |  |
| `G115` | 2015-08-06 | 5:03 | baixa | Mammoth Strength Bench Day C3W2D2 |  |
| `G116` | 2015-08-05 | 8:05 | baixa | Vacation Training Crossfit Bishop and Theological Question C3W2D1 |  |
| `G117` | 2015-07-23 | 5:43 | média | Bench day and how to program vacations C3W1D2 | programar em torno de viagem |
| `G118` | 2015-07-22 | 4:49 | baixa | 485x6 Squat "Beginning again" C3W1D1 |  |
| `G119` | 2015-07-21 | 8:03 | média | Don't push it? C2W6D2 | autorregulação: quando não empurrar |
| `G120` | 2015-07-15 | 5:50 | **alta** | How I Deload C2W6D1 | deload: o protocolo dele, explícito |
| `G121` | 2015-07-10 | 2:36 | baixa | Reset Button 565x4 Squat C2W5D2 |  |
| `G122` | 2015-07-09 | 9:50 | **alta** | Maximum Recoverable Volume W5D3 W6D1 TSA King | MRV — volume recuperável máximo, parâmetro-chave para natural |
| `G123` | 2015-07-04 | 6:58 | baixa | Dealing with failure C2W5D2 TSA King |  |
| `G124` | 2015-07-01 | 14:22 | baixa | Overcoming trials W4D3 and W5D1 KingTSA |  |
| `G125` | 2015-06-29 | 13:21 | média | Intensity Begins C2W4D1-2 | início do bloco de intensidade |
| `G126` | 2015-06-27 | 9:41 | baixa | 485x6 Pause Squat Final Volume DayC2W3D3 |  |
| `G127` | 2015-06-21 | 9:40 | baixa | 545x5 Squat TSA C2W3D2 |  |
| `G128` | 2015-06-17 | 9:34 | baixa | 30 lb Incline PR TSA King C2W3D1 |  |
| `G129` | 2015-06-14 | 6:45 | média | Building the Base TSA King C2W2D3 | construção de base |
| `G130` | 2015-06-12 | 9:55 | baixa | 475x8 Volume Squats TSA King C2W2D2 |  |
| `G131` | 2015-06-10 | 12:04 | **alta** | Sumo form explanation - Deadlift Strength Day 1 TSA King C2W2D1 | técnica: explicação de forma no sumo |
| `G132` | 2015-06-09 | 15:47 | média | Warmup and I Hate Pause Squats TSA C2W1D3 | aquecimento + seleção de exercício (agacho com pausa) |
| `G133` | 2015-06-05 | 8:52 | baixa | Squating for dayzzz TSA King C2W1D2 |  |
| `G134` | 2015-06-02 | 11:16 | baixa | Deadlift Day TSA King C2W1D1 |  |
| `G135` | 2015-05-31 | 4:43 | média | TSA program overview | visão geral do programa TSA |
| `G136` | 2015-05-26 | 10:33 | baixa | Boss of Nor Cal Meet 1790@231 |  |
| `G137` | 2015-05-16 | 5:43 | baixa | Final heavy day 705x1 Deadlift C1W14D2-3 TSA |  |
| `G138` | 2015-05-12 | 5:11 | média | 655x2 SQ 460x2 BN Peaking C1W13-14 TSA | pico em execução |
| `G139` | 2015-05-08 | 5:34 | média | Peaking Day 2 TSA C1W13D2 | pico em execução |
| `G140` | 2015-05-07 | 5:56 | média | 610x3 SQ and 435x3 BN Peaking Begins! TSA C1W13D1 | pico em execução |
| `G141` | 2015-05-04 | 4:24 | baixa | 445x4 Bench PR Last Intensity Block Day TSA C1W12D3 |  |
| `G142` | 2015-05-04 | 10:32 | **alta** | How I warm up | aquecimento: protocolo próprio |
| `G143` | 2015-05-01 | 3:31 | média | Getting ready to compete C1W12D2 | preparação imediata para competir |
| `G144` | 2015-04-29 | 2:54 | média | The Valley of Fatigue C1W12D1 | fadiga: "o vale da fadiga", conceito nomeado |
| `G145` | 2015-04-27 | 4:22 | **alta** | Programming does not need to be too complex C1W11D3 TSA | meta-metodologia: complexidade de programa não é virtude |
| `G146` | 2015-04-25 | 4:05 | **alta** | Why getting weaker is a good thing sometimes C1W11D2 TSA | fadiga e supercompensação: por que enfraquecer é parte do plano |
| `G147` | 2015-04-22 | 6:19 | média | 465x3 T&G Bench and Form Discussion (25 lb PR) C1W11D1 TSA | técnica de supino discutida dentro da sessão |
| `G148` | 2015-04-20 | 6:57 | média | Bracing, lagging lifts, and CN unboxing C1W10D3 TSA | bracing e lifts atrasados |
| `G149` | 2015-04-18 | 4:12 | média | 455x4 Spoto Press (50 lb PR) Who is in control? TSA C1W10D2 | seleção de exercício: Spoto press |
| `G150` | 2015-04-15 | 3:42 | baixa | 615x3 SQ 435x5 BN (20 Lb PR) 705x1 DL / Training while depressed or unmotivated TSA C1W10D1 |  |
| `G151` | 2015-04-12 | 6:53 | média | Bench PRs and "How to break plateaus" TSA C1W9D2-3 | quebra de platô |
| `G152` | 2015-04-11 | 4:08 | baixa | 605x3 Squat and summary of what Christianity means to me TSA C1W9D1 |  |
| `G153` | 2015-04-08 | 5:59 | baixa | Two Bench PRs (405x6 Comp and 385x6 CG) TSA C1W8D3 |  |
| `G154` | 2015-04-06 | 3:04 | baixa | Do you have to prove yourself? TSA C1W8D2 |  |
| `G155` | 2015-04-04 | 5:04 | baixa | "The Grind" is catching up to me C1W8D1 TSA |  |
| `G156` | 2015-03-30 | 6:31 | baixa | Remember that 545 pause squat I talked about??? C1W7D3 |  |
| `G157` | 2015-03-29 | 3:00 | média | Long Term Gains C1W7D2 TSA | ganho de longo prazo |
| `G158` | 2015-03-26 | 2:39 | baixa | Sumo Deadlifts return 635x2x5 TSA C1W7D1 |  |
| `G159` | 2015-03-23 | 4:50 | baixa | 405x5 Bench Gains TSA C1W6D3 |  |
| `G160` | 2015-03-21 | 3:10 | baixa | BENCHIN' LIKE GREASED LIGHTNIN' TSA C1W6D2 |  |
| `G161` | 2015-03-18 | 8:23 | média | 435x6 Floor press, Speed Day, Pause Day, and training while sick (TSA C1W5D2-W6D1) | treinar doente + dia de velocidade e pausa |
| `G162` | 2015-03-14 | 7:27 | média | Phase 2 Begins! 575x4 Squat TSA C1W5D1 | virada de fase |
| `G163` | 2015-03-09 | 5:00 | baixa | 495x6 Pause Squat - Stage 1 complete TSA C1W4D3 |  |
| `G164` | 2015-03-07 | 5:54 | **alta** | TSA C1W4D2 Fatigue Debt | "dívida de fadiga" — conceito nomeado e operacionalizado |
| `G165` | 2015-03-04 | 6:56 | média | TSA C1W3D3-W4D1 "Hurt back and learning lessons" | lesão nas costas e lição extraída |
| `G166` | 2015-02-27 | 5:13 | baixa | TSA C1W3D2 Well that was brutal . . . |  |
| `G167` | 2015-02-24 | 7:05 | baixa | TSA C1W3D1 High Volume Day |  |
| `G168` | 2015-02-23 | 8:04 | baixa | TSA C1W2D3 Medium Volume Day |  |
| `G169` | 2015-02-21 | 3:10 | baixa | TSA C1W2D2 "Light" Volume Day |  |
| `G170` | 2015-02-18 | 7:57 | baixa | TSA C1W2D1 CRAZY VOLUME DAY |  |
| `G171` | 2015-02-16 | 5:22 | baixa | Starting a new program (TSA C1W1D2) |  |
| `G172` | 2015-02-07 | 3:24 | baixa | 1900 @ 231 raw w/o wraps Mock Meet 2-6-2015 |  |
| `G173` | 2015-02-01 | 2:45 | baixa | 445x3 and 465x1 Bench: The Good, the Bad and the Ugly C5W11D4 (KPR) |  |
| `G174` | 2015-01-31 | 1:35 | baixa | 635x3x2 Squat (15 PR) C5W11D3 (KPR) |  |
| `G175` | 2015-01-28 | 4:29 | média | Disappointment Gains - Deadlift peaking issues | problemas de pico no terra |
| `G176` | 2015-01-26 | 18:55 | **alta** | Texas Method: Training as an Intermediate | programação para intermediário (Texas Method), 19 min |
| `G177` | 2015-01-24 | 2:46 | média | Peaking the Bench 425x3x4 C5W8D4 | pico do supino |
| `G178` | 2015-01-23 | 3:10 | baixa | 605x3x4 Squat Peaking Day C5W9D3 |  |
| `G179` | 2015-01-22 | 3:15 | baixa | TSA Sponsorship Announcement |  |
| `G180` | 2015-01-20 | 4:09 | baixa | Hell Week Round 2 "Deadlift Destruction" C5W9D1 KPR |  |
| `G181` | 2015-01-19 | 1:36 | baixa | C5W9D4 "Crush or be Crushed" Heavy Bench Day (KPR) |  |
| `G182` | 2015-01-17 | 14:21 | média | Starting Strength: How to start your Strength Journey: Novice Training PPST#11 | programa de novato (Starting Strength), série didática |
| `G183` | 2015-01-16 | 1:49 | baixa | Heavy Doubles on Squats = more PRs C5W9D3 (KPR) |  |
| `G184` | 2015-01-10 | 1:20 | baixa | 540x8 Squat rep PR C5W8D3 |  |
| `G185` | 2015-01-09 | 13:30 | **alta** | PPST#10 What to do when planning a program (Ch. 5) | planejamento de programa, capítulo dedicado |
| `G186` | 2015-01-08 | 2:31 | baixa | 605 HB Squat PR (C5W8D2 KPR) |  |
| `G187` | 2015-01-06 | 2:42 | baixa | What the??? 50 lb Pause Squat PR! 545x3 C5W7D3 |  |
| `G188` | 2015-01-03 | 18:20 | **alta** | How I became an elite Powerlifter: Training History, Sports, Lifting  Programs, and Injuries) | transferência de contexto: histórico completo, programas usados e lesões |
| `G189` | 2015-01-02 | 3:44 | baixa | C5W7D2 500x5 High Bar (40 lb PR . . . I think) |  |
| `G190` | 2014-12-31 | 2:58 | baixa | 705x3 Deadlift PR C5W7D1 KingRTS Predator |  |
| `G191` | 2014-12-30 | 7:15 | média | PPST#9 Power vs Strength (Ch. 3) | teoria: potência versus força |
| `G192` | 2014-12-29 | 9:10 | **alta** | DUP video update: Is Sarcoplasmic hypertrophy real (ft. Brotastic)??? | hipertrofia (sarcoplasmática) + DUP: o eixo estético com leitura crítica |
| `G193` | 2014-12-27 | 2:14 | baixa | 485 bench attempt agian... C5W6D3 KingRTS Predator |  |
| `G194` | 2014-12-24 | 9:00 | **alta** | Bench Max attempt and life talk: Why drugs are not the answer | "por que drogas não são a resposta" — atleta testado declarando a posição |
| `G195` | 2014-12-22 | 8:42 | média | PPST #8 My eating habits and "BASIC" Recovery Guidelines Ch. 2 | diretrizes de recuperação (a parte de nutrição é genérica) |
| `G196` | 2014-12-18 | 8:40 | **alta** | PPST #7 Work Tolerance, Overtraining, and some personal history Ch. 2 | tolerância ao trabalho e overtraining — teto de volume do natural |
| `G197` | 2014-12-16 | 3:09 | média | PPST #6 Supercompensation and the Microcycle (part 2) | supercompensação e microciclo |
| `G198` | 2014-12-14 | 4:52 | média | PPST #5 Supercompensation and the Microcycle Ch. 2 (part 1) | supercompensação e microciclo |
| `G199` | 2014-12-12 | 3:45 | média | PPST #4 Stress and Gainz!!! (Ch. 1) | estresse e adaptação |
| `G200` | 2014-12-10 | 9:31 | **alta** | PPST #3 Novice, Intermediate and Advanced lifters (Ch. 1) | classificação novato/intermediário/avançado: define a dose de tudo |
| `G201` | 2014-12-09 | 7:51 | baixa | 815 block pull and "Who are YOU?" life talk. |  |
| `G202` | 2014-12-07 | 3:36 | média | PPST #2 Training Theory: Adaptation and Strength (Ch1) | adaptação e força: teoria de base |
| `G203` | 2014-12-05 | 5:58 | média | Practical Programming for Strength Training Chapter 1 Section 1: Intro "Exercise vs. Training" | exercício versus treino: a distinção fundacional |
| `G204` | 2014-12-05 | 5:40 | baixa | C5W3D3 605x3 squat |  |
| `G205` | 2014-12-02 | 2:33 | baixa | C5W2-3 725x4 Block Pull |  |
| `G206` | 2014-11-27 | 9:36 | **alta** | KingRTSPredator Overview and Meet Planning | planejamento de competição + visão geral do programa |
| `G207` | 2014-11-25 | 4:18 | baixa | C5W2-3 KPR What do you want to learn about??? Also, 56K deadlift volume in one workout |  |
| `G208` | 2014-11-22 | 2:10 | baixa | Channel Update |  |
| `G209` | 2014-11-19 | 5:20 | baixa | C5W2D1-2 KPR Back in the Saddle Again. |  |
| `G210` | 2014-11-16 | 3:02 | baixa | C5W1D3 KPR 415x5 Bench PR |  |
| `G211` | 2014-11-14 | 11:10 | **alta** | Peaking for Powerlifting | pico para competição — lacuna do Vena e necessidade do atleta em 12 meses |
| `G212` | 2014-11-09 | 6:06 | baixa | 1873@242 Raw USAPL Garrett Blevins (Unofficial US record raw w/o wraps) |  |
| `G213` | 2014-11-04 | 4:34 | baixa | Best Lifts of KingRTS #4 |  |
| `G214` | 2014-11-01 | 3:03 | baixa | C4W8D3 440x3 Bench Press (35 LB PR) KingRTS |  |
| `G215` | 2014-10-30 | 3:05 | baixa | C4W8D2 680x3 Deadlift (45lb PR) and 485x2 Floor Press (25 lb PR) |  |
| `G216` | 2014-10-28 | 3:16 | baixa | C4W8D1 620x3x2 (35lb SQUAT PR) KingRTS |  |
| `G217` | 2014-10-26 | 4:30 | baixa | C4W7D3 635x3x4 Dedlift King RTS |  |
| `G218` | 2014-10-24 | 3:23 | baixa | C4W7D2 405x3x4 Bench Press KingRTS |  |
| `G219` | 2014-10-23 | 4:25 | baixa | C4W7D1 King RTS (AKA Hell Week) 585x3x4 Squat and 425x4 1" off the chest Bench PR |  |
| `G220` | 2014-10-20 | 3:15 | baixa | C4W6D3 King RTS 655x3 Block Pulls |  |
| `G221` | 2014-10-17 | 2:42 | baixa | C4W6D2 King RTS Beastin' it Beardless: 3 Bench PRs in a day |  |
| `G222` | 2014-10-15 | 3:23 | **alta** | C4W6D1 520x8x2 & "Natty Confessional" | "Natty Confessional" — declaração explícita de status testado |
| `G223` | 2014-10-14 | 3:35 | baixa | 500lb Floor Press (25lb PR) C4W5D3 KingRTS |  |
| `G224` | 2014-10-12 | 5:59 | baixa | C4W5D2 KingRTS 570x2 Pause Squat PR |  |
| `G225` | 2014-10-09 | 5:41 | **alta** | Advanced Powerlifting Programming - Daily Undulating Periodization | periodização ondulatória diária, avançada |
| `G226` | 2014-10-06 | 6:14 | baixa | C4W4D2-3 King-RTS PRs while sick? 455x6 Pause Squat, 675x5 Block Pull, and 425x5 Floor Press |  |
| `G227` | 2014-09-30 | 3:21 | baixa | C4W4D1 KingRTS GoInG CrAzY!!! Reppin' 505 on sqwat |  |
| `G228` | 2014-09-28 | 7:16 | baixa | C4W3D2-3 King RTS |  |
| `G229` | 2014-09-24 | 2:52 | baixa | C4W3D1 680 squat PR! |  |
| `G230` | 2014-09-21 | 4:57 | baixa | C4W2D3 King-RTS (60LB rep PR!)705x3 block pull |  |
| `G231` | 2014-09-20 | 3:51 | baixa | C4W2D2 King-RTS |  |
| `G232` | 2014-09-18 | 4:45 | média | C4W2D1 King-RTS Hypertrophy rep ranges | faixas de repetição para hipertrofia |
| `G233` | 2014-09-15 | 3:02 | baixa | C4W1D3 King-RTS |  |
| `G234` | 2014-09-09 | 6:31 | baixa | C4W1D1 PR LAND! 670 Raw squat w/o wraps and 485 T&G Bench |  |
| `G235` | 2014-09-06 | 1:46 | baixa | C3W6D3 Cube Predator 465 BENCH LIFETIME PR |  |
| `G236` | 2014-09-04 | 4:46 | baixa | C3W6D2 Cube Predator |  |
| `G237` | 2014-09-01 | 7:53 | baixa | C3W4-5 Cube Predator |  |
| `G238` | 2014-08-15 | 7:12 | baixa | C3W2.4-3.3 King-Predator |  |
| `G239` | 2014-08-10 | 5:20 | baixa | C3W2D3 King Predator |  |
| `G240` | 2014-08-03 | 3:33 | baixa | C3W1D4 King Predator |  |
| `G241` | 2014-08-01 | 4:23 | baixa | C3W1D3 King-Predator |  |
| `G242` | 2014-08-01 | 7:25 | média | Cube Predator Bench Program by Brandon Lilly | programa de supino de terceiro, explicado |
| `G243` | 2014-07-31 | 4:14 | baixa | C3W1D2 KingRTS-Predator |  |
| `G244` | 2014-07-30 | 8:02 | baixa | C3W1D1 KingRTS |  |
| `G245` | 2014-07-29 | 8:11 | baixa | USAPL Raw Nationals 2014 - Garrett Blevins 1719@105kg |  |
| `G246` | 2014-07-14 | 3:11 | baixa | Best lifts for the KingRTS 2 _(sem legenda)_ |  |
| `G247` | 2014-07-11 | 2:51 | baixa | W7D3 KingRTS (2) 615 squat, 405x3 bench |  |
| `G248` | 2014-07-08 | 2:39 | média | W7D1 KingRTS (2) Over-reaching | overreaching nomeado |
| `G249` | 2014-07-05 | 4:53 | baixa | W6D4 KingRTS (2) 495x4 Pause Squat |  |
| `G250` | 2014-07-04 | 4:41 | baixa | W7D3 KingRTS (2) 475 Floor press |  |
| `G251` | 2014-07-01 | 3:27 | baixa | W6D1 KingRTS (2) 610 squat, 435 bench |  |
| `G252` | 2014-06-28 | 25:28 | **alta** | Powerlifitng Program Part 6 - Exercise Frequency and Variation | frequência e variação de exercício, 25 min |
| `G253` | 2014-06-28 | 3:43 | baixa | W5D4 KingRTS (2) |  |
| `G254` | 2014-06-27 | 3:50 | baixa | W5D3 King RTS (2) 560 HB Squat |  |
| `G255` | 2014-06-25 | 5:26 | baixa | W5D1 KingRTS (2) 765 Block Pull (2") PR |  |
| `G256` | 2014-06-23 | 3:20 | baixa | W4D4 King RTS (2) |  |
| `G257` | 2014-06-22 | 32:33 | **alta** | POWERLIFTING PROGRAM PART 5 - Using Excel and a free downloadable program | montagem de programa em planilha + programa baixável, 33 min |
| `G258` | 2014-06-20 | 4:53 | baixa | W4D3 KingRTS (2) |  |
| `G259` | 2014-06-18 | 8:50 | baixa | W4D1 KingRTS (2) Sumo, Floor Press, and 19" arms?? |  |
| `G260` | 2014-06-17 | 21:56 | **alta** | Powerlifting Program Part 4 - Exercise Selection (breaking through plateaus) | seleção de exercício e quebra de platô, 22 min |
| `G261` | 2014-06-17 | 18:45 | **alta** | Powerlifting Program Part 3 - Long term planning (Macro-cycle thinking) | planejamento de macrociclo, 19 min |
| `G262` | 2014-06-17 | 12:37 | **alta** | Powerlifting Program Part 2 - Setting up a 12 week cycle | montagem de ciclo de 12 semanas |
| `G263` | 2014-06-17 | 14:49 | **alta** | Powerlifting Program Part 1 - (Modified) Prilepin's Chart | carta de Prilepin modificada: a tabela de dose por intensidade |
| `G264` | 2014-06-15 | 4:45 | baixa | W3D4 KingRTS (2) |  |
| `G265` | 2014-06-13 | 5:35 | baixa | W3D3 KingRTS (2) |  |
| `G266` | 2014-06-11 | 0:16 | baixa | 470 Bench Press (Touch and Go) |  |
| `G267` | 2014-06-11 | 9:14 | baixa | W3D1-2 KingRTS (2) 470 touch and go bench |  |
| `G268` | 2014-06-09 | 3:53 | baixa | W2D4 KingRTS (2) |  |
| `G269` | 2014-06-07 | 4:16 | baixa | W2D3 King-RTS (2) |  |
| `G270` | 2014-06-03 | 8:44 | baixa | W2D1 King-RTS (2) |  |
| `G271` | 2014-06-02 | 33:40 | **alta** | Kingpin-RTS program explanation | explicação integral de um programa próprio, 34 min — o mais longo do canal |
| `G272` | 2014-05-30 | 5:50 | baixa | KING-RTS (2) W1D1-3 |  |
| `G273` | 2014-05-20 | 6:20 | baixa | 1845 @ 105 KG Raw w/o wraps Garrett Blevins (Mock-Gym Meet Kingpin-RTS) |  |
| `G274` | 2014-05-13 | 3:37 | baixa | W7D3-W8D1 KINGPIN RTS 475X3 SS BENCH |  |
| `G275` | 2014-05-08 | 2:37 | baixa | W7D2 Kingpin-RTS 600 Squat and 440 Bench |  |
| `G276` | 2014-05-06 | 1:35 | baixa | W7D1 Kingpin-RTS 405x6 Floor Press PR |  |
| `G277` | 2014-05-05 | 3:17 | baixa | W6D3 Kingpin-RTS |  |
| `G278` | 2014-05-03 | 3:43 | baixa | W6D2 Kingpin-RTS 385x3 CG Bench PR |  |
| `G279` | 2014-04-30 | 4:03 | baixa | W6D1 Kingpin-RTS 725x1 Block Pull |  |
| `G280` | 2014-04-28 | 3:46 | baixa | W5D3 Kingpin-RTS 545x2 Pause Squat |  |
| `G281` | 2014-04-23 | 2:36 | baixa | W5D2 Kingpin-RTS 365x2 bench |  |
| `G282` | 2014-04-23 | 3:57 | baixa | W5D1 Kingpin-RTS 645x3 Block Pull PR |  |
| `G283` | 2014-04-20 | 4:05 | média | W4D3 Kingpin-RTS Depth Check | checagem de profundidade — regra da IPF na prática |
| `G284` | 2014-04-18 | 2:45 | baixa | W4D2 Kingpin-RTS |  |
| `G285` | 2014-04-15 | 2:18 | baixa | W4D1 Kingpin-RTS 580x3 block pull |  |
| `G286` | 2014-04-12 | 3:10 | média | W3D3 Kingpin-RTS Slight Pec Injury | lesão de peitoral: manejo |
| `G287` | 2014-04-09 | 4:35 | média | W3D2 Kingpin-RTS New Squat form | mudança de forma no agacho |
| `G288` | 2014-04-08 | 4:38 | baixa | W3D1 Kingpin-RTS 625x3 BlockPull |  |
| `G289` | 2014-04-07 | 4:09 | baixa | W2D3 Kingpin-RTS |  |
| `G290` | 2014-04-02 | 5:53 | baixa | W2D2 Kingpin-RTS 380x3 Close Grip |  |
| `G291` | 2014-04-01 | 4:35 | baixa | W2D1 Kingpin-RTS 435x3 FloorPress PR |  |
| `G292` | 2014-03-29 | 5:14 | baixa | W1D3 Kingpin-RTS |  |
| `G293` | 2014-03-27 | 5:43 | baixa | W1D2 Kingpin-RTS |  |
| `G294` | 2014-03-25 | 3:18 | baixa | W1D1 KINGPIN-RTS |  |
| `G295` | 2014-03-24 | 8:05 | baixa | W0D0 KING-RTS |  |
| `G296` | 2014-03-18 | 4:48 | baixa | 1800 @ 105KG total raw w/o wraps Mock Gym Meet (Cube Kingpin) |  |
| `G297` | 2014-03-12 | 3:51 | baixa | W8D2 Cube Kingpin-RTS 585x3 and 435x2 |  |
| `G298` | 2014-03-11 | 5:45 | baixa | W8D1 Cube Kingpin-RTS |  |
| `G299` | 2014-03-08 | 3:51 | baixa | W7D3 Cube Kingpin-RTS |  |
| `G300` | 2014-03-07 | 3:18 | baixa | W7D2 Cube Kingpin |  |
| `G301` | 2014-03-04 | 2:53 | baixa | W7D1 Cube Kingpin 590x6 |  |
| `G302` | 2014-03-01 | 4:57 | baixa | W6D3 Cube Kingpin 1- Feelings and Belief |  |
| `G303` | 2014-02-26 | 3:02 | baixa | W6D2 Cube Kingpin-Learning from Failure |  |
| `G304` | 2014-02-26 | 1:50 | baixa | 2-25-2014 Josh Deadlift _(sem legenda)_ |  |
| `G305` | 2014-02-25 | 5:40 | baixa | W6D1 Cube Kingpin - Accountability |  |
| `G306` | 2014-02-22 | 5:38 | baixa | W5D3 Cube Kingpin |  |
| `G307` | 2014-02-19 | 5:44 | baixa | W5D1-2 Cube Kingpin |  |
| `G308` | 2014-02-15 | 6:02 | baixa | W4D3 Cube Kingpin - Expectations |  |
| `G309` | 2014-02-12 | 5:37 | baixa | W4D2 Cube Kingpin - Principle 3 |  |
| `G310` | 2014-02-11 | 4:15 | baixa | W4D1 Cube Kingpin - Principle 2 |  |
| `G311` | 2014-02-09 | 6:19 | baixa | Dan Green 2100@220 lbs / 952.5@100 kg RUM 7 NEW WORLD RECORD-All Lifts [HD] _(sem legenda)_ |  |
| `G312` | 2014-02-08 | 4:44 | baixa | Jesse Norris 1895@198 lbs/ 860@90 kg RUM 7 Raw w/o wraps- All Lifts _(sem legenda)_ |  |
| `G313` | 2014-02-08 | 8:54 | baixa | Dan Green 2100@220 lbs / 952.5@100 kg NEW RAW WORLD RECORD w/o wraps RUM7- ALL LIFTS _(sem legenda)_ |  |
| `G314` | 2014-02-08 | 5:19 | baixa | W3D3 Cube Kingpin |  |
| `G315` | 2014-02-06 | 6:49 | baixa | W3D1-2 Cube Kingpin |  |
| `G316` | 2014-01-31 | 5:42 | baixa | Cube Kingpin W2D3 |  |
| `G317` | 2014-01-28 | 5:59 | baixa | Cube Kingpin W2D1-2 |  |
| `G318` | 2014-01-24 | 7:33 | baixa | Cube Kingpin W1D3 - Principle 1 |  |
| `G319` | 2014-01-21 | 4:26 | baixa | Cube Kingpin W1D2 |  |
| `G320` | 2014-01-20 | 4:12 | baixa | CUBE KINGPIN W1D1 |  |
| `G321` | 2014-01-15 | 8:25 | baixa | 1735 total @105KG CUBE WEEK 10 (Mock Gym Meet) |  |
| `G322` | 2014-01-12 | 3:17 | baixa | Top lifts from my first cycle of the CUBE _(sem legenda)_ |  |
| `G323` | 2014-01-10 | 3:34 | baixa | W8D3 Cube Kingpin |  |
| `G324` | 2014-01-08 | 4:09 | baixa | W8D2 Cube Kingpin "Slow and Steady" |  |
| `G325` | 2014-01-08 | 6:03 | baixa | W8D1 CUBE KINGPIN |  |
| `G326` | 2014-01-05 | 0:26 | baixa | 460x1 Raw Bench _(sem legenda)_ |  |
| `G327` | 2014-01-05 | 5:02 | baixa | W7D3-460 paused bench "Keep your eyes forward" |  |
| `G328` | 2014-01-03 | 5:12 | baixa | W7D2.2 CUBE-KINGPIN |  |
| `G329` | 2013-12-31 | 2:33 | baixa | W7D2 "Press On" |  |
| `G330` | 2013-12-30 | 5:35 | baixa | W7D1 "Press on undaunted" |  |
| `G331` | 2013-12-29 | 7:43 | baixa | W6D2-3 "Focus on what is important" |  |
| `G332` | 2013-12-24 | 5:03 | baixa | W5D3-W6D1 |  |
| `G333` | 2013-12-19 | 14:51 | baixa | Week 4-5a CUBE RTS workouts |  |
| `G334` | 2013-12-10 | 6:01 | baixa | W4D1 CUBE RTS HYBRID "Remember the little things" |  |
| `G335` | 2013-12-10 | 3:38 | baixa | W3D2 CUBE RTS hybrid "We don't have to prove ourselves" |  |
| `G336` | 2013-12-03 | 3:43 | baixa | W3D1 (CUBE-RTS hybrid) "Go for it!" |  |
| `G337` | 2013-11-30 | 7:33 | baixa | W2D3 (CUBE-RTS hybrid ) "being thankful for the journey" |  |
| `G338` | 2013-11-26 | 4:25 | baixa | W2 D1 (CUBE-RTS hybrid) |  |
| `G339` | 2013-11-23 | 4:46 | baixa | W1D3 Assistance Day |  |
| `G340` | 2013-11-03 | 3:34 | baixa | Garrett Blevins 11-2-2013 USAPL 1646@220 (Michelle's footage) _(sem legenda)_ |  |
| `G341` | 2013-10-21 | 1:09 | baixa | Garrett Blevins 545x2 (last squat before USAPL Nov. 2, 2013) _(sem legenda)_ |  |
| `G342` | 2013-09-03 | 4:30 | média | 585x1 squat  unbersense review Garrett Blevins (220 class) | análise de vídeo do próprio agacho |
| `G343` | 2013-07-28 | 4:11 | baixa | Garrett Blevins USAPL 7-13-2013 front view _(sem legenda)_ |  |
| `G344` | 2013-07-28 | 0:42 | baixa | Garrett Blevins Deadlift 655x1 _(sem legenda)_ |  |
| `G345` | 2013-07-16 | 2:12 | baixa | USAPL Garrett Blevins  7-13-2013 1559 total _(sem legenda)_ |  |
| `G346` | 2013-06-17 | 1:09 | baixa | 6-17-2013 500x3 squat depth check |  |
| `G347` | 2013-05-17 | 0:22 | baixa | Garrett Blevins 545 floor press reverse green band _(sem legenda)_ |  |
| `G348` | 2013-05-17 | 0:21 | baixa | Garrett Blevins 525 floor press reverse band 5-17-2013 _(sem legenda)_ |  |
| `G349` | 2013-04-28 | 0:31 | baixa | 505x2 3-22-2013 _(sem legenda)_ |  |
| `G350` | 2013-04-23 | 2:43 | média | Garrett Blevins 435 bench, max effort 4-22-2013 with commentary on ubersense | análise de vídeo do próprio supino, com comentário |
| `G351` | 2013-04-09 | 0:17 | baixa | Bench 4-8-2013 425x1 _(sem legenda)_ |  |
| `G352` | 2013-03-27 | 0:25 | baixa | Bench Press 390x2 and 395x3 3-26-2013 _(sem legenda)_ |  |
| `G353` | 2013-03-21 | 0:31 | baixa | Squat 495x3 and 495 x4 3-19-2013 _(sem legenda)_ |  |
| `G354` | 2013-03-20 | 0:17 | baixa | bench press 380x3 3-20-2013 _(sem legenda)_ |  |

## Sem legenda em inglês (21)

Sem transcrição não há `verbatim`, e sem `verbatim` o `check-claims.mjs` recusa a
claim. Estes ficam fora da extração até alguém decidir pagar Whisper por eles:

- `G033` 2:45 — Garrett Blevins - Arnold 2017 3 IPF World Records
- `G078` 0:27 — 695@8 Squat 485@9 Bench
- `G246` 3:11 — Best lifts for the KingRTS 2
- `G304` 1:50 — 2-25-2014 Josh Deadlift
- `G311` 6:19 — Dan Green 2100@220 lbs / 952.5@100 kg RUM 7 NEW WORLD RECORD-All Lifts [HD]
- `G312` 4:44 — Jesse Norris 1895@198 lbs/ 860@90 kg RUM 7 Raw w/o wraps- All Lifts
- `G313` 8:54 — Dan Green 2100@220 lbs / 952.5@100 kg NEW RAW WORLD RECORD w/o wraps RUM7- ALL LIFTS
- `G322` 3:17 — Top lifts from my first cycle of the CUBE
- `G326` 0:26 — 460x1 Raw Bench
- `G340` 3:34 — Garrett Blevins 11-2-2013 USAPL 1646@220 (Michelle's footage)
- `G341` 1:09 — Garrett Blevins 545x2 (last squat before USAPL Nov. 2, 2013)
- `G343` 4:11 — Garrett Blevins USAPL 7-13-2013 front view
- `G344` 0:42 — Garrett Blevins Deadlift 655x1
- `G345` 2:12 — USAPL Garrett Blevins  7-13-2013 1559 total
- `G347` 0:22 — Garrett Blevins 545 floor press reverse green band
- `G348` 0:21 — Garrett Blevins 525 floor press reverse band 5-17-2013
- `G349` 0:31 — 505x2 3-22-2013
- `G351` 0:17 — Bench 4-8-2013 425x1
- `G352` 0:25 — Bench Press 390x2 and 395x3 3-26-2013
- `G353` 0:31 — Squat 495x3 and 495 x4 3-19-2013
- `G354` 0:17 — bench press 380x3 3-20-2013
