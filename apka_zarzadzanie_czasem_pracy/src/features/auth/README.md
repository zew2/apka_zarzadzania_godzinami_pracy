# Domena Logowania i Główny Routing



Moduł odpowiada za globalne zarządzanie sesją użytkownika w oparciu o **Firebase Authentication** oraz główny routing aplikacji (wyświetlanie odpowiedniego panelu w zależności od stanu autoryzacji).



Obecnie, ze względu na brak podpiętej bazy danych (np. Firestore) oraz w oczekiwaniu na gotowy komponent `WelcomePage`, moduł zawiera **tymczasową zwrotnicę testową**. Pozwala ona na płynne przełączanie się między widokiem pracownika a kierownika po poprawnym zalogowaniu, zasilając komponenty odpowiednimi mockami stworzonymi przez zespół.



## Pliki



| Plik | Co robi |

| --- | --- |

| `firebase.js` | (Katalog główny `src/`) Inicjalizacja połączenia z projektem Firebase i eksport obiektu `auth`. |

| `context/AuthContext.jsx` | Serce logowania. React Context API, który nasłuchuje zmian sesji Firebase i udostępnia dane o zalogowanym użytkowniku całej aplikacji. |

| `features/auth/LoginModal.jsx` | Formularz logowania (email/hasło) wywołujący asynchroniczną akcję logowania prosto z Firebase. |

| `App.jsx` | (Katalog główny `src/`) Tymczasowy ruter. Sprawdza sesję, pyta o rolę do testów i podaje odpowiednie propsy (z `mockData.js`) do `EmployeePanel` lub `ManagerPanel`. |

| `main.jsx` | (Katalog główny `src/`) Punkt wejścia aplikacji, w którym całe `<App />` zostało owinięte w dostawcę stanu `<AuthProvider>`. |



## Czego moduł logowania udostępnia reszcie zespołu (Kontrakt)



Każdy komponent w aplikacji może mieć natychmiastowy dostęp do informacji o zalogowanym użytkowniku oraz akcji autoryzacyjnych. Wystarczy zaimportować autorski hook `useAuth`.
Obecnie do logowania używamy jako login: ```'test@test.pl'``` hasło: ```'123456'```. Przygotowane jako testy aplikacji.



### Przykład użycia w innych komponentach:



```jsx

import { useAuth } from '../../context/AuthContext';



export default function DowolnyKomponent() {

  const { currentUser, login, logout } = useAuth();



  if (!currentUser) {

    return <p>Zaloguj się, aby zobaczyć zawartość.</p>;

  }



  return (

    <div>

      <p>Twój email to: {currentUser.email}</p>

      <p>Twoje unikalne ID w Firebase to: {currentUser.uid}</p>

      <button onClick={logout}>Wyloguj mnie</button>

    </div>

  );

}

```



## Mechanizm tymczasowej integracji danych (App.jsx)



Ze względu na to, że Firebase domyślnie zwraca tylko podstawowe dane uwierzytelniające (email, uid), a panele wymagają rozszerzonych obiektów (id liczbowe, rola, wymiar urlopu), plik `App.jsx` pełni obecnie funkcję "przejściówki" (bridge):



1. **Brak sesji:** Wyświetla tymczasowy przycisk wywołujący `<LoginModal />`.

2. **Aktywna sesja:** Wyświetla menu wyboru roli (Pracownik / Kierownik).

3. **Po wyborze roli:** Łączy `currentUser.email` z obiektem `MOCK_USER` (z odpowiedniego pliku `mockData.js`), tworząc `activeUser` i przekazując go w dół wraz z listą wniosków i czasu pracy.



## Co trzeba będzie zmienić docelowo (Krok po podpięciu bazy)



Gdy backend (Firestore) zostanie przygotowany:

1. Usuniemy tymczasowy ekran wyboru roli z `App.jsx`.

2. Zamiast budować `activeUser` w oparciu o `mockData.js`, aplikacja będzie pobierać dokument użytkownika bezpośrednio z bazy danych na podstawie `currentUser.uid`.

3. Puste ekrany logowania zostaną zastąpione przez docelowy komponent `<WelcomePage />`.