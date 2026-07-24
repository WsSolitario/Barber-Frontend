"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState<string>();

  async function submit(formData: FormData) {
    setError(undefined);
    try {
      const result = await login(String(formData.get("email")), String(formData.get("password")));
      setAccessToken(result.accessToken);
      router.push("/admin");
    } catch {
      setError("No se pudo iniciar sesion.");
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-stone-950 p-6"><form action={submit} className="w-full max-w-md space-y-4 rounded-3xl bg-stone-900 p-8 text-stone-100"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Demo Barber</p><h1 className="text-3xl font-bold">Acceso administrativo</h1><input className="w-full rounded-xl bg-stone-800 p-3" name="email" type="email" placeholder="Correo" required /><input className="w-full rounded-xl bg-stone-800 p-3" name="password" type="password" placeholder="Contrasena" required /><button className="w-full rounded-xl bg-amber-400 p-3 font-semibold text-stone-950">Entrar</button>{error && <p className="text-sm text-red-300">{error}</p>}</form></main>;
}
