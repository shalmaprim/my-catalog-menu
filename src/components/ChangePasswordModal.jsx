// src/components/ChangePasswordModal.jsx
import { useState } from "react";
import Modal from "react-modal";
import { auth } from "../firebase-config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    const user = auth.currentUser;
    // Buat kredensial dari password lama untuk verifikasi
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      // 1. Re-autentikasi (Cek password lama)
      await reauthenticateWithCredential(user, credential);

      // 2. Update password
      await updatePassword(user, newPassword);

      setSuccess("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Tutup modal setelah 2 detik
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        setError("Password lama salah.");
      } else {
        setError("Gagal mengubah password: " + err.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
      className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6 outline-none"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Ganti Password Admin
      </h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">
          {success}
        </p>
      )}

      <form onSubmit={handleChangePassword}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Lama
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password Baru
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Memproses..." : "Simpan Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ChangePasswordModal;
