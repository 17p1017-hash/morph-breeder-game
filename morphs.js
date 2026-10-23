// ダブルホモ接合：2種類の劣性形質がそれぞれ2コピーになった個体を判定。
// 一部の著名な組み合わせには定着した通称を表示。
const DOUBLE_HOMO_NAMES={
 'アザンティック|アルビノ':'スノー',
 'アルビノ|パイド':'アルビノパイド',
 'クラウン|パイド':'クラウンパイド',
 'クラウン|デザートゴースト':'デザートゴーストクラウン',
 'クラウン|ゴースト':'ゴーストクラウン',
 'デザートゴースト|パイド':'デザートゴーストパイド',
 'アザンティック|パイド':'アザンティックパイド',
 'アザンティック|クラウン':'アザンティッククラウン',
 'アルビノ|クラウン':'アルビノクラウン',
 'ゴースト|パイド':'ゴーストパイド'
};
function homoRecessiveGenes(g){return Object.keys(g).filter(k=>GENES[k]==='rec'&&g[k]===2).sort((a,b)=>a.localeCompare(b,'ja'));}
function doubleHomoMatches(g){
 const r=homoRecessiveGenes(g),matches=[];
 for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){
  const genes=[r[i],r[j]];
  const key=genes.slice().sort().join('|');
  matches.push({key,genes,name:DOUBLE_HOMO_NAMES[key]||genes.join(' × '),named:!!DOUBLE_HOMO_NAMES[key]});
 }
 return matches;
}
function primaryDoubleHomo(g){const arr=doubleHomoMatches(g);return arr.find(x=>x.named)||arr[0]||null;}
function nameOf(g){
 const visible=Object.keys(g).filter(k=>GENES[k]==='dom'?g[k]>=1:g[k]===2);
 if(!visible.length)return 'ノーマル';
 const special=primaryDoubleHomo(g);
 if(!special)return visible.map(k=>(GENES[k]==='dom'&&g[k]===2?'スーパー':'')+k).join(' × ');
 const rest=visible.filter(k=>!special.genes.includes(k));
 return [special.name,...rest.map(k=>(GENES[k]==='dom'&&g[k]===2?'スーパー':'')+k)].join(' × ');
}
const SPECIAL_PHOTOS={
  normal:'https://nwreptiles.com/images/xm295/Normal-Ball-Python.jpg',
  superPastel:'https://cdn11.bigcommerce.com/s-g64jf8ws/images/stencil/1280x1280/products/552/2465/SUPER_PASTEL__40444.1573564352.jpg?c=2',
  yellowBellyFire:'https://d20zyr0oabjxc2.cloudfront.net/variants/media/raw_images/jbaud/2023/05/20230529193702.400-IMG_0569-1500x1500s-1.jpeg?signature=C4E865145FC2249DF3989EC91E0F0DE65990D607EE06361DB9CF6FE85043023A'
};
function placeholderPhoto(label='画像未登録'){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="#203233"/><rect x="18" y="18" width="564" height="414" rx="24" fill="#2f494b" stroke="#7fb5a3" stroke-width="4"/><text x="300" y="200" text-anchor="middle" font-size="30" fill="#eef5ef" font-family="sans-serif">${label}</text><text x="300" y="245" text-anchor="middle" font-size="20" fill="#d7e7da" font-family="sans-serif">一致する複合モルフ写真がありません</text></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
// 登録済みの複合モルフ画像を遺伝子名・コピー数で厳密照合。
function visibleGenes(g){return Object.fromEntries(Object.entries(g).filter(([k,v])=>GENES[k]==='rec'?v===2:v>=1));}
function sameGenotype(a,b){const ka=Object.keys(a).sort(),kb=Object.keys(b).sort();return ka.length===kb.length&&ka.every((k,i)=>k===kb[i]&&a[k]===b[k]);}
function photoOf(g){
 const visible=visibleGenes(g); const genes=Object.keys(visible);
 const cached=window.EXTERNAL_PHOTO_CACHE?.[photoGeneKey(g)];
 if(cached && cached.url)return {src:cached.url,reference:false,exact:true,label:'実在する複合モルフの写真（外部参照）',credit:cached.credit||'',detail:cached.page||'',fallback:cached.fallback||''};
 const exact=COMBO_CATALOG.find(item=>item.image&&sameGenotype(item.genes,visible));
 if(exact)return {src:exact.image,reference:false,exact:true,label:exact.name+'の登録写真',credit:exact.credit||'',detail:exact.page||''};
 if(!genes.length)return {src:SPECIAL_PHOTOS.normal,reference:false,exact:true,label:'ノーマルの参考写真'};
 if(genes.length===1&&genes[0]==='パステル'&&g['パステル']===2)return {src:SPECIAL_PHOTOS.superPastel,reference:false,exact:true,label:'スーパーパステルの参考写真'};
 if(genes.length===2&&genes.includes('イエローベリー')&&genes.includes('ファイア')&&g['イエローベリー']===1&&g['ファイア']===1)return {src:SPECIAL_PHOTOS.yellowBellyFire,reference:false,exact:true,label:'イエローベリー×ファイアの参考写真'};
 if(genes.length===1&&g[genes[0]]===(GENES[genes[0]]==='rec'?2:1)&&PHOTO[genes[0]])return {src:PHOTO[genes[0]],reference:false,exact:true,label:genes[0]+'の参考写真'};
 // 2遺伝子以上の複合モルフは、完全一致の実写写真がなければ代用しない。
 return {src:placeholderPhoto('画像未登録'),reference:true,exact:false,label:'複合モルフの画像未登録'};
}
function photoCaption(g){return photoOf(g).label;}

// 外部参照の候補を検索するためのURL生成（画面上には表示しない）
function imageSearchUrl(g){
 const traits=Object.entries(g).filter(([k,v])=>GENES[k]==='rec'?v===2:v>0).map(([k,v])=>((GENES[k]!=='rec'&&v===2)?'super ':'')+({GHI:'GHI','アザンティック':'axanthic','ヒドゥンジンウォマ':'hidden gene woma','コンヒュージョン':'confusion','レッドストライプ':'red stripe','イエローベリー':'yellow belly','デザートゴースト':'desert ghost','オレンジドリーム':'orange dream','ファイア':'fire','モハベ':'mojave','エンチ':'enchi','パステル':'pastel','バナナ':'banana','アルビノ':'albino','パイド':'pied','スパーク':'spark','ゴースト':'ghost','クラウン':'clown','レオパード':'leopard','ファントム':'phantom','スパイダー':'spider','レース':'lace','シャンパン':'champagne'}[k]||k));
 const query=(traits.length?traits.join(' '):'normal')+' ball python morph';
 return 'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(query);
}
function geneDetails(g){
 const entries=Object.entries(g).filter(([_,v])=>v>0);
 if(!entries.length)return 'ノーマル（登録された変異遺伝子なし）';
 return entries.map(([k,v])=>`<span class="gene-tag">${k}：${v}コピー${GENES[k]==='rec'?(v===1?'（ヘテロ）':'（発現）'):(v===2?'（スーパー）':'')}</span>`).join('');
}
function offspringDetails(a,b){
 let genes=[...new Set([...Object.keys(a),...Object.keys(b)])];
 if(!genes.length)return '登録された変異形質はありません。';
 return '<b>子に受け継がれる確率（遺伝子コピー数）</b><p class="muted">各遺伝子座を独立とした学習用の簡略計算です。複数遺伝子の同時出現率ではありません。</p>'+genes.map(k=>{
  const x=(a[k]||0)/2,y=(b[k]||0)/2;
  const p0=(1-x)*(1-y),p2=x*y,p1=1-p0-p2;
  const fmt=v=>Math.round(v*100)+'%';
  return `<div class="offspring-gene"><strong>${k}</strong>：0コピー ${fmt(p0)} ／ 1コピー ${fmt(p1)} ／ 2コピー ${fmt(p2)}</div>`;
 }).join('');
}
