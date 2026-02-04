import { useState } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
// Menggabungkan import agar tidak error
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Lupa Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
export default LoginPage;
