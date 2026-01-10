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
// ⚙️ ตั้งค่า API (เปลี่ยนจาก localhost เป็น Render URL ของคุณ)
// ==============================================
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
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
            <p className="text-slate-500 text-sm">บันทึกวิดีโอ 60 เฟรม</p>
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
            <p className="text-slate-400 text-sm">ใช้งานกล้องเพื่อแปลผล Real-time</p>
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
            if (!res.ok) throw new Error("Failed to connect to backend");
            const data = await res.json();
            if (isMounted) {
                const grouped = data.reduce((acc, curr) => {
                    acc[curr.label] = (acc[curr.label] || 0) + 1;
                    return acc;
                }, {});
                const statsArray = Object.entries(grouped).map(([label, count]) => ({
                    label, count, lastUpdated: new Date().toLocaleDateString('th-TH')
                }));
                setStats(statsArray);
                setLoading(false);
            }
        } catch (err) {
            if (isMounted) {
                setError("ไม่สามารถเชื่อมต่อ Server ได้");
                setLoading(false);
            }
        }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BookOpen className="text-purple-500" /> คลังคำศัพท์ในระบบ
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
          <WifiOff size={32} className="mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">ยังไม่มีข้อมูลในระบบ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800">{item.label}</h3>
              <p className="text-xs text-slate-400">{item.count} ตัวอย่าง</p>
            </div>
          ))}
        </div>
      )}
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

function CameraView({ onLandmarks, overlayText, showSkeleton = true }) {
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
                ctx.fillStyle = "#3B82F6";
                ctx.fill();
            }
        }
      }
      const flatPoints = results.landmarks.flatMap(hand => hand.flatMap(p => [p.x, p.y, p.z]));
      onLandmarks(flatPoints);
    } else { onLandmarks(null); }
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
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl border border-slate-800 ring-4 ring-slate-100">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900">
          <Loader2 className="animate-spin mb-4 text-blue-500 w-10 h-10" />
          <p>กำลังเตรียมโมเดล AI...</p>
        </div>
      )}
      {!loading && !cameraActive && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/60 backdrop-blur-sm">
          <button onClick={startCamera} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl flex items-center gap-3">
            <Camera size={24} className="text-blue-600" /> <span>เปิดกล้องใช้งาน</span>
          </button>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-90" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
      {overlayText && cameraActive && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
           <div className="bg-slate-900/70 text-white px-6 py-2 rounded-full border border-white/10 text-sm font-medium shadow-lg">
             {overlayText}
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
  const [progress, setProgress] = useState(0);
  const framesBuffer = useRef([]);

  const handleLandmarksUpdate = (points) => {
    setCurrentLandmarks(points);
    if (status === "recording" && points) {
        framesBuffer.current.push(points);
        setProgress(framesBuffer.current.length);
        if (framesBuffer.current.length >= 60) finishRecording();
    }
  };

  const startRecording = () => {
    if (!label) return alert("กรุณาใส่ชื่อท่าทาง");
    if (!currentLandmarks) return alert("ไม่พบมือในกล้อง");
    framesBuffer.current = [];
    setProgress(0);
    setStatus("recording");
  };

  const finishRecording = async () => {
    setStatus("uploading");
    const sequenceData = framesBuffer.current;
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, sequences: sequenceData })
      });
      if(!res.ok) throw new Error("Backend Error 422 หรืออื่นๆ");
      setStatus("success");
      setTimeout(() => setStatus("ready"), 2000);
      setLabel(""); setProgress(0);
    } catch (e) {
      alert(`บันทึกไม่สำเร็จ: ${e.message}`);
      setStatus("ready");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10">
      <div className="flex-1 space-y-4">
        <CameraView onLandmarks={handleLandmarksUpdate} overlayText={status === "recording" ? `REC: ${progress}/60` : "พร้อมบันทึก"} />
      </div>
      <div className="lg:w-96 space-y-4">
        <h2 className="text-2xl font-bold">สอนท่ามือ</h2>
        <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="ชื่อท่าทาง..." className="w-full p-4 border rounded-2xl" />
        <button onClick={startRecording} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">เริ่มบันทึก (60 เฟรม)</button>
      </div>
    </div>
  );
}

function PredictPage() {
  const [result, setResult] = useState({ label: "...", confidence: 0 });
  const [error, setError] = useState(false);
  const lastSentRef = useRef(0);

  const handleLandmarks = async (points) => {
    if (!points) return;
    const now = Date.now();
    if (now - lastSentRef.current < 500) return;
    lastSentRef.current = now;
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }) 
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setError(false);
      }
    } catch (e) { setError(true); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <CameraView onLandmarks={handleLandmarks} overlayText="กำลังวิเคราะห์..." />
      <div className="p-8 bg-white rounded-3xl shadow-xl border text-center">
        <p className="text-slate-400 text-sm uppercase font-bold tracking-widest">คำแปลที่พบ</p>
        <h2 className="text-5xl font-black text-blue-600 my-4">{result.label}</h2>
        <p className="text-slate-500">ความเชื่อมั่น: {(result.confidence * 100).toFixed(0)}%</p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div className="min-h-screen bg-slate-50/50 pt-16">
      <Navbar page={page} setPage={setPage} />
      <main className="container mx-auto">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "data" && <DataPage />}
        {page === "dictionary" && <DictionaryPage />}
        {page === "predict" && <PredictPage />}
      </main>
    </div>
  );
}
