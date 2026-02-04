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
import ChangePasswordModal from "../components/ChangePasswordModal";
import HeroManagerModal from "../components/HeroManagerModal";
import ConfirmationModal from "../components/ConfirmationModal"; // <-- IMPORT MODAL BARU

// Import Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImages,
  FaKey,
  FaSignOutAlt,
  FaSearch,
  FaTimes,
  FaCoffee,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";

function AdminPage() {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  // --- STATE FORM ---
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState(0);
  const [kategori, setKategori] = useState("Coffee");
  const [deskripsi, setDeskripsi] = useState("");
  const [deskripsiDetail, setDeskripsiDetail] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // State Gambar
  const [gambar, setGambar] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // State UI Control
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // State Modal-Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  // --- STATE DELETE MODAL (BARU) ---
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    menuId: null,
    menuName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Kategori
  const definedCategories = [
    "Semua",
    "Coffee",
    "Non Coffee",
    "Refreshers",
    "Roasted Bean",
    "Sarapan",
    "Main Course",
    "Pastry & Cakes",
    "Snack",
  ];
  const [activeTab, setActiveTab] = useState("Semua");

  // --- FETCH DATA ---
  const menusCollectionRef = collection(db, "menus");
  const fetchMenus = async () => {
    const data = await getDocs(menusCollectionRef);
    setMenus(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        isAvailable:
          doc.data().isAvailable === undefined ? true : doc.data().isAvailable,
      })),
    );
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // --- UPLOAD IMAGE ---
  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(gambar);
        return;
      }
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      formData.append("upload_preset", preset);

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            resolve(data.secure_url);
          } else {
            alert("Gagal Upload");
            reject(data);
          }
          setIsUploading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsUploading(false);
          reject(err);
        });
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- HANDLERS UTAMA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await uploadImage();
      const imageURL = result || "";
      const finalPrice = kategori === "Roasted Bean" ? 0 : Number(harga);

      const menuData = {
        nama,
        harga: finalPrice,
        kategori,
        deskripsi,
        deskripsiDetail,
        isBestSeller,
        isNew,
        gambar: imageURL,
        isAvailable: true,
      };

      if (isEditing) {
        await updateDoc(doc(db, "menus", currentMenuId), menuData);
      } else {
        await addDoc(menusCollectionRef, menuData);
      }
      fetchMenus();
      clearForm();
      setShowForm(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // --- HANDLER DELETE BARU (DENGAN MODAL) ---

  // 1. Saat tombol tong sampah diklik: Buka Modal
  const confirmDeleteClick = (menu) => {
    setDeleteModal({
      isOpen: true,
      menuId: menu.id,
      menuName: menu.nama,
    });
  };

  // 2. Saat tombol "Ya, Hapus" di modal diklik: Eksekusi Hapus
  const handleExecuteDelete = async () => {
    if (!deleteModal.menuId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "menus", deleteModal.menuId));
      fetchMenus();
      setDeleteModal({ isOpen: false, menuId: null, menuName: "" }); // Tutup modal
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus menu.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAvailability = async (menu) => {
    try {
      await updateDoc(doc(db, "menus", menu.id), {
        isAvailable: !menu.isAvailable,
      });
      fetchMenus();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (menu) => {
    setIsEditing(true);
    setCurrentMenuId(menu.id);
    setNama(menu.nama);
    setHarga(menu.harga);
    setKategori(menu.kategori);
    setDeskripsi(menu.deskripsi || "");
    setDeskripsiDetail(menu.deskripsiDetail || "");
    setIsBestSeller(menu.isBestSeller || false);
    setIsNew(menu.isNew || false);
    setGambar(menu.gambar || "");
    setPreviewUrl(menu.gambar || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const clearForm = () => {
    setNama("");
    setHarga(0);
    setKategori("Coffee");
    setDeskripsi("");
    setDeskripsiDetail("");
    setIsBestSeller(false);
    setIsNew(false);
    setGambar("");
    setImageFile(null);
    setPreviewUrl("");
    setIsEditing(false);
    setCurrentMenuId(null);
  };

  const filteredMenus = menus
    .filter((m) => {
      const matchCategory =
        activeTab === "Semua" ? true : m.kategori === activeTab;
      const matchSearch = m.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => a.nama.localeCompare(b.nama));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <nav className="bg-neutral-900 shadow-md fixed w-full z-20 top-0 left-0 h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg text-amber-500 border border-white/5">
            <FaCoffee size={20} />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-wide text-white hidden md:block font-serif">
            Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setIsHeroModalOpen(true)}
            className="p-2 text-gray-300 hover:text-white bg-white/10 rounded-lg md:hidden"
          >
            <FaImages size={16} />
          </button>
          <button
            onClick={() => setIsHeroModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaImages /> <span>Banner</span>
          </button>
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="p-2 text-gray-300 hover:text-white bg-white/10 rounded-lg md:hidden"
          >
            <FaKey size={16} />
          </button>
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaKey /> <span>Password</span>
          </button>
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all"
          >
            <FaSignOutAlt /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12 max-w-7xl">
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              Manajemen Menu
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Total <strong>{filteredMenus.length}</strong> menu.
            </p>
          </div>
          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full md:w-64 text-sm"
              />
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                clearForm();
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold shadow-lg transition-all text-sm whitespace-nowrap ${showForm ? "bg-gray-200 text-gray-700" : "bg-neutral-900 text-amber-500 hover:bg-black"}`}
            >
              {showForm ? (
                <FaTimes />
              ) : (
                <>
                  <FaPlus /> Tambah
                </>
              )}
            </button>
          </div>
        </div>

        {/* FORMULIR (SAMA SEPERTI SEBELUMNYA) */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-8 mb-8 animate-fade-in-down">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-lg md:text-xl font-bold text-neutral-900 flex items-center gap-2">
                {isEditing ? (
                  <>
                    <FaEdit className="text-amber-500" /> Edit Menu
                  </>
                ) : (
                  <>
                    <FaPlus className="text-neutral-900" /> Tambah Menu
                  </>
                )}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-amber-500"
                    >
                      {definedCategories.slice(1).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">
                      Nama Menu
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  {kategori !== "Roasted Bean" && (
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                      Upload Gambar Menu
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-amber-400 transition-all cursor-pointer relative bg-white group"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <input
                        id="fileInput"
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      {previewUrl ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                              Ganti Gambar
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8">
                          <div className="bg-gray-100 p-3 rounded-full mb-3 text-gray-400 mx-auto w-fit group-hover:text-amber-500 group-hover:bg-amber-50 transition-colors">
                            <FaCloudUploadAlt size={28} />
                          </div>
                          <p className="text-sm font-bold text-gray-600 group-hover:text-amber-600">
                            Klik untuk upload gambar
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {kategori !== "Roasted Bean" && (
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg w-full hover:bg-amber-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={isBestSeller}
                          onChange={(e) => setIsBestSeller(e.target.checked)}
                          className="mr-2 rounded text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-xs md:text-sm font-bold text-gray-700">
                          Best Seller
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg w-full hover:bg-blue-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={isNew}
                          onChange={(e) => setIsNew(e.target.checked)}
                          className="mr-2 rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-xs md:text-sm font-bold text-gray-700">
                          New Menu
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 text-sm font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-lg text-white bg-neutral-900 hover:bg-black font-bold text-sm shadow-lg flex items-center gap-2"
                >
                  {isUploading ? "..." : isEditing ? "Simpan" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABS KATEGORI */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide">
          {definedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${activeTab === cat ? "bg-neutral-900 text-white border-neutral-900 shadow-md" : "bg-white text-gray-500 border-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID MENU ITEMS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {currentItems.map((menu) => {
            const isRoastedBean = menu.kategori === "Roasted Bean";
            return (
              <div
                key={menu.id}
                className={`group bg-white rounded-xl md:rounded-2xl shadow-sm border flex flex-col overflow-hidden ${isRoastedBean ? "border-amber-400 ring-1 md:ring-2 ring-amber-100" : "border-gray-100"}`}
              >
                <div className="relative h-32 md:h-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      menu.gambar && menu.gambar !== ""
                        ? menu.gambar
                        : "https://placehold.co/400x300?text=No+Img"
                    }
                    alt={menu.nama}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!menu.isAvailable ? "grayscale opacity-70" : ""}`}
                  />
                  {!menu.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                      <span className="bg-red-500 text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded shadow uppercase border border-red-400">
                        Habis
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3">
                    <span className="bg-white/95 backdrop-blur text-neutral-900 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">
                      {menu.kategori}
                    </span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-sm md:text-lg font-bold text-neutral-900 mb-0.5 md:mb-1 leading-tight truncate">
                      {menu.nama}
                    </h3>
                    {isRoastedBean ? (
                      <p className="text-[10px] md:text-xs font-bold text-amber-600 uppercase tracking-wide flex items-center gap-1">
                        <FaBoxOpen /> Stock
                      </p>
                    ) : (
                      <p className="text-neutral-600 font-bold font-mono text-xs md:text-base">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(menu.harga)}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleAvailability(menu)}
                      className={`flex-1 py-1.5 md:py-2 px-1 md:px-3 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 border ${menu.isAvailable ? "bg-white text-green-600 border-green-200 hover:bg-green-50" : "bg-white text-red-500 border-red-200 hover:bg-red-50"}`}
                    >
                      {menu.isAvailable ? "Ready" : "Habis"}
                    </button>
                    <div className="flex gap-1 border-l border-gray-100 pl-1 md:pl-2">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <FaEdit size={14} className="md:w-4 md:h-4" />
                      </button>

                      {/* --- TOMBOL DELETE UPDATE (MEMANGGIL CONFIRM) --- */}
                      <button
                        onClick={() => confirmDeleteClick(menu)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <FaTrash size={14} className="md:w-4 md:h-4" />
                      </button>
                      {/* ----------------------------------------------- */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Control */}
        {filteredMenus.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 md:gap-3 mt-8 pb-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-all border shadow-sm ${currentPage === 1 ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed" : "bg-white text-neutral-900 border-gray-300"}`}
            >
              <FaChevronLeft size={10} /> Prev
            </button>
            <div className="px-3 py-1.5 md:px-5 md:py-2 bg-white rounded-lg border border-gray-300 text-xs md:text-sm font-bold text-neutral-900 shadow-sm">
              <span className="text-amber-600">{currentPage}</span> /{" "}
              {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-all border shadow-sm ${currentPage === totalPages ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed" : "bg-white text-neutral-900 border-gray-300"}`}
            >
              Next <FaChevronRight size={10} />
            </button>
          </div>
        )}
      </main>

      {/* MODAL-MODAL */}
      <HeroManagerModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* --- INI DIA MODAL KONFIRMASI BARU KITA --- */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Hapus Menu?"
        message={`Apakah Anda yakin ingin menghapus "${deleteModal.menuName}" secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleExecuteDelete}
        isLoading={isDeleting}
      />
      {/* ----------------------------------------- */}
    </div>
  );
}

export default AdminPage;
