export const getImageUrl = (imageRaw) => {
  // 1. Jika kosong/null
  if (!imageRaw) return "https://via.placeholder.com/400x300?text=No+Image";

  // 2. Jika sudah berupa Array (Backend mengirim JSON object)
  if (Array.isArray(imageRaw)) {
    return imageRaw[0] || "https://via.placeholder.com/400x300?text=No+Image";
  }

  // 3. Jika berupa String (Backend mengirim stringified JSON)
  // Contoh: '["https://res.cloudinary.com/..."]'
  if (typeof imageRaw === "string") {
    try {
      // Coba parse string menjadi array
      // Ini akan mengubah '["url"]' menjadi ['url']
      const parsed = JSON.parse(imageRaw);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // 4. Fallback: Jika gagal parse (mungkin URL biasa tanpa kurung siku)
      // Kita bersihkan tanda kutip atau kurung siku manual jika masih nyangkut
      if (imageRaw.startsWith("http")) {
        return imageRaw;
      }
      // Opsi terakhir: Bersihkan karakter kotor manual (Regex)
      const cleanUrl = imageRaw.replace(/[[\]"]/g, "");
      if (cleanUrl.startsWith("http")) return cleanUrl;
    }
  }

  return "https://via.placeholder.com/400x300?text=No+Image";
};
