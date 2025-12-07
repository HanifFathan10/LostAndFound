import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";

const ConfirmationPage = () => {
  const { id_barang } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviews]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(
        `/barang/${id_barang}/konfirmasi`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      alert("Konfirmasi pengambilan barang berhasil!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Upload Error:", error);
      alert(error.response?.data?.message || "Gagal melakukan konfirmasi.");
    },
  });

  const onSubmit = (data) => {
    if (selectedFiles.length === 0) {
      alert("Harap sertakan minimal 1 foto bukti pengambilan.");
      return;
    }

    const formData = new FormData();

    formData.append("id_barang", id_barang);
    formData.append("nama_pengambil", data.nama_pengambil);
    formData.append("npm_pengambil", data.npm_pengambil);
    formData.append("prodi_pengambil", data.prodi_pengambil);
    formData.append("no_hp_pengambil", data.no_hp_pengambil);
    formData.append("catatan", data.catatan || "");

    selectedFiles.forEach((file) => {
      formData.append("foto", file);
    });

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 rounded-t-xl border-b mb-4">
          <CardTitle className="text-2xl text-center text-gray-800">
            Konfirmasi Pengambilan Barang
          </CardTitle>
          <CardDescription className="text-center">
            Isi data diri pengambil dan lampirkan foto bukti serah terima.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Foto Section */}
            <div className="space-y-3">
              <Label className="font-semibold text-gray-700">
                Foto Bukti Serah Terima <span className="text-red-500">*</span>
              </Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center text-gray-500 pointer-events-none">
                  <ImagePlus className="w-10 h-10 mb-2 text-purple-500" />
                  <p className="text-sm font-medium">Klik untuk upload foto</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Bisa lebih dari 1 foto (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Preview Grid */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border bg-white shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nama">Nama Lengkap Pengambil</Label>
                <Input
                  id="nama"
                  placeholder="Contoh: Budi Santoso"
                  {...register("nama_pengambil", {
                    required: "Nama wajib diisi",
                  })}
                />
                {errors.nama_pengambil && (
                  <ErrorMessage msg={errors.nama_pengambil.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="npm">NPM / NIM</Label>
                <Input
                  id="npm"
                  placeholder="Contoh: 202413001"
                  {...register("npm_pengambil", {
                    required: "NPM wajib diisi",
                  })}
                />
                {errors.npm_pengambil && (
                  <ErrorMessage msg={errors.npm_pengambil.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prodi">Program Studi</Label>
                <Input
                  id="prodi"
                  placeholder="Contoh: Teknik Informatika"
                  {...register("prodi_pengambil", {
                    required: "Prodi wajib diisi",
                  })}
                />
                {errors.prodi_pengambil && (
                  <ErrorMessage msg={errors.prodi_pengambil.message} />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hp">No. WhatsApp / HP</Label>
                <Input
                  id="hp"
                  type="tel"
                  placeholder="0812xxxx"
                  {...register("no_hp_pengambil", {
                    required: "No HP wajib diisi",
                    pattern: { value: /^[0-9]+$/, message: "Hanya angka" },
                  })}
                />
                {errors.no_hp_pengambil && (
                  <ErrorMessage msg={errors.no_hp_pengambil.message} />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea
                  id="catatan"
                  placeholder="Masukkan catatan jika ada"
                  {...register("catatan")}
                  className="w-full resize-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity text-white"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim Data...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Konfirmasi Barang Telah Diambil
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center bg-gray-50 rounded-b-xl py-4">
          <p className="text-xs text-muted-foreground text-center">
            Pastikan barang diserahkan kepada pemilik yang sah.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

const ErrorMessage = ({ msg }) => (
  <p className="text-red-500 text-xs mt-1">{msg}</p>
);

export default ConfirmationPage;
