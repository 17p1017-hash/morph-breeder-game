// 育成・大会 v3：飼育判断、継続イベント、因子継承、審査演出
const TRAIN_NAMES=['発色','模様','体格'];
// v5: 10ターン、毎ターン異なる選択イベント。コイン支出は任意。
const TRAIN_TURNS=10;
const SCENES=[
 {title:'🐍 飼育初日',story:'新しい環境に来たヘビは、隠れ家に入ってじっとしています。',choices:[['静かな隠れ家を用意する',0,[1,2,0],9],['ケージを整えて観察する',30,[2,1,1],6],['すぐに触ってみる',0,[0,0,0],-12],['飼育記録をつけて静かに観察する',0,[0,1,0],5]]},
 {title:'🐭 給餌の時間',story:'体格と食欲を観察して、今日の給餌方針を決めましょう。',choices:[['適切なサイズのエサを選ぶ',25,[0,0,5],4],['エサのサイズを確認してから与える',10,[0,1,3],6],['無理にたくさん与える',40,[0,0,1],-14],['給餌を見送り体調を観察する',0,[0,0,0],5]]},
 {title:'💧 湿度が下がってきた',story:'湿度計がいつもより低い値を示しています。',choices:[['湿度を適切に調整する',45,[3,2,0],9],['湿った隠れ家を用意する',65,[2,3,0],11],['そのままにする',0,[0,0,0],-12],['湿度計を再確認して換気も調整する',15,[1,1,0],7]]},
 {title:'🐍 脱皮の前兆',story:'目が白っぽくなり、脱皮が近づいています。どう対応しますか？',choices:[['適切な湿度を保ち静かに見守る',40,[3,3,0],10],['湿った隠れ家を設置する',70,[2,4,0],12],['無理に皮を剥がそうとする',0,[0,0,0],-20],['触らずに脱皮が終わるのを待つ',0,[1,0,0],4]]},
 {title:'🔍 脱皮後のチェック',story:'脱皮した皮を見つけました。皮が一部残っているようです。',choices:[['目や尾先を確認し、必要なら獣医に相談',120,[2,2,0],12],['飼育環境を見直して経過を観察',35,[2,1,0],5],['気にせず放置する',0,[0,0,0],-18],['残皮の場所を記録して獣医に相談する',100,[1,1,0],10]]},
 {title:'🐭 エサを食べない',story:'いつものエサに反応しません。脱皮や環境の変化も考えられます。',choices:[['温度や隠れ家を確認し、無理な給餌を控える',30,[1,2,0],10],['エサの種類やサイズを見直す',35,[0,1,3],5],['何度もエサを押し付ける',0,[0,0,0],-15],['しばらく給餌を控え体調を記録する',0,[0,0,0],6]]},
 {title:'🌿 ケージの模様替え',story:'動き回る時間が増えてきました。どう環境を整えますか？',choices:[['登り木と隠れ家を整える',75,[1,4,1],7],['清潔さと温湿度を重視する',35,[3,2,0],8],['何も変えない',0,[0,0,1],0],['隠れ家の位置を見直す',15,[0,1,1],5]]},
 {title:'🏥 体調の変化',story:'普段より元気がなく、気になる様子です。',choices:[['爬虫類を診られる獣医師に相談する',180,[1,1,1],18],['温湿度を確認して状態を記録し受診を検討',25,[1,1,0],2],['何もせず放置する',0,[0,0,0],-22],['受診まで保温と安静を維持する',35,[0,0,0],7]]},
 {title:'✨ 大会に向けた準備',story:'あと少しで育成終了。どんな強みを引き出しますか？',choices:[['脱皮・皮膚の状態を整える',45,[5,0,0],5],['模様が映える展示環境を整える',45,[0,5,0],5],['適切な給餌と休息で体格を整える',45,[0,0,5],5],['体調を整えて休息を優先する',0,[1,0,0],9]]},
 {title:'🏆 最後の仕上げ',story:'いよいよ育成最終日。ヘビの様子を見て、最後の判断をしましょう。',choices:[['体調を最優先して休ませる',0,[1,1,1],12],['発色のコンディションを整える',40,[5,0,0],4],['模様の見せ方を工夫する',40,[0,5,0],4],['体格のコンディションを整える',40,[0,0,5],4]]}
];
function factorOf(s){return Array.isArray(s.factors)&&s.factors.length===3?s.factors:[1,1,1]}
function inheritFactors(a,b){return TRAIN_NAMES.map((_,i)=>{let x=factorOf(a)[i],y=factorOf(b)[i];if(x===y)return x;return Math.min(x,y)+Math.floor(Math.random()*(Math.abs(x-y)+1))})}
const FACTOR_INITIAL_BONUS={0:0,1:3,2:6,3:10};
const FACTOR_GROWTH_CHANCE={0:0,1:.10,2:.25,3:.50};
const TRAIN_BASE_STAT=12;
function trainingOf(s){if(!s.training){let f=factorOf(s);s.training={turn:0,stats:f.map(v=>TRAIN_BASE_STAT+(FACTOR_INITIAL_BONUS[v]||0)),unlock:-1,entry:false,completed:false,contests:[],earned:false,health:90,issue:null,log:[]}}let t=s.training;if(t.health==null)t.health=90;if(!t.log)t.log=[];if(!t.contests)t.contests=[];return t}
let trainingSelected=null,entryWriting=false,entryStrokes=0,contestScene=null;
function chooseTraining(id){trainingSelected=id;entryWriting=false;contestScene=null;renderTraining()}
function snakeNow(){return data.snakes.find(x=>x.id===trainingSelected)}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function chooseCare(i){
 const s=snakeNow();if(!s)return;const t=trainingOf(s);
 if(t.completed||t.turn>=TRAIN_TURNS)return;
 const scene=SCENES[t.turn],choice=scene.choices[i];if(!choice)return;
 if(data.money<choice[1])return msg('コインが足りません');
 data.money-=choice[1];
 // 各選択肢の得意分野を維持しつつ、通常成長は各能力最大2、合計最大3。
 let gain=choice[2].map(v=>Math.min(2,Math.max(0,v)));
 let budget=3;
 gain=gain.map(v=>{const actual=Math.min(v,budget);budget-=actual;return actual});
 if(t.health<50)gain=gain.map(v=>Math.floor(v/2));
 // 因子は「追加成長の抽選」。1能力+1、1ターン合計最大3を維持。
 const factors=factorOf(s);
 const bonus=[0,0,0];
 let remaining=3-gain.reduce((a,b)=>a+b,0);
 const candidates=[0,1,2].filter(j=>gain[j]>0 && gain[j]<3);
 // 選択肢で伸びる能力だけを対象にする。
 for(const j of candidates){
  if(remaining<=0)break;
  if(Math.random()<(FACTOR_GROWTH_CHANCE[factors[j]]||0)){
   bonus[j]=1;remaining--;
  }
 }
 const before=t.stats.slice();
 t.stats=t.stats.map((v,j)=>clamp(v+gain[j]+bonus[j],0,t.unlock===j?100:89));
 const actual=t.stats.map((v,j)=>v-before[j]);
 t.health=clamp(t.health+choice[3],0,100);t.turn++;
 t.log.unshift(`第${t.turn}ターン「${scene.title}」：${choice[0]}（発色+${actual[0]}・模様+${actual[1]}・体格+${actual[2]}）`);
 t.log=t.log.slice(0,10);save();refresh();renderTraining();
}
function openEntry(){const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;
 const t=trainingOf(s);if(t.entry||t.completed)return msg('この育成ではすでに出場しています');
 entryWriting=true;renderTraining();setTimeout(initEntryPad,0)}
function initEntryPad(){const c=document.getElementById('entry-pad');if(!c)return;const s=data.snakes.find(x=>x.id===trainingSelected);const word=nameOf(s.g);const width=Math.max(c.parentElement.clientWidth,word.length*72+30);c.style.width=width+'px';c.style.height='200px';const dpr=Math.min(devicePixelRatio||1,2);c.width=width*dpr;c.height=200*dpr;const ctx=c.getContext('2d');ctx.scale(dpr,dpr);ctx.strokeStyle='#152026';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';entryStrokes=0;let down=false;const pos=e=>{const r=c.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};c.onpointerdown=e=>{down=true;entryStrokes++;c.setPointerCapture(e.pointerId);const [x,y]=pos(e);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.1,y+.1);ctx.stroke()};c.onpointermove=e=>{if(!down)return;const [x,y]=pos(e);ctx.lineTo(x,y);ctx.stroke()};c.onpointerup=()=>down=false;c.onpointercancel=()=>down=false}
function confirmEntry(){if(entryStrokes<1)return msg('モルフ名をカタカナで書いてください');const s=data.snakes.find(x=>x.id===trainingSelected);if(!s)return;const t=trainingOf(s);if(t.entry)return;t.entry=true;t.unlock=Math.floor(Math.random()*3);entryWriting=false;save();renderTraining();msg(TRAIN_NAMES[t.unlock]+'の上限が100になりました！')}

function completeTraining(){let s=snakeNow();if(!s)return;let t=trainingOf(s);if(t.completed)return;if(t.turn<TRAIN_TURNS)return msg('10ターン育成してください');let f=factorOf(s).slice();t.stats.forEach((v,i)=>{let chance=v===100?.4:v>=95?.3:v>=90?.2:0;if(Math.random()<chance)f[i]=3;else if(v>=60&&Math.random()<.08)f[i]=3;else if(v>=35)f[i]=Math.max(f[i],2)});s.factors=f;t.completed=true;t.log.unshift('育成完了！ 因子が確定しました');save();renderTraining();msg('育成完了！ 因子が確定しました')}
function enterContest(kind){let s=snakeNow();if(!s)return;let t=trainingOf(s);if(!t.completed)return msg('先に育成を完了してください');if(t.contests.includes(kind))return msg('出場済みです');let costs=[100,250,500],targets=[135,185,240];if(data.money<costs[kind])return msg('参加費が足りません');data.money-=costs[kind];let score=t.stats.reduce((a,b)=>a+b,0)+Math.floor(Math.random()*21)-10+Math.round((t.health-70)/5);let win=score>=targets[kind];t.contests.push(kind);if(win){if(!Array.isArray(data.hall))data.hall=[];data.hall.push({id:s.id,name:nameOf(s.g),kind,score})}contestScene={kind,score,win,step:0,stats:t.stats.slice()};save();refresh();renderTraining()}
function nextContestScene(){if(!contestScene)return;contestScene.step++;if(contestScene.step>4)contestScene=null;renderTraining()}
function renderTraining(){let area=document.getElementById('training-area');if(!area)return;let s=snakeNow();if(!s){area.innerHTML='<h3>育成する個体を選ぶ</h3><div class="training-list">'+data.snakes.map(x=>`<button onclick="chooseTraining(${x.id})">#${x.id} ${nameOf(x.g)} ${x.sex} ${trainingOf(x).completed?'（育成済）':''}</button>`).join('')+'</div>';return}
 let t=trainingOf(s),f=factorOf(s);let html=`<button onclick="chooseTraining(null)">← 個体一覧</button><div class="train-hero">${photoMarkup(s.g,'育成中のボールパイソン')}<div><h3>#${s.id} ${nameOf(s.g)} ${s.sex}</h3><p>育成 ${Math.min(t.turn,TRAIN_TURNS)}/${TRAIN_TURNS}ターン</p><p>因子 ${f.map(x=>'★'.repeat(x)).join(' / ')}</p><p class="muted">因子効果：初期値 +3 / +6 / +10、成長追加抽選 10% / 25% / 50%</p></div></div>`;
 TRAIN_NAMES.forEach((n,i)=>{let cap=t.unlock===i?100:89;html+=`<div class="train-stat"><b>${n} ${t.stats[i]}/${cap}</b><small>　因子 ${'★'.repeat(f[i])}</small><div class="train-bar"><span style="width:${t.stats[i]}%"></span></div></div>`});html+=`<div class="train-stat"><b>💚 健康 ${t.health}/100</b><div class="train-bar health"><span style="width:${t.health}%"></span></div></div>`;
 if(contestScene){let c=contestScene,steps=['出場個体紹介','第1審査：発色','第2審査：模様','最終審査：体格','結果発表'];html+=`<div class="contest-stage"><p>🏆 ${['ビギナー杯','モルフ杯','世界選手権'][c.kind]}</p><h2>${steps[c.step]}</h2>${c.step===0?`<p>${nameOf(s.g)}が審査会場に登場！</p>`:c.step<4?`<p>${TRAIN_NAMES[c.step-1]}：${c.stats[c.step-1]}点</p><p>審査員が評価しています……</p>`:`<h2>${c.win?'🥇 入賞おめでとう！':'惜しくも入賞ならず'}</h2><p>総合 ${c.score}点</p>`}<button class="primary" onclick="nextContestScene()">${c.step===4?'結果を閉じる':'次の審査へ ▶'}</button></div>`;area.innerHTML=html;return}
 if(!t.completed){if(t.turn<TRAIN_TURNS){let ev=SCENES[t.turn];html+=`<div class="train-choice"><p>第${t.turn+1}ターン / ${TRAIN_TURNS}</p><h3>${ev.title}</h3><p>${ev.story}</p><div class="training-list">`+ev.choices.map((c,i)=>`<button onclick="chooseCare(${i})">${c[0]}（${c[1]}C）</button>`).join('')+'</div><p class="muted">選択すると1ターン進みます。毎回異なる場面が登場します。</p></div>'}
 if(!t.entry){if(!entryWriting)html+='<div class="panel"><h3>🏆 特別コンテスト</h3><p>モルフ名をカタカナで書いてエントリー。ランダムで1能力の上限が100に解放されます。</p><button onclick="openEntry()">エントリーする</button></div>';else html+=`<div class="panel"><h3>エントリーシート</h3><p>「${nameOf(s.g)}」をカタカナで書こう。先生と確認しよう。</p><div class="writing-scroll"><canvas id="entry-pad"></canvas></div><div class="training-list"><button onclick="initEntryPad()">書き直す</button><button onclick="confirmEntry()">先生と確認してエントリー</button><button onclick="entryWriting=false;renderTraining()">戻る</button></div></div>`}else html+=`<p>🔓 ${TRAIN_NAMES[t.unlock]}の上限解放済み</p>`;
 html+=`<p><button ${t.turn<TRAIN_TURNS?'disabled':''} onclick="completeTraining()">育成終了・因子を確定</button></p>`;
 }else html+='<h3>🏆 コンテストに挑戦</h3><div class="training-list">'+['ビギナー杯','モルフ杯','世界選手権'].map((n,i)=>`<button ${t.contests.includes(i)?'disabled':''} onclick="enterContest(${i})">${n}（${[100,250,500][i]}C）</button>`).join('')+'</div>';
 html+='<h3>📖 飼育日誌</h3><div class="train-diary">'+(t.log.length?t.log.map(x=>`<p>${x}</p>`).join(''):'<p>まだ記録はありません。</p>')+'</div><h3>🏅 展示記録</h3>'+((data.hall||[]).length?'<ul>'+(data.hall||[]).map(x=>`<li>#${x.id} ${x.name} — ${['ビギナー杯','モルフ杯','世界選手権'][x.kind]} ${x.score}点</li>`).join('')+'</ul>':'<p>まだ入賞記録はありません。</p>');area.innerHTML=html;if(entryWriting)setTimeout(initEntryPad,0)}
const originalRefresh=refresh;refresh=function(){originalRefresh();if(!document.getElementById('training').hidden)renderTraining()};
