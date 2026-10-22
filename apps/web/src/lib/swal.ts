import Swal, { SweetAlertOptions } from "sweetalert2";

// Helper to determine active theme colors
function getThemeConfig() {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    isDark,
    background: isDark ? "#111622" : "#ffffff",
    color: isDark ? "#f1f5f9" : "#0f172a",
    confirmButtonColor: "#ea580c", // Brand Orange-600
    cancelButtonColor: isDark ? "#334155" : "#94a3b8",
  };
}

/**
 * Toast notification with modern orange progress bar and responsive styling
 */
export function showToast(
  icon: "success" | "error" | "info" | "warning",
  title: string
) {
  const { background, color } = getThemeConfig();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background,
    color,
    customClass: {
      popup: "rounded-2xl border border-orange-500/30 shadow-2xl font-sans text-xs sm:text-sm",
      timerProgressBar: "bg-orange-500",
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
}

/**
 * Responsive confirmation dialog with custom orange theme
 */
export async function showConfirmDialog(
  title: string,
  text: string,
  confirmButtonText = "Ya, Lanjutkan",
  cancelButtonText = "Batal",
  isDestructive = false
): Promise<boolean> {
  const { background, color, cancelButtonColor } = getThemeConfig();

  const result = await Swal.fire({
    title,
    text,
    icon: isDestructive ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: isDestructive ? "#e11d48" : "#ea580c", // Rose for destructive or Orange
    cancelButtonColor,
    background,
    color,
    reverseButtons: true,
    focusCancel: true,
    width: "min(92vw, 420px)",
    customClass: {
      popup: "rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6",
      title: "text-lg sm:text-xl font-bold font-sans",
      htmlContainer: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans",
      confirmButton: "rounded-xl font-semibold px-5 py-2.5 text-sm shadow-md transition-transform active:scale-95",
      cancelButton: "rounded-xl font-semibold px-5 py-2.5 text-sm transition-transform active:scale-95",
    },
  });

  return result.isConfirmed;
}

/**
 * Responsive alert modal for errors or notices
 */
export function showAlert(
  title: string,
  text?: string,
  icon: "success" | "error" | "info" | "warning" = "info"
) {
  const { background, color, confirmButtonColor } = getThemeConfig();

  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor,
    confirmButtonText: "Mengerti",
    background,
    color,
    width: "min(92vw, 420px)",
    customClass: {
      popup: "rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6",
      title: "text-lg sm:text-xl font-bold font-sans",
      htmlContainer: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans",
      confirmButton: "rounded-xl font-semibold px-5 py-2.5 text-sm shadow-md transition-transform active:scale-95",
    },
  });
}
