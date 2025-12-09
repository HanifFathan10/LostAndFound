import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Upload,
  MapPin,
  Calendar,
  FileText,
  Loader2,
  User,
} from "lucide-react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ReportModal({ isOpen, onClose, dataSatpam }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    judul_laporan: "",
    lokasi: "",
    tanggal: "",
    deskripsi: "",
    foto: null,
    fotoPreview: null,
    tipe_laporan: "",
    id_satpam: "",
  });
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("hilang");
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Ukuran file maksimal 5MB!");
        return;
      }

      setFormData({
        ...formData,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tipe_laporan", reportType);
      formDataToSend.append("judul_laporan", formData.judul_laporan);
      formDataToSend.append("lokasi", formData.lokasi);
      formDataToSend.append("tanggal", formData.tanggal);
      formDataToSend.append("deskripsi", formData.deskripsi);

      if (formData.foto) {
        formDataToSend.append("foto", formData.foto);
      }

      if (formData.id_satpam) {
        formDataToSend.append("id_satpam", formData.id_satpam);
      }

      const response = await api.post("/barang", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["barang-list"] });

      toast.success(response.statusText, {
        description: response.data.message,
        position: "top-center",
        richColors: true,
      });
      onClose();

      setFormData({
        judul_laporan: "",
        lokasi: "",
        tanggal: "",
        deskripsi: "",
        foto: null,
        fotoPreview: null,
        tipe_laporan: "",
        id_satpam: "",
      });
      setReportType("hilang");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast(error.response.status, {
          description: error.response.message,
          position: "top-center",
          richColors: true,
        });
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast(error.response.status, {
        description: error.response.message,
        position: "top-center",
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!isSubmitting) {
      onClose();
      setFormData({
        judul_laporan: "",
        lokasi: "",
        tanggal: "",
        deskripsi: "",
        foto: null,
        fotoPreview: null,
        id_satpam: "",
      });
      setReportType("hilang");
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl my-8 animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 bg-linear-to-r from-stone-600 to-teal-600 px-6 sm:px-8 py-5 sm:py-6 rounded-t-3xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Laporkan Barang
              </h2>
              <p className="text-stone-100 text-xs sm:text-sm">
                Bantu temukan pemiliknya atau temukan barangmu
              </p>
            </div>
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="w-10 h-10 cursor-pointer bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* Report Type Toggle */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Jenis Laporan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setReportType("hilang")}
                disabled={isSubmitting}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  reportType === "hilang"
                    ? "border-red-500 bg-red-50 shadow-md scale-105"
                    : "border-gray-200 hover:border-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-2xl sm:text-3xl mb-2">🔍</div>
                <div className="font-bold text-sm sm:text-base text-gray-900">
                  Barang Hilang
                </div>
                <div className="text-[10px] sm:text-xs text-gray-600 mt-1">
                  Saya kehilangan barang
                </div>
              </button>
              <button
                type="button"
                onClick={() => setReportType("ditemukan")}
                disabled={isSubmitting}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  reportType === "ditemukan"
                    ? "border-green-500 bg-green-50 shadow-md scale-105"
                    : "border-gray-200 hover:border-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-2xl sm:text-3xl mb-2">✨</div>
                <div className="font-bold text-sm sm:text-base text-gray-900">
                  Barang Ditemukan
                </div>
                <div className="text-[10px] sm:text-xs text-gray-600 mt-1">
                  Saya menemukan barang
                </div>
              </button>
            </div>
          </div>
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Foto Barang <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                required
                disabled={isSubmitting}
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-stone-500 transition-colors bg-stone-50/50 overflow-hidden ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {formData.fotoPreview ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={formData.fotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">
                        Klik untuk ganti foto
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-stone-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700 px-4 text-center">
                      Klik untuk upload foto
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG maksimal 5MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nama/Deskripsi Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.judul_laporan}
              onChange={(e) =>
                setFormData({ ...formData, judul_laporan: e.target.value })
              }
              placeholder="Contoh: iPhone 13 Pro Max Biru"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-stone-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) =>
                  setFormData({ ...formData, lokasi: e.target.value })
                }
                placeholder={
                  reportType === "hilang"
                    ? "Terakhir terlihat di..."
                    : "Ditemukan di..."
                }
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-stone-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          {/* Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tanggal {reportType === "hilang" ? "Hilang" : "Ditemukan"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="datetime-local"
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-stone-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Detail Tambahan
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <textarea
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                placeholder="Tolong ceritakan lebih detail tentang barang ini, bisa tentang kejadian, tempat terakhir, jam terakhir, dll..."
                rows={4}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-stone-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
          {/* Dititip Satpam */}
          {reportType === "ditemukan" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dititip Ke Satpam
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-500 w-5 h-5" />
                <select
                  name="id_satpam"
                  id="id_satpam"
                  key="id_satpam"
                  onChange={(e) =>
                    setFormData({ ...formData, id_satpam: e.target.value })
                  }
                  value={formData.id_satpam || ""}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-stone-500 focus:outline-none transition-colors appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-stone-300"
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Pilih satpam yang akan dititipkan
                  </option>
                  {dataSatpam.map((satpam) => (
                    <option key={satpam.id_satpam} value={satpam.id_satpam}>
                      {satpam.nama_satpam}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-linear-to-r from-stone-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Melaporkan...</span>
              </>
            ) : (
              "Laporkan Barang"
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
