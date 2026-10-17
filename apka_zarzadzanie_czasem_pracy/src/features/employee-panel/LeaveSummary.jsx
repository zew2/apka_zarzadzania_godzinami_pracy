import { workingDaysLabel } from './employeeUtils';

export default function LeaveSummary({ stats }) {
  const { total, used, reserved, remaining } = stats;
  const usedPct = total ? Math.min(100, (used / total) * 100) : 0;
  const reservedPct = total ? Math.min(100 - usedPct, (reserved / total) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Urlop {new Date().getFullYear()}</h2>

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-2xl font-bold text-slate-800">{used}</p>
          <p className="text-xs text-slate-500">wykorzystane</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3">
          <p className="text-2xl font-bold text-indigo-700">{remaining}</p>
          <p className="text-xs text-slate-500">pozostało</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-2xl font-bold text-slate-800">{total}</p>
          <p className="text-xs text-slate-500">przysługuje</p>
        </div>
      </div>

      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex" aria-hidden="true">
        <div className="bg-indigo-600" style={{ width: `${usedPct}%` }} />
        <div className="bg-amber-400" style={{ width: `${reservedPct}%` }} />
      </div>
      {reserved > 0 && (
        <p className="mt-2 text-sm text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />
          Czeka na decyzję kierownika: {workingDaysLabel(reserved)}
        </p>
      )}
    </div>
  );
}
