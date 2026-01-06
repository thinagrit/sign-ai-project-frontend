import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Camera, Hand, Save, Play, 
  Home as HomeIcon, Database, Activity, 
  CheckCircle, RefreshCw, ServerCrash,
  BookOpen, HeartPulse, Brain, Video, Timer,
  ChevronRight, Info
} from "lucide-react";

// ==============================================
// ⚙️ Configuration (Update URL for Production)
// ==============================================
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
const MAX_FRAMES = 60; // จำนวนเฟรมที่ใช้ต่อ 1 ท่าทาง
// ==============================================

function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={18} /> },
    { id: "data", label: "เพิ่มข้อมูล (60 FPS)", icon: <Database size={18} /> },
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
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {menus.map((m) => (
            <button 
              key={m.id} 
              onClick={() => setPage(m.id)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                page === m.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m.icon} <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
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
          แปลภาษามือทางการแพทย์<br/><span className="text-blue-600">ด้วยระบบ AI แปลภาษามือ</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
          บันทึกและแปลท่าทางภาษามือทางการแพทย์แบบ 60 เฟรมต่อเนื่อง 
          เพื่อความแม่นยำสูงสุดในการวินิจฉัย
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button onClick={() => setPage("predict")} className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
          เริ่มแปลภาษา <ChevronRight size={18} />
        </button>
        <button onClick={() => setPage("data")} className="flex-1 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          สอนท่ามือใหม่
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

function CameraView({ onLandmarks, isRecording, recordingProgress, isPredicting }) {
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
          ctx.fillStyle = isRecording ? "#EF4444" : isPredicting ? "#3B82F6" : "#22C55E";
          ctx.fill();
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
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl border border-slate-800">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900">
          <Loader2 className="animate-spin mb-4 text-blue-500 w-10 h-10" />
          <p className="text-slate-400 font-medium">กำลังโหลดโมเดล AI...</p>
        </div>
      )}
      {!loading && !cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm space-y-4">
          <div className="bg-blue-600/20 p-4 rounded-full">
            <Camera size={40} className="text-blue-500" />
          </div>
          <button onClick={startCamera} className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:scale-105 transition-all">
            เปิดกล้องเพื่อเริ่มใช้งาน
          </button>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
      
      {isRecording && (
        <div className="absolute bottom-6 left-6 right-6 z-30 space-y-2 text-white">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Recording 60 Frames</span>
            <span>{recordingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-red-500 transition-all duration-75 ease-linear" style={{ width: `${recordingProgress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function DataPage() {
  const [currentLandmarks, setCurrentLandmarks] = useState(null);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("ready");
  const [countdown, setCountdown] = useState(0);
  const [videoBuffer, setVideoBuffer] = useState([]);
  
  const recordingProgress = (videoBuffer.length / MAX_FRAMES) * 100;

  const startRecordingFlow = () => {
    if (!label) return alert("กรุณาระบุชื่อท่าทางก่อนบันทึก");
    setCountdown(3);
    setStatus("countdown");
    setVideoBuffer([]);
  };

  useEffect(() => {
    if (status === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "countdown" && countdown === 0) {
      setStatus("recording");
    }
  }, [status, countdown]);

  useEffect(() => {
    if (status === "recording") {
      if (videoBuffer.length < MAX_FRAMES) {
        setVideoBuffer(prev => [...prev, currentLandmarks || []]);
      } else {
        handleSave();
      }
    }
  }, [currentLandmarks, status]);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/upload_video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, sequence: videoBuffer })
      });
      if(!res.ok) throw new Error("Backend Error");
      setStatus("success");
      setTimeout(() => setStatus("ready"), 2000);
      setLabel("");
      setVideoBuffer([]);
    } catch (e) {
      alert("ไม่สามารถเชื่อมต่อ Backend ได้");
      setStatus("ready");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 animate-fade-in">
      <div className="flex-1 space-y-4">
        <div className="relative">
          <CameraView onLandmarks={setCurrentLandmarks} isRecording={status === "recording"} recordingProgress={recordingProgress.toFixed(0)} />
          {status === "countdown" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-40 rounded-3xl text-white text-9xl font-black animate-pulse">{countdown}</div>
          )}
        </div>
      </div>
      <div className="lg:w-96 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Database className="text-blue-500" /> สอนท่ามือใหม่</h2>
          <p className="text-slate-400 text-sm mb-6">บันทึกวิดีโอ 60 เฟรม เพื่อสร้างฐานข้อมูลให้ AI</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">ชื่อคำศัพท์</label>
              <input 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold" 
                placeholder="เช่น ปวดท้อง" value={label} onChange={e => setLabel(e.target.value)} disabled={status !== "ready"}
              />
            </div>
            <button 
              onClick={startRecordingFlow} disabled={status !== "ready"}
              className={`w-full py-4 rounded-xl font-bold transition-all text-white flex items-center justify-center gap-2 ${
                status === "recording" ? "bg-red-500 animate-pulse" : 
                status === "success" ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
              }`}
            >
              {status === "ready" ? <><Video size={18}/> เริ่มบันทึก 60 เฟรม</> : 
               status === "recording" ? `กำลังบันทึก ${videoBuffer.length}/${MAX_FRAMES}` : 
               status === "saving" ? <Loader2 className="animate-spin" /> : "บันทึกเรียบร้อย!"}
            </button>
          </div>
          <div className="mt-6 flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-xs">
            <Info size={16} className="shrink-0" />
            <p><strong>ทิป:</strong> เมื่อเริ่มบันทึก ให้ขยับมือทำท่าทางอย่างช้าๆ ให้จบภายใน 2-3 วินาที</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [result, setResult] = useState({ label: "รอเริ่มการแปล...", confidence: 0 });
  const [sequenceBuffer, setSequenceBuffer] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const isPredictingRef = useRef(false);

  const predictSequence = async (sequence) => {
    if (isPredictingRef.current) return;
    isPredictingRef.current = true;
    setIsPredicting(true);

    try {
      const res = await fetch(`${API_URL}/predict_video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Prediction failed");
    } finally {
      setIsPredicting(false);
      isPredictingRef.current = false;
    }
  };

  const handleLandmarks = (points) => {
    setSequenceBuffer(prev => {
      const newBuffer = [...prev, points || []];
      if (newBuffer.length > MAX_FRAMES) {
        const slicedBuffer = newBuffer.slice(1);
        if (!isPredictingRef.current) {
           predictSequence(slicedBuffer);
        }
        return slicedBuffer;
      }
      return newBuffer;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="relative">
        <CameraView onLandmarks={handleLandmarks} isPredicting={isPredicting} />
        <div className="absolute -bottom-12 left-4 right-4 md:right-8 md:bottom-8 md:w-96 z-40">
           <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-6 border-t-4 border-t-blue-500 border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> AI ผลการวิเคราะห์
                </span>
                {isPredicting && <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" /></div>}
             </div>
             <h2 className="text-5xl font-black mb-4 text-slate-900 truncate">
               {sequenceBuffer.length < MAX_FRAMES ? `Loading ${sequenceBuffer.length}/60` : result.label}
             </h2>
             <div className="space-y-1.5">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                 <span>Confidence</span>
                 <span>{(result.confidence * 100).toFixed(0)}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" style={{ width: `${result.confidence * 100}%` }} />
               </div>
             </div>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
        {["ปวดหัว", "เจ็บหน้าอก", "เวียนหัว", "หายใจไม่ออก"].map(word => (
          <div key={word} className="px-4 py-3 bg-white rounded-2xl border border-slate-100 text-slate-500 text-center text-sm font-bold shadow-sm">
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16 selection:bg-blue-100 selection:text-blue-900">
      <Navbar page={page} setPage={setPage} />
      <main className="container mx-auto">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "data" && <DataPage />}
        {page === "predict" && <PredictPage />}
      </main>
    </div>
  );
}
