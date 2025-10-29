// src/components/Tabs.jsx

function Tabs({ tabs, activeTab, onTabClick }) {
  return (
    // Kita buat sticky agar tabs-nya menempel di atas saat di-scroll
    <div className="bg-white shadow-md sticky top-[88px] z-10">
      {/* Sesuaikan 'top-[88px]' jika tinggi Navbar-mu berbeda */}
      <div className="container mx-auto">
        {/* 'flex-nowrap' agar tidak ke bawah di HP
          'overflow-x-auto' agar bisa di-scroll horizontal di HP
        */}
        <div className="flex flex-nowrap overflow-x-auto space-x-2 p-4">
          {tabs.map((tab) => {
            // Cek apakah tab ini yang sedang aktif
            const isActive = tab === activeTab;

            // Terapkan style yang berbeda jika aktif
            const activeClasses = "bg-yellow-500 text-white font-semibold";
            const inactiveClasses =
              "bg-gray-200 text-gray-700 hover:bg-gray-300";

            return (
              <button
                key={tab}
                onClick={() => onTabClick(tab)}
                className={`
                  py-2 px-4 rounded-full text-sm whitespace-nowrap
                  transition-all duration-300
                  ${isActive ? activeClasses : inactiveClasses}
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Tabs;
