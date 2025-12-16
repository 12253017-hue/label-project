/* =====================
   初期設定
===================== */

// 音声
const clickSound = document.getElementById("clickSound");

// DOM
const qText = document.getElementById("qText");
const qIndex = document.getElementById("qIndex");
const progressFill = document.getElementById("progressFill");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const midBtn = document.getElementById("midBtn");

const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");

const ldFill = document.getElementById("ldFill");
const asdFill = document.getElementById("asdFill");
const adhdFill = document.getElementById("adhdFill");

const ldPct = document.getElementById("ldPct");
const asdPct = document.getElementById("asdPct");
const adhdPct = document.getElementById("adhdPct");

const resultDesc = document.getElementById("resultDesc");
const resultResetBtn = document.getElementById("resultResetBtn");


/* =====================
   音
===================== */

function playClickSound() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}


/* =====================
   質問データ
===================== */

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


/* =====================
   状態
===================== */

let score = { LD: 0, ASD: 0, ADHD: 0 };
let current = 0;
const total = questions.length;


/* =====================
   表示
===================== */

function showQuestion() {
  const q = questions[current];
  qText.textContent = q.text;
  qIndex.textContent = `${current + 1}/${total}`;
  progressFill.style.width = `${Math.round((current / total) * 100)}%`;
}


/* =====================
   回答
===================== */

function answer(choice) {
  playClickSound();

  const type = questions[current].type;
  if (choice === "yes") score[type]++;
  if (choice === "mid") score[type] += 0.5;

  current++;
  current < total ? showQuestion() : showResult();
}


/* =====================
   結果
===================== */

function showResult() {
  questionCard.style.display = "none";
  resultCard.style.display = "block";

  const max = 5;
  const percents = {
    LD: Math.round(Math.min(score.LD, max) / max * 100),
    ASD: Math.round(Math.min(score.ASD, max) / max * 100),
    ADHD: Math.round(Math.min(score.ADHD, max) / max * 100)
  };

  ldFill.style.height = percents.LD + "%";
  asdFill.style.height = percents.ASD + "%";
  adhdFill.style.height = percents.ADHD + "%";

  ldPct.textContent = percents.LD + "%";
  asdPct.textContent = percents.ASD + "%";
  adhdPct.textContent = percents.ADHD + "%";

  const top = Object.keys(percents)
    .filter(k => percents[k] === Math.max(...Object.values(percents)));

  const summary = {
    LD: "学習の進め方や情報処理に特徴があります。",
    ASD: "対人理解や感覚の受け取り方に特徴があります。",
    ADHD: "集中や衝動性に個性があります。"
  };

  // 色分け付き表示
  resultDesc.innerHTML =
    top.length === 1
      ? `最も強く出たのは <span class="result-${top[0]}">${top[0]}</span> です。<br><span class="result-${top[0]}">${summary[top[0]]}</span>`
      : `複数の傾向が近い結果です。<br>${top.map(t => `<span class="result-${t}">${t}: ${summary[t]}</span>`).join("<br>")}`;
}


/* =====================
   リセット
===================== */

function reset() {
  score = { LD: 0, ASD: 0, ADHD: 0 };
  current = 0;

  questionCard.style.display = "block";
  resultCard.style.display = "none";

  ldFill.style.height = asdFill.style.height = adhdFill.style.height = "0%";
  ldPct.textContent = asdPct.textContent = adhdPct.textContent = "0%";

  showQuestion();
}


/* =====================
   イベント
===================== */

yesBtn.addEventListener("click", () => answer("yes"));
noBtn.addEventListener("click", () => answer("no"));
midBtn.addEventListener("click", () => answer("mid"));

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    showQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  current < total - 1 ? (current++, showQuestion()) : showResult();
});

resultResetBtn.addEventListener("click", reset);


/* =====================
   初期表示
===================== */

document.addEventListener("DOMContentLoaded", showQuestion);
