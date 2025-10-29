// src/components/MenuList.jsx
import MenuItem from "./MenuItem";

function MenuList({ items, onItemClick }) {
  if (items.length === 0) {
    // ... (tidak ada perubahan di sini)
  }

  return (
    // ---- UBAH BARIS INI ----
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 mt-8 ">
      {/* Penjelasan:
      - 'grid-cols-2': Ini untuk mobile, tetap 2 kolom (sesuai permintaanmu).
      - 'md:grid-cols-2' (lama) diubah menjadi 'md:grid-cols-3' (baru).
      - 'md:gap-6': Kita biarkan jaraknya (gap) tetap 6 di desktop.
    */}

      {items.map((item) => (
        <MenuItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
}

export default MenuList;
