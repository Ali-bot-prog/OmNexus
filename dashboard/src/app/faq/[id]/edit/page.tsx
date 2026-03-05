'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function FAQEditPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch('/api/faq');
        const list = await res.json();
        const item = list.find((f: any) => f.id.toString() === id);
        if (item) {
          setQuestion(item.question);
          setAnswer(item.answer);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/faq/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      });
      if (res.ok) {
        router.push('/faq');
      } else {
        console.error('Hata', await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-500">Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 mb-6">
        <ArrowLeft size={18} /> Geri
      </button>
      <h1 className="text-2xl font-serif text-slate-900 mb-4">S.S.S Düzenle</h1>
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
          {saving ? 'Kaydediliyor...' : 'Güncelle'}
        </button>
      </form>
    </div>
  );
}
