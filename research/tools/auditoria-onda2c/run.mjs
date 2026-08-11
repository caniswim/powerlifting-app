import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const RAIZ='/Users/brunnovert/Documents/Dev/powerlifting-app';
export function roda(pergunta, extra=[]){
  let out='';
  try{ out = execFileSync('node',[RAIZ+'/research/tools/check-evidence.mjs','--pergunta',pergunta,...extra],{encoding:'utf8',maxBuffer:1e8}); }
  catch(e){ out=(e.stdout||'')+(e.stderr||''); }
  return out;
}
export function ids(out){
  // ids na tela, na ordem, com a posicao impressa
  const res=[];
  const re=/^\s*(\d+)º\s/;
  const linhas=out.split('\n');
  let pos=null;
  for(const l of linhas){
    const m=l.match(re); if(m){pos=+m[1];continue;}
    const mi=l.match(/^\s{6}([A-Z]\d{3}-\d{2})\s/);
    if(mi&&pos!==null){res.push({pos,id:mi[1]});pos=null;}
  }
  return res;
}
export function roteou(out){
  const m=out.match(/ROTEOU PARA (\d+) de 74[\s\S]*?(?=\n\s*⚠|\n\s{2}\d+ claim\(s\))/);
  if(!m) return [];
  const t=[];
  for(const l of m[0].split('\n')){
    const mm=l.match(/^\s{5}([a-z0-9-]+)\s+·\s+score/);
    if(mm)t.push(mm[1]);
  }
  return t;
}
export function naoAbriram(out){
  const t=[];
  const seg=out.split('GAVETAS QUE PONTUARAM')[1];
  if(!seg)return t;
  for(const l of seg.split('\n')){
    if(/^\s{2}\d+ claim/.test(l))break;
    const mm=l.match(/^\s{7}([a-z0-9-]+)\s+(\d\.\d\d)/);
    if(mm)t.push(mm[1]+' '+mm[2]);
  }
  return t;
}
