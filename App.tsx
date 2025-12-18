
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, Circle, AlertCircle, Phone, Info, Share2, 
  Cat, Trash2, Calendar, ClipboardList, ShieldAlert, 
  Plus, Camera, X, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { TASKS, HOSPITAL, OWNER_SECONDARY, MEDICATION_START_DATE, TOXIC_FOODS, TOXIC_PLANTS } from './constants';
import { Task, DailyLog, CompletedTask } from './types';

// Tab Options
enum Tab {
  Diary = 'Diary',
  Safety = 'Safety',
  Emergency = 'Emergency'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Diary);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Daily State
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [urineCount, setUrineCount] = useState<number>(0);
  const [stoolCount, setStoolCount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dateKey = selectedDate.toISOString().split('T')[0];
  const dateDisplay = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Medication Check
  const isMedicationDay = useMemo(() => {
    const start = new Date(MEDICATION_START_DATE);
    start.setHours(0,0,0,0);
    const current = new Date(selectedDate);
    current.setHours(0,0,0,0);
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays % 2 === 0;
  }, [selectedDate]);

  // Persistence Logic
  useEffect(() => {
    const saved = localStorage.getItem(`donki-diary-${dateKey}`);
    if (saved) {
      const data: DailyLog = JSON.parse(saved);
      setCompletedTasks(data.completedTasks || []);
      setUrineCount(data.urineCount || 0);
      setStoolCount(data.stoolCount || 0);
      setNotes(data.notes || '');
      setPhotos(data.photos || []);
    } else {
      // Reset for new date
      setCompletedTasks([]);
      setUrineCount(0);
      setStoolCount(0);
      setNotes('');
      setPhotos([]);
    }
  }, [dateKey]);

  useEffect(() => {
    const log: DailyLog = {
      date: dateKey,
      completedTasks,
      urineCount,
      stoolCount,
      notes,
      photos
    };
    localStorage.setItem(`donki-diary-${dateKey}`, JSON.stringify(log));
  }, [completedTasks, urineCount, stoolCount, notes, photos, dateKey]);

  const toggleTask = (id: string) => {
    const exists = completedTasks.find(t => t.id === id);
    if (exists) {
      setCompletedTasks(prev => prev.filter(t => t.id !== id));
    } else {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCompletedTasks(prev => [...prev, { id, completedAt: now }]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const shareStatus = () => {
    const isMedTaken = completedTasks.some(t => t.id === 'a-2');
    const status = `
🐾 Donki Diary (${dateDisplay})
------------------------------
✅ Completed: ${completedTasks.length} tasks
🚽 Urine: ${urineCount} 
💩 Stool: ${stoolCount}
💊 Meds: ${isMedicationDay ? (isMedTaken ? 'Taken ✅' : 'PENDING ⏳') : 'N/A'}
📸 Photos: ${photos.length} uploaded
📝 Notes: ${notes || 'Doing great!'}
------------------------------
See you tomorrow!
    `.trim();

    if (navigator.share) {
      navigator.share({ title: 'Donki Diary Update', text: status }).catch(console.error);
    } else {
      navigator.clipboard.writeText(status);
      alert('Diary update copied to clipboard!');
    }
  };

  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const renderDiary = () => (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Date Navigator */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Diary Entry</span>
          <span className="font-black text-gray-800">{dateDisplay}</span>
        </div>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Medication Reminder */}
      {isMedicationDay && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <AlertCircle className="text-orange-600 w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-orange-900 text-sm">Medication Day</p>
            <p className="text-xs text-orange-800">1/4 Prednicortone with Leonardo (Afternoon)</p>
          </div>
        </div>
      )}

      {/* Counters */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-[10px] text-gray-400 uppercase font-black mb-1">Urine</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setUrineCount(Math.max(0, urineCount - 1)); }}
              className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
            >-</button>
            <span className="text-3xl font-black text-gray-800 tabular-nums">{urineCount}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setUrineCount(urineCount + 1); }}
              className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold active:scale-95 transition-transform"
            >+</button>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-[10px] text-gray-400 uppercase font-black mb-1">Stool</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setStoolCount(Math.max(0, stoolCount - 1)); }}
              className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
            >-</button>
            <span className="text-3xl font-black text-gray-800 tabular-nums">{stoolCount}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setStoolCount(stoolCount + 1); }}
              className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 font-bold active:scale-95 transition-transform"
            >+</button>
          </div>
        </div>
      </div>

      {/* Task Categories */}
      {['Morning', 'Afternoon', 'Night'].map((cat) => (
        <div key={cat} className="space-y-3">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">{cat} Routine</h3>
          <div className="space-y-2">
            {TASKS.filter(t => t.category === cat).map(task => {
              const completion = completedTasks.find(c => c.id === task.id);
              const isDone = !!completion;
              if (task.id === 'a-2' && !isMedicationDay) return null;

              return (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isDone ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isDone ? 'bg-green-500 border-green-500' : 'border-gray-200'
                  }`}>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isDone ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {task.text}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">{task.subtext}</p>
                  </div>
                  {isDone && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-white px-2 py-1 rounded-lg border border-green-100">
                      <Clock className="w-3 h-3" />
                      {completion.completedAt}
                    </div>
                  )}
                  {!isDone && task.time && (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase">
                      {task.time}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Journaling Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Photos & Notes</h3>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
          {/* Photos Grid */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {photos.map((p, idx) => (
              <div key={idx} className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                <img src={p} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full backdrop-blur-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-all"
            >
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-bold">Add Photo</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload}
            />
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write a little about Donki's day..."
            className="w-full min-h-[120px] p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-700 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );

  const renderSafety = () => (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-50">
        <h3 className="text-red-600 font-black flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
          <ShieldAlert className="w-5 h-5" />
          Household Risks
        </h3>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">🏠</div>
            <div className="text-sm">
              <p className="font-bold text-gray-800">Balcony & Windows</p>
              <p className="text-gray-500">Keep tight shut. Donki can escape through small cracks.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">🗑️</div>
            <div className="text-sm">
              <p className="font-bold text-gray-800">Trash Management</p>
              <p className="text-gray-500">Always tie garbage bags. He will forage if left open.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">🍽️</div>
            <div className="text-sm">
              <p className="font-bold text-gray-800">Table Manners</p>
              <p className="text-gray-500">Clear all human food immediately. Donki is curious!</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
        <h3 className="text-orange-600 font-black flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
          <AlertCircle className="w-5 h-5" />
          No-Go Food List
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {TOXIC_FOODS.map(f => (
            <div key={f} className="p-3 bg-orange-50 text-orange-900 text-[11px] font-bold rounded-xl border border-orange-100">
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-50">
        <h3 className="text-green-600 font-black flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
          <Info className="w-5 h-5" />
          Toxic Flowers
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {TOXIC_PLANTS.map(p => (
            <div key={p} className={`p-3 text-[11px] font-bold rounded-xl border ${p.includes('Lily') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-800 border-green-100'}`}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-red-600 p-6 rounded-3xl text-white shadow-xl shadow-red-200/50">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          Critical Symptoms
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3 text-sm">
            <span className="shrink-0 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-bold">1</span>
            <span>Lethargy, unusual hiding, or refusal to move.</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="shrink-0 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-bold">2</span>
            <span>Repetitive vomiting or persistent dry heaving.</span>
          </li>
          <div className="flex gap-3 text-sm">
            <span className="shrink-0 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-bold">3</span>
            <span>No urination for 24 hours. (Check box carefully!)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Contacts</h3>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h4 className="font-black text-blue-600 text-lg">{HOSPITAL.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{HOSPITAL.description}</p>
            <a href={`tel:${HOSPITAL.phone}`} className="mt-4 w-full bg-blue-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Phone className="w-4 h-4" />
              {HOSPITAL.phone}
            </a>
          </div>
          <div className="pt-6 border-t border-gray-50">
            <h4 className="font-black text-gray-800">Yang Fan (Backup)</h4>
            <p className="text-sm text-gray-500 mt-1">Contact for major medical cost decisions.</p>
            <a href={`tel:${OWNER_SECONDARY.phone}`} className="mt-4 w-full border-2 border-gray-100 text-gray-700 p-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Phone className="w-4 h-4" />
              {OWNER_SECONDARY.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50/50 flex flex-col font-sans antialiased">
      {/* App Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Cat className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Donki Care</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5">Sitter Diary</p>
            </div>
          </div>
          <button 
            onClick={shareStatus}
            className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Nav */}
        <div className="flex gap-2 mt-6 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
          {[
            { id: Tab.Diary, icon: ClipboardList, label: 'Diary' },
            { id: Tab.Safety, icon: ShieldAlert, label: 'Safety' },
            { id: Tab.Emergency, icon: AlertCircle, label: 'Medical' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === btn.id ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <btn.icon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-6 py-8">
        {activeTab === Tab.Diary && renderDiary()}
        {activeTab === Tab.Safety && renderSafety()}
        {activeTab === Tab.Emergency && renderEmergency()}
      </main>

      {/* Persistent Footer Text */}
      <footer className="px-6 py-8 text-center text-gray-300">
        <div className="w-12 h-1 bg-gray-100 mx-auto rounded-full mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
          Donki 照顾指南 🐱<br/>
          吃好、拉好、尿好、安全
        </p>
      </footer>
    </div>
  );
};

export default App;
