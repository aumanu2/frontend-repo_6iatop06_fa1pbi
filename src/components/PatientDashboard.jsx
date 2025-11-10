import { useEffect, useState } from 'react';

function PredictionForm({ token, onPredicted }) {
  const [form, setForm] = useState({
    eye_contact: 0, speech_delay: 0, repetitive_behavior: 0, sensory_sensitivity: 0, social_interaction_difficulty: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict?token=${encodeURIComponent(token)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      onPredicted(data);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
      <h3 className="font-medium text-slate-800">Quick Screening</h3>
      {['eye_contact','speech_delay','repetitive_behavior','sensory_sensitivity','social_interaction_difficulty'].map(key => (
        <div key={key} className="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
          <label className="text-sm text-slate-600 capitalize">{key.replaceAll('_',' ')}</label>
          <input type="range" min="0" max="1" step="0.1" value={form[key]} onChange={e=>setForm({...form,[key]:parseFloat(e.target.value)})} />
        </div>
      ))}
      <textarea placeholder="Notes (optional)" className="w-full border border-slate-300 rounded-md px-3 py-2" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
      <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">{loading? 'Predicting...' : 'Predict Risk'}</button>
    </form>
  );
}

export default function PatientDashboard({ user }) {
  const [history, setHistory] = useState([]);
  const [last, setLast] = useState(null);

  const load = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/patient/assessments?token=${encodeURIComponent(user.token)}`);
    const data = await res.json();
    setHistory(data.reverse());
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <PredictionForm token={user.token} onPredicted={(d)=>{ setLast(d); load(); }} />
        {last && (
          <div className={`rounded-lg p-4 ${last.label.includes('High')? 'bg-rose-50 border border-rose-200':'bg-emerald-50 border border-emerald-200'}`}>
            <p className="font-medium">Latest result: {last.label}</p>
            <p className="text-sm text-slate-600">Probability: {(last.probability*100).toFixed(1)}%</p>
          </div>
        )}
      </div>
      <div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="font-medium text-slate-800 mb-3">History</h3>
          <div className="space-y-3 max-h-[480px] overflow-auto pr-2">
            {history.map((h) => (
              <div key={h._id} className="border border-slate-200 rounded-md p-3">
                <p className="text-sm font-medium">{h.result_label}</p>
                <p className="text-xs text-slate-500">{new Date(h.created_at).toLocaleString()}</p>
                <p className="text-xs text-slate-600 mt-1">Probability: {(h.probability*100).toFixed(0)}%</p>
                {h.feedback_id && <p className="text-xs text-emerald-700 mt-1">Doctor feedback attached</p>}
              </div>
            ))}
            {!history.length && <p className="text-sm text-slate-500">No assessments yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
