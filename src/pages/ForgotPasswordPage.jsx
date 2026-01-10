// src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      // Fungsi ajaib dari Firebase untuk kirim email reset
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Link reset password telah dikirim ke email Anda. Silakan cek Inbox atau Spam."
      );
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("Email tidak terdaftar.");
      } else {
        setError("Gagal mengirim email reset. Coba lagi nanti.");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Lupa Password?
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Masukkan email Anda, kami akan mengirimkan link untuk mereset
          password.
        </p>

        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Email Admin</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@kafemu.com"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400"
          >
            {isLoading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
