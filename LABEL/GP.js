// GP.js


// 音声要素を取得
    const clickSound = document.getElementById("clickSound");

    // 音を鳴らす関数
    function playClickSound() {
      clickSound.currentTime = 0; // 毎回先頭から再生
      clickSound.play().catch(err => {
     console.log("音再生エラー:", err);
      });
    }

const retryBtn = document.getElementById("resetBtn");

retryBtn.addEventListener("click", reset);


    // 各ボタンに音を紐づけ
    document.getElementById("yesBtn").addEventListener("click", playClickSound);
    document.getElementById("noBtn").addEventListener("click", playClickSound);
    document.getElementById("midBtn").addEventListener("click", playClickSound);


// 質問リスト（LD / ASD / ADHD 各5問）
const questions = [
  { text: "文字や文章を読むとき、内容を追うのが人より疲れることがある", type: "LD" },
  { text: "暗記や順序の理解が苦手で、教えられた通りに覚えにくい", type: "LD" },
  { text: "指示や説明の細かい手順が抜け落ちがちである", type: "LD" },
  { text: "読む・書く・計算の一部が不得手で、対人スキルは問題ない", type: "LD" },
  { text: "情報を整理するのが苦手で、書き出すと楽になることが多い", type: "LD" },

  { text: "会話の中で相手の表情や微細な意図が読み取りにくいことがある", type: "ASD" },
  { text: "特定のルールや手順に強いこだわりがあり、それが乱れると不安になる", type: "ASD" },
  { text: "感覚（音・光・匂い・触感）に敏感で日常に影響が出ることがある", type: "ASD" },
  { text: "友人との雑談や世間話を自然に続けるのが難しいと感じる", type: "ASD" },
  { text: "興味の対象が非常に限定され、それに深くのめり込むことがある", type: "ASD" },

  { text: "集中し続けるのが難しく、すぐ別のことに気が向く", type: "ADHD" },
  { text: "計画より行動優先になりやすく、後で困ることがある", type: "ADHD" },
  { text: "忘れ物や約束をうっかり忘れることが多い", type: "ADHD" },
  { text: "じっとしているのが苦手で、そわそわ落ち着かないことがある", type: "ADHD" },
  { text: "思いつきで動いて失敗する一方、発想力や行動力は強みだと感じる", type: "ADHD" }
];

// スコア管理
let score = { LD:0, ASD:0, ADHD:0 };
let current = 0;
const total = questions.length;


// 戻る/進む機能
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

backBtn.addEventListener("click", () => {
  if(current > 0){
    current--;
    showQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if(current < total - 1){
    current++;
    showQuestion();
  } else {
    showResult();
  }
});


// DOM
const qText = document.getElementById("qText");
const qIndex = document.getElementById("qIndex");
const progressFill = document.getElementById("progressFill");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const midBtn = document.getElementById("midBtn");
const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");
const ldFill = document.getElementById("ldFill");
const asdFill = document.getElementById("asdFill");
const adhdFill = document.getElementById("adhdFill");
const ldPct = document.getElementById("ldPct");
const asdPct = document.getElementById("asdPct");
const adhdPct = document.getElementById("adhdPct");
const resultDesc = document.getElementById("resultDesc");
const backToStartBtn = document.getElementById("backToStart");

if (backToStartBtn) {
  backToStartBtn.addEventListener("click", () => {
    
    // 音鳴らす（入れたいなら）
    clickSound.currentTime = 0;
    clickSound.play();

    // 一番上にスクロール
    window.scrollTo({ top: 0, behavior: "smooth" });

    // ページをリロードして最初の状態に戻す
    setTimeout(() => {
      location.reload();
    }, 400); // 音が鳴ってからリロードするため
  });
}





// 初期表示
function showQuestion(){
  const q = questions[current];
  qText.textContent = q.text;
  qIndex.textContent = `${current+1}/${total}`;
  const pct = Math.round((current/total)*100);
  progressFill.style.width = pct + "%";
}

// 回答処理
function answer(choice){
  const t = questions[current].type;
  if(choice === 'yes') score[t]++;
  else if(choice === 'mid') score[t] += 0.5;

  current++;
  if(current < total){
    showQuestion();
  } else {
    showResult();
  }
}

// 結果表示
function showResult(){
  questionCard.style.display = "none";
  resultCard.style.display = "block";

  const maxPer = 5;
  const ldPercent = Math.round(Math.min(score.LD, maxPer)/maxPer*100);
  const asdPercent = Math.round(Math.min(score.ASD, maxPer)/maxPer*100);
  const adhdPercent = Math.round(Math.min(score.ADHD, maxPer)/maxPer*100);

  ldFill.style.height = ldPercent + "%";
  asdFill.style.height = asdPercent + "%";
  adhdFill.style.height = adhdPercent + "%";
  ldPct.textContent = ldPercent + "%";
  asdPct.textContent = asdPercent + "%";
  adhdPct.textContent = adhdPercent + "%";

  const scores = [
    { key: "LD", v: ldPercent },
    { key: "ASD", v: asdPercent },
    { key: "ADHD", v: adhdPercent }
  ];
  const maxV = Math.max(ldPercent, asdPercent, adhdPercent);
  const top = scores.filter(s => s.v === maxV).map(s => s.key);

  const summaries = {
    LD: "学習に関する得意・不得意の傾向が見られます。",
    ASD: "相手の表情・微妙な意図や感覚面の特徴があります。",
    ADHD: "集中の持続や衝動、忘れやすさなどの傾向があります。"
  };

  let desc = "";
  if(maxV === 0){
    desc = "今回の回答では顕著な偏りは見られませんでした。";
  } else if(top.length === 1){
    desc = `もっとも高かったのは <span class="result-${top[0]}">${top[0]}</span> の傾向です。<br>${summaries[top[0]]}`;
  } else {
    desc = `複数の傾向が近い結果になりました（${top.map(t=>`<span class="result-${t}">${t}</span>`).join(" / ")}）。<br>`;
    desc += top.map(t => `<span class="result-${t}">${summaries[t]}</span>`).join("<br>");
  }

  resultDesc.innerHTML = desc;
}

// リセット
function reset(){
  score = { LD:0, ASD:0, ADHD:0 };
  current = 0;
  questionCard.style.display = "block";
  resultCard.style.display = "none";
  showQuestion();
  ldFill.style.height = "0%";
  asdFill.style.height = "0%";
  adhdFill.style.height = "0%";
  ldPct.textContent = "0%";
  asdPct.textContent = "0%";
  adhdPct.textContent = "0%";
}



// イベント
yesBtn.addEventListener("click", ()=> answer('yes'));
noBtn.addEventListener("click", ()=> answer('no'));
midBtn.addEventListener("click", ()=> answer('mid'));
retryBtn.addEventListener("click", reset);


// キーボード操作
document.addEventListener("keydown", (e)=>{
  if(questionCard.style.display === "none") return;
  if(e.key==="Enter"||e.key==="1") answer('yes');
  else if(e.key==="2") answer('no');
  else if(e.key==="3") answer('mid');
});

function showResult {
  document.getElementById("question-area").style.display = "none";
  document.getElementById("resultArea").style.display = "block";
  document.getElementById("backToStart").style.display = "block";
}

const resultResetBtn = document.getElementById("resultResetBtn");
if(resultResetBtn){
  resultResetBtn.addEventListener("click", reset);
}


// 最初に表示
showQuestion();


