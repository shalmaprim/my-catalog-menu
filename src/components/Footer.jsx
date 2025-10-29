// src/components/Footer.jsx

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-8 mt-16">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Kedai Kopi Apik</h3>
        <p className="mb-4">
          Jl. Suha No.204, Majalengka Wetan, Kec. Majalengka, Kabupaten
          Majalengka, Jawa Barat 45418
        </p>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            TikTok
          </a>
          <a href="#" className="hover:text-white">
            Whatsapp
          </a>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Kedai Kopi Apik. Dibuat oleh
          Mahasiswa KP.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
