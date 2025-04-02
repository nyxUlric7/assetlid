let kata = [];
        let kataTersisa = [];
        let kataTerpilih = "";

        window.onload = function() {
            document.getElementById('contentForm').classList.remove('hidden');
            document.getElementById('gameContainer').classList.add('hidden');
            document.getElementById('userInput').addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Mencegah submit form bawaan
                    cekJawaban(); // Memeriksa jawaban
                }
            });
        };

        function playSound(soundId) {
            let sound = document.getElementById(soundId);
            if (sound) {
                sound.currentTime = 0; // Reset ke awal
                sound.play();
            }
        }

        function toggleForm() {
            document.getElementById("tombolPengaturan").classList.add('hidden');
            document.getElementById('gameContainer').style.display = "none";
            document.getElementById('pengaturanKonten').style.display = "block";
            clearInterval(timer);
            
        }

        function processInput(event) {
            event.preventDefault();
            
            const textareaValue = document.getElementById('data').value;
            kata = textareaValue.split('\n').map(k => k.trim()).filter(k => k !== "");
            // kata = textareaValue.split('\n').filter(k => k.trim() !== "");
            kataTersisa = [...kata];
            
            document.getElementById("tombolPengaturan").classList.remove('hidden');
            document.getElementById('gameContainer').style.display = "block";
            document.getElementById('pengaturanKonten').style.display = "none";

            document.getElementById('gameContainer').classList.remove('hidden');
            tampilkanAcak();
            resetHealth();
            startTimer();
            document.getElementById("data").value = kata.join("\n");

            console.log(kata);
        }

        function acakHuruf(kata) {
            let arrHuruf = kata.split('');
            for (let i = arrHuruf.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [arrHuruf[i], arrHuruf[j]] = [arrHuruf[j], arrHuruf[i]];
            }
            return arrHuruf.join('');
        }

        function tampilkanAcak() {
            document.getElementById('userInput').focus();
            if (kataTersisa.length === 0) {
                kataTersisa = [...kata]; // Reset daftar kata jika sudah habis
            }
            if (kataTersisa.length > 0) {
                const randomIndex = Math.floor(Math.random() * kataTersisa.length);
                kataTerpilih = kataTersisa[randomIndex].toUpperCase();
                kataTersisa.splice(randomIndex, 1); // Hapus kata yang sudah dipilih
                let kataAcak = acakHuruf(kataTerpilih);
                tampilkanKata(kataAcak);
                document.getElementById('userInput').value = "";
                
            } else {
                document.getElementById('scrambledWord').innerText = "BELUM ADA DATA";
            }
        }

        function tampilkanJawaban() {
            tampilkanKata(kataTerpilih);
            setTimeout(() => {
                tampilkanAcak();
            }, 1500);
        }

        function tampilkanKata(kata) {
            let displayArea = document.getElementById('scrambledWord');
            displayArea.innerHTML = '';

            kata.split('').forEach((huruf, index) => {
                let span = document.createElement('span');
                span.textContent = huruf;
                span.classList.add(
                    'px-2', 'py-1', 'text-xl', 'font-bold', 'm-1', 'rounded-lg', 'bg-blue-400', 
                    'text-white', 'opacity-0', 'scale-75', 'transition-all', 'duration-300', 
                    'sm:px-1', 'sm:py-2', 'sm:text-2xl', // Untuk layar kecil ke atas
                    'md:px-5', 'md:py-3', 'md:text-3xl', // Untuk layar medium ke atas
                    'lg:px-6', 'lg:py-3', 'lg:text-4xl'  // Untuk layar besar ke atas
                );
                displayArea.appendChild(span);

                // Tambahkan delay agar huruf muncul satu per satu
                setTimeout(() => {
                    span.classList.remove('opacity-0', 'scale-75');
                    span.classList.add('opacity-100', 'scale-100');
                }, index * 100);
            });
        }

        function cekJawaban() {
            const userInput = document.getElementById('userInput');
            const userAnswer = userInput.value.toUpperCase();
            const inputField = document.getElementById("userInput");

            if (userAnswer === kataTerpilih) {
                tambahPoin();
                playSound('matchSound');
                inputField.style.outline = "4px solid green";
                setTimeout(() => {
                    inputField.style.outline = "1px solid gray";
                    tampilkanAcak();
                }, 1000);
            } else {
                serang();                
                playSound('failSound');
                inputField.style.outline = "4px solid red";
                setTimeout(() => {
                    inputField.style.outline = "1px solid gray";
                }, 500);
                
            }

            //userInput.blur(); // Menghapus fokus dari input setelah pengecekan            
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
          