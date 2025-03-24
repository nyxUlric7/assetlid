        window.onload = function() {
            kelompokInput.value = 4;
            jumlahKelompokText.textContent = 4;
        };

        const siswaTextarea = document.getElementById("siswa");
        const listKelompok = document.getElementById("listKelompok");
        const kelompokInput = document.getElementById("kelompok");
        const btnNaik = document.getElementById("btnNaik");
        const btnTurun = document.getElementById("btnTurun");
        const jumlahKelompokText = document.getElementById("jumlahKelompok");        
        
        let namaSiswa = [];
        let dataKelompok = [];
        
        setTimeout(() => {
            document.getElementById("tooltip").classList.add("opacity-0");
        }, 3000);

        siswaTextarea.addEventListener("input", function () {
            this.style.height = "auto";
            let maxHeight = window.innerHeight * 0.4;
            if (this.scrollHeight > maxHeight) {
                this.style.height = maxHeight + "px";
                this.style.overflowY = "scroll";
            } else {
                this.style.height = this.scrollHeight + "px";
                this.style.overflowY = "hidden";
            }
            // updateKelompok();
        });

        btnNaik.addEventListener("click", function() {
            kelompokInput.value = parseInt(kelompokInput.value) + 1;
            updateKelompok();
        });
        btnTurun.addEventListener("click", function() {
            if (parseInt(kelompokInput.value) > 1) {
                kelompokInput.value = parseInt(kelompokInput.value) - 1;
                updateKelompok();
            }
        });

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function updateKelompok() {
            namaSiswa = siswaTextarea.value.split("\n").filter(nama => nama.trim() !== "");
            shuffleArray(namaSiswa);
            
            let jumlahKelompok = parseInt(kelompokInput.value);
            jumlahKelompok = jumlahKelompok < 1 ? 1 : jumlahKelompok;
            dataKelompok = Array.from({ length: jumlahKelompok }, () => []);
            
            namaSiswa.forEach((nama, index) => {
                dataKelompok[index % jumlahKelompok].push(nama);
            });
            
            jumlahKelompokText.textContent = jumlahKelompok;
            document.getElementById("jumlahSiswa").textContent = ` (${namaSiswa.length} orang)`;            
            listKelompok.innerHTML = "";
            dataKelompok.forEach((kelompok, index) => {
                const div = document.createElement("div");
                div.classList.add("p-4", "bg-white", "rounded-lg", "shadow-md");
                // cek centang checkbox
                const ketuaCheckbox = document.getElementById("ketuaCheckbox").checked;
                let listItems = "";
                kelompok.forEach((nama, i) => {
                    if (ketuaCheckbox) {
                        if (i === 0) {
                            listItems += `<li class='text-green-600 font-bold'>${nama} (KETUA)</li>`;
                        } else {
                            listItems += `<li>${nama}</li>`;
                        }
                    } else {
                        listItems += `<li>${nama}</li>`;
                    }
                });
                
                div.innerHTML = `<h3 class='font-semibold text-lg mb-2'>Kelompok ${index + 1}</h3>
                    <ol class='list-decimal list-outside pl-5'>
                        
                        ${listItems}
                    </ol>`;
                listKelompok.appendChild(div);
            });
        }
        
   
        document.getElementById("downloadBtn").addEventListener("click", function () {
            const isiKonten = document.getElementById("isiKonten");

            // Simpan style asli
            const originalStyle = isiKonten.style.overflow;
            isiKonten.style.overflow = "visible"; // Hilangkan scroll agar semua konten tertangkap
            isiKonten.style.height = "auto"; // Pastikan tinggi elemen menyesuaikan kontennya

            html2canvas(isiKonten, {
                scale: 2, // Tingkatkan resolusi gambar agar lebih jelas
                useCORS: true, // Jika ada gambar dari domain lain
                logging: false
            }).then(canvas => {
                isiKonten.style.overflow = originalStyle; // Kembalikan style seperti semula

                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = "Pembagian Kelompok.png";
                link.click();
            });
        });

        // footer
        document.addEventListener("DOMContentLoaded", function () {
            const footer = document.createElement("footer");
            footer.className = "fixed bottom-0 right-5 bg-gray-800 text-white px-2 py-1 shadow-md rounded-t-xl text-xs w-fit";
            footer.innerHTML = `<a href="https://example.com" target="_blank">by Warudhana</a>`;

            // Menambahkan footer langsung ke body, tanpa div
            document.body.appendChild(footer);
        });