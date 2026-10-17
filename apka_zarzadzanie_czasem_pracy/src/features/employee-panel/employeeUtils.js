// Funkcje pomocnicze panelu pracownika — czysta logika, bez Reacta.
// Daty "dniowe" trzymamy jako tekst 'RRRR-MM-DD' (tak jak zwraca <input type="date">).

export const LEAVE_STATUS = {
  PENDING: 'oczekuje',
  ACCEPTED: 'zaakceptowany',
  REJECTED: 'odrzucony',
  CLARIFY: 'do_wyjasnienia',
};

// --- Daty ---

const pad = (n) => String(n).padStart(2, '0');

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(key) {
  return parseDateKey(key).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDayLabel(key) {
  return parseDateKey(key).toLocaleDateString('pl-PL', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export function formatTime(date) {
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

export function formatDuration(ms) {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${pad(m)}m`;
}

// "1 dzień roboczy", "3 dni robocze", "5 dni roboczych"
export function workingDaysLabel(n) {
  if (n === 1) return '1 dzień roboczy';
  const last = n % 10, lastTwo = n % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} dni robocze`;
  return `${n} dni roboczych`;
}

// --- Dni robocze (pon–pt bez świąt ustawowych w Polsce) ---

function easterSunday(year) {
  // Algorytm Meeusa/Jonesa/Butchera
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const holidayCache = {};

function holidaysForYear(year) {
  if (holidayCache[year]) return holidayCache[year];
  const fixed = ['01-01', '01-06', '05-01', '05-03', '08-15', '11-01', '11-11', '12-24', '12-25', '12-26'];
  const set = new Set(fixed.map((md) => `${year}-${md}`));
  const easter = easterSunday(year);
  const shift = (days) => toDateKey(new Date(year, easter.getMonth(), easter.getDate() + days));
  set.add(shift(1));  // Poniedziałek Wielkanocny
  set.add(shift(60)); // Boże Ciało
  holidayCache[year] = set;
  return set;
}

export function isWorkingDay(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  return !holidaysForYear(date.getFullYear()).has(toDateKey(date));
}

export function countWorkingDays(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  let count = 0;
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (isWorkingDay(d)) count++;
  }
  return count;
}

// --- Urlopy ---

export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd; // porównanie tekstów 'RRRR-MM-DD' działa jak dat
}

// Liczy dni urlopu w danym roku: wykorzystane (zaakceptowane), zarezerwowane (czekające / do wyjaśnienia), pozostałe.
export function getLeaveStats(user, requests, year = new Date().getFullYear()) {
  let used = 0;
  let reserved = 0;
  for (const r of requests) {
    if (r.userId !== user.id || !r.startDate.startsWith(String(year))) continue;
    const days = countWorkingDays(r.startDate, r.endDate);
    if (r.status === LEAVE_STATUS.ACCEPTED) used += days;
    else if (r.status === LEAVE_STATUS.PENDING || r.status === LEAVE_STATUS.CLARIFY) reserved += days;
  }
  const total = user.urlopDni ?? 0;
  return { total, used, reserved, remaining: total - used, available: total - used - reserved };
}

// Zwraca komunikat błędu albo null, jeśli wniosek jest poprawny.
export function validateLeaveRequest({ startDate, endDate }, user, requests, ignoreId = null) {
  const today = toDateKey(new Date());
  if (!startDate || !endDate) return 'Wybierz datę początku i końca urlopu.';
  if (startDate < today) return 'Urlop nie może zaczynać się w przeszłości.';
  if (endDate < startDate) return 'Data końca musi być taka sama lub późniejsza niż data początku.';
  if (startDate.slice(0, 4) !== endDate.slice(0, 4)) return 'Urlop na przełomie roku złóż jako dwa osobne wnioski.';

  const days = countWorkingDays(startDate, endDate);
  if (days === 0) return 'W wybranym okresie nie ma żadnego dnia roboczego.';

  const mine = requests.filter((r) => r.userId === user.id && r.id !== ignoreId);
  const clash = mine.find(
    (r) => r.status !== LEAVE_STATUS.REJECTED && rangesOverlap(startDate, endDate, r.startDate, r.endDate),
  );
  if (clash) return `Masz już wniosek na ten okres (${formatDate(clash.startDate)} – ${formatDate(clash.endDate)}).`;

  const { available } = getLeaveStats(user, mine, Number(startDate.slice(0, 4)));
  if (days > available) return `Wniosek obejmuje ${workingDaysLabel(days)}, a do dyspozycji masz ${available}.`;

  return null;
}

// --- Czas pracy ---
// Zdarzenie: { userId, type: 'START' | 'PRZERWA' | 'STOP', timestamp: ISO string }
// START po PRZERWIE oznacza powrót z przerwy.

export function summarizeDay(entries, dateKey, now = new Date()) {
  const events = entries
    .filter((e) => toDateKey(new Date(e.timestamp)) === dateKey)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let state = 'off'; // off | work | break
  let since = null;
  let workMs = 0;
  let breakMs = 0;
  let firstStart = null;
  let lastStop = null;

  for (const e of events) {
    const t = new Date(e.timestamp);
    if (state === 'work') workMs += t - since;
    if (state === 'break') breakMs += t - since;

    if (e.type === 'START') {
      if (!firstStart) firstStart = t;
      state = 'work';
    } else if (e.type === 'PRZERWA' && state === 'work') {
      state = 'break';
    } else if (e.type === 'STOP') {
      state = 'off';
      lastStop = t;
    }
    since = t;
  }

  const isToday = dateKey === toDateKey(now);
  let missingStop = false;
  if (state !== 'off') {
    if (isToday) {
      if (state === 'work') workMs += now - since;
      else breakMs += now - since;
    } else {
      missingStop = true; // dzień w przeszłości bez odbicia wyjścia
    }
  }

  return { dateKey, firstStart, lastStop, workMs, breakMs, state: isToday ? state : 'off', missingStop, hasEvents: events.length > 0 };
}

export function lastNDays(n, now = new Date()) {
  const days = [];
  for (let i = 0; i < n; i++) {
    days.push(toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)));
  }
  return days;
}
