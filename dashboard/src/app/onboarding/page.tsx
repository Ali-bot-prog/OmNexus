"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [il, setIl] = useState("İstanbul");
  const [ilce, setIlce] = useState("");
  const [ofisAdi, setOfisAdi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Check if already onboarded
      try {
        const res = await fetch("http://localhost:5555/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          if (user.tenant && user.tenant.onboarded === 1) {
            router.push("/"); // Already onboarded
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!il || !ilce || !ofisAdi) {
      setError("Lütfen tüm alanları doldurun.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5555/auth/onboard", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          il,
          ilce,
          ofis_adi: ofisAdi
        }),
      });

      if (!res.ok) {
        throw new Error("Profil güncellenemedi.");
      }

      // Başarılı, panele yönlendir
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-xl relative border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            OmNexus'a Hoş Geldiniz!
          </h1>
          <p className="text-gray-400 mt-2">
            Panelinizi hazırlamadan önce birkaç ufak ayar yapmamız gerekiyor.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleOnboard} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Ofis / Şirket Adınız</label>
            <input
              type="text"
              className="w-full p-2.5 rounded bg-gray-900 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
              value={ofisAdi}
              onChange={(e) => setOfisAdi(e.target.value)}
              placeholder="Örn: Remax Yıldız, Coldwell Banker Focus..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">İl</label>
              <select
                className="w-full p-2.5 rounded bg-gray-900 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                value={il}
                onChange={(e) => setIl(e.target.value)}
                required
              >
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Ordu">Ordu</option>
                <option value="Bursa">Bursa</option>
                <option value="Antalya">Antalya</option>
                <option value="Samsun">Samsun</option>
                {/* Çok daha fazla eklenebilir ama MVP için yeterli */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Uzmanlık İlçesi</label>
              <input
                type="text"
                className="w-full p-2.5 rounded bg-gray-900 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                value={ilce}
                onChange={(e) => setIlce(e.target.value)}
                placeholder="Örn: Kadıköy, Ünye..."
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Ayarlar Kaydediliyor..." : "Paneli Hazırla ve Başla 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
