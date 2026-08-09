import fs from "fs"; import path from "path";
const ROOT="/Users/brunnovert/Documents/Dev/powerlifting-app";
const dir=path.join(ROOT,"research/extract");
const man=JSON.parse(fs.readFileSync(path.join(ROOT,"research/corpus/manifest.json"),"utf8"));
const byRef={}; for(const v of man.videos) byRef[v.ref]=v;
let all=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".jsonl"))){
  for(const l of fs.readFileSync(path.join(dir,f),"utf8").split("\n").filter(Boolean)){
    const o=JSON.parse(l); o._file=f; all.push(o);
  }
}
// density per src
const perSrc={}; for(const c of all) perSrc[c.src]=(perSrc[c.src]||0)+1;
const dens={}; for(const s in perSrc){ const v=byRef[s]; dens[s]= v? perSrc[s]/(v.durationSec/60) : 0; }
const dvals=Object.values(dens).filter(x=>x>0).sort((a,b)=>a-b);
const q=(p)=>dvals[Math.floor(dvals.length*p)];
const q1=q(.25),q2=q(.5),q3=q(.75);
const dtier=(s)=>{const d=dens[s]||0; return d<=q1?"D1":d<=q2?"D2":d<=q3?"D3":"D4";};
console.error("density quartiles/min:",q1.toFixed(2),q2.toFixed(2),q3.toFixed(2));

const NEG=/\b(n't|not|never|no |none|nothing|isn|aren|doesn|don|won|wouldn|can't|cannot|shouldn|didn|hasn|haven|without|rarely|unless)\b/i;
const PRESCR=/\b(recomenda|deve|precisa|tem que|é preciso|prescreve|indica|aconselha|sempre|nunca|todo mundo|a maioria deve|ideal é|melhor é)\b/i;
const risk=(c)=>{
  const tags=[];
  if(c.certainty==="implied") tags.push("IMPLIED");
  if(NEG.test(c.verbatim||"")) tags.push("NEG");
  if((c.params||[]).length>0) tags.push("NUM");
  if((c.claim||"").length>140) tags.push("LONG");
  if((c.verbatim||"").length < (c.claim||"").length*0.85) tags.push("SHORTV");
  if(c.scope==="GERAL" && PRESCR.test(c.claim||"")) tags.push("PRESCR");
  return tags;
};
for(const c of all){ c._risk=risk(c); c._d=dtier(c.src); }
// deterministic pseudo-random
let seed=20260809; const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff;};
const shuffle=a=>{a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};

const chosen=new Map(); const perVideoCap=3;
const vcount={};
function take(pool,n,label){
  let k=0;
  for(const c of shuffle(pool)){
    if(k>=n) break;
    if(chosen.has(c.id)) continue;
    if((vcount[c.src]||0)>=perVideoCap) continue;
    chosen.set(c.id,c); c._why=label; vcount[c.src]=(vcount[c.src]||0)+1; k++;
  }
}
const has=t=>c=>c._risk.includes(t);
take(all.filter(has("IMPLIED")),10,"implied");
take(all.filter(c=>c.tier==="O"),8,"tier-O");
for(const d of["D1","D2","D3","D4"]){
  take(all.filter(c=>c._d===d&&has("NEG")(c)&&c.tier==="R"),9,"neg/"+d);
  take(all.filter(c=>c._d===d&&has("NUM")(c)&&c.tier==="R"),9,"num/"+d);
  take(all.filter(c=>c._d===d&&has("LONG")(c)&&c.tier==="R"),5,"long/"+d);
  take(all.filter(c=>c._d===d&&has("SHORTV")(c)&&c.tier==="R"),6,"shortv/"+d);
  take(all.filter(c=>c._d===d&&has("PRESCR")(c)&&c.tier==="R"),5,"prescr/"+d);
  take(all.filter(c=>c._d===d&&c.tier==="R"),4,"random/"+d);
}
const out=[...chosen.values()];
console.error("sample size",out.length,"videos",new Set(out.map(c=>c.src)).size);
// context
const tcache={};
function ctx(c){
  const v=byRef[c.src]; if(!v) return "(sem transcrição)";
  const p=path.join(ROOT,v.transcript);
  if(!tcache[p]) tcache[p]=fs.existsSync(p)?fs.readFileSync(p,"utf8"):"";
  const t=tcache[p]; if(!t) return "(faltando)";
  const blocks=[...t.matchAll(/\[(\d+:\d+)\]([^\[]*)/g)].map(m=>({ts:m[1],txt:m[2].trim()}));
  const i=blocks.findIndex(b=>b.ts===c.at);
  let idx=i;
  if(idx<0){ // find block containing verbatim
    const vb=(c.verbatim||"").toLowerCase().slice(0,40);
    idx=blocks.findIndex(b=>b.txt.toLowerCase().includes(vb));
  }
  if(idx<0) return "(bloco não encontrado)";
  return blocks.slice(Math.max(0,idx-1),idx+3).map(b=>`[${b.ts}] ${b.txt}`).join(" ");
}
out.sort((a,b)=>a.id.localeCompare(b.id));
let s="";
for(const c of out){
  s+=`\n### ${c.id} (${c.src} @${c.at}) [${c._why}] risk=${c._risk.join(",")} scope=${c.scope||"-"} cert=${c.certainty} topic=${(c.topic||[]).join("/")}\n`;
  s+=`CLAIM: ${c.claim}\n`;
  s+=`VERB : ${c.verbatim}\n`;
  if((c.params||[]).length) s+=`PARAM: ${JSON.stringify(c.params)}\n`;
  s+=`CTX  : ${ctx(c).slice(0,1400)}\n`;
}
fs.writeFileSync(process.argv[2],s);
console.error("written");
