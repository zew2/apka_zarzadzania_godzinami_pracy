import { useEffect, useState } from 'react';
import { getLeaveStats } from './employeeUtils';
import LeaveSummary from './LeaveSummary';
import LeaveRequestForm from './LeaveRequestForm';
import LeaveHistory from './LeaveHistory';
import WorkWeek from './WorkWeek';

// Panel pracownika. Nie trzyma żadnych danych sam — wszystko dostaje z zewnątrz (z App.jsx),
// dzięki temu działa tak samo na danych testowych i na prawdziwej bazie.
//
// Propsy (kontrakt z zespołem):
//   user            { id, name, urlopDni }
//   timeEntries     [{ userId, type: 'START'|'PRZERWA'|'STOP', timestamp }]
//   leaveRequests   [{ id, userId, startDate, endDate, status, reason?, managerNote? }]
//   onSubmitLeave   ({ startDate, endDate, reason }) => void
//   onLogout        () => void
export default function EmployeePanel({ user, timeEntries, leaveRequests, onSubmitLeave, onLogout }) {
  // odświeżanie co minutę, żeby dzisiejszy czas pracy rósł na żywo
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const myEntries = timeEntries.filter((e) => e.userId === user.id);
  const myRequests = leaveRequests.filter((r) => r.userId === user.id);
  const stats = getLeaveStats(user, myRequests);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center gap-4">
          <div>
            <p className="text-indigo-200 text-sm">Panel pracownika</p>
            <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
          </div>
          <button
            onClick={onLogout}
            className="border border-white/30 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Wyloguj
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <LeaveSummary stats={stats} />
          <LeaveRequestForm user={user} requests={myRequests} onSubmit={onSubmitLeave} />
          <LeaveHistory requests={myRequests} />
        </div>
        <div>
          <WorkWeek entries={myEntries} now={now} />
        </div>
      </main>
    </div>
  );
}
