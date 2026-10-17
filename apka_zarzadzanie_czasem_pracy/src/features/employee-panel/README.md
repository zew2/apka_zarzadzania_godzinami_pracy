## Domena Pracownika

Moduł pokazuje zalogowanemu pracownikowi:
- ile dni urlopu wykorzystał, ile mu zostało i ile czeka na decyzję,
- formularz wniosku urlopowego (sprawdza daty, nakładanie się wniosków i liczbę dostępnych dni),
- swoje wnioski ze statusem: Oczekuje / Zaakceptowany / Odrzucony / Do wyjaśnienia (+ notatka kierownika),
- ostatnie 7 dni pracy: wejście, wyjście, przerwy, przepracowany czas, brakujące odbicie wyjścia.

Dni urlopu liczone są jako dni robocze (pon–pt bez świąt ustawowych w Polsce).

## Pliki
| Plik | Co robi |
|---|---|
| `EmployeePanel.jsx` | Cały panel — składa poniższe części w jeden ekran |
| `LeaveSummary.jsx` | Licznik dni urlopu |
| `LeaveRequestForm.jsx` | Formularz wniosku |
| `LeaveHistory.jsx` | Lista wniosków ze statusami |
| `WorkWeek.jsx` | Ostatnie 7 dni pracy |
| `employeeUtils.js` | Obliczenia: dni robocze, święta, czas pracy, sprawdzanie wniosków |
| `mockData.js` | Dane testowe — tylko do pracy, zanim reszta zespołu podepnie prawdziwe dane |

## Czego panel potrzebuje od reszty zespołu (kontrakt)
```js
<EmployeePanel
  user={{ id, name, urlopDni }}                     // od osoby od logowania
  timeEntries={[{ userId, type, timestamp }]}       // od osoby od rejestracji czasu
  leaveRequests={[{ id, userId, startDate, endDate, status, reason, managerNote }]}
  onSubmitLeave={({ startDate, endDate, reason }) => ...}  // zapis nowego wniosku
  onLogout={() => ...}
/>
```
- `type` odbicia: `'START'` (wejście lub powrót z przerwy), `'PRZERWA'`, `'STOP'`; `timestamp` jako tekst ISO.
- `status` wniosku: `'oczekuje'`, `'zaakceptowany'`, `'odrzucony'`, `'do_wyjasnienia'`; daty jako `'RRRR-MM-DD'`.
- `managerNote` uzupełnia kierownik, gdy daje „Do wyjaśnienia”.

## Jak podejrzeć panel lokalnie
Wstaw tymczasowo do `src/App.jsx` (nie commituj tej zmiany — `App.jsx` należy do osoby od logowania):
```jsx
import EmployeePanel from './features/employee-panel/EmployeePanel';
import { MOCK_USER, MOCK_TIME_ENTRIES, MOCK_LEAVE_REQUESTS } from './features/employee-panel/mockData';

export default function App() {
  return (
    <EmployeePanel
      user={MOCK_USER}
      timeEntries={MOCK_TIME_ENTRIES}
      leaveRequests={MOCK_LEAVE_REQUESTS}
      onSubmitLeave={(w) => console.log('nowy wniosek', w)}
      onLogout={() => {}}
    />
  );
}
```
