// src/components/ProtectedRoute.jsx
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth"; // Library bantu
import { Navigate } from "react-router-dom";

// 1. Kita perlu library helper: npm install react-firebase-hooks

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading saat cek status
  }

  if (!user) {
    // Jika tidak ada user (belum login), lempar ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login (ada 'user'), tampilkan halaman yang dilindungi
  return children;
}
export default ProtectedRoute;
