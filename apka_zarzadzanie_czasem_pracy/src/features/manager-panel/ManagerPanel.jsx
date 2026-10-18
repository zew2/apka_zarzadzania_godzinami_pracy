import {useEffect,useState} from 'react';
import AttendanceToday from './AttendanceToday';
import LeaveApprovals from './LeaveApprovals';
import EmployeesManager from './EmployeesManager';
const tabs=[['attendance','Obecność dziś'],['leave','Wnioski urlopowe'],['employees','Pracownicy']];
export default function ManagerPanel({user,users=[],timeEntries=[],leaveRequests=[],onChangeLeaveStatus,onSaveUser,onLogout}){
 const [tab,setTab]=useState('attendance'),[now,setNow]=useState(()=>new Date());
 useEffect(()=>{const id=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(id);},[]);
 return <div className="min-h-screen bg-slate-50 text-slate-900"><header className="bg-indigo-600 text-white"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-3"><div><p className="text-indigo-200 text-sm">Panel kierownika</p><h1 className="text-xl sm:text-2xl font-bold">{user?.name||'Kierownik'}</h1></div><button type="button" onClick={onLogout} className="border border-white/30 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium">Wyloguj</button></div></header><main className="max-w-6xl mx-auto px-4 sm:px-6 py-6"><nav aria-label="Zakładki panelu" className="flex gap-2 overflow-x-auto pb-2 mb-5">{tabs.map(([id,label])=><button type="button" key={id} onClick={()=>setTab(id)} aria-current={tab===id?'page':undefined} className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium text-sm ${tab===id?'bg-indigo-600 text-white':'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}>{label}</button>)}</nav>{tab==='attendance'?<AttendanceToday users={users} timeEntries={timeEntries} leaveRequests={leaveRequests} now={now}/>:tab==='leave'?<LeaveApprovals users={users} leaveRequests={leaveRequests} onChangeLeaveStatus={onChangeLeaveStatus}/>:<EmployeesManager users={users} onSaveUser={onSaveUser}/>}</main></div>;
}
