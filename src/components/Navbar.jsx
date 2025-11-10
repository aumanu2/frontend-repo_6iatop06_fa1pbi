import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, User, LogOut, ShieldCheck, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-600 text-white">
              <Stethoscope size={18} />
            </div>
            <Link to="/" className="font-semibold text-slate-800">
              Autism Predictor
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            {user?.role === 'patient' && (
              <Link to="/patient" className="hover:text-blue-600">Patient Dashboard</Link>
            )}
            {user?.role === 'doctor' && (
              <Link to="/doctor" className="hover:text-blue-600">Doctor Dashboard</Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-slate-700 text-sm">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="capitalize">{user.role}</span>
                </div>
                <button onClick={onLogout} className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-md text-sm hover:bg-slate-800">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50">Login</button>
                <button onClick={() => navigate('/register')} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">Register</button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <Menu />
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2" onClick={() => setOpen(false)}>Home</Link>
            {user?.role === 'patient' && (
              <Link to="/patient" className="block py-2" onClick={() => setOpen(false)}>Patient Dashboard</Link>
            )}
            {user?.role === 'doctor' && (
              <Link to="/doctor" className="block py-2" onClick={() => setOpen(false)}>Doctor Dashboard</Link>
            )}
            {!user && (
              <>
                <button onClick={() => {setOpen(false); navigate('/login');}} className="block w-full text-left py-2">Login</button>
                <button onClick={() => {setOpen(false); navigate('/register');}} className="block w-full text-left py-2">Register</button>
              </>
            )}
            {user && (
              <button onClick={() => { setOpen(false); onLogout(); }} className="block w-full text-left py-2">Logout</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
