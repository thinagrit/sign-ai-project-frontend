import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { 
  Loader2, Camera, Hand, Save, Play, 
  Home as HomeIcon, Database, Activity, 
  CheckCircle, RefreshCw, ServerCrash 
} from "lucide-react";

// ==============================================
// ตั้งค่า URL ของ Backend
// ==============================================
// 1. ตอนทดสอบในเครื่องใช้: "https://sign-ai-project-backend.onrender.com"
// 2. ตอน Deploy เสร็จแล้วให้เปลี่ยนเป็น URL ของ Render 
const API_URL = "https://sign-ai-project-backend.onrender.com"; 
// ==============================================

// --- Components ---

function Navbar({ page, setPage }) {
  const menus = [
    { id: "home", label: "หน้าหลัก", icon: <HomeIcon size={20} /> },
    { id: "data", label: "สอนท่ามือ (Train)", icon: <Database size={20} /> },
    { id: "predict", label: "แปลภาษา (Predict)", icon: <Activity size={20} /> },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Hand className="fill-blue-600 text-white" /> ThaiMed AI
          </div>
          <div className="flex gap-1">
            {menus.map((m) => (
              <button
                key={m.id}
                onClick={() => setPage(m.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  page === m.id 
                    ? "bg-blue-50 text-blue-600 font-bold" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
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
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-10 animate-fade-in">
      <div className="space-y-4">
        <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
           <Hand size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          ระบบแปลภาษามือไทย<br/>
          <span className="text-blue-600">สำหรับทางการแพทย์</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          AI ช่วยสื่อสารระหว่างบุคลากรทางการแพทย์และผู้บกพร่องทางการได้ยิน 
          รองรับการตรวจจับพร้อมกัน 2 มือ
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button 
          onClick={() => setPage("data")}
          className="p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database size={100} />
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">1. สอนท่ามือ (Data)</h3>
          <p className="text-gray-500 text-sm">เพิ่มคำศัพท์ใหม่เข้าระบบ เช่น "ปวดหัว", "หมอ" เพื่อให้ AI เรียนรู้</p>
        </button>

        <button 
          onClick={() => setPage("predict")}
          className="p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-green-500 shadow-sm hover:shadow-xl transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={100} />
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">2. เริ่มแปลภาษา (Predict)</h3>
          <p className="text-gray-500 text-sm">เปิดกล้องเพื่อแปลท่าทางเป็นข้อความแบบ Real-time</p>
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
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2 // *** กำหนดให้จับได้สูงสุด 2 มือ ***
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
    
    // Mirror effect for drawing context
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    if (results.landmarks && results.landmarks.length > 0) {
      // วนลูปวาดมือทุกข้างที่ตรวจจับได้
      if (showSkeleton) {
        for (const handLandmarks of results.landmarks) {
            for (let p of handLandmarks) {
                ctx.beginPath();
                ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, 2 * Math.PI);
                ctx.fillStyle = isRecording ? "#EF4444" : "#00FF00";
                ctx.fill();
            }
        }
      }
      
      // รวมข้อมูลทุกมือเป็น Array เดียวกันเพื่อส่งให้ Backend
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
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg border border-gray-800">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-20 bg-gray-900">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-gray-400 text-sm">กำลังโหลดโมเดล AI...</p>
          </div>
        </div>
      )}
      
      {!loading && !cameraActive && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/50 backdrop-blur-sm">
          <button 
            onClick={startCamera} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all font-semibold shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
          >
            <Camera size={20} /> เปิดกล้อง
          </button>
        </div>
      )}
      
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
      
      {overlayText && cameraActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-sm flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${overlayText.includes("ตรวจพบ") ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
           {overlayText}
        </div>
      )}
    </div>
  );
}

function DataPage() {
  const [landmarks, setLandmarks] = useState(null);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("ready"); // ready, saving, success

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
      alert("เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อ Backend ได้ (ตรวจสอบว่ารัน Server หรือยัง)");
      setStatus("ready");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col lg:flex-row gap-8 animate-fade-in-up">
      <div className="flex-1">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4">
           <h2 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
             <Camera size={18} /> ภาพจากกล้อง
           </h2>
           <CameraView 
             onLandmarks={setLandmarks} 
             isRecording={status === "saving"}
             // แสดงสถานะว่าเจอกี่มือ (1 หรือ 2)
             overlayText={landmarks ? `ตรวจพบ ${landmarks.length / 63} มือ` : "กรุณายกมือ"}
           />
        </div>
      </div>
      
      <div className="lg:w-80 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div>
             <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Database className="text-blue-500" />
              สอนท่ามือใหม่
            </h2>
            <p className="text-xs text-gray-500">รองรับทั้ง 1 และ 2 มือ</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ชื่อท่าทาง (Label)
            </label>
            <input 
              type="text" 
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="เช่น ปวดหัว, รัก..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!landmarks || !label || status === "saving"}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg ${
              status === "success" 
                ? "bg-green-500 text-white shadow-green-500/30" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            }`}
          >
            {status === "saving" && <Loader2 className="animate-spin" />}
            {status === "success" && <CheckCircle />}
            {status === "ready" && <Save size={20} />}
            {status === "success" ? "บันทึกเรียบร้อย!" : "บันทึกข้อมูล"}
          </button>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <strong>คำแนะนำ:</strong> 
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>ทำท่าทางค้างไว้ (มือเดียวหรือสองมือก็ได้)</li>
              <li>ตั้งชื่อท่าทางนั้น</li>
              <li>กดปุ่มบันทึก</li>
            </ol>
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
    
    // ส่งข้อมูลทุกๆ 300ms
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
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-200">
          <ServerCrash size={16} /> ไม่สามารถเชื่อมต่อกับ Server ได้ ({API_URL})
        </div>
      )}

      <div className="relative">
        <CameraView 
          onLandmarks={handleLandmarks} 
          isRecording={isPredicting}
          showSkeleton={true}
        />
        
        {/* Floating Result Card */}
        <div className="absolute -bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 md:bottom-6 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-white/50 transition-all">
           <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ผลลัพธ์ (Translation)</span>
              {isPredicting ? (
                <RefreshCw size={14} className="text-blue-500 animate-spin" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              )}
           </div>
           
           <h2 className={`text-4xl font-extrabold mb-3 truncate ${result.confidence > 0.7 ? "text-blue-600" : "text-gray-400"}`}>
             {result.label}
           </h2>
           
           <div className="space-y-1">
             <div className="flex justify-between text-xs text-gray-500">
               <span>ความมั่นใจ</span>
               <span>{(result.confidence * 100).toFixed(0)}%</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-300 ${result.confidence > 0.7 ? "bg-blue-500" : "bg-gray-400"}`}
                 style={{ width: `${result.confidence * 100}%` }}
               />
             </div>
           </div>
        </div>
      </div>
      
      <div className="pt-8">
        <h3 className="text-gray-500 font-medium mb-3 text-sm">ตัวอย่างคำศัพท์ที่ระบบรู้จัก (ถ้าบันทึกแล้ว)</h3>
        <div className="flex flex-wrap gap-2">
          {["ปวดหัว", "เจ็บหน้าอก", "เวียนหัว", "หายใจไม่ออก", "สวัสดี", "ขอบคุณ"].map(word => (
            <div key={word} className="px-4 py-2 bg-white rounded-lg text-gray-600 border border-gray-200 text-sm shadow-sm">
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-20">
      <Navbar page={page} setPage={setPage} />
      <main className="pt-6">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "data" && <DataPage />}
        {page === "predict" && <PredictPage />}
      </main>
    </div>
  );
}
