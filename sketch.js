// 狀態控制： 'START' (首頁), 'QUIZ' (測驗中), 'RESULT' (成績頁)
let gameState = 'START';

// 題庫資料定義
const allQuestions = [
  {
    type: 'animation',
    title: '請觀察上方動畫，這是什麼天氣現象？',
    animType: 'sun_cloud',
    options: ['晴時多雲', '狂風暴雨', '大雪紛飛'],
    answer: 0,
    explanation: '太陽與雲朵交替，代表晴時多雲的好天氣。'
  },
  {
    type: 'audio',
    title: '請聽聲音，這是哪一種自然聲音？',
    audioSound: 'rain',
    options: ['雨聲', '風聲', '雷聲'],
    answer: 0,
    explanation: '沙沙的白噪音與濾波聲，模擬的是舒服的雨聲。'
  },
  {
    type: 'audio',
    title: '請聽聲音，這是哪一種聲音？',
    audioSound: 'wind',
    options: ['鳥叫聲', '風聲', '雷聲'],
    answer: 1,
    explanation: '頻率漸變起伏呼呼響起的聲音，是風吹過的聲音。'
  },
  {
    type: 'audio',
    title: '請聽聲音，這是什麼聲音？',
    audioSound: 'thunder',
    options: ['雨聲', '雷聲', '鳥叫聲'],
    answer: 1,
    explanation: '低沉且由大變小的轟隆聲，是打雷的聲音。'
  },
  {
    type: 'audio',
    title: '請聽聲音，這是什麼動物的叫聲？',
    audioSound: 'bird',
    options: ['小鳥', '青蛙', '小貓'],
    answer: 0,
    explanation: '清脆高亢、往上滑音的短音，是小鳥在唱歌。'
  },
  {
    type: 'animation',
    title: '請觀察上方動畫，這個圖示代表什麼？',
    animType: 'lightning',
    options: ['打雷閃電', '下雨天', '出太陽'],
    answer: 0,
    explanation: '閃電線條代表劇烈的打雷閃電現象。'
  },
  {
    type: 'animation',
    title: '請觀察上方動畫，這是什麼天氣？',
    animType: 'rain_drops',
    options: ['下雨天', '晴天', '多雲'],
    answer: 0,
    explanation: '直線下落的水滴代表正在下雨。'
  },
  {
    type: 'animation',
    title: '請觀察上方動畫，這是什麼氣象？',
    animType: 'wind_blow',
    options: ['強風吹拂', '平靜無風', '起霧'],
    answer: 0,
    explanation: '流動的線條代表強風正在吹拂。'
  },
  {
    type: 'audio',
    title: '請聽聲音，這屬於哪一種聲音特效？',
    audioSound: 'bird',
    options: ['鳥叫聲', '風聲', '雨聲'],
    answer: 0,
    explanation: '清脆滑上去的高音正是小鳥清晨的叫聲。'
  },
  {
    type: 'animation',
    title: '請觀察上方動畫，這代表哪種天氣？',
    animType: 'sun_cloud',
    options: ['晴時多雲', '打雷', '下雨'],
    answer: 0,
    explanation: '雲朵與太陽代表天氣晴朗有雲。'
  }
];

let questions = []; // 每次隨機抽出的 8 題
let currentQ = 0;
let userAnswers = []; 
let selectedOption = null; 
let isAnswered = false;
let score = 0;

// Web Audio API 聲音合成器 Context
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    let AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function setup() {
  createCanvas(600, 700);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(245, 247, 250);

  if (gameState === 'START') {
    drawStartScreen();
  } else if (gameState === 'QUIZ') {
    drawQuizScreen();
  } else if (gameState === 'RESULT') {
    drawResultScreen();
  }
}

// ==================== 1. 首頁畫面 ====================
function drawStartScreen() {
  fill(50, 60, 80);
  textSize(32);
  textStyle(BOLD);
  text("天氣小達人：多感官測驗", width / 2, 180);

  textSize(16);
  textStyle(NORMAL);
  fill(100, 110, 120);
  text("每次隨機挑戰 8 道精彩動畫與聲音題", width / 2, 230);

  let btnX = width / 2 - 100;
  let btnY = 360;
  let btnW = 200;
  let btnH = 60;

  let isHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;
  fill(isHover ? color(67, 160, 71) : color(76, 175, 80));
  rect(btnX, btnY, btnW, btnH, 30);

  fill(255);
  textSize(22);
  textStyle(BOLD);
  text("開始測驗", width / 2, btnY + btnH / 2);
}

// ==================== 2. 測驗畫面 ====================
function drawQuizScreen() {
  let q = questions[currentQ];

  // 進度條
  fill(120);
  textSize(16);
  textStyle(BOLD);
  text(`第 ${currentQ + 1} / ${questions.length} 題`, width / 2, 30);

  // 題目敘述
  fill(40);
  textSize(18);
  text(q.title, width / 2, 65);

  // 媒體區域 (動畫或聲音)
  drawMediaArea(q);

  // 下方選項按鈕
  let startY = 320;
  let btnH = 55;
  let gap = 15;

  for (let i = 0; i < q.options.length; i++) {
    let btnY = startY + i * (btnH + gap);
    let btnX = 50;
    let btnW = width - 100;

    if (isAnswered) {
      if (i === q.answer) {
        fill(220, 245, 230); 
        stroke(76, 175, 80);
        strokeWeight(2);
      } else if (i === selectedOption) {
        fill(255, 225, 225); 
        stroke(244, 67, 54);
        strokeWeight(2);
      } else {
        fill(250);
        stroke(220);
        strokeWeight(1);
      }
    } else {
      fill(255);
      stroke(200);
      strokeWeight(1);
    }

    rect(btnX, btnY, btnW, btnH, 12);
    noStroke();

    fill(50);
    textSize(18);
    textStyle(NORMAL);
    text(q.options[i], width / 2, btnY + btnH / 2);
  }

  // 答題後顯示解說與下一題
  if (isAnswered) {
    let isCorrect = (selectedOption === q.answer);
    
    fill(isCorrect ? color(46, 125, 50) : color(198, 40, 40));
    textSize(18);
    textStyle(BOLD);
    text(isCorrect ? "✓ 回答正確！" : "✗ 回答錯誤！", width / 2, 545);

    fill(80);
    textSize(14);
    textStyle(NORMAL);
    text(q.explanation, width / 2, 575);

    let nextBtnX = width / 2 - 80;
    let nextBtnY = 615;
    let nextBtnW = 160;
    let nextBtnH = 45;

    fill(33, 150, 243);
    rect(nextBtnX, nextBtnY, nextBtnW, nextBtnH, 22);

    fill(255);
    textSize(16);
    textStyle(BOLD);
    text(currentQ < questions.length - 1 ? "下一題" : "查看成績", width / 2, nextBtnY + nextBtnH / 2);
  }
}

// 繪製動畫或聲音提示框
function drawMediaArea(q) {
  let areaX = 50;
  let areaY = 90;
  let areaW = width - 100;
  let areaH = 200;

  fill(255);
  stroke(220);
  strokeWeight(1);
  rect(areaX, areaY, areaW, areaH, 16);
  noStroke();

  if (q.type === 'animation') {
    push();
    translate(width / 2, areaY + areaH / 2);
    if (q.animType === 'sun_cloud') {
      fill(255, 193, 7);
      ellipse(-30, -20, 50, 50);
      fill(255);
      ellipse(10, 0, 70, 45);
      ellipse(35, 10, 50, 40);
    } else if (q.animType === 'lightning') {
      fill(255, 215, 0);
      beginShape();
      vertex(0, -50);
      vertex(-20, -10);
      vertex(5, -10);
      vertex(-10, 50);
      vertex(25, -5);
      vertex(0, -5);
      endShape(CLOSE);
    } else if (q.animType === 'rain_drops') {
      fill(33, 150, 243);
      let dropY = (frameCount * 3) % 60;
      ellipse(-30, -30 + dropY, 8, 16);
      ellipse(0, -50 + dropY, 8, 16);
      ellipse(30, -40 + dropY, 8, 16);
    } else if (q.animType === 'wind_blow') {
      stroke(150, 200, 250);
      strokeWeight(3);
      noFill();
      let offset = (frameCount * 2) % 100 - 50;
      curve(-60, -30, -40 + offset, -20, 20 + offset, -20, 60, -30);
      curve(-60, 20, -30 + offset, 10, 30 + offset, 10, 60, 20);
      noStroke();
    }
    pop();
  } else if (q.type === 'audio') {
    fill(238, 242, 255);
    rect(areaX + 10, areaY + 10, areaW - 20, areaH - 20, 12);

    fill(99, 102, 241);
    textSize(48);
    text("🔊", width / 2, areaY + 75);

    textSize(18);
    fill(79, 70, 229);
    textStyle(BOLD);
    text("播放聲音中...", width / 2, areaY + 125); // 已不洩漏答案名稱
    
    textSize(13);
    fill(120);
    textStyle(NORMAL);
    text("（點擊此處可再次聆聽）", width / 2, areaY + 155);
  }
}

// 利用原生 Web Audio API 合成音效（雨聲、風聲、雷聲、鳥叫聲）
function playSynthesizedSound(soundType) {
  let ctx = getAudioContext();
  let now = ctx.currentTime;

  if (soundType === 'rain') {
    // 雨聲：白噪音 + 低通濾波器（沙沙聲）
    let bufferSize = ctx.sampleRate * 1.5;
    let buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    let output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    let whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    let filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);

    let gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start(now);

  } else if (soundType === 'wind') {
    // 風聲：粉紅噪音 + 頻率動態起伏（呼～呼～）
    let bufferSize = ctx.sampleRate * 2.0;
    let buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    let output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    let pinkNoise = ctx.createBufferSource();
    pinkNoise.buffer = buffer;

    let filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(800, now + 1.0);
    filter.frequency.linearRampToValueAtTime(200, now + 2.0);

    let gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

    pinkNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    pinkNoise.start(now);

  } else if (soundType === 'thunder') {
    // 雷聲：布朗噪音（低沉轟隆聲）
    let bufferSize = ctx.sampleRate * 2.0;
    let buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    let output = buffer.getChannelData(0);
    let lastOutput = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      output[i] = (lastOutput + (0.02 * white)) / 1.02;
      lastOutput = output[i];
      output[i] *= 3.5;
    }
    let brownNoise = ctx.createBufferSource();
    brownNoise.buffer = buffer;

    let filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);

    let gain = ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

    brownNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    brownNoise.start(now);

  } else if (soundType === 'bird') {
    // 鳥叫聲：極短且往上滑頻的高音（啾啾聲）
    let playTweet = (delay) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now + delay);
      osc.frequency.exponentialRampToValueAtTime(3200, now + delay + 0.12);

      gain.gain.setValueAtTime(0.3, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.13);
    };

    playTweet(0);
    playTweet(0.18);
    playTweet(0.36);
  }
}

// ==================== 3. 成績結算頁面 ====================
function drawResultScreen() {
  fill(50, 60, 80);
  textSize(28);
  textStyle(BOLD);
  text("測驗完成！", width / 2, 50);

  let totalScore = Math.round((score / questions.length) * 100);
  let stars = totalScore >= 100 ? 3 : totalScore >= 60 ? 2 : totalScore > 0 ? 1 : 0;

  textSize(36);
  let starStr = "★".repeat(stars) + "☆".repeat(3 - stars);
  fill(255, 193, 7);
  text(starStr, width / 2, 95);

  fill(40);
  textSize(20);
  text(`總得分：${totalScore} 分 (答對 ${score} / ${questions.length} 題)`, width / 2, 135);

  // 顯示每題對錯明細
  let startY = 175;
  for (let i = 0; i < questions.length; i++) {
    let itemY = startY + i * 52;
    let isCorr = userAnswers[i] && userAnswers[i].correct;

    fill(255);
    stroke(230);
    rect(40, itemY, width - 80, 46, 8);
    noStroke();

    fill(isCorr ? color(76, 175, 80) : color(244, 67, 54));
    textSize(16);
    textStyle(BOLD);
    text(isCorr ? "✓" : "✗", 65, itemY + 23);

    fill(50);
    textSize(13);
    textAlign(LEFT, CENTER);
    let shortTitle = questions[i].title.length > 22 ? questions[i].title.substring(0, 22) + "..." : questions[i].title;
    text(`第 ${i + 1} 題：${shortTitle}`, 90, itemY + 23);

    textAlign(CENTER, CENTER);
  }

  let btnX = width / 2 - 90;
  let btnY = 625;
  let btnW = 180;
  let btnH = 45;

  fill(76, 175, 80);
  rect(btnX, btnY, btnW, btnH, 22);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("再測驗一次", width / 2, btnY + btnH / 2);
}

// ==================== 4. 滑鼠點擊互動事件 ====================
function mousePressed() {
  getAudioContext(); // 確保每次使用者點擊都喚醒音訊環境

  if (gameState === 'START') {
    let btnX = width / 2 - 100;
    let btnY = 360;
    if (mouseX > btnX && mouseX < btnX + 200 && mouseY > btnY && mouseY < btnY + 60) {
      startQuiz();
    }
  } else if (gameState === 'QUIZ') {
    let q = questions[currentQ];

    // 點擊聲音區塊重新播放
    if (q.type === 'audio' && mouseX > 50 && mouseX < width - 50 && mouseY > 90 && mouseY < 290) {
      playSynthesizedSound(q.audioSound);
    }

    if (!isAnswered) {
      let startY = 320;
      let btnH = 55;
      let gap = 15;

      for (let i = 0; i < q.options.length; i++) {
        let btnY = startY + i * (btnH + gap);
        if (mouseX > 50 && mouseX < width - 50 && mouseY > btnY && mouseY < btnY + btnH) {
          selectedOption = i;
          isAnswered = true;
          let isCorrect = (i === q.answer);
          if (isCorrect) score++;
          userAnswers.push({ correct: isCorrect, userChoice: i });
          break;
        }
      }
    } else {
      let nextBtnX = width / 2 - 80;
      let nextBtnY = 615;
      if (mouseX > nextBtnX && mouseX < nextBtnX + 160 && mouseY > nextBtnY && mouseY < nextBtnY + 45) {
        if (currentQ < questions.length - 1) {
          currentQ++;
          loadQuestion();
        } else {
          gameState = 'RESULT';
        }
      }
    }
  } else if (gameState === 'RESULT') {
    let btnX = width / 2 - 90;
    let btnY = 625;
    if (mouseX > btnX && mouseX < btnX + 180 && mouseY > btnY && mouseY < btnY + 45) {
      startQuiz();
    }
  }
}

// 每次開始時隨機抽選 8 題
function startQuiz() {
  gameState = 'QUIZ';
  currentQ = 0;
  score = 0;
  userAnswers = [];
  
  let shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  questions = shuffled.slice(0, 8);

  loadQuestion();
}

function loadQuestion() {
  isAnswered = false;
  selectedOption = null;
  let q = questions[currentQ];
  if (q.type === 'audio') {
    playSynthesizedSound(q.audioSound);
  }
}