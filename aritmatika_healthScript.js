let health = 5;
let poin = 0;
let timer;
let timeLeft;
const hearts = document.querySelectorAll('#healthBar .fa-heart');
const poinDisplay = document.getElementById("poin");
const timerDisplay = document.getElementById("timerDisplay");
const inputNumber = document.getElementById("timeInput");

function playSound(soundId) {
    let sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Reset ke awal
        sound.play();
    }
}

function updateHealthBar() {
    
    hearts.forEach((heart, index) => {
        heart.classList.toggle('text-gray-400', index >= health);
        heart.classList.toggle('text-red-500', index < health);
    });
}

function serang() {
    if (health > 0) {
        health--;
        updateHealthBar();                
        if (health === 0) {
            setTimeout(() => {                        
                showModal("DARAH HABIS", `POIN KAMU ${poin}`);
                setTimeout(resetHealth, 1000);
            }, 500);
        }
    }
}

function tambahPoin() {
    poin++;
    poinDisplay.textContent = poin;
}

function resetHealth() {
    health = 5;
    poin = 0;
    updateHealthBar();
    poinDisplay.textContent = poin;
    clearInterval(timer);
    timerDisplay.textContent = "00:00";
}

function startTimer() {            
    clearInterval(timer);
    timeLeft = parseInt(inputNumber.value) * 60;
    updateTimerDisplay();
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            showModal("WAKTU HABIS", `POIN KAMU ${poin}`);
            
        }
    }, 1000);
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Modal
function showModal(judul, message) {
    document.getElementById("announcementJudul").innerText = judul;
    document.getElementById("announcementText").innerText = message;
    document.getElementById("announcementModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("announcementModal").classList.add("hidden");
    toggleForm();
}

function ulangModal() {
    document.getElementById("announcementModal").classList.add("hidden");
    document.getElementById('userInput').value = "";
    resetHealth();
    startTimer();
}