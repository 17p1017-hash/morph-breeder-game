function nameOf(g){let names=Object.keys(g).filter(k=>GENES[k]==='dom'?g[k]>=1:g[k]===2);if(!names.length)return 'ノーマル';return names.map(k=>(GENES[k]==='dom'&&g[k]===2?'スーパー':'')+k).join(' × ')}
const SPECIAL_PHOTOS={
  normal:'https://nwreptiles.com/images/xm295/Normal-Ball-Python.jpg',
  superPastel:'https://cdn11.bigcommerce.com/s-g64jf8ws/images/stencil/1280x1280/products/552/2465/SUPER_PASTEL__40444.1573564352.jpg?c=2',
  yellowBellyFire:'https://d20zyr0oabjxc2.cloudfront.net/variants/media/raw_images/jbaud/2023/05/20230529193702.400-IMG_0569-1500x1500s-1.jpeg?signature=C4E865145FC2249DF3989EC91E0F0DE65990D607EE06361DB9CF6FE85043023A'
};
// 登録済みの複合モルフ画像を遺伝子名・コピー数で厳密照合。
function visibleGenes(g){return Object.fromEntries(Object.entries(g).filter(([k,v])=>GENES[k]==='rec'?v===2:v>=1));}
function sameGenotype(a,b){const ka=Object.keys(a).sort(),kb=Object.keys(b).sort();return ka.length===kb.length&&ka.every((k,i)=>k===kb[i]&&a[k]===b[k]);}
function photoOf(g){
 const visible=visibleGenes(g); const genes=Object.keys(visible);
 const exact=COMBO_CATALOG.find(item=>item.image&&sameGenotype(item.genes,visible));
 if(exact)return {src:exact.image,reference:false,exact:true,label:exact.name+'（登録済み複合モルフ写真）',credit:exact.credit||''};
 if(!genes.length)return {src:SPECIAL_PHOTOS.normal,reference:false,exact:true,label:'ノーマルの参考写真'};
 if(genes.length===1&&genes[0]==='パステル'&&g['パステル']===2)return {src:SPECIAL_PHOTOS.superPastel,reference:false,exact:true,label:'スーパーパステルの参考写真'};
 if(genes.length===2&&genes.includes('イエローベリー')&&genes.includes('ファイア')&&g['イエローベリー']===1&&g['ファイア']===1)return {src:SPECIAL_PHOTOS.yellowBellyFire,reference:false,exact:true,label:'イエローベリー×ファイアの参考写真（外部画像）'};
 if(genes.length===1&&g[genes[0]]===(GENES[genes[0]]==='rec'?2:1)&&PHOTO[genes[0]])return {src:PHOTO[genes[0]],reference:false,exact:true,label:genes[0]+'の参考写真'};
 // 部分一致の画像は、何遺伝子一致しているかを明示して使う。
 const candidates=COMBO_CATALOG.filter(item=>item.image&&Object.entries(item.genes).every(([k,v])=>visible[k]===v));
 candidates.sort((a,b)=>Object.keys(b.genes).length-Object.keys(a.genes).length);
 if(candidates.length){const p=candidates[0];return {src:p.image,reference:true,exact:false,label:p.name+'の参考写真（'+Object.keys(p.genes).length+'/'+genes.length+'形質が一致）'};}
 const available=genes.filter(k=>PHOTO[k]);
 if(available.length){available.sort((a,b)=>(prices[b]||0)-(prices[a]||0));const k=available[0];return {src:PHOTO[k],reference:true,exact:false,label:k+'の参考写真（複合モルフの完全一致画像ではありません）'};}
 return {src:SPECIAL_PHOTOS.normal,reference:true,exact:false,label:'ノーマルの参考写真（遺伝子構成は一致しません）'};
}
function photoCaption(g){return photoOf(g).label;}


// 複合モルフの完全一致画像がないときは検索へのリンクを提供。検索結果は外部サイトです。
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
