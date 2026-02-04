import { FaArrowRight } from "react-icons/fa"; // Ganti FaPlus jadi FaArrowRight

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function MenuItem({ item, onItemClick }) {
  const isAvailable = item.isAvailable === undefined ? true : item.isAvailable;

  const imageSrc =
    item.gambar && item.gambar !== ""
      ? item.gambar
      : "https://placehold.co/400x300?text=No+Image";

  return (
    <div
      className={`
        group relative bg-white rounded-xl overflow-hidden flex flex-col h-full 
        border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer
        ${!isAvailable ? "opacity-70 grayscale" : ""}
      `}
      onClick={() => isAvailable && onItemClick(item)}
    >
      {/* Gambar */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={item.nama}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=Error";
          }}
        />

        {/* Badge Sold Out */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-widest shadow-lg border border-neutral-700">
              Sold Out
            </span>
          </div>
        )}

        {/* Badge Special */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isBestSeller && (
            <span className="bg-neutral-900 text-amber-500 text-[10px] font-bold px-3 py-1 rounded shadow-md border border-white/10">
              ★ BEST
            </span>
          )}
          {item.isNew && (
            <span className="bg-white text-neutral-900 text-[10px] font-bold px-3 py-1 rounded shadow-md border border-gray-200">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Info Menu */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          {/* Nama Menu */}
          <h3 className="text-lg font-serif font-bold text-neutral-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors">
            {item.nama}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-light">
            {item.deskripsi}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
          <p className="text-lg font-bold text-neutral-900 font-mono">
            {formatRupiah(item.harga)}
          </p>

          {/* PERUBAHAN DISINI: Ganti Tombol (+) jadi Panah Navigasi */}
          {isAvailable && (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-neutral-900 transition-colors">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-wider font-bold">
                Detail
              </span>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-all">
                <FaArrowRight
                  size={12}
                  className="transform group-hover:-rotate-45 transition-transform"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
