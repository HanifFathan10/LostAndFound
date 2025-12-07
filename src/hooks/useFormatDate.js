import { useCallback } from "react";

export function useFormatDate() {
  // Opsi bahasa Indonesia
  const LOCALE = "id-ID";

  // 1. Fungsi Format Tanggal Lengkap & Jam
  // Output: "4 Desember 2025, 17.00"
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    // Cek apakah tanggal valid
    if (isNaN(date.getTime())) return "Tanggal tidak valid";

    return new Intl.DateTimeFormat(LOCALE, {
      day: "numeric",
      month: "long", // "long" = Desember, "short" = Des
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      // hour12: false, // Gunakan format 24 jam (17.00)
    }).format(date);
  }, []);

  // 2. Fungsi Format Relatif (Time Ago)
  // Output: "2 jam yang lalu", "Baru saja", "Kemarin"
  const formatTimeAgo = useCallback((dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) return "-";

    const diffInSeconds = Math.floor((now - date) / 1000);

    // Logika waktu relatif
    if (diffInSeconds < 60) {
      return "Baru saja";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    }

    // Jika lebih dari 7 hari, tampilkan tanggal biasa
    return new Intl.DateTimeFormat(LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }, []);

  return { formatDate, formatTimeAgo };
}
