// --- AYARLAR VE ANALİZ VERİLERİ ---
let generatedCaptcha = "";
let mathSolution = 0;
let riskScore = 0;
let trapTriggered = false;
let mathStartTime = 0;

let mouseMovementScore = 0;
let lastX = 0, lastY = 0;
let linearMovements = 0;
let totalMovements = 0;
let keystrokes = [];

const pageLoadTime = Date.now();
const tempMailDomains = ["10minutemail.com", "guerrillamail.com", "sharklasers.com", "temp-mail.org", "yopmail.com", "mailinator.com", "dispostable.com"];

// --- 1. SİSTEMİ BAŞLAT ---
window.onload = () => {
    generateCaptcha();
    generateMathQuestion();
    mathStartTime = Date.now();
};

// --- 2. BOT TUZAĞI (HONEYPOT) ---
function triggerTrap() {
    trapTriggered = true; // Görünmez butona sadece botlar tıklar
    riskScore += 100;
}

// --- 3. MATEMATİK SORUSU ÜRETİCİ ---
function generateMathQuestion() {
    const n1 = Math.floor(Math.random() * 20) + 1;
    const n2 = Math.floor(Math.random() * 20) + 1;
    mathSolution = n1 + n2;
    document.getElementById("math-question").innerText = `${n1} + ${n2} işleminin sonucu nedir?`;
}

// --- 4. CAPTCHA ÜRETİCİ ---
function generateCaptcha() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    generatedCaptcha = captcha;
    const box = document.getElementById("captcha-box");
    box.innerText = captcha;
    box.style.transform = `rotate(${Math.floor(Math.random() * 10) - 5}deg)`;
}

// --- 5. DAVRANIŞSAL ANALİZ (FARE VE KLAVYE) ---
document.getElementById("mouse-check-area").addEventListener('mousemove', (e) => {
    totalMovements++;
    if (e.clientX === lastX || e.clientY === lastY) linearMovements++; // Düz çizgi kontrolü
    lastX = e.clientX;
    lastY = e.clientY;

    if (mouseMovementScore < 100) {
        mouseMovementScore += 0.8;
        document.getElementById("progress-bar").style.width = mouseMovementScore + "%";
    }
});

document.getElementById("user-input").addEventListener("keydown", () => {
    keystrokes.push(Date.now());
});

// --- 6. FİNAL DOĞRULAMA MOTORU ---
function processFinalVerification() {
    riskScore = 0;
    const email = document.getElementById("user-email").value;
    const mathInput = parseInt(document.getElementById("math-answer").value);
    const captchaInput = document.getElementById("user-input").value;
    const timeSpent = (Date.now() - pageLoadTime) / 1000;
    const mathSolveTime = (Date.now() - mathStartTime) / 1000;

    // A - BOT TUZAĞI KONTROLÜ
    if (trapTriggered) riskScore += 100;

    // B - TEMP MAIL ANALİZİ (+60 Risk)
    const domain = email.split('@')[1];
    const isTemp = tempMailDomains.includes(domain);
    if (isTemp) riskScore += 60;

    // C - MATEMATİK HIZI (+40 Risk)
    // Bir insan soruyu okuyup çözmesi en az 2 saniye sürer.
    if (mathSolveTime < 1.5) riskScore += 40;
    if (mathInput !== mathSolution) { alert("Matematik sonucu yanlış!"); return; }

    // D - FARE DOĞRUSALLIK (+40 Risk)
    const linearityRatio = linearMovements / totalMovements;
    if (linearityRatio > 0.75) riskScore += 40;

    // E - YAZMA HIZI (+20 Risk)
    if (keystrokes.length > 2) {
        const speed = (keystrokes[keystrokes.length - 1] - keystrokes[0]) / keystrokes.length;
        if (speed < 50) riskScore += 30;
    }

    // F - GENEL KONTROLLER
    if (captchaInput !== generatedCaptcha) { alert("Kod hatalı!"); generateCaptcha(); return; }
    if (mouseMovementScore < 90) { alert("Fare analizini tamamlayın!"); return; }

    showResults(isTemp, riskScore);
}

// --- 7. SONUÇLARI GÖSTER ---
function showResults(isTemp, score) {
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("status-screen").classList.remove("hidden");

    const mailDetail = document.getElementById("mail-analysis");
    if (isTemp) {
        mailDetail.innerText = "UYARI: Geçici (Temp) Mail Algılandı!";
        mailDetail.className = "temp-mail";
    } else {
        mailDetail.innerText = "E-posta Sağlayıcısı: Güvenli (Gerçek)";
        mailDetail.className = "real-mail";
    }

    const title = document.getElementById("final-status-title");
    const desc = document.getElementById("final-status-desc");
    
    if (score >= 50) {
        title.innerText = "🤖 ROBOT TESPİT EDİLDİ";
        title.style.color = "#f87171";
        desc.innerText = "Sistemimiz çok hızlı işlem veya doğrusal fare hareketi tespit etti. Erişim engellendi.";
    } else {
        title.innerText = "✅ İNSAN DOĞRULANDI";
        title.style.color = "#4ade80";
        desc.innerText = "Analiz başarılı. Davranışlarınız insani limitler dahilinde bulundu.";
    }

    document.getElementById("score-display").innerHTML = `Siber Risk Puanı: <strong>%${Math.min(score, 100)}</strong>`;
}
