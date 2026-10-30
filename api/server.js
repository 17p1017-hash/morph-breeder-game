import http from 'node:http';

const PORT = Number(process.env.PORT || 10000);
const API_KEY = process.env.SERPAPI_KEY || '';
const ALLOWED_ORIGIN = 'https://morph-breeder-game.onrender.com';
const cache = new Map();
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ALLOWED_MORPHS = new Set([
 'pastel','banana','mojave','enchi','yellow belly','ghi','albino','pied',
 'red stripe','spark','ghost','desert ghost','clown','leopard','orange dream',
 'fire','axanthic','phantom','spider','lace','hidden gene woma','champagne','confusion',
 'cinnamon','black pastel','pinstripe','lesser','spotnose','bamboo',
 'lavender albino','genetic stripe','sunset','acid'
]);
const alias = new Map([['piebald','pied'],['hypo','ghost'],['dg','desert ghost']]);
const MAX_LOOKUPS = Math.max(1, Math.min(200, Number(process.env.MAX_SEARCHES_PER_MONTH || 175)));
let monthly = {month: new Date().toISOString().slice(0,7), count:0};

function json(res, status, data, origin){
 res.writeHead(status, {
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store',
  'Access-Control-Allow-Origin':origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : 'null',
  'Vary':'Origin',
  'X-Content-Type-Options':'nosniff'
 });
 res.end(JSON.stringify(data));
}
function normalize(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ');}
function parseGenes(value){
 const names = value.split(',').map(normalize).map(s=>alias.get(s)||s);
 if(names.length<1 || names.length>4 || names.some(n=>!ALLOWED_MORPHS.has(n)))return null;
 if(new Set(names).size !== names.length)return null;
 return names.sort();
}
function titleCompatible(title, genes){
 const t = normalize(title).replace(/[^a-z0-9 ]/g,' ');
 const words = ' '+t.replace(/\s+/g,' ')+' ';
 return genes.every(g=>words.includes(' '+g+' '));
}
function isImageUrl(url){
 try { const u=new URL(url);return u.protocol==='https:' && !/^(localhost|127\.0\.0\.1)$/.test(u.hostname); }
 catch { return false; }
}
http.createServer(async(req,res)=>{
 const origin = req.headers.origin || '';
 const url = new URL(req.url,'http://localhost');
 if(req.method==='OPTIONS') {
  res.writeHead(204,{'Access-Control-Allow-Origin':origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : 'null','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'});res.end();return;
 }
 if(url.pathname === '/health') {json(res,200,{ok:true,apiKeyConfigured:Boolean(API_KEY)},origin);return;}
 if(req.method !== 'GET' || url.pathname !== '/photos') {json(res,404,{error:'Not found'},origin);return;}
 if(origin && origin !== ALLOWED_ORIGIN) {json(res,403,{error:'Forbidden origin'},origin);return;}
 if(!API_KEY){json(res,503,{error:'SERPAPI_KEY not configured'},origin);return;}
 const genes=parseGenes(url.searchParams.get('genes')||'');
 if(!genes){json(res,400,{error:'Specify 1-4 known morph names separated by commas'},origin);return;}
 const key=genes.join('|');
 const old=cache.get(key);
 if(old && Date.now()-old.when<TTL_MS){json(res,200,{...old.data,cached:true},origin);return;}
 const month = new Date().toISOString().slice(0,7);
 if(monthly.month!==month)monthly={month,count:0};
 if(monthly.count>=MAX_LOOKUPS){json(res,429,{error:'Monthly search budget reached'},origin);return;}
 monthly.count++;
 const query=(genes.length===1 ? '"'+genes[0]+'" "ball python" morph' : '"'+genes.join(' ')+'" "ball python"');
 const endpoint = new URL('https://serpapi.com/search.json');
 endpoint.search = new URLSearchParams({engine:'google_images',q:query,api_key:API_KEY,num:'30',safe:'active'}).toString();
 try{
  const response = await fetch(endpoint,{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('SerpApi response '+response.status);
  const result=await response.json();
  if(result.error)throw new Error('Image API error');
  // 元画像への直リンクが拒否される場合に備え、サムネイルも候補にする。
  // ラベンダーアルビノは英語名を分割して検索すると別モルフが混入するため、
  // タイトルに両語が含まれるものだけを採用する。
  const candidates=(result.images_results||[])
   .filter(item=>titleCompatible(`${item.title||''} ${item.source||''}`, genes))
   .flatMap(item=>[item.original,item.thumbnail].filter(isImageUrl).map(imageUrl=>({
     url:imageUrl,title:item.title||'',page:item.link||'',source:item.source||''
   })))
   .filter((item,i,all)=>all.findIndex(x=>x.url===item.url)===i)
   .slice(0,12);
  const data={genes,candidates,note:'Search results are candidate photos. Confirm genetics and reuse rights before publication.'};
  cache.set(key,{when:Date.now(),data});
  json(res,200,data,origin);
 }catch(error){json(res,502,{error:'Image search unavailable'},origin);}
}).listen(PORT,'0.0.0.0',()=>console.log('Photo API listening on '+PORT));
