// FULL FRONTEND CODE ALIGNED WITH 60-FRAME BACKEND
// Endpoints:
// POST /upload-sequence
// POST /predict-sequence
// GET  /dataset

import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Loader2, Camera, Hand, Database, Activity, BookOpen } from "lucide-react";

const API_URL = "https://sign-ai-project-backend.onrender.com";

// ================= HAND TRACKING HOOK =================
const useHandTracking = (videoRef, onResults) => {
  const landmarkerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
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
    })();
    return () => (mounted = false);
  }, []);

  const loop = () => {
    const v = videoRef.current;
    if (v && landmarkerRef.current && v.readyState >= 2) {
      const res = landmarkerRef.current.detectForVideo(v, performance.now(), {
        imageWidth: v.videoWidth,
        imageHeight: v.videoHeight,
      });
      onResults(res);
    }
    requestAnimationFrame(loop);
  };

  return { loading, start: loop };
};

// ================= CAMERA VIEW =================
function CameraView({ onLandmarks, overlay }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);

  const { loading, start } = useHandTracking(videoRef, (res) => {
    const c = canvasRef.current;
    const v = videoRef.current;
    if (!c || !v) return;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-c.width, 0);

    if (res.landmarks?.length) {
      const flat = res.landmarks.flatMap((h) =>
        h.flatMap((p) => [p.x, p.y, p.z])
      );
      onLandmarks(flat);
      res.landmarks.forEach((h) =>
        h.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x * c.width, p.y * c.height, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#3b82f6";
          ctx.fill();
        })
      );
    }
    ctx.restore();
  });

  const startCam = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = s;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();
      setActive(true);
      start();
    };
  };

  return (
    <div className="relative bg-black rounded-3xl overflow-hidden aspect-video">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {!loading && !active && (
        <button
          onClick={startCam}
          className="absolute inset-0 bg-black/60 text-white font-bold"
        >
          <Camera /> เปิดกล้อง
        </button>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />
      {overlay && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full">
          {overlay}
        </div>
      )}
    </div>
  );
}

// ================= DATA PAGE =================
function DataPage() {
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("idle");
  const frames = useRef([]);

  const onLandmarks = (p) => {
    if (status === "record" && p) {
      frames.current.push(p);
      if (frames.current.length === 60) upload();
    }
  };

  const upload = async () => {
    setStatus("upload");
    await fetch(`${API_URL}/upload-sequence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, frames: frames.current }),
    });
    frames.current = [];
    setStatus("idle");
    setLabel("");
  };

  return (
    <div className="p-6 space-y-4">
      <CameraView onLandmarks={onLandmarks} overlay={status} />
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="ชื่อท่ามือ"
        className="border p-3 rounded w-full"
      />
      <button
        onClick={() => setStatus("record")}
        className="bg-blue-600 text-white p-3 rounded w-full"
      >
        บันทึก 60 เฟรม
      </button>
    </div>
  );
}

// ================= PREDICT PAGE =================
function PredictPage() {
  const [result, setResult] = useState({ label: "...", confidence: 0 });
  const buffer = useRef([]);

  const onLandmarks = async (p) => {
    if (!p) return;
    buffer.current.push(p);
    if (buffer.current.length < 60) return;
    if (buffer.current.length > 60) buffer.current.shift();

    const r = await fetch(`${API_URL}/predict-sequence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frames: buffer.current }),
    });
    if (r.ok) setResult(await r.json());
  };

  return (
    <div className="p-6 space-y-6">
      <CameraView onLandmarks={onLandmarks} overlay="แปลภาษา" />
      <div className="text-center">
        <h1 className="text-4xl font-bold">{result.label}</h1>
        <p>{Math.round(result.confidence * 100)}%</p>
      </div>
    </div>
  );
}

// ================= MAIN =================
export default function App() {
  const [page, setPage] = useState("data");

  return (
    <div>
      <nav className="flex gap-4 p-4">
        <button onClick={() => setPage("data")}><Database /></button>
        <button onClick={() => setPage("predict")}><Activity /></button>
      </nav>
      {page === "data" && <DataPage />}
      {page === "predict" && <PredictPage />}
    </div>
  );
}
