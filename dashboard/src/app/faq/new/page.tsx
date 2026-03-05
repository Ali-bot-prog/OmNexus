'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function FAQNewPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      });
      if (res.ok) {
        router.push('/faq');
      } else {
        console.error('Kaydetme hata', await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 mb-6">
        <ArrowLeft size={18} /> Geri
      </button>
      <h1 className="text-2xl font-serif text-slate-900 mb-4">Yeni SSS</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Soru</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Cevap</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
}
