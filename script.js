document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const pointsDisplay = document.getElementById("points");
  const usernameElement = document.querySelector(".username");
  const buyButtons = document.querySelectorAll(".buy-button");

  // Telegram kullanıcı adı ayarı
  const telegramUsername = "telegram_user"; // Varsayılan kullanıcı adı
  usernameElement.textContent = telegramUsername;

  // Kullanıcı durumu
  const farmingState = JSON.parse(localStorage.getItem("farmingState")) || {
    inProgress: false,
    endTime: null,
    points: 0,
    canClaim: false,
  };

  // UI'yi güncelleme fonksiyonu
  const updateUI = () => {
    const now = Date.now();

    if (farmingState.canClaim) {
      startButton.textContent = "Claim";
      startButton.disabled = false;
    } else if (farmingState.inProgress && farmingState.endTime > now) {
      const timeLeft = Math.ceil((farmingState.endTime - now) / 1000);
      startButton.textContent = `Time Left: ${timeLeft}s`;
      startButton.disabled = true;
      setTimeout(updateUI, 1000);
    } else if (farmingState.inProgress) {
      farmingState.inProgress = false;
      farmingState.canClaim = true;
      startButton.textContent = "Claim";
      startButton.disabled = false;
      localStorage.setItem("farmingState", JSON.stringify(farmingState));
    } else {
      startButton.textContent = "Start Farming";
      startButton.disabled = false;
    }

    pointsDisplay.textContent = `${farmingState.points} $OTTO`;
  };

  // Buton tıklama işlevi
  startButton.addEventListener("click", () => {
    if (farmingState.canClaim) {
      farmingState.points += 100;
      farmingState.canClaim = false;
      localStorage.setItem("farmingState", JSON.stringify(farmingState));
      updateUI();
    } else if (!farmingState.inProgress) {
      farmingState.inProgress = true;
      farmingState.endTime = Date.now() + 8000;
      farmingState.canClaim = false;
      startButton.disabled = true;
      localStorage.setItem("farmingState", JSON.stringify(farmingState));
      updateUI();
    }
  });

  // Telegram cüzdanı ile ödeme fonksiyonu
  const initiatePayment = async (amount) => {
    try {
      alert(`Processing payment of ${amount} TON through Telegram Wallet...`);

      // Gerçek bir cüzdan API'siyle entegrasyon yapılmalıdır.
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simülasyon
      alert("Payment Successful! You have purchased the item.");
    } catch (error) {
      alert("Payment Failed. Please try again.");
    }
  };

  // Buy butonlarına tıklama işlevi
  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const confirmPurchase = confirm(
        "Seçilen miner için 0.5 TON ile ödeme yapmak istiyor musunuz?"
      );
      if (confirmPurchase) {
        initiatePayment(0.5); // 0.5 TON ödeme başlat
      }
    });
  });

  // Sayfa yüklendiğinde UI'yi güncelle
  updateUI();

  // "Go Back" butonu için geri dönüş
  const goBackButton = document.querySelector(".header .buy-button");
  goBackButton.addEventListener("click", () => {
    window.history.back();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectButton");

  connectButton.addEventListener("click", async () => {
    try {
      const TonConnect = await import("https://cdn.jsdelivr.net/npm/@tonconnect/sdk@0.3.0/dist/sdk.umd.min.js");
      const tonConnect = new TonConnect.TonConnect({
        manifestUrl: "https://dorukkhrmn.github.io/hellow/tonconnect-manifest.json",
      });

      // Kullanıcıdan cüzdan seçimi alın
      const wallets = await tonConnect.getWallets();
      if (wallets.length === 0) {
        alert("No wallets found. Please install TON Wallet or Tonkeeper.");
        return;
      }

      // Cüzdan seçme ve bağlama işlemi
      tonConnect.connect({ universalLink: wallets[0].universalLink, bridgeUrl: wallets[0].bridgeUrl });

      tonConnect.onStatusChange((status) => {
        if (status === TonConnect.ConnectionStatus.READY) {
          alert("Wallet connected successfully!");
        }
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Check your manifest URL and wallet status.");
    }
  });
});
