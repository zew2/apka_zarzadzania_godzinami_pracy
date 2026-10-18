// DANE TESTOWE — tylko do pracy nad panelem, zanim reszta zespołu podepnie prawdziwe dane.
// Kształt obiektów to "kontrakt" ustalony z zespołem — nie zmieniaj go bez uzgodnienia.
import { toDateKey } from './employeeUtils';

export const MOCK_USER = {
  id: 2,
  name: 'Anna Nowak',
  role: 'pracownik',
  urlopDni: 26,
};

// Generuje odbicia z ostatnich dni roboczych, żeby tabela "Ostatnie 7 dni" nie była pusta.
function at(daysAgo, hour, minute) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function buildEntries() {
  const entries = [];
  for (let daysAgo = 6; daysAgo >= 1; daysAgo--) {
    const day = new Date();
    day.setDate(day.getDate() - daysAgo);
    if (day.getDay() === 0 || day.getDay() === 6) continue;
    entries.push({ userId: 2, type: 'START', timestamp: at(daysAgo, 8, 2) });
    entries.push({ userId: 2, type: 'PRZERWA', timestamp: at(daysAgo, 12, 0) });
    entries.push({ userId: 2, type: 'START', timestamp: at(daysAgo, 12, 30) });
    // jeden dzień celowo bez odbicia wyjścia
    if (daysAgo !== 3) entries.push({ userId: 2, type: 'STOP', timestamp: at(daysAgo, 16, 35) });
  }
  // dzisiaj: wejście rano, bez wyjścia (pracownik jest w pracy)
  entries.push({ userId: 2, type: 'START', timestamp: at(0, 7, 55) });
  return entries;
}

export const MOCK_TIME_ENTRIES = buildEntries();

const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};

export const MOCK_LEAVE_REQUESTS = [
  { id: 101, userId: 2, startDate: inDays(-40), endDate: inDays(-36), status: 'zaakceptowany', createdAt: new Date().toISOString() },
  { id: 102, userId: 2, startDate: inDays(20), endDate: inDays(24), status: 'do_wyjasnienia', managerNote: 'W tym terminie urlop ma już Piotr — da się przesunąć o tydzień?', createdAt: new Date().toISOString() },
  { id: 103, userId: 2, startDate: inDays(45), endDate: inDays(46), status: 'oczekuje', createdAt: new Date().toISOString() },
];
