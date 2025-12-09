import { useCallback } from "react";

export function useFormatDate() {
  const LOCALE = "id-ID";

  // 1. Jam dan tanggal kejadian
  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";

    return new Intl.DateTimeFormat(LOCALE, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }, []);

  // 2. Berapa jam/hari yang lalu
  const formatTimeAgo = useCallback(
    (dateString) => {
      if (!dateString) return "-";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays < 7) return `${diffDays} hari yang lalu`;

      return new Intl.DateTimeFormat(LOCALE, {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour12: false,
      }).format(date);
    },
    [LOCALE]
  );

  // 3. Tanggal saja
  const formatDate = useCallback(
    (dateString) => {
      if (!dateString) return "-";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";

      return new Intl.DateTimeFormat(LOCALE, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    },
    [LOCALE]
  );

  return { formatDateTime, formatTimeAgo, formatDate };
}
