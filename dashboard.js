// Check status login
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    alert('Silakan login terlebih dahulu!');
    window.location.href = 'login.html';
}

// Fungsi Logout
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Data Alat Medis
const dataAlat = [
    { kode: "AED-01", lokasi: "New HSSE Lt 1", jenis: "AED", merk: "Zoll", expDate: "2027-07-28", petugas: "Reza" },
    { kode: "AED-02", lokasi: "Shelter 209", jenis: "AED", merk: "Mindray", expDate: "2026-11-11", petugas: "Firman" },
    { kode: "AED-03", lokasi: "New Lab Lt 1", jenis: "AED", merk: "Mindray", expDate: "2026-11-11", petugas: "Dahlan" },
    { kode: "AED-04", lokasi: "SWD / CWI", jenis: "AED", merk: "Mindray", expDate: "2026-08-10", petugas: "Candra" },
    { kode: "AED-05", lokasi: "Power Plant 2 Lt.2 - UTL", jenis: "AED", merk: "Philips", expDate: "2026-11-11", petugas: "Reza" },
    { kode: "AED-06", lokasi: "Shelter 400", jenis: "AED", merk: "Philips", expDate: "2026-11-11", petugas: "Dodi S" },
    { kode: "AED-07", lokasi: "Fire Station Pintu V", jenis: "AED", merk: "Philips", expDate: "2026-07-01", petugas: "Lintang" },
    { kode: "AED-08", lokasi: "Shelter Plant 8 - HCC", jenis: "AED", merk: "Philips", expDate: "2026-11-11", petugas: "Dodi A" },
    { kode: "AED-09", lokasi: "Gedung Loading Master - OM Selatan", jenis: "AED", merk: "Philips", expDate: "2026-11-11", petugas: "Mahfud" }
];

// Helper: Hitung sisa hari dari tanggal hari ini
function hitungSisaHari(targetDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Format tanggal ke teks Indonesia (e.g., 28 Jul 2027)
function formatTanggal(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Render Dashboard
function renderDashboard() {
    const container = document.getElementById('cardContainer');
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filterLokasi = document.getElementById('filterLokasi').value;
    const filterJenis = document.getElementById('filterJenis').value;
    const filterMerk = document.getElementById('filterMerk').value;

    container.innerHTML = '';

    let countReady = 0;
    let countWarning = 0;
    let countExpired = 0;
    let visibleCards = 0;

    dataAlat.forEach(item => {
        const sisaHari = hitungSisaHari(item.expDate);
        
        // Tentukan status otomatis
        let statusClass = 'ready';
        let statusText = 'Ready';

        if (sisaHari < 0) {
            statusClass = 'expired';
            statusText = 'Expired';
            countExpired++;
        } else if (sisaHari <= 30) {
            statusClass = 'warning';
            statusText = 'Warning';
            countWarning++;
        } else {
            countReady++;
        }

        // Filter Matching
        const matchSearch = item.lokasi.toLowerCase().includes(searchInput) ||
                            item.kode.toLowerCase().includes(searchInput) ||
                            item.petugas.toLowerCase().includes(searchInput);
        const matchLokasi = filterLokasi === '' || item.lokasi === filterLokasi;
        const matchJenis = filterJenis === '' || item.jenis === filterJenis;
        const matchMerk = filterMerk === '' || item.merk === filterMerk;

        if (matchSearch && matchLokasi && matchJenis && matchMerk) {
            visibleCards++;

            const badgeText = sisaHari < 0 ? 'Kedaluwarsa' : `${sisaHari} Hari Lagi`;

            const cardHTML = `
                <div class="alat-card">
                    <div class="card-header">
                        <span>${item.kode}</span>
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                    <h3>${item.lokasi}</h3>
                    <p>❤️ ${item.jenis} • ${item.merk}</p>
                    <div class="expired">
                        <span>Exp ${formatTanggal(item.expDate)}</span>
                        <span class="badge ${statusClass}">${badgeText}</span>
                    </div>
                    <p>Petugas : ${item.petugas}</p>
                </div>
            `;
            container.innerHTML += cardHTML;
        }
    });

    // Update Ringkasan Angka Utama
    document.getElementById('totalAlat').innerText = dataAlat.length;
    document.getElementById('ready').innerText = countReady;
    document.getElementById('warning').innerText = countWarning;
    document.getElementById('expired').innerText = countExpired;

    // Update Subheader
    const totalLokasi = new Set(dataAlat.map(i => i.lokasi)).size;
    document.getElementById('subHeaderInfo').innerText = `${dataAlat.length} Unit • ${totalLokasi} Lokasi`;
}

// Inisialisasi Pilihan Opsi Filter secara Otomatis
function initFilters() {
    const lokasiSet = [...new Set(dataAlat.map(i => i.lokasi))];
    const jenisSet = [...new Set(dataAlat.map(i => i.jenis))];
    const merkSet = [...new Set(dataAlat.map(i => i.merk))];

    const selectLokasi = document.getElementById('filterLokasi');
    const selectJenis = document.getElementById('filterJenis');
    const selectMerk = document.getElementById('filterMerk');

    lokasiSet.forEach(loc => selectLokasi.innerHTML += `<option value="${loc}">${loc}</option>`);
    jenisSet.forEach(jns => selectJenis.innerHTML += `<option value="${jns}">${jns}</option>`);
    merkSet.forEach(mrk => selectMerk.innerHTML += `<option value="${mrk}">${mrk}</option>`);
}

// Event Listeners untuk Filter dan Search
document.getElementById('searchInput').addEventListener('input', renderDashboard);
document.getElementById('filterLokasi').addEventListener('change', renderDashboard);
document.getElementById('filterJenis').addEventListener('change', renderDashboard);
document.getElementById('filterMerk').addEventListener('change', renderDashboard);

// Jalankan saat pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Set Tanggal Hari Ini di Header
    const today = new Date();
    document.getElementById('currentDate').innerText = today.toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    initFilters();
    renderDashboard();
});

document.getElementById("btnTambah").onclick = function(){

    window.location.href = "tambahalat.html";

}

document.addEventListener('DOMContentLoaded', () => {

    const today = new Date();

    document.getElementById('currentDate').innerText =
    today.toLocaleDateString('id-ID',{
        day:'numeric',
        month:'short',
        year:'numeric'
    });

    initFilters();
    renderDashboard();

    document.getElementById("btnTambah").addEventListener("click",function(){

        window.location.href="tambahalat.html";

    });

});