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
let roboticJitterCount = 0; // Yapay titreme takibi
let keystrokes = [];

// Dev Temp Mail Listesi
const tempMailDomains = [
    "10minutemail.com", "guerrillamail.com", "sharklasers.com", "temp-mail.org", 
    "yopmail.com", "mailinator.com", "dispostable.com", "dropmail.me", 
    "moakt.com", "tempmailaddress.com", "getnada.com", "fakemail.net"
];

// --- 1. SİSTEM BAŞLATICI ---
window.onload = () => {
    generateCaptcha();
    generateMathQuestion();
    mathStartTime = Date.now();
    console.log("Siber Güvenlik v5 Aktif.");
};

// --- 2. BOT TUZAĞI (HONEYPOT) ---
function triggerTrap() {
    trapTriggered = true;
    riskScore += 100; // Görünmez butona basan direkt elenir
}

// --- 3. MATEMATİK MOTORU ---
function generateMathQuestion() {
    const n1 = Math.floor(Math.random() * 15) + 5;
    const n2 = Math.floor(Math.random() * 15) + 5;
    mathSolution = n1 + n2;
    const mathLabel = document.getElementById("math-question");
    if(mathLabel) mathLabel.innerText = `${n1} + ${n2} sonucu nedir?`;
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

// --- 5. DERİN FARE ANALİZİ (JITTER & LINEARITY) ---
const mouseArea = document.getElementById("mouse-check-area");
mouseArea.addEventListener('mousemove', (e) => {
    totalMovements++;
    
    // A - Düz Çizgi Kontrolü
    if (e.clientX === lastX || e.clientY === lastY) {
        linearMovements++;
    }

    // B - Yapay Titreme (Jitter) Kontrolü
    // Botlar bazen 1px sağ 1px sol yaparak insan taklidi yapar. 
    // Eğer hareket farkı çok düzenli ve küçükse bu bottur.
    let diffX = Math.abs(e.clientX - lastX);
    let diffY = Math.abs(e.clientY - lastY);
    if ((diffX > 0 && diffX < 2) && (diffY > 0 && diffY < 2)) {
        roboticJitterCount++;
    }

    lastX = e.clientX;
    lastY = e.clientY;

    if (mouseMovementScore < 100) {
        mouseMovementScore += 0.9;
        document.getElementById("progress-bar").style.width = mouseMovementScore + "%";
        if(mouseMovementScore >= 100) {
            document.getElementById("jitter-status").innerText = "Analiz Tamamlandı";
            document.getElementById("jitter-status").style.color = "#4ade80";
        }
    }
});

// --- 6. KLAVYE TAKİBİ ---
document.getElementById("user-input").addEventListener("keydown", () => {
    keystrokes.push(Date.now());
});

// --- 7. FİNAL ANALİZ MOTORU ---
function processFinalVerification() {
    riskScore = 0;
    const email = document.getElementById("user-email").value;
    const mathInput = parseInt(document.getElementById("math-answer").value);
    const captchaInput = document.getElementById("user-input").value;
    
    const timeSpent = (Date.now() - pageLoadTime) / 1000;
    const mathSolveTime = (Date.now() - mathStartTime) / 1000;

    // A - Mail Analizi (En ağır ceza)
    const domain = email.split('@')[1];
    const isTemp = tempMailDomains.includes(domain);
    if (isTemp) riskScore += 80; // Temp mail puanı artırıldı

    // B - Fare Davranış Analizi
    const linearityRatio = linearMovements / totalMovements;
    if (linearityRatio > 0.6) riskScore += 50; // Çok düzse

    const jitterRatio = roboticJitterCount / totalMovements;
    if (jitterRatio > 0.3) riskScore += 40; // Robotik titreme varsa

    // C - Hız ve Matematik Analizi
    if (mathSolveTime < 2) riskScore += 45; // İnsan 2 saniyeden önce çözemez
    if (mathInput !== mathSolution) { alert("Matematik cevabı yanlış!"); return; }

    // D - Genel Yazım Hızı
    if (keystrokes.length > 2) {
        const speed = (keystrokes[keystrokes.length - 1] - keystrokes[0]) / keystrokes.length;
        if (speed < 40) riskScore += 30; // Işık hızıyla yazan bottur
    }

    // E - Tuzak Kontrolü
    if (trapTriggered) riskScore = 100;

    // F - Captcha & Alan Kontrolü
    if (captchaInput !== generatedCaptcha) { alert("Güvenlik kodu hatalı!"); generateCaptcha(); return; }
    if (mouseMovementScore < 95) { alert("Fare analizini tamamlayın!"); return; }

    renderResultScreen(isTemp, riskScore);
}

// --- 8. SONUÇ EKRANI ---
function renderResultScreen(isTemp, score) {
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("status-screen").classList.remove("hidden");

    const mailRes = document.getElementById("mail-type-res");
    const riskRes = document.getElementById("risk-score-res");
    const title = document.getElementById("final-status-title");
    const desc = document.getElementById("final-status-desc");

    if (isTemp) {
        mailRes.innerText = "TEHLİKELİ (Temp Mail)";
        mailRes.style.color = "#f87171";
    } else {
        mailRes.innerText = "GÜVENLİ (Gerçek Mail)";
        mailRes.style.color = "#4ade80";
    }

    riskRes.innerText = `%${Math.min(score, 100)}`;
    
    if (score >= 50) {
        title.innerText = "🤖 ERİŞİM ENGELLENDİ";
        title.style.color = "#f87171";
        desc.innerText = "Sistemimiz insan limitlerinin dışında bir hız, çok düz fare hareketleri veya robotik titremeler tespit etti.";
    } else {
        title.innerText = "✅ İNSAN ONAYI ALINDI";
        title.style.color = "#4ade80";
        desc.innerText = "Analiz başarılı. Davranışlarınız tamamen doğal ve insani limitler içerisinde.";
    }

    document.getElementById("score-display").innerHTML = `Sistem Güven Puanı: <strong>%${100 - Math.min(score, 100)}</strong>`;
}
