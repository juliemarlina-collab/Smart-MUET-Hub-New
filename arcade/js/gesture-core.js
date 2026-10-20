/* Smart MUET · Arcade gesture engine (SMHGesture).
   One shared hand tracker for every Arcade game. Uses MediaPipe Hand Landmarker,
   loaded only when the student turns on camera mode. Video is processed on the
   device: nothing is recorded, stored or uploaded.
   Emits one hand state per video frame:
   { present, x, y (0–1, mirrored like a selfie), pinch, fist, open, pointing } */
(() => {
  "use strict";
  if (window.SMHGesture) return;
  const VER = "0.10.14",
    BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@" + VER,
    MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

  let landmarker = null,
    stream = null,
    video = null,
    running = false,
    raf = 0,
    lastTime = -1,
    listener = null,
    smooth = null,
    st = { pinch: false, fist: false };

  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));

  async function loadModel(status) {
    if (landmarker) return landmarker;
    status("Loading the hand tracker (about 8 MB, first time only)…");
    const vision = await import(BASE + "/vision_bundle.mjs");
    const files = await vision.FilesetResolver.forVisionTasks(BASE + "/wasm");
    const make = (delegate) =>
      vision.HandLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: MODEL, delegate },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
      });
    try {
      landmarker = await make("GPU");
    } catch {
      landmarker = await make("CPU");
    }
    return landmarker;
  }

  function classify(lm) {
    const wrist = lm[0],
      size = d(wrist, lm[9]) || 0.0001;
    // Pinch: thumb tip close to index tip (with hysteresis so it does not flicker)
    const pinchRatio = d(lm[4], lm[8]) / size;
    if (!st.pinch && pinchRatio < 0.33) st.pinch = true;
    else if (st.pinch && pinchRatio > 0.5) st.pinch = false;
    // Finger extended when its tip is clearly further from the wrist than its middle joint
    const ext = [
      [8, 6],
      [12, 10],
      [16, 14],
      [20, 18],
    ].map(([tip, pip]) => d(lm[tip], wrist) > d(lm[pip], wrist) * 1.12);
    const count = ext.filter(Boolean).length;
    if (!st.fist && count === 0 && pinchRatio > 0.25) st.fist = true;
    else if (st.fist && count >= 2) st.fist = false;
    // Cursor: between thumb and index while pinching, else the index fingertip
    // palm mode (fist games) follows the knuckles so the cursor does not jump when the hand closes
    const raw =
      api.cursor === "palm" ? { x: (lm[0].x + lm[9].x) / 2, y: (lm[0].y + lm[9].y) / 2 } : st.pinch ? { x: (lm[4].x + lm[8].x) / 2, y: (lm[4].y + lm[8].y) / 2 } : lm[8];
    const p = { x: 1 - raw.x, y: raw.y };
    smooth = smooth ? { x: smooth.x + (p.x - smooth.x) * 0.55, y: smooth.y + (p.y - smooth.y) * 0.55 } : p;
    return {
      present: true,
      x: smooth.x,
      y: smooth.y,
      pinch: st.pinch,
      fist: st.fist,
      open: count >= 4,
      pointing: ext[0] && !ext[1] && !ext[2],
    };
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (!video || video.readyState < 2 || video.currentTime === lastTime) return;
    lastTime = video.currentTime;
    let res;
    try {
      res = landmarker.detectForVideo(video, performance.now());
    } catch {
      return;
    }
    const lm = res && res.landmarks && res.landmarks[0];
    if (lm) listener && listener(classify(lm));
    else {
      smooth = null;
      st = { pinch: false, fist: false };
      listener && listener({ present: false });
    }
  }

  async function start(videoEl, onHand, status = () => {}) {
    if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera mode needs a secure (https) page and a browser with camera access.");
    }
    video = videoEl;
    listener = onHand;
    status("Asking for your camera…");
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();
    await loadModel(status);
    status("Show one hand to the camera.");
    running = true;
    lastTime = -1;
    loop();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    if (video) video.srcObject = null;
    smooth = null;
    st = { pinch: false, fist: false };
  }

  const api = { start, stop, isRunning: () => running, cursor: "tip" };
  window.SMHGesture = api;
})();
