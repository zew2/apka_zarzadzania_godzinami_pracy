import React, { useState } from 'react';
import Button from '../../components/ui/Button';

export default function LoginModal({ onClose, onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tutaj Osoba 1 dopisze w przyszłości integrację z Firebase
    onLogin({ login, password }); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Login, Email lub PIN" required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setLogin(e.target.value)}
          />
          <input 
            type="password" placeholder="Hasło" required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Anuluj</Button>
            <Button type="submit" variant="primary">Zaloguj</Button>
          </div>
        </form>
      </div>
    </div>
  );
}