import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Camera, Hand, Database, Activity, 
  Home as HomeIcon, ChevronRight, Brain, WifiOff, Wifi, Save, CheckCircle2
} from "lucide-react";

// ==============================================
// ⚙️ Configuration
// ==============================================
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
// ==============================================

function Navbar({ page, setPage, isBackendOnline }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={18} /> },
    { id: "data", label: "บันทึกข้อมูล", icon: <Database size={18} /> },
    { id: "predict", label: "แปลภาษา Real-time", icon: <Activity size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => setPage("home")}>
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
            <Hand className="text-white w-5 h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">ThaiMedAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${isBackendOnline ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isBackendOnline ? <><Wifi size={12}/> Server Online</> : <><WifiOff size={12}/> Server Offline</>}
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {menus.map((m) => (
              <button key={m.id} onClick={() => setPage(m.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${page === m.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {m.icon} <span className="hidden sm:inline">{m.label}</span>
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 text-center space-y-10 animate-fade-in-up">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <Brain size={14} /> AI-Powered Medical Sign Language
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          สื่อสารไร้พรมแดน<br/><span className="text-blue-600">ด้วยระบบแปลภาษามือ</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
          แปลท่าทางภาษามือทางการแพทย์แบบ Real-time เฟรมต่อเฟรม <br/>
          รวดเร็ว แม่นยำ และตอบสนองทันที
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button onClick={() => setPage("predict")} className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg">
          เริ่มแปล Real-time <ChevronRight size={18} />
        </button>
        <button onClick={() => setPage("data")} className="flex-1 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-lg">
          เพิ่มฐานข้อมูล
        </button>
      </div>
    </div>
  );
}

const useHandTracking = (videoRef, onResults) => {
  const [loading, setLoading] = useState(true);
  const landmarkerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        if(isMounted) {
          landmarkerRef.current = landmarker;
          setLoading(false);
        }
      } catch(e) { console.error("MediaPipe Error:", e); }
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

function CameraView({ onLandmarks, isActionActive }) {
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
      for (const hand of results.landmarks) {
        for (let p of hand) {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, 2 * Math.PI);
          ctx.fillStyle = isActionActive ? "#3B82F6" : "#22C55E";
          ctx.fill();
        }
      }
      const flatPoints = results.landmarks[0].flatMap(p => [p.x, p.y, p.z]);
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
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl border border-slate-800">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900">
          <Loader2 className="animate-spin mb-4 text-blue-500 w-10 h-10" />
          <p className="text-slate-400 font-medium">กำลังโหลด AI...</p>
        </div>
      )}
      {!loading && !cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm space-y-4 text-center px-4">
          <Camera size={40} className="text-blue-500" />
          <button onClick={startCamera} className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:scale-105 transition-all">
            เปิดกล้อง
          </button>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
    </div>
  );
}

function DataPage() {
  const [label, setLabel] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("พร้อมบันทึก");
  const sequenceRef = useRef([]);

  const handleLandmarks = async (points) => {
    if (!isRecording || !points) return;

    sequenceRef.current.push(points);
    setStatus(`กำลังบันทึก... (${sequenceRef.current.length}/60)`);

    if (sequenceRef.current.length >= 60) {
      setIsRecording(false);
      const dataToUpload = [...sequenceRef.current];
      sequenceRef.current = [];
      
      try {
        setStatus("กำลังอัพโหลด...");
        const res = await fetch(`${API_URL}/upload_video`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, sequence: dataToUpload })
        });
        if (res.ok) setStatus("บันทึกสำเร็จ!");
        else setStatus("อัพโหลดล้มเหลว");
      } catch (e) {
        setStatus("ติดต่อ Server ไม่ได้");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-slate-500 ml-1">ชื่อท่าทาง (ภาษาไทย)</label>
          <input 
            type="text" 
            value={label} 
            onChange={(e) => setLabel(e.target.value)}
            placeholder="เช่น ปวดหัว, เจ็บท้อง..."
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        <button 
          disabled={!label || isRecording}
          onClick={() => {
            sequenceRef.current = [];
            setIsRecording(true);
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          {isRecording ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {isRecording ? "กำลังบันทึก" : "เริ่มบันทึก 60 เฟรม"}
        </button>
      </div>

      <div className="relative">
        <CameraView onLandmarks={handleLandmarks} isActionActive={isRecording} />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2">
          {isRecording ? <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> : <CheckCircle2 size={16} className="text-green-400" />}
          {status}
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [result, setResult] = useState({ label: "รอตรวจจับ...", confidence: 0 });
  const [isPredicting, setIsPredicting] = useState(false);
  const lastSentTime = useRef(0);

  const handleLandmarks = async (points) => {
    if (!points) return;
    
    const now = Date.now();
    if (now - lastSentTime.current < 200) return; // ส่งทุกๆ 200ms
    lastSentTime.current = now;

    setIsPredicting(true);
    try {
      const res = await fetch(`${API_URL}/predict_realtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landmark: points })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Predict error:", e);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="relative">
        <CameraView onLandmarks={handleLandmarks} isActionActive={isPredicting} />
        <div className="absolute -bottom-12 left-4 right-4 md:right-8 md:bottom-8 md:w-96 z-40">
           <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-6 border-t-4 border-t-blue-500 border border-slate-100">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Real-time Translation</span>
                {isPredicting && <Loader2 className="animate-spin text-blue-500 w-4 h-4" />}
             </div>
             <h2 className="text-4xl font-black mb-4 text-slate-900">{result.label}</h2>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${result.confidence * 100}%` }} />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_URL}/`);
        setIsBackendOnline(res.ok);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <Navbar page={page} setPage={setPage} isBackendOnline={isBackendOnline} />
      <main className="container mx-auto">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "data" && <DataPage />}
        {page === "predict" && <PredictPage />}
      </main>
    </div>
  );
}
