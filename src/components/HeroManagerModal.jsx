// src/components/HeroManagerModal.jsx
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function HeroManagerModal({ isOpen, onClose }) {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const heroCollectionRef = collection(db, "hero_images");

  // 1. Fetch Gambar
  const fetchImages = async () => {
    const data = await getDocs(heroCollectionRef);
    setImages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen]);

  // 2. Upload ke Cloudinary & Simpan ke Firebase
  const handleUpload = async () => {
    if (!file) return alert("Pilih gambar dulu!");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    try {
      // Upload Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();

      if (data.secure_url) {
        // Simpan URL ke Firestore
        await addDoc(heroCollectionRef, { url: data.secure_url });
        setFile(null);
        fetchImages(); // Refresh list
      } else {
        alert("Gagal upload gambar.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
    setUploading(false);
  };

  // 3. Hapus Gambar
  const handleDelete = async (id) => {
    if (confirm("Hapus banner ini?")) {
      await deleteDoc(doc(db, "hero_images", id));
      fetchImages();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Atur Banner / Hero Image</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black font-bold text-xl"
        >
          &times;
        </button>
      </div>

      {/* Area Upload */}
      <div className="flex gap-2 mb-6 p-4 bg-gray-50 rounded border">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {uploading ? "..." : "Upload Banner"}
        </button>
      </div>

      {/* List Gambar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group border rounded overflow-hidden"
          >
            <img
              src={img.url}
              alt="Banner"
              className="w-full h-32 object-cover"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow hover:bg-red-700 opacity-80 group-hover:opacity-100"
            >
              &times;
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-4">
            Belum ada banner.
          </p>
        )}
      </div>
    </Modal>
  );
}

export default HeroManagerModal;
