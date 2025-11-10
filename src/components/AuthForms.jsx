import { useState } from 'react';

export function LoginForm({ onAuth }) {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      onAuth(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className={`py-2 rounded-md border ${role==='patient'?'bg-blue-600 text-white border-blue-600':'border-slate-300'}`} onClick={() => setRole('patient')}>Patient</button>
        <button type="button" className={`py-2 rounded-md border ${role==='doctor'?'bg-blue-600 text-white border-blue-600':'border-slate-300'}`} onClick={() => setRole('doctor')}>Doctor</button>
      </div>
      <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
      <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800">{loading? 'Logging in...' : 'Login'}</button>
    </form>
  );
}

export function RegisterForm({ onAuth }) {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      onAuth(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className={`py-2 rounded-md border ${role==='patient'?'bg-blue-600 text-white border-blue-600':'border-slate-300'}`} onClick={() => setRole('patient')}>Patient</button>
        <button type="button" className={`py-2 rounded-md border ${role==='doctor'?'bg-blue-600 text-white border-blue-600':'border-slate-300'}`} onClick={() => setRole('doctor')}>Doctor</button>
      </div>
      <input required placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
      <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
      <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800">{loading? 'Creating account...' : 'Create account'}</button>
    </form>
  );
}
