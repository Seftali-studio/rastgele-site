// Robotların okumasını zorlaştırmak için kullanılacak karakter havuzu
const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
let generatedCaptcha = "";

// Yeni bir Captcha kodu oluşturma fonksiyonu
function generateCaptcha() {
    const display = document.getElementById("captcha-box");
    const resultMsg = document.getElementById("result-msg");
    const inputField = document.getElementById("user-input");
    
    let captcha = "";
    // 6 haneli rastgele bir kod oluştur
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    generatedCaptcha = captcha;
    display.innerText = captcha;
    
    // Her yeni kodda ekranı temizle
    resultMsg.innerText = "";
    inputField.value = "";
    
    // Botlar karakterleri tarayamasın diye rastgele eğim veriyoruz
    const rotation = Math.floor(Math.random() * 10) - 5; // -5 ile +5 derece arası
    display.style.transform = `rotate(${rotation}deg) skew(${rotation}deg)`;
}

// Kullanıcın girdiği kodu kontrol etme fonksiyonu
function checkCaptcha() {
    const userInput = document.getElementById("user-input").value;
    const resultMsg = document.getElementById("result-msg");
    
    if (userInput === "") {
        resultMsg.innerText = "Lütfen kodu girin!";
        resultMsg.style.color = "#fbbf24"; // Sarı
        return;
    }
    
    if (userInput === generatedCaptcha) {
        resultMsg.innerText = "✅ Doğrulama Başarılı! Robot değilsiniz.";
        resultMsg.style.color = "#4ade80"; // Yeşil
        
        // Başarılı olursa butonu geçici olarak devre dışı bırakalım
        document.querySelector(".verify-btn").innerText = "Giriş Yapıldı";
    } else {
        resultMsg.innerText = "❌ Hatalı Kod! Robot musunuz?";
        resultMsg.style.color = "#f87171"; // Kırmızı
        
        // Hatalı girişte kodu hemen yenileyelim ki botlar deneme yapamasın
        setTimeout(generateCaptcha, 1000);
    }
}

// Sayfa ilk açıldığında çalıştır
window.onload = function() {
    // HTML'deki test alanını dinamik olarak dolduruyoruz
    const testArea = document.querySelector(".test-area");
    testArea.innerHTML = `
        <div id="captcha-box">------</div>
        <button onclick="generateCaptcha()" class="refresh-btn">🔄 Kodu Yenile</button>
        <input type="text" id="user-input" placeholder="Karakterleri giriniz" maxlength="6">
        <button onclick="checkCaptcha()" class="verify-btn">Doğrula ve Devam Et</button>
        <p id="result-msg"></p>
    `;
    generateCaptcha();
};
