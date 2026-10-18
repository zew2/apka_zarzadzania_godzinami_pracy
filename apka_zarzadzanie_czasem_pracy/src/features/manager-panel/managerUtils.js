export const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const formatDate = (s) => s ? s.split('-').reverse().join('.') : '—';
export const formatTime = (d) => d ? d.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'}) : '—';
export const formatDuration = (ms) => { const m=Math.max(0,Math.floor(ms/60000)); return `${Math.floor(m/60)} godz. ${String(m%60).padStart(2,'0')} min`; };
export function countWorkingDays(start,end) {
  if(!start || !end || end<start) return 0;
  let count=0; const d=new Date(`${start}T12:00:00`), last=new Date(`${end}T12:00:00`);
  for(;d<=last;d.setDate(d.getDate()+1)) if(d.getDay()!==0 && d.getDay()!==6) count++;
  return count;
}
export const rangesOverlap=(a,b,c,d)=>a<=d && c<=b;
export function getOverlappingNames(request,requests,users) {
  return [...new Set(requests.filter(r=>r.id!==request.id && r.userId!==request.userId && ['oczekuje','zaakceptowany','do_wyjasnienia'].includes(r.status) && rangesOverlap(request.startDate,request.endDate,r.startDate,r.endDate)).map(r=>users.find(u=>u.id===r.userId)?.name).filter(Boolean))];
}
export function getAttendance(user,entries,requests,now=new Date()) {
  const today=dateKey(now);
  const events=entries.filter(e=>e.userId===user.id && dateKey(new Date(e.timestamp))===today && !Number.isNaN(new Date(e.timestamp).getTime())).sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
  let state='off', since=null, workMs=0, firstStart=null;
  for(const e of events){ const t=new Date(e.timestamp); if(t>now)continue;
    if(state==='work' && since) workMs+=Math.max(0,t-since);
    if(e.type==='START'){ if(state!=='work'){state='work';since=t;} if(!firstStart)firstStart=t; }
    else if(e.type==='PRZERWA' && state==='work'){state='break';since=t;}
    else if(e.type==='STOP'){state='off';since=null;}
  }
  if(state==='work' && since)workMs+=Math.max(0,now-since);
  const onLeave=requests.some(r=>r.userId===user.id && r.status==='zaakceptowany' && r.startDate<=today && r.endDate>=today);
  const status=state==='work'?'W pracy':state==='break'?'Na przerwie':events.length?'Zakończył':onLeave?'Na urlopie':'Nieobecny';
  return {status,firstStart,workMs};
}
