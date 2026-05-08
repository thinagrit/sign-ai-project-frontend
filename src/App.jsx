import React, { useEffect, useRef, useState, useCallback } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import {
  Loader2, Camera, Hand, Save, Home as HomeIcon,
  Database, Activity, CheckCircle, RefreshCw, ServerCrash,
  HeartPulse, Brain, BookOpen, X, Trash2, History,
  TrendingUp, Users, Zap, ChevronRight, AlertCircle, BarChart2
} from "lucide-react";

// =============================================
// ⚙️ API URL — change this to your backend URL
// =============================================
const API_URL = "https://sign-ai-project-backend.onrender.com";
// =============================================

// ── Navbar ──────────────────────────────────
function Navbar({ page, setPage }) {
  const menus = [
    { id: "home",       label: "หน้าหลัก",   icon: <HomeIcon size={18} /> },
    { id: "data",       label: "สอนท่ามือ",   icon: <Database size={18} /> },
    { id: "dictionary", label: "คลังคำ",      icon: <BookOpen size={18} /> },
    { id: "predict",    label: "แปลภาษา",     icon: <Activity size={18} /> },
    { id: "history",    label: "ประวัติ",      icon: <History size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => setPage("home")}
            className="flex items-center gap-2.5 font-bold text-xl group"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Hand className="text-white w-5 h-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              ThaiMed<span className="font-light">AI</span>
            </span>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex bg-slate-100/70 p-1 rounded-2xl gap-0.5">
            {menus.map((m) => (
              <button
                key={m.id}
                onClick={() => setPage(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page === m.id
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile icons */}
          <div className="md:hidden flex gap-1">
            {menus.map((m) => (
              <button
                key={m.id}
                onClick={() => setPage(m.id)}
                className={`p-2.5 rounded-xl transition-all ${
                  page === m.id ? "bg-blue-100 text-blue-600" : "text-slate-400"
                }`}
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

// ── Stat Card ────────────────────────────────
function StatCard({ icon, label, value, color = "blue" }) {
  const colors = {
    blue:   "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    teal:   "bg-teal-50 text-teal-600",
    amber:  "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ── Home Page ────────────────────────────────
function HomePage({ setPage }) {
  const [stats, setStats] = useState({ total_samples: 0, unique_labels: 0 });

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const cards = [
    {
      id: "data",
      icon: <Database size={24} />,
      title: "สอนท่ามือ",
      desc: "บันทึกท่าทางใหม่เข้าระบบ AI",
      bg: "from-blue-600 to-blue-500",
      light: false,
    },
    {
      id: "dictionary",
      icon: <BookOpen size={24} />,
      title: "คลังคำศัพท์",
      desc: "ดูรายการท่าทางทั้งหมดในระบบ",
      bg: "from-purple-600 to-purple-500",
      light: false,
    },
    {
      id: "predict",
      icon: <Zap size={24} />,
      title: "แปลภาษา",
      desc: "ใช้กล้องเพื่อแปลท่ามือแบบ Real-time",
      bg: "from-slate-800 to-slate-700",
      light: false,
    },
    {
      id: "history",
      icon: <History size={24} />,
      title: "ประวัติ",
      desc: "ดูประวัติการแปลที่ผ่านมา",
      bg: "from-teal-600 to-teal-500",
      light: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl w-full text-center space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
          <HeartPulse size={15} />
          นวัตกรรมเพื่อการสื่อสารทางการแพทย์
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            ระบบแปลภาษามือ
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              ด้วยปัญญาประดิษฐ์
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
            เชื่อมต่อการสื่อสารระหว่างบุคลากรทางการแพทย์และผู้บกพร่องทางการได้ยิน
            ด้วย AI ที่แม่นยำและรวดเร็ว
          </p>
        </div>

        {/* Live stats */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-600">
            <BarChart2 size={14} className="text-blue-500" />
            <span><strong className="text-slate-800">{stats.total_samples}</strong> ตัวอย่างในระบบ</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-600">
            <Brain size={14} className="text-purple-500" />
            <span><strong className="text-slate-800">{stats.unique_labels}</strong> ท่าทาง</span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setPage(c.id)}
              className={`group p-6 bg-gradient-to-br ${c.bg} rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left`}
            >
              <div className="h-11 w-11 bg-white/15 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{c.title}</h3>
              <p className="text-white/70 text-xs leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── useHandTracking Hook ──────────────────────
function useHandTracking(videoRef, onResults) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const lm = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });
        if (mounted) {
          landmarkerRef.current = lm;
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setError(true);
      }
    })();
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const startLoop = useCallback(() => {
    const loop = () => {
      if (videoRef.current && landmarkerRef.current && videoRef.current.readyState >= 2) {
        const results = landmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );
        onResults(results);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, [videoRef, onResults]);

  return { loading, error, startLoop };
}

// ── Camera View ───────────────────────────────
// ── Motion Buffer (shared across pages) ───────
// Keeps last N frames to compute velocity
const MOTION_WINDOW = 5; // frames to average velocity over

function computeMotionFeatures(frameBuffer) {
  // frameBuffer: array of flat landmark arrays (newest last)
  // Returns: flat landmarks of latest frame + velocity features appended
  if (frameBuffer.length < 2) return frameBuffer[frameBuffer.length - 1] || null;

  const latest = frameBuffer[frameBuffer.length - 1];
  const oldest = frameBuffer[0];
  const n = Math.min(latest.length, oldest.length);

  // velocity = (latest - oldest) / frames  — captures direction & speed
  const velocity = [];
  for (let i = 0; i < n; i++) {
    velocity.push((latest[i] - oldest[i]) / frameBuffer.length);
  }

  // motion magnitude — single number: how much the hand is moving
  const magnitude = Math.sqrt(velocity.reduce((s, v) => s + v * v, 0));

  // wrist velocity (landmark 0: x,y,z) — captures gross hand movement
  const wristVx = velocity[0] || 0;
  const wristVy = velocity[1] || 0;

  // Return: landmarks + velocity + magnitude + wrist velocity
  return [...latest, ...velocity, magnitude, wristVx, wristVy];
}

// ── Camera View ───────────────────────────────
function CameraView({ onLandmarks, overlayText, isRecording, showSkeleton = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [camError, setCamError] = useState(false);
  const frameBufferRef = useRef([]); // rolling window of raw landmark frames

  const handleResults = useCallback(
    (results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.landmarks?.length > 0) {
        if (showSkeleton) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          for (const hand of results.landmarks) {
            const connections = [
              [0,1],[1,2],[2,3],[3,4],
              [0,5],[5,6],[6,7],[7,8],
              [0,9],[9,10],[10,11],[11,12],
              [0,13],[13,14],[14,15],[15,16],
              [0,17],[17,18],[18,19],[19,20],
              [5,9],[9,13],[13,17],
            ];
            ctx.strokeStyle = isRecording ? "rgba(248,113,113,0.6)" : "rgba(52,211,153,0.6)";
            ctx.lineWidth = 2;
            for (const [a, b] of connections) {
              ctx.beginPath();
              ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
              ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
              ctx.stroke();
            }
            for (const p of hand) {
              ctx.beginPath();
              ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, 2 * Math.PI);
              ctx.fillStyle = isRecording ? "#F87171" : "#34D399";
              ctx.fill();
              ctx.strokeStyle = "white";
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }

            // Draw motion arrow on wrist (landmark 0) when moving
            const buf = frameBufferRef.current;
            if (buf.length >= 2) {
              const prev = buf[buf.length - 2];
              const curr = buf[buf.length - 1];
              if (prev && curr) {
                const dx = (curr[0] - prev[0]) * canvas.width * 8;
                const dy = (curr[1] - prev[1]) * canvas.height * 8;
                const speed = Math.sqrt(dx*dx + dy*dy);
                if (speed > 4) {
                  ctx.strokeStyle = "rgba(251,191,36,0.9)";
                  ctx.lineWidth = 3;
                  ctx.beginPath();
                  ctx.moveTo(hand[0].x * canvas.width, hand[0].y * canvas.height);
                  ctx.lineTo(hand[0].x * canvas.width + dx, hand[0].y * canvas.height + dy);
                  ctx.stroke();
                }
              }
            }
          }
          ctx.restore();
        }

        // Collect raw flat landmarks into buffer
        const flat = results.landmarks.flatMap((h) => h.flatMap((p) => [p.x, p.y, p.z]));
        frameBufferRef.current = [...frameBufferRef.current, flat].slice(-MOTION_WINDOW);

        // Compute motion-enriched features and send up
        const enriched = computeMotionFeatures(frameBufferRef.current);
        onLandmarks(enriched);
      } else {
        frameBufferRef.current = [];
        onLandmarks(null);
      }
    },
    [onLandmarks, showSkeleton, isRecording]
  );

  const { loading, error: aiError, startLoop } = useHandTracking(videoRef, handleResults);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        setCameraActive(true);
        startLoop();
      };
    } catch {
      setCamError(true);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl border border-slate-800 ring-2 ring-slate-700/50">
      {(loading || aiError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-900">
          {aiError ? (
            <><AlertCircle className="mb-3 text-red-400 w-10 h-10" /><p className="text-slate-400 text-sm">ไม่สามารถโหลดโมเดล AI ได้</p></>
          ) : (
            <><Loader2 className="animate-spin mb-3 text-blue-400 w-10 h-10" /><p className="text-slate-400 text-sm animate-pulse">กำลังโหลดโมเดล AI...</p></>
          )}
        </div>
      )}
      {!loading && !aiError && !cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
          {camError && (
            <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> ไม่สามารถเข้าถึงกล้องได้
            </p>
          )}
          <button
            onClick={startCamera}
            className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-105 hover:shadow-blue-500/20 transition-all duration-200"
          >
            <Camera size={22} className="text-blue-600" />
            เปิดกล้องใช้งาน
          </button>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-90" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
      {cameraActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent absolute animate-[scan_3s_linear_infinite]" />
        </div>
      )}
      {overlayText && cameraActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 bg-slate-900/75 text-white px-5 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm font-medium shadow-lg">
            <span className={`w-2 h-2 rounded-full ${overlayText.includes("ตรวจพบ") ? "bg-emerald-400" : "bg-slate-500"}`} />
            {overlayText}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Data Page ─────────────────────────────────
function DataPage() {
  const [landmarks, setLandmarks] = useState(null);
  const [baseName, setBaseName] = useState("");       // "ปวดหัว"
  const [numSteps, setNumSteps] = useState(1);        // total steps: 1,2,3
  const [currentStep, setCurrentStep] = useState(1); // step being recorded now
  const [status, setStatus] = useState("ready");
  const [savedCount, setSavedCount] = useState(0);
  const [existingLabels, setExistingLabels] = useState([]);

  // Video mode
  const [mode, setMode] = useState("single");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFrames, setRecordedFrames] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [duration, setDuration] = useState(3);
  const recordingRef = useRef(false);
  const framesRef = useRef([]);
  const landmarksRef = useRef(null);
  useEffect(() => { landmarksRef.current = landmarks; }, [landmarks]);

  const fetchLabels = () => {
    fetch(`${API_URL}/signs`)
      .then((r) => r.json())
      .then((d) => setExistingLabels(d || []))
      .catch(() => {});
  };
  useEffect(() => { fetchLabels(); }, []);

  // The actual label sent to backend e.g. "ปวดหัว_2" or "ขอบคุณ" (if 1 step)
  const getLabel = () =>
    numSteps === 1 ? baseName.trim() : `${baseName.trim()}_${currentStep}`;

  // ── Single frame save ──
  const handleSave = async () => {
    if (!landmarks || !baseName.trim()) return;
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: getLabel(), points: landmarks }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStatus("success");
      setSavedCount(data.total_for_label || 0);
      fetchLabels();
      setTimeout(() => setStatus("ready"), 1500);
    } catch {
      alert("ไม่สามารถเชื่อมต่อ Server ได้");
      setStatus("ready");
    }
  };

  // ── Video recording ──
  const startRecording = () => {
    if (!baseName.trim()) { alert("กรุณาใส่ชื่อท่าทางก่อน"); return; }
    framesRef.current = [];
    setRecordedFrames([]);
    recordingRef.current = true;
    setIsRecording(true);
    setCountdown(duration);
    let remaining = duration;
    const timer = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) { clearInterval(timer); stopRecording(); }
    }, 1000);
    const captureInterval = setInterval(() => {
      if (!recordingRef.current) { clearInterval(captureInterval); return; }
      const pts = landmarksRef.current;
      if (pts && pts.length > 0) framesRef.current.push([...pts]);
    }, 100);
    startRecording._timerRef = timer;
    startRecording._captureRef = captureInterval;
  };

  const stopRecording = () => {
    recordingRef.current = false;
    setIsRecording(false);
    clearInterval(startRecording._timerRef);
    clearInterval(startRecording._captureRef);
    setCountdown(0);
    const frames = framesRef.current;
    setRecordedFrames(frames);
    if (frames.length > 0) uploadFrames(frames);
    else alert("ไม่พบท่ามือในคลิป กรุณาลองใหม่");
  };

  const uploadFrames = async (frames) => {
    if (!baseName.trim() || frames.length === 0) return;
    setStatus("saving");
    try {
      const batchSize = 10;
      for (let i = 0; i < frames.length; i += batchSize) {
        await Promise.all(
          frames.slice(i, i + batchSize).map((pts) =>
            fetch(`${API_URL}/upload`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ label: getLabel(), points: pts }),
            })
          )
        );
      }
      setStatus("success");
      setSavedCount(frames.length);
      fetchLabels();
      setTimeout(() => setStatus("ready"), 2000);
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
      setStatus("ready");
    }
  };

  const handleDeleteSign = async (name) => {
    if (!confirm(`ลบท่า "${name}" ทั้งหมด (ทุกขั้นตอน)?`)) return;
    await fetch(`${API_URL}/delete-sign/${encodeURIComponent(name)}`, { method: "DELETE" });
    fetchLabels();
    if (baseName === name) setBaseName("");
  };

  const stepColors = ["blue", "purple", "teal"];
  const stepBg = ["bg-blue-500", "bg-purple-500", "bg-teal-500"];
  const stepLight = ["bg-blue-100 text-blue-700 border-blue-300", "bg-purple-100 text-purple-700 border-purple-300", "bg-teal-100 text-teal-700 border-teal-300"];
  const stepDim = ["border-blue-200 text-blue-400", "border-purple-200 text-purple-400", "border-teal-200 text-teal-400"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Camera */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Camera size={22} /></div>
          มุมมองกล้อง
          {numSteps > 1 && (
            <span className={`ml-auto text-sm font-bold px-3 py-1.5 rounded-full border ${stepLight[currentStep-1]}`}>
              ขั้นตอนที่ {currentStep} / {numSteps}
            </span>
          )}
        </h2>
        <CameraView
          onLandmarks={setLandmarks}
          isRecording={isRecording || status === "saving"}
          overlayText={
            isRecording
              ? `🔴 กำลังบันทึก... ${countdown}s (${framesRef.current.length} เฟรม)`
              : landmarks
              ? `ตรวจพบ ${Math.round(landmarks.length / 63)} มือ`
              : "กรุณายกมือ"
          }
        />

        {/* Step progress bar (multi-step only) */}
        {numSteps > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 mb-3">ขั้นตอนการบันทึก</p>
            <div className="flex items-center gap-2">
              {Array.from({ length: numSteps }, (_, i) => i + 1).map((step) => (
                <React.Fragment key={step}>
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      currentStep === step
                        ? `${stepBg[step-1]} text-white border-transparent shadow-lg`
                        : `bg-white ${stepDim[step-1]} hover:border-opacity-60`
                    }`}
                  >
                    ขั้น {step}
                    {baseName && (
                      <span className="block text-xs font-normal opacity-70 mt-0.5 truncate px-1">
                        {numSteps === 1 ? baseName : `${baseName}_${step}`}
                      </span>
                    )}
                  </button>
                  {step < numSteps && (
                    <ChevronRight size={16} className="text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-sm text-blue-700 flex gap-3">
          <Brain size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold mb-1">
              {numSteps > 1 ? `เคล็ดลับ — ท่าหลายขั้นตอน` : `เคล็ดลับการเก็บข้อมูล`}
            </p>
            <ul className="space-y-1 text-blue-600/80 text-xs list-disc list-inside">
              {numSteps > 1 ? (
                <>
                  <li>บันทึกแต่ละขั้นตอนแยกกัน กดปุ่มขั้นตอนด้านบนเพื่อสลับ</li>
                  <li>แต่ละขั้นตอนควรมีอย่างน้อย 20 ตัวอย่าง</li>
                  <li>ท่าที่ขั้นต้นคล้ายกัน ต้องบันทึกขั้นต้นให้ต่างกันชัดเจน</li>
                </>
              ) : (
                <>
                  <li>บันทึกท่าเดิมอย่างน้อย 20–50 ครั้ง</li>
                  <li>ลองเปลี่ยนมุมมือเล็กน้อยในแต่ละครั้ง</li>
                  <li>แสงสว่างดีจะช่วยให้ตรวจจับได้ดีขึ้น</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="lg:w-96 space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-5">
            <Database className="text-blue-500" size={22} />
            บันทึกท่ามือ
          </h2>

          {/* Mode toggle */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-5">
            <button
              onClick={() => { setMode("single"); setIsRecording(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "single" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
            >
              <Save size={15} /> ทีละเฟรม
            </button>
            <button
              onClick={() => { setMode("video"); setIsRecording(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "video" ? "bg-white text-red-500 shadow-sm" : "text-slate-500"}`}
            >
              <Activity size={15} /> วิดีโอ
            </button>
          </div>

          <div className="space-y-4">
            {/* Base name */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">ชื่อท่าทาง</label>
                {baseName && (
                  <button onClick={() => setBaseName("")} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1">
                    <X size={11} /> ล้าง
                  </button>
                )}
              </div>
              <input
                type="text"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                placeholder="เช่น ปวดหัว, ขอบคุณ..."
                disabled={isRecording}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-sm disabled:opacity-50"
              />
            </div>

            {/* Number of steps selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">จำนวนขั้นตอน</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setNumSteps(n); setCurrentStep(1); }}
                    disabled={isRecording}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all disabled:opacity-40 ${
                      numSteps === n
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                        : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {n === 1 ? "1 ขั้น" : `${n} ขั้น`}
                  </button>
                ))}
              </div>
              {numSteps > 1 && baseName && (
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-600">Labels ที่จะบันทึก:</p>
                  {Array.from({ length: numSteps }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full ${stepBg[i]} text-white text-xs flex items-center justify-center font-bold`}>{i+1}</span>
                      <span className="font-mono">{baseName}_{i+1}</span>
                      {currentStep === i+1 && <span className="text-blue-500 font-semibold">← กำลังบันทึก</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step selector (when multi-step) */}
            {numSteps > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">บันทึกขั้นตอนที่</label>
                <div className="flex gap-2">
                  {Array.from({ length: numSteps }, (_, i) => i + 1).map((step) => (
                    <button
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      disabled={isRecording}
                      className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all disabled:opacity-40 ${
                        currentStep === step
                          ? `${stepBg[step-1]} text-white border-transparent shadow-md`
                          : `bg-white ${stepDim[step-1]} hover:opacity-80`
                      }`}
                    >
                      ขั้น {step}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick select from existing */}
            {existingLabels.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">เลือกจากที่มีอยู่:</p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {existingLabels.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => { setBaseName(item.name); setNumSteps(item.steps); setCurrentStep(1); }}
                      disabled={isRecording}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all disabled:opacity-40 ${
                        baseName === item.name
                          ? "bg-blue-100 border-blue-300 text-blue-700 font-semibold"
                          : "bg-white border-slate-200 text-slate-500 hover:border-blue-200"
                      }`}
                    >
                      {item.name}
                      {item.steps > 1 && <span className="bg-slate-200 text-slate-600 px-1.5 rounded-full">{item.steps} ขั้น</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current label preview */}
            {baseName && (
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
                <span className="text-xs text-slate-400">Label:</span>
                <span className="font-mono text-sm font-bold text-slate-700">{getLabel()}</span>
              </div>
            )}

            {/* Save button — single mode */}
            {mode === "single" && (
              <button
                onClick={handleSave}
                disabled={!landmarks || !baseName.trim() || status === "saving"}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold transition-all active:scale-95 ${
                  status === "success"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                }`}
              >
                {status === "saving" && <Loader2 className="animate-spin" size={18} />}
                {status === "success" && <CheckCircle size={18} />}
                {status === "ready" && <Save size={18} />}
                {status === "success" ? `บันทึกแล้ว! (รวม ${savedCount} ตย.)` : `บันทึก${numSteps > 1 ? ` ขั้น ${currentStep}` : ""}`}
              </button>
            )}

            {/* Video mode */}
            {mode === "video" && (
              <div className="space-y-3">
                {!isRecording && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium shrink-0">ระยะเวลา:</span>
                    <div className="flex gap-2">
                      {[2, 3, 5, 8].map((s) => (
                        <button key={s} onClick={() => setDuration(s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${duration === s ? "bg-red-100 border-red-300 text-red-600" : "bg-white border-slate-200 text-slate-500"}`}>
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {isRecording && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                    <div className="text-4xl font-black text-red-500 mb-1">{countdown}</div>
                    <div className="text-xs text-red-400 font-medium">วินาทีที่เหลือ</div>
                    <div className="mt-2 w-full bg-red-100 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${(countdown / duration) * 100}%` }} />
                    </div>
                    <div className="text-xs text-red-400 mt-2">จับได้ {framesRef.current.length} เฟรมแล้ว</div>
                  </div>
                )}
                {!isRecording && status === "success" && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                    <CheckCircle className="text-emerald-500 mx-auto mb-1" size={24} />
                    <p className="text-emerald-700 font-bold text-sm">บันทึกสำเร็จ! {savedCount} เฟรม</p>
                  </div>
                )}
                {!isRecording && status === "saving" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                    <Loader2 className="animate-spin text-blue-500 mx-auto mb-1" size={24} />
                    <p className="text-blue-600 text-sm font-medium">กำลังอัปโหลด {recordedFrames.length} เฟรม...</p>
                  </div>
                )}
                {status !== "saving" && (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!baseName.trim() || status === "saving"}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold transition-all active:scale-95 ${
                      isRecording
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                        : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                    }`}
                  >
                    {isRecording ? (
                      <><div className="w-4 h-4 bg-white rounded-sm" />หยุดบันทึก</>
                    ) : (
                      <><div className="w-4 h-4 bg-white rounded-full" />บันทึก{numSteps > 1 ? ` ขั้น ${currentStep}` : ""} ({duration}s)</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Existing signs list */}
        {existingLabels.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <BarChart2 size={16} className="text-slate-400" />
              ท่าทางในระบบ
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {existingLabels.map((item) => (
                <div key={item.name} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
                      {item.steps > 1 && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                          {item.steps} ขั้นตอน
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSign(item.name)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {/* Per-step counts */}
                  <div className={`grid gap-1 ${item.steps > 1 ? `grid-cols-${item.steps}` : "grid-cols-1"}`}>
                    {Array.from({ length: item.steps }, (_, i) => {
                      const cnt = item.counts[String(i+1)] || 0;
                      return (
                        <div key={i}>
                          {item.steps > 1 && <p className="text-xs text-slate-400 mb-0.5">ขั้น {i+1}: {cnt}</p>}
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${["bg-blue-400","bg-purple-400","bg-teal-400"][i]}`}
                              style={{ width: `${Math.min(100, (cnt/30)*100)}%` }}
                            />
                          </div>
                          {item.steps === 1 && <p className="text-xs text-slate-400 mt-0.5">{cnt} ตย.</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">* แนะนำ 20+ ตย. ต่อขั้นตอน</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dictionary Page ───────────────────────────
function DictionaryPage() {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => { setLabels(d.labels || []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const filtered = labels.filter((l) =>
    l.label.toLowerCase().includes(search.toLowerCase())
  );
  const maxCount = Math.max(...labels.map((l) => l.count), 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-purple-500" size={28} />
            คลังคำศัพท์ในระบบ
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            ท่าทางทั้งหมดที่ AI เรียนรู้แล้ว — {labels.length} ท่า
          </p>
        </div>
        {labels.length > 0 && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาคำ..."
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all text-sm w-full sm:w-56"
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 border border-red-100">
          <ServerCrash size={20} /> ไม่สามารถดึงข้อมูลได้
        </div>
      ) : labels.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Database className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">ยังไม่มีข้อมูลในระบบ</p>
          <p className="text-slate-400 text-sm mt-1">ไปที่เมนู "สอนท่ามือ" เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="h-11 w-11 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold text-lg group-hover:bg-purple-200 transition-colors">
                  {item.label.charAt(0).toUpperCase()}
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    item.count >= 20
                      ? "bg-emerald-100 text-emerald-700"
                      : item.count >= 10
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.count} ตัวอย่าง
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">
                {item.label}
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>ความพร้อมของโมเดล</span>
                  <span>{Math.min(100, Math.round((item.count / 30) * 100))}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.count >= 20 ? "bg-emerald-400" : item.count >= 10 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${Math.min(100, (item.count / 30) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Predict Page ──────────────────────────────
function PredictPage() {
  const [signs, setSigns] = useState([]);  // [{name, steps, counts}]
  const [selectedSign, setSelectedSign] = useState(null); // sign being predicted
  const [currentStep, setCurrentStep] = useState(1);
  const [stepResults, setStepResults] = useState({}); // {1: {label,confidence}, 2: ...}
  const [finalResult, setFinalResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState(false);
  const [recentWords, setRecentWords] = useState([]);
  const [mode, setMode] = useState("auto"); // "auto" | "manual"
  const lastSentRef = useRef(0);

  useEffect(() => {
    fetch(`${API_URL}/signs`)
      .then((r) => r.json())
      .then((d) => setSigns(d || []))
      .catch(() => {});
  }, []);

  const stepColors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-teal-500 to-teal-600",
  ];
  const stepBadge = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-teal-100 text-teal-700 border-teal-200",
  ];

  const totalSteps = selectedSign ? selectedSign.steps : 0;

  // ── Auto mode: predict current step, advance automatically ──
  const handleLandmarksAuto = async (points) => {
    if (!points || !selectedSign) return;
    const now = Date.now();
    if (now - lastSentRef.current < 400) return;
    lastSentRef.current = now;
    setIsPredicting(true);
    try {
      const res = await fetch(`${API_URL}/predict-step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: String(currentStep), points }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setError(false);

      // Check if this step matches our selected sign
      const expectedLabel = totalSteps === 1
        ? selectedSign.name
        : `${selectedSign.name}_${currentStep}`;

      if (data.label === expectedLabel && data.confidence > 0.65) {
        const newResults = { ...stepResults, [currentStep]: data };
        setStepResults(newResults);

        if (currentStep < totalSteps) {
          // move to next step
          setCurrentStep((s) => s + 1);
        } else {
          // all steps done!
          const avgConf = Object.values(newResults).reduce((a, b) => a + b.confidence, 0) / totalSteps;
          setFinalResult({ name: selectedSign.name, confidence: avgConf });
          setRecentWords((prev) => [selectedSign.name, ...prev].slice(0, 10));
          // reset after 3s
          setTimeout(() => {
            setCurrentStep(1);
            setStepResults({});
            setFinalResult(null);
          }, 3000);
        }
      }
    } catch {
      setError(true);
    } finally {
      setIsPredicting(false);
    }
  };

  // ── Manual mode: predict without selecting a sign ──
  const handleLandmarksManual = async (points) => {
    if (!points) return;
    const now = Date.now();
    if (now - lastSentRef.current < 400) return;
    lastSentRef.current = now;
    setIsPredicting(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setError(false);
      if (data.confidence > 0.6 && !["ไม่รู้จักท่าทาง","ไม่พบมือ","ไม่มีข้อมูลสอน"].includes(data.base)) {
        setFinalResult({ name: data.base, confidence: data.confidence, step: data.step });
        setRecentWords((prev) => {
          if (prev[0] === data.base) return prev;
          return [data.base, ...prev].slice(0, 10);
        });
      }
    } catch { setError(true); }
    finally { setIsPredicting(false); }
  };

  const handleLandmarks = mode === "auto" ? handleLandmarksAuto : handleLandmarksManual;

  const resetPrediction = () => {
    setCurrentStep(1);
    setStepResults({});
    setFinalResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm border border-red-100">
          <ServerCrash size={18} />
          <span className="font-medium">ไม่สามารถเชื่อมต่อ Server</span>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-xl text-cyan-400"><Activity size={20} /></div>
          แปลภาษามือ
        </h2>
        <div className="ml-auto flex bg-slate-100 rounded-2xl p-1">
          <button
            onClick={() => { setMode("auto"); resetPrediction(); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "auto" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
          >
            เลือกท่า
          </button>
          <button
            onClick={() => { setMode("manual"); resetPrediction(); setSelectedSign(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "manual" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
          >
            อัตโนมัติ
          </button>
        </div>
      </div>

      {/* Sign selector (auto mode) */}
      {mode === "auto" && signs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-600 mb-3">เลือกท่าที่จะแปล:</p>
          <div className="flex flex-wrap gap-2">
            {signs.map((s) => (
              <button
                key={s.name}
                onClick={() => { setSelectedSign(s); resetPrediction(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border-2 font-medium transition-all ${
                  selectedSign?.name === s.name
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {s.name}
                {s.steps > 1 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    selectedSign?.name === s.name ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
                  }`}>
                    {s.steps} ขั้น
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Camera */}
        <div className="lg:col-span-3">
          <CameraView
            onLandmarks={handleLandmarks}
            isRecording={isPredicting}
            overlayText={
              finalResult ? `✅ ${finalResult.name}!` :
              selectedSign && mode === "auto" ? `ทำท่า: ${selectedSign.name} — ขั้น ${currentStep}/${totalSteps}` :
              isPredicting ? "กำลังวิเคราะห์..." : "พร้อมแปล"
            }
            showSkeleton
          />
        </div>

        {/* Result panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Multi-step progress (auto mode) */}
          {mode === "auto" && selectedSign && totalSteps > 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-slate-700">ความคืบหน้า</p>
                <button onClick={resetPrediction} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                  <RefreshCw size={12} /> รีเซ็ต
                </button>
              </div>
              <div className="space-y-2">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                  const done = stepResults[step];
                  const active = currentStep === step && !finalResult;
                  return (
                    <div key={step} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? "bg-blue-50 border border-blue-100" : done ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-100"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? "bg-emerald-500 text-white" : active ? `bg-gradient-to-br ${stepColors[i]} text-white animate-pulse` : "bg-slate-200 text-slate-500"}`}>
                        {done ? "✓" : step}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-600">ขั้นตอนที่ {step}</p>
                        <p className="text-xs font-mono text-slate-400">{totalSteps === 1 ? selectedSign.name : `${selectedSign.name}_${step}`}</p>
                      </div>
                      {done && (
                        <span className="text-xs text-emerald-600 font-bold">{Math.round(done.confidence * 100)}%</span>
                      )}
                      {active && !done && (
                        <span className="text-xs text-blue-500 font-bold animate-pulse">รอ...</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main result card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ผลลัพธ์</span>
              {isPredicting
                ? <RefreshCw size={15} className="text-blue-500 animate-spin" />
                : <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              }
            </div>

            {finalResult ? (
              <div className="text-center py-4">
                <div className="text-6xl mb-3">🎉</div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                  {finalResult.name}
                </div>
                <p className="text-emerald-600 font-bold text-sm">
                  ความมั่นใจ {Math.round(finalResult.confidence * 100)}%
                </p>
              </div>
            ) : mode === "auto" && selectedSign ? (
              <div className="text-center py-4">
                <div className={`text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r ${stepColors[currentStep-1]}`}>
                  ขั้น {currentStep}
                </div>
                <p className="text-slate-500 text-sm">ทำท่า <strong>{totalSteps === 1 ? selectedSign.name : `${selectedSign.name}_${currentStep}`}</strong></p>
                <p className="text-slate-400 text-xs mt-1">ค้างท่าให้ AI จับภาพ</p>
              </div>
            ) : (
              <div>
                <div className={`text-5xl font-extrabold mb-4 tracking-tight ${finalResult ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500" : "text-slate-300"}`}>
                  {mode === "manual" && finalResult ? finalResult.name : "—"}
                </div>
                <p className="text-xs text-slate-400">
                  {mode === "auto" ? "เลือกท่าด้านบนก่อนเริ่มแปล" : "เปิดกล้องแล้วทำท่ามือ"}
                </p>
              </div>
            )}
          </div>

          {/* Recent words */}
          {recentWords.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-500" />
                  คำที่แปลล่าสุด
                </h3>
                <button onClick={() => setRecentWords([])} className="text-xs text-slate-400 hover:text-red-500">ล้าง</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentWords.map((w, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium ${i === 0 ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-slate-100 text-slate-600"}`}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── History Page ──────────────────────────────
function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHistory = () => {
    setLoading(true);
    fetch(`${API_URL}/history?limit=100`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setHistory(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleClear = async () => {
    if (!confirm("ลบประวัติทั้งหมด?")) return;
    await fetch(`${API_URL}/history/clear`, { method: "DELETE" });
    setHistory([]);
  };

  // Build summary
  const summary = history.reduce((acc, h) => {
    acc[h.label] = (acc[h.label] || 0) + 1;
    return acc;
  }, {});
  const topWords = Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <History className="text-teal-500" size={28} />
            ประวัติการแปล
          </h2>
          <p className="text-slate-500 mt-1 text-sm">การแปลที่บันทึกอัตโนมัติจากการใช้งาน</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} /> รีเฟรช
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm hover:bg-red-100 transition-all"
            >
              <Trash2 size={14} /> ล้างประวัติ
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-teal-500 w-10 h-10" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 border border-red-100">
          <ServerCrash size={20} /> ไม่สามารถดึงข้อมูลได้
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <History className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">ยังไม่มีประวัติ</p>
          <p className="text-slate-400 text-sm mt-1">ลองใช้งานหน้า "แปลภาษา" ก่อน</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top words */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-fit">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-500" />
              คำที่ใช้บ่อยสุด
            </h3>
            <div className="space-y-3">
              {topWords.map(([word, count], i) => (
                <div key={word} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{word}</span>
                      <span className="text-slate-400 text-xs">{count}x</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-teal-400 h-1.5 rounded-full"
                        style={{ width: `${(count / topWords[0][1]) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
              รวมทั้งหมด {history.length} รายการ
            </div>
          </div>

          {/* Log */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-700">บันทึกล่าสุด</h3>
              <span className="text-xs text-slate-400">{history.length} รายการ</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{h.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        h.confidence > 0.8
                          ? "bg-emerald-100 text-emerald-700"
                          : h.confidence > 0.5
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {Math.round(h.confidence * 100)}%
                    </span>
                    <span>
                      {h.created_at
                        ? new Date(h.created_at).toLocaleString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Password Gate ─────────────────────────────
// 🔑 เปลี่ยนรหัสผ่านได้ที่นี่
const DATA_PASSWORD = "ramflukegrit";

function PasswordGate({ onSuccess }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (input === DATA_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div
        className={`bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 w-full max-w-sm transition-transform ${
          shake ? "animate-[wiggle_0.4s_ease-in-out]" : ""
        }`}
      >
        <style>{`
          @keyframes wiggle {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-10px); }
            40%      { transform: translateX(10px); }
            60%      { transform: translateX(-8px); }
            80%      { transform: translateX(8px); }
          }
        `}</style>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
            error ? "bg-red-100" : "bg-blue-100"
          }`}>
            {error ? "🔒" : "🔐"}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 text-center mb-1">
          พื้นที่ผู้ดูแลระบบ
        </h2>
        <p className="text-slate-500 text-sm text-center mb-6">
          กรุณาใส่รหัสผ่านเพื่อเข้าสอนท่ามือ
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={show ? "text" : "password"}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="ใส่รหัสผ่าน..."
              className={`w-full px-4 py-3.5 pr-12 rounded-2xl border text-slate-800 font-medium outline-none transition-all text-sm ${
                error
                  ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-300/30"
                  : "border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              }`}
            />
            <button
              onClick={() => setShow((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-lg"
              tabIndex={-1}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center flex items-center justify-center gap-1.5">
              <AlertCircle size={14} /> รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!input}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-95"
          >
            เข้าสู่ระบบ
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-5">
          เฉพาะผู้ดูแลระบบเท่านั้น
        </p>
      </div>
    </div>
  );
}

// ── App Root ──────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [dataUnlocked, setDataUnlocked] = useState(false);

  // When leaving the data page, lock it again (optional — remove if you want to stay unlocked)
  const handleSetPage = (p) => {
    setPage(p);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-16 selection:bg-blue-100 selection:text-blue-900">
      <style>{`
        @keyframes scan {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
      <Navbar page={page} setPage={handleSetPage} />
      <main>
        {page === "home"       && <HomePage setPage={handleSetPage} />}
        {page === "data"       && (
          dataUnlocked
            ? <DataPage />
            : <PasswordGate onSuccess={() => setDataUnlocked(true)} />
        )}
        {page === "dictionary" && <DictionaryPage />}
        {page === "predict"    && <PredictPage />}
        {page === "history"    && <HistoryPage />}
      </main>
    </div>
  );
}
