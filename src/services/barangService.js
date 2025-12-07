import api from "@/lib/axios"; // Import dari setup axios di atas

export const getBarang = async () => {
  const response = await api.get("/barang");
  return response.data;
};
