import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';



export default function LoginModal({ onClose }) {
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await login(emailInput, passwordInput);
        } catch (err) {
            setError('Nie udało się zalogować. Sprawdź e-mail i hasło.');
        }
    };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Logowanie do systemu</h2>
            {error && <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Login, Email lub PIN" required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <input 
            type="password" placeholder="Hasło" required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setPasswordInput(e.target.value)}
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