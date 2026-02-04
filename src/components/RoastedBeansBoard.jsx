import { FaFire, FaMugHot, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

function RoastedBeanBoard({ menus }) {
  // Ambil hanya kategori Roasted Bean
  const beans = menus.filter((item) => item.kategori === "Roasted Bean");

  if (beans.length === 0) return null;

  return (
    <div className="container mx-auto px-4 mt-8">
      {/* Container Utama: Hitam Elegan dengan Border Emas Tipis */}
      <div className="relative overflow-hidden bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 p-8">
        {/* Dekorasi Background (Efek Glow Halus) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        {/* --- HEADER --- */}
        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-4">
            <FaFire className="animate-pulse" /> Fresh from Roastery
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            Daily Roasted Beans
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto font-light leading-relaxed">
            Update ketersediaan biji kopi
          </p>
        </div>

        {/* --- GRID LIST BEANS --- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {beans.map((bean) => (
            <div
              key={bean.id}
              className={`
                group relative flex items-center p-4 rounded-xl border transition-all duration-300
                ${
                  bean.isAvailable
                    ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
                    : "bg-black/20 border-white/5 opacity-60 grayscale"
                }
              `}
            >
              {/* Gambar Bean (Circle) */}
              <div className="relative shrink-0 mr-4">
                <img
                  src={
                    bean.gambar && bean.gambar !== ""
                      ? bean.gambar
                      : "https://placehold.co/100x100/1a1a1a/FFF?text=Bean"
                  }
                  alt={bean.nama}
                  className={`w-16 h-16 rounded-full object-cover border-2 ${bean.isAvailable ? "border-amber-500" : "border-gray-700"}`}
                />
                {/* Status Indicator Kecil di gambar */}
                <div
                  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[10px] text-white ${bean.isAvailable ? "bg-green-500" : "bg-red-500"}`}
                >
                  {bean.isAvailable ? "✓" : "✕"}
                </div>
              </div>

              {/* Detail Text */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-serif font-bold text-lg truncate ${bean.isAvailable ? "text-white group-hover:text-amber-400" : "text-gray-500"}`}
                >
                  {bean.nama}
                </h3>

                {/* Status Badge Text */}
                <div className="mt-1 flex items-center gap-2">
                  {bean.isAvailable ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      TERSEDIA
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md">
                      <FaTimesCircle /> HABIS / SOLD
                    </span>
                  )}
                </div>
              </div>

              {/* Icon Dekorasi di kanan */}
              {bean.isAvailable && (
                <FaMugHot className="text-white/5 text-4xl absolute right-2 bottom-2 group-hover:text-amber-500/10 transition-colors" />
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center border-t border-white/5 pt-4">
          <p className="text-xs text-gray-500 italic">
            *Status ketersediaan diupdate oleh Barista.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoastedBeanBoard;
