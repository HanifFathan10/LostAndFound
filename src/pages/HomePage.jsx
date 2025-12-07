import React, { Fragment, useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Package,
  ChevronRight,
  X,
  ImageOff,
  Loader,
  Plus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { getImageUrl } from "@/hooks/getImageUrl";
import { useFormatDate } from "@/hooks/useFormatDate";

import ReportModal from "@/components/modal/ReportModal";
import DetailBarangModal from "@/components/modal/DetailBarangModal";
import MetaData from "@/components/metadata";

export default function LostAndFoundHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { formatTimeAgo } = useFormatDate();

  const {
    data: itemList = [],
    isLoading: isLoadingBarang,
    isError: isErrorBarang,
    error: errorBarang,
  } = useQuery({
    queryKey: ["barang-list"],
    queryFn: async () => {
      const response = await api.get("/barang");
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: dataSatpam = [],
    isLoading: isLoadingSatpam,
    isError: isErrorSatpam,
    error: errorSatpam,
  } = useQuery({
    queryKey: ["satpam-list"],
    queryFn: async () => {
      const response = await api.get("/satpam");
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filteredItems = itemList.filter((item) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "lost" && item.tipe_laporan === "hilang") ||
      (activeTab === "found" && item.tipe_laporan === "ditemukan") ||
      (activeTab === "done" && item.tipe_laporan === "selesai");

    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      item.judul_laporan?.toLowerCase().includes(searchLower) ||
      item.lokasi?.toLowerCase().includes(searchLower);

    return matchTab && matchSearch;
  });

  const isLoading = isLoadingBarang || isLoadingSatpam;
  const isError = isErrorBarang || isErrorSatpam;
  const error = errorBarang || errorSatpam;

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-[250px] mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center p-8 text-center text-red-500">
        <div>
          <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
          <p>
            {error?.response?.data?.message || "Gagal memuat data dari server."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <MetaData
        title="Lost & Found Home"
        description="Platform terpercaya untuk menemukan barang hilang atau melaporkan barang temuan"
        url="https://lost-and-found-self.vercel.app"
        image="../assets/images/banner.png"
      />

      <div className="font-sora min-h-screen bg-linear-to-br from-indigo-50 via-stone-50 to-teal-50 pb-20">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-stone-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-stone-600 to-teal-600 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white -rotate-3" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-stone-600 to-teal-600 bg-clip-text text-transparent">
                  Lost & Found
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                  Temukan Barangmu Kembali
                </p>
              </div>
            </div>
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 sm:px-6 py-2 flex justify-center items-center cursor-pointer sm:py-2.5 bg-linear-to-r from-stone-600 to-teal-600 text-white text-sm sm:text-base rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Lapor Barang
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              Lost and Found{" "}
              <span className="bg-linear-to-r from-red-800 via-red-400  to-red-300/80 bg-clip-text text-transparent">
                KEMA UKRI
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Platform terpercaya untuk menemukan barang hilang atau melaporkan
              barang temuan area Universitas Kebangsaan Republik Indonesia
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8 relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-stone-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari 'Dompet' atau 'Gedung A'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 sm:py-5 rounded-2xl border-2 border-stone-100 focus:border-stone-500 focus:outline-none text-base sm:text-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Tabs Filter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-stone-100">
              {[
                { id: "all", label: "Semua" },
                { id: "lost", label: "🔍 Dicari" },
                { id: "found", label: "🎁 Ditemukan" },
                { id: "done", label: "✅ Selesai" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-stone-600 to-teal-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id_barang || item.id}
                onClick={() => setSelectedItem(item)}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer flex flex-col h-full ${
                  item.status === "sudah selesai" ? "opacity-60" : ""
                }`}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {item.foto && item.foto.length > 0 ? (
                    <img
                      src={getImageUrl(item.foto)}
                      alt={item.judul_laporan}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageOff className="w-12 h-12 mb-2" />
                      <span className="text-sm">Tidak ada gambar</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                        item.tipe_laporan === "hilang"
                          ? "bg-red-500/90 text-white"
                          : "bg-emerald-500/90 text-white"
                      }`}
                    >
                      {item.tipe_laporan === "hilang" ? "DICARI" : "DITEMUKAN"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col grow">
                  <div className="mb-4 grow">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-stone-600 transition-colors">
                      {item.judul_laporan}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-stone-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {item.lokasi || "Lokasi tidak tersedia"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                        <span>
                          {formatTimeAgo(item.tanggal) ||
                            "Waktu tidak tersedia"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Loader className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                        <span className={`cn`}>
                          {item.status || "Status tidak tersedia"}
                        </span>
                      </div>
                    </div>
                    {item.deskripsi && (
                      <p className="text-xs text-gray-400 mt-3 line-clamp-2">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>
                  <button className="w-full cursor-pointer py-3 bg-linear-to-r from-stone-50 to-teal-50 text-stone-600 rounded-xl font-medium hover:from-stone-600 hover:to-teal-600 hover:text-white transition-all duration-300 flex items-center justify-center group/btn shadow-sm hover:shadow-md">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce">
                🔍
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Tidak Ada Hasil
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Maaf, kami tidak menemukan barang yang cocok dengan filter yang
                dipilih.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="mt-6 px-6 py-2 text-stone-600 font-medium hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        <DetailBarangModal
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setReportModalOpen(false)}
          dataSatpam={dataSatpam}
        />
      </div>
    </Fragment>
  );
}
