import Spline from '@splinetool/react-spline';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Zn7XRxnnbSat5OJG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white pointer-events-none" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">
            Autism Risk Screening made simple
          </h1>
          <p className="mt-5 text-slate-600 text-lg">
            A modern tool for early autism risk assessment. Patients can self-screen and doctors can review, provide feedback, and track history—all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="pointer-events-auto inline-flex items-center gap-2 border border-slate-300 px-5 py-3 rounded-md hover:bg-slate-50">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
