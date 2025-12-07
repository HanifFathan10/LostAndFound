import { getImageUrl } from "@/hooks/getImageUrl";
import { useFormatDate } from "@/hooks/useFormatDate";
import api from "@/lib/axios";
import {
  X,
  MapPin,
  Calendar,
  Shield,
  User,
  FileText,
  Phone,
  ImageOff,
  Check,
} from "lucide-react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const DetailBarangModal = ({ selectedItem, onClose }) => {
  const { formatTimeAgo, formatDate } = useFormatDate();
  const queryClient = useQueryClient();
  const decode = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedItem]);

  if (!selectedItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        id_barang: selectedItem.id_barang,
        status: "sudah selesai",
        tipe_laporan: "selesai",
      };

      const response = await api.post(`/barang/ditemukan`, data);

      await queryClient.invalidateQueries({ queryKey: ["barang-list"] });

      toast.success(response.statusText, {
        description: response.data.message,
        richColors: true,
        position: "top-center",
      });

      onClose();
    } catch (error) {
      if (error.status == 403) {
        toast.warning("Akses ditolak!", {
          description: "Kamu tidak berhak mengkonfirmasi barang ini!",
          position: "top-center",
          richColors: true,
        });
      } else {
        toast.error(error.message, {
          description: error.response.data.message,
          position: "top-center",
          richColors: true,
        });
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] md:h-[85vh] shadow-2xl flex flex-col md:flex-row relative z-10 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 z-50 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-full md:w-1/2 h-56 md:h-full bg-gray-100 shrink-0 relative">
          {selectedItem.foto && selectedItem.foto.length > 0 ? (
            <img
              src={getImageUrl(selectedItem.foto)}
              alt={selectedItem.judul_laporan}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-200">
              <ImageOff className="w-16 h-16 mb-2" />
              <span className="text-sm">Tidak ada gambar</span>
            </div>
          )}

          {/* Badge Status */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                selectedItem.tipe_laporan === "hilang"
                  ? "bg-red-500/90 text-white"
                  : "bg-emerald-500/90 text-white"
              }`}
            >
              {selectedItem.tipe_laporan === "hilang" ? "DICARI" : "DITEMUKAN"}
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col flex-1 md:h-full overflow-hidden bg-white">
          <div className="grow overflow-y-auto p-5 md:p-8 custom-scrollbar">
            <div className="mb-6 mt-2">
              <div className="flex items-center text-purple-600 text-sm font-semibold mb-2 gap-2">
                <span
                  className={`px-2 py-0.5 uppercase font-semibold rounded-md ${
                    selectedItem.status === "sudah selesai"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedItem.status || "Barang Umum"}
                </span>
                <span className="text-gray-400 font-normal text-xs md:text-sm">
                  {formatTimeAgo(selectedItem.created_at)}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight uppercase">
                {selectedItem.judul_laporan}
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              <InfoItem
                icon={<MapPin className="w-5 h-5" />}
                color="purple"
                label="Lokasi"
                value={selectedItem.lokasi}
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5 " />}
                color="purple"
                label="Tanggal Kejadian"
                value={formatDate(selectedItem.tanggal)}
              />
              <InfoItem
                icon={<User className="w-5 h-5" />}
                color="purple"
                label="Dilaporkan Oleh"
                value={selectedItem.nama_lengkap || "Anonim"}
                subValue={selectedItem.npm}
              />

              {selectedItem.nama_satpam && (
                <InfoItem
                  icon={<Shield className="w-5 h-5" />}
                  color="purple"
                  label="Diamankan Oleh Satpam"
                  value={selectedItem.nama_satpam}
                />
              )}
            </div>

            {/* Deskripsi */}
            <div className="pb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center text-sm md:text-base">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                Deskripsi Lengkap
              </h3>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                {selectedItem.deskripsi || "Tidak ada deskripsi tambahan."}
              </div>
            </div>
          </div>

          <div className="p-4 flex gap-3 md:p-6 border-t border-gray-100 bg-white shrink-0 z-20">
            <Link
              to={`https://api.whatsapp.com/send?phone=${selectedItem.no_hp}&text=Halo...`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-linear-to-r from-gray-600 to-stone-600 text-white px-2 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center text-xs"
            >
              <Phone className="w-5 h-5 mr-2" />
              Hubungi Pelapor via WhatsApp
            </Link>
            {selectedItem.tipe_laporan === "hilang" && (
              <Link
                onClick={handleSubmit}
                className="w-full bg-linear-to-r from-gray-600 to-stone-600 text-white px-2 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center text-xs"
              >
                <Check className="w-5 h-5 mr-2" />
                Konfirmasi sudah ditemukan
              </Link>
            )}
            {selectedItem.tipe_laporan === "ditemukan" &&
            decode.role === "Satpam" ? (
              <Link
                to={`${selectedItem.id_barang}/confirmation`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-linear-to-r  from-gray-600 to-stone-600 text-white px-2 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center text-xs"
              >
                <Check className="w-5 h-5 mr-2" />
                Konfirmasi ambil barang
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoItem = ({ icon, color, label, value, subValue }) => (
  <div className="flex items-start p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
    <div
      className={`p-2 bg-${color}-50 rounded-lg mr-3 text-${color}-600 shrink-0`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-gray-900 font-semibold text-sm line-clamp-1">
        {value}
      </p>
      {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
    </div>
  </div>
);

export default DetailBarangModal;
