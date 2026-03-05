'use client';

import { useEffect, useState } from 'react';
import { Trash2, Eye, Check } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'PATCH' });
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
      if (selected?.id === id) setSelected({ ...selected, read: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-500">Yükleniyor...</div>;

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6 p-8 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-serif text-slate-900 mb-1">İletişim Mesajları</h1>
        <p className="text-slate-500 text-sm">{messages.length} mesaj {unreadCount > 0 && `(${unreadCount} okunmamış)`}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Henüz mesaj yok</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelected(msg)}
                    className={`p-4 cursor-pointer border-l-4 transition-colors ${
                      !msg.read ? 'border-l-slate-900 bg-slate-50 hover:bg-slate-100' : 'border-l-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium text-slate-900 truncate ${!msg.read ? 'font-semibold' : ''}`}>{msg.name}</h3>
                          {!msg.read && <span className="inline-block w-2 h-2 rounded-full bg-slate-900 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-blue-600 truncate">{msg.email}</p>
                        <p className="text-sm text-slate-600 truncate mt-1">{msg.message}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(msg.created_at).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4 sticky top-6">
              <div>
                <h2 className="text-lg font-serif text-slate-900 mb-2">{selected.name}</h2>
                <p className="text-sm text-blue-600 break-all">{selected.email}</p>
                {selected.phone && <p className="text-sm text-slate-600 mt-1">{selected.phone}</p>}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Mesaj</p>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">{new Date(selected.created_at).toLocaleString('tr-TR')}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {!selected.read && (
                  <button
                    onClick={() => markRead(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <Check size={16} />
                    Oku
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting === selected.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Sil
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center text-slate-500">
              <Eye size={32} className="mx-auto mb-3 opacity-30" />
              <p>Mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
