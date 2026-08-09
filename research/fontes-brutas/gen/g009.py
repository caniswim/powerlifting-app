from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["programacao","hipertrofia"],
  claim="O PHUL é o power hypertrophy upper lower split, um programa clássico de powerbuilding.",
  verbatim="phul or power hypertrophy upper lower split and this is a classic power building program"))

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["frequencia","rpe"],
  claim="É um programa de 4 dias em que tudo é feito por volta de RPE 9, ou seja, você deve empurrar as séries.",
  verbatim="this is going to be a 4-day program everything at about an rp9 so you're supposed to be pushing these",
  params=[P("frequencia",4,"dias/semana","x_semana"),P("rpe_alvo",9,"RPE","RPE")]))

A(dict(at="00:34", scope="PESSOAL", modo="anedota", topic=["mentalidade","competicao"],
  claim="Brandon Campbell foi mentor dele; os dois se conheceram pelo YouTube e ele ficou na casa do Brandon quando foi ao Nationals.",
  verbatim="he's been a mentor of mine I met him uh back probably about seven or eight years ago I went out to Nationals in Pennsylvania let me stay at his house"))

A(dict(at="01:50", scope="GERAL", modo="opiniao", topic=["frequencia","programacao"],
  claim="Existem variações de seis e de 3 dias, mas a de 4 dias é a mais comum e a que faz mais sentido.",
  verbatim="I've seen a Six-Day variation a 3-day variation but the 4day is the most common and I think it makes the most sense",
  params=[P("variacao_curta",3,"dias/semana","x_semana"),P("variacao_padrao",4,"dias/semana","x_semana")]))

A(dict(at="01:50", scope="GERAL", modo="fato", topic=["programacao","frequencia","hipertrofia"],
  claim="Os dois primeiros dias são de força e os dois seguintes de hipertrofia, alternando superiores e inferiores.",
  verbatim="so day one the P stands for power so your first two days are power days your second two days are hypertrophy days"))

A(dict(at="02:05", scope="GERAL", modo="fato", topic=["supino","costas","selecao-exercicio"],
  claim="No primeiro dia o trabalho principal de sobrecarga é supino e costas.",
  verbatim="now you're going to be doing uh bench and back work that's going to be your main overloading work on day one"))

A(dict(at="02:20", scope="GERAL", modo="fato", topic=["series-reps","volume"],
  claim="O número de séries não é fixo: na maior parte do programa é uma faixa de 3 a 4 ou de 2 a 3 séries.",
  verbatim="it's going to be a range of 3 to four or 2 to three sets for the most part",
  params=[P("series_min_a",3,"séries","series"),P("series_max_a",4,"séries","series"),P("series_min_b",2,"séries","series"),P("series_max_b",3,"séries","series")]))

A(dict(at="02:20", scope="GERAL", modo="fato", topic=["intensidade","series-reps","hipertrofia"],
  claim="No powerbuilding o movimento primário de sobrecarga usa repetições mais baixas com intensidades mais altas.",
  verbatim="and you got to pay attention to the Reps because your primary overloading movement is going to be lower reps this is again power building where you're going to be focusing on some of those lower rep ranges with higher intensities"))

A(dict(at="02:35", scope="GERAL", modo="fato", topic=["rpe","intensidade"],
  claim="O programa não prescreve percentual de intensidade: a recomendação de Brandon Campbell é fazer tudo por volta de RPE 9.",
  verbatim="because you may notice the lack of intensity on this program the recommendation from Brandon Campbell is to do everything at about an rpe 9",
  params=[P("rpe_alvo",9,"RPE","RPE")]))

A(dict(at="02:50", scope="GERAL", modo="prescricao", topic=["rpe","series-reps","autorregulacao"],
  claim="A recomendação dele é começar mirando uma série de cinco repetições em RPE nove e, conforme acumula séries, manter o peso e derrubar as repetições.",
  verbatim="my recommendation to you is start trying to hit like a five at nine and as you do more sets if you need to drop reps as you're doing doing that keep the weight the same but drop the Reps back",
  params=[P("reps_iniciais",5,"reps","reps"),P("rpe_alvo",9,"RPE","RPE")]))

A(dict(at="02:50", scope="GERAL", modo="prescricao", topic=["series-reps","autorregulacao"],
  claim="Está tudo bem que as repetições caiam ao longo das séries, descendo de cinco para quatro e depois três, desde que você complete as séries.",
  verbatim="there's a range of reps you can do it's okay to do a five a five four four three or whatever to get your sets in",
  params=[P("reps_iniciais",5,"reps","reps"),P("reps_intermediarias",4,"reps","reps"),P("reps_finais",3,"reps","reps")]))

A(dict(at="03:06", scope="GERAL", modo="opiniao", topic=["ombros","acessorios","selecao-exercicio"],
  claim="No PHUL o desenvolvimento entra como movimento acessório e não como um dos movimentos principais de sobrecarga pesada.",
  verbatim="the overhead pressing movements here could be seated with dumbbells something like that it's really meant as an accessory movement not to be considered one of the main really heavy overloading movements"))

A(dict(at="03:21", scope="GERAL", modo="opiniao", topic=["bracos","acessorios","hipertrofia"],
  claim="Não dá para ser um programa de powerbuilding sem cuidar dos braços.",
  verbatim="got to take care of those arms can't be a power building program if you're not taking care of your arms"))

A(dict(at="03:36", scope="GERAL", modo="fato", topic=["agacho","terra","selecao-exercicio"],
  claim="No segundo dia agacho e terra são os movimentos principais, seguindo a mesma lógica de sobrecarga do supino.",
  verbatim="you've got your squat your dead those are your main movements largely following the same overloading that you had on bench"))

A(dict(at="03:51", scope="GERAL", modo="fato", topic=["pernas","acessorios","series-reps"],
  claim="Os três acessórios de inferiores do dia de força são leg press, mesa flexora e cadeira extensora, todos em repetições mais altas.",
  verbatim="you got leg press leg curl leg extension all for higher reps"))

A(dict(at="03:51", scope="GERAL", modo="opiniao", topic=["pernas","selecao-exercicio","intensidade"],
  claim="Ele às vezes classifica o leg press como movimento de sobrecarga porque dá para empurrá-lo com força, mas na faixa de repetições usada aqui ele conta como acessório.",
  verbatim="that's why sometimes I'll include leg press as an overloading movement and categorize it that way because you really can push leg press hard"))

A(dict(at="04:21", scope="PESSOAL", modo="opiniao", topic=["selecao-exercicio","meta-metodologia","intensidade"],
  claim="O critério dele para separar movimento de sobrecarga de movimento acessório são dois fatores: quantas articulações estão envolvidas e qual é a intensidade geral.",
  verbatim="when I make those decisions I look at two main factors how many joints are involved in the movement and what's the overall intensity",
  params=[P("fatores",2,"fatores","contagem")]))

A(dict(at="05:07", scope="GERAL", modo="opiniao", topic=["agacho","selecao-exercicio","hipertrofia"],
  claim="O agachamento frontal, mesmo em repetições altas, é um movimento muito taxante e complexo de barra, e por isso ele o classifica como sobrecarga.",
  verbatim="starting with front squat um although it's higher reps it is a very taxing movement using the barbell complex barbell movement so I'm going to put that in an overloading category"))

A(dict(at="05:52", scope="GERAL", modo="mecanismo", topic=["rpe","volume","intensidade"],
  claim="A intensidade do PHUL é alta: RPE 9 deixa 1 repetição em reserva em praticamente tudo, e é por isso que a lista de exercícios não é gigantesca.",
  verbatim="the intensity is quite High rp9 leaving one rep in reserve for pretty much everything that's going to make these very heavy movements it's why",
  params=[P("rpe_alvo",9,"RPE","RPE"),P("rir",1,"RIR","RIR")]))

A(dict(at="06:07", scope="GERAL", modo="mecanismo", topic=["volume","fadiga"],
  claim="São séries duras, e você não vai conseguir fazer muitas delas.",
  verbatim="these are hard sets you're not going to be able to do that many of them"))

A(dict(at="06:23", scope="GERAL", modo="opiniao", topic=["volume","peito","pernas"],
  claim="O PHUL tem mais volume de superiores do que de inferiores, o que é algo que ele sempre procura num programa.",
  verbatim="there is more upper body volume than lower body volume which I always look look for in programs"))

A(dict(at="06:23", scope="GERAL", modo="opiniao", topic=["erro-comum","volume"],
  claim="Às vezes as pessoas erram e acabam com mais movimentos de inferiores do que de superiores.",
  verbatim="sometimes people mess up and they end up having more lower body movements than upper body"))

A(dict(at="06:38", scope="GERAL", modo="fato", topic=["pernas","acessorios","volume"],
  claim="Boa parte do volume de inferiores vem de panturrilha, mesa flexora e cadeira extensora, de modo que você acaba atingindo cada músculo da perna individualmente.",
  verbatim="there's a lot of calf work in here so you're doing like leg curls leg extensions and then calves really you're hitting all the muscles in your legs individually"))

A(dict(at="06:53", scope="GERAL", modo="prescricao", topic=["volume","peito","programacao"],
  claim="O teste de prontidão para o programa é comparar o volume de empurrar, que arredondado dá 25 séries duras por semana, com o que você já faz: são cinco exercícios de empurrar com cinco séries duras cada.",
  verbatim="if you think about this uh like for push volume if we take it 26 let's call that 25 are you doing five pushing exercises with five hard sets right now",
  params=[P("volume_calculado",26,"séries/semana","series"),P("volume_arredondado",25,"séries/semana","series")]))

A(dict(at="07:09", scope="GERAL", modo="prescricao", topic=["frequencia","volume","supino"],
  claim="Se você não está perto disso, ou seja, de uma frequência de 5 vezes por semana com 3 supinos de barra e 2 acessórios pesados, o programa provavelmente vai te empurrar longe demais.",
  verbatim="if you're not doing you know a 5x frequency with you know three barbell benches and you know two heavy accessories or something like that then this probably might push you a little too far",
  params=[P("frequencia",5,"x/semana","x_semana"),P("supinos_de_barra",3,"exercícios","contagem"),P("acessorios_pesados",2,"exercícios","contagem")]))

A(dict(at="07:24", scope="GERAL", modo="prescricao", topic=["volume","progressao","programacao"],
  claim="Se você não está perto desse número de séries de sobrecarga por semana, construa um pouco mais no programa atual antes de pular para esse.",
  verbatim="if you're not near these overloading sets per week you might want to build up a little bit on your current program before you jump into pH"))

A(dict(at="07:39", scope="GERAL", modo="opiniao", topic=["programacao","mentalidade"],
  claim="Ele gosta da intencionalidade dos dias do PHUL, ao contrário de splits de fisiculturismo em que não se sabe qual é a intenção do dia.",
  verbatim="sometimes you get these uh bodybuilding splits where you don't really know what the intention of the day is"))

A(dict(at="07:55", scope="GERAL", modo="prescricao", topic=["hipertrofia","series-reps","intensidade"],
  claim="Nos dias de hipertrofia você aumenta as faixas de repetição mantendo a intensidade relativa alta, o que é necessário para hipertrofia.",
  verbatim="you're to increase the rep ranges still keeping the relative intensity High which is necessary for hypertrophy"))

A(dict(at="07:55", scope="GERAL", modo="mecanismo", topic=["hipertrofia","rpe"],
  claim="A proximidade da falha é muito importante quando o objetivo é de fato construir músculo e disparar essa resposta.",
  verbatim="proximity to failure is very important when it comes to actually building muscle and triggering that response"))

A(dict(at="07:55", scope="GERAL", modo="opiniao", topic=["mentalidade","hipertrofia","programacao"],
  claim="Ter os dias de hipertrofia definidos, com faixas de repetição diferentes, ajuda você a entrar no estado mental certo ao chegar na academia.",
  verbatim="but having these hypertophy days defined having different rep ranges really allows you to get in the right mindset when you go to the gym"))

A(dict(at="08:10", scope="PESSOAL", modo="opiniao", topic=["programacao","mentalidade"],
  claim="A parte favorita dele nesse programa é a intencionalidade por trás dele.",
  verbatim="that's probably my favorite part about this program is the intentionality behind it"))

A(dict(at="08:10", scope="GERAL", modo="prescricao", topic=["programacao","hipertrofia"],
  claim="Se você nunca tentou o programa e acha que está pronto para ele, ele manda experimentar.",
  verbatim="if you haven't tried it before and you think you're ready for it give it a shot"))

emit("G009", c)
