        let nilai1, nilai2, nilai3, op1, op2, jawaban;        
        const checkbox = document.getElementById("modeSurvival");

        function toggleSurvivalInput() {
            
            let inputNumber = document.getElementById("timeInput");
            
            // Aktifkan atau nonaktifkan input berdasarkan checkbox
            inputNumber.disabled = !checkbox.checked;
            inputNumber.value = 1;           
            let survivalDiv = document.getElementById("survivalGame");

            // Jika checkbox dicentang, tampilkan div, jika tidak, sembunyikan
            if (checkbox.checked) {
                survivalDiv.classList.remove("hidden");
            } else {
                survivalDiv.classList.add("hidden");
            }
        }


        function toggleForm() {
            const form = document.getElementById("pengaturanKonten");
            const isiKonten = document.getElementById("isiKonten");
            if (form.style.display === "none" || form.style.display === "") {
                form.style.display = "block";
                isiKonten.style.display = "none";
            } else {
                form.style.display = "none";
            }            
        }

        function mulaiGame() {
            const level = parseInt(document.getElementById("level").value);
            document.getElementById("pengaturanKonten").style.display = "none";
            document.getElementById("isiKonten").style.display = "block";
            generateSoal(level);
            resetHealth();         
            checkbox.checked && startTimer();  
            
        }

        // Fungsi untuk menghasilkan angka acak dalam rentang tertentu
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Fungsi untuk memilih operasi secara acak
        function getRandomOperator() {
            const operators = ["+", "-", "*", "/"];
            return operators[Math.floor(Math.random() * operators.length)];
        }

        function generateExpression(level) {                    
            op1 = getRandomOperator();
            op2 = getRandomOperator();

            let kecil, tengah, besar;

            if (level === 1) {
                kecil = 3; tengah = 20; besar = 100;
            }
            else if (level === 2) {
                kecil = 3; tengah = 15; besar = 100;
            }
            else if (level === 3) {
                kecil = 5; tengah = 50; besar = 300;
            }

            if (op1 === '+' || op1 === '-') {
                nilai1 = getRandomNumber(tengah, besar);
                nilai2 = getRandomNumber(tengah, besar);
            } else if (op1 === '*') {
                nilai1 = getRandomNumber(kecil, tengah);
                nilai2 = getRandomNumber(kecil, tengah);
            } else {
                nilai1 = getRandomNumber(kecil, besar);
                nilai2 = [2, 5][Math.floor(Math.random() * 2)];
            } 

            if (level === 1) {
                // return `${nilai1} ${op1} ${nilai2}`; // Contoh: "5 + 3"
                return {
                    rumus: `${nilai1} ${op1} ${nilai2}`,
                    nilai1: nilai1,
                    nilai2: nilai2,
                    op1: op1
                };
            } 
            else if (level === 2) {
                if (op2 === '/') {
                    nilai3 = [2, 5][Math.floor(Math.random() * 2)];
                }
                else{
                    nilai3 = getRandomNumber(1, 10);                
                }
                
                return {
                    rumus: `${nilai1} ${op1} ${nilai2} ${op2} ${nilai3}`,
                    nilai1: nilai1,
                    nilai2: nilai2,
                    nilai3: nilai3,
                    op1: op1,
                    op2: op2
                };
            }
            else if (level === 3) {
                if (op2 === '+' || op1 === '-') {
                    nilai3 = getRandomNumber(tengah, besar);                    
                } else if (op2 === '*') {
                    nilai3 = getRandomNumber(kecil, tengah);                    
                } else {                    
                    nilai3 = getRandomNumber(1, 10);
                } 

                function randomNegatif(angka) {
                    let random = Math.random();
                    if (random < 0.3) {
                        angka = (-angka); // Ubah menjadi negatif
                    }
                    return angka;
                }

                nilai1 = randomNegatif(nilai1);
                nilai2 = randomNegatif(nilai2);
                nilai3 = randomNegatif(nilai3);
 
                
                return {
                    rumus: `${nilai1 < 0 ? `(${nilai1})` : nilai1} ${op1} ${nilai2 < 0 ? `(${nilai2})` : nilai2} ${op2} ${nilai3 < 0 ? `(${nilai3})` : nilai3}`,
                    nilai1: nilai1,
                    nilai2: nilai2,
                    nilai3: nilai3,
                    op1: op1,
                    op2: op2
                };
            }
            return null;
        }

        function calculateExpression(expression) {
            return math.evaluate(expression).toFixed(2);
        }
        
        function generateSoal(level) {        
            let ekspresi = generateExpression(level);            
            jawaban = calculateExpression(ekspresi.rumus);
            
            document.getElementById("soal").textContent = ekspresi.rumus;
            document.getElementById("jawabanInput").value = "";
            document.getElementById("jawabanInput").focus();
        }
        
        function cekJawaban() {
            const level = parseInt(document.getElementById("level").value);
            const userJawaban = document.getElementById("jawabanInput").value.replace(",", ".");
            const inputField = document.getElementById("jawabanInput");

            if (parseFloat(userJawaban) === parseFloat(jawaban)) {
                playSound('matchSound');
                
                inputField.style.outline = "4px solid green";
                setTimeout(() => {
                    inputField.style.outline = "1px solid gray";
                    generateSoal(level);
                    tambahPoin();
                }, 500);
            } else {
                playSound('failSound');
                inputField.style.outline = "4px solid red";
                checkbox.checked && serang(); // minus darah                
                document.getElementById("jawabanInput").value = "";
                setTimeout(() => {
                    inputField.style.outline = "1px solid gray";
                }, 500);
            }
        }
        
        function tampilkanJawaban() {
            const level = parseInt(document.getElementById("level").value);
            
            const inputField = document.getElementById("jawabanInput");
            inputField.style.outline = "4px solid yellow";
            inputField.value = `${jawaban}`;
            setTimeout(() => {
                inputField.style.outline = "1px solid gray";
                generateSoal(level);
            }, 1000);
        }

        const jawabanInput = document.getElementById('jawabanInput');

        // Event listener untuk menangani input (mencegah karakter non-angka)
        jawabanInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.-]/g, '');
        });

        // Event listener untuk menangani tombol Enter
        jawabanInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
            cekJawaban(level); // Panggil fungsi cekJawaban()
            }
        });