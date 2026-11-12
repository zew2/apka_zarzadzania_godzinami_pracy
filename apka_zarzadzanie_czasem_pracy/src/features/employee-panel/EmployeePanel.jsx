import LeaveRequestForm from './LeaveRequestForm';
import WorkWeek from './WorkWeek';
import { STATUS, formatDate, getUsedDays } from './employeeUtils';

export default function EmployeePanel({ user, timeEntries, leaveRequests, onSubmitLeave, onLogout }) {
  const myEntries = timeEntries.filter((e) => String(e.userId) === String(user.id));
  const myRequests = leaveRequests.filter((r) => String(r.userId) === String(user.id));
  
  const used = getUsedDays(myRequests);
  const remaining = user.urlopDni - used;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-indigo-200 text-sm">Panel pracownika</p>
            <h1 className="text-xl sm:text-2xl font-bold">{user?.name || 'Pracownik'}</h1>
          </div>
          <button 
            type="button" 
            onClick={onLogout} 
            className="border border-white/30 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Wyloguj
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid md:grid-cols-2 gap-5">
          
          <div className="flex flex-col gap-5">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-2">Podsumowanie urlopu</h2>
              <div className="flex gap-4">
                <p className="text-slate-600">Wykorzystane: <b className="text-slate-900">{used}</b> z {user.urlopDni}</p>
                <p className="text-slate-600">Zostało: <b className="text-indigo-600">{remaining}</b> dni</p>
              </div>
            </div>
            
            <LeaveRequestForm remaining={remaining} onSubmit={onSubmitLeave} />
            
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Moje wnioski</h2>
              {myRequests.length === 0 && <p className="text-slate-500">Brak wniosków</p>}
              
              <ul className="divide-y divide-slate-100">
                {myRequests.map((r) => (
                  <li key={r.id} className="py-3 first:pt-0 last:pb-0 text-sm">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                      <span className="font-medium text-slate-700">{formatDate(r.startDate)} – {formatDate(r.endDate)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-medium ${STATUS[r.status]?.color || 'bg-slate-100 text-slate-700'}`}>
                        {STATUS[r.status]?.label || r.status}
                      </span>
                    </div>
                    {r.managerNote && <p className="text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg">Kierownik: {r.managerNote}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-fit">
            <WorkWeek entries={myEntries} />
          </div>

        </div>
      </main>
    </div>
  );
}