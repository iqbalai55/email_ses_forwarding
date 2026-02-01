'use client';
import { useState } from 'react';
import { ChevronDown, Send, Loader2 } from 'lucide-react';  // npm i lucide-react

const senders = [
  { value: 'iqbal@croptic.co', label: 'iqbal@croptic.co' },
  { value: 'imam@croptic.co', label: 'imam@croptic.co' },
  { value: 'rahmad@croptic.co', label: 'rahmad@croptic.co' },
  { value: 'support@croptic.co', label: 'support@croptic.co' },
  { value: 'sales@croptic.co', label: 'sales@croptic.co' },
  // Tambah sender verified SES-mu di sini
];

export default function Home() {
  const [to, setTo] = useState('');
  const [title, setTitle] = useState(''); // state untuk title
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [sender, setSender] = useState(senders[0].value);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      setStatus('Error koneksi, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            SES Sender
          </h1>
          <p className="text-gray-600">Kirim email aman dengan password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/50">
          {/* Dropdown Sender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dari (Sender)</label>
            <div className="relative">
              <select
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                required
              >
                {senders.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Input To */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kirim ke</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Input Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Email</label>
            <input
              type="text"
              placeholder="Judul email..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
            <textarea
              placeholder="Tulis pesanmu di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Kirim Email
              </>
            )}
          </button>

          {/* Status */}
          {status && (
            <div className={`mt-6 p-4 rounded-xl font-medium ${
              status.includes('berhasil') 
                ? 'bg-green-100 border border-green-200 text-green-800' 
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              {status}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sender emails harus verified di AWS SES
        </p>
      </div>
    </div>
  );
}
