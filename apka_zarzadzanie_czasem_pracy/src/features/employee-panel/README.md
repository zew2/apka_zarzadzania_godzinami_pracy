## Panel pracownika

Po zalogowaniu pracownik widzi:
- ile dni urlopu wykorzystał i ile mu zostało,
- formularz wniosku urlopowego,
- swoje wnioski ze statusem (i notatką kierownika),
- ostatnie 7 dni pracy.

Dni urlopu = dni robocze (pon–pt), tak jak w panelu kierownika.

### Jak użyć
```jsx
<EmployeePanel
  user={{ id, name, urlopDni }}
  timeEntries={[{ userId, type, timestamp }]}
  leaveRequests={[{ id, userId, startDate, endDate, status, reason, managerNote }]}
  onSubmitLeave={({ startDate, endDate, reason }) => ...}
  onLogout={() => ...}
/>
```

Do testów są dane w `mockData.js` (`MOCK_USER`, `MOCK_TIME_ENTRIES`, `MOCK_LEAVE_REQUESTS`).
