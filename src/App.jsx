import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Camera, Hand, Save, Play, 
  Home as HomeIcon, Database, Activity, 
  CheckCircle, RefreshCw, ServerCrash,
  ChevronRight, HeartPulse, Brain, BookOpen, Layers
} from "lucide-react";

// ==============================================
// ⚙️ ตั้งค่าการเชื่อมต่อ
// ==============================================
// เปลี่ยน URL นี้เป็นของ Render ที่คุณได้มา (ไม่มี / ต่อท้าย)
const API_URL = "https://your-project-name.onrender.com"; 
// ==============================================

// --- Components ---

function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={20} /> },
    { id: "data", label: "สอนท่ามือ", icon: <Database size={20} /> },
    { id: "dictionary", label: "คลังคำศัพท์", icon: <BookOpen size={20} /> }, // เพิ่มเมนูใหม่
    { id: "predict", label: "แปลภาษา", icon: <Activity size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 font-bold text-2xl cursor-pointer"
            onClick={() => setPage("home")}
          >
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg shadow-blue-500/30">
              <Hand className="text-white w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              ThaiMed<span className="font-light">AI</span>
            </span>
          </div>

          {/* Desktop Menu */}
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

          {/* Mobile Menu Icon (Simple version) */}
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
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

      <div className="max-w-4xl w-full text-center space-y-12 animate-fade-in-up">
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
            ด้วยเทคโนโลยี AI ที่แม่นยำและรวดเร็ว
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button onClick={() => setPage("data")} className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-left">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">สอนท่ามือ</h3>
            <p className="text-slate-500 text-sm">เพิ่มคำศัพท์ใหม่เข้าระบบ</p>
          </button>

          <button onClick={() => setPage("dictionary")} className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-left">
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">คลังคำศัพท์</h3>
            <p className="text-slate-500 text-sm">ดูรายการคำศัพท์ที่มีอยู่</p>
          </button>

          <button onClick={() => setPage("predict")} className="group p-6 bg-slate-900 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-left">
            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">แปลภาษา</h3>
            <p className="text-slate-400 text-sm">ใช้งานกล้องเพื่อแปลผล</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Dictionary Page (หน้าใหม่สำหรับดูข้อมูล) ---
function DictionaryPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/dataset`)
      .then(res => {
        if (!res.ok) throw new Error("Connection failed");
        return res.json();
      })
      .then(data => {
        // จัดกลุ่มข้อมูลเพื่อนับจำนวน
        const grouped = data.reduce((acc, curr) => {
          acc[curr.label] = (acc[curr.label] || 0) + 1;
          return acc;
        }, {});
        
        // แปลงเป็น Array เพื่อแสดงผล
        const statsArray = Object.entries(grouped).map(([label, count]) => ({
          label,
          count,
          lastUpdated: new Date().toLocaleDateString('th-TH') // จำลองวันที่ (ของจริงต้องแก้ Backend ให้ส่งมา)
        }));
        
        setStats(statsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("ไม่สามารถดึงข้อมูลได้");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BookOpen className="text-purple-500" /> คลังคำศัพท์ในระบบ
        </h2>
        <p className="text-slate-500 mt-2">รายการท่าทางทั้งหมดที่ AI เรียนรู้แล้ว</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <ServerCrash size={20} /> {error}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">ยังไม่มีข้อมูลในระบบ</p>
          <p className="text-slate-400 text-sm">ไปที่เมนู "สอนท่ามือ" เพื่อเพิ่มข้อมูลแรก</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg">
                  {item.label.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                  {item.count} ตัวอย่าง
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-slate-400">อัปเดตล่าสุด: {item.lastUpdated}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- UseHandTracking Hook ---
const useHandTracking = (videoRef, onResults) => {
  const [loading, setLoading] = useState(true);
  const landmarkerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        if(isMounted) {
          landmarkerRef.current = landmarker;
          setLoading(false);
        }
      } catch(e) { console.error(e); }
    })();
    return () => { isMounted = false; };
  }, []);

  const processVideo = () => {
    if (videoRef.current && landmarkerRef.current && videoRef.current.readyState >= 2) {
      const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      onResults(results);
    }
    requestAnimationFrame(processVideo);
  };

  return { loading, startLoop: processVideo };
};

function CameraView({ onLandmarks, overlayText, isRecording, showSkeleton = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const { loading, startLoop } = useHandTracking(videoRef, (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    if (results.landmarks && results.landmarks.length > 0) {
      if (showSkeleton) {
        for (const handLandmarks of results.landmarks) {
            for (let p of handLandmarks) {
                ctx.beginPath();
                ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, 2 * Math.PI);
                ctx.fillStyle = isRecording ? "#F87171" : "#34D399";
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "white";
                ctx.stroke();
            }
        }
      }
      const flatPoints = results.landmarks.flatMap(hand => hand.flatMap(p => [p.x, p.y, p.z]));
      onLandmarks(flatPoints);
    } else {
      onLandmarks(null);
    }
    ctx.restore();
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        setCameraActive(true);
        startLoop();
      };
    } catch (e) { alert("ไม่สามารถเปิดกล้องได้"); }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl shadow-blue-500/10 border border-slate-800 ring-4 ring-slate-100 group">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900">
          <Loader2 className="animate-spin mb-4 text-blue-500 w-10 h-10" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">กำลังเตรียมโมเดล AI...</p>
        </div>
      )}
      
      {!loading && !cameraActive && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/60 backdrop-blur-sm transition-all duration-500 group-hover:bg-slate-900/50">
          <button 
            onClick={startCamera} 
            className="group/btn relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <Camera size={24} className="text-blue-600 relative z-10" /> 
            <span className="relative z-10">เปิดกล้องใช้งาน</span>
          </button>
        </div>
      )}
      
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-90" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
      
      {cameraActive && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent absolute top-0 animate-[scan_3s_linear_infinite]" />
        </div>
      )}

      {overlayText && cameraActive && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
           <div className="bg-slate-900/70 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm font-medium flex items-center gap-3 shadow-lg">
             <div className="relative">
               <div className={`w-2.5 h-2.5 rounded-full ${overlayText.includes("ตรวจพบ") ? "bg-emerald-400" : "bg-rose-500"}`} />
               {overlayText.includes("ตรวจพบ") && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />}
             </div>
             {overlayText}
           </div>
        </div>
      )}
    </div>
  );
}

function DataPage() {
  const [landmarks, setLandmarks] = useState(null);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("ready"); 

  const handleSave = async () => {
    if (!landmarks || !label) return;
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, points: landmarks })
      });
      if(!res.ok) throw new Error("API Error");
      setStatus("success");
      setTimeout(() => setStatus("ready"), 2000);
      setLabel("");
    } catch (e) {
      alert("ไม่สามารถเชื่อมต่อ Server ได้");
      setStatus("ready");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10 animate-fade-in">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
             <Camera size={24} />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">มุมมองกล้อง</h2>
        </div>
        <CameraView 
          onLandmarks={setLandmarks} 
          isRecording={status === "saving"}
          overlayText={landmarks ? `ตรวจพบ ${landmarks.length / 63} มือ` : "กรุณายกมือ"}
        />
      </div>
      
      <div className="lg:w-96 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50" />
          
          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                <Database className="text-blue-500" />
                สอนท่ามือ
              </h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                ทำท่าทางค้างไว้หน้ากล้อง แล้วตั้งชื่อท่าทางนั้นเพื่อบันทึกลงฐานข้อมูล
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">ชื่อท่าทาง (Label)</label>
                <input 
                  type="text" 
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="เช่น ปวดหัว, รัก..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={!landmarks || !label || status === "saving"}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all transform active:scale-95 ${
                  status === "success" 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                }`}
              >
                {status === "saving" && <Loader2 className="animate-spin" />}
                {status === "success" && <CheckCircle />}
                {status === "ready" && <Save size={20} />}
                {status === "success" ? "บันทึกเรียบร้อย" : "บันทึกข้อมูล"}
              </button>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-sm text-blue-700/80">
              <div className="flex gap-3">
                 <div className="mt-0.5"><Brain size={16} /></div>
                 <p>ระบบรองรับการจำท่าทางทั้งแบบ <strong>มือเดียว</strong> และ <strong>สองมือ</strong> โดยอัตโนมัติ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [result, setResult] = useState({ label: "...", confidence: 0 });
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState(false);
  const lastSentRef = useRef(0);

  const handleLandmarks = async (points) => {
    if (!points) return;
    const now = Date.now();
    if (now - lastSentRef.current < 300) return;
    lastSentRef.current = now;

    setIsPredicting(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points })
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResult(data);
      setError(false);
    } catch (e) {
      setError(true);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm border border-rose-100 shadow-sm animate-pulse">
          <ServerCrash size={20} /> 
          <span className="font-medium">ไม่สามารถเชื่อมต่อ Server ได้ - กรุณาตรวจสอบการเชื่อมต่อ</span>
        </div>
      )}

      <div className="relative">
        <CameraView 
          onLandmarks={handleLandmarks} 
          isRecording={isPredicting}
          showSkeleton={true}
        />
        
        <div className="absolute -bottom-10 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96">
           <div className="bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-900/10 rounded-3xl p-6 border border-white/50 relative overflow-hidden transition-all hover:scale-105 duration-300">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400" />
             
             <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} className="text-blue-500" />
                  ผลลัพธ์การแปล
                </span>
                {isPredicting ? (
                  <RefreshCw size={16} className="text-blue-500 animate-spin" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
             </div>
             
             <h2 className={`text-5xl font-extrabold mb-4 truncate tracking-tight ${result.confidence > 0.7 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500" : "text-slate-300"}`}>
               {result.label}
             </h2>
             
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium text-slate-500">
                 <span>ความมั่นใจ (Confidence)</span>
                 <span className="font-mono">{(result.confidence * 100).toFixed(0)}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
                 <div 
                   className={`h-full transition-all duration-500 ease-out rounded-full ${
                     result.confidence > 0.8 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                     result.confidence > 0.5 ? "bg-gradient-to-r from-blue-400 to-blue-500" :
                     "bg-slate-300"
                   }`}
                   style={{ width: `${result.confidence * 100}%` }}
                 />
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20 pt-16 selection:bg-blue-100 selection:text-blue-900">
      <Navbar page={page} setPage={setPage} />
      <main className="container mx-auto">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "data" && <DataPage />}
        {page === "dictionary" && <DictionaryPage />} {/* หน้าใหม่ */}
        {page === "predict" && <PredictPage />}
      </main>
    </div>
  );
}
