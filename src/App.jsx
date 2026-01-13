import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Camera, Hand, Save, 
  Home as HomeIcon, Database, Activity, 
  CheckCircle, RefreshCw, ServerCrash,
  HeartPulse, Brain, BookOpen, 
  Video, MonitorCheck, StopCircle, WifiOff
} from "lucide-react";

// ==============================================
// ⚙️ ตั้งค่า API
// ถ้าคุณรัน Python ในเครื่อง ให้เปลี่ยนเป็น "http://127.0.0.1:8000"
// ==============================================
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
// const API_URL = "https://sign-ai-project-backend.onrender.com"; // ใช้เมื่อ Deploy
// ==============================================

// --- Components ---

function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={20} /> },
    { id: "data", label: "สอนท่ามือ", icon: <Database size={20} /> },
    { id: "dictionary", label: "คลังคำศัพท์", icon: <BookOpen size={20} /> },
    { id: "predict", label: "แปลภาษา", icon: <Activity size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 font-bold text-2xl cursor-pointer"
            onClick={() => setPage("home")}
          >
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg">
              <Hand className="text-white w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              ThaiMed<span className="font-light">AI</span>
            </span>
          </div>

          <div className="hidden md:flex bg-slate-100/50 p-1 rounded-xl">
            {menus.map((m) => (
              <button
                key={m.id}
                onClick={() => setPage(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  page === m.id 
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden flex gap-2">
             {menus.map((m) => (
               <button
                 key={m.id}
                 onClick={() => setPage(m.id)}
                 className={`p-2 rounded-lg ${page === m.id ? "bg-blue-100 text-blue-600" : "text-slate-500"}`}
               >
                 {m.icon}
               </button>
             ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ setPage }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
            <HeartPulse size={16} /> นวัตกรรมเพื่อการแพทย์ยุคใหม่
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
            ระบบแปลภาษามือ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              ด้วยปัญญาประดิษฐ์
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            เชื่อมต่อการสื่อสารระหว่างบุคลากรทางการแพทย์และผู้บกพร่องทางการได้ยิน
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button onClick={() => setPage("data")} className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-1 transition-all text-left">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">สอนท่ามือ</h3>
            <p className="text-slate-500 text-sm">บันทึก 60 เฟรมต่อเนื่อง</p>
          </button>

          <button onClick={() => setPage("dictionary")} className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-1 transition-all text-left">
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">คลังคำศัพท์</h3>
            <p className="text-slate-500 text-sm">ดูรายการคำศัพท์ที่มีอยู่ใน Dataset</p>
          </button>

          <button onClick={() => setPage("predict")} className="group p-6 bg-slate-900 rounded-3xl shadow-xl hover:-translate-y-1 transition-all text-left">
            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">แปลภาษา</h3>
            <p className="text-slate-400 text-sm">แปลผลแบบ Sliding Window</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function DictionaryPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/dataset`);
            if (!res.ok) throw new Error("Failed to connect");
            const data = await res.json();
            if (isMounted) {
                const grouped = data.reduce((acc, curr) => {
                    acc[curr.label] = (acc[curr.label] || 0) + 1;
                    return acc;
                }, {});
                setStats(Object.entries(grouped).map(([label, count]) => ({ label, count })));
                setLoading(false);
            }
        } catch (err) {
            if (isMounted) {
                setError(`ไม่สามารถเชื่อมต่อ Server ได้ (${API_URL})`);
                setLoading(false);
            }
        }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <BookOpen className="text-purple-500" /> คลังคำศัพท์ในระบบ
      </h2>
      {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-500" /></div> : 
       error ? <div className="bg-red-50 text-red-500 p-10 text-center rounded-3xl border border-red-100">{error}</div> :
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-colors">
             <h3 className="text-xl font-bold text-slate-800">{s.label}</h3>
             <p className="text-slate-400 font-medium">{s.count} Sequences</p>
           </div>
         ))}
         {stats.length === 0 && <div className="col-span-3 text-center text-slate-400 py-10">ยังไม่มีข้อมูลในระบบ กรุณาไปที่เมนู "สอนท่ามือ"</div>}
       </div>
      }
