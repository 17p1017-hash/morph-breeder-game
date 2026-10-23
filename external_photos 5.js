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
async function resolveExternalPhoto(g){
 if(!remoteEligible(g))return null;
 const key=photoGeneKey(g);
 if(Object.hasOwn(window.EXTERNAL_PHOTO_CACHE,key))return window.EXTERNAL_PHOTO_CACHE[key];
 if(AUTO_IMAGE_REQUESTS[key])return AUTO_IMAGE_REQUESTS[key];
 AUTO_IMAGE_REQUESTS[key]=queueTask(async()=>{
  // 専門サイトの実写写真は Commons より先に試す。複合モルフの遺伝子構成は完全一致のみ。
  const curated=catalogImage(g);
  if(curated && await imageIsUsable(curated.url)){
    const result={url:curated.url,page:curated.page,credit:curated.name,license:curated.license};
    window.EXTERNAL_PHOTO_CACHE[key]=result;return result;
  }
  const names=photoNames(g); const term=names.map(x=>x.eng).join(' ')+' ball python';
  const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:term,gsrnamespace:'6',gsrlimit:'15',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'800',format:'json',origin:'*'});
  try{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
   let resp;try{resp=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:controller.signal,mode:'cors'});}finally{clearTimeout(timer)}
   if(!resp.ok)throw Error('HTTP '+resp.status);
   const payload=await resp.json();
   const pages=Object.values(payload.query?.pages||{}).filter(p=>matchCommonsTitle(p.title,names));
   for(const p of pages){
     const info=p.imageinfo?.[0];const ext=info?.extmetadata||{};
     const url=info?.thumburl||info?.url;
     if(!url||!/^https:\/\//.test(url)||!/\.(jpe?g|png|webp)(\?|$)/i.test(url))continue;
     // Commons license must be declared. Avoid illustrations/text placeholders where identifiable.
     if(!ext.LicenseShortName?.value && !ext.UsageTerms?.value)continue;
     if(await imageIsUsable(url)){
       const result={url,page:info.descriptionurl||'',credit:stripHtml(ext.Artist?.value||ext.Credit?.value||''),license:stripHtml(ext.LicenseShortName?.value||ext.UsageTerms?.value||'')};
       window.EXTERNAL_PHOTO_CACHE[key]=result;return result;
     }
   }
  }catch(e){/* Network or CORS failure: reference image remains on screen */}
  window.EXTERNAL_PHOTO_CACHE[key]=null;return null;
 });
 return AUTO_IMAGE_REQUESTS[key];
}
function applyExternalPhotos(root=document){
 const images=[...root.querySelectorAll('img[data-morph-genotype]')];
 for(const img of images){
  let g;try{g=JSON.parse(decodeURIComponent(img.dataset.morphGenotype))}catch(e){continue}
  if(!remoteEligible(g))continue;
  const key=photoGeneKey(g);
  const fallback=img.getAttribute('src');
  resolveExternalPhoto(g).then(result=>{
   if(!result||!img.isConnected||photoGeneKey(g)!==key)return;
   // Protect against stale async response after re-render.
   img.dataset.localFallback=fallback;
   img.onerror=()=>{img.onerror=null;img.src=fallback;};
   img.src=result.url;
   const note=img.closest('.animal,.slot,.outcome')?.querySelector('small,.muted');
   if(note)note.textContent='実在する複合モルフの写真（外部参照）';
   img.title='写真の出典: '+(result.page||'外部サイト')+' · '+(result.license||'')+(result.credit?' · '+result.credit:'');
  });
 }
}
