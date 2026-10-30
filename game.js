
let data; try{data=JSON.parse(localStorage.getItem('morph-breeder-v1'))}catch(e){};
if(!data||!Array.isArray(data.snakes)){data={money:280,id:3,snakes:[{id:1,g:{'パステル':1},sex:'♂'},{id:2,g:{'エンチ':1},sex:'♀'}],done:[],hatched:0,discovered:[]}}
let selection=[],pending=null,missionPending=null;
let saleSelection=new Set();
// アップデート前に育てた個体も「発見済み」に引き継ぐ。
if(!Array.isArray(data.doubleHomoDiscovered)){
 data.doubleHomoDiscovered=[...new Set(data.snakes.flatMap(s=>doubleHomoMatches(s.g).map(p=>p.key)))];
}

const missions=[{id:'first',title:'はじめての孵化',desc:'1匹の赤ちゃんを誕生させる',check:()=>data.hatched>=1,word:'パステル',pay:100},{id:'three',title:'3匹のブリーダー',desc:'3匹以上の個体を飼う',check:()=>data.snakes.length>=3,word:'エンチ',pay:120},{id:'pastel',title:'パステル発見',desc:'パステルの子を誕生させる',check:()=>data.discovered.includes('パステル'),word:'パステル',pay:140},{id:'enchi',title:'エンチ発見',desc:'エンチの子を誕生させる',check:()=>data.discovered.includes('エンチ'),word:'エンチ',pay:140},{id:'five',title:'5匹の仲間',desc:'5匹以上の個体を飼う',check:()=>data.snakes.length>=5,word:'バナナ',pay:200},{id:'albino',title:'アルビノに挑戦',desc:'アルビノをコレクションする',check:()=>data.snakes.some(s=>s.g['アルビノ']===2),word:'アルビノ',pay:300},{id:'pied',title:'パイドに挑戦',desc:'パイドをコレクションする',check:()=>data.snakes.some(s=>s.g['パイド']===2),word:'パイド',pay:300},{id:'ten',title:'ベテランブリーダー',desc:'10匹の個体を育てる',check:()=>data.snakes.length>=10,word:'モハベ',pay:320}];
document.addEventListener('error', function(e){if(e.target&&e.target.tagName==='IMG'&&e.target.src.startsWith('http')){e.target.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzE0NjQ1Ii8+PHRleHQgeD0iMjQwIiB5PSIxNDUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lhpnnnJ/jgpLoqq3jgb/ovrzjgoHjgb7jgZvjgpM8L3RleHQ+PHRleHQgeD0iMjQwIiB5PSIxODIiIGZpbGw9IiNjYmQiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuODjeODg+ODiOaOpee2muOCkueiuuiqjeOBl+OBpuOBj+OBoOOBleOBhDwvdGV4dD48L3N2Zz4=';}}, true);
function save(){try{localStorage.setItem('morph-breeder-v1',JSON.stringify(data))}catch(e){}}
function msg(t){let e=document.getElementById('message');e.textContent=t;e.style.display='block';clearTimeout(window.mt);window.mt=setTimeout(()=>e.style.display='none',3000)}
// 同じ遺伝子座にある既知のアレルは、各親から一つずつ受け継ぐ（学習用簡略モデル）。
const SHARED_LOCUS_GROUPS=[['モハベ','レッサー','バンブー','ファントム'],['シナモン','ブラックパステル']];
const SHARED_LOCUS_GENES=new Set(SHARED_LOCUS_GROUPS.flat());
function parentAlleles(g,group){
 const alleles=[];
 for(const gene of group)for(let i=0;i<Math.min(2,g[gene]||0);i++)alleles.push(gene);
 // 古いセーブデータで同一座位が3コピー以上になっていた場合は先頭2コピーを採用。
 return [...alleles.slice(0,2),...Array(Math.max(0,2-alleles.length)).fill(null)];
}
function genetics(g1,g2){
 const out={};
 for(const gene of Object.keys(GENES)){
  if(SHARED_LOCUS_GENES.has(gene))continue;
  const aa=g1[gene]||0,bb=g2[gene]||0;
  const v=(Math.random()<aa/2?1:0)+(Math.random()<bb/2?1:0);
  if(v)out[gene]=v;
 }
 for(const group of SHARED_LOCUS_GROUPS){
  const a=parentAlleles(g1,group),b=parentAlleles(g2,group);
  for(const gene of [a[Math.floor(Math.random()*2)],b[Math.floor(Math.random()*2)]])if(gene)out[gene]=(out[gene]||0)+1;
 }
 return out;
}
function displaySnake(s){let p=photoOf(s.g);return `${photoMarkup(s.g,"蛇の写真")}<div><b>#${s.id} ${nameOf(s.g)}</b><small>${s.sex} ${p.label}</small></div>`}
function refresh(){document.getElementById('money').textContent=data.money;document.getElementById('count').textContent=data.snakes.length;document.getElementById('wins').textContent=data.done.length;renderParents();renderCollection();renderShop();renderMissions();renderPractice();save();applyExternalPhotos()}
function tab(id){for(let s of document.querySelectorAll('main>section'))s.hidden=s.id!==id;for(let b of document.querySelectorAll('nav button'))b.classList.toggle('active',b.id==='tab-'+id);refresh()}
function renderParents(){
 let area=document.getElementById('parents');area.innerHTML='';
 data.snakes.forEach(s=>{let b=document.createElement('button');b.className='animal '+(selection.includes(s.id)?'selected':'');b.innerHTML=displaySnake(s);b.onclick=()=>choose(s.id);area.append(b)});
 ['A','B'].forEach((x,i)=>{
   let box=document.getElementById('parent'+x),s=data.snakes.find(s=>s.id===selection[i]);
   box.innerHTML=s?`<div>${photoMarkup(s.g,"親"+x)}<b>#${s.id} ${nameOf(s.g)}</b><small>${s.sex}</small><small>${photoCaption(s.g)}</small></div>`:`親${x}：未選択`;
   document.getElementById('genes'+x).innerHTML=s?`<b>親${x}の遺伝情報</b><div>${geneDetails(s.g)}</div>`:'親を選ぶと遺伝情報が出ます';
 });
 let a=data.snakes.find(s=>s.id===selection[0]),b=data.snakes.find(s=>s.id===selection[1]);
 document.getElementById('offspring-genes').innerHTML=a&&b?offspringDetails(a.g,b.g):'親2匹を選ぶと、子に伝わる確率を確認できます。';
} 
function choose(id){if(selection.includes(id)){selection=selection.filter(x=>x!==id)}else if(selection.length<2){selection.push(id)}else{selection=[selection[1],id]}renderParents();applyExternalPhotos()}
function resetParents(){selection=[];renderParents();applyExternalPhotos()}
function breed(){if(selection.length!==2)return msg('親を2匹選んでください');if(data.money<30)return msg('コインが足りません。ミッションに挑戦しよう');let a=data.snakes.find(x=>x.id===selection[0]),b=data.snakes.find(x=>x.id===selection[1]);if(a.sex===b.sex)return msg('♂と♀の組み合わせを選んでください');const hazard=['スパイダー','シャンパン','ヒドゥンジンウォマ'];if(hazard.some(g=>(a.g[g]||0)>0)&&hazard.some(g=>(b.g[g]||0)>0))return msg('健康に重大なリスクがある組み合わせのため、この交配はできません');data.money-=30;let baby={id:++data.id,g:genetics(a.g,b.g),sex:Math.random()<.5?'♂':'♀'};pending=baby;document.getElementById('result').innerHTML=`<div class="panel outcome"><h2>🥚 卵が生まれた！</h2><div class="egg">🥚</div><button class="primary" onclick="hatch()">卵をタップして孵化させる</button></div>`;refresh()}
function hatch(){
 if(!pending)return;
 const baby=pending;pending=null;
 data.snakes.push(baby);data.hatched++;
 if(!Array.isArray(data.discovered))data.discovered=[];
 if(!Array.isArray(data.doubleHomoDiscovered))data.doubleHomoDiscovered=[];
 for(const gene of Object.keys(baby.g))if(GENES[gene]==='dom'||baby.g[gene]===2){if(!data.discovered.includes(gene))data.discovered.push(gene)}
 const pairs=doubleHomoMatches(baby.g);
 const newPairs=pairs.filter(p=>!data.doubleHomoDiscovered.includes(p.key));
 for(const p of newPairs)data.doubleHomoDiscovered.push(p.key);
 const p=photoOf(baby.g);
 const discover=newPairs.length?`<div class="panel" style="border:2px solid #f0c35b;text-align:center;background:rgba(240,195,91,.12)"><h2>🌟 NEW！ 隠しモルフ発見！</h2><p>${newPairs.map(x=>x.name).join(' ・ ')}</p><p class="muted">2種類の劣性遺伝子をそれぞれ2コピー持つ、ダブルホモ接合体！</p></div>`:'';
 document.getElementById('result').innerHTML=`<div class="panel outcome"><h2>🎉 誕生！ #${baby.id}</h2>${discover}${photoMarkup(baby.g,'モルフ参考写真')}<h3>${nameOf(baby.g)}</h3><p class="muted">${p.label}</p><p>性別：${baby.sex}　｜　遺伝情報：${Object.entries(baby.g).map(([k,v])=>k+':'+v+'コピー').join('、')||'ノーマル'}</p><p class="muted">劣性遺伝のヘテロ接合は外見に出なくても次世代に伝わります。</p><button onclick="tab('missions')">ミッションを確認</button></div>`;
 refresh();applyExternalPhotos(document.getElementById('result'));
 msg(newPairs.length?'🌟 新しいダブルホモ接合体を発見！':'新しい個体がコレクションに加わりました');
}

function salePrice(s){
  // ノーマルは20コイン。価格はゲームバランス上の値であり市場価格ではない。
  // 単独形質よりスーパー・複合・ダブルホモを高く評価する。
  let visible=0, recessive=0, supers=0, value=20;
  for(const [gene,copies] of Object.entries(s.g||{})){
    const base=prices[gene]||100;
    if(GENES[gene]==='rec'){
      if(copies===2){visible++;recessive++;value+=Math.max(15,Math.round(base*.16));}
      else if(copies===1){value+=5;} // 見た目ノーマルのhetは少額の加算
    }else if(copies>0){
      visible++;value+=Math.max(12,Math.round(base*.16));
      if(copies===2){supers++;value+=Math.max(20,Math.round(base*.20));}
    }
  }
  // 希少な複合モルフへのボーナス（2遺伝子以上）
  if(visible>=2)value+=20*(visible-1)*(visible-1);
  if(recessive>=2)value+=90*(recessive-1); // スノー等のダブルホモ
  if(supers>=2)value+=30*(supers-1);
  return Math.max(20,Math.round(value/5)*5);
}
function canSell(s){return data.snakes.filter(x=>x.sex===s.sex).length>1;}
function validSale(ids){
  const selected=data.snakes.filter(s=>ids.has(s.id));
  const males=data.snakes.filter(s=>s.sex==='♂').length-selected.filter(s=>s.sex==='♂').length;
  const females=data.snakes.filter(s=>s.sex==='♀').length-selected.filter(s=>s.sex==='♀').length;
  return selected.length>0&&males>=1&&females>=1;
}
function sellSnake(id){
  const snake=data.snakes.find(x=>x.id===id);
  if(!snake)return msg('個体が見つかりません');
  if(!canSell(snake))return msg('オスとメスは最低1匹ずつ残してください');
  if(!window.confirm(`#${snake.id} ${nameOf(snake.g)}（${snake.sex}）を ${salePrice(snake)}コインで売りますか？\\n売却した個体は戻せません。`))return;
  sellIds(new Set([id]));
}
function sellIds(ids){
  if(!validSale(ids))return msg('オスとメスを最低1匹ずつ残してください');
  const selected=data.snakes.filter(s=>ids.has(s.id));
  const total=selected.reduce((sum,s)=>sum+salePrice(s),0);
  data.snakes=data.snakes.filter(s=>!ids.has(s.id));
  selection=selection.filter(id=>!ids.has(id));
  saleSelection.clear();data.money+=total;
  refresh();msg(`${selected.length}匹を売却！ +${total}コイン`);
}
function toggleSale(id,checked){
  if(checked)saleSelection.add(id);else saleSelection.delete(id);
  renderCollection();
}
function selectSaleAll(){
  saleSelection.clear();
  // オス・メス各1匹を確実に残す。最後の個体の選び方はID昇順。
  const keep=new Set();
  for(const sex of ['♂','♀']){
    const one=data.snakes.find(s=>s.sex===sex);
    if(one)keep.add(one.id);
  }
  for(const s of data.snakes)if(!keep.has(s.id))saleSelection.add(s.id);
  renderCollection();
}
function clearSaleSelection(){saleSelection.clear();renderCollection();}
function sellSelected(){
  const ids=new Set(saleSelection);
  if(!validSale(ids))return msg('売却する個体を選択し、オス・メス各1匹を残してください');
  const selected=data.snakes.filter(s=>ids.has(s.id));
  const total=selected.reduce((sum,s)=>sum+salePrice(s),0);
  if(!window.confirm(`${selected.length}匹をまとめて ${total}コインで売却しますか？\\n売却した個体は戻せません。`))return;
  sellIds(ids);
}
function renderCollection(){
  const e=document.getElementById('collection-grid');e.innerHTML='';
  saleSelection=new Set([...saleSelection].filter(id=>data.snakes.some(s=>s.id===id)));
  data.snakes.forEach(s=>{
    const c=document.createElement('div');c.className='animal';
    c.innerHTML=displaySnake(s)+`<div class="muted">${Object.entries(s.g).map(([k,v])=>k+' '+v+'/2').join('、')||'変異なし'}</div><div class="sale-line"><label class="sale-check"><input type="checkbox" data-select-id="${s.id}" ${saleSelection.has(s.id)?'checked':''}> まとめ売りに選択</label><span>売却価格：💰 ${salePrice(s)}コイン</span><button class="sell-button" ${canSell(s)?'':'disabled title="交配用にオス・メス各1匹を残します"'} data-sell-id="${s.id}">${canSell(s)?'この個体を売る':'最後の'+(s.sex==='♂'?'オス':'メス')+'は売れません'}</button></div>`;
    c.querySelector('[data-sell-id]').addEventListener('click',()=>sellSnake(s.id));
    c.querySelector('[data-select-id]').addEventListener('change',ev=>toggleSale(s.id,ev.target.checked));
    e.append(c);
  });
  const count=data.snakes.filter(s=>saleSelection.has(s.id)).length;
  const total=data.snakes.filter(s=>saleSelection.has(s.id)).reduce((sum,s)=>sum+salePrice(s),0);
  const summary=document.getElementById('bulk-sale-summary');
  if(summary){summary.textContent=`選択：${count}匹 ／ 合計：${total}コイン`;
    const btn=document.getElementById('bulk-sale-button');btn.disabled=!validSale(saleSelection);
  }
}
function renderShop(){let e=document.getElementById('shop-grid');e.innerHTML='';Object.keys(prices).forEach(g=>{let c=document.createElement('div');c.className='animal';c.innerHTML=`${photoMarkup({[g]:GENES[g]==='rec'?2:1},g)}<div><b>${g}</b><small>${photoCaption({[g]:GENES[g]==='rec'?2:1})}</small><small>${GENES[g]==='rec'?'劣性（ホモ個体）':'不完全優性等（1コピー）'}</small>${['スパイダー','シャンパン','ヒドゥンジンウォマ'].includes(g)?'<small>⚠️ 神経症状・交配制限あり</small>':''}<div>💰 ${prices[g]}</div><button onclick="buy('${g}','♂')">♂ を購入</button> <button onclick="buy('${g}','♀')">♀ を購入</button></div>`;e.append(c)})}
function buy(g,sex){if(data.money<prices[g])return msg('コインが足りません');data.money-=prices[g];data.snakes.push({id:++data.id,g:{[g]:GENES[g]==='rec'?2:1},sex});refresh();msg(g+'を購入しました！')}
function renderMissions(){let e=document.getElementById('mission-list');e.innerHTML='';missions.forEach(m=>{let done=data.done.includes(m.id),available=m.check();let div=document.createElement('div');div.className='panel';div.innerHTML=`<b>${done?'✅ ':available?'⭐ ':'🔒 '}${m.title}</b><div class="muted">${m.desc}　｜　報酬 ${m.pay}コイン</div><button ${done||!available?'disabled':''} onclick="writeMission('${m.id}')">${done?'クリア済み':available?'カタカナ練習へ':'未達成'}</button>`;e.append(div)})}
function writeMission(id){const m=missions.find(m=>m.id===id);if(!m||data.done.includes(id)||!m.check())return;missionPending=m;const e=document.getElementById('mission-list');e.innerHTML=`<div class="panel writing"><h2>✏️ カタカナミッション</h2><p>次のモルフ名をカタカナで、下の白い枠に指やペンで書こう。</p><h2 style="text-align:center;font-size:28px">${m.word}</h2><p class="writing-note">文字数に合わせて書く場所が広がります。長い言葉は左右に動かして書こう。</p><div class="writing-scroll" id="pad-scroll"><canvas id="pad"></canvas></div><div class="flex" style="margin-top:10px"><button onclick="erasePad()">書き直す</button><button class="primary" onclick="completeWriting()">先生と確認してクリア</button><button onclick="renderMissions()">戻る</button></div><p class="muted">自動採点はしません。書いた文字を先生と確認してからクリアしてください。</p></div>`;setTimeout(initPad,0)}
const practiceWords=['パステル','バナナ','アルビノ','パイド','モハベ','エンチ','イエローベリー','ジーエイチアイ','レッドストライプ','スパーク','ゴースト','デザートゴースト','クラウン','レオパード','オレンジドリーム','ファイア','ショップ','キャリー','キャリーケース','シェルター','ピンセット','チューブ','キャップ','アザンティック','ファントム','スパイダー','レース','ヒドゥンジンウォマ','シャンパン','コンヒュージョン','シナモン','ブラックパステル','ピンストライプ','レッサー','スポットノーズ','バンブー','ラベンダーアルビノ','ジェネティックストライプ','サンセット','アシッド','ヘテロ'];
let practiceWord=null,practiceOpen=false,practiceCompleted=0,practiceHistory=[];
if(!Number.isInteger(data.practiceProgress)||data.practiceProgress<0||data.practiceProgress>2)data.practiceProgress=0;
function nextPractice(){const candidates=practiceWords.filter(w=>!practiceHistory.slice(-4).includes(w));practiceWord=candidates[Math.floor(Math.random()*candidates.length)]||practiceWords[Math.floor(Math.random()*practiceWords.length)];practiceOpen=true;renderPractice();setTimeout(initPad,0)}
function renderPractice(){const count=document.getElementById('practice-count');if(!count)return;count.textContent='1問正解で200コイン（何度でも挑戦できる）';const el=document.getElementById('practice-area');if(!practiceOpen){el.innerHTML='<button class="primary" onclick="nextPractice()">🎲 チャレンジ開始</button>';return;}el.innerHTML=`<div class="writing"><p>この言葉をカタカナで書こう！</p><h2 style="text-align:center;font-size:28px">${practiceWord}</h2><p class="writing-note">文字数に合わせて書く場所が広がります。長い言葉は左右に動かして書こう。</p><div class="writing-scroll" id="pad-scroll"><canvas id="pad"></canvas></div><div class="flex" style="margin-top:10px"><button onclick="erasePad()">書き直す</button><button class="primary" onclick="completePractice()">先生と確認して1問クリア</button><button onclick="nextPractice()">別の問題へ</button></div><p class="muted">自動採点ではありません。先生が確認してからクリアしてください。</p></div>`;setTimeout(initPad,0)}
function completePractice(){if(strokes<1)return msg('白い枠にカタカナを書いてね');if(!practiceOpen)return;data.practiceProgress=0;practiceCompleted++;practiceHistory.push(practiceWord);practiceOpen=false;data.money+=200;refresh();msg('正解！ +200コイン')}
let padCtx,strokes=0;
function initPad(){
 const c=document.getElementById('pad');if(!c)return;
 const word=(document.getElementById('practice').hidden ? (missionPending?.word||'') : (practiceWord||''));
 const compact=word.length<=5;
 const desired=Math.max(c.parentElement.clientWidth,word.length*(compact?68:76)+36);
 const width=Math.ceil(desired),height=210;
 c.style.width=width+'px';c.style.height=height+'px';
 const ratio=Math.min(window.devicePixelRatio||1,2);
 c.width=Math.round(width*ratio);c.height=Math.round(height*ratio);
 padCtx=c.getContext('2d');padCtx.setTransform(ratio,0,0,ratio,0,0);
 padCtx.lineWidth=4;padCtx.lineCap='round';padCtx.lineJoin='round';padCtx.strokeStyle='#101a1d';
 strokes=0;let on=false;
 function pos(ev){const r=c.getBoundingClientRect();return [ev.clientX-r.left,ev.clientY-r.top]}
 c.onpointerdown=ev=>{on=true;strokes++;c.setPointerCapture(ev.pointerId);let [x,y]=pos(ev);padCtx.beginPath();padCtx.moveTo(x,y);padCtx.lineTo(x+0.1,y+0.1);padCtx.stroke()};
 c.onpointermove=ev=>{if(!on)return;let[x,y]=pos(ev);padCtx.lineTo(x,y);padCtx.stroke()};
 c.onpointerup=()=>on=false;c.onpointercancel=()=>on=false;
}
function erasePad(){initPad()}
function completeWriting(){if(strokes<1)return msg('まず白い枠に文字を書こう');let m=missionPending;if(!m||data.done.includes(m.id))return;data.done.push(m.id);data.money+=m.pay;missionPending=null;refresh();msg('クリア！ +'+m.pay+'コイン')}
// 交配確率は各遺伝子座独立の簡略モデル。複対立・連鎖・生存性・性連鎖などの特殊例は未対応。
refresh();tab('breed');

