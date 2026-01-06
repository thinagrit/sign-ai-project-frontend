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
const MAX_FRAMES = 60; // จำนวนเฟรมที่ใช้ในการตัดสินใจ (สอดคล้องกับการบันทึก)
// ==============================================

function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={20} /> },
    { id: "data", label: "สอนท่ามือ", icon: <Video size={20} /> },
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
          <Brain size={16} /> ระบบ AI แปลภาษามือทางการแพทย์ (60 Frames)
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
          แปลการเคลื่อนไหว<br/><span className="text-blue-600">เป็นคำศัพท์แพทย์</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
          ใช้เทคโนโลยี Sequence Processing เพื่อวิเคราะห์ท่าทางที่ต่อเนื่อง 
          ช่วยให้การสื่อสารในโรงพยาบาลเป็นเรื่องง่าย
        </p>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setPage("predict")} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
          <Activity size={20} /> เริ่มการแปลผล
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
          ctx.fillStyle = isRecording ? "#EF4444" : isPredicting ? "#3B82F6" : "#34D399";
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
            <Camera size={24} className="text-blue-600" /> เปิดกล้องใช้งาน
          </button>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
      
      {isRecording && (
        <div className="absolute bottom-6 left-6 right-6 z-30 space-y-2 text-white drop-shadow-md">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Recording Sequence</span>
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
      if(!res.ok) throw new Error("API Error");
      setStatus("success");
      setTimeout(() => setStatus("ready"), 2000);
      setLabel("");
      setVideoBuffer([]);
    } catch (e) {
      alert("บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อ Backend");
      setStatus("ready");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10">
      <div className="flex-1">
        <div className="relative">
          <CameraView onLandmarks={setCurrentLandmarks} isRecording={status === "recording"} recordingProgress={recordingProgress.toFixed(0)} />
          {status === "countdown" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40 rounded-3xl text-white text-9xl font-black">{countdown}</div>
          )}
        </div>
      </div>
      <div className="lg:w-96 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Video className="text-blue-500" /> เก็บข้อมูลใหม่</h2>
        <div className="space-y-4">
          <input 
            className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-medium" 
            placeholder="ชื่อท่าทาง" value={label} onChange={e => setLabel(e.target.value)} disabled={status !== "ready"}
          />
          <button 
            onClick={startRecordingFlow} disabled={status !== "ready"}
            className={`w-full py-4 rounded-2xl font-bold transition-all text-white ${status === "recording" ? "bg-red-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {status === "ready" ? "เริ่มบันทึก 60 เฟรม" : status === "recording" ? `กำลังบันทึก ${videoBuffer.length}/${MAX_FRAMES}` : "โปรดรอ..."}
          </button>
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [result, setResult] = useState({ label: "รอการวิเคราะห์...", confidence: 0 });
  const [sequenceBuffer, setSequenceBuffer] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const isPredictingRef = useRef(false);

  // ฟังก์ชันส่งข้อมูลไปแปลผล
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
      console.error("Predict Error");
    } finally {
      setIsPredicting(false);
      isPredictingRef.current = false;
    }
  };

  const handleLandmarks = (points) => {
    // เพิ่มข้อมูลลงใน Buffer (เลื่อนหน้าต่าง)
    setSequenceBuffer(prev => {
      const newBuffer = [...prev, points || []];
      // ถ้าข้อมูลเกิน 60 เฟรม ให้ตัดของเก่าออก
      if (newBuffer.length > MAX_FRAMES) {
        const slicedBuffer = newBuffer.slice(1);
        // ทุกๆ การขยับ (หรือทุกๆ N เฟรม) ให้ส่งไปแปล
        // ในที่นี้เราส่งเมื่อ Buffer เต็ม และไม่ได้กำลังรอผลลัพธ์จาก API ครั้งก่อน
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
        
        {/* ส่วนแสดงผลลัพธ์ */}
        <div className="absolute -bottom-10 left-4 right-4 md:right-8 md:bottom-8 md:w-96">
           <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-6 border border-white/50 border-t-blue-500 border-t-4">
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Brain size={14} className="text-blue-500" /> ระบบวิเคราะห์ท่าทาง
                </span>
                {isPredicting && <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></div>}
             </div>
             <h2 className="text-5xl font-extrabold mb-4 text-slate-900 truncate">
               {sequenceBuffer.length < MAX_FRAMES ? `รอเตรียมข้อมูล (${sequenceBuffer.length}/${MAX_FRAMES})` : result.label}
             </h2>
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] font-bold text-slate-400">
                 <span>ความแม่นยำ</span>
                 <span>{(result.confidence * 100).toFixed(0)}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${result.confidence * 100}%` }} />
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
          <p className="text-xs text-slate-400 mb-1">สถานะ Buffer</p>
          <p className="font-bold text-blue-600">{sequenceBuffer.length} / 60</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
          <p className="text-xs text-slate-400 mb-1">โหมดการแปล</p>
          <p className="font-bold text-slate-700">Sequence 60</p>
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
