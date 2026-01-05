import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Camera, Hand, Save, Play, 
  Home as HomeIcon, Database, Activity, 
  CheckCircle, RefreshCw, ServerCrash,
  BookOpen, HeartPulse, Brain, Video, Timer
} from "lucide-react";

// ==============================================
// ⚙️ ตั้งค่าการเชื่อมต่อ (แก้ไข URL ตาม Render ของคุณ)
// ==============================================
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
// ==============================================

function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={20} /> },
    { id: "data", label: "สอนท่ามือ (Video)", icon: <Video size={20} /> },
    { id: "predict", label: "แปลภาษา", icon: <Activity size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl cursor-pointer" onClick={() => setPage("home")}>
          <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg">
            <Hand className="text-white w-6 h-6" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">ThaiMedAI</span>
        </div>
        <div className="flex bg-slate-100/50 p-1 rounded-xl">
          {menus.map((m) => (
            <button key={m.id} onClick={() => setPage(m.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${page === m.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"}`}>
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 text-center space-y-12 animate-fade-in-up">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
          <HeartPulse size={16} /> บันทึกท่าทางแบบเคลื่อนไหว (60 Frames Sequence)
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
          ระบบเก็บข้อมูล<br/><span className="text-blue-600">ท่าทางภาษามือ</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
          เพิ่มความแม่นยำด้วยการบันทึก 60 เฟรมต่อเนื่อง เพื่อท่าทางที่สมบูรณ์แบบ
        </p>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setPage("data")} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
          <Video size={20} /> เริ่มสอนท่ามือ
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

function CameraView({ onLandmarks, isRecording, recordingProgress }) {
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
          ctx.fillStyle = isRecording ? "#EF4444" : "#34D399";
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
      {loading && <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900"><Loader2 className="animate-spin mb-4 text-blue-500 w-10 h-10" /><p className="text-slate-400">กำลังเตรียม AI...</p></div>}
      {!loading && !cameraActive && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/60 backdrop-blur-sm">
          <button onClick={startCamera} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <Camera size={24} className="text-blue-600" /> เปิดกล้อง
          </button>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
      
      {isRecording && (
        <div className="absolute bottom-6 left-6 right-6 z-30 space-y-2 text-white drop-shadow-md">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Recording 60 Frames</span>
            <span>{recordingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 backdrop-blur-md rounded-full overflow-hidden border border-white/10">
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
  
  // ปรับเป็น 60 เฟรม
  const MAX_FRAMES = 60;
  const recordingProgress = (videoBuffer.length / MAX_FRAMES) * 100;

  const startRecordingFlow = () => {
    if (!label) return alert("กรุณาระบุชื่อท่าทาง");
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
        if (currentLandmarks) {
          setVideoBuffer(prev => [...prev, currentLandmarks]);
        } else {
          setVideoBuffer(prev => [...prev, []]); 
        }
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
        body: JSON.stringify({ 
          label: label, 
          sequence: videoBuffer 
        })
      });
      if(!res.ok) throw new Error("API Error");
      setStatus("success");
      setTimeout(() => setStatus("ready"), 2000);
      setLabel("");
      setVideoBuffer([]);
    } catch (e) {
      alert("ไม่สามารถบันทึกได้ โปรดตรวจสอบการเชื่อมต่อ");
      setStatus("ready");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10 animate-fade-in">
      <div className="flex-1 space-y-4">
        <div className="relative">
          <CameraView 
            onLandmarks={setCurrentLandmarks} 
            isRecording={status === "recording"}
            recordingProgress={recordingProgress.toFixed(0)}
          />
          {status === "countdown" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40 rounded-3xl">
              <div className="text-white text-9xl font-black animate-ping">{countdown}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="lg:w-96">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
            <Video className="text-blue-500" /> สอนท่ามือ (60 เฟรม)
          </h2>
          <p className="text-slate-500 text-sm">
            บันทึกการเคลื่อนไหวต่อเนื่อง 60 เฟรม เพื่อให้ AI จดจำท่าทางได้ละเอียดและแม่นยำขึ้น
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">ชื่อท่าทาง (Label)</label>
              <input 
                type="text" 
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="เช่น ปวดหัว, เดิน, หมอ"
                disabled={status !== "ready"}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <button 
              onClick={startRecordingFlow}
              disabled={status !== "ready"}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                status === "success" ? "bg-emerald-500 text-white" :
                status === "recording" ? "bg-red-500 text-white animate-pulse" :
                "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-100 disabled:text-slate-400"
              }`}
            >
              {status === "countdown" && <Timer className="animate-spin" />}
              {status === "recording" && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
              {status === "saving" && <Loader2 className="animate-spin" />}
              {status === "success" ? "บันทึกสำเร็จ!" : 
               status === "countdown" ? `เริ่มใน ${countdown}...` :
               status === "recording" ? `กำลังบันทึก ${videoBuffer.length}/60` : 
               status === "saving" ? "กำลังประมวลผล..." : "เริ่มบันทึก 60 เฟรม"}
            </button>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-700 leading-relaxed">
            <strong>คำแนะนำ:</strong> เมื่อเริ่มบันทึก ให้ขยับมือทำท่าทางอย่างช้าๆ จนกว่าแถบสีแดงจะเต็มหน้าจอ
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [result, setResult] = useState({ label: "...", confidence: 0 });
  const [isPredicting, setIsPredicting] = useState(false);
  const lastSentRef = useRef(0);

  const handleLandmarks = async (points) => {
    if (!points) return;
    const now = Date.now();
    if (now - lastSentRef.current < 500) return;
    lastSentRef.current = now;

    setIsPredicting(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) { console.error("Predict Error"); }
    finally { setIsPredicting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="relative">
        <CameraView onLandmarks={handleLandmarks} isRecording={isPredicting} recordingProgress={0} />
        <div className="absolute -bottom-10 left-4 right-4 md:right-8 md:bottom-8 md:w-96">
           <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 border border-white/50">
             <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} className="text-blue-500" /> ผลการแปล
                </span>
             </div>
             <h2 className="text-5xl font-extrabold mb-4 text-blue-600 truncate">{result.label}</h2>
             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border">
               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${result.confidence * 100}%` }} />
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
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20 pt-16">
      <Navbar page={page} setPage={setPage} />
      <main className="container mx-auto">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "data" && <DataPage />}
        {page === "predict" && <PredictPage />}
      </main>
    </div>
  );
}
