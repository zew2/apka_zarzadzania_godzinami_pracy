import { LEAVE_STATUS, countWorkingDays, formatDate, workingDaysLabel } from './employeeUtils';

const STATUS_STYLE = {
  [LEAVE_STATUS.PENDING]: { label: 'Oczekuje', className: 'bg-amber-100 text-amber-800' },
  [LEAVE_STATUS.ACCEPTED]: { label: 'Zaakceptowany', className: 'bg-emerald-100 text-emerald-800' },
  [LEAVE_STATUS.REJECTED]: { label: 'Odrzucony', className: 'bg-red-100 text-red-800' },
  [LEAVE_STATUS.CLARIFY]: { label: 'Do wyjaśnienia', className: 'bg-blue-100 text-blue-800' },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE[LEAVE_STATUS.PENDING];
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${s.className}`}>{s.label}</span>;
}

export default function LeaveHistory({ requests }) {
  const sorted = [...requests].sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Moje wnioski</h2>

      {sorted.length === 0 ? (
        <p className="text-slate-500 text-sm">Nie złożyłeś jeszcze żadnego wniosku.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((r) => (
            <li key={r.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{formatDate(r.startDate)} – {formatDate(r.endDate)}</p>
                  <p className="text-sm text-slate-500">{workingDaysLabel(countWorkingDays(r.startDate, r.endDate))}</p>
                  {r.reason && <p className="text-sm text-slate-600 mt-1">„{r.reason}”</p>}
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.managerNote && (
                <p className="mt-2 text-sm text-blue-900 bg-blue-50 rounded-lg p-2">
                  <strong>Kierownik:</strong> {r.managerNote}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
