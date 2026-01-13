import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Hand, Save, 
  Home as HomeIcon, Database, Activity, 
  BookOpen, StopCircle, Video, CheckCircle
} from "lucide-react";

// ==============================================
// ⚙️ ตั้งค่า API
// ใช้ URL ของ Backend ที่คุณ Deploy บน Render
// ==============================================
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
const SEQUENCE_LENGTH = 30; 

// --- Helper Components ---
function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={20} /> },
    { id: "data", label: "สอนท่ามือ", icon: <Database size={20} /> },
    { id: "dictionary", label: "คลังคำศัพท์", icon: <BookOpen size={20} /> },
    { id: "predict", label: "แปลภาษา", icon: <Activity size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 cursor-pointer" onClick={() => setPage("home")}>
          <Hand /> ThaiSign<span className="text-slate-800">AI</span>
        </div>
        
        {/* Mobile & Desktop Menu */}
        <div className="flex gap-1 md:gap-2 overflow-x-auto">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setPage(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap ${
                page === m.id ? "bg-blue-100 text-blue-600" : "text-slate-500 hover:bg-slate-100"
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

// --- Pages ---

function HomePage({ setPage }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-4 text-center animate-fade-in">
      <div className="bg-blue-50 p-6 rounded-full mb-6 animate-bounce">
        <Hand size={64} className="text-blue-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
        แปลภาษามือด้วย <span className="text-blue-600">AI</span>
      </h1>
      <p className="text-slate-500 max-w-lg mb-8 text-lg">
        ระบบต้นแบบการแปลภาษามือเป็นข้อความแบบ Real-time 
        โดยใช้ Machine Learning ผ่านกล้องเว็บแคม
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button onClick={() => setPage("data")} className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 font-bold flex items-center gap-2 justify-center transition-transform hover:-translate-y-1">
          <Database size={20} /> สอนท่ามือ (Collect)
        </button>
        <button onClick={() => setPage("predict")} className="flex-1 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 font-bold flex items-center gap-2 justify-center transition-transform hover:-translate-y-1">
          <Activity size={20} /> แปลภาษา (Predict)
        </button>
      </div>
    </div>
  );
}

function DictionaryPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/dataset`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="text-purple-500"/> คลังคำศัพท์
      </h2>
      {loading ? (
        <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-500"/></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-slate-800">{s.label}</h3>
              <p className="text-slate-500 text-sm">จำนวนข้อมูล: {s.count} Sequences</p>
            </div>
          )) : (
            <div className="col-span-full text-center text-slate-400 py-10">
              ยังไม่มีข้อมูลในระบบ กรุณาไปที่เมนู "สอนท่ามือ"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DataCollectionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [landmarker, setLandmarker] = useState(null);
  
  const recordingBuffer = useRef([]);

  useEffect(() => {
    const initMP = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
        const lm = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numHands: 1 
        });
        setLandmarker(lm);
        startCamera();
      } catch (e) {
        console.error("Failed to load MediaPipe", e);
      }
    };
    initMP();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          setLoading(false);
          predictLoop();
        });
      }
    } catch (e) { console.error(e); }
  };

  const predictLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    
    const loop = () => {
      if (!videoRef.current?.videoWidth) { requestAnimationFrame(loop); return; }
      
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      if (landmarker && !videoRef.current.paused) {
        const results = landmarker.detectForVideo(videoRef.current, performance.now());
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Draw Landmarks
          ctx.fillStyle = "#00FF00";
          landmarks.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * canvasRef.current.width, p.y * canvasRef.current.height, 4, 0, 2*Math.PI);
            ctx.fill();
          });

          // Record Logic
          if (isRecording) {
            const flattened = landmarks.flatMap(p => [p.x, p.y, p.z]);
            recordingBuffer.current.push(flattened);
            setFrameCount(prev => prev + 1);
          }
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  useEffect(() => {
    if (frameCount >= SEQUENCE_LENGTH && isRecording) {
      finishRecording();
    }
  }, [frameCount, isRecording]);

  const handleStart = () => {
    if (!label) return alert("กรุณาใส่ชื่อท่ามือก่อน!");
    recordingBuffer.current = [];
    setFrameCount(0);
    setIsRecording(true);
  };

  const finishRecording = async () => {
    setIsRecording(false);
    try {
      const res = await fetch(`${API_URL}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, frames: recordingBuffer.current })
      });
      if (res.ok) {
        alert(`✅ บันทึกท่า "${label}" สำเร็จ!`);
      } else {
        alert("บันทึกไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch (e) { alert("Error connecting to server"); }
    setFrameCount(0);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Database className="text-blue-500"/> สอนท่ามือ (Data Collection)</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-lg">
          {loading && <div className="absolute inset-0 flex items-center justify-center text-white"><Loader2 className="animate-spin"/></div>}
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-80" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -scale-x-100" />
          
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse font-bold shadow-lg">
              REC {frameCount}/{SEQUENCE_LENGTH}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <label className="text-sm font-semibold text-slate-700 block mb-2">ชื่อท่ามือ (Label)</label>
            <input 
              value={label} 
              onChange={e => setLabel(e.target.value)}
              disabled={isRecording}
              className="w-full p-3 border border-slate-200 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="เช่น hello, thanks, A, B"
            />
            <button 
              onClick={handleStart}
              disabled={isRecording || loading}
              className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md ${
                isRecording 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-1"
              }`}
            >
              {isRecording ? <Loader2 className="animate-spin"/> : <Save/>}
              {isRecording ? "กำลังบันทึก..." : "เริ่มบันทึก (Start)"}
            </button>
            <p className="text-xs text-slate-400 mt-4 text-center">
              กดปุ่มแล้วทำท่ามือค้างไว้จนกว่าจะครบ 30 เฟรม
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [landmarker, setLandmarker] = useState(null);
  const [prediction, setPrediction] = useState("--");
  const [conf, setConf] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const sequence = useRef([]);

  useEffect(() => {
    const initMP = async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
      const lm = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", delegate: "GPU" },
        runningMode: "VIDEO", numHands: 1
      });
      setLandmarker(lm);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => runLoop(lm));
      }
    };
    initMP();
  }, []);

  const runLoop = (lm) => {
    if(!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    const render = () => {
      if(!videoRef.current?.videoWidth) { requestAnimationFrame(render); return; }
      
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      const results = lm.detectForVideo(videoRef.current, performance.now());
      ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);

      if(results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        
        ctx.fillStyle = "#00FFFF";
        landmarks.forEach(p => {
           ctx.beginPath(); ctx.arc(p.x*canvasRef.current.width, p.y*canvasRef.current.height, 3, 0, 2*Math.PI); ctx.fill();
        });

        if(isPredicting) {
          const flat = landmarks.flatMap(p => [p.x, p.y, p.z]);
          sequence.current.push(flat);
          
          if(sequence.current.length > SEQUENCE_LENGTH) {
            sequence.current.shift();
          }

          if(sequence.current.length === SEQUENCE_LENGTH && sequence.current.length % 5 === 0) {
            predictAPI(sequence.current);
          }
        }
      }
      requestAnimationFrame(render);
    };
    render();
  };

  const predictAPI = async (frames) => {
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames })
      });
      const data = await res.json();
      if (data.confidence > 0.5) {
        setPrediction(data.label);
        setConf(data.confidence);
      }
    } catch(e) { console.log(e); }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><Activity className="text-cyan-500"/> แปลภาษา (Prediction)</h2>
      
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-6 ring-4 ring-slate-100">
         <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-60" />
         <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -scale-x-100" />
         
         <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent text-center">
            <p className="text-slate-300 uppercase text-sm tracking-widest mb-2 font-bold">ผลการทำนาย</p>
            <h1 className="text-6xl font-black text-white drop-shadow-2xl transition-all transform duration-300">
              {prediction}
            </h1>
            <p className="text-cyan-400 font-mono mt-2 font-bold">ความมั่นใจ: {(conf * 100).toFixed(1)}%</p>
         </div>
      </div>

      <button 
        onClick={() => {
            setIsPredicting(!isPredicting);
            sequence.current = [];
            setPrediction("--");
        }}
        className={`px-10 py-4 rounded-full font-bold text-xl flex items-center gap-3 transition-all shadow-xl hover:scale-105 ${
            isPredicting ? "bg-red-500 text-white hover:bg-red-600" : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        {isPredicting ? <StopCircle /> : <Video />}
        {isPredicting ? "หยุดแปลภาษา" : "เริ่มกล้องแปลภาษา"}
      </button>
      
      {!isPredicting && <p className="mt-4 text-slate-500">กดปุ่มเริ่มกล้อง แล้วทำท่ามือค้างไว้สักครู่</p>}
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-16">
      <Navbar page={page} setPage={setPage} />
      <div className="animate-fade-in">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "dictionary" && <DictionaryPage />}
        {page === "data" && <DataCollectionPage />}
        {page === "predict" && <PredictionPage />}
      </div>
    </div>
  );
}
