// src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  // --- State Form ---
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState(0);
  const [kategori, setKategori] = useState("Kopi");
  const [deskripsi, setDeskripsi] = useState("");
  const [deskripsiDetail, setDeskripsiDetail] = useState(""); // Pastikan ini ada
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // --- State untuk Gambar & Upload ---
  const [gambar, setGambar] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- State Editing ---
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);

  // --- STATE BARU UNTUK TABS ---
  // 1. Definisikan kategori untuk Tabs
  const definedCategories = ["Semua", "Kopi", "Non Kopi", "Makanan", "Snack"];
  // 2. Buat state untuk melacak tab yang aktif
  const [activeTab, setActiveTab] = useState("Semua"); // Default-nya 'Semua'

  // --- (1) FUNGSI READ (Fetch Menus) ---
  const menusCollectionRef = collection(db, "menus");
  const fetchMenus = async () => {
    const data = await getDocs(menusCollectionRef);
    setMenus(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // --- (2) FUNGSI UPLOAD GAMBAR (KE CLOUDINARY) ---
  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(gambar);
        return;
      }
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      // GANTI DENGAN NAMA PRESET-MU
      formData.append("upload_preset", "katalog_menu");
      // GANTI DENGAN CLOUD NAME-MU
      fetch("https://api.cloudinary.com/v1_1/dx4c3un87/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            setIsUploading(false);
            resolve(data.secure_url);
          } else {
            reject("Upload ke Cloudinary gagal.");
          }
        })
        .catch((error) => {
          console.error("Upload gagal:", error);
          setIsUploading(false);
          reject(error);
        });
    });
  };

  // --- (3) FUNGSI CREATE & UPDATE (Handle Submit Form) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !imageFile) {
      alert("Harap pilih gambar untuk menu baru.");
      return;
    }
    if (isUploading) {
      alert("Harap tunggu upload gambar selesai.");
      return;
    }
    try {
      const imageURL = await uploadImage();
      const menuData = {
        nama,
        harga: Number(harga),
        kategori,
        deskripsi,
        deskripsiDetail, // Pastikan ini ikut tersimpan
        isBestSeller,
        isNew,
        gambar: imageURL,
      };
      if (isEditing) {
        const menuDoc = doc(db, "menus", currentMenuId);
        await updateDoc(menuDoc, menuData);
      } else {
        await addDoc(menusCollectionRef, menuData);
      }
      fetchMenus();
      clearForm();
    } catch (error) {
      console.error("Gagal menyimpan menu:", error);
      alert("Gagal menyimpan menu: " + error.message);
    }
  };

  // --- (4) FUNGSI DELETE (Hapus Menu) ---
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus menu ini?")) {
      const menuDoc = doc(db, "menus", id);
      await deleteDoc(menuDoc);
      fetchMenus();
    }
  };

  // --- (5) FUNGSI UNTUK EDIT ---
  const handleEdit = (menu) => {
    setIsEditing(true);
    setCurrentMenuId(menu.id);
    setNama(menu.nama);
    setHarga(menu.harga);
    setKategori(menu.kategori);
    setDeskripsi(menu.deskripsi || "");
    setDeskripsiDetail(menu.deskripsiDetail || ""); // Pastikan ini ada
    setIsBestSeller(menu.isBestSeller || false);
    setIsNew(menu.isNew || false);
    setGambar(menu.gambar || "");
    setImageFile(null);
  };

  // --- FUNGSI LOGOUT ---
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Fungsi untuk membersihkan form (pastikan lengkap)
  const clearForm = () => {
    setNama("");
    setHarga(0);
    setKategori("Kopi");
    setDeskripsi("");
    setDeskripsiDetail(""); // Pastikan ini ada
    setIsBestSeller(false);
    setIsNew(false);
    setGambar("");
    setImageFile(null);
    setIsUploading(false);
    setIsEditing(false);
    setCurrentMenuId(null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = null;
  };

  // --- TAMPILAN (JSX) ---
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header Dashboard & Tombol Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* --- FORM UNTUK TAMBAH / EDIT MENU --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-12"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Edit Menu" : "Tambah Menu Baru"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kolom Kiri */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Nama Menu</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Harga (Rp)</label>
              <input
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Kopi">Kopi</option>
                <option value="Non Kopi">Non Kopi</option>
                <option value="Makanan">Makanan</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          </div>
          {/* Kolom Kanan */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
              ></textarea>
            </div>

            {/* Input Deskripsi Detail */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Deskripsi Detail (untuk modal)
              </label>
              <textarea
                value={deskripsiDetail}
                onChange={(e) => setDeskripsiDetail(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
              ></textarea>
            </div>

            {/* Input Gambar */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Gambar Menu</label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0 file:text-sm file:font-semibold
                           file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {isEditing && gambar && !imageFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Gambar saat ini:</p>
                  <img
                    src={gambar}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              {isUploading && (
                <div className="mt-2 text-blue-600">
                  Mengunggah gambar... mohon tunggu...
                </div>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex space-x-6">
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="mr-2 h-5 w-5"
                />
                <label className="text-gray-700">Best Seller</label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="mr-2 h-5 w-5"
                />
                <label className="text-gray-700">Menu Terbaru</label>
              </div>
            </div>
          </div>
        </div>
        {/* Tombol Submit */}
        <div className="mt-4 flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading
              ? "Mengunggah..."
              : isEditing
              ? "Update Menu"
              : "Simpan Menu"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-500 text-white px-6 py-2 rounded shadow hover:bg-gray-600"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* --- DAFTAR MENU (VERSI BARU DENGAN TABS) --- */}
      <h2 className="text-2xl font-semibold mb-4">Daftar Menu</h2>

      {/* --- Tombol Tabs --- */}
      <div className="flex flex-wrap space-x-2 mb-6 border-b border-gray-200">
        {definedCategories.map((category) => {
          const isActive = category === activeTab;
          return (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`
                py-2 px-4 font-medium text-sm
                transition-all duration-200
                ${
                  isActive
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* --- Daftar Menu yang Sudah Difilter --- */}
      <div className="space-y-4">
        {(() => {
          // 3. Filter menu berdasarkan activeTab
          const filteredMenus =
            activeTab === "Semua"
              ? menus.sort((a, b) => a.nama.localeCompare(b.nama)) // Urutkan 'Semua' berdasarkan nama
              : menus.filter((menu) => menu.kategori === activeTab);

          // 4. Tampilkan pesan jika kosong
          if (filteredMenus.length === 0) {
            return (
              <p className="text-gray-500 text-center py-4">
                Tidak ada menu di kategori ini.
              </p>
            );
          }

          // 5. Render daftar menu yang sudah difilter
          return filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-row items-start bg-white p-4 rounded-lg shadow"
            >
              {/* 1. Kolom Gambar */}
              <img
                src={menu.gambar}
                alt={menu.nama}
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded mr-4 shrink-0"
                // 'shrink-0' agar gambar tidak 'penyok'
              />

              {/* 2. Kolom Konten (Teks & Tombol) */}
              <div className="flex-1 flex flex-col justify-between h-full">
                {/* Bagian Teks */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {menu.nama}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {menu.kategori} -{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(menu.harga)}
                  </p>
                </div>

                {/* Bagian Tombol */}
                <div className="space-x-2 mt-3">
                  <button
                    onClick={() => handleEdit(menu)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

export default AdminPage;
