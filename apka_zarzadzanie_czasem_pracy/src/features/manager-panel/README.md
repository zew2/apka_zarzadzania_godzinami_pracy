# Panel kierownika

Moduł React z trzema zakładkami: obecność pracowników dzisiaj (status i czas pracy), wnioski urlopowe (decyzje, wyjaśnienia i konflikty terminów) oraz zarządzanie pracownikami (dodawanie i edycja z walidacją unikalności).

```jsx
<ManagerPanel
  user={{id, name}}
  users={[{id,name,email,login,pin,password,role,urlopDni}]}
  timeEntries={[{userId,type,timestamp}]}
  leaveRequests={[{id,userId,startDate,endDate,status,reason,managerNote}]}
  onChangeLeaveStatus={(requestId,status,managerNote)=>{}}
  onSaveUser={(user)=>{}}
  onLogout={()=>{}}
/>
```

Wszystkie dane pochodzą z propsów. Callbacki przekazują zmiany do rodzica; panel nie zapisuje ich sam. Przy edycji brak pola `password` w przekazanym obiekcie oznacza pozostawienie hasła bez zmian. Dni robocze są liczone pon.–pt. bez wykluczania świąt. `mockData.js` zawiera przykładowe dane. Przykład uruchomienia znajduje się w osobnym pliku `App.preview.jsx.txt` (nie jest częścią modułu).
