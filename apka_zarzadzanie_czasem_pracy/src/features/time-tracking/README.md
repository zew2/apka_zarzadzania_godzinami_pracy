# Rejestracja Czasu Pracy – TimeTracker

Moduł umożliwia pracownikom rejestrowanie czasu pracy za pomocą 4-cyfrowego kodu PIN, bez konieczności logowania się do pełnego panelu użytkownika.

## Funkcjonalności

- **Pole PIN** — umożliwia wpisanie 4-cyfrowego kodu pracownika. Akceptowane są wyłącznie cyfry.
- **Rozpoczęcie** — przycisk rejestrujący rozpoczęcie pracy lub powrót z przerwy (`START`).
- **Przerwa** — przycisk rozpoczynający przerwę (`PRZERWA`).
- **Zakończenie** — przycisk rejestrujący zakończenie pracy (`STOP`).
- **Walidacja PIN-u** — sprawdzenie, czy użytkownik wprowadził dokładnie 4 cyfry.
- **Komunikaty** — wyświetlanie informacji o błędach i wyniku próby rejestracji.
- **Logowanie** — przycisk umożliwiający przejście do pełnego panelu logowania za pośrednictwem funkcji przekazanej przez aplikację.

Interfejs jest responsywny i został przygotowany w React z wykorzystaniem Tailwind CSS.

## Pliki

| Plik | Co robi |
|---|---|
| `WelcomeKiosk.jsx` | Główny ekran rejestracji czasu pracy, pole PIN, przyciski i komunikaty |
| `KioskPreview.jsx` | Komponent umożliwiający testowanie wyglądu ekranu bez integracji z backendem |
| `kiosk-preview-main.jsx` | Punkt wejścia React dla podglądu kiosku |
| `kiosk-preview.html` | Osobna strona HTML służąca do uruchomienia podglądu |
| `README.md` | Dokumentacja modułu i kontrakt integracyjny |

Pliki JSX znajdują się w `src/features/time-tracking/`, natomiast `kiosk-preview.html` znajduje się w głównym katalogu aplikacji.

## Czego moduł potrzebuje od reszty zespołu (kontrakt)

Komponent `WelcomeKiosk` przyjmuje dwie funkcje przekazywane przez nadrzędną aplikację:

```jsx
<WelcomeKiosk
  onQuickAction={(pin, actionType) => {
    // Weryfikacja PIN-u i rejestracja akcji
    // w systemie obsługi czasu pracy
  }}
  onOpenLogin={() => {
    // Otwarcie panelu logowania
  }}
/>
```

**Parametry funkcji `onQuickAction`:**

- `pin` — 4-cyfrowy kod pracownika przekazywany jako tekst.
- `actionType` — rodzaj wykonywanej akcji: `START`, `PRZERWA` lub `STOP`.

W obecnej implementacji komponent oczekuje synchronicznego wyniku funkcji `onQuickAction`:

- `true` — akcja została zarejestrowana pomyślnie.
- `false` — rejestracja nie powiodła się.

Komponent nie komunikuje się samodzielnie z bazą danych. Obsługa weryfikacji PIN-u, zapisu czasu pracy i integracji z backendem należy do nadrzędnej aplikacji.

**Uwaga:** W przypadku asynchronicznego zapisu do bazy danych konieczne będzie dostosowanie obsługi wyniku `onQuickAction`, aby poprawnie oczekiwała na odpowiedź.

## Jak podejrzeć moduł lokalnie

Podgląd został przygotowany niezależnie od głównego systemu logowania, dzięki czemu można sprawdzić wygląd interfejsu bez modyfikowania `App.jsx`.

1. Otwórz terminal w katalogu `apka_zarzadzanie_czasem_pracy`.
2. Uruchom serwer deweloperski:

```bash
npm run dev
```

3. Otwórz w przeglądarce:

```text
http://localhost:5173/kiosk-preview.html
```

Jeżeli port 5173 jest zajęty, Vite może uruchomić aplikację na innym porcie, np. 5174.

Podgląd pozwala przetestować pole PIN, walidację oraz wygląd przycisków.

W trybie podglądu funkcja `onQuickAction` zwraca `false`, ponieważ nie została jeszcze podłączona obsługa zapisu danych.

## Status realizacji

**Zrealizowano:**
- Responsywny interfejs rejestracji czasu pracy.
- Pole do wprowadzania 4-cyfrowego PIN-u.
- Trzy przyciski rejestracji czasu pracy.
- Podstawową walidację i komunikaty.
- Osobny podgląd do testowania interfejsu.

**Do integracji przez zespół:**
- Weryfikacja PIN-u pracownika.
- Połączenie z bazą danych.
- Zapisywanie zdarzeń rozpoczęcia pracy, przerwy i zakończenia pracy.
- Podłączenie ekranu do głównej aplikacji i systemu logowania.

Moduł stanowi przygotowaną warstwę interfejsu użytkownika, gotową do dalszej integracji z systemem.