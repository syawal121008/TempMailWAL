import React from "react";
import { ShieldCheck, Zap, Lock, RefreshCw, HelpCircle, EyeOff } from "lucide-react";

export const InfoSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 py-12 text-slate-300">
      {/* 1. Cara Kerja */}
      <section id="how-it-works" className="flex flex-col gap-6 scroll-mt-24">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Bagaimana Cara Kerjanya?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-semibold text-white text-base">Dapatkan Alamat Seketika</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Klik tombol buat email. Anda akan langsung mendapatkan alamat acak unik di domain <code>syawaltzy.my.id</code> dengan masa aktif 10 menit.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-semibold text-white text-base">Terima OTP & Verifikasi</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gunakan alamat tersebut untuk mendaftar akun atau mencoba layanan baru. Kode OTP akan terdeteksi otomatis dan dapat disalin dengan satu klik.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-semibold text-white text-base">Musnah Otomatis Tanpa Jejak</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Setelah waktu habis atau saat Anda menekan tombol hapus, seluruh data email akan dihapus secara permanen dari server Cloudflare edge database.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Privasi & Keamanan */}
      <section id="privacy" className="glass-panel-glow p-6 sm:p-8 rounded-2xl flex flex-col gap-5 scroll-mt-24">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Standar Keamanan & Privasi</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">Token Akses Kriptografis</strong>
              <span className="text-slate-400">
                Inbox dilindungi token rahasia 32-byte yang hanya di-hash di server. Mengetahui alamat email saja tidak bisa membaca pesan Anda.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block">Sanitasi Konten & Anti-XSS</strong>
              <span className="text-slate-400">
                Script jahat, tracker, dan link berbahaya dinetralkan sebelum email ditampilkan ke browser Anda.
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Catatan Penting:</strong> Layanan ini bersifat sementara. Jangan gunakan untuk akun perbankan, aset berharga, atau verifikasi pemulihan password permanen.
          </span>
        </div>
      </section>

      {/* 3. FAQ */}
      <section id="faq" className="flex flex-col gap-5 scroll-mt-24">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Pertanyaan Umum (FAQ)</h2>
        </div>

        <div className="flex flex-col gap-3">
          <details className="glass-panel p-4 rounded-xl group cursor-pointer">
            <summary className="font-semibold text-sm text-slate-100 group-open:text-indigo-300 transition-colors list-none flex items-center justify-between">
              <span>Berapa lama email akan bertahan?</span>
              <span className="text-indigo-400 font-bold group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Secara default inbox bertahan selama 10 menit. Anda juga dapat memilih opsi durasi 30 menit atau 60 menit saat membuat alamat baru.
            </p>
          </details>

          <details className="glass-panel p-4 rounded-xl group cursor-pointer">
            <summary className="font-semibold text-sm text-slate-100 group-open:text-indigo-300 transition-colors list-none flex items-center justify-between">
              <span>Apakah saya bisa mengirim email dari layanan ini?</span>
              <span className="text-indigo-400 font-bold group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Tidak. Layanan Syawal TempMail dirancang strictly inbound (hanya menerima email masuk) untuk menjaga reputasi IP domain dan mencegah penyalahgunaan spam.
            </p>
          </details>

          <details className="glass-panel p-4 rounded-xl group cursor-pointer">
            <summary className="font-semibold text-sm text-slate-100 group-open:text-indigo-300 transition-colors list-none flex items-center justify-between">
              <span>Apakah domain syawaltzy.biz.id terpengaruh?</span>
              <span className="text-indigo-400 font-bold group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Sama sekali tidak. Domain <code>syawaltzy.biz.id</code> adalah domain utama terpisah, sedangkan layanan temp mail diisolasi penuh di <code>syawaltzy.my.id</code>.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
