// 育成・大会 v3：飼育判断、継続イベント、因子継承、審査演出
const TRAIN_NAMES=['発色','模様','体格'];
// v5: 10ターン、毎ターン異なる選択イベント。コイン支出は任意。
const TRAIN_TURNS=10;
const SCENES=[
 {title:'🐍 あたらしい おうち',story:'かくれ家から あまり出てきません。どうしますか？',choices:[['かくれ家を もう1つ ふやす',40,[0,1,0],8],['部屋を しずかにして ようすを見る',0,[1,0,0],7],['ケージの あたたかさを たしかめる',20,[0,0,1],6],['夜の ようすを カメラで見る',50,[0,1,0],5]]},
 {title:'🐭 エサの じかん',story:'エサに きょうみは あるようです。からだの 大きさも たしかめましょう。',choices:[['からだに あう マウスを えらぶ',25,[0,0,2],5],['からだに あう ラットを えらぶ',40,[0,0,2],5],['まず 体重を はかってから えらぶ',10,[0,1,1],7],['今日は エサを あげず ようすを みる',0,[1,0,0],3]]},
 {title:'💧 しつどが ひくい！',story:'しつど計が いつもより ひくい 数字です。水入れも かわいています。',choices:[['水入れを 大きなものに かえる',35,[1,0,0],7],['しめった かくれ家を つくる',50,[1,1,0],9],['しつど計の ばしょを かえて はかる',15,[0,1,0],6],['床材を しつどが たもちやすいものに かえる',45,[1,0,1],8]]},
 {title:'🐍 だっぴの まえぶれ',story:'目が 白っぽく なりました。だっぴが 近そうです。',choices:[['しめった かくれ家を つかう',50,[1,1,0],8],['しつどを はかって かんりする',20,[1,0,0],8],['さわらずに しずかに すごさせる',0,[0,1,0],7],['かくれ家の 中を かんさつする',0,[0,1,0],4]]},
 {title:'🔍 だっぴの あと',story:'ぬけた皮が ありました。しっぽの 先に 皮が のこっているかも。',choices:[['目と しっぽを かんさつして 記録する',0,[0,1,0],6],['しつどと かくれ家を みなおす',35,[1,0,0],7],['ヘビを みられる じゅういさんに そうだん',120,[0,1,0],12],['ぬけた皮を ひろげて たしかめる',0,[0,1,0],5]]},
 {title:'🐭 エサを 食べない',story:'エサを 食べません。きのうは ケージが 少し さむかったようです。',choices:[['ケージの あたたかさを たしかめる',20,[0,0,1],10],['エサの 大きさを みなおす',30,[0,0,2],5],['かくれ家を ふやして 休ませる',40,[0,1,0],6],['食べない 日を 記録して ようすを見る',0,[0,1,0],4]]},
 {title:'🌿 ケージの もようがえ',story:'夜に よく 動いています。どんな おうちに しますか？',choices:[['のぼれる 木を おく',60,[0,1,1],6],['かくれ家を 2つに する',40,[0,1,0],8],['床材を あたらしく する',30,[1,0,0],6],['水入れの ばしょを かえる',15,[1,0,0],5]]},
 {title:'🏥 ちょっと しんぱい',story:'いつもより 元気が なく、口の まわりが ぬれているようです。',choices:[['ヘビを みられる じゅういさんに そうだん',180,[0,0,1],18],['体温と しつどを はかって 記録する',20,[0,1,0],1],['しずかな ところで 休ませる',0,[0,0,0],0],['ケージを あたためて ようすを見る',35,[0,0,1],-2]]},
 {title:'✨ たいかいの じゅんび',story:'もうすぐ たいかい。どこを みせたいですか？',choices:[['だっぴの あとの 色を きれいに みせる',30,[2,0,0],5],['もようが 見やすい はいけいに する',30,[0,2,0],5],['体重と からだの ようすを しらべる',20,[0,0,2],6],['今日は しずかに 休ませる',0,[0,0,0],10]]},
 {title:'🏆 さいごの 1日',story:'いよいよ さいごの ターン。どんな じゅんびを しますか？',choices:[['色が 見やすい あかりを えらぶ',35,[2,0,0],4],['もようが 見やすい ばしょを えらぶ',35,[0,2,0],4],['からだの きろくを まとめる',20,[0,0,2],5],['しずかな ばしょで 休ませる',0,[0,0,0],10]]}
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
 if(data.money<choice[1])return msg('コインが たりません');
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

function completeTraining(){
 let s=snakeNow();if(!s)return;let t=trainingOf(s);if(t.completed)return;
 if(t.turn<TRAIN_TURNS)return msg('10ターン育成してください');
 const f=factorOf(s).slice();
 // ★1→★2は22以上で確定、★2→★3は30以上で毎回20%抽選。1回の育成で2段階飛ばない。
 t.stats.forEach((v,i)=>{
  if(f[i]<2 && v>=22)f[i]=2;
  else if(f[i]===2 && v>=30 && Math.random()<.20)f[i]=3;
 });
 s.factors=f;t.completed=true;t.log.unshift('育成完了！ 因子が確定しました');save();renderTraining();msg('育成完了！ 因子が確定しました')
}
function enterContest(kind){
 let s=snakeNow();if(!s)return;let t=trainingOf(s);
 if(!t.completed)return msg('先に育成を完了してください');
 if(t.contests.includes(kind))return msg('出場済みです');
 if((data.entryTickets||0)<1)return msg('🎟️ チケットがありません。カタカナチャレンジでゲットしよう！');
 const costs=[100,250,500],targets=[75,105,140];
 if(data.money<costs[kind])return msg('参加費が足りません');
 data.money-=costs[kind];data.entryTickets--;
 // 因子の星数が大会にも影響。★1でも各能力+2点、★2:+4、★3:+7。
 const factorBonus=factorOf(s).reduce((sum,star)=>sum+({0:0,1:2,2:4,3:7}[star]||0),0);
 const score=t.stats.reduce((a,b)=>a+b,0)+factorBonus+Math.floor(Math.random()*11)-5+Math.round((t.health-70)/10);
 const win=score>=targets[kind];t.contests.push(kind);
 if(win){if(!Array.isArray(data.hall))data.hall=[];data.hall.push({id:s.id,name:nameOf(s.g),kind,score})}
 contestScene={kind,score,win,step:0,stats:t.stats.slice(),factorBonus};save();refresh();renderTraining()
}
function nextContestScene(){if(!contestScene)return;contestScene.step++;if(contestScene.step>4)contestScene=null;renderTraining()}
function renderTraining(){let area=document.getElementById('training-area');if(!area)return;let s=snakeNow();if(!s){area.innerHTML='<h3>そだてる ヘビを えらぶ</h3><div class="training-list">'+data.snakes.map(x=>`<button onclick="chooseTraining(${x.id})">#${x.id} ${nameOf(x.g)} ${x.sex} ${x.locked?'🔒 ':''}${trainingOf(x).completed?'（育成済）':''}${(x.training?.contests||[]).length?' 🏆出場ずみ':''}</button>`).join('')+'</div>';return}
 let t=trainingOf(s),f=factorOf(s);let html=`<button onclick="chooseTraining(null)">← ヘビの いちらん</button><div class="train-hero">${photoMarkup(s.g,'育成中のボールパイソン')}<div><h3>#${s.id} ${nameOf(s.g)} ${s.sex}</h3><p>育成 ${Math.min(t.turn,TRAIN_TURNS)}/${TRAIN_TURNS}ターン</p><p>因子 ${f.map(x=>'★'.repeat(x)).join(' / ')}</p><p class="muted">因子効果：初期値 +3 / +6 / +10、成長追加抽選 10% / 25% / 50%</p></div></div>`;
 TRAIN_NAMES.forEach((n,i)=>{let cap=t.unlock===i?100:89;html+=`<div class="train-stat"><b>${n} ${t.stats[i]}/${cap}</b><small>　因子 ${'★'.repeat(f[i])}</small><div class="train-bar"><span style="width:${t.stats[i]}%"></span></div></div>`});html+=`<div class="train-stat"><b>💚 健康 ${t.health}/100</b><div class="train-bar health"><span style="width:${t.health}%"></span></div></div>`;
 if(contestScene){let c=contestScene,steps=['出場個体紹介','第1審査：発色','第2審査：模様','最終審査：体格','結果発表'];html+=`<div class="contest-stage"><p>🏆 ${['ビギナー杯','モルフ杯','世界選手権'][c.kind]}</p><h2>${steps[c.step]}</h2>${c.step===0?`<p>${nameOf(s.g)}が審査会場に登場！</p>`:c.step<4?`<p>${TRAIN_NAMES[c.step-1]}：${c.stats[c.step-1]}点</p><p>審査員が評価しています……</p>`:`<h2>${c.win?'🥇 入賞おめでとう！':'惜しくも入賞ならず'}</h2><p>総合 ${c.score}点（因子ボーナス +${c.factorBonus||0}）</p>`}<button class="primary" onclick="nextContestScene()">${c.step===4?'結果を閉じる':'次の審査へ ▶'}</button></div>`;area.innerHTML=html;applyExternalPhotos(area);return}
 if(!t.completed){if(t.turn<TRAIN_TURNS){let ev=SCENES[t.turn];html+=`<div class="train-choice"><p>第${t.turn+1}ターン / ${TRAIN_TURNS}</p><h3>${ev.title}</h3><p>${ev.story}</p><div class="training-list">`+ev.choices.map((c,i)=>`<button onclick="chooseCare(${i})">${c[0]}（${c[1]}C）</button>`).join('')+'</div><p class="muted">1つ えらぶと つぎの ターンへ すすみます。</p></div>'}
 if(!t.entry){if(!entryWriting)html+='<div class="panel"><h3>🏆 特別コンテスト</h3><p>モルフ名をカタカナで書いてエントリー。ランダムで1能力の上限が100に解放されます。</p><button onclick="openEntry()">エントリーする</button></div>';else html+=`<div class="panel"><h3>エントリーシート</h3><p>「${nameOf(s.g)}」をカタカナで書こう。先生と確認しよう。</p><div class="writing-scroll"><canvas id="entry-pad"></canvas></div><div class="training-list"><button onclick="initEntryPad()">書き直す</button><button onclick="confirmEntry()">先生と確認してエントリー</button><button onclick="entryWriting=false;renderTraining()">戻る</button></div></div>`}else html+=`<p>🔓 ${TRAIN_NAMES[t.unlock]}の上限解放済み</p>`;
 html+=`<p><button ${t.turn<TRAIN_TURNS?'disabled':''} onclick="completeTraining()">育成終了・因子を確定</button></p>`;
 }else html+='<h3>🏆 コンテストに挑戦</h3><div class="training-list">'+['ビギナー杯','モルフ杯','世界選手権'].map((n,i)=>`<button ${t.contests.includes(i)?'disabled':''} onclick="enterContest(${i})">${n}（${[100,250,500][i]}C）</button>`).join('')+'</div>';
 html+='<h3>📖 そだてた きろく</h3><div class="train-diary">'+(t.log.length?t.log.map(x=>`<p>${x}</p>`).join(''):'<p>まだ記録はありません。</p>')+'</div><h3>🏅 展示記録</h3>'+((data.hall||[]).length?'<ul>'+(data.hall||[]).map(x=>`<li>#${x.id} ${x.name} — ${['ビギナー杯','モルフ杯','世界選手権'][x.kind]} ${x.score}点</li>`).join('')+'</ul>':'<p>まだ入賞記録はありません。</p>');area.innerHTML=html;applyExternalPhotos(area);if(entryWriting)setTimeout(initEntryPad,0)}
const originalRefresh=refresh;refresh=function(){originalRefresh();if(!document.getElementById('training').hidden)renderTraining()};
