import { useState, useEffect } from "react";
import Modal from "react-modal";

// Import Komponen
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import MenuList from "./components/MenuList";
import Footer from "./components/Footer";
import MenuDetailModal from "./components/MenuDetailModal";
import RoastedBeanBoard from "./components/RoastedBeansBoard";

// Import Firebase
import { db } from "./firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

Modal.setAppElement("#root");

function App() {
  const namaKafe = "Kedai Kopi Apik";
  const infoPromo =
    "Nikmati suasana hangat dan kopi terbaik di Kedai Kopi Apik.";

  // --- KATEGORI BARU ---
  const tabKategori = [
    "Best Seller",
    "Semua",
    "Coffee",
    "Non Coffee",
    "Refreshers",
    "Roasted Bean",
    "Sarapan",
    "Main Course",
    "Pastry & Cakes",
    "Snack",
    "Menu Terbaru",
  ];

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("Best Seller");
  const [selectedItem, setSelectedItem] = useState(null);
  const [allMenus, setAllMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Menampilkan 12 menu per halaman

  // --- FETCH DATA ---
  useEffect(() => {
    const getMenus = async () => {
      setIsLoading(true);
      try {
        const menusCollectionRef = collection(db, "menus");
        const q = query(menusCollectionRef, orderBy("nama", "asc"));
        const data = await getDocs(q);

        const menusData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          // Pastikan isAvailable default true jika tidak ada di database
          isAvailable:
            doc.data().isAvailable === undefined
              ? true
              : doc.data().isAvailable,
        }));

        setAllMenus(menusData);
      } catch (error) {
        console.error("Error fetching menus: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getMenus();
  }, []);

  // Reset ke Halaman 1 jika ganti tab
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // --- FILTER LOGIC ---
  const getFilteredMenus = () => {
    switch (activeTab) {
      case "Best Seller":
        return allMenus.filter((item) => item.isBestSeller);
      case "Menu Terbaru":
        return allMenus.filter((item) => item.isNew);
      case "Semua":
        return allMenus;
      default:
        return allMenus.filter((item) => item.kategori === activeTab);
    }
  };
  const filteredMenus = getFilteredMenus();

  // --- PAGINATION LOGIC ---
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

  const handleItemClick = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl">Memuat menu...</p>
      </div>
    );
  }

  return (
    // Background Clean (Abu-abu sangat muda)
    <div className="App flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar namaKafe={namaKafe} />

      <div className="pt-16">
        <Hero namaKafe={namaKafe} infoPromo={infoPromo} />
      </div>

      {/* Board Roasted Bean tetap Gelap agar terlihat spesial/premium */}
      <RoastedBeanBoard menus={allMenus} />

      <Tabs
        tabs={tabKategori}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow">
        <MenuList items={currentItems} onItemClick={handleItemClick} />

        {/* Pagination Style Clean */}
        {filteredMenus.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all border
                ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed"
                    : "bg-white text-neutral-900 border-gray-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
                }
              `}
            >
              &larr; Prev
            </button>

            <div className="px-4 py-2 bg-white rounded-lg border border-gray-300 text-sm font-bold text-neutral-900">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all border
                ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed"
                    : "bg-white text-neutral-900 border-gray-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
                }
              `}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </main>

      <Footer />
      <MenuDetailModal
        isOpen={selectedItem !== null}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
}

export default App;
