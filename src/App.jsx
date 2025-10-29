// src/App.jsx

// 1. Import React Hook dan Komponen
import { useState, useEffect } from "react";
import Modal from "react-modal";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import MenuList from "./components/MenuList";
import Footer from "./components/Footer";
import MenuDetailModal from "./components/MenuDetailModal";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// 2. Import data menu (yang sudah kita ubah strukturnya)
// import { allMenus } from "./data/menuData";

// 3. IMPORT database
import { db } from "./firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function App() {
  // 3. Definisikan info kafe dan daftar tabs
  const namaKafe = "Kedai Kopi Apik";
  const tagline = "Nikmati suasana hangat dan kopi terbaik di Kedai Kopi Apik.";
  const tabKategori = [
    "Best Seller",
    "Semua",
    "Kopi",
    "Non Kopi",
    "Makanan",
    "Snack",
    "Menu Terbaru",
  ];

  // 4. Buat state untuk melacak tab yang aktif
  //    Default-nya adalah 'Best Seller'
  const [activeTab, setActiveTab] = useState("Best Seller");
  const [selectedItem, setSelectedItem] = useState(null);

  // 4. BUAT STATE BARU UNTUK MENYIMPAN DATA DARI FIREBASE
  const [allMenus, setAllMenus] = useState([]); // Default-nya array kosong
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const getMenus = async () => {
      setIsLoading(true); // Mulai loading

      // Buat 'query' ke collection 'menus'
      const menusCollectionRef = collection(db, "menus");
      const q = query(menusCollectionRef, orderBy("nama", "asc")); // Urutkan berdasarkan nama

      const data = await getDocs(q);

      // Ubah data dari Firebase ke format array yang kita inginkan
      const menusData = data.docs.map((doc) => ({
        ...doc.data(), // Ambil semua data (nama, harga, dll.)
        id: doc.id, // Ambil ID dokumennya
      }));

      setAllMenus(menusData); // Simpan ke state
      setIsLoading(false); // Selesai loading
    };

    getMenus();
  }, []);

  // 5. Logika untuk memfilter menu berdasarkan tab yang aktif
  const getFilteredMenus = () => {
    switch (activeTab) {
      case "Best Seller":
        return allMenus.filter((item) => item.isBestSeller);
      case "Menu Terbaru":
        return allMenus.filter((item) => item.isNew);
      case "Semua":
        return allMenus;
      // Untuk kategori 'Kopi', 'Makanan', dll., kita filter berdasarkan
      // properti 'kategori' di data.
      default:
        return allMenus.filter((item) => item.kategori === activeTab);
    }
  };

  // Panggil fungsi filter
  const filteredMenus = getFilteredMenus();

  const handleItemClick = (item) => {
    setSelectedItem(item); // Set item yang diklik ke state
  };

  const handleCloseModal = () => {
    setSelectedItem(null); // Set state kembali ke null untuk menutup
  };

  return (
    <div className="App">
      {/* Navbar tetap sama, tapi kita buat sticky */}
      <div className="sticky top-0 z-20">
        <Navbar namaKafe={namaKafe} />
      </div>

      {/* Hero Section */}
      <Hero namaKafe={namaKafe} tagline={tagline} />

      {/* Tabs */}
      <Tabs
        tabs={tabKategori}
        activeTab={activeTab}
        onTabClick={setActiveTab} // <-- Ini akan mengubah state 'activeTab'
      />

      {/* Kontainer Utama untuk daftar menu */}
      <main className="container mx-auto p-4 md:p-8">
        {/* MenuList akan me-render menu yang sudah difilter */}
        <MenuList items={filteredMenus} onItemClick={handleItemClick} />
      </main>

      {/* Footer Elegan */}
      <Footer />

      <MenuDetailModal
        isOpen={selectedItem !== null} // Modal terbuka jika selectedItem BUKAN null
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
}

export default App;
