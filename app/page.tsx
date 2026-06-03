import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-rose-600">
            RESTO <span className="text-slate-900">A&V</span>
          </h1>

          <nav>
            {/* SATU-SATUNYA TOMBOL DI HALAMAN */}
            <Link
              href="/login"
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-sm tracking-wide"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/banner.jpg"
          alt="Restaurant Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-neutral-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
              ✨ Selamat Datang di Resto A&V
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
              Nikmati Makanan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                Terbaik Setiap Hari
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Restoran modern dengan berbagai pilihan menu berkualitas, cita
              rasa legendaris, dan pelayanan prima yang siap memanjakan lidah Anda.
              Silakan login melalui menu di atas untuk menjelajahi menu kami.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="/nyumi.jpg"
                alt="Hidangan Lezat Resto A&V"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="space-y-4">
              <span className="text-rose-600 font-bold uppercase tracking-widest text-sm block">
                Tentang Kami
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Pengalaman Kuliner <br /> Yang Berbeda
              </h2>

              <p className="text-slate-600 leading-relaxed pt-2">
                Kami menghadirkan berbagai pilihan makanan dan minuman dengan
                kualitas terbaik. Setiap hidangan dibuat dengan bahan pilihan
                dan disajikan dengan penuh perhatian untuk memberikan pengalaman
                terbaik bagi pelanggan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-slate-50 py-24 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kenapa Memilih Kami?
            </h2>
            <p className="mt-4 text-slate-500">
              Alasan utama mengapa pelanggan setia kami selalu kembali untuk menikmati menu terbaik kami.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                🌱
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Bahan Berkualitas</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Menggunakan bahan-bahan lokal yang segar dan berkualitas tinggi untuk menjaga cita rasa otentik di setiap suapan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pelayanan Cepat</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Sistem dapur yang terorganisir memastikan pesanan Anda diproses dengan kilat tanpa mengurangi kualitas hidangan.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                💰
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Harga Terjangkau</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Nikmati hidangan kelas restoran bintang lima dengan penawaran harga yang tetap bersahabat dan ramah di kantong.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-rose-600 to-rose-700 py-20 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-2xl" />

        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Siap Memesan Makanan Favoritmu?
          </h2>

          <p className="mt-4 text-rose-100 max-w-md mx-auto text-sm sm:text-base opacity-90">
            Silakan klik tombol Login di bagian atas halaman untuk masuk ke akun Anda dan mulai memesan menu spesial kami.
          </p>
        </div>
      </section>
    </div>
  );
}