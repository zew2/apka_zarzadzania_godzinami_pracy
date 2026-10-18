import { toDateKey, formatTime, formatDuration, summarizeDay } from './employeeUtils';

export default function WorkWeek({ entries }) {
  // ostatnie 7 dni, od dzisiaj wstecz
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">Ostatnie 7 dni</h2>
      <ul className="divide-y">
        {days.map((d) => {
          const dayEntries = entries.filter((e) => toDateKey(new Date(e.timestamp)) === toDateKey(d));
          const { start, stop, workMs } = summarizeDay(dayEntries);
          return (
            <li key={toDateKey(d)} className="py-2 flex justify-between text-sm">
              <span className="font-medium">
                {d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' })}
              </span>
              {start ? (
                <span>
                  {formatTime(start)} – {stop ? formatTime(stop) : '?'} · {formatDuration(workMs)}
                </span>
              ) : (
                <span className="text-slate-400">brak</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
