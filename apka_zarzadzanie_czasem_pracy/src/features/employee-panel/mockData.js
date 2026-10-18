// Dane testowe — do czasu, aż reszta zespołu podepnie prawdziwe dane

export const MOCK_USER = { id: 2, name: 'Anna Nowak', role: 'pracownik', urlopDni: 26 };

const day = (daysAgo, h, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const MOCK_TIME_ENTRIES = [
  { userId: 2, type: 'START', timestamp: day(1, 8) },
  { userId: 2, type: 'PRZERWA', timestamp: day(1, 12) },
  { userId: 2, type: 'START', timestamp: day(1, 12, 30) },
  { userId: 2, type: 'STOP', timestamp: day(1, 16, 30) },
  { userId: 2, type: 'START', timestamp: day(2, 7, 45) },
  { userId: 2, type: 'STOP', timestamp: day(2, 15, 50) },
];

export const MOCK_LEAVE_REQUESTS = [
  { id: 1, userId: 2, startDate: '2026-07-06', endDate: '2026-07-10', status: 'zaakceptowany', reason: 'Wakacje', managerNote: '' },
  { id: 2, userId: 2, startDate: '2026-11-12', endDate: '2026-11-13', status: 'do_wyjasnienia', reason: '', managerNote: 'Kto Cię zastąpi?' },
  { id: 3, userId: 2, startDate: '2026-12-28', endDate: '2026-12-31', status: 'oczekuje', reason: 'Święta', managerNote: '' },
];
