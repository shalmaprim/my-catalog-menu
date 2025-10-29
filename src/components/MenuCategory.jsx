// src/components/MenuCategory.jsx
import MenuItem from "./MenuItem"; // Import komponen kartu menu

// Menerima 'kategori' (string) dan 'items' (array) sebagai props
function MenuCategory({ kategori, items }) {
  return (
    <section className="mb-12">
      {/* Judul Kategori */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-yellow-500">
        {kategori}
      </h2>

      {/* Grid untuk semua item menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kita 'map' (looping) semua 'items' dalam kategori ini.
          Untuk setiap 'item', kita render satu komponen <MenuItem />
        */}
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MenuCategory;
