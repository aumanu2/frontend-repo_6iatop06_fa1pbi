import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import { LoginForm, RegisterForm } from './components/AuthForms';

const backend = import.meta.env.VITE_BACKEND_URL;

function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('autism_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const onAuth = (data) => {
    const u = { token: data.token, role: data.role, name: data.name, email: data.email, user_id: data.user_id };
    setUser(u);
    localStorage.setItem('autism_user', JSON.stringify(u));
    navigate(u.role === 'doctor' ? '/doctor' : '/patient');
  };

  const onLogout = () => {
    setUser(null);
    localStorage.removeItem('autism_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} onLogout={onLogout} />
      <Routes>
        <Route index element={<>
          <Hero />
          <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800">For Patients</h3>
              <p className="text-slate-600 text-sm mt-2">Self-screen with guided questions, view your history, and track progress over time.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800">For Doctors</h3>
              <p className="text-slate-600 text-sm mt-2">Review patient submissions, provide feedback, and share recommendations.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800">Secure & Private</h3>
              <p className="text-slate-600 text-sm mt-2">Role-based access with secure sessions and privacy-focused design.</p>
            </div>
          </section>
        </>} />

        <Route path="/login" element={
          <div className="max-w-md mx-auto px-4 py-12">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Login</h2>
              <LoginForm onAuth={onAuth} />
            </div>
          </div>
        } />

        <Route path="/register" element={
          <div className="max-w-md mx-auto px-4 py-12">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Create your account</h2>
              <RegisterForm onAuth={onAuth} />
            </div>
          </div>
        } />

        <Route path="/patient" element={user?.role==='patient' ? <PatientDashboard user={user} /> : <div className="max-w-2xl mx-auto px-4 py-12 text-center">Please login as patient to view this page.</div>} />
        <Route path="/doctor" element={user?.role==='doctor' ? <DoctorDashboard user={user} /> : <div className="max-w-2xl mx-auto px-4 py-12 text-center">Please login as doctor to view this page.</div>} />
      </Routes>

      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Autism Predictor · For academic use</p>
          <p>Not a medical device. Consult a healthcare professional for diagnosis.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
