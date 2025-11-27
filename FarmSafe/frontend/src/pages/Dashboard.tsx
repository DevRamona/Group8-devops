import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StatCard: React.FC<{ label: string; value: string; sub: string; pct: number; color: string }>
  = ({ label, value, sub, pct, color }) => (
  <div className="bg-white rounded-xl shadow-card p-4 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm text-gray-500">{sub}</span>
      </div>
    </div>
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 36 36" className="w-12 h-12">
        <path className="text-gray-200" stroke="currentColor" strokeWidth="4" fill="none"
              d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" />
        <path className={color} strokeWidth="4" strokeLinecap="round" fill="none"
              d={`M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32`} style={{ strokeDasharray: `${pct},100` }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{pct}%</span>
    </div>
  </div>
);

const WeatherTile: React.FC<{ day: string; temp: string; note: string }>
  = ({ day, temp, note }) => (
  <div className="bg-white rounded-xl shadow-card p-4 text-center">
    <p className="text-gray-500 text-sm mb-2">{day}</p>
    <p className="text-3xl font-bold">{temp}</p>
    <p className="text-gray-500 text-sm">{note}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#f3f7ed]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#eef6df] border-b border-[#e3edcf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button className="md:hidden p-2 rounded-md bg-white shadow" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div className="font-extrabold text-xl tracking-tight">FarmSafe</div>
          <div className="flex-1" />
          <input className="hidden md:block w-1/2 h-10 rounded-full px-5 bg-white border border-[#e3edcf] shadow-sm focus:outline-none"
                 placeholder="Search any content" />
          <div className="ml-3 w-8 h-8 rounded-full bg-emerald-600" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className={`${open ? 'block' : 'hidden'} md:block bg-[#1f1f1f] text-white rounded-2xl p-4 md:p-5 h-max`}> 
          <div className="font-bold text-lg mb-4">agri<span className="text-emerald-400">🌿</span>culture</div>
          <nav className="space-y-1">
            {['Dashboard','Analytics','Fields','Harvesting','Finances','Weather','Settings'].map((item,i)=> (
              <a key={item} className={`block px-3 py-2 rounded-lg ${i===0? 'bg-[#dff0a6] text-black' : 'hover:bg-white/10'}`} href="#">{item}</a>
            ))}
          </nav>
          <button onClick={logout} className="mt-8 text-left text-sm opacity-80 flex items-center gap-2 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m8.25 12H7.5A2.25 2.25 0 015.25 18.75V9.75A2.25 2.25 0 017.5 7.5h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25z"/></svg>
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main>
          {/* Summary cards and weather header */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <section>
              <h3 className="text-gray-700 font-semibold mb-3">Summary</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <StatCard label="Wheat" value="125" sub="Tons" pct={12} color="text-emerald-500" />
                <StatCard label="Rice" value="980" sub="Tons" pct={33} color="text-lime-500" />
              </div>

              <h3 className="text-gray-700 font-semibold mb-3">Manage your farm</h3>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <img src="/pictures/farmer%208.jpg" alt="field" className="w-full h-56 object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop';}} />
              </div>

              <h3 className="text-gray-700 font-semibold mt-6 mb-3">Predictive analysis</h3>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {['January \u201922','February \u201922','March \u201922'].map((m)=> (
                  <div key={m} className="bg-white rounded-xl shadow-card p-4">
                    <p className="text-gray-600 mb-3">{m}</p>
                    {[
                      {k:'Wheat',v:59, c:'bg-amber-500'},
                      {k:'Rice',v:81, c:'bg-emerald-500'},
                      {k:'Maize',v:13, c:'bg-lime-500'}
                    ].map(row => (
                      <div key={row.k} className="mb-3">
                        <div className="flex justify-between text-sm text-gray-700"><span>{row.k}</span><span>{row.v}%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1"><div className={`h-2 ${row.c} rounded-full`} style={{ width: `${row.v}%` }} /></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            {/* Right column */}
            <aside className="space-y-4">
              <div className="bg-white rounded-xl shadow-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700">Weather forecast</h4>
                  <a className="text-emerald-600 text-sm" href="#">open app</a>
                </div>
                <div className="bg-[#eaf7e8] rounded-lg p-4 flex items-center gap-4">
                  <div className="text-4xl">🌤️</div>
                  <div>
                    <div className="text-2xl font-bold">37° / 23°</div>
                    <div className="text-sm text-gray-600">Rainy • Cloudy</div>
                  </div>
                  <div className="ml-auto text-3xl">🌡️</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <WeatherTile day="25 June" temp="29°" note="Thunderstorms" />
                <WeatherTile day="26 June" temp="32°" note="Rainy cloudy" />
                <WeatherTile day="27 June" temp="39°" note="Semicloudy" />
                <WeatherTile day="28 June" temp="42°" note="Sunny • Humidity" />
              </div>

              <div className="bg-white rounded-xl shadow-card p-4">
                <h4 className="font-semibold text-gray-700 mb-4">Harvesting Cost</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Wheat</span><span>$76K</span></div>
                    <div className="flex justify-between"><span>Rice</span><span>$24K</span></div>
                    <div className="pt-2 border-t mt-2 flex justify-between font-semibold"><span>Total estimation</span><span>$100K</span></div>
                  </div>
                  <svg viewBox="0 0 32 32" className="w-28 h-28">
                    <circle cx="16" cy="16" r="14" fill="#e9f5e7" />
                    <path d="M16 16 L16 2 A14 14 0 1 1 5 27 Z" fill="#10b981" />
                    <path d="M16 16 L16 2 A14 14 0 0 1 28 16 Z" fill="#84cc16" />
                  </svg>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

