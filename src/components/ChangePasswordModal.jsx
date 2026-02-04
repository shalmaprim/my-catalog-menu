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
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return setMsg({
        type: "error",
        text: "Password konfirmasi tidak cocok.",
      });
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMsg({ type: "success", text: "Password berhasil diubah!" });
      setTimeout(() => {
        onClose();
        setMsg({ type: "", text: "" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err.code === "auth/wrong-password"
            ? "Password lama salah."
            : "Gagal: " + err.message,
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4">Ganti Password</h2>
      {msg.text && (
        <p
          className={`p-2 rounded mb-3 text-sm ${msg.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {msg.text}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password Lama"
          className="w-full p-2 border rounded mb-3"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password Baru"
          className="w-full p-2 border rounded mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi Password Baru"
          className="w-full p-2 border rounded mb-6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export default ChangePasswordModal;
