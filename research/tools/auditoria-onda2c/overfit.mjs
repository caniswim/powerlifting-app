import fs from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';
const g=JSON.parse(fs.readFileSync(ROOT+'/research/kb/GLOSSARIO-TOPICOS.json','utf8'));
const arr=g.topicos||g; const list=Array.isArray(arr)?arr:Object.values(arr);
const porTopico={}; for(const t of list) if(t&&t.topico) porTopico[t.topico]=t.entrada||[];
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const j=JSON.parse(fs.readFileSync(ROOT+'/research/kb/CANARIOS.json','utf8'));
const pubs=j.canarios.filter(c=>c.id.startsWith('P')).map(c=>({id:c.id,q:c.pergunta,alvo:[c.perguntaDoAtleta.topicoDaResposta]}));
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8')).map(c=>({id:c.id,q:c.q,alvo:c.top}));
function medir(lista,nome){
  let soma=0;
  for(const c of lista){
    const q=' '+norm(c.q)+' ';
    let melhores=[];
    for(const t of c.alvo){
      for(const termo of (porTopico[t]||[])){
        const tn=norm(termo);
        if(tn.length>=4 && q.includes(' '+tn+' ')) melhores.push(t+':'+termo);
        else if(tn.includes(' ') && q.includes(tn)) melhores.push(t+':'+termo);
      }
    }
    soma+=melhores.length;
    console.log(`${c.id}\t${melhores.length}\t${melhores.slice(0,4).join(' | ')}`);
  }
  console.log(`${nome}: media de termos do glossario da gaveta CERTA presentes literalmente na pergunta = ${(soma/lista.length).toFixed(2)}\n`);
}
medir(pubs,'PUBLICOS');
medir(cegos,'CEGOS');
