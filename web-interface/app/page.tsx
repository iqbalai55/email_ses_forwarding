'use client';
import { useState } from 'react';
import { ChevronDown, Send, Loader2, Lock, Unlock } from 'lucide-react';

const senders = [
  { value: 'iqbal@croptic.co', label: 'iqbal@croptic.co' },
  { value: 'imam@croptic.co', label: 'imam@croptic.co' },
  { value: 'rahmad@croptic.co', label: 'rahmad@croptic.co' },
  { value: 'support@croptic.co', label: 'support@croptic.co' },
  { value: 'sales@croptic.co', label: 'sales@croptic.co' },
];

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const [to, setTo] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(senders[0].value);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Unlock handler
  const handleUnlock = async () => {
    setUnlockError('');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // dummy request hanya untuk cek password
        body: JSON.stringify({
          password,
          to: 'test@test.com',
          sender,
          title: 'test',
          message: 'test',
          validateOnly: true,
        }),
      });

      if (res.status === 401) {
        setUnlockError('Password salah');
        return;
      }

      setUnlocked(true);
    } catch {
      setUnlockError('Gagal koneksi');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, to, sender, title, message }),
      });

      const data = await res.json();
      setStatus(res.ok ? 'Email terkirim berhasil!' : data.error);
    } catch {
      setStatus('Error koneksi, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UNLOCK PAGE ================= */
  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm">
          <div className="text-center mb-6">
            <Lock className="mx-auto h-10 w-10 text-indigo-600 mb-2" />
            <h1 className="text-2xl font-bold">Unlock SES Sender</h1>
            <p className="text-gray-600 text-sm">Masukkan password untuk lanjut</p>
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-xl mb-4"
          />

          <button
            onClick={handleUnlock}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-semibold"
          >
            <Unlock className="h-5 w-5" />
            Unlock
          </button>

          {unlockError && (
            <p className="text-red-600 text-sm text-center mt-4">
              {unlockError}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ================= MAIN FORM ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-6">SES Sender</h1>

          {/* Sender */}
          <div className="mb-4 relative">
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full p-4 border rounded-xl appearance-none"
            >
              {senders.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-4 border rounded-xl mb-4"
            required
          />

          <input
            type="text"
            placeholder="Judul Email"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border rounded-xl mb-4"
            required
          />

          <textarea
            placeholder="Pesan"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border rounded-xl mb-6"
            rows={4}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
            Kirim Email
          </button>

          {status && (
            <p className="text-center mt-4 text-sm">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
}
