"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://localhost:5555/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Giriş başarısız. Kullanıcı adı veya şifre yanlış.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      
      // Basit bir redirect
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6 py-2">
          <img src="/logo.png" alt="OMNEXUS Logo" className="h-28 w-auto object-contain mix-blend-screen" />
        </div>
        
        {message && (
          <div className="bg-emerald-500/20 text-emerald-200 p-3 rounded mb-4 text-sm border border-emerald-500/50">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Henüz hesabınız yok mu?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  );
}
