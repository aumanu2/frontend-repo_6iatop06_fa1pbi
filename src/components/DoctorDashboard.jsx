import { useEffect, useState } from 'react';

function FeedbackForm({ token, assessmentId, onDone }) {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [recs, setRecs] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { assessment_id: assessmentId, message, severity, recommendations: recs? recs.split(',').map(s=>s.trim()).filter(Boolean): [] };
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/doctor/feedback?token=${encodeURIComponent(token)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit feedback');
      onDone();
    } catch (err) {
      alert(err.message);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <textarea required placeholder="Feedback message" className="w-full border border-slate-300 rounded-md px-3 py-2" value={message} onChange={e=>setMessage(e.target.value)} />
      <input placeholder="Severity (Low/Moderate/High)" className="w-full border border-slate-300 rounded-md px-3 py-2" value={severity} onChange={e=>setSeverity(e.target.value)} />
      <input placeholder="Recommendations (comma separated)" className="w-full border border-slate-300 rounded-md px-3 py-2" value={recs} onChange={e=>setRecs(e.target.value)} />
      <button disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800">{loading? 'Submitting...' : 'Submit Feedback'}</button>
    </form>
  );
}

export default function DoctorDashboard({ user }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  const load = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/doctor/assessments?token=${encodeURIComponent(user.token)}`);
    const data = await res.json();
    setItems(data.reverse());
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="font-medium text-slate-800">Recent Assessments</h3>
          <div className="divide-y divide-slate-200">
            {items.map((h) => (
              <div key={h._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{h.result_label}</p>
                  <p className="text-xs text-slate-500">Prob: {(h.probability*100).toFixed(0)}% · {new Date(h.created_at).toLocaleString()}</p>
                </div>
                <button onClick={()=>setActive(h)} className="text-blue-600 text-sm">Review</button>
              </div>
            ))}
            {!items.length && <p className="text-sm text-slate-500 py-4">No assessments yet.</p>}
          </div>
        </div>
        {active && (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium">Provide Feedback</h3>
            <p className="text-sm text-slate-600">Assessment: {active._id} · {active.result_label}</p>
            <FeedbackForm token={user.token} assessmentId={active._id} onDone={()=>{ setActive(null); load(); }} />
          </div>
        )}
      </div>
      <div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="font-medium text-slate-800 mb-3">Summary</h3>
          <p className="text-sm text-slate-600">Total assessments: {items.length}</p>
          <p className="text-sm text-slate-600">High risk: {items.filter(i=>i.result_label.includes('High')).length}</p>
        </div>
      </div>
    </div>
  );
}
