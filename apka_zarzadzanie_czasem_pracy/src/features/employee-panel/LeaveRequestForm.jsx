import { useState } from 'react';
import Button from '../../components/ui/Button';
import { countWorkingDays, toDateKey, validateLeaveRequest } from './employeeUtils';

export default function LeaveRequestForm({ user, requests, onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const today = toDateKey(new Date());
  const days = startDate && endDate && endDate >= startDate ? countWorkingDays(startDate, endDate) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const problem = validateLeaveRequest({ startDate, endDate }, user, requests);
    if (problem) {
      setError(problem);
      setSent(false);
      return;
    }
    onSubmit({ startDate, endDate, reason: reason.trim() });
    setStartDate('');
    setEndDate('');
    setReason('');
    setError(null);
    setSent(true);
  };

  const inputClass = 'w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Nowy wniosek urlopowy</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm text-slate-600 mb-1">Od</span>
            <input
              type="date" min={today} value={startDate} className={inputClass}
              onChange={(e) => { setStartDate(e.target.value); setSent(false); }}
            />
          </label>
          <label className="block">
            <span className="block text-sm text-slate-600 mb-1">Do</span>
            <input
              type="date" min={startDate || today} value={endDate} className={inputClass}
              onChange={(e) => { setEndDate(e.target.value); setSent(false); }}
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Komentarz (opcjonalnie)</span>
          <textarea
            rows={2} value={reason} maxLength={300} className={inputClass}
            placeholder="np. wyjazd rodzinny"
            onChange={(e) => setReason(e.target.value)}
          />
        </label>

        {days > 0 && (
          <p className="text-sm text-slate-600">
            Dni roboczych we wniosku: <strong>{days}</strong>
          </p>
        )}
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">{error}</p>}
        {sent && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3" role="status">Wniosek wysłany do kierownika.</p>}

        <Button type="submit" variant="primary">Wyślij wniosek</Button>
      </form>
    </div>
  );
}
