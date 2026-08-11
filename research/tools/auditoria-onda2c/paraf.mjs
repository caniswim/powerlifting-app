import {medir} from '/tmp/aud/tela.mjs';
const casos=[
['P06','tem limite de tamanho pra munhequeira em prova',['F001-95','F001-96']],
['P07','vale a pena comprar um tênis com salto pra agachar ou o meu de lona resolve',['G021-15','V104-28','V104-29']],
['P08','a pele da minha mão está rasgando no levantamento terra, tem algo que ajude a segurar',['V042-02','V042-04','G040-24','G049-08']],
['P09','empaquei no supino, o peso não anda, mexo em quanto',['G013-31','G014-27','G008-25','G008-26']],
['P11','com que frequência devo dar uma aliviada no treino',['G004-08','G004-11','G004-27','G010-03']],
['P12','na série final eu levo até o limite ou guardo alguma',['V010-11','G016-13','G014-02']],
['P13','meu supino trava na metade da subida',['V119-20','V119-29','V170-42']],
['P16','musculação sozinha já serve de exercício cardiovascular',['V013-04','V013-05','V013-06']],
];
let ok=0;
for(const [id,q,esp] of casos){
  const m=medir(q);
  const ach=esp.filter(i=>m.tela.some(t=>t.id===i));
  if(ach.length)ok++;
  console.log(`${id}-parafrase  ${ach.length?'ALGUM':'-----'}  [${ach.join(',')||'nada'}]  rotas=[${m.rotas.join(',')}]`);
}
console.log(`\nDos 8 publicos que passavam, ${ok}/8 sobrevivem a uma parafrase leve.`);
