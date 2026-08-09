from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["programacao","meta-metodologia"],
  claim="O Bull Mastiff, de Alexander Bromley, remonta à era de ouro do powerlifting e ao sistema de AMRAP popularizado por Doug Young.",
  verbatim="bull mastiff by Alexander Bramley it hearkens back to the Golden Era of powerlifting and the am wrap system that Doug young popularized"))

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["programacao","frequencia","selecao-exercicio"],
  claim="Na fase base o programa treina segunda, terça, quinta e sexta, com agacho, supino, terra e desenvolvimento.",
  verbatim="Monday Tuesday Thursday Friday you got your squat bench deadlift overhead press on the base face"))

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="A estrutura é de 3 ondas de 3 semanas cada.",
  verbatim="this is going to be three waves done for 3 weeks each",
  params=[P("ondas",3,"ondas","contagem"),P("semanas_por_onda",3,"semanas","semanas")]))

A(dict(at="00:15", scope="GERAL", modo="opiniao", topic=["programacao","volume","intensidade"],
  claim="Ele avalia o Bull Mastiff como excelentemente planejado, com a queda de volume certa nos momentos certos enquanto a intensidade sobe.",
  verbatim="it's an excellently planned program with the right drop in volume at the right times as intensity is increasing"))

A(dict(at="01:01", scope="GERAL", modo="anedota", topic=["progressao","meta-metodologia"],
  claim="Bromley passou por estagnação e por períodos longos de problema no começo da carreira, e conseguiu romper platôs já como atleta muito experiente.",
  verbatim="a lot of his career he had some stagnation he was dealing with issues very early on but for extended periods"))

A(dict(at="01:31", scope="GERAL", modo="fato", topic=["autorregulacao","progressao"],
  claim="Doug Young usava AMRAPs e o desempenho no AMRAP informava a progressão de peso semana a semana.",
  verbatim="he loved to used am wraps and the performance of that am wrap to inform the weight progressions"))

A(dict(at="01:46", scope="GERAL", modo="opiniao", topic=["autorregulacao","fadiga"],
  claim="Ele considera esse esquema uma boa forma de autorregulação para não moer o sistema nervoso central.",
  verbatim="this is a really good way of Auto regulation to not grind your CNS into the ground"))

A(dict(at="01:46", scope="GERAL", modo="mecanismo", topic=["autorregulacao","intensidade","rpe"],
  claim="O mecanismo é que ter sucesso no AMRAP indica que a intensidade relativa das séries anteriores foi baixa.",
  verbatim="because the am wrap if you're succeeding in it tells you that you had a lower relative intensity to the sets leading up to it"))

A(dict(at="02:31", scope="PESSOAL", modo="fato", topic=["meta-metodologia","programacao"],
  claim="O Evolve AI é construído em torno do sistema de coaching e do modo de pensar dele.",
  verbatim="AI is built around my coaching system my ways of thinking"))

A(dict(at="02:46", scope="GERAL", modo="fato", topic=["frequencia","programacao"],
  claim="Bromley recomenda rodar o Bull Mastiff 4 dias por semana.",
  verbatim="bullmastiff by Alexander Bramley four days per week is what he advises",
  params=[P("frequencia",4,"dias/semana","x_semana")]))

A(dict(at="02:46", scope="GERAL", modo="opiniao", topic=["meta-metodologia","programacao"],
  claim="O sentido de um template não é glorificá-lo nem tratar qualquer alteração como se descaracterizasse o programa.",
  verbatim="that's the point that's the whole point of a template isn't to like glorify the template put it on a pedestal if you change one little thing it's no longer the program"))

A(dict(at="03:17", scope="GERAL", modo="fato", topic=["periodizacao","acessorios","pico"],
  claim="A fase base é seguida por uma fase de pico com menos trabalho acessório.",
  verbatim="that's supposed to be followed up by the peak phase where you can tell you're going to have less accessory work"))

A(dict(at="03:32", scope="GERAL", modo="fato", topic=["pico","selecao-exercicio"],
  claim="Na fase de pico há mais movimentos principais, porque os exercícios ficam mais específicos.",
  verbatim="you're going to have more main movements in the peaking phase that's because you're getting more specific with your exercises"))

A(dict(at="03:32", scope="GERAL", modo="prescricao", topic=["pico","selecao-exercicio","volume"],
  claim="Você precisa ficar mais específico e ter mais volume de barra no programa conforme se aproxima do pico.",
  verbatim="you need to get more specific and you should have more barbell volume in your program as you get closer to Peak out"))

A(dict(at="03:47", scope="GERAL", modo="prescricao", topic=["periodizacao","hipertrofia"],
  claim="No começo do ciclo o objetivo é construir a base.",
  verbatim="at the beginning you want to build the base hence the name"))

A(dict(at="03:47", scope="GERAL", modo="opiniao", topic=["pico","selecao-exercicio","acessorios"],
  claim="Trocar volume de isolamento por mais movimentos de barra conforme o pico se aproxima é uma excelente ideia.",
  verbatim="adding in more barbell movements and moving out some of that isolation volume is an excellent idea"))

A(dict(at="04:02", scope="GERAL", modo="fato", topic=["volume","intensidade","pico"],
  claim="Nesse período o volume cai por redução de repetições enquanto a intensidade relativa sobe.",
  verbatim="during this time you're also bringing your volume down through a decrease in reps and an increase in relative intensity"))

A(dict(at="04:18", scope="GERAL", modo="fato", topic=["progressao","autorregulacao"],
  claim="Na progressão estilo Doug Young você soma 1% ao máximo que está usando para cada repetição acima da baseline do protocolo.",
  verbatim="you're going to add one 1% to your one rep max that you're using whether it's a training Max or whatever who cares you're going to add 1% for every rep above your Baseline",
  params=[P("incremento_por_rep",1,"% do máximo usado","pct")]))

A(dict(at="04:33", scope="GERAL", modo="fato", topic=["progressao","series-reps"],
  claim="No exemplo dele o levantador tem 500 lb de máximo no agacho e roda um protocolo de 4 séries de 6 com a última em AMRAP.",
  verbatim="let's say you have a 500 rep uh one rep max for Squat and you're doing a protocol it's a four sets of six plus",
  params=[P("maximo_exemplo",500,"lb","1RM_treino"),P("series",4,"séries","series"),P("reps",6,"reps","reps")]))

A(dict(at="04:48", scope="GERAL", modo="fato", topic=["intensidade","progressao"],
  claim="Com 70% de 500 lb você trabalha com 350 lb.",
  verbatim="so if you're doing that with 70% of 500 you're doing 350",
  params=[P("intensidade",70,"% do máximo","pct_1RM"),P("maximo",500,"lb","lb"),P("carga_trabalho",350,"lb","lb")]))

A(dict(at="05:03", scope="GERAL", modo="fato", topic=["progressao","autorregulacao"],
  claim="Se você fizer 11 repetições no AMRAP, são 5 acima da baseline, então o máximo usado é multiplicado por 105% e vira 525 lb.",
  verbatim="that out um but on your am rep you get 11 reps well that's five reps over your Baseline so you would multiply the one rep max you're using by 105% to get 525",
  params=[P("reps_amrap",11,"reps","reps"),P("reps_acima_baseline",5,"reps","reps"),P("multiplicador",105,"%","pct"),P("novo_maximo",525,"lb","lb")]))

A(dict(at="05:03", scope="GERAL", modo="fato", topic=["progressao","intensidade"],
  claim="Na semana seguinte a intensidade não muda: você faz 70% do novo máximo, cerca de 370 lb.",
  verbatim="you're not going to change the intensity you're just going to do 70% of that new Max which would be around 370",
  params=[P("intensidade",70,"% do máximo","pct_1RM"),P("carga_trabalho",370,"lb","lb")]))

A(dict(at="05:18", scope="GERAL", modo="fato", topic=["progressao","autorregulacao"],
  claim="Se você fizer menos de 11 repetições no AMRAP o máximo sobe menos, e se falhar a quarta série de 6 ele pode até cair.",
  verbatim="if you would gotten less than 11 reps you wouldn't increase your max as much and if you got less you might even drop it down a little bit if you failed your fourth set to get six",
  params=[P("reps_baseline_amrap",11,"reps","reps"),P("reps_por_serie",6,"reps","reps")]))

A(dict(at="05:48", scope="GERAL", modo="fato", topic=["acessorios","selecao-exercicio","meta-metodologia"],
  claim="Quando ele diz acessório, está falando de movimentos de uma articulação só.",
  verbatim="when I say accessory what I'm talking about is the single"))

A(dict(at="06:03", scope="GERAL", modo="fato", topic=["acessorios","series-reps"],
  claim="O programa separa acessórios A e B, e os exercícios B são feitos com repetições mais altas que os A.",
  verbatim="on that other side there are A and B accessory work so you will do higher reps with the B accessory exercises"))

A(dict(at="06:19", scope="GERAL", modo="fato", topic=["series-reps","intensidade"],
  claim="A primeira semana da primeira onda é 4 séries de 6 a 70% do training max.",
  verbatim="week one you're doing 4x6 at 70% of whatever your training Max is",
  params=[P("series",4,"séries","series"),P("reps",6,"reps","reps"),P("intensidade",70,"% do TM","pct_TM")]))

A(dict(at="06:34", scope="GERAL", modo="fato", topic=["series-reps","intensidade","selecao-exercicio"],
  claim="A variação é feita em 3 séries de 12 a 60% do máximo da própria variação.",
  verbatim="for the variation you're doing 3x 12 at 60% of the variation one rep max",
  params=[P("series",3,"séries","series"),P("reps",12,"reps","reps"),P("intensidade",60,"% do 1RM da variação","pct_1RM")]))

A(dict(at="06:34", scope="GERAL", modo="fato", topic=["acessorios","series-reps"],
  claim="Os acessórios A são 2 séries de 10 e os B são 2 séries de 15.",
  verbatim="for the accessory work you're doing 2x10 for the a movements 2x 15 for the B",
  params=[P("series_a",2,"séries","series"),P("reps_a",10,"reps","reps"),P("series_b",2,"séries","series"),P("reps_b",15,"reps","reps")]))

A(dict(at="06:49", scope="GERAL", modo="mecanismo", topic=["volume","intensidade","progressao"],
  claim="O volume fica estático mas a intensidade sobe, porque o AMRAP estilo Doug Young faz o training max crescer mesmo com o percentual fixo em 70.",
  verbatim="your volume is staying static here because of the Doug young am wrap style your intensity is going to be increasing even though it's 70 for all of those",
  params=[P("intensidade_fixa",70,"% do TM","pct_TM")]))

A(dict(at="07:04", scope="GERAL", modo="fato", topic=["volume","progressao"],
  claim="Ao longo das semanas da onda o número de séries aumenta, volumizando o programa.",
  verbatim="you're increasing the number of sets you're doing so you're volumizing your program"))

A(dict(at="07:20", scope="GERAL", modo="mecanismo", topic=["progressao","volume","recuperacao"],
  claim="A progressão é sustentável porque você precisa merecer o aumento de intensidade e o degrau de volume é de uma série por vez.",
  verbatim="because you have to earn the intensity increases and because the stepping up is really just a set here or a set there you're going to be able to do this sustainably"))

A(dict(at="07:35", scope="GERAL", modo="fato", topic=["series-reps","periodizacao"],
  claim="Da primeira para a terceira onda há uma queda geral de 1 a 2 repetições.",
  verbatim="there's just kind of a general decreasing in the Reps by about two reps or one rep",
  params=[P("queda_reps_max",2,"reps","reps"),P("queda_reps_min",1,"reps","reps")]))

A(dict(at="07:50", scope="GERAL", modo="prescricao", topic=["acessorios","volume"],
  claim="O trabalho acessório não é imutável: adapte-o para que funcione para você.",
  verbatim="the accessory work is not set in stone make it work for you"))

A(dict(at="07:50", scope="GERAL", modo="prescricao", topic=["acessorios","volume"],
  claim="Se você não quer fazer vários exercícios de isolamento depois do principal, fazer 2 está ok.",
  verbatim="if you don't want to do three or four or five or six exercises afterwards do two that's okay",
  params=[P("exercicios_minimo",2,"exercícios","contagem")]))

A(dict(at="08:06", scope="GERAL", modo="opiniao", topic=["progressao","series-reps"],
  claim="O acerto do programa é sobrepor a progressão por AMRAP a um movimento principal de repetições muito baixas.",
  verbatim="is the Amat progression laid over a very low rep main movement"))

A(dict(at="08:21", scope="GERAL", modo="fato", topic=["pico","acessorios"],
  claim="Bromley recomenda tirar todo o trabalho acessório nas últimas 3 semanas da onda final.",
  verbatim="Alex does advis dropping that entirely during the final wave those last 3 weeks drop all the accessory workout entirely",
  params=[P("semanas_sem_acessorio",3,"semanas","semanas")]))

A(dict(at="08:36", scope="GERAL", modo="fato", topic=["volume","intensidade","pico"],
  claim="Na fase de pico o número de séries cai porque as intensidades já estão quase em 90% ou acima.",
  verbatim="you're going to start decreasing the number of sets you do because your intensities now are so high you're almost at 90% all the way through or over it",
  params=[P("intensidade_pico",90,"% do 1RM","pct_1RM")]))

A(dict(at="08:51", scope="GERAL", modo="mecanismo", topic=["intensidade","fadiga","recuperacao"],
  claim="O estresse aumenta exponencialmente quando você sai da faixa de 70 a 80% e passa a trabalhar em 90% ou mais.",
  verbatim="you exponentially increase your stress when you start going away from working the 70 to8 80% range and you start moving towards that 90 plus range",
  params=[P("faixa_baixa_min",70,"% do 1RM","pct_1RM"),P("faixa_baixa_max",80,"% do 1RM","pct_1RM"),P("faixa_alta",90,"% do 1RM","pct_1RM")]))

A(dict(at="08:51", scope="GERAL", modo="mecanismo", topic=["recuperacao","intensidade","volume"],
  claim="Os custos de recuperação são diferentes conforme a intensidade, então não dá para comparar série com série.",
  verbatim="the recovery costs are different you can't just compare set to set"))

A(dict(at="09:06", scope="GERAL", modo="fato", topic=["volume","periodizacao"],
  claim="No pico as séries do movimento principal caem a cada onda mas depois voltam a subir, para você não destreinar completamente.",
  verbatim="the main movement sets are going to decrease each wave but then they bump back up so you don't completely detrain"))

A(dict(at="09:06", scope="GERAL", modo="fato", topic=["periodizacao","volume"],
  claim="A progressão não é estritamente linear: há ondulação em vez de derrubar o volume dramaticamente.",
  verbatim="this isn't a strictly linear progression uh or linear periodization rather where you're just going to be dropping volume dramatically"))

A(dict(at="10:07", scope="GERAL", modo="opiniao", topic=["volume","meta-metodologia","periodizacao"],
  claim="Pelo stress index, Bromley manteve o estresse numa faixa bem estreita mesmo com o volume mudando muito da fase base para a de pico.",
  verbatim="a lot from the base phase to the peak phase but he's kept the stress in a fairly tight range"))

A(dict(at="10:07", scope="GERAL", modo="mecanismo", topic=["volume","pico","intensidade"],
  claim="Mesmo baixando o volume, como o trabalho é muito duro você continua treinado e realmente atinge um pico.",
  verbatim="so that even though you're lowering the volumes since it's such hard work you're going to stay trained and really hit a peak"))

A(dict(at="10:22", scope="GERAL", modo="opiniao", topic=["tier-list","programacao"],
  claim="Ele dá ao Bull Mastiff nota de tier A a S.",
  verbatim="overall I would give this like a an a tier s tier really high uh marks"))

A(dict(at="10:37", scope="GERAL", modo="opiniao", topic=["autorregulacao","fadiga"],
  claim="O Bull Mastiff tem autorregulação embutida mesmo sendo template, e isso ajuda a não overtreinar.",
  verbatim="it has baked in Auto regulation even though it's a template it's baked into the program and that's going to help"))

A(dict(at="10:52", scope="GERAL", modo="prescricao", topic=["acessorios","volume"],
  claim="Se você está com pouco tempo, o trabalho acessório e os movimentos de isolamento são o melhor lugar para cortar.",
  verbatim="the accessory work and those isolation movements are a great place to cut if you're pressed for time"))

A(dict(at="11:08", scope="GERAL", modo="prescricao", topic=["progressao","selecao-exercicio"],
  claim="Mas mantenha as progressões principais, sejam os exercícios alvo ou os de desenvolvimento das fases de base e pico.",
  verbatim="keep the main progressions whether that's the targeted exercises or developmental exercises of the peak and the base phases"))

emit("G002", c)
