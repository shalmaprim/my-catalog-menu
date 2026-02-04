import Modal from "react-modal";
import { FaTimes, FaTag, FaInfoCircle } from "react-icons/fa";

// Helper function untuk format harga
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function MenuDetailModal({ item, isOpen, onClose }) {
  if (!item) return null;

  const imageSrc =
    item.gambar && item.gambar !== ""
      ? item.gambar
      : "https://placehold.co/600x400/1a1a1a/FFF?text=No+Image";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 transition-all duration-300"
      // PERBAIKAN DI SINI:
      // Tambahkan 'sm:max-h-[90vh]' agar di desktop tingginya dibatasi maksimal 90% layar.
      className="bg-neutral-900 w-full h-[85vh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-white/10 outline-none flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in-up"
      contentLabel="Detail Menu"
    >
      {/* --- 1. Header Gambar (Fixed) --- */}
      <div className="relative h-64 sm:h-72 shrink-0 bg-neutral-800">
        <img
          src={imageSrc}
          alt={item.nama}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/1a1a1a/FFF?text=Error";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-100"></div>

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-amber-500 hover:text-black text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/10"
        >
          <FaTimes size={16} />
        </button>

        {/* Kategori Badge */}
        <div className="absolute bottom-0 left-6 transform translate-y-1/2 z-10">
          <span className="flex items-center gap-2 bg-amber-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-neutral-900 tracking-wider uppercase">
            <FaTag size={10} /> {item.kategori}
          </span>
        </div>
      </div>

      {/* --- 2. Konten Scrollable --- */}
      {/* Area ini akan otomatis punya scrollbar jika kontennya panjang */}
      <div className="flex-1 overflow-y-auto p-6 pt-8 sm:p-8 sm:pt-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Header Judul */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
            {item.nama}
          </h2>
          <div className="text-right shrink-0">
            <p className="text-xl sm:text-2xl font-mono font-bold text-amber-400">
              {formatRupiah(item.harga)}
            </p>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-light leading-relaxed mb-8">
          <p>
            {item.deskripsiDetail ||
              item.deskripsi ||
              "Tidak ada deskripsi detail."}
          </p>
        </div>

        {/* Info Pemesanan Box */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-start">
          <div className="text-amber-500 mt-1">
            <FaInfoCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">
              Cara Pemesanan
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Silakan sebutkan menu ini ke kasir untuk memesan.
            </p>
          </div>
        </div>

        {/* Spacer bawah */}
        <div className="h-8"></div>
      </div>
    </Modal>
  );
}

export default MenuDetailModal;
