// src/components/Navbar.jsx

// 1. Import Link dari router
import { Link, useNavigate } from "react-router-dom";

// 2. Import hooks dan auth dari firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";

// 3. Import ikon-ikon yang kita butuhkan
import { FaUserCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";

function Navbar({ namaKafe }) {
  // 4. Gunakan hook 'useAuthState' untuk cek status login
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // 5. Buat fungsi logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Arahkan kembali ke halaman login setelah logout
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-20">
      {/* 6. Ubah container menjadi flex 'justify-between' */}
      <div className="container mx-auto flex justify-between items-center">
        {/* --- SISI KIRI: Logo & Nama Kafe (Tidak Berubah) --- */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png" // Sesuaikan nama file ini
            alt="Logo Kafe"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {namaKafe}
            </h1>
            <p className="text-sm text-gray-600">Katalog Menu Digital</p>
          </div>
        </div>

        {/* --- SISI KANAN: Ikon Admin (BARU) --- */}
        <div className="flex items-center space-x-4">
          {loading ? (
            // Tampilkan placeholder saat status login sedang dicek
            <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            // --- JIKA SUDAH LOGIN ---
            <>
              <Link
                to="/admin"
                title="Dashboard Admin"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <FaTachometerAlt size={26} />
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <FaSignOutAlt size={26} />
              </button>
            </>
          ) : (
            // --- JIKA BELUM LOGIN ---
            <Link
              to="/login"
              title="Admin Login"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              <FaUserCircle size={28} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
