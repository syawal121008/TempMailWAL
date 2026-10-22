import React from "react";
import { Zap, HelpCircle } from "lucide-react";

export const InfoSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 py-6 text-slate-700 dark:text-slate-300">
      {/* Cara Pakai Singkat */}
      <section id="how-it-works" className="flex flex-col gap-4 scroll-mt-24">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Cara Pakai
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center text-xs shadow">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Salin Alamat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Klik tombol salin di atas untuk mengambil alamat email sementara Anda.
            </p>
          </div>

          <div className="rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center text-xs shadow">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Terima Pesan / OTP
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gunakan untuk daftar akun. Kode OTP bakal otomatis terbaca dan siap disalin.
            </p>
          </div>

          <div className="rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center text-xs shadow">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Selesai Otomatis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inbox dan pesan bakal otomatis terhapus saat waktu timer habis.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Singkat & Padat */}
      <section id="faq" className="flex flex-col gap-3 scroll-mt-24">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            FAQ
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          <details className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-3.5 group cursor-pointer">
            <summary className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-open:text-orange-600 dark:group-open:text-orange-400 transition-colors list-none flex items-center justify-between">
              <span>Berapa lama email ini aktif?</span>
              <span className="text-orange-500 font-bold group-open:rotate-180 transition-transform">
                ↓
              </span>
            </summary>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Standarnya 10 menit. Kamu juga bisa pilih 30 atau 60 menit lewat menu pilihan waktu.
            </p>
          </details>

          <details className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-3.5 group cursor-pointer">
            <summary className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-open:text-orange-600 dark:group-open:text-orange-400 transition-colors list-none flex items-center justify-between">
              <span>Bisa buat kirim email keluar?</span>
              <span className="text-orange-500 font-bold group-open:rotate-180 transition-transform">
                ↓
              </span>
            </summary>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Nggak bisa, layanan ini khusus buat menerima email masuk aja biar praktis dan bebas spam.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
