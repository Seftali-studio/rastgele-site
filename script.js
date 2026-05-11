// --- GÜVENLİK AYARLARI VE DEĞİŞKENLER ---
let generatedCaptcha = "";
const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const pageLoadTime = Date.now();
let mouseMovementScore = 0;
let verificationReady = false;

// Temp Mail Kara Listesi (En yaygın olanlar)
const tempMailDomains = [
    "10minutemail.com", "guerrillamail.com", "sharklasers.com", 
    "temp-mail.org", "mailinator.com", "dispostable.com", "yopmail.com"
];

// --- 1. CAPTCHA ÜRETİCİ ---
function generateCaptcha() {
    const display = document.getElementById("captcha-box");
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    generatedCaptcha = captcha;
    display.innerText = captcha;
    
    // Botların taramasını zorlaştırmak için rastgele eğim
    const rot = Math.floor(Math.random() * 12) - 6;
    display.style.transform = `rotate(${rot}deg) skew(${rot}deg)`;
}

// --- 2. FARE TAKİP SİSTEMİ (BASİT YAPAY ZEKA) ---
const mouseArea = document.getElementById("mouse-check-area");
const progressBar = document.getElementById("progress-bar");

mouseArea.addEventListener('mousemove', (e) => {
    if (mouseMovementScore < 100) {
        // Fare hareket ettikçe puan kazanılır (İnsan ivmesi takibi)
        mouseMovementScore += 0.5; 
        progressBar.style.width = mouseMovementScore + "%";
        
        if (mouseMovementScore >= 100) {
            mouseArea.style.borderColor = "#4ade80";
            mouseArea.querySelector('span').innerText = "✅ Hareket Doğrulandı";
            checkAllSteps();
        }
    }
});

// --- 3. MAİL VE GÜVENLİK KONTROLÜ ---
function processFinalVerification() {
    const email = document.getElementById("user-email").value;
    const captchaInput = document.getElementById("user-input").value;
    const resultMsg = document.getElementById("result-msg");
    const now = Date.now();
    const timeSpent = (now - pageLoadTime) / 1000;

    // A - BOŞ ALAN KONTROLÜ
    if (!email || !captchaInput) {
        showResult("Lütfen tüm alanları doldurun!", "#fbbf24");
        return;
    }

    // B - TEMP MAIL KONTROLÜ
    const domain = email.split('@')[1];
    if (tempMailDomains.includes(domain)) {
        showResult("❌ Geçici e-posta adresi kullanılamaz!", "#f87171");
        return;
    }

    // C - HIZ KONTROLÜ (BOT TESPİTİ)
    if (timeSpent < 4) {
        showResult("🤖 Bot Algılandı: Çok hızlı işlem!", "#f87171");
        generateCaptcha();
        return;
    }

    // D - FARE HAREKET KONTROLÜ
    if (mouseMovementScore < 100) {
        showResult("Lütfen fareyi kutu üzerinde gezdirin!", "#fbbf24");
        return;
    }

    // E - CAPTCHA EŞLEŞME
    if (captchaInput === generatedCaptcha) {
        showResult("✅ Doğrulama Başarılı! Hoş geldiniz.", "#4ade80");
        document.getElementById("main-btn").disabled = true;
        document.getElementById("security-level").innerText = "MAKSİMUM";
    } else {
        showResult("❌ Hatalı kod! Tekrar deneyin.", "#f87171");
        generateCaptcha();
    }
}

function showResult(text, color) {
    const msg = document.getElementById("result-msg");
    msg.innerText = text;
    msg.style.color = color;
}

function checkAllSteps() {
    // Tüm adımlar hazırsa butonu parlatabiliriz
    if (mouseMovementScore >= 100) {
        verificationReady = true;
    }
}

// Sayfa yüklendiğinde başlat
window.onload = generateCaptcha;
