
let data; try{data=JSON.parse(localStorage.getItem('morph-breeder-v1'))}catch(e){};
if(!data||!Array.isArray(data.snakes)){data={money:280,id:3,snakes:[{id:1,g:{'パステル':1},sex:'♂'},{id:2,g:{'エンチ':1},sex:'♀'}],done:[],hatched:0,discovered:[]}}
let selection=[],pending=null,missionPending=null;
const missions=[{id:'first',title:'はじめての孵化',desc:'1匹の赤ちゃんを誕生させる',check:()=>data.hatched>=1,word:'パステル',pay:100},{id:'three',title:'3匹のブリーダー',desc:'3匹以上の個体を飼う',check:()=>data.snakes.length>=3,word:'エンチ',pay:120},{id:'pastel',title:'パステル発見',desc:'パステルの子を誕生させる',check:()=>data.discovered.includes('パステル'),word:'パステル',pay:140},{id:'enchi',title:'エンチ発見',desc:'エンチの子を誕生させる',check:()=>data.discovered.includes('エンチ'),word:'エンチ',pay:140},{id:'five',title:'5匹の仲間',desc:'5匹以上の個体を飼う',check:()=>data.snakes.length>=5,word:'バナナ',pay:200},{id:'albino',title:'アルビノに挑戦',desc:'アルビノをコレクションする',check:()=>data.snakes.some(s=>s.g['アルビノ']===2),word:'アルビノ',pay:300},{id:'pied',title:'パイドに挑戦',desc:'パイドをコレクションする',check:()=>data.snakes.some(s=>s.g['パイド']===2),word:'パイド',pay:300},{id:'ten',title:'ベテランブリーダー',desc:'10匹の個体を育てる',check:()=>data.snakes.length>=10,word:'モハベ',pay:320}];
document.addEventListener('error', function(e){if(e.target&&e.target.tagName==='IMG'&&e.target.src.startsWith('http')){e.target.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzE0NjQ1Ii8+PHRleHQgeD0iMjQwIiB5PSIxNDUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lhpnnnJ/jgpLoqq3jgb/ovrzjgoHjgb7jgZvjgpM8L3RleHQ+PHRleHQgeD0iMjQwIiB5PSIxODIiIGZpbGw9IiNjYmQiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuODjeODg+ODiOaOpee2muOCkueiuuiqjeOBl+OBpuOBj+OBoOOBleOBhDwvdGV4dD48L3N2Zz4=';}}, true);
function save(){try{localStorage.setItem('morph-breeder-v1',JSON.stringify(data))}catch(e){}}
function msg(t){let e=document.getElementById('message');e.textContent=t;e.style.display='block';clearTimeout(window.mt);window.mt=setTimeout(()=>e.style.display='none',3000)}
function genetics(g1,g2){let out={};for(const gene of Object.keys(GENES)){let aa=g1[gene]||0,bb=g2[gene]||0,v=(Math.random()<aa/2?1:0)+(Math.random()<bb/2?1:0);if(v)out[gene]=v;}return out}
function displaySnake(s){let p=photoOf(s.g);return `<img src="${p.src}" alt="蛇の写真"><div><b>#${s.id} ${nameOf(s.g)}</b><small>${s.sex} ${p.label}</small><small>🔎 <a href="${imageSearchUrl(s.g)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">参考画像を検索</a></small></div>`}
function refresh(){document.getElementById('money').textContent=data.money;document.getElementById('count').textContent=data.snakes.length;document.getElementById('wins').textContent=data.done.length;renderParents();renderCollection();renderShop();renderMissions();renderPractice();renderComboCatalog();save()}
function tab(id){for(let s of document.querySelectorAll('main>section'))s.hidden=s.id!==id;for(let b of document.querySelectorAll('nav button'))b.classList.toggle('active',b.id==='tab-'+id);refresh()}
function renderParents(){
 let area=document.getElementById('parents');area.innerHTML='';
 data.snakes.forEach(s=>{let b=document.createElement('button');b.className='animal '+(selection.includes(s.id)?'selected':'');b.innerHTML=displaySnake(s);b.onclick=()=>choose(s.id);area.append(b)});
 ['A','B'].forEach((x,i)=>{
   let box=document.getElementById('parent'+x),s=data.snakes.find(s=>s.id===selection[i]);
   box.innerHTML=s?`<div><img src="${photoOf(s.g).src}" alt="親${x}"><b>#${s.id} ${nameOf(s.g)}</b><small>${s.sex}</small><small>${photoCaption(s.g)}</small></div>`:`親${x}：未選択`;
   document.getElementById('genes'+x).innerHTML=s?`<b>親${x}の遺伝情報</b><div>${geneDetails(s.g)}</div>`:'親を選ぶと遺伝情報が出ます';
 });
 let a=data.snakes.find(s=>s.id===selection[0]),b=data.snakes.find(s=>s.id===selection[1]);
 document.getElementById('offspring-genes').innerHTML=a&&b?offspringDetails(a.g,b.g):'親2匹を選ぶと、子に伝わる確率を確認できます。';
} 
function choose(id){if(selection.includes(id)){selection=selection.filter(x=>x!==id)}else if(selection.length<2){selection.push(id)}else{selection=[selection[1],id]}renderParents()}
function resetParents(){selection=[];renderParents()}
function breed(){if(selection.length!==2)return msg('親を2匹選んでください');if(data.money<30)return msg('コインが足りません。ミッションに挑戦しよう');let a=data.snakes.find(x=>x.id===selection[0]),b=data.snakes.find(x=>x.id===selection[1]);if(a.sex===b.sex)return msg('♂と♀の組み合わせを選んでください');const hazard=['スパイダー','シャンパン','ヒドゥンジンウォマ'];if(hazard.some(g=>(a.g[g]||0)>0)&&hazard.some(g=>(b.g[g]||0)>0))return msg('健康に重大なリスクがある組み合わせのため、この交配はできません');data.money-=30;let baby={id:++data.id,g:genetics(a.g,b.g),sex:Math.random()<.5?'♂':'♀'};pending=baby;document.getElementById('result').innerHTML=`<div class="panel outcome"><h2>🥚 卵が生まれた！</h2><div class="egg">🥚</div><button class="primary" onclick="hatch()">卵をタップして孵化させる</button></div>`;refresh()}
function hatch(){if(!pending)return;let baby=pending;pending=null;data.snakes.push(baby);data.hatched++;for(let gene of Object.keys(baby.g))if(GENES[gene]==='dom'||baby.g[gene]===2){if(!data.discovered.includes(gene))data.discovered.push(gene)}let p=photoOf(baby.g);document.getElementById('result').innerHTML=`<div class="panel outcome"><h2>🎉 誕生！ #${baby.id}</h2><img src="${p.src}" alt="モルフ代表写真"><h3>${nameOf(baby.g)}</h3><p><a href="${imageSearchUrl(baby.g)}" target="_blank" rel="noopener">🔎 このモルフの参考画像を検索</a></p><p class="muted">${p.label}</p><p>性別：${baby.sex}　｜　遺伝情報：${Object.entries(baby.g).map(([k,v])=>k+':'+v+'コピー').join('、')||'ノーマル'}</p><p class="muted">劣性遺伝のヘテロ接合は外見に出なくても次世代に伝わります。</p><button onclick="tab('missions')">ミッションを確認</button></div>`;refresh();msg('新しい個体がコレクションに加わりました')}
function salePrice(s){
  // A predictable in-game price: 50% of the gene purchase cost; partial carriers are valued at 25%.
  let value=0;
  for(const [gene,copies] of Object.entries(s.g)){
    const base=prices[gene]||100;
    if(GENES[gene]==='rec') value+=copies===2?base:Math.floor(base/4);
    else value+=Math.round(base*(copies===2?1.5:1));
  }
  return Math.max(30,Math.round(value/2/10)*10);
}
function canSell(s){
  // Keep one male and one female so the learner can always continue breeding.
  return data.snakes.filter(x=>x.sex===s.sex).length>1;
}
function sellSnake(id){
  const snake=data.snakes.find(x=>x.id===id);
  if(!snake)return msg('個体が見つかりません');
  if(!canSell(snake))return msg('交配を続けられるように、オスとメスを最低1匹ずつ残してください');
  const price=salePrice(snake);
  if(!window.confirm(`#${snake.id} ${nameOf(snake.g)}（${snake.sex}）を ${price}コインで売りますか？\n売却した個体は元に戻せません。`))return;
  // Recheck for duplicate taps before modifying data.
  if(!data.snakes.some(x=>x.id===id)||!canSell(snake))return;
  data.snakes=data.snakes.filter(x=>x.id!==id);
  selection=selection.filter(x=>x!==id);
  data.money+=price;
  refresh();
  msg(`${price}コイン獲得しました！`);
}
function renderCollection(){let e=document.getElementById('collection-grid');e.innerHTML='';data.snakes.forEach(s=>{let c=document.createElement('div');c.className='animal';c.innerHTML=displaySnake(s)+`<div class="muted">${Object.entries(s.g).map(([k,v])=>k+' '+v+'/2').join('、')||'変異なし'}</div><div class="sale-line"><span>売却価格：💰 ${salePrice(s)}コイン</span><button class="sell-button" ${canSell(s)?'':'disabled title="交配用にオス・メス各1匹を残します"'} data-sell-id="${s.id}">${canSell(s)?'この個体を売る':'最後の'+(s.sex==='♂'?'オス':'メス')+'は売れません'}</button></div>`;c.querySelector('[data-sell-id]').addEventListener('click',()=>sellSnake(s.id));e.append(c)})}
function renderShop(){let e=document.getElementById('shop-grid');e.innerHTML='';Object.keys(prices).forEach(g=>{let c=document.createElement('div');c.className='animal';c.innerHTML=`<img src="${photoOf({[g]:GENES[g]==='rec'?2:1}).src}" alt="${g}"><div><b>${g}</b><small>${photoCaption({[g]:GENES[g]==='rec'?2:1})}</small><small>${GENES[g]==='rec'?'劣性（ホモ個体）':'不完全優性等（1コピー）'}</small>${['スパイダー','シャンパン','ヒドゥンジンウォマ'].includes(g)?'<small>⚠️ 神経症状・交配制限あり</small>':''}<div><a target="_blank" rel="noopener" href="${imageSearchUrl({[g]:GENES[g]==='rec'?2:1})}">🔎 参考画像検索</a></div><div>💰 ${prices[g]}</div><button onclick="buy('${g}','♂')">♂ を購入</button> <button onclick="buy('${g}','♀')">♀ を購入</button></div>`;e.append(c)})}
function buy(g,sex){if(data.money<prices[g])return msg('コインが足りません');data.money-=prices[g];data.snakes.push({id:++data.id,g:{[g]:GENES[g]==='rec'?2:1},sex});refresh();msg(g+'を購入しました！')}
function renderMissions(){let e=document.getElementById('mission-list');e.innerHTML='';missions.forEach(m=>{let done=data.done.includes(m.id),available=m.check();let div=document.createElement('div');div.className='panel';div.innerHTML=`<b>${done?'✅ ':available?'⭐ ':'🔒 '}${m.title}</b><div class="muted">${m.desc}　｜　報酬 ${m.pay}コイン</div><button ${done||!available?'disabled':''} onclick="writeMission('${m.id}')">${done?'クリア済み':available?'カタカナ練習へ':'未達成'}</button>`;e.append(div)})}
function writeMission(id){const m=missions.find(m=>m.id===id);if(!m||data.done.includes(id)||!m.check())return;missionPending=m;const e=document.getElementById('mission-list');e.innerHTML=`<div class="panel writing"><h2>✏️ カタカナミッション</h2><p>次のモルフ名をカタカナで、下の白い枠に指やペンで書こう。</p><h2 style="text-align:center;font-size:28px">${m.word}</h2><p class="writing-note">文字数に合わせて書く場所が広がります。長い言葉は左右に動かして書こう。</p><div class="writing-scroll" id="pad-scroll"><canvas id="pad"></canvas></div><div class="flex" style="margin-top:10px"><button onclick="erasePad()">書き直す</button><button class="primary" onclick="completeWriting()">先生と確認してクリア</button><button onclick="renderMissions()">戻る</button></div><p class="muted">自動採点はしません。書いた文字を先生と確認してからクリアしてください。</p></div>`;setTimeout(initPad,0)}
const practiceWords=['パステル','バナナ','アルビノ','パイド','モハベ','エンチ','イエローベリー','ジーエイチアイ','レッドストライプ','スパーク','ゴースト','デザートゴースト','クラウン','レオパード','オレンジドリーム','ファイア','ショップ','キャリー','キャリーケース','シェルター','ピンセット','チューブ','キャップ','アザンティック','ファントム','スパイダー','レース','ヒドゥンジンウォマ','シャンパン','コンヒュージョン','ヘテロ'];
let practiceWord=null,practiceOpen=false,practiceCompleted=0,practiceHistory=[];
if(!Number.isInteger(data.practiceProgress)||data.practiceProgress<0||data.practiceProgress>2)data.practiceProgress=0;
function nextPractice(){const candidates=practiceWords.filter(w=>!practiceHistory.slice(-4).includes(w));practiceWord=candidates[Math.floor(Math.random()*candidates.length)]||practiceWords[Math.floor(Math.random()*practiceWords.length)];practiceOpen=true;renderPractice();setTimeout(initPad,0)}
function renderPractice(){const count=document.getElementById('practice-count');if(!count)return;count.textContent='1問正解で100コイン（何度でも挑戦できる）';const el=document.getElementById('practice-area');if(!practiceOpen){el.innerHTML='<button class="primary" onclick="nextPractice()">🎲 チャレンジ開始</button>';return;}el.innerHTML=`<div class="writing"><p>この言葉をカタカナで書こう！</p><h2 style="text-align:center;font-size:28px">${practiceWord}</h2><p class="writing-note">文字数に合わせて書く場所が広がります。長い言葉は左右に動かして書こう。</p><div class="writing-scroll" id="pad-scroll"><canvas id="pad"></canvas></div><div class="flex" style="margin-top:10px"><button onclick="erasePad()">書き直す</button><button class="primary" onclick="completePractice()">先生と確認して1問クリア</button><button onclick="nextPractice()">別の問題へ</button></div><p class="muted">自動採点ではありません。先生が確認してからクリアしてください。</p></div>`;setTimeout(initPad,0)}
function completePractice(){if(strokes<1)return msg('白い枠にカタカナを書いてね');if(!practiceOpen)return;data.practiceProgress=0;practiceCompleted++;practiceHistory.push(practiceWord);practiceOpen=false;data.money+=100;refresh();msg('正解！ +100コイン')}
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

function renderComboCatalog(){
 const box=document.getElementById('combo-catalog-grid');if(!box)return;box.innerHTML='';
 for(const item of COMBO_CATALOG){const card=document.createElement('div');card.className='animal';
  const q=imageSearchUrl(item.genes);
  const pic=item.image?`<img src="${item.image}" alt="${item.name}">`:`<div class="combo-empty">写真未登録</div>`;
  card.innerHTML=pic+`<div><b>${item.name}</b><small>${item.image?'登録写真あり':'登録待ち'}</small><a href="${q}" target="_blank" rel="noopener">実物の参考画像を検索 ↗</a></div>`;box.appendChild(card);
 }
}
