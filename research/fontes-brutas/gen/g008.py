from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["meta-metodologia","programacao"],
  claim="O tema do vídeo é como avaliar um programa de treino.",
  verbatim="what I wanted to talk about today is how do you assess a program"))

A(dict(at="01:16", scope="GERAL", modo="prescricao", topic=["progressao","programacao","meta-metodologia"],
  claim="A primeira coisa a olhar num programa é a estrutura: ele não pode violar o princípio da sobrecarga progressiva.",
  verbatim="the first thing that you should look at is structure do not violate the principle of progressive overload"))

A(dict(at="01:16", scope="GERAL", modo="mecanismo", topic=["progressao","volume","intensidade"],
  claim="Você precisa estar se sobrecarregando de alguma forma ao longo do programa, ou vai destreinar e ficar mais fraco.",
  verbatim="you have to be overloading yourself in some way shape or form as you go through the program or you're going to detrain and get weaker"))

A(dict(at="01:32", scope="GERAL", modo="prescricao", topic=["deload","programacao","periodizacao"],
  claim="Isso não significa não ter deloads ou períodos fáceis, mas precisa haver uma estrutura que organize esses períodos apropriadamente.",
  verbatim="that doesn't mean you don't have D loads or easy periods but there needs to be a structure in place that organizes those properly"))

A(dict(at="01:32", scope="GERAL", modo="prescricao", topic=["selecao-exercicio","programacao"],
  claim="Um bom programa também precisa ter os exercícios apropriados nos momentos apropriados.",
  verbatim="you also need to have appropriate exercises at the appropriate times"))

A(dict(at="01:47", scope="GERAL", modo="prescricao", topic=["selecao-exercicio","programacao","erro-comum"],
  claim="Se o bloco de treino tem 15 ou 18 semanas sem nenhuma mudança de exercício, um alarme deve soar.",
  verbatim="if you look at your training block and all the exercises are the same and it's like 15 weeks 18 weeks and it's no change in exercises a little warning Bell should go off",
  params=[P("duracao_exemplo_a",15,"semanas","semanas"),P("duracao_exemplo_b",18,"semanas","semanas")],
  conflicts=["V061-19"]))

A(dict(at="01:47", scope="GERAL", modo="mecanismo", topic=["selecao-exercicio","progressao","erro-comum"],
  claim="Depois de um período prolongado com um único grupo de exercícios você começa a estagnar e perde a novidade, e isso não leva ao melhor resultado.",
  verbatim="because after an extended period of time with a single exercise group you're probably going to start to get stale you're missing out on that novelty and it's not going to lead to the best results",
  conflicts=["V061-19"]))

A(dict(at="02:02", scope="GERAL", modo="prescricao", topic=["selecao-exercicio","programacao"],
  claim="Se o programa não dá conselho nem estrutura para trocar exercícios, isso é um problema.",
  verbatim="if your program has no advice for that or if there's no structure for changing exercises kind of a problem"))

A(dict(at="02:17", scope="GERAL", modo="prescricao", topic=["periodizacao","volume","intensidade"],
  claim="A estrutura geral do macrociclo precisa existir e fazer sentido, com volume e intensidade organizados ao longo dele.",
  verbatim="the overall macrocycle structure needs to be in place it needs to make sense there needs to be volume and intensity"))

A(dict(at="02:32", scope="GERAL", modo="fato", topic=["meta-metodologia","periodizacao","series-reps"],
  claim="Mike Tuchscherer questiona a premissa de que sempre se deve baixar as repetições e subir a intensidade relativa ao longo do macrociclo.",
  verbatim="Mike T questions some of the normal we're always going to lower the Reps as we go through the macro cycle"))

A(dict(at="02:47", scope="GERAL", modo="prescricao", topic=["mentalidade","programacao","meta-metodologia"],
  claim="Você deve olhar a estrutura geral do programa e se certificar de que acredita no processo.",
  verbatim="but you should look at the overall structure and make sure that you believe in the process"))

A(dict(at="03:02", scope="GERAL", modo="mecanismo", topic=["mentalidade","programacao"],
  claim="Se você ataca um programa com confiança e coloca o trabalho, tem resultados melhores do que se entrar dividido e sem se importar.",
  verbatim="if you confidently attack a program and put the work in you're going to have better results than if you go in there and you don't really know and you're just torn in all these different directions"))

A(dict(at="03:17", scope="GERAL", modo="prescricao", topic=["acessorios","programacao","meta-metodologia"],
  claim="Verifique se quem montou o programa prestou atenção aos detalhes, inclusive se o trabalho acessório foi jogado ali sem critério.",
  verbatim="make sure that whoever made it paid attention to the details if they're just slapping accessory work in there or there's no advice on how to do it"))

A(dict(at="03:17", scope="GERAL", modo="prescricao", topic=["acessorios","selecao-exercicio"],
  claim="Tem que haver uma razão para o número de exercícios de isolamento no fim do treino: por que 4 e não 2, ou 1.",
  verbatim="do these four isolation exercises at the end of the at the end of the workout why why four why not two why not one there should be a reason for this",
  params=[P("exercicios_exemplo",4,"exercícios","contagem"),P("alternativa_a",2,"exercícios","contagem"),P("alternativa_b",1,"exercícios","contagem")]))

A(dict(at="03:32", scope="GERAL", modo="fato", topic=["acessorios","periodizacao"],
  claim="Bromley tem razões declaradas para o trabalho acessório dos programas dele, com progressão própria, e Ed Coan levava o acessório a sério e o periodizava.",
  verbatim="he has reasons for why the accessory work is what the accessory work is and there's a progression to it and it's taken seriously"))

A(dict(at="03:47", scope="GERAL", modo="prescricao", topic=["acessorios","meta-metodologia"],
  claim="Se não há atenção ao detalhe do trabalho acessório, vale questionar quanta atenção foi dada ao resto da estrutura.",
  verbatim="if there's no attention to the details of of accessory work you might want to question well how much attention was paid to the rest of the structure"))

A(dict(at="04:03", scope="GERAL", modo="fato", topic=["volume","meta-metodologia"],
  claim="Volume é quanto trabalho você faz, e pode ser contado por séries e repetições, por repetições totais de trabalho ou por tonelagem.",
  verbatim="you need volume if you don't know that's just basically how much work you're doing sometimes that's by like sets and Reps sometimes it's by total working rep sometimes it's by tonnage"))

A(dict(at="04:18", scope="GERAL", modo="fato", topic=["intensidade","meta-metodologia"],
  claim="Intensidade é o quanto o peso na barra é pesado como percentual do seu 1RM.",
  verbatim="intensity is how heavy the weight is on the bar as a percentage of your one rep max"))

A(dict(at="04:33", scope="GERAL", modo="fato", topic=["volume","intensidade","periodizacao"],
  claim="No programa do Bromley volume e intensidade sobem juntos no ciclo base e isso se inverte no ciclo de pico, quando o volume começa a cair e a intensidade continua subindo, que é a maneira clássica de fazer.",
  verbatim="where both volume and intensity are increasing in the base cycle and then that's flipped where volume starts coming down while intensity continues to increase in the peaking cycle That's a classic way of doing it"))

A(dict(at="05:04", scope="GERAL", modo="prescricao", topic=["volume","intensidade","erro-comum"],
  claim="Se o programa é uma reta de volume e intensidade crescendo juntos o tempo todo, vá fazer outra coisa: isso não vai funcionar e você vai falhar.",
  verbatim="if you've got just a straight shot of increasing volume and intensity throughout the entire program go do something else that's not going to work it's going to grind you into a hole and you are going to fail"))

A(dict(at="05:04", scope="GERAL", modo="prescricao", topic=["erro-comum","volume","lesao"],
  claim="Não entre num programa que tenta produzir resultados incríveis só jogando cada vez mais estresse em cima de você: isso é perigoso.",
  verbatim="don't hop on some stupid program that tries to get amazing results by just throwing more and more and more stress at you that's a dangerous program to use"))

A(dict(at="05:19", scope="GERAL", modo="prescricao", topic=["deload","autorregulacao","progressao"],
  claim="Outra coisa a considerar é como o programa lida com recuperação e com estagnação: se tem deloads, ou tentativas máximas e AMRAPs que ajustam o training max ao longo do ciclo.",
  verbatim="another thing to consider is how is recovery or how is stalling handled in the program are there D loads are there Max attempts"))

A(dict(at="05:34", scope="GERAL", modo="fato", topic=["autorregulacao","progressao"],
  claim="No programa do Layne Norton há AMRAPs específicos em várias semanas que impactam a semana seguinte, e o ajuste pode ser para cima ou para baixo.",
  verbatim="it has a bunch of weeks with specific am wraps that are to impact the next week and that might go up or down"))

A(dict(at="05:50", scope="GERAL", modo="mecanismo", topic=["autorregulacao","progressao","fadiga"],
  claim="Muitos programas usam AMRAP só para aumentar o peso numa progressão linear, mas num bloco longo você pode precisar baixar o training max de tempos em tempos.",
  verbatim="a lot of programs use am wraps only to increase your weight on a linear progression but with Lane Norton's ph3 it's a longer block of training where you may need to dip that training Max down every once in a while"))

A(dict(at="06:05", scope="GERAL", modo="prescricao", topic=["progressao","series-reps","autorregulacao"],
  claim="Verifique se o programa muda o protocolo quando você estagna, como o GZCLP faz, alterando séries, repetições ou intensidade.",
  verbatim="protocol changes when you stall out like in gzclp do you actually change the protocol you're using and move to something else"))

A(dict(at="06:35", scope="GERAL", modo="prescricao", topic=["progressao","recuperacao"],
  claim="Se você não está recuperando ou está estagnando, ter uma progressão para onde ir é o que mantém os ganhos.",
  verbatim="there's a progression that you can move if you are not recovering if you're stalling out that's going to allow you to stay on the gains"))

A(dict(at="06:35", scope="GERAL", modo="opiniao", topic=["meta-metodologia","volume"],
  claim="A ferramenta mais importante para avaliar um programa é o stress index, criado por Mike Tuchscherer.",
  verbatim="lastly and most importantly the stress index the stress index is kind of the Holy Grail of how to assess a program this is created by Mike tshir"))

A(dict(at="06:51", scope="GERAL", modo="fato", topic=["meta-metodologia"],
  claim="Ele desenvolveu o stress index trabalhando com a pesquisa escassa que existe sobre o assunto.",
  verbatim="he has developed and has worked very hard with the sparse and little research that there is on this"))

A(dict(at="07:06", scope="GERAL", modo="fato", topic=["volume","meta-metodologia"],
  claim="O que o stress index traz é a capacidade de comparar entre si séries de estresse que são diferentes.",
  verbatim="the ability to compare sets of stress to one another that are different"))

A(dict(at="07:06", scope="GERAL", modo="mecanismo", topic=["volume","intensidade","fadiga"],
  claim="O exemplo dele é uma série de 10 a 70% contra 10 singles a 70%: mesmo volume, mesma tonelagem, impacto diferente.",
  verbatim="what's more stressful uh a set of 10 with 70% or 10 singles with 70% same volume same tonnage",
  params=[P("reps_serie_unica",10,"reps","reps"),P("intensidade",70,"% do 1RM","pct_1RM"),P("singles",10,"séries","series")]))

A(dict(at="07:22", scope="GERAL", modo="fato", topic=["meta-metodologia","volume"],
  claim="O que Mike Tuchscherer tentou fazer foi quantificar isso numa unidade de estresse por série.",
  verbatim="what Mike T has tried to do is quantify this into a stress unit per set"))

A(dict(at="07:22", scope="PESSOAL", modo="opiniao", topic=["meta-metodologia","programacao"],
  claim="Ele usa muito o stress index ao analisar programas, porque isso expõe problemas de forma clara e rápida, ainda que a ferramenta seja grosseira e esteja na quinta iteração.",
  verbatim="this will very clearly and quickly expose problems and programs um it is a rough tool it's in its fifth iteration"))

A(dict(at="07:37", scope="GERAL", modo="fato", topic=["rpe","volume","meta-metodologia"],
  claim="Uma unidade de estresse equivale a cerca de uma série dura, e ele escolheu RPE 8.5, em que você deixa 1.5 repetição no tanque.",
  verbatim="one stress unit is about equivalent to a hard set and I decided to pick RP 8.5 that's where you're leaving one and 1 half reps in tank",
  params=[P("rpe_referencia",8.5,"RPE","RPE"),P("rir_referencia",1.5,"RIR","RIR")]))

A(dict(at="07:53", scope="GERAL", modo="fato", topic=["rpe","volume"],
  claim="Para quem usa repetições em reserva, uma série dura é de 1 a 2 repetições em reserva, e é isso que uma unidade de estresse representa.",
  verbatim="for you rir people that you know one to two reps in reserve a hard set and that's what one stress unit cor relates to",
  params=[P("rir_min",1,"RIR","RIR"),P("rir_max",2,"RIR","RIR")]))

A(dict(at="08:08", scope="GERAL", modo="fato", topic=["volume","intensidade","meta-metodologia"],
  claim="Quatro séries de 1 repetição a 94%, que é o RPE 8.5 para um single, somam apenas 2.8 unidades de estresse.",
  verbatim="if we pop this down and we look at four sets of one at what would be RP 8.5 for a single 94% that's going to come out to only 2.8 stress units",
  params=[P("series",4,"séries","series"),P("reps",1,"reps","reps"),P("intensidade",94,"% do 1RM","pct_1RM"),P("rpe",8.5,"RPE","RPE"),P("estresse",2.8,"unidades de estresse","contagem")]))

A(dict(at="08:23", scope="GERAL", modo="mecanismo", topic=["intensidade","fadiga","volume"],
  claim="Quatro singles acima de 90% parecem muito duros no papel e realmente te moem.",
  verbatim="that looks really hard on paper shoot four singles at above 90% that's going to grind you down",
  params=[P("singles",4,"séries","series"),P("intensidade",90,"% do 1RM","pct_1RM")]))

A(dict(at="08:23", scope="GERAL", modo="mecanismo", topic=["intensidade","fadiga"],
  claim="Nesse tipo de série o estresse de sistema nervoso central é alto em comparação com o acúmulo de metabólitos.",
  verbatim="this total stress the CNS That central nervous system stress is going to be high in comparison to metabolite accumulation"))

A(dict(at="08:38", scope="GERAL", modo="mecanismo", topic=["fadiga","dor","hipertrofia"],
  claim="A pergunta prática é se aquela série vai causar acúmulo de lactato e dor tardia, ou se vai machucar articulação e fritar o sistema nervoso central.",
  verbatim="is this set going to cause a bunch of lactic acid buildup and give me Doms or is it just going to hurt my joints and Fry my CNS"))

A(dict(at="08:53", scope="GERAL", modo="mecanismo", topic=["series-reps","fadiga","hipertrofia"],
  claim="Singles, duplas e triplas ficam de um lado e séries de 10, 12, 15 e 20 do outro: é a diferença entre estresse periférico e estresse central.",
  verbatim="you're thinking singles doubles triples over here and you're thinking sets a 10 12 15 20 over here that's the peripheral stress versus the central stress",
  params=[P("reps_a",10,"reps","reps"),P("reps_b",12,"reps","reps"),P("reps_c",15,"reps","reps"),P("reps_d",20,"reps","reps")]))

A(dict(at="09:09", scope="GERAL", modo="fato", topic=["volume","intensidade","rpe"],
  claim="As mesmas 2.8 unidades de estresse aparecem em 4 séries de 4 a 85%, porque a intensidade relativa também é cerca de 8.5.",
  verbatim="the 2.8 stress units here could be compared to four sets of four at 85% now the relative intensity is still about 8.5 for both of these",
  params=[P("estresse",2.8,"unidades de estresse","contagem"),P("series",4,"séries","series"),P("reps",4,"reps","reps"),P("intensidade",85,"% do 1RM","pct_1RM"),P("rpe",8.5,"RPE","RPE")]))

A(dict(at="09:09", scope="GERAL", modo="mecanismo", topic=["volume","hipertrofia","fadiga"],
  claim="Indo de 4 para 16 repetições de trabalho há muito mais acúmulo de metabólitos, mesmo com a intensidade relativa das séries sendo a mesma.",
  verbatim="obviously going from four working reps to 16 working reps there's a lot more metabolite accumulation here even though the relative intensity of the sets is the same",
  params=[P("reps_trabalho_baixo",4,"reps","reps"),P("reps_trabalho_alto",16,"reps","reps")]))

A(dict(at="09:39", scope="GERAL", modo="mecanismo", topic=["volume","intensidade","fadiga"],
  claim="Ir para 4 séries de 10 não faz o estresse subir ainda mais, porque o peso absoluto na barra é menor e o estresse de sistema nervoso central começa a cair mesmo com o estresse periférico subindo.",
  verbatim="you move out to 4 to 10 you might think oh well the stress would go really high over there well no because the absolute weight on the bar is now lower so the central nervous system stress is starting to dip down",
  params=[P("series",4,"séries","series"),P("reps",10,"reps","reps")]))

A(dict(at="09:55", scope="GERAL", modo="mecanismo", topic=["volume","intensidade","programacao"],
  claim="A razão de certas progressões serem brutalmente efetivas é que a forma como volume e intensidade são geridos cria uma banda estreita de stress index.",
  verbatim="the way in which volume and intensity are managed within programs is actually creating a narrow band of a stress index"))

A(dict(at="10:10", scope="GERAL", modo="prescricao", topic=["volume","intensidade","programacao"],
  claim="O que você quer no seu programa é não ter oscilações selvagens de estresse de uma semana para outra.",
  verbatim="you don't want wild swings in your stress all over the place week to week"))

A(dict(at="10:26", scope="GERAL", modo="mecanismo", topic=["progressao","recuperacao","volume"],
  claim="Oscilação selvagem de estresse gera uma resposta ruim ao treino, porque não há consistência suficiente para você se aclimatar.",
  verbatim="that's going to create a bad training response because you don't have enough consistency to acclimate to things"))

A(dict(at="10:26", scope="GERAL", modo="opiniao", topic=["programacao","meta-metodologia"],
  claim="A maioria dos programas que seguem os princípios científicos de programação já tem essa banda estreita embutida, e o stress index só serve para quantificá-la.",
  verbatim="most programs that follow the scientific principles of programming and strength training already have this baked into them but this is a way to quantify it"))

emit("G008", c)
