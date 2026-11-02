// 育成・コンテスト追加モード。既存の購入・交配・売却には制限を加えません。
const TRAIN_NAMES=['発色','模様','体格'];
const TRAIN_COST=[100,120,140];
function factorOf(s){return Array.isArray(s.factors)&&s.factors.length===3?s.factors:[1,1,1]}
function inheritFactors(a,b){return TRAIN_NAMES.map((_,i)=>{
 const x=factorOf(a)[i],y=factorOf(b)[i];
 if(x===y)return x;
 // 同じ因子同士は必ず同じ星。異なる場合は低い星から高い星まで抽選。
 const lo=Math.min(x,y),hi=Math.max(x,y);
 return lo+Math.floor(Math.random()*(hi-lo+1));
})}
function trainingOf(s){if(!s.training)s.training={turn:0,stats:[35,35,35],unlock:-1,entry:false,completed:false,contests:[],earned:false};return s.training}
let trainingSelected=null,entryWriting=false,entryStrokes=0;
function chooseTraining(id){trainingSelected=id;entryWriting=false;renderTraining()}
function trainSnake(i){const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;
 const t=trainingOf(s);if(t.completed||t.turn>=12)return msg('育成は終了しています');
 if(data.money<TRAIN_COST[i])return msg('コインが足りません');
 data.money-=TRAIN_COST[i];t.stats[i]=Math.min(t.unlock===i?100:89,t.stats[i]+10+Math.floor(Math.random()*7));t.turn++;
 save();renderTraining();document.getElementById('money').textContent=data.money;
}
function openEntry(){const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;
 const t=trainingOf(s);if(t.entry||t.completed)return msg('この育成ではすでに出場しています');
 entryWriting=true;renderTraining();setTimeout(initEntryPad,0)}
function initEntryPad(){const c=document.getElementById('entry-pad');if(!c)return;const s=data.snakes.find(x=>x.id===trainingSelected);const word=nameOf(s.g);const width=Math.max(c.parentElement.clientWidth,word.length*72+30);c.style.width=width+'px';c.style.height='200px';const dpr=Math.min(devicePixelRatio||1,2);c.width=width*dpr;c.height=200*dpr;const ctx=c.getContext('2d');ctx.scale(dpr,dpr);ctx.strokeStyle='#152026';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';entryStrokes=0;let down=false;const pos=e=>{const r=c.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};c.onpointerdown=e=>{down=true;entryStrokes++;c.setPointerCapture(e.pointerId);const [x,y]=pos(e);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.1,y+.1);ctx.stroke()};c.onpointermove=e=>{if(!down)return;const [x,y]=pos(e);ctx.lineTo(x,y);ctx.stroke()};c.onpointerup=()=>down=false;c.onpointercancel=()=>down=false}
function confirmEntry(){if(entryStrokes<1)return msg('モルフ名をカタカナで書いてください');const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;const t=trainingOf(s);if(t.entry)return;t.entry=true;t.unlock=Math.floor(Math.random()*3);entryWriting=false;save();renderTraining();msg(TRAIN_NAMES[t.unlock]+'の上限が100になりました！')}
function completeTraining(){const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;const t=trainingOf(s);if(t.completed)return;if(t.turn<12)return msg('12ターン育成してください');
 const f=factorOf(s).slice();t.stats.forEach((v,i)=>{const chance=v===100?.4:v>=95?.3:v>=90?.2:0;if(Math.random()<chance)f[i]=3;else if(v>=70)f[i]=Math.max(f[i],2)});s.factors=f;t.completed=true;save();renderTraining();msg('育成完了！ 因子が確定しました')}
function enterContest(kind){const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;const t=trainingOf(s);if(!t.completed)return msg('先に育成を完了してください');if(t.contests.includes(kind))return msg('この大会には出場済みです');const costs=[300,1200,4000],targets=[170,220,260];if(data.money<costs[kind])return msg('参加費が足りません');data.money-=costs[kind];const score=t.stats.reduce((a,b)=>a+b,0)+Math.floor(Math.random()*31)-15;const win=score>=targets[kind];t.contests.push(kind);if(win){if(!Array.isArray(data.hall))data.hall=[];data.hall.push({id:s.id,name:nameOf(s.g),kind,score});}save();renderTraining();document.getElementById('money').textContent=data.money;msg(win?'🏆 入賞！ 展示記録に追加されました':'今回は入賞できませんでした')}
function renderTraining(){const area=document.getElementById('training-area');if(!area)return;const s=data.snakes.find(x=>x.id===trainingSelected);if(!s){area.innerHTML='<h3>育成する個体を選ぶ</h3><div class="training-list">'+data.snakes.map(x=>`<button onclick="chooseTraining(${x.id})">#${x.id} ${nameOf(x.g)} ${x.sex} ${trainingOf(x).completed?'（育成済）':''}</button>`).join('')+'</div>';return}
 const t=trainingOf(s),f=factorOf(s);let html=`<button onclick="chooseTraining(null)">← 個体を選び直す</button><h3>#${s.id} ${nameOf(s.g)} ${s.sex}</h3><p>育成 ${t.turn}/12ターン　｜　因子 ${f.map(x=>'★'.repeat(x)).join(' / ')}</p>`;
 TRAIN_NAMES.forEach((name,i)=>{const cap=t.unlock===i?100:89;html+=`<div class="train-stat"><b>${name} ${t.stats[i]}/${cap}</b>　<small>因子 ${'★'.repeat(f[i])}</small><div class="train-bar"><span style="width:${t.stats[i]}%"></span></div></div>`});
 if(!t.completed){html+='<h3>通常育成</h3><div class="training-list">'+TRAIN_NAMES.map((name,i)=>`<button ${t.turn>=12?'disabled':''} onclick="trainSnake(${i})">${name}を育てる（${TRAIN_COST[i]}コイン）</button>`).join('')+'</div>';
 if(!t.entry){if(!entryWriting)html+='<div class="panel"><h3>🏆 特別コンテスト</h3><p>自分のヘビのモルフ名をカタカナで書いてエントリー。1能力だけランダムで上限100に解放します（1育成につき1回）。</p><button class="primary" onclick="openEntry()">エントリーする</button></div>';
 else html+=`<div class="panel"><h3>エントリーシート</h3><p>「${nameOf(s.g)}」をカタカナで書こう。先生が確認したらエントリー完了。</p><div class="writing-scroll"><canvas id="entry-pad"></canvas></div><div class="training-list"><button onclick="initEntryPad()">書き直す</button><button class="primary" onclick="confirmEntry()">先生と確認してエントリー</button><button onclick="entryWriting=false;renderTraining()">戻る</button></div></div>`;
 }else html+=`<p>🔓 ${TRAIN_NAMES[t.unlock]}の上限解放済み（この育成では再抽選不可）</p>`;
 html+=`<p><button class="primary" ${t.turn<12?'disabled':''} onclick="completeTraining()">育成を終了して因子を確定</button></p>`;
 }else{html+='<h3>コンテスト</h3><p>育成した個体で挑戦。入賞すると展示記録に残ります。賞金はありません。</p><div class="training-list">'+['ビギナー杯','モルフ杯','世界選手権'].map((name,i)=>`<button ${t.contests.includes(i)?'disabled':''} onclick="enterContest(${i})">${name}（${[300,1200,4000][i]}コイン）${t.contests.includes(i)?' 出場済':''}</button>`).join('')+'</div>'}
 html+='<h3>🏅 展示記録</h3>'+((data.hall||[]).length?'<ul>'+(data.hall||[]).map(x=>`<li>#${x.id} ${x.name} — ${['ビギナー杯','モルフ杯','世界選手権'][x.kind]} ${x.score}点</li>`).join('')+'</ul>':'<p class="muted">まだ入賞記録はありません。</p>');area.innerHTML=html}
const originalRefresh=refresh;refresh=function(){originalRefresh();if(!document.getElementById('training').hidden)renderTraining()};
