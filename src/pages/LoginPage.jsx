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
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Fragment } from "react";
import MetaData from "@/components/metadata";
import { toast } from "sonner";

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
      toast.success(data.message, {
        position: "top-center",
        richColors: true,
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.statusText, {
        description: error.response.data.message,
        position: "top-center",
        richColors: true,
      });
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <Fragment>
      <MetaData
        title="Login"
        description="Halaman login untuk Lost & Found KEMA UKRI"
        image=""
        url=""
      />

      <div className="flex h-screen items-center justify-center bg-gray-100 p-4 font-sora">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Lost & Found{" "}
              <span className="bg-linear-to-r from-red-800 via-red-400  to-red-300/80 bg-clip-text text-transparent">
                KEMA UKRI
              </span>
            </CardTitle>
            <CardDescription className="text-center">
              Selamat datang di aplikasi Lost & Found KEMA UKRI Silakan masuk
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
                  placeholder="nama-elu@lostandfound.com"
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
                  placeholder="********"
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
                className="w-full cursor-pointer bg-linear-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
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
    </Fragment>
  );
};

export default LoginPage;
