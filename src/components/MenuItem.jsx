// src/components/MenuItem.jsx

// Helper function untuk format harga ke Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// Komponen ini menerima satu 'item' sebagai prop
function MenuItem({ item, onItemClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col
                 cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={() => onItemClick(item)}
    >
      <img
        src={item.gambar}
        alt={item.nama}
        // ---- UBAH BARIS INI ----
        className="w-full h-32 md:h-44 object-cover"
        // Penjelasan: Kita ubah tinggi desktop dari 'md:h-48' menjadi 'md:h-44' (sedikit lebih pendek)
      />

      <div className="p-3 md:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* ---- UBAH BARIS INI ---- */}
          <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
            {/* Penjelasan: Kita ubah ukuran font desktop 
            dari 'md:text-xl' menjadi 'md:text-lg' (sedikit lebih kecil) 
          */}
            {item.nama}
          </h3>
          <p className="text-gray-600 mt-1 text-xs md:text-sm">
            {item.deskripsi}
          </p>
        </div>

        <p className="text-lg font-bold text-green-600 mt-3">
          {formatRupiah(item.harga)}
        </p>
      </div>
    </div>
  );
}

export default MenuItem;
