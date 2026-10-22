import React from "react";
import { Zap, ShieldCheck, HelpCircle, Lock, EyeOff, Globe } from "lucide-react";

export const InfoSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-14 py-8 text-slate-700 dark:text-slate-300">
      {/* 1. Cara Kerja */}
      <section id="how-it-works" className="flex flex-col gap-5 scroll-mt-24">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Bagaimana Cara Kerjanya?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex flex-col gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-orange-500/25">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Dapatkan Email Seketika
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Alamat acak dibuat di domain <code>syawaltzy.my.id</code> secara kriptografis dengan masa aktif 10 hingga 60 menit.
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex flex-col gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-orange-500/25">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Terima Email & Auto OTP
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Kirimkan email verifikasi atau OTP dari Gmail atau platform lain. Tampilan kotak masuk mirip Gmail dengan tombol salin OTP instan.
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex flex-col gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-orange-500/25">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Hancur Otomatis Tanpa Jejak
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Setelah waktu habis atau saat Anda menekan tombol hapus, pesan dimusnahkan secara permanen dari server Cloudflare edge database.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Privasi & Keamanan */}
      <section
        id="privacy"
        className="rounded-2xl p-6 sm:p-8 border border-orange-500/20 bg-orange-50/50 dark:bg-[#151c2a] flex flex-col gap-5 scroll-mt-24 shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Standar Privasi & Keamanan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold">
                Token Akses Kriptografis (Zero Trust)
              </strong>
              <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Setiap inbox dilindungi token rahasia 32-byte yang disimpan dalam bentuk hash SHA-256. Orang lain tidak bisa mengintip email Anda hanya dengan menebak alamat.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-semibold">
                Sanitasi HTML & Anti-XSS
              </strong>
              <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Script jahat, iframe tersembunyi, dan pelacak eksternal dinetralkan sebelum email ditampilkan ke browser Anda.
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300 text-xs flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400" />
          <span>
            <strong>Catatan:</strong> Layanan disposable email ini ditujukan untuk registrasi cepat dan melindungi privasi. Jangan gunakan untuk akun perbankan atau pemulihan sandi permanen.
          </span>
        </div>
      </section>

      {/* 3. FAQ */}
      <section id="faq" className="flex flex-col gap-4 scroll-mt-24">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pertanyaan Umum (FAQ)
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <details className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 group cursor-pointer shadow-sm">
            <summary className="font-semibold text-sm text-slate-900 dark:text-white group-open:text-orange-600 dark:group-open:text-orange-400 transition-colors list-none flex items-center justify-between">
              <span>Berapa lama email akan bertahan?</span>
              <span className="text-orange-500 font-bold group-open:rotate-180 transition-transform">
                ↓
              </span>
            </summary>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              Secara default inbox bertahan selama 10 menit. Anda juga dapat memilih opsi durasi 30 menit atau 60 menit saat membuat alamat baru.
            </p>
          </details>

          <details className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 group cursor-pointer shadow-sm">
            <summary className="font-semibold text-sm text-slate-900 dark:text-white group-open:text-orange-600 dark:group-open:text-orange-400 transition-colors list-none flex items-center justify-between">
              <span>Apakah domain syawaltzy.biz.id terpengaruh?</span>
              <span className="text-orange-500 font-bold group-open:rotate-180 transition-transform">
                ↓
              </span>
            </summary>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              Sama sekali tidak. Domain <code>syawaltzy.biz.id</code> adalah domain portofolio / website utama pribadi, sedangkan layanan email sementara terisolasi secara aman di domain <code>syawaltzy.my.id</code>.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
