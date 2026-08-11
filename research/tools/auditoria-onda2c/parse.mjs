export function secoes(out){
  const L=out.split('\n');
  const s={rota:[],indice:[],param:[],lado:[]};
  let modo=null, pos=null;
  for(const l of L){
    if(/^\s{2}\d+ claim\(s\), ordenadas/.test(l)){modo='rota';continue;}
    if(/º–\d+º, em índice/.test(l)){modo='indice';continue;}
    if(/O NOME DO DADO/.test(l)){modo='param';continue;}
    if(/A PÁGINA AO LADO/.test(l)){modo='lado';continue;}
    if(/TÓPICO GRANDE/.test(l)||/GAVETAS QUE PONTUARAM/.test(l)){modo=null;continue;}
    if(!modo)continue;
    const mp=l.match(/^\s*(\d+)º\s+\S/); if(mp&&modo==='rota'){pos=+mp[1];continue;}
    const mi=l.match(/^\s{4,8}([A-Z]\d{3}-\d{2})\s/);
    if(mi){ s[modo].push({id:mi[1],pos: modo==='rota'?pos:null}); if(modo==='rota')pos=null; }
  }
  return s;
}
export function todosIds(out){const s=secoes(out);return [...s.rota,...s.indice,...s.param,...s.lado];}
