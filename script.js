document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const pointsDisplay = document.getElementById("points");

  document.addEventListener("DOMContentLoaded", () => {
    const usernameElement = document.querySelector(".username");
  
    // Telegram kullanıcı adını buraya bağlayın veya dinamik olarak alın
    const telegramUsername = "telegram_user"; // Varsayılan kullanıcı adı
  
    // Kullanıcı adını güncelle
    usernameElement.textContent = telegramUsername;
  
    // Geri kalan farming sistemi kodu (önceki paylaşılan kod) buraya gelecek
    // ...
  });
  

  // Kullanıcı durumunu depolamak için başlangıç verisi
  const farmingState = JSON.parse(localStorage.getItem("farmingState")) || {
    inProgress: false,
    endTime: null,
    points: 0,
    canClaim: false,
  };

  // UI'yi güncelleme fonksiyonu
  const updateUI = () => {
    const now = Date.now();

    // Eğer claim hakkı varsa
    if (farmingState.canClaim) {
      startButton.textContent = "Claim";
      startButton.disabled = false;
    } 
    // Eğer sayaç aktifse ve zaman dolmamışsa
    else if (farmingState.inProgress && farmingState.endTime > now) {
      const timeLeft = Math.ceil((farmingState.endTime - now) / 1000);
      startButton.textContent = `Time Left: ${timeLeft}s`;
      startButton.disabled = true;
      setTimeout(updateUI, 1000); // 1 saniye sonra güncelle
    } 
    // Sayaç tamamlanmış ancak claim yapılmamışsa
    else if (farmingState.inProgress) {
      farmingState.inProgress = false;
      farmingState.canClaim = true;
      startButton.textContent = "Claim";
      startButton.disabled = false;
      localStorage.setItem("farmingState", JSON.stringify(farmingState));
    } 
    // Başlangıç durumu
    else {
      startButton.textContent = "Start Farming";
      startButton.disabled = false;
    }

    // Puanları güncelle
    pointsDisplay.textContent = `${farmingState.points} $DUAL`;
  };

  // Buton tıklama işlevi
  startButton.addEventListener("click", () => {
    if (farmingState.canClaim) {
      // Claim işlemi
      farmingState.points += 100; // 100 puan ekle
      farmingState.canClaim = false;
      localStorage.setItem("farmingState", JSON.stringify(farmingState));
      updateUI();
    } else if (!farmingState.inProgress) {
      // Sayaç başlat
      farmingState.inProgress = true;
      farmingState.endTime = Date.now() + 8000; // Sayaç süresi: 8 saniye
      farmingState.canClaim = false;
      startButton.disabled = true;
      localStorage.setItem("farmingState", JSON.stringify(farmingState));
      updateUI();
    }
  });

  // Sayfa yüklendiğinde UI'yi güncelle
  updateUI();
});
