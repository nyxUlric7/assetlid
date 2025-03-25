let health = 5;
        let poin = 0;
        let timer;
        let timeLeft;
        const hearts = document.querySelectorAll('#healthBar .fa-heart');
        const poinDisplay = document.getElementById("poin");
        const timerDisplay = document.getElementById("timerDisplay");
        const timeInput = document.getElementById("timeInput");
        
        function updateHealthBar() {
            console.log("update");
            hearts.forEach((heart, index) => {
                heart.classList.toggle('text-gray-400', index >= health);
                heart.classList.toggle('text-red-500', index < health);
            });
        }
        
        function serang() {
            if (health > 0) {
                health--;
                updateHealthBar();
                console.log("serang");
                if (health === 0) {
                    setTimeout(() => {
                        // alert("Game Over!");
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
            // alert("Game telah direset!");
        }

        function startTimer() {
            clearInterval(timer);
            timeLeft = parseInt(timeInput.value) * 60;
            updateTimerDisplay();
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    // alert("Waktu habis! Game akan direset.");
                    showModal("WAKTU HABIS", `POIN KAMU ${poin}`);
                    
                }
            }, 1000);
        }
        
        function updateTimerDisplay() {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    
