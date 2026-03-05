'use client';

import { useEffect, useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface SiteData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutTitle?: string;
  aboutText?: string;
  footerAbout?: string;
  contactEmail?: string;
  contactPhone?: string;
  instagram?: string;
  linkedin?: string;
}

export default function SiteContentPage() {
  const [data, setData] = useState<SiteData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/site-content');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setMessage('İçerik yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key: keyof SiteData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('İçerik başarıyla kaydedildi');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Kaydetme sırasında hata oluştu');
      }
    } catch (err) {
      console.error(err);
      setMessage('Kaydetme sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 p-8 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-serif text-slate-900 mb-1">Site İçeriği</h1>
        <p className="text-slate-500 text-sm">Sitede kullanılan metin ve görselleri düzenleyin</p>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${message.includes('başarı') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Başlık</label>
          <input
            type="text"
            value={data.heroTitle || ''}
            onChange={(e) => handleChange('heroTitle', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Alt Başlık</label>
          <textarea
            value={data.heroSubtitle || ''}
            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Görsel URL</label>
          <input
            type="url"
            value={data.heroImage || ''}
            onChange={(e) => handleChange('heroImage', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hakkımızda Başlık</label>
          <input
            type="text"
            value={data.aboutTitle || ''}
            onChange={(e) => handleChange('aboutTitle', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hakkımızda Metin</label>
          <textarea
            value={data.aboutText || ''}
            onChange={(e) => handleChange('aboutText', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Footer Hakkında</label>
          <textarea
            value={data.footerAbout || ''}
            onChange={(e) => handleChange('footerAbout', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={data.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={data.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
            <input
              type="url"
              value={data.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-medium"
        >
          <Save size={18} />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
}
