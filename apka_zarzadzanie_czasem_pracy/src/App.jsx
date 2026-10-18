import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { 
  MOCK_USER as EMPLOYEE_USER, 
  MOCK_TIME_ENTRIES as EMPLOYEE_ENTRIES, 
  MOCK_LEAVE_REQUESTS as EMPLOYEE_REQUESTS 
} from './features/employee-panel/mockData';

import { 
  mockManager as MANAGER_USER, 
  mockLeaveRequests as MANAGER_REQUESTS,
  mockUsers as MANAGER_USERS,
  mockTimeEntries as MANAGER_ENTRIES
} from './features/manager-panel/mockData';

import LoginModal from './features/auth/LoginModal';
import EmployeePanel from './features/employee-panel/EmployeePanel';
import ManagerPanel from './features/manager-panel/ManagerPanel';


export default function App() {
  const { currentUser, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogout = () => {
      setSelectedRole(null)

      logout();
  }

  if (!currentUser) {

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <button 
          onClick={() => setShowLoginModal(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700"
        >
          Logowanie
        </button>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );

  }

  

  if (currentUser && !selectedRole) {
      return (
          <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
              <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-2">Witaj, {currentUser.email}!</h2>
                  <p className="text-gray-500 mb-8">Jako kto chcesz dzisiaj testować aplikację?</p>
                  <div className="flex flex-col gap-4">
                      <button
                          onClick={() => setSelectedRole('pracownik')}
                          className="p-4 border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition"
                       >
                          Testuj jako Pracownik
                       </button>
                       <button
                          onClick={() => setSelectedRole('kierownik')}
                          className="p-4 border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition"
                       >
                          Testuj jako kierownik
                       </button>
                  </div>
                  
                  <button onClick={handleLogout} className="mt-8 text-sm text-red-500 hover:underline">
                      Wyloguj całkowicie
                  </button>
              </div>
          </div>
      )
  }

  const sourceMockUser = selectedRole === "pracownik" ? EMPLOYEE_USER : MANAGER_USER;

  const activeUser = {
    ...currentUser,
    id: sourceMockUser.id, 
    name: sourceMockUser.name,
    role: selectedRole,
    urlopDni: sourceMockUser.urlopDni || 26
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow mb-4 flex justify-between items-center">
        <span>Tryb: <strong>{activeUser.role}</strong></span>
        <div className="flex gap-4">
          <button onClick={() => setSelectedRole(null)}>Zmień widok</button>
          <button onClick={handleLogout} className="text-red-500 font-bold">Wyloguj</button>
        </div>
      </div>

      {selectedRole === 'pracownik' && (
        <EmployeePanel 
          user={activeUser} 
          timeEntries={EMPLOYEE_ENTRIES} 
          leaveRequests={EMPLOYEE_REQUESTS} 
          onLogout={handleLogout}
        /> 
      )}

      {selectedRole === 'kierownik' && (
        <ManagerPanel 
          user={activeUser}
          leaveRequests={MANAGER_REQUESTS}
          users={MANAGER_USERS} 
          timeEntries={MANAGER_ENTRIES}
          onLogout={handleLogout}
          onChangeLeaveStatus={(id, status, note) => console.log('Zmiana wniosku:', id, status, note)}
          onSaveUser={(u) => console.log('Zapis użytkownika:', u)}
        /> 
      )}

    </div>
  );
}