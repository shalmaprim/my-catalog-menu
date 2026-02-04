import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
// Hapus FaCoffee jika tidak dipakai lagi, atau biarkan saja tidak apa-apa
import { FaUserCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";

function Navbar({ namaKafe }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-neutral-900 shadow-md transition-all border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo & Nama */}
        <div className="flex items-center gap-3">
          {/* --- BAGIAN INI YANG DIUBAH (DARI ICON JADI GAMBAR) --- */}
          <img
            src="/logo.png" // Pastikan nama file di folder public sesuai (logo.png / logo.jpg)
            alt="Logo Kafe"
            className="h-10 w-auto object-contain rounded-lg"
          />
          {/* ----------------------------------------------------- */}

          <div>
            <h1 className="text-xl font-bold text-white tracking-wide leading-none font-serif">
              {namaKafe}
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
              Est. 2017
            </p>
          </div>
        </div>

        {/* Menu Kanan (Tetap Sama) */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-medium text-white hover:text-amber-400 transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/5"
              >
                <FaTachometerAlt />{" "}
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <FaUserCircle size={22} />{" "}
              <span className="hidden sm:inline">Staff</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
