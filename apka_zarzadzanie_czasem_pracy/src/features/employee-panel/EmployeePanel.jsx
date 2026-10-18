import LeaveRequestForm from './LeaveRequestForm';
import WorkWeek from './WorkWeek';
import { STATUS, formatDate, getUsedDays } from './employeeUtils';

export default function EmployeePanel({ user, timeEntries, leaveRequests, onSubmitLeave, onLogout }) {
  // tylko dane zalogowanego pracownika
  const myEntries = timeEntries.filter((e) => e.userId === user.id);
  const myRequests = leaveRequests.filter((r) => r.userId === user.id);

  const used = getUsedDays(myRequests);
  const remaining = user.urlopDni - used;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cześć, {user.name}</h1>
          <button onClick={onLogout} className="text-slate-600 hover:underline">Wyloguj</button>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold mb-2">Urlop</h2>
              <p>Wykorzystane: <b>{used}</b> z {user.urlopDni} dni</p>
              <p>Zostało: <b className="text-indigo-600">{remaining}</b> dni</p>
            </div>

            <LeaveRequestForm remaining={remaining} onSubmit={onSubmitLeave} />

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold mb-4">Moje wnioski</h2>
              {myRequests.length === 0 && <p className="text-slate-400">Brak wniosków</p>}
              <ul className="flex flex-col gap-3">
                {myRequests.map((r) => (
                  <li key={r.id} className="text-sm">
                    <div className="flex justify-between gap-2">
                      <span>{formatDate(r.startDate)} – {formatDate(r.endDate)}</span>
                      <span className={`px-2 rounded-full ${STATUS[r.status].color}`}>
                        {STATUS[r.status].label}
                      </span>
                    </div>
                    {r.managerNote && <p className="text-slate-500">Kierownik: {r.managerNote}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <WorkWeek entries={myEntries} />
        </div>
      </div>
    </div>
  );
}
