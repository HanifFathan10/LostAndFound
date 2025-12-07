import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      alert("Register Berhasil!");
      navigate("/login");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Register Gagal");
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      {/* Menggunakan Card Shadcn */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Selamat Datang</CardTitle>
          <CardDescription className="text-center">
            Isi data diri untuk mendaftar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Input NPM */}
            <div className="space-y-2">
              <Label htmlFor="npm">NPM</Label>
              <Input
                id="npm"
                type="text"
                placeholder="20210xxxxxx"
                {...register("npm", {
                  required: "NPM wajib diisi",
                  pattern: {
                    value: /^\d+$/,
                    message: "Format NPM salah",
                  },
                })}
              />
              {errors.npm && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.npm.message}
                </p>
              )}
            </div>

            {/* Input Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input
                id="nama_lengkap"
                type="text"
                placeholder="Nama Lengkap"
                {...register("nama_lengkap", {
                  required: "Nama Lengkap wajib diisi",
                })}
              />
              {errors.nama_lengkap && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.nama_lengkap.message}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                // Menggunakan props register biasa karena tanpa Zod wrapper
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Format email salah",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: {
                    value: 6,
                    message: "Minimal 6 karakter",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Input Program Studi */}
            <div className="space-y-2">
              <Label htmlFor="program_studi">Program Studi</Label>
              <Input
                id="program_studi"
                type="text"
                placeholder="Program Studi"
                {...register("program_studi", {
                  required: "Program Studi wajib diisi",
                })}
              />
              {errors.program_studi && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.program_studi.message}
                </p>
              )}
            </div>

            {/* Input No Whatsapp */}
            <div className="space-y-2">
              <Label htmlFor="no_hp">No Whatsapp</Label>
              <Input
                id="no_hp"
                type="text"
                placeholder="08123456789"
                {...register("no_hp", {
                  required: "No Whatsapp wajib diisi",
                  pattern: {
                    value: /^\d+$/,
                    message: "Format No Whatsapp salah",
                  },
                })}
              />
              {errors.no_hp && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.no_hp.message}
                </p>
              )}
            </div>

            {/* Tombol Daftar */}
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Memuat..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
