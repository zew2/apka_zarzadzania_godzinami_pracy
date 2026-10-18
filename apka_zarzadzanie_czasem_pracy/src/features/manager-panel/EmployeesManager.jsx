import {useState} from 'react';
import Button from '../../components/ui/Button';
import EmployeeFormModal from './EmployeeFormModal';
export default function EmployeesManager({users,onSaveUser}){
 const [editing,setEditing]=useState(undefined),[message,setMessage]=useState('');
 return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Pracownicy</h2><Button onClick={()=>setEditing(null)}>Dodaj pracownika</Button></div>{message&&<p role="status" className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">{message}</p>}<div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">{users.map(u=><div key={u.id} className="p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3"><div><p className="font-semibold">{u.name}</p><p className="text-sm text-slate-500 break-all">{u.email} · {u.role} · {u.urlopDni} dni urlopu</p></div><Button variant="outline" onClick={()=>setEditing(u)}>Edytuj</Button></div>)}{!users.length&&<p className="p-5">Brak użytkowników.</p>}</div>{editing!==undefined&&<EmployeeFormModal employee={editing} users={users} onClose={()=>setEditing(undefined)} onSave={u=>{onSaveUser(u);setEditing(undefined);setMessage('Dane pracownika przekazano do zapisania.');}} />}</div>;
}
