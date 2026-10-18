// Funkcje pomocnicze panelu pracownika

export const STATUS = {
  oczekuje: { label: 'Oczekuje', color: 'bg-amber-100 text-amber-800' },
  zaakceptowany: { label: 'Zaakceptowany', color: 'bg-emerald-100 text-emerald-700' },
  odrzucony: { label: 'Odrzucony', color: 'bg-red-100 text-red-700' },
  do_wyjasnienia: { label: 'Do wyjaśnienia', color: 'bg-indigo-100 text-indigo-700' },
};

// Date -> 'RRRR-MM-DD'
export const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// 'RRRR-MM-DD' -> 'DD.MM.RRRR'
export const formatDate = (s) => s.split('-').reverse().join('.');

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

export const formatDuration = (ms) => {
  const min = Math.floor(ms / 60000);
  return `${Math.floor(min / 60)} h ${min % 60} min`;
};

// Dni robocze = pon–pt (tak samo liczy panel kierownika)
export function countWorkingDays(start, end) {
  let count = 0;
  const d = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  for (; d <= last; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) count++;
  }
  return count;
}

// Wykorzystany urlop w tym roku = zaakceptowane wnioski
export function getUsedDays(requests) {
  const year = String(new Date().getFullYear());
  return requests
    .filter((r) => r.status === 'zaakceptowany' && r.startDate.startsWith(year))
    .reduce((sum, r) => sum + countWorkingDays(r.startDate, r.endDate), 0);
}

// Odbicia z jednego dnia -> wejście, wyjście i czas pracy (bez przerw)
export function summarizeDay(entries) {
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  let workMs = 0;
  let since = null;
  for (const e of sorted) {
    const t = new Date(e.timestamp);
    if (e.type === 'START') since = t;
    else if (since) {
      workMs += t - since;
      since = null;
    }
  }
  return {
    start: sorted.find((e) => e.type === 'START')?.timestamp,
    stop: sorted.findLast((e) => e.type === 'STOP')?.timestamp,
    workMs,
  };
}
