// src/components/Footer.jsx
function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-400 py-12 mt-16 border-t border-black">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">
          Kedai Kopi Apik
        </h3>
        <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Nikmati setiap tegukan kopi terbaik kami dengan suasana yang hangat
          dan menyenangkan.
        </p>

        <div className="w-16 h-1 bg-amber-600 mx-auto mb-6 rounded-full"></div>

        <div className="flex justify-center space-x-8 mb-8 text-sm font-medium">
          <a
            href="https://www.instagram.com/kopiapik"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@kopiapik10?_r=1&_t=ZS-93ZpMFbhcHw"
            className="hover:text-white transition-colors"
          >
            TikTok
          </a>
          <a
            href="https://wa.me/6285864850565"
            className="hover:text-white transition-colors"
          >
            Whatsapp
          </a>
        </div>

        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Kedai Kopi Apik. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
