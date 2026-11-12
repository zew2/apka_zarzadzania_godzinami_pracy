
import React, { useState } from 'react';
import Button from '../../components/ui/Button';

export default function WelcomeKiosk({ onQuickAction, onOpenLogin }) {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState(null);

  const handleAction = (actionType) => {
    if (!/^\d{4}$/.test(pin)) {
      setMessage({
        type: 'error',
        text: 'Wprowadź poprawny 4-cyfrowy PIN'
      });
      return;
    }

    if (typeof onQuickAction !== 'function') {
      setMessage({
        type: 'error',
        text: 'Rejestracja czasu nie jest jeszcze podłączona'
      });
      return;
    }

    const success = onQuickAction(pin, actionType);

    if (success) {
      setMessage({
        type: 'success',
        text: `Zapisano: ${actionType}`
      });
      setPin('');
    } else {
      setMessage({
        type: 'error',
        text: 'Nie udało się zarejestrować akcji'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[52vh] min-h-[350px] bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 rounded-b-[65px]" />
      <header className="relative z-10 flex items-center justify-between px-8 md:px-12 py-8 text-white">

        <div className="flex items-center gap-3">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>

          <span className="text-2xl font-bold tracking-tight">
            TimeTracker
          </span>
        </div>
      </header>

      <main className="relative flex justify-center px-4 pt-16 md:pt-20">

        <div className="w-full max-w-[570px] bg-white rounded-2xl shadow-xl px-6 md:px-8 py-9">

          <h1 className="text-center text-3xl font-bold text-slate-900 mb-2">
            Rejestracja Czasu Pracy
          </h1>

          <p className="text-center text-slate-500 mb-8">
            Wprowadź swój kod i wybierz odpowiednią akcję
          </p>

          {/* Pole PIN */}
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            placeholder="Twój kod (np. 1234)"
            aria-label="Czterocyfrowy kod PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ''));
              setMessage(null);
            }}
            className="w-full h-[76px] text-center text-2xl md:text-3xl border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition mb-7 placeholder:text-slate-400"
          />

          {/* Przyciski rejestracji */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="[&_button]:w-full [&_button]:min-h-[60px] [&_button]:bg-emerald-600 [&_button:hover]:bg-emerald-700">
              <Button
                variant="success"
                onClick={() => handleAction('START')}
              >
                <span>▷</span>
                Rozpoczęcie
              </Button>
            </div>

            <div className="[&_button]:w-full [&_button]:min-h-[60px] [&_button]:bg-amber-500 [&_button:hover]:bg-amber-600 [&_button]:text-white">
              <Button
                variant="outline"
                onClick={() => handleAction('PRZERWA')}
              >
                <span>Ⅱ</span>
                Przerwa
              </Button>
            </div>

            <div className="[&_button]:w-full [&_button]:min-h-[60px] [&_button]:bg-red-600 [&_button:hover]:bg-red-700">
              <Button
                variant="danger"
                onClick={() => handleAction('STOP')}
              >
                <span>□</span>
                Zakończenie
              </Button>
            </div>

          </div>

          {/* Komunikaty */}
          {message && (
            <p
              role="status"
              className={`text-center mt-6 font-medium ${
                message.type === 'error'
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }`}
            >
              {message.text}
            </p>
          )}

        </div>
      </main>
    </div>
  );
}
