import { formatDayLabel, formatDuration, formatTime, lastNDays, summarizeDay } from './employeeUtils';

const NOW_LABEL = { work: 'w pracy', break: 'na przerwie' };

export default function WorkWeek({ entries, now = new Date() }) {
  const days = lastNDays(7, now).map((key) => summarizeDay(entries, key, now));
  const totalMs = days.reduce((sum, d) => sum + d.workMs, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-lg font-bold text-slate-800">Ostatnie 7 dni</h2>
        <p className="text-sm text-slate-500">Razem: <strong className="text-slate-800">{formatDuration(totalMs)}</strong></p>
      </div>

      <ul className="divide-y divide-slate-100">
        {days.map((d) => (
          <li key={d.dateKey} className="py-3 flex justify-between items-center gap-3">
            <div>
              <p className="font-medium text-slate-800 capitalize">{formatDayLabel(d.dateKey)}</p>
              {d.hasEvents ? (
                <p className="text-sm text-slate-500">
                  {d.firstStart ? formatTime(d.firstStart) : '—'} – {d.lastStop && d.state === 'off' ? formatTime(d.lastStop) : NOW_LABEL[d.state] ?? '?'}
                  {d.breakMs > 0 && <span> · przerwy {formatDuration(d.breakMs)}</span>}
                </p>
              ) : (
                <p className="text-sm text-slate-400">brak odbić</p>
              )}
              {d.missingStop && <p className="text-xs font-medium text-red-600 mt-0.5">Brak odbicia wyjścia — zgłoś kierownikowi</p>}
            </div>
            <p className={`font-semibold tabular-nums ${d.hasEvents ? 'text-slate-800' : 'text-slate-300'}`}>
              {formatDuration(d.workMs)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
