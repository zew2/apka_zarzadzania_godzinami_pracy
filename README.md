# TimeTracker – czas pracy i urlopy

Aplikacja zastępuje papierową listę obecności i papierowe wnioski urlopowe.
Pracownik odbija się kodem PIN, składa wnioski urlopowe online, a kierownik widzi, kto jest w pracy, i akceptuje urlopy.

**Technologie:** React 19, Vite, Tailwind CSS 4

## Jak działa aplikacja

1. **Ekran główny (odbijanie się)** – działa np. na tablecie przy wejściu. Pracownik wpisuje swój 4-cyfrowy PIN i wybiera **Rozpoczęcie pracy**, **Przerwa** albo **Koniec pracy**. Aplikacja zapisuje godzinę.
2. **Logowanie** – przycisk na ekranie głównym. Po zalogowaniu aplikacja pokazuje panel pracownika albo kierownika, w zależności od roli.
3. **Panel pracownika** – wykorzystany i pozostały urlop, nowy wniosek urlopowy, statusy wniosków, ostatnie 7 dni pracy.
4. **Panel kierownika** – kto jest dziś w pracy, na przerwie albo nieobecny; akceptacja wniosków (**Akceptuj / Do wyjaśnienia / Odrzuć**); dodawanie i edycja pracowników.

## Podział pracy

| Osoba | Część | Folder | Co robi |
|---|---|---|---|
| **Marcin Górecki** (zew2) | Logowanie + łączenie całości | `features/auth`, `App.jsx`, `components/ui` | Okno logowania, przełączanie widoków po roli, trzymanie wspólnych danych, przycisk `Button` dla wszystkich |
| **Bartosz Kobiernik** (Bartosz56026) | Rejestracja czasu pracy | `features/time-tracking` | Ekran główny: pole na PIN + przyciski Start / Przerwa / Koniec pracy, zapis odbić |
| **Maciej Krok** (mcjkrok) | Panel pracownika | `features/employee-panel` | Licznik urlopu, formularz wniosku, lista wniosków ze statusem, ostatnie 7 dni pracy |
| **Jakub Kulawiak** (Jakub-Kulawiak1) | Panel kierownika | `features/manager-panel` | Obecność dziś, akceptowanie wniosków, zarządzanie pracownikami |

Każdy pracuje tylko w swoim folderze. Szczegóły modułu są w `README.md` w jego folderze.

### Stan prac

| Część | Stan |
|---|---|
| Logowanie (`auth`) | Okno logowania gotowe, bez prawdziwego sprawdzania hasła |
| Łączenie w `App.jsx` | Do zrobienia |
| Rejestracja czasu (`time-tracking`) | Do zrobienia |
| Panel pracownika (`employee-panel`) | Gotowy, działa na danych testowych |
| Panel kierownika (`manager-panel`) | Gotowy, działa na danych testowych |

## Wspólne dane

Wszystkie moduły korzystają z tych samych obiektów. Trzyma je `App.jsx` i przekazuje do paneli przez propsy.

**Użytkownik**
```js
{ id, name, email, login, pin, password, role, urlopDni }
// role: 'pracownik' | 'kierownik', urlopDni: 21 | 26, pin: 4 cyfry
```

**Odbicie (rejestracja czasu)**
```js
{ userId, type, timestamp }
// type: 'START' (wejście lub powrót z przerwy) | 'PRZERWA' | 'STOP'
// timestamp: tekst ISO, np. new Date().toISOString()
```

**Wniosek urlopowy**
```js
{ id, userId, startDate, endDate, status, reason, managerNote }
// daty: 'RRRR-MM-DD'
// status: 'oczekuje' | 'zaakceptowany' | 'odrzucony' | 'do_wyjasnienia'
```

Dni urlopu liczymy jako dni robocze (pon–pt).

## Struktura projektu

```
apka_zarzadzanie_czasem_pracy/src/
├── App.jsx                  # łączy wszystko (Marcin)
├── components/ui/Button.jsx # wspólny przycisk
└── features/
    ├── auth/                # logowanie (Marcin)
    ├── time-tracking/       # ekran główny z PIN-em (Bartosz)
    ├── employee-panel/      # panel pracownika (Maciej)
    └── manager-panel/       # panel kierownika (Jakub)
```

## Uruchomienie

```bash
cd apka_zarzadzanie_czasem_pracy
npm install
npm run dev
```

Aplikacja otworzy się pod adresem z terminala (zwykle http://localhost:5173).
Przed wrzuceniem zmian warto odpalić `npm run lint` i `npm run build`.

## Zasady pracy w repo

- Zmieniasz tylko pliki w swoim folderze. `App.jsx` i `components/ui` zmienia Marcin.
- Przed pushem: `git pull --rebase`, żeby nie nadpisać cudzych zmian.
- Commity po polsku, krótko, co zostało zrobione.

## Autorzy

- Marcin Górecki (zew2)
- Maciej Krok (mcjkrok)
- Jakub Kulawiak (Jakub-Kulawiak1)
- Bartosz Kobiernik (Bartosz56026)
