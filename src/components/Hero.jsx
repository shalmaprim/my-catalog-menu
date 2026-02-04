// src/components/Hero.jsx
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function Hero({ namaKafe, infoPromo }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gambar Default (jika admin menghapus semua banner)
  const defaultSlides = [
    {
      url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
      alt: "Default 1",
    },
    {
      url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
      alt: "Default 2",
    },
  ];

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hero_images"));
        const fetchedSlides = querySnapshot.docs.map((doc) => ({
          url: doc.data().url,
          alt: "Promo Banner",
        }));
        setSlides(fetchedSlides);
      } catch (error) {
        console.error("Gagal ambil banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Tentukan gambar mana yang dipakai (Database atau Default)
  const finalSlides = slides.length > 0 ? slides : defaultSlides;

  return (
    <div className="relative text-white bg-gray-900">
      {loading ? (
        // Skeleton Loading (Tampilan sementara saat loading)
        <div className="h-64 md:h-80 w-full flex items-center justify-center bg-gray-800 animate-pulse">
          <span className="text-gray-500">Memuat Banner...</span>
        </div>
      ) : (
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showArrows={true}
          stopOnHover={false}
        >
          {finalSlides.map((slide, index) => (
            <div key={index} className="h-64 md:h-80 relative">
              <img
                src={slide.url}
                alt={slide.alt || "Banner"}
                className="w-full h-full object-cover opacity-80"
              />
              {/* Efek Gradient supaya teks terbaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          ))}
        </Carousel>
      )}

      {/* Overlay Teks */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 pointer-events-none z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg animate-fade-in-up">
          Selamat Datang di {namaKafe}
        </h1>
        <p className="text-md md:text-xl font-light drop-shadow-md bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
          {infoPromo}
        </p>
      </div>
    </div>
  );
}

export default Hero;
