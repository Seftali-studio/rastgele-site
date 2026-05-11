// --- AYARLAR VE VERİ TOPLAMA ---
let generatedCaptcha = "";
const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const pageLoadTime = Date.now();

let riskScore = 0;
let mouseMovementScore = 0;
let lastX = 0, lastY = 0;
let linearMovements = 0;
let totalMovements = 0;
let keystrokes = [];

const tempMailDomains = ["10minutemail.com", "guerrillamail.com", "sharklasers.com", "temp-mail.org", "yopmail.com", "mailinator.com"];

// --- 1. CAPTCHA SİSTEMİ ---
function generateCaptcha() {
    const display = document.getElementById("captcha-box");
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    generatedCaptcha = captcha;
    display.innerText = captcha;
    const rot = Math.floor(Math.random() * 10) - 5;
    display.style.transform = `rotate(${rot}deg)`;
}

// --- 2. KLAVYE RİTMİ ANALİZİ ---
document.getElementById("user-input").addEventListener("keydown", (e) => {
    keystrokes.push(Date.now());
});

// --- 3. GELİŞMİŞ FARE ANALİZİ (DÜZ ÇİZGİ TESPİTİ) ---
const mouseArea = document.getElementById("mouse-check-area");
mouseArea.addEventListener('mousemove', (e) => {
    totalMovements++;
    
    // Robotlar genelde X veya Y ekseninde mükemmel sabitlikte ilerler
    if (e.clientX === lastX || e.clientY === lastY) {
        linearMovements++;
    }
    
    lastX = e.clientX;
    lastY = e.clientY;

    if (mouseMovementScore < 100) {
        mouseMovementScore += 0.7;
        document.getElementById("progress-bar").style.width = mouseMovementScore + "%";
    }
});

// --- 4. RİSK HESAPLAMA VE ANALİZ MOTORU ---
function processFinalVerification() {
    riskScore = 0;
    const email = document.getElementById("user-email").value;
    const captchaInput = document.getElementById("user-input").value;
    const timeSpent = (Date.now() - pageLoadTime) / 1000;

    // A - Geçici Mail Kontrolü (+50 Risk)
    const domain = email.split('@')[1];
    if (tempMailDomains.includes(domain)) riskScore += 50;

    // B - Hız Kontrolü (+30 Risk)
    if (timeSpent < 6) riskScore += 30;

    // C - Fare Doğrusallık Kontrolü (+40 Risk)
    // Hareketlerin %70'inden fazlası mükemmel düzse robot şüphesi artar
    const linearityRatio = linearMovements / totalMovements;
    if (linearityRatio > 0.7) riskScore += 40;

    // D - Yazma Hızı Kontrolü (+20 Risk)
    if (keystrokes.length > 2) {
        const speed = (keystrokes[keystrokes.length - 1] - keystrokes[0]) / keystrokes.length;
        if (speed < 60) riskScore += 20; // 60ms altı vuruşlar insan dışıdır
    }

    // E - Captcha Yanlışsa
    if (captchaInput !== generatedCaptcha) {
        alert("Güvenlik kodu eşleşmiyor!");
        generateCaptcha();
        return;
    }

    // F - Eksik İşlem
    if (mouseMovementScore < 90) {
        alert("Fare analizini tamamlamadınız!");
        return;
    }

    showFinalStatus();
}

// --- 5. SONUÇ EKRANI YÖNETİMİ ---
function showFinalStatus() {
    const authContainer = document.getElementById("auth-container");
    const statusScreen = document.getElementById("status-screen");
    const title = document.getElementById("final-status-title");
    const desc = document.getElementById("final-status-desc");
    const scoreDisp = document.getElementById("score-display");

    authContainer.classList.add("hidden");
    statusScreen.classList.remove("hidden");

    if (riskScore >= 50) {
        // ROBOT TESPİTİ
        title.innerText = "ROBOT TESPİT EDİLDİ";
        title.style.color = "#f87171";
        desc.innerText = "Hareketleriniz mekanik ve alışılmadık derecede hızlı. Sistem erişiminizi durdurdu.";
    } else {
        // İNSAN TESPİTİ
        title.innerText = "DOĞRULAMA ONAYLANDI";
        title.style.color = "#4ade80";
        desc.innerText = "Analiz tamamlandı. Davranışsal verileriniz bir insanla eşleşiyor.";
    }

    scoreDisp.innerHTML = `Saptanan Risk Oranı: <strong>%${Math.min(riskScore, 100)}</strong>`;
}

window.onload = generateCaptcha;
