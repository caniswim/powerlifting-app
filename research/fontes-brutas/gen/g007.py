from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="Num bloco de treino normalmente se passa de 3 até 8 semanas, e no Candito cada semana é tratada como um bloco.",
  verbatim="each week it's kind of like a block of training if you're familiar with block periodization where each block has its own focus and normally you spend you know three up to maybe even eight weeks sometimes in a single block",
  params=[P("duracao_bloco_min",3,"semanas","semanas"),P("duracao_bloco_max",8,"semanas","semanas")]))

A(dict(at="01:31", scope="GERAL", modo="prescricao", topic=["meta-metodologia","programacao"],
  claim="Se você vai rodar o programa, pegue o PDF no site do autor e leia antes de começar, em vez de simplesmente pular dentro dele.",
  verbatim="definitely if you're going to use this um go get the PDF uh from candido's website you want to read that before you start the program don't just jump in because you're going to miss out on a lot of the nuances"))

A(dict(at="01:46", scope="GERAL", modo="fato", topic=["meta-metodologia","intensidade"],
  claim="Usar a planilha oficial evita rodar o programa com percentuais errados.",
  verbatim="he's got the Excel sheet right there so you're not going to get something that has messed up percentages or has mistakes in it"))

A(dict(at="02:32", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="Como o programa tem 6 semanas, não há tempo de encadear blocos, então o autor encadeia semanas.",
  verbatim="Johnny in a sixe program doesn't have time to chain together all these blocks so he chains together weeks",
  params=[P("duracao",6,"semanas","semanas")]))

A(dict(at="02:47", scope="GERAL", modo="fato", topic=["periodizacao","hipertrofia","intensidade"],
  claim="As semanas se chamam condicionamento muscular, condicionamento muscular e hipertrofia, linear max overload training, aclimatação a peso pesado e força de alta intensidade.",
  verbatim="you got muscular conditioning the medium version of it muscular conditioning and hypertrophy the heavier version of it linear Max T which I'm pretty sure is overload training heavyweight"))

A(dict(at="02:47", scope="GERAL", modo="fato", topic=["deload","teste-de-forca","periodizacao"],
  claim="A sexta semana é a semana de escolha: você pode fazer deload, voltar ao começo com os máximos novos, ou usá-la como mock meet ou semana de teste.",
  verbatim="followed by week six which is kind of like the the you choose week follow your own Journey you can deload on that week you can basically go back with your new Maxes and repeat the cycle"))

A(dict(at="03:02", scope="GERAL", modo="opiniao", topic=["teste-de-forca","taper","erro-comum"],
  claim="A crítica principal dele ao programa é essa sexta semana que fica pendurada como um ponto de interrogação.",
  verbatim="that's a little bit of my critique of this program is that sixth week that just kind of hangs out there as the question mark"))

A(dict(at="03:17", scope="GERAL", modo="fato", topic=["supino","frequencia"],
  claim="A frequência de supino varia: às vezes 3 vezes por semana, às vezes 2, e na quinta semana apenas 1.",
  verbatim="you're going to have uh bench sometimes three times per week sometimes two sometimes it's just that last uh fifth week where it's one fre 1X frequency",
  params=[P("frequencia_alta",3,"x/semana","x_semana"),P("frequencia_media",2,"x/semana","x_semana"),P("frequencia_baixa",1,"x/semana","x_semana")]))

A(dict(at="03:32", scope="GERAL", modo="fato", topic=["acessorios","hipertrofia"],
  claim="Os exercícios opcionais são realmente opcionais e servem para hipertrofia adicional, com repetições geralmente altas.",
  verbatim="optional exercises are exactly that as Johnny talks about in the PDF you can add these in you cannot add these in totally up to you"))

A(dict(at="03:47", scope="GERAL", modo="fato", topic=["series-reps","intensidade"],
  claim="Na primeira semana você ondula subindo, com repetições mais altas passando por uma variedade de faixas de intensidade.",
  verbatim="now so what you're going to see in week one is you're waving up up with higher reps moving through a variety of intensity ranges"))

A(dict(at="04:03", scope="GERAL", modo="fato", topic=["supino","intensidade","series-reps"],
  claim="No terceiro dia de supino da semana você faz 80% para o máximo de repetições possível.",
  verbatim="bench three you're doing 80% for a uh for Max reps and so you're just going to do as many as you can",
  params=[P("intensidade",80,"% do 1RM","pct_1RM")]))

A(dict(at="04:03", scope="GERAL", modo="fato", topic=["series-reps","autorregulacao"],
  claim="Quando o programa escreve max rep 10, significa não passar de 10 repetições.",
  verbatim="sometimes it'll be like Max rep 10 that means don't do more than 10",
  params=[P("teto_de_reps",10,"reps","reps")]))

A(dict(at="04:33", scope="GERAL", modo="fato", topic=["erro-comum","intensidade","progressao"],
  claim="Um erro que muita gente comete nas reviews desse programa é ignorar que a prescrição é 80% mais 5 lb, ou mais 2.5 kg, e não 80% seco.",
  verbatim="this introduces one of the things that a lot of people in these video reviews get wrong um 80% plus 5 pounds or plus 2.5 kilos",
  params=[P("intensidade",80,"% do 1RM","pct_1RM"),P("acrescimo_lb",5,"lb","lb"),P("acrescimo_kg",2.5,"kg","kg")]))

A(dict(at="04:33", scope="GERAL", modo="fato", topic=["progressao","intensidade"],
  claim="O autor faz você acrescentar pequenas quantidades de peso em vários pontos do programa para continuar a sobrecarga progressiva mesmo dentro de uma faixa de intensidade parecida.",
  verbatim="he actually is having you incrementally add small amounts of weight to the bar at various points within this program to continue that Progressive overload"))

A(dict(at="05:04", scope="GERAL", modo="opiniao", topic=["periodizacao","hipertrofia"],
  claim="As duas primeiras semanas podem ser pensadas como um bloco de construção de base ou de hipertrofia.",
  verbatim="you can almost think of this as a block of training uh think of it as a base building or hypertrophy block of training in general"))

A(dict(at="05:19", scope="GERAL", modo="fato", topic=["intensidade","series-reps","supino"],
  claim="Na terceira semana há bastante trabalho de qualidade na faixa de 85% ou 85% mais 5 lb, em 3 séries de 4 a 6 repetições.",
  verbatim="you've got a lot of quality work in the 85% or 85% plus 5 range you're doing that for three sets of four to six reps",
  params=[P("intensidade",85,"% do 1RM","pct_1RM"),P("acrescimo",5,"lb","lb"),P("series",3,"séries","series"),P("reps_min",4,"reps","reps"),P("reps_max",6,"reps","reps")]))

A(dict(at="05:34", scope="GERAL", modo="fato", topic=["volume","supino","frequencia"],
  claim="O volume total da semana cai porque o terceiro dia de supino é cortado.",
  verbatim="the overall volume uh reduced because bench 3 is going to be chopped out"))

A(dict(at="05:49", scope="GERAL", modo="fato", topic=["series-reps","acessorios","volume"],
  claim="Ao longo dessa primeira fase de 3 semanas há uma redução progressiva de repetições e o corte do trabalho acessório opcional.",
  verbatim="there's a progression a lowering of the Reps here and even cutting out the optional accessory work as the weeks move through this first 3-week phase",
  params=[P("duracao_fase",3,"semanas","semanas")]))

A(dict(at="06:20", scope="GERAL", modo="fato", topic=["intensidade","supino"],
  claim="Na quarta semana o supino chega à faixa de 90% e depois a 95%.",
  verbatim="we got 87 A5 90 minus 5 lbs and then 90 um then you're going to move 872 90 95",
  params=[P("intensidade_semana",90,"% do 1RM","pct_1RM"),P("intensidade_topo",95,"% do 1RM","pct_1RM")],
  suspect=True, suspectWhy="numero"))

A(dict(at="06:35", scope="GERAL", modo="prescricao", topic=["intensidade","fadiga","volume"],
  claim="Com tantas séries em ou perto de 90% o sistema nervoso central começa a fritar, e derrubar o volume aí é apropriado e importante.",
  verbatim="with this many uh sets at or close to 90% your CNS is really going to start getting fried you're going to need to bring that volume down it's appropriate it's important",
  params=[P("intensidade",90,"% do 1RM","pct_1RM")]))

A(dict(at="06:50", scope="GERAL", modo="mecanismo", topic=["acessorios","recuperacao","series-reps"],
  claim="O volume de acessórios opcionais sobe um pouco nessa semana, mas as repetições são altas, então o peso usado não taxa o sistema nervoso e quase funciona como recuperação ativa.",
  verbatim="look at the Reps reps are fairly high so the overall weight you're going to use for these is not going to be taxing your CNS there's almost like some AC recovery going on here"))

A(dict(at="07:05", scope="GERAL", modo="fato", topic=["intensidade","teste-de-forca"],
  claim="A quinta semana é 97.5% para 1 a 4 repetições, e conseguir 4 repetições aí significa que o 1RM subiu bastante.",
  verbatim="which is 97.5 for one to four reps so hopefully you get four reps you said new four rep max with 97 a half% which means your one rep max has increased quite a bit",
  params=[P("intensidade",97.5,"% do 1RM","pct_1RM"),P("reps_min",1,"reps","reps"),P("reps_max",4,"reps","reps")]))

A(dict(at="07:20", scope="GERAL", modo="fato", topic=["teste-de-forca","volume"],
  claim="Essa quinta semana não é a semana de teste: é um único exercício, com todo o resto do supino retirado.",
  verbatim="this is not your test week this is not it this is just it's one exercise you've pulled out all the bench this is your focus but it's not your test week"))

A(dict(at="07:20", scope="GERAL", modo="opiniao", topic=["taper","volume","erro-comum"],
  claim="A objeção principal dele é que não há volume suficiente ali: do começo ao fim aquilo já é praticamente um taper.",
  verbatim="this is not very much volume I know the accessory work is still there but from where you started to where you ended this is really like a taper"))

A(dict(at="07:36", scope="GERAL", modo="opiniao", topic=["deload","taper","erro-comum"],
  claim="Se você vai deloadar depois dessa semana, não faz sentido, porque ela já é praticamente um deload apesar de pesada.",
  verbatim="if you're going to deload after this why would you need to deload this week although it's very heavy is already kind of a de lo"))

A(dict(at="07:51", scope="GERAL", modo="opiniao", topic=["taper","competicao","erro-comum"],
  claim="Testar depois de uma semana de frequência e volume tão baixos deixa muito tempo para destreinar até o dia da competição.",
  verbatim="testing after such a low frequency low volume week saving like if if you do this on Tuesday and your meat is on a Saturday"))

A(dict(at="08:06", scope="GERAL", modo="prescricao", topic=["taper","competicao","aprendizado-motor"],
  claim="Mesmo numa semana de teste você deve fazer alguns toques, algo como 50 a 60% por 3 a 5 séries de 3 a 5 repetições, para se manter afiado.",
  verbatim="just because it's a test week doesn't mean you're not going to taper or have some touches that you might do maybe like 60% 50% for you know three to five sets at three to five on that week to keep yourself sharp",
  params=[P("intensidade_min",50,"% do 1RM","pct_1RM"),P("intensidade_max",60,"% do 1RM","pct_1RM"),P("series_min",3,"séries","series"),P("series_max",5,"séries","series"),P("reps_min",3,"reps","reps"),P("reps_max",5,"reps","reps")]))

A(dict(at="08:36", scope="GERAL", modo="fato", topic=["volume","supino","meta-metodologia"],
  claim="Pelo stress index o volume de supino do programa é de 6.9 séries duras na primeira semana, 8.7 na segunda, 9.6 na terceira e 8 na quarta.",
  verbatim="6.9 hard sets on week one 8.7 hard sets on week two 9.6 on week three eight on week four",
  params=[P("semana_1",6.9,"séries duras","series"),P("semana_2",8.7,"séries duras","series"),P("semana_3",9.6,"séries duras","series"),P("semana_4",8,"séries duras","series")]))

A(dict(at="08:36", scope="GERAL", modo="fato", topic=["volume","intensidade","periodizacao"],
  claim="A redução de volume aparece de forma coerente enquanto a intensidade sobe, o que faz total sentido.",
  verbatim="the reduction in volume is present there so that even as intensity is rising it's starting to dip a little bit to accommodate which makes total sense"))

A(dict(at="08:51", scope="GERAL", modo="opiniao", topic=["volume","taper","erro-comum"],
  claim="Derrubar o volume para 1.8 séries duras na quinta semana é, na opinião dele, ir longe demais.",
  verbatim="but then to just Tang the volume to 1.8 hard uh sets right here that's just o it's too far it's over the top",
  params=[P("volume_semana_5",1.8,"séries duras","series")]))

A(dict(at="09:06", scope="GERAL", modo="opiniao", topic=["supino","volume","fadiga"],
  claim="Ele não acha que o supino seja tão taxante a ponto de exigir baixar tanto o volume para compensar o aumento de intensidade.",
  verbatim="I don't think bench is so taxing that you have to lower the volume that much to offset the increase in intensity"))

A(dict(at="09:06", scope="GERAL", modo="opiniao", topic=["programacao","meta-metodologia"],
  claim="Não faz sentido comparar esse programa com os de progressão linear, porque uma progressão que encapsula todo o treino numa semana repetida não é o mesmo tipo de coisa.",
  verbatim="now to compare this you wouldn't want to compare Johnny candido's six-week program to something like strong list 5x5 or starting strength not because it's better or something like that they're different programs"))

A(dict(at="09:36", scope="PESSOAL", modo="narrativa", topic=["volume","meta-metodologia","programacao"],
  claim="Para comparar, ele rodou os números do stress index no programa de 9 semanas da TSA.",
  verbatim="so I looked at the TSA 9we program and I ran the numbers on the stress index",
  params=[P("duracao_tsa",9,"semanas","semanas")]))

A(dict(at="09:52", scope="GERAL", modo="fato", topic=["volume","supino","programacao"],
  claim="Mesmo os dois sendo voltados a intermediários, o estresse de supino é globalmente mais alto na TSA do que no Candito.",
  verbatim="now you can see globally uh even though these are both geared at intermediate lifters the uh stress and the number of hard or the amount of stress that would uh equ equate to hard sets of bench press training is globally higher in the TSA program"))

A(dict(at="10:07", scope="PESSOAL", modo="opiniao", topic=["supino","volume","frequencia"],
  claim="Ele diz que a TSA é um dos seus programas favoritos para supino porque não foge do volume nem da frequência.",
  verbatim="this one of my favorite programs for bench press because it doesn't shy away from the volume and the frequency it really goes for it"))

A(dict(at="10:22", scope="GERAL", modo="fato", topic=["taper","volume","pico"],
  claim="O estresse da TSA não despenca em ponto nenhum: mesmo na semana final ele é quase metade da semana anterior, e não um quarto.",
  verbatim="notice how it doesn't tank at any point even in the final week although in comparison uh to the week before it's almost half uh it's not a quarter"))

A(dict(at="10:37", scope="GERAL", modo="opiniao", topic=["teste-de-forca","intensidade"],
  claim="Se fosse ele, não tentaria a intensidade mais alta prescrita, porque o 95% por 3 repetições da semana anterior já é bom o suficiente.",
  verbatim="if I was looking at this I might not hit 97 and a half but the 95 by3 is already pretty good",
  params=[P("intensidade",95,"% do 1RM","pct_1RM"),P("reps",3,"reps","reps")]))

A(dict(at="10:52", scope="GERAL", modo="prescricao", topic=["taper","pico","competicao"],
  claim="A correção que ele propõe é fazer mais volume nessa semana se for levar o teste para a semana seguinte, ou pular o treino, começar o taper e fazer o máximo no sábado da própria quinta semana.",
  verbatim="if you're going to do something here you need to do more volume if you're going to carry it all the way into week six or just have your test beond this day skip this workout start your taper and actually do your max on the Saturday of week five"))

A(dict(at="11:07", scope="GERAL", modo="opiniao", topic=["taper","programacao"],
  claim="Isso não quer dizer que o programa seja ruim: ele só considera a redução de volume agressiva demais.",
  verbatim="that doesn't mean it's bad it's just I think it's a little bit too aggressive on the reduction"))

emit("G007", c)
