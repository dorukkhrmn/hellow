// Kullanıcı Puanları
let points = 0;
const pointsElement = document.getElementById("points");
const timerElement = document.getElementById("timer");
let timerInterval = null;

// Start Farming Fonksiyonu
function startFarming() {
  const now = Date.now();
  const lastClick = localStorage.getItem("lastClick");
  const eightHours = 8 * 60 * 60 * 1000;

  if (!lastClick || now - lastClick >= eightHours) {
    points += 100;
    pointsElement.textContent = `${points} puan`;
    localStorage.setItem("lastClick", now);
    alert("100 puan eklendi!");
    startTimer(eightHours);
  } else {
    const remainingTime = eightHours - (now - lastClick);
    alert("Sayaç zaten çalışıyor!");
    startTimer(remainingTime);
  }
}

// Sayaç Başlatma
function startTimer(duration) {
  clearInterval(timerInterval);
  let remainingTime = duration;

  timerInterval = setInterval(() => {
    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
    timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = "00:00:00";
    }

    remainingTime -= 1000;
  }, 1000);
}

// Firebase veya Supabase Entegrasyonu Burada Yapılabilir
// (Eğer bağlanmasını isterseniz size yardımcı olabilirim.)
