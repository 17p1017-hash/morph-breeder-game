// 画像の自動参照: Wikimedia Commons の公開APIを使用。APIで写真が見つからなければ「画像未登録」を維持。
// 画像ファイルの題名に全ての遺伝子名と ball python が含まれる場合のみ表示候補とする。
// 検索結果の命名・内容は外部提供であり、正しい表現型を保証しません。APIキー・画像生成料は不要。
window.EXTERNAL_PHOTO_CACHE=Object.create(null);
const MORPH_ENGLISH={
 'パステル':'pastel','バナナ':'banana','モハベ':'mojave','エンチ':'enchi','イエローベリー':'yellow belly',
 'GHI':'GHI','アルビノ':'albino','パイド':'pied','レッドストライプ':'red stripe','スパーク':'spark',
 'ゴースト':'ghost','デザートゴースト':'desert ghost','クラウン':'clown','レオパード':'leopard',
 'オレンジドリーム':'orange dream','ファイア':'fire','アザンティック':'axanthic',
 'ファントム':'phantom','スパイダー':'spider','レース':'lace','ヒドゥンジンウォマ':'hidden gene woma',
 'シャンパン':'champagne','コンヒュージョン':'confusion'
};
// 出典を確認した実写写真の外部参照候補。画像自体はゲームに同梱していません。
// 配信先で直リンクが拒否された場合は Wikimedia Commons 検索に切り替えます。
const VERIFIED_REMOTE_PHOTOS=[
  {
    "genes": {
      "パステル": 1,
      "エンチ": 1
    },
    "url": "https://proherper.ams3.cdn.digitaloceanspaces.com/production/morph-migration/6f23879ce5b8cd3641fecad563f4a2b0.jpg",
    "page": "https://worldofballpythons.com/en/morphs/enchi-pastel",
    "name": "パステルエンチ",
    "license": "出典ページを参照"
  },
  {
    "genes": {
      "パステル": 1,
      "モハベ": 1
    },
    "url": "https://d20zyr0oabjxc2.cloudfront.net/variants/media/raw_images/gbserpentarium/2024/07/20240717053228.419-BP24CK2FPastave1-550x550s.jpeg?signature=65987C6D5E25B09361A579247C0E205C931AA695680AFB27F52D67D2619E0FEA",
    "page": "https://www.morphmarket.com/us/c/reptiles/pythons/ball-pythons/2436478",
    "name": "パステルモハベ",
    "license": "出典ページを参照"
  },
  {
    "genes": {
      "バナナ": 1,
      "エンチ": 1
    },
    "url": "https://shoplineimg.com/60ed97942fc3f600085c192e/68baf49f69cecb000ad59b49/800x.jpg",
    "page": "https://www.theorcs-reptile.com/products/%E7%90%83%E8%9F%92%EF%BC%8E%E9%A6%99%E8%95%89%E6%81%A9%E5%A5%87",
    "name": "バナナエンチ",
    "license": "出典ページを参照"
  },
  {
    "genes": {
      "バナナ": 1,
      "クラウン": 2
    },
    "url": "https://d20zyr0oabjxc2.cloudfront.net/variants/media/raw_images/mikewilbanks/2022/08/20220803211828.597-40226226-1500x1500s-1.jpeg?signature=964D149C743E103A6A5048839046D9B4992CE04C5BE95CBC1384D0DE73AD6096",
    "page": "https://www.morphmarket.com/us/c/reptiles/pythons/ball-pythons/1056122",
    "name": "バナナクラウン",
    "license": "出典ページを参照"
  },
  {
    "genes": {
      "バナナ": 1,
      "パイド": 2
    },
    "url": "https://d20zyr0oabjxc2.cloudfront.net/variants/media/raw_images/lacey92allen/2023/11/20231119002645.443-IMG_1671-1500x1500s.jpeg?signature=C0A3B1E246145AA746D5855C27A340566E1F7A9FF6BDBEE23DD293DC6CC84318",
    "page": "https://www.morphmarket.com/us/c/reptiles/pythons/ball-pythons/2017069",
    "name": "バナナパイド",
    "license": "出典ページを参照"
  },
  {
    "genes": {
      "エンチ": 1,
      "モハベ": 1
    },
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mochi_Ball_Python.JPG/960px-Mochi_Ball_Python.JPG",
    "page": "https://commons.wikimedia.org/wiki/File:Mochi_Ball_Python.JPG",
    "name": "エンチモハベ",
    "license": "CC BY-SA 3.0; photographer Kaorte; attribution required"
  },
  {
    "genes": {
      "アルビノ": 2,
      "パイド": 2
    },
    "url": "https://royalconstrictordesigns.com/sites/default/files/styles/panel/public/snakes/albinopied25-210m.jpg?itok=3aNszULr",
    "page": "https://royalconstrictordesigns.com/snakes/albino-pied-44",
    "name": "アルビノパイド",
    "license": "出典ページを参照"
  }
];
function catalogImage(g){
 const visible=visibleGenes(g);
 return VERIFIED_REMOTE_PHOTOS.find(p=>sameGenotype(p.genes,visible))||null;
}
const AUTO_IMAGE_REQUESTS=Object.create(null);
const PHOTO_NEXT_RETRY=Object.create(null);
const API_LIMIT=3;
let apiActive=0;
const apiQueue=[];
function photoGeneKey(g){return JSON.stringify(Object.entries(visibleGenes(g)).sort(([a],[b])=>a.localeCompare(b,'ja')))}
function photoNames(g){return Object.entries(visibleGenes(g)).map(([k,v])=>({k,v,eng:MORPH_ENGLISH[k]}));}
function remoteEligible(g){const a=photoNames(g);return a.length>=2&&a.length<=3&&a.every(x=>!!x.eng&&x.v===1 || !!x.eng&&GENES[x.k]==='rec'&&x.v===2)}
function photoAttr(g){return ' data-morph-genotype="'+encodeURIComponent(JSON.stringify(g))+'"';}
function photoMarkup(g,alt){let p=photoOf(g);return '<img src="'+p.src+'"'+photoAttr(g)+' alt="'+alt+'">';}
function imageIsUsable(url){return new Promise(resolve=>{let image=new Image();const timer=setTimeout(()=>{image.onload=null;image.onerror=null;resolve(false)},9000);image.onload=()=>{clearTimeout(timer);resolve(true)};image.onerror=()=>{clearTimeout(timer);resolve(false)};image.src=url;});}
function queueTask(fn){return new Promise(resolve=>{apiQueue.push({fn,resolve});runQueue()})}
function runQueue(){while(apiActive<API_LIMIT&&apiQueue.length){const {fn,resolve}=apiQueue.shift();apiActive++;Promise.resolve().then(fn).then(resolve,()=>resolve(null)).finally(()=>{apiActive--;runQueue()})}}
function stripHtml(html){const e=document.createElement('div');e.innerHTML=html||'';return e.textContent||'';}
function matchCommonsTitle(title,names){
 const clean=(title||'').replace(/^File:/i,'').replace(/[_\-.()]/g,' ').toLowerCase();
 if(!clean.includes('ball python')&&!clean.includes('python regius'))return false;
 const normalized=clean.replace(/\s+/g,' ');
 return names.every(n=>n.eng.toLowerCase().split(/\s+/).every(w=>new RegExp('(^|[^a-z])'+w+'([^a-z]|$)','i').test(normalized)));
}
// 複数の取得先を同時に確認して、表示するのは最初に読み込めた実写1枚だけ。
async function lookupCommons(g){
 const names=photoNames(g), term=names.map(x=>x.eng).join(' ')+' ball python';
 const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:term,gsrnamespace:'6',gsrlimit:'20',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'800',format:'json',origin:'*'});
 const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),8000);
 let resp;
 try{resp=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:controller.signal,mode:'cors'});}finally{clearTimeout(timer)}
 if(!resp.ok)return [];
 const payload=await resp.json();
 return Object.values(payload.query?.pages||{}).filter(p=>matchCommonsTitle(p.title,names)).map(p=>{
  const info=p.imageinfo?.[0], ext=info?.extmetadata||{}, url=info?.thumburl||info?.url;
  if(!url || !/^https:\/\//.test(url) || !ext.LicenseShortName?.value && !ext.UsageTerms?.value)return null;
  return {url,page:info.descriptionurl||'',credit:stripHtml(ext.Artist?.value||ext.Credit?.value||''),license:stripHtml(ext.LicenseShortName?.value||ext.UsageTerms?.value||'')};
 }).filter(Boolean);
}
async function firstUsablePhoto(candidates){
 const checked=candidates.slice(0,8);
 if(!checked.length)return null;
 // URLは並行して検証する。成功した結果だけを1枚採用する。
 const results=await Promise.all(checked.map(async x=>await imageIsUsable(x.url)?x:null));
 return results.find(Boolean)||null;
}
// Add this function immediately before resolveExternalPhoto(g).
const PHOTO_API_BASE='https://morph-breeder-photo-api.onrender.com';
const PHOTO_API_TIMEOUT_MS=80000; // Free Render services can take 50+ seconds to wake.
const EXTRA_MORPH_TERMS=[
 'pastel','banana','mojave','enchi','yellow belly','ghi','albino','pied',
 'red stripe','spark','ghost','desert ghost','clown','leopard','orange dream',
 'fire','axanthic','phantom','spider','lace','hidden gene woma',
 'champagne','confusion','asphalt','scaleless','cinnamon','black pastel',
 'lesser','butter','pinstripe','calico','super','het'
];
function photoTitleScore(item,requested){
 const title=String(item.title||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
 const padded=' '+title+' ';
 if(!requested.every(g=>padded.includes(' '+g+' ')))return -1;
 let score=100;
 for(const extra of EXTRA_MORPH_TERMS){
  if(requested.includes(extra))continue;
  if(padded.includes(' '+extra+' '))score-=50;
 }
 return score;
}
const PHOTO_DEBUG=Object.create(null);
function photoStatus(g,message){
 const key=photoGeneKey(g);PHOTO_DEBUG[key]=message;
 document.querySelectorAll('img[data-morph-genotype]').forEach(img=>{
  let current;try{current=JSON.parse(decodeURIComponent(img.dataset.morphGenotype))}catch{return}
  if(photoGeneKey(current)!==key)return;
  img.title=message;
  if(img.dataset.photoLoaded==='yes')return;
  const note=img.closest('.animal,.slot,.outcome')?.querySelector('small,.muted');
  if(note && /画像未登録/.test(note.textContent||''))note.textContent='画像未登録（'+message+'）';
 });
}
async function lookupSerpApi(g){
 const requested=photoNames(g).map(x=>x.eng.toLowerCase());
 const params=new URLSearchParams({genes:requested.join(',')});
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),PHOTO_API_TIMEOUT_MS);
 try{
  const resp=await fetch(PHOTO_API_BASE+'/photos?'+params,{signal:controller.signal,mode:'cors'});
  if(!resp.ok){photoStatus(g,'画像検索API HTTP '+resp.status);return []}
  const data=await resp.json();
  if(!Array.isArray(data.candidates)){photoStatus(g,'検索結果の形式が不正');return []}
  if(!data.candidates.length){photoStatus(g,'検索結果0件');return []}
  const candidates=data.candidates.map(x=>({
   url:x.url,page:x.page||'',credit:x.source||'',
   license:'利用条件は出典ページで要確認',
   score:photoTitleScore(x,requested)
  })).filter(x=>x.score>=100 && /^https:\/\//.test(x.url))
    .sort((a,b)=>b.score-a.score);
  if(!candidates.length)photoStatus(g,'一致する遺伝子名の写真候補なし');
  else photoStatus(g,'画像候補'+candidates.length+'件を確認中');
  return candidates;
 }catch(e){photoStatus(g,e?.name==='AbortError'?'画像検索がタイムアウト':'画像検索への接続に失敗');return []}
 finally{clearTimeout(timer)}
}


async function resolveExternalPhoto(g){
 if(!remoteEligible(g))return null;
 const key=photoGeneKey(g);
 if(window.EXTERNAL_PHOTO_CACHE[key])return window.EXTERNAL_PHOTO_CACHE[key];
 if(AUTO_IMAGE_REQUESTS[key])return AUTO_IMAGE_REQUESTS[key];
 if(PHOTO_NEXT_RETRY[key]&&Date.now()<PHOTO_NEXT_RETRY[key])return null;
 AUTO_IMAGE_REQUESTS[key]=queueTask(async()=>{
  const curated=VERIFIED_REMOTE_PHOTOS.filter(p=>sameGenotype(p.genes,visibleGenes(g))).map(p=>({url:p.url,page:p.page,credit:p.name,license:p.license}));
  // 登録済みの画像と Commons 検索を並行して調べる。
  const registered=await firstUsablePhoto(curated);
  const serp=registered?null:await lookupSerpApi(g).then(firstUsablePhoto,()=>null);
  if(!registered&&!serp&&PHOTO_DEBUG[key]?.includes('確認中'))photoStatus(g,'画像候補のURLを読み込めません');
  const commons=(registered||serp)?null:await lookupCommons(g).then(firstUsablePhoto,()=>null);
  const found=registered||serp||commons;
  if(found){window.EXTERNAL_PHOTO_CACHE[key]=found;return found;}
  PHOTO_NEXT_RETRY[key]=Date.now()+120000;
  return null;
 });
 try{return await AUTO_IMAGE_REQUESTS[key];}finally{delete AUTO_IMAGE_REQUESTS[key];}
}
function applyExternalPhotos(root=document){
 const images=[...root.querySelectorAll('img[data-morph-genotype]')];
 for(const img of images){
  let g;try{g=JSON.parse(decodeURIComponent(img.dataset.morphGenotype))}catch(e){continue}
  if(!remoteEligible(g))continue;
  // combo_photos.js の完全一致画像が表示されている場合は、画像を置き換えない。
  if(!img.getAttribute('src')?.startsWith('data:image/svg+xml') && !img.getAttribute('src')?.includes('morph_')){
    const exact=COMBO_CATALOG.find(p=>p.image&&sameGenotype(p.genes,visibleGenes(g)));
    if(exact)continue;
  }
  const key=photoGeneKey(g);
  const fallback=img.getAttribute('src');
  img.title='複合モルフの実写写真を外部サイトで確認中…';
  resolveExternalPhoto(g).then(result=>{
   if(!img.isConnected||photoGeneKey(g)!==key)return;
   if(!result){photoStatus(g,PHOTO_DEBUG[key]||'写真候補が見つからないか、画像を読み込めません');return;}
   // Protect against stale async response after re-render.
   img.dataset.localFallback=fallback;
   img.onerror=()=>{img.onerror=null;img.dataset.photoLoaded='no';img.src=fallback;photoStatus(g,'外部画像の表示が拒否されました');};
   img.onload=()=>{img.dataset.photoLoaded='yes'};img.src=result.url;
   const note=img.closest('.animal,.slot,.outcome')?.querySelector('small,.muted');
   if(note)note.textContent='実在する複合モルフの写真（外部参照）';
   img.title='写真の出典: '+(result.page||'外部サイト')+' · '+(result.license||'')+(result.credit?' · '+result.credit:'');
  });
 }
}
