'use client';

import { useEffect, useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface SettingsData {
  contactEmail?: string;
  contactPhone?: string;
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/site-content');
        const json = await res.json();
        setData({
          contactEmail: json.contactEmail,
          contactPhone: json.contactPhone,
        });
      } catch (err) {
        console.error(err);
        setMessage('Ayarlar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key: keyof SettingsData, value: string) => {
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
        setMessage('Ayarlar kaydedildi');
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

  if (loading) return <div className="text-center py-12 text-slate-500">Yükleniyor...</div>;

  return (
    <div className="space-y-6 p-8 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-serif text-slate-900 mb-1">Ayarlar</h1>
        <p className="text-slate-500 text-sm">Temel iletişim bilgilerini düzenleyin</p>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${message.includes('kaydedildi') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={data.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={data.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
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
