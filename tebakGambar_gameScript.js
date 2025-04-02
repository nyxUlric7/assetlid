let selectedImage = null;
let selectedFileName = "";
let uploadedImages = []; // Menyimpan semua gambar yang diunggah
let currentGameIndex = 0; // Menunjukkan gambar mana yang sedang dimainkan

function playSound(soundId) {
    let sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Reset ke awal
        sound.play();
    }
}

document.getElementById('mainkanBtn').addEventListener('click', function() {
    let form = document.querySelector("form");
    let inputs = form.querySelectorAll("input, select");

    if (form.checkValidity()) {
        // Form valid, jalankan aksi
        console.log("Form valid, jalankan permainan!");
        
        prosesGambar();
        
        if (selectedImage) {
            document.getElementById('fileName').innerText = selectedFileName;
            potongGambar(selectedImage);
        }

        document.getElementById('poinGame').innerText = `Poin : -`;

        document.getElementById('dataKonten').classList.add('hidden');
        document.getElementById('isiKonten').classList.remove('hidden');
        
        document.getElementById('togglePengaturan').classList.remove('hidden');
        document.getElementById('poinGame').classList.remove('hidden');

        document.getElementById('fileName').innerText = "";

        initOverlays();

        
    } else {
        // Form tidak valid, munculkan pesan validasi bawaan browser
        form.reportValidity();                
    }

    // console.log("mainkan", gridSize);
    

});

document.getElementById('togglePengaturan').addEventListener('click', function() {
    document.getElementById('dataKonten').classList.remove('hidden');
    document.getElementById('isiKonten').classList.add('hidden');
    document.getElementById('poinGame').classList.add('hidden');
    document.getElementById('togglePengaturan').classList.add('hidden');
});

document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        nextGame();
    }
    if (event.key === " " || event.code === "Space") {
        event.preventDefault(); // Mencegah scroll halaman ke bawah
        hideRandomOverlay();
    }
});


function prosesGambar() {
    console.log("potong", gridSize);
    uploadedImages = []; // Reset daftar gambar
    currentGameIndex = 0; // Reset index game ke awal

    const fileInput = document.getElementById('gambar'); // Ambil elemen input file
    if (!fileInput) {
        console.error("Elemen input file dengan ID 'gambar' tidak ditemukan!");
        return;
    }
    const files = fileInput.files;
    if (!files?.length) {
        console.log("Tidak ada file yang dipilih.");
        return;
    }

    if (files.length === 0) return; // Jika tidak ada file, hentikan

    // Ubah FileList menjadi Array agar bisa pakai forEach
    Array.from(files).forEach(file => {
        console.log("Nama file:", file.name);
    });


    console.log("prosesGambar", gridSize);
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.dataset.order = index; // ✅ Sekarang index sudah tersedia

            img.onload = function() {
                uploadedImages.push({ order: index, fileName: file.name, image: img });

                if (uploadedImages.length === 1) {
                    let checkbox = document.getElementById('showTitle');
                    if (!document.getElementById('showTitle').checked) {
                        document.getElementById('fileName').innerText = file.name.replace(/\.[^/.]+$/, "");
                    }
                    potongGambar(img);
                }
            };
        };
        reader.readAsDataURL(file);
    });
}

function potongGambar(img) {
    
    const gridSize = parseInt(document.getElementById('gridSize').value) || 3;
    console.log("potong", gridSize);
    const canvas = document.getElementById('gambarCanvas');
    const ctx = canvas.getContext('2d');
    const potonganGambar = document.getElementById('potonganGambar');
    potonganGambar.innerHTML = '';
    potonganGambar.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const tinggiKontainer = window.innerHeight * 0.7;
    const rasioGambar = img.width / img.height;
    const lebarKontainer = tinggiKontainer * rasioGambar;
    
    potonganGambar.style.width = `${lebarKontainer}px`;
    potonganGambar.style.height = `${tinggiKontainer}px`;
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const potonganLebar = canvas.width / gridSize;
    const potonganTinggi = canvas.height / gridSize;

    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const index = y * gridSize + x + 1; // Nomor unik untuk setiap potongan

            // Membuat div utama sebagai container
            const potonganDiv = document.createElement('div');
            potonganDiv.style.position = 'relative'; // Supaya elemen dalamnya bisa absolute
            potonganDiv.style.display = 'inline-block'; // Agar rapi dalam satu baris        
            potonganDiv.classList.add('rounded-lg'); // Menambahkan border radius

            // Membuat overlay biru yang menutupi gambar
            const overlayDiv = document.createElement('div');
            overlayDiv.id = `potongGambar${index}`;
            overlayDiv.style.position = 'absolute';
            overlayDiv.style.top = '0';
            overlayDiv.style.left = '0';
            overlayDiv.style.width = '100%';
            overlayDiv.style.height = '100%';
            overlayDiv.style.backgroundColor = 'rgba(152, 210, 192)'; // warna kotak
            overlayDiv.style.zIndex = '2'; // Pastikan overlay di atas gambar
            overlayDiv.style.borderRadius = '5px'; // Sudut membulat

            // Membuat canvas untuk memotong gambar
            const potonganCanvas = document.createElement('canvas');
            const potonganCtx = potonganCanvas.getContext('2d');
            potonganCanvas.width = potonganLebar;
            potonganCanvas.height = potonganTinggi;

            // Memotong bagian gambar dan menggambar ke canvas
            potonganCtx.drawImage(
                canvas,
                x * potonganLebar, y * potonganTinggi, potonganLebar, potonganTinggi,
                0, 0, potonganLebar, potonganTinggi
            );

            // Mengubah canvas menjadi gambar
            const imgElement = document.createElement('img');
            imgElement.src = potonganCanvas.toDataURL();
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.display = 'block';
            imgElement.style.borderRadius = '5px'; // Sudut membulat

            // Menambahkan gambar dan overlay ke dalam div utama
            potonganDiv.appendChild(imgElement);
            potonganDiv.appendChild(overlayDiv); // Overlay di atas gambar

            // Menambahkan div utama ke dalam container utama
            potonganGambar.appendChild(potonganDiv);
        }
    }



}

function nextGame() {
    document.getElementById('poinGame').innerText = `Poin : -`;
    if (uploadedImages.length === 0) return; // Jika tidak ada gambar, hentikan

    currentGameIndex++; // Pindah ke gambar berikutnya
    if (currentGameIndex >= uploadedImages.length) {
        currentGameIndex = 0; // Jika sudah di gambar terakhir, kembali ke awal
    }

    if (!document.getElementById('showTitle').checked) {
        document.getElementById('fileName').innerText = uploadedImages[currentGameIndex].fileName.replace(/\.[^/.]+$/, "");
    }

    potongGambar(uploadedImages[currentGameIndex].image);
    initOverlays();
}


// Fungsi untuk menghidden semua overlay biru
function resetOverlays() {
    const gridSize = parseInt(document.getElementById('gridSize').value) || 3;
    console.log("reset", gridSize);
    
    for (let i = 1; i <= gridSize * gridSize; i++) {
        console.log("reset for", gridSize);
        const overlay = document.getElementById(`potongGambar${i}`);
        if (overlay) {
            console.log("reset if");
            overlay.style.display = 'none'; // Menyembunyikan overlay biru
        }
    }
}

// Array untuk menyimpan ID overlay yang masih terlihat
let overlayList = [];

// Inisialisasi daftar overlay saat halaman dimuat
function initOverlays() {
    const gridSize = parseInt(document.getElementById('gridSize').value) || 3;
    overlayList = [];
    const jumlah = overlayList.length;
    console.log("jumlah", overlayList.length);
    
    for (let i = 1; i <= gridSize * gridSize; i++) {
        overlayList.push(`potongGambar${i}`);
    }
}

// Fungsi untuk menyembunyikan satu overlay secara acak
function hideRandomOverlay() {
    playSound('flipSound');
    document.getElementById('poinGame').innerText = `POIN : ${overlayList.length - 1}`;
    console.log("jumlah", overlayList.length);
   

    // Pilih index acak dari daftar overlay yang masih terlihat
    const randomIndex = Math.floor(Math.random() * overlayList.length);
    const overlayId = overlayList[randomIndex];

    // Sembunyikan overlay yang dipilih
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.style.display = 'none';
    }

    // Hapus overlay dari daftar yang masih terlihat
    overlayList.splice(randomIndex, 1);
}