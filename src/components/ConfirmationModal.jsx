import { FaExclamationTriangle } from "react-icons/fa";

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Container Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-fade-in-up">
        {/* Bagian Atas: Ikon Peringatan */}
        <div className="bg-red-50 p-6 flex justify-center border-b border-red-100">
          <div className="bg-red-100 p-4 rounded-full text-red-500 animate-pulse">
            <FaExclamationTriangle size={32} />
          </div>
        </div>

        {/* Bagian Tengah: Teks */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* Bagian Bawah: Tombol Aksi */}
        <div className="p-4 bg-gray-50 flex gap-3 justify-center border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm"
            disabled={isLoading}
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 rounded-lg text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
