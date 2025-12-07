import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      alert("Login Berhasil!");
      navigate("/");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Login Gagal");
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      {/* Menggunakan Card Shadcn */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Lost & Found KEMA UKRI
          </CardTitle>
          <CardDescription className="text-center">
            Selamat datang di aplikasi Lost & Found KEMA UKRI. Silakan masuk
            untuk melanjutkan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
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

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Memuat..." : "Masuk"}
            </Button>
          </form>
        </CardContent>

        <CardAction className="flex w-full justify-center pb-4 items-center">
          <Link to="/register" className="text-sm hover:underline">
            Belum punya akun? Daftar di sini
          </Link>
        </CardAction>
      </Card>
    </div>
  );
};

export default LoginPage;
