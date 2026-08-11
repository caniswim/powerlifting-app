const R='research/tools/roteador.mjs', G='research/tools/glossario.mjs', C='research/tools/check-glossario.mjs';
const nums=[
 [R,'PISO_ROTA',0.65],[R,'FRACAO_DO_MELHOR',0.4],[R,'PESO_CORPUS',0.5],[R,'PESO_CONFUSAO',0.4],
 [R,'MAX_TOPICOS',5],[R,'TETO_ROTEADO',40],[R,'DETALHE_ROTEADO',8],[R,'MIN_CLAIMS_DO_TERMO',2],
 [R,'SUAVIZA',5],[R,'PESO_NOME',0.9],[R,'PESO_NOME_COMPOSTO',1.2],[R,'PREFIXO',5],
 [R,'FRACAO_DA_PALAVRA',0.6],[R,'DIFERENCA_MAXIMA',5],[R,'TETO_AFINS',60],[R,'PESO_AFIM',0.6],
 [R,'MIN_PECAS_DO_PARAM',2],[R,'TETO_PARAM',12],
 [G,'PESO_FRASE',1.0],[G,'PESO_FRASE_ESPARSA',0.7],[G,'PALAVRAS_ESPARSA',2],[G,'JANELA_ESPARSA',5],
 [G,'PESO_TERMO_UNICO',1.0],[G,'PESO_PALAVRA_EM_FRASE',0.5],[G,'PREFIXO_GLOSSARIO',5],
 [G,'FRACAO_DA_PALAVRA_GLOSSARIO',0.6],[G,'DIFERENCA_MAXIMA_GLOSSARIO',5],
 [C,'MIN_TERMOS',10],
];
const casos=[];
for(const [arq,nome,val] of nums){
  const de=`${nome} = ${val}`;
  const alto = Number.isInteger(val) ? val*10 : (val<1? 9.9 : val*10);
  casos.push({arq,nome:`${nome} ${val} -> 0`, de, para:`${nome} = 0`});
  casos.push({arq,nome:`${nome} ${val} -> ${alto}`, de, para:`${nome} = ${alto}`});
}
console.log(JSON.stringify(casos));
