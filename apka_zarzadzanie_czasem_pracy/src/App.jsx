import React from 'react';
import LoginModal from './features/auth/LoginModal';

export default function App() {
  const handleFakeLogin = (dane) => {
    alert(`Próba logowania!\nLogin: ${dane.login}\nHasło: ${dane.password}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10 flex flex-col items-center">
      <h1 className="mb-4 text-xl text-gray-500">Środowisko testowe - Osoba 1</h1>
      
      {/* Tu renderujesz swój komponent */}
      <LoginModal 
        onClose={() => alert('Kliknięto Zamknij / Anuluj')}
        onLogin={handleFakeLogin} 
      />
    </div>
  );
}