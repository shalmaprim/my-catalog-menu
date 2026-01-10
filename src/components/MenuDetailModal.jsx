// src/components/MenuDetailModal.jsx
import Modal from "react-modal";

// Helper function untuk format harga (bisa kamu pindah ke file terpisah)
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// Komponen ini menerima 3 props:
// 1. item: Objek menu yang akan ditampilkan
// 2. isOpen: Boolean (true/false) untuk buka/tutup modal
// 3. onClose: Fungsi yang akan dipanggil saat modal ingin ditutup
function MenuDetailModal({ item, isOpen, onClose }) {
  // Jika tidak ada item yang dipilih (masih null), jangan render apa-apa
  if (!item) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      // Kita gunakan Tailwind untuk styling modalnya
      overlayClassName="fixed inset-0 bg-black/70 z-30 flex justify-center items-center"
      className="bg-white rounded-lg shadow-xl max-w-lg max-h-140 w-full m-5 overflow-hidden"
      contentLabel="Detail Menu"
    >
      <div className="relative">
        {/* Tombol Close di pojok kanan atas */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/30 rounded-full w-8 h-8
                     flex items-center justify-center hover:bg-black/50 transition-all z-10"
        >
          &times; {/* Ini adalah simbol 'X' */}
        </button>

        {/* Gambar Menu */}
        <img
          src={item.gambar}
          alt={item.nama}
          className="w-full h-47 object-cover"
        />

        {/* Konten Teks */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900">{item.nama}</h2>
          <p className="text-2xl font-bold text-[#3d251e] mt-2">
            {formatRupiah(item.harga)}
          </p>

          <p className="text-gray-700 mt-4">
            {/* Gunakan deskripsiDetail jika ada, jika tidak, pakai deskripsi biasa */}
            {item.deskripsiDetail || item.deskripsi}
          </p>

          {/* Info Pemesanan */}
          <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800">
            <h4 className="font-semibold">Cara Pemesanan</h4>
            <p>
              Untuk memesan, silakan datang dan lakukan pemesanan secara manual
              di kasir. Terima kasih!
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MenuDetailModal;
