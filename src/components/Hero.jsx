// src/components/Hero.jsx

// 1. Import Carousel dari library
import { Carousel } from "react-responsive-carousel";

// 2. Definisikan gambar-gambar yang akan dipakai
const slideImages = [
  {
    url: "/images/hero-1.jpg",
    alt: "Suasana Kafe Koding",
  },
  {
    url: "/images/hero-2.webp",
    alt: "Promo Kopi Pilihan",
  },
  {
    url: "/images/hero-3.jpg",
    alt: "Menu Makanan Spesial",
  },
];

function Hero({ namaKafe, tagline }) {
  return (
    // 3. Wrapper utama kita buat 'relative'
    <div className="relative text-white">
      {/* 4. Ini adalah komponen Carousel */}
      <Carousel
        showThumbs={false} // Sembunyikan thumbnail di bawah
        showStatus={false} // Sembunyikan status "1 of 3"
        infiniteLoop={true} // Selalu berputar (looping)
        autoPlay={true} // Main otomatis
        interval={5000} // Pindah slide setiap 5 detik (5000 ms)
        showArrows={true} // Tampilkan panah kiri-kanan
        className="hero-carousel" // Class opsional untuk styling
      >
        {/* 5. Kita loop data gambar kita */}
        {slideImages.map((slide, index) => (
          <div key={index} className="h-64 md:h-80">
            {" "}
            {/* Atur tinggi slide */}
            <img
              src={slide.url}
              alt={slide.alt}
              className="w-full h-full object-cover" // object-cover agar gambar pas
            />
          </div>
        ))}
      </Carousel>

      {/* 6. Overlay untuk Teks (PENTING) */}
      {/* Kita letakkan teks di atas slider menggunakan 'absolute positioning'.
        'inset-0' membuatnya menutupi seluruh area.
        'bg-black/40' memberi lapisan gelap agar teks mudah dibaca.
      */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          Selamat Datang di {namaKafe}
        </h1>
        <p className="text-lg md:text-xl font-light drop-shadow-lg">
          {tagline}
        </p>
      </div>
    </div>
  );
}

export default Hero;
