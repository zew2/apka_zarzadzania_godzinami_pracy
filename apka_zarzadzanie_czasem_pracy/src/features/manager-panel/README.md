# Domena Kierownika

Moduł pokazuje zalogowanemu kierownikowi:

- **Obecność dziś** — status każdego pracownika: W pracy / Na przerwie / Zakończył / Nieobecny / Na urlopie, godzinę wejścia i przepracowany czas oraz liczniki osób w pracy, na przerwie i nieobecnych.
- **Wnioski urlopowe** — listę wniosków (oczekujące na początku), terminy, liczbę dni roboczych, statusy, wykrywanie nakładających się terminów oraz akcje: Akceptuj, Do wyjaśnienia (z obowiązkową notatką), Odrzuć.
- **Pracownicy** — listę kont, dodawanie i edycję pracowników, wybór roli i wymiaru urlopu oraz sprawdzanie unikalności adresu email, loginu i 4-cyfrowego PIN-u.

Dni robocze liczone są jako **pon.–pt. bez uwzględniania świąt ustawowych**. Panel jest responsywny i korzysta z React, Vite i Tailwind CSS.

## Pliki

| Plik | Co robi |
| --- | --- |
| `ManagerPanel.jsx` | Cały panel — nagłówek i przełączanie trzech zakładek |
| `AttendanceToday.jsx` | Statusy i czas pracy pracowników w bieżącym dniu |
| `LeaveApprovals.jsx` | Lista wniosków, decyzje, notatki i ostrzeżenia o konfliktach |
| `EmployeesManager.jsx` | Lista pracowników i obsługa dodawania/edycji |
| `EmployeeFormModal.jsx` | Formularz pracownika i walidacja pól |
| `managerUtils.js` | Obliczenia statusów, czasu pracy, dni roboczych i nakładania dat |
| `mockData.js` | Dane testowe kierownika, trzech pracowników, odbić i czterech wniosków |
| `README.md` | Opis modułu i kontrakt integracyjny |

## Czego panel potrzebuje od reszty zespołu (kontrakt)

```jsx
<ManagerPanel
  user={{ id, name }} // zalogowany kierownik
  users={[{ id, name, email, login, pin, password, role, urlopDni }]}
  timeEntries={[{ userId, type, timestamp }]}
  leaveRequests={[{ id, userId, startDate, endDate, status, reason, managerNote }]}
  onChangeLeaveStatus={(requestId, status, managerNote) => { /* aktualizacja wniosku */ }}
  onSaveUser={(user) => { /* dodanie lub aktualizacja pracownika */ }}
  onLogout={() => { /* wylogowanie */ }}
/>
```

- `role`: `'pracownik'` albo `'kierownik'`; `urlopDni`: `21` albo `26`.
- `type` odbicia: `'START'` (wejście lub powrót z przerwy), `'PRZERWA'` (początek przerwy), `'STOP'` (koniec pracy). `timestamp` jest tekstem ISO.
- `status` wniosku: `'oczekuje'`, `'zaakceptowany'`, `'odrzucony'`, `'do_wyjasnienia'`; daty w formacie `RRRR-MM-DD`.
- `managerNote` zawiera notatkę kierownika; przy statusie „Do wyjaśnienia” jest wymagana.
- Przy edycji użytkownika pominięte pole `password` oznacza, że hasło ma pozostać bez zmian.
- **Panel nie zapisuje danych samodzielnie**: dane otrzymuje przez propsy, a zmiany przekazuje do nadrzędnej aplikacji przez callbacki. Zespół integrujący odpowiada za trwały zapis i autoryzację.

## Jak podejrzeć panel lokalnie

Tymczasowo wstaw do `src/App.jsx` poniższy kod. **Nie commituj tej zmiany** — `App.jsx` należy do osoby integrującej logowanie.

```jsx
import { useState } from 'react';
import ManagerPanel from './features/manager-panel/ManagerPanel';
import {
  mockManager,
  mockUsers,
  mockTimeEntries,
  mockLeaveRequests,
} from './features/manager-panel/mockData';

export default function App() {
  const [users, setUsers] = useState(mockUsers);
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [loggedIn, setLoggedIn] = useState(true);

  const saveUser = (user) => setUsers((prev) =>
    user.id != null
      ? prev.map((u) => u.id === user.id ? { ...u, ...user } : u)
      : [...prev, { ...user, id: Math.max(0, ...prev.map((u) => Number(u.id) || 0)) + 1 }]
  );

  const changeLeave = (id, status, managerNote) => setRequests((prev) =>
    prev.map((r) => r.id === id ? { ...r, status, managerNote } : r)
  );

  return loggedIn ? (
    <ManagerPanel
      user={mockManager}
      users={users}
      timeEntries={mockTimeEntries}
      leaveRequests={requests}
      onChangeLeaveStatus={changeLeave}
      onSaveUser={saveUser}
      onLogout={() => setLoggedIn(false)}
    />
  ) : (
    <button onClick={() => setLoggedIn(true)}>Zaloguj ponownie (demo)</button>
  );
}
```

W katalogu `apka_zarzadzanie_czasem_pracy` uruchom `npm install` (jeśli potrzeba), a potem `npm run dev`. Dane demonstracyjne działają tylko w pamięci: po odświeżeniu strony wrócą wartości początkowe. Po teście przywróć oryginalny `App.jsx`.
