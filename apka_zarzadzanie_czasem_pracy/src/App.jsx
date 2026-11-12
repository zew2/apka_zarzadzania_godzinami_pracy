import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { collection, onSnapshot, addDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import LoginModal from './features/auth/LoginModal';
import EmployeePanel from './features/employee-panel/EmployeePanel';
import ManagerPanel from './features/manager-panel/ManagerPanel';
import WelcomeKiosk from './features/time-tracking/WelcomeKiosk';

export default function App() {
    const { currentUser, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [users, setUsers] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [timeEntries, setTimeEntries] = useState([]);

    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map(doc => doc.data()));
        });
        const unsubRequests = onSnapshot(collection(db, "leaveRequests"), (snapshot) => {
            setLeaveRequests(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
        const unsubEntries = onSnapshot(collection(db, "timeEntries"), (snapshot) => {
            setTimeEntries(snapshot.docs.map(doc => ({ ...doc.data(), firebaseId: doc.id })));
        });

        return () => {
            unsubUsers();
            unsubRequests();
            unsubEntries();
        };
    }, []);

    const handleQuickAction = async (pin, actionType) => {
        const user = users.find(u => String(u.pin) === String(pin));
        
        if (!user) {
            alert("Nie znaleziono pracownika z takim PIN-em!");
            return false;
        }

        try {
            await addDoc(collection(db, "timeEntries"), {
                userId: user.id,
                type: actionType,
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Błąd zapisu czasu pracy:", error);
            return false;
        }
    };

    const handleSaveUser = async (userToSave) => {
        try {
            let userId = userToSave.id ? String(userToSave.id) : null;
            if (!userId && userToSave.password) {
                const userCredential = await createUserWithEmailAndPassword(
                    secondaryAuth, 
                    userToSave.email, 
                    userToSave.password
                );
                userId = userCredential.user.uid;
            } else if (!userId) {
                userId = String(Date.now());
            }

            const userProfile = { ...userToSave, id: userId };
            delete userProfile.password;

            await setDoc(doc(db, "users", userId), userProfile, { merge: true });
            alert("Sukces! Konto pracownika zostało zapisane.");
        } catch (error) {
            console.error("Błąd podczas tworzenia pracownika:", error);
            alert("Błąd: " + error.message);
        }
    };

    const handleSubmitLeave = async (newRequest) => {
        try {
            const completeRequest = {
                ...newRequest,
                userId: String(activeUser.id),
                status: 'oczekuje',
                createdAt: new Date().toISOString()
            };
            await addDoc(collection(db, "leaveRequests"), completeRequest);
            alert("Wniosek został wysłany!");
        } catch (error) {
            console.error("Błąd wysyłania wniosku:", error);
        }
    };

    const handleChangeLeaveStatus = async (requestId, status, managerNote) => {
        try {
            const requestRef = doc(db, "leaveRequests", String(requestId));
            await updateDoc(requestRef, {
                status: status,
                managerNote: managerNote || ""
            });
        } catch (error) {
            console.error("Błąd aktualizacji statusu wniosku:", error);
        }
    };

    if (!currentUser) {
        return (
            <div className="relative min-h-screen bg-slate-100">
                <div className="absolute top-4 right-4 z-50">
                    <button 
                        onClick={() => setShowLoginModal(true)}
                        className="px-6 py-2 bg-indigo-600/90 hover:bg-indigo-700 text-white rounded-lg font-medium shadow backdrop-blur-sm transition"
                    >
                        Zaloguj do Panelu
                    </button>
                </div>

                <WelcomeKiosk 
                    onQuickAction={handleQuickAction}
                    onOpenLogin={() => setShowLoginModal(true)}
                />

                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            </div>
        );
    }

    const dbUser = users.find(u => u.email === currentUser.email);

    if (!dbUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-lg font-medium text-slate-500 animate-pulse">
                    Wczytywanie profilu...
                </p>
            </div>
        );
    }

    const activeUser = { ...currentUser, ...dbUser };

    if (activeUser.role === 'kierownik') {
        return (
            <ManagerPanel 
                user={activeUser}
                users={users} 
                timeEntries={timeEntries} 
                leaveRequests={leaveRequests}
                onLogout={logout}
                onChangeLeaveStatus={handleChangeLeaveStatus}
                onSaveUser={handleSaveUser}
            /> 
        );
    }

    return (
        <EmployeePanel 
            user={activeUser} 
            timeEntries={timeEntries}
            leaveRequests={leaveRequests} 
            onLogout={logout}
            onSubmitLeave={handleSubmitLeave}
        /> 
    );
}