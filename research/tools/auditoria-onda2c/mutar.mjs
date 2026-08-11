import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const box = process.argv[2];            // ex: /tmp/mutbox/s0
const casos = JSON.parse(process.argv[3]);
const SUB = [
  ['research/tools/roteador.test.mjs'],
  ['research/tools/check-canarios.test.mjs'],
  ['research/tools/build-glossario.mjs','--check'],
  ['research/tools/check-glossario.mjs'],
  ['research/tools/check-canarios.mjs'],
  ['research/tools/check-rotas.mjs'],
];
function verde(){
  for(const a of SUB){
    try{ execFileSync('node',a,{cwd:box,stdio:'pipe',maxBuffer:1e8}); }
    catch(e){ return a[0].split('/').pop(); }
  }
  return null;
}
for(const c of casos){
  const alvo = box+'/'+c.arq;
  const orig = fs.readFileSync(alvo,'utf8');
  if(!orig.includes(c.de)){ console.log(`SKIP ${c.nome} (padrão não achado)`); continue; }
  fs.writeFileSync(alvo, orig.replace(c.de, c.para));
  const quem = verde();
  fs.writeFileSync(alvo, orig);
  console.log(`${quem?'vermelha':'>>> VERDE'}\t${c.nome}\t${quem?('pego por '+quem):'NENHUM CHECK PEGOU'}`);
}
