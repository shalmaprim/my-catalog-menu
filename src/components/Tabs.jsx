function Tabs({ tabs, activeTab, onTabClick }) {
  return (
    // Background Putih/Terang agar kontras dengan Tab Hitam
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => onTabClick(tab)}
                className={`
                  px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border
                  ${
                    isActive
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-lg scale-105" // Tab Aktif: HITAM
                      : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black"
                  } // Tab Inaktif: Minimalis
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
