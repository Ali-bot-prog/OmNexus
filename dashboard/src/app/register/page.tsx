"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5555/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role: "user", // Default
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Kayıt olurken bir hata oluştu.");
      }

      // Kayıt başarılı, login'e yönlendir
      router.push("/login?message=Kayıt başarılı! Lütfen giriş yapın.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg relative">
        <div className="flex justify-center mb-6 py-2">
          <img src="/logo.png" alt="OMNEXUS Logo" className="h-28 w-auto object-contain mix-blend-screen" />
        </div>
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Benzersiz bir kullanıcı adı"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="En az 6 karakter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre Tekrar</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded transition disabled:opacity-50 mt-4"
          >
            {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Zaten bir hesabınız var mı?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Giriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
}
