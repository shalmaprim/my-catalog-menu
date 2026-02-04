import { useState } from "react";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Link reset password telah dikirim ke email Anda.");
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"
          ? "Email tidak terdaftar."
          : "Gagal mengirim email.",
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Lupa Password?</h2>
        {message && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleReset}>
          <div className="mb-6">
            <label className="block mb-2">Email Admin</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
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
