// --- AYARLAR VE VERİ SETLERİ ---
let generatedCaptcha = "";
let mathSolution = 0;
let riskScore = 0;
let trapTriggered = false;
let mathStartTime = 0;
let pageLoadTime = Date.now();

let mouseMovementScore = 0;
let lastX = 0, lastY = 0;
let totalMovements = 0;
let linearMovements = 0;
let roboticJitterCount = 0;
let keystrokes = [];

// --- 1. SİSTEM BAŞLATICI ---
window.onload = () => {
    generateCaptcha();
    generateMathQuestion();
    mathStartTime = Date.now();
    console.log("Siber Güvenlik v5.2 Aktif - Analiz motoru hazır.");
};

// --- 2. BOT TUZAĞI (HONEYPOT) ---
function triggerTrap() {
    trapTriggered = true;
    riskScore += 100;
}

// --- 3. MATEMATİK MOTORU ---
function generateMathQuestion() {
    const n1 = Math.floor(Math.random() * 15) + 5;
    const n2 = Math.floor(Math.random() * 15) + 5;
    mathSolution = n1 + n2;
    document.getElementById("math-question").innerText = `${n1} + ${n2} sonucu nedir?`;
}

// --- 4. CAPTCHA ÜRETİCİ ---
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let captcha = "";
    for (let i = 0; i < 6; i++) captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    generatedCaptcha = captcha;
    const box = document.getElementById("captcha-box");
    box.innerText = captcha;
    box.style.transform = `rotate(${Math.floor(Math.random() * 8) - 4}deg)`;
}

// --- 5. FARE DAVRANIŞ ANALİZİ ---
const mouseArea = document.getElementById("mouse-check-area");
mouseArea.addEventListener('mousemove', (e) => {
    totalMovements++;
    
    // Düz çizgi (Robotik) kontrolü
    if (e.clientX === lastX || e.clientY === lastY) linearMovements++;

    // Yapay Titreme (Jitter) kontrolü
    let diffX = Math.abs(e.clientX - lastX);
    let diffY = Math.abs(e.clientY - lastY);
    if ((diffX > 0 && diffX < 2) && (diffY > 0 && diffY < 2)) roboticJitterCount++;

    lastX = e.clientX;
    lastY = e.clientY;

    if (mouseMovementScore < 100) {
        mouseMovementScore += 1.2;
        document.getElementById("progress-bar").style.width = mouseMovementScore + "%";
        if(mouseMovementScore >= 100) {
            document.getElementById("jitter-status").innerText = "Tarama Tamamlandı";
            document.getElementById("jitter-status").style.color = "#4ade80";
        }
    }
});

// --- 6. FİNAL ANALİZ MOTORU (v5.2 ÖZEL) ---
function processFinalVerification() {
    riskScore = 0;
    const email = document.getElementById("user-email").value.toLowerCase().trim();
    const mathInput = parseInt(document.getElementById("math-answer").value);
    const captchaInput = document.getElementById("user-input").value;
    
    const domain = email.split('@')[1] || "";
    const namePart = email.split('@')[0] || "";
    const mathSolveTime = (Date.now() - mathStartTime) / 1000;

    // A - MAİL ANALİZİ (Gelişmiş)
    const badDomains = ["deapad.com", "hotayov.com", "tempmail.org", "guerrillamail.com", "mail.tm"];
    const goodDomains = ["gmail.com", "outlook.com", "hotmail.com", "icloud.com", "yahoo.com", "yandex.com"];
    
    let mailStatus = "Güvenli";
    let isTemp = badDomains.includes(domain);
    let isSuspicious = false;

    // v315 gibi rakam analizi
    const digitMatch = namePart.match(/\d/g);
    if (digitMatch && digitMatch.length >= 3) {
        riskScore += 40;
        isSuspicious = true;
    }

    if (isTemp) {
        riskScore += 90;
        mailStatus = "YASAKLI";
    } else if (isSuspicious || !goodDomains.includes(domain)) {
        riskScore += 30;
        mailStatus = "ŞÜPHELİ";
    }

    // B - DAVRANIŞ ANALİZİ
    let behaviorStatus = "Normal";
    const linearityRatio = linearMovements / totalMovements;
    const jitterRatio = roboticJitterCount / totalMovements;

    if (linearityRatio > 0.55 || jitterRatio > 0.25 || mathSolveTime < 1.8) {
        riskScore += 55;
        behaviorStatus = "Robotik";
    }

    // C - TUZAK KONTROLÜ
    if (trapTriggered) riskScore = 100;

    // D - KRİTİK HATA KONTROLLERİ
    if (isNaN(mathInput) || mathInput !== mathSolution) { alert("Matematik cevabı hatalı!"); return; }
    if (captchaInput !== generatedCaptcha) { alert("Güvenlik kodu yanlış!"); generateCaptcha(); return; }
    if (mouseMovementScore < 95) { alert("Lütfen fare analizini tamamlayın!"); return; }

    renderResults(mailStatus, behaviorStatus, riskScore);
}

// --- 7. SONUÇLARI EKRANA YANSIT ---
function renderResults(mailStatus, behaviorStatus, score) {
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("status-screen").classList.remove("hidden");

    const mailEl = document.getElementById("mail-type-res");
    const behaviorEl = document.getElementById("behavior-res");
    const riskEl = document.getElementById("risk-score-res");
    const title = document.getElementById("final-status-title");
    const desc = document.getElementById("final-status-desc");

    // Mail Durumu Renklendirme
    mailEl.innerText = mailStatus;
    if (mailStatus === "YASAKLI") mailEl.className = "status-danger";
    else if (mailStatus === "ŞÜPHELİ") mailEl.className = "status-warning";
    else mailEl.className = "status-safe";

    // Davranış Durumu Renklendirme
    behaviorEl.innerText = behaviorStatus;
    behaviorEl.className = behaviorStatus === "Robotik" ? "status-danger" : "status-safe";

    // Risk Skoru
    const finalScore = Math.min(score, 100);
    riskEl.innerText = `%${finalScore}`;
    riskEl.className = finalScore >= 50 ? "status-danger" : "status-safe";

    if (finalScore >= 50) {
        title.innerText = "🤖 ERİŞİM REDDEDİLDİ";
        title.className = "status-danger";
        desc.innerText = "Analiz motorumuz yüksek riskli davranışlar veya geçici mail kullanımı tespit etti.";
    } else {
        title.innerText = "✅ DOĞRULAMA BAŞARILI";
        title.className = "status-safe";
        desc.innerText = "Davranışlarınız ve kimliğiniz sistem tarafından güvenli olarak işaretlendi.";
    }

    document.getElementById("score-display").innerHTML = `Güven Yüzdesi: <strong>%${100 - finalScore}</strong>`;
}
