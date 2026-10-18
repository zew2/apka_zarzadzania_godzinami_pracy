import { useState } from 'react';
import Button from '../../components/ui/Button';
import { countWorkingDays } from './employeeUtils';

export default function LeaveRequestForm({ remaining, onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = countWorkingDays(startDate, endDate);
    if (endDate < startDate) return setError('Koniec urlopu nie może być przed początkiem.');
    if (days === 0) return setError('W tym terminie nie ma dni roboczych.');
    if (days > remaining) return setError(`Masz tylko ${remaining} dni urlopu.`);

    onSubmit({ startDate, endDate, reason });
    setStartDate('');
    setEndDate('');
    setReason('');
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">Nowy wniosek urlopowy</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date" required value={startDate} aria-label="Od"
            className="p-3 border rounded-lg"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date" required value={endDate} aria-label="Do"
            className="p-3 border rounded-lg"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <input
          type="text" placeholder="Powód (opcjonalnie)" value={reason}
          className="p-3 border rounded-lg"
          onChange={(e) => setReason(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Wyślij wniosek</Button>
      </form>
    </div>
  );
}
