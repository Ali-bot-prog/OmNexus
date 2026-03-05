'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faq');
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 p-8 max-w-3xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif text-slate-900 mb-1">S.S.S Yönetimi</h1>
          <p className="text-slate-500 text-sm">Sık sorulan soruları ekleyin, düzenleyin veya silin</p>
        </div>
        <Link href="/faq/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          <Plus size={18} /> Yeni
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {faqs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Henüz SSS yok
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {faqs.map(faq => (
              <div key={faq.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">{faq.question}</h3>
                </div>
                <div className="flex gap-2">
                  <Link href={`/faq/${faq.id}/edit`} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={deleting === faq.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
