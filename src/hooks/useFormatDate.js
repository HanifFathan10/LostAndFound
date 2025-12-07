import { useCallback } from "react";

export function useFormatDate() {
  const LOCALE = "id-ID";

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Tanggal tidak valid";

    return new Intl.DateTimeFormat(LOCALE, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }, []);

  const formatTimeAgo = useCallback((dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) return "-";

    const diffInSeconds = Math.floor((now - date) / 1000);

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

    return new Intl.DateTimeFormat(LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }, []);

  return { formatDate, formatTimeAgo };
}
