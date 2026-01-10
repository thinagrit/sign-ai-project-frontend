<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ระบบแปลภาษามือทางการแพทย์ (AI Medical Sign)</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts (Sarabun) -->
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- MediaPipe Hands & Camera Utils -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>

    <style>
        body { font-family: 'Sarabun', sans-serif; }
        .canvas-container {
            position: relative;
            width: 100%;
            max-width: 640px;
            aspect-ratio: 16/9;
            margin: 0 auto;
            border-radius: 1rem;
            overflow: hidden;
            background-color: #000;
        }
        video {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            object-fit: cover;
            transform: scaleX(-1); /* กลับด้านกระจก */
        }
        canvas {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            transform: scaleX(-1); /* กลับด้านกระจกเพื่อให้ตรงกับวิดีโอ */
        }
    </style>
</head>
<body class="bg-slate-100 min-h-screen p-4 flex flex-col items-center">

    <!-- Header -->
    <header class="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">🏥 AI แปลภาษามือทางการแพทย์</h1>
            <p class="text-slate-500 text-sm">ระบบช่วยเหลือผู้ป่วยผ่านกล้อง Webcam</p>
        </div>
        <div id="status-indicator" class="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
            <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            กำลังโหลดโมเดล...
        </div>
    </header>

    <main class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Column: Camera -->
        <div class="flex flex-col gap-4">
            <div class="canvas-container shadow-lg border-4 border-white">
                <video id="input_video" playsinline></video>
                <canvas id="output_canvas"></canvas>
            </div>
            
            <!-- Real-time Result -->
            <div class="bg-white p-4 rounded-xl shadow-sm text-center">
                <p class="text-slate-400 text-xs uppercase tracking-wider mb-1">ผลการทำนายปัจจุบัน</p>
                <h2 id="result-label" class="text-3xl font-bold text-indigo-600">-</h2>
                <p id="result-conf" class="text-slate-500 text-sm mt-1">ความมั่นใจ: 0%</p>
            </div>
        </div>

        <!-- Right Column: Controls -->
        <div class="flex flex-col gap-6">
            
            <!-- Training Section -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    เพิ่มข้อมูลท่าทางใหม่ (Training)
                </h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อท่าทาง (ภาษาไทย)</label>
                        <input type="text" id="label-input" placeholder="เช่น ปวดหัว, หิวน้ำ, เจ็บหน้าอก" 
                            class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                    </div>
                    
                    <button onclick="saveCurrentGesture()" 
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition transform active:scale-95 flex justify-center items-center gap-2">
                        <span>บันทึกท่าทางนี้</span>
                    </button>
                    
                    <p class="text-xs text-slate-400 text-center">
                        * ยกมือค้างไว้หน้ากล้อง แล้วกดปุ่มบันทึก
                    </p>
                </div>
            </div>

            <!-- API Config (Optional) -->
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label class="block text-xs font-bold text-slate-500 mb-2">API ENDPOINT</label>
                <input type="text" id="api-url" value="http://localhost:8000" 
                    class="w-full bg-white px-3 py-1 text-sm border border-slate-300 rounded text-slate-600">
            </div>

             <!-- Logs / Messages -->
             <div id="message-log" class="hidden p-3 rounded-lg text-sm"></div>
        </div>
    </main>

    <script>
        // --- Configuration ---
        const videoElement = document.getElementById('input_video');
        const canvasElement = document.getElementById('output_canvas');
        const canvasCtx = canvasElement.getContext('2d');
        const resultLabel = document.getElementById('result-label');
        const resultConf = document.getElementById('result-conf');
        const statusIndicator = document.getElementById('status-indicator');

        // State variables
        let currentLandmarks = null;
        let lastPredictionTime = 0;
        const PREDICTION_INTERVAL = 200; // ทำนายทุกๆ 200ms (ลดภาระ Server)

        // --- Helper Functions ---
        function getApiUrl() {
            return document.getElementById('api-url').value.replace(/\/$/, '');
        }

        function showStatus(text, type = 'normal') {
            const el = statusIndicator;
            el.innerHTML = `<span class="w-2 h-2 rounded-full ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} animate-pulse"></span> ${text}`;
            el.className = `flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
        }

        function showMessage(msg, isError = false) {
            const log = document.getElementById('message-log');
            log.textContent = msg;
            log.className = `p-3 rounded-lg text-sm mb-4 block ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
            setTimeout(() => { log.classList.add('hidden'); }, 3000);
        }

        // --- MediaPipe Hand Tracking ---
        function onResults(results) {
            // ปรับขนาด Canvas ให้ตรงกับ Video
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            
            // วาดภาพจากกล้อง
            // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // (ถ้าต้องการวาดภาพวิดีโอบน canvas ด้วย)

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                // เอาแค่มือแรกที่เจอ (เพื่อความง่าย)
                const landmarks = results.multiHandLandmarks[0];
                
                // วาดเส้นโครงกระดูกมือ
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 3});
                drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1, radius: 4});

                // แปลงข้อมูลเป็น Flat Array [x, y, z, x, y, z, ...] เพื่อส่ง API
                currentLandmarks = [];
                for (const lm of landmarks) {
                    currentLandmarks.push(lm.x, lm.y, lm.z);
                }

                // สั่งทำนาย (Throttle request เพื่อไม่ให้รัวเกินไป)
                const now = Date.now();
                if (now - lastPredictionTime > PREDICTION_INTERVAL) {
                    predictSign(currentLandmarks);
                    lastPredictionTime = now;
                }
            } else {
                currentLandmarks = null;
                resultLabel.textContent = "-";
                resultConf.textContent = "รอการตรวจจับมือ...";
            }
            canvasCtx.restore();
        }

        const hands = new Hands({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }});

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        // --- Camera Setup ---
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({image: videoElement});
            },
            width: 1280,
            height: 720
        });

        camera.start()
            .then(() => showStatus("ระบบพร้อมใช้งาน", "success"))
            .catch(e => showStatus("ไม่สามารถเปิดกล้องได้", "error"));

        // --- API Interactions ---
        
        // 1. Predict
        async function predictSign(points) {
            try {
                const response = await fetch(`${getApiUrl()}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points: points })
                });
                
                if (!response.ok) throw new Error("API Error");
                
                const data = await response.json();
                resultLabel.textContent = data.label;
                resultConf.textContent = `ความมั่นใจ: ${(data.confidence * 100).toFixed(1)}%`;
                
                // เปลี่ยนสีข้อความตามความมั่นใจ
                if(data.label === "ไม่รู้จัก" || data.label === "ไม่แน่ใจ") {
                    resultLabel.className = "text-3xl font-bold text-slate-400";
                } else {
                    resultLabel.className = "text-3xl font-bold text-indigo-600";
                }

            } catch (error) {
                console.error("Prediction error:", error);
                resultConf.textContent = "การเชื่อมต่อ API ขัดข้อง";
            }
        }

        // 2. Upload / Save
        async function saveCurrentGesture() {
            const labelInput = document.getElementById('label-input');
            const label = labelInput.value.trim();

            if (!currentLandmarks) {
                showMessage("❌ ไม่พบมือในกล้อง กรุณายกมือค้างไว้", true);
                return;
            }
            
            if (!label) {
                showMessage("❌ กรุณาระบุชื่อท่าทาง", true);
                labelInput.focus();
                return;
            }

            try {
                const response = await fetch(`${getApiUrl()}/upload`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        label: label,
                        points: currentLandmarks
                    })
                });

                if (response.ok) {
                    showMessage(`✅ บันทึกท่า "${label}" เรียบร้อยแล้ว!`);
                    labelInput.value = ""; // Clear input
                } else {
                    const err = await response.json();
                    throw new Error(err.detail || "Upload failed");
                }
            } catch (error) {
                showMessage(`❌ บันทึกไม่สำเร็จ: ${error.message}`, true);
            }
        }
    </script>
</body>
</html>
