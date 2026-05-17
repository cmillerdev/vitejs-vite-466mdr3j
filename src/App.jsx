import { useState, useRef, useEffect, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #1a1008; min-height: 100vh; font-family: 'Space Mono', monospace; }

.app { min-height: 100vh; background: #1a1008; color: #f5e6c8; }

.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* HEADER */
.header {
  background: #f5e6c8; color: #1a1008; padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 3px solid #d4a843;
  position: sticky; top: 0; z-index: 50;
}
.logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; color: #1a1008; }
.logo span { color: #c0392b; }
.nav-btn {
  background: #1a1008; color: #f5e6c8; border: none; padding: 6px 14px;
  font-family: 'Space Mono', monospace; font-size: 11px; cursor: pointer;
  border-radius: 2px; transition: background 0.15s;
}
.nav-btn:hover { background: #c0392b; }
.nav-btn.active { background: #c0392b; }

/* FILM STRIP */
.filmstrip {
  height: 28px; background: #111; display: flex; align-items: center;
  overflow: hidden; gap: 0; border-bottom: 2px solid #333;
}
.sprocket {
  width: 18px; height: 12px; background: #1a1008; border-radius: 2px;
  flex-shrink: 0; margin: 0 4px; border: 1px solid #444;
}

/* HERO / HOME */
.hero {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; padding: 40px 20px; text-align: center; gap: 24px;
}
.hero-title {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 12vw, 96px);
  line-height: 0.9; letter-spacing: 3px; color: #f5e6c8;
}
.hero-title .red { color: #c0392b; }
.hero-sub { font-size: 11px; color: #a09070; letter-spacing: 2px; text-transform: uppercase; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }

.btn-primary {
  background: #c0392b; color: #fff; border: none; padding: 14px 32px;
  font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 2px;
  cursor: pointer; border-radius: 2px; transition: transform 0.1s, background 0.15s;
}
.btn-primary:hover { background: #e74c3c; transform: translateY(-1px); }
.btn-primary:active { transform: scale(0.98); }

.btn-secondary {
  background: transparent; color: #f5e6c8; border: 2px solid #f5e6c8;
  padding: 12px 28px; font-family: 'Bebas Neue', sans-serif; font-size: 20px;
  letter-spacing: 2px; cursor: pointer; border-radius: 2px; transition: all 0.15s;
}
.btn-secondary:hover { background: #f5e6c8; color: #1a1008; }

/* CAMERA VIEW */
.camera-wrap {
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 14px;
  box-sizing: border-box;
}
.viewfinder {
  width: 100%;
  max-width: 520px;
  aspect-ratio: 3 / 4;
  background: #000;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 8px solid #2a2118;
  box-shadow: 0 10px 40px rgba(0,0,0,0.45), inset 0 0 30px rgba(0,0,0,0.5);
}
.viewfinder video, .viewfinder canvas, .viewfinder img {
  width: 100%; height: 100%; object-fit: cover;
}
.vf-overlay {
  position: absolute; inset: 0; pointer-events: none;
  border: 1px solid rgba(255,255,255,0.15);
}
.vf-corners::before, .vf-corners::after {
  content: ''; position: absolute; width: 20px; height: 20px;
  border-color: #f5e6c8; border-style: solid; opacity: 0.6;
}
.vf-corners::before { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
.vf-corners::after { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

.flash-anim { animation: flash 0.3s ease-out; }
@keyframes flash { 0% { filter: brightness(5); } 100% { filter: brightness(1); } }

.shutter-btn {
  width: 86px;
  height: 86px;
  border-radius: 999px;
  border: 6px solid #f5e6c8;
  background:
    radial-gradient(circle at 35% 35%, #ffffff 0%, #d9d0c3 55%, #8d8478 100%);
  box-shadow:
    0 4px 16px rgba(0,0,0,0.35),
    inset 0 2px 4px rgba(255,255,255,0.45),
    inset 0 -4px 8px rgba(0,0,0,0.25);
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.15s ease;
}

.shutter-btn:hover {
  transform: scale(1.03);
}

.shutter-btn:active {
  transform: scale(0.96);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.35),
    inset 0 2px 6px rgba(0,0,0,0.35);
}
.shutter-btn:disabled { background: #555; border-color: #444; box-shadow: none; cursor: not-allowed; }

.camera-controls { display: flex; align-items: center; gap: 24px; }
.shot-counter {
  font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #d4a843;
  min-width: 80px; text-align: center;
}
.shot-counter span { font-size: 12px; display: block; color: #a09070; letter-spacing: 1px; font-family: 'Space Mono', monospace; }

.upload-area {
  width: 100%; border: 2px dashed #555; border-radius: 4px; padding: 24px;
  text-align: center; cursor: pointer; transition: border-color 0.15s, background 0.15s;
  color: #a09070; font-size: 12px;
}
.upload-area:hover { border-color: #d4a843; background: rgba(212,168,67,0.05); color: #d4a843; }

/* FILM EFFECT */
.film-badge {
  position: absolute; bottom: 8px; left: 8px;
  background: rgba(0,0,0,0.6); color: #d4a843;
  font-size: 9px; padding: 2px 6px; letter-spacing: 1px;
  font-family: 'Space Mono', monospace;
}

/* QR CODE SECTION */
.qr-section {
  max-width: 440px; margin: 0 auto; padding: 32px 20px; text-align: center; display: flex;
  flex-direction: column; align-items: center; gap: 20px;
}
.qr-box {
  background: #fff; padding: 20px; border-radius: 4px;
  display: inline-block; box-shadow: 0 0 0 4px #d4a843, 0 0 0 8px #1a1008, 0 0 0 10px #d4a843;
}
.qr-canvas { display: block; }
.album-code {
  font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: #d4a843;
  letter-spacing: 8px; text-align: center;
}
.album-url {
  background: #111; border: 1px solid #333; padding: 8px 14px;
  font-size: 11px; color: #a09070; border-radius: 2px; word-break: break-all;
  cursor: pointer; transition: color 0.15s;
}
.album-url:hover { color: #d4a843; }

/* ALBUM GRID */
.album-wrap { padding: 20px; max-width: 900px; margin: 0 auto; }
.album-header { margin-bottom: 24px; }
.album-title { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 2px; }
.photo-count { font-size: 11px; color: #a09070; margin-top: 4px; }
.photo-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;
}
.photo-card {
  position: relative; aspect-ratio: 4/3; overflow: hidden; cursor: pointer;
  border-radius: 2px; background: #111; group: true;
}
.photo-card img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.3s, filter 0.3s;
  filter: sepia(0.15) contrast(1.05);
}
.photo-card video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-card:hover img { transform: scale(1.05); filter: sepia(0) contrast(1.1); }
.photo-card-overlay {
  position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
  opacity: 0; transition: opacity 0.2s; display: flex; align-items: flex-end; padding: 8px;
}
.photo-card:hover .photo-card-overlay { opacity: 1; }
.photo-meta { font-size: 9px; color: #f5e6c8; letter-spacing: 1px; }
.funny-badge {
  position: absolute; top: 6px; right: 6px; background: #c0392b;
  color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 1px; letter-spacing: 1px;
}
.caption-chip {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.82); color: #f5e6c8; font-size: 10px; padding: 6px 8px;
  line-height: 1.4;
}

/* LIGHTBOX */
.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.lightbox-inner { max-width: 700px; width: 100%; position: relative; }
.lightbox img { width: 100%; border-radius: 2px; display: block; }
.lb-close {
  position: absolute; top: -40px; right: 0; background: none; border: none;
  color: #f5e6c8; font-size: 28px; cursor: pointer; font-family: 'Space Mono', monospace;
}
.lb-caption {
  background: #111; padding: 12px 16px; font-size: 12px; color: #a09070;
  border-top: 2px solid #c0392b; line-height: 1.6;
}
.lb-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.lb-btn {
  background: transparent; border: 1px solid #555; color: #f5e6c8;
  padding: 7px 16px; font-family: 'Space Mono', monospace; font-size: 11px;
  cursor: pointer; border-radius: 2px; transition: all 0.15s; display: flex; align-items: center; gap: 6px;
}
.lb-btn:hover { border-color: #d4a843; color: #d4a843; }
.lb-btn.danger:hover { border-color: #c0392b; color: #c0392b; }
.lb-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* JOIN PAGE */
.join-wrap {
  max-width: 400px; margin: 0 auto; padding: 32px 20px; display: flex;
  flex-direction: column; gap: 20px; align-items: center; text-align: center;
}
.code-input {
  width: 100%; background: #111; border: 2px solid #555; color: #f5e6c8;
  font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 8px;
  text-align: center; padding: 16px; border-radius: 2px; text-transform: uppercase;
  outline: none; transition: border-color 0.15s;
}
.code-input:focus { border-color: #d4a843; }

/* STATUS / TOAST */
.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #1a1008; border: 1px solid #d4a843; color: #d4a843;
  padding: 10px 20px; font-size: 12px; border-radius: 2px; z-index: 300;
  animation: slideup 0.25s ease-out;
}
@keyframes slideup { from { transform: translateX(-50%) translateY(20px); opacity: 0; } }

.loading-ring {
  width: 20px; height: 20px; border: 2px solid #555; border-top-color: #d4a843;
  border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.section-label {
  font-size: 10px; letter-spacing: 3px; color: #a09070; text-transform: uppercase;
  border-bottom: 1px solid #333; padding-bottom: 8px; width: 100%;
}

/* GUEST INDICATOR */
.guest-indicator {
  background: #c0392b; color: #fff; text-align: center; padding: 6px;
  font-size: 11px; letter-spacing: 2px;
}

.empty-album {
  text-align: center; padding: 60px 20px; color: #555;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }

/* RESPONSIVE */
@media (max-width: 480px) {
  .photo-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 56px; }
}
`;

// --- QR CODE GENERATOR (pure JS, no lib needed) ---
function generateQR(canvas, text) {
  // Use a simple QR API via image
  const size = 200;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => ctx.drawImage(img, 0, 0, size, size);
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=1a1008&margin=1`;
}

// --- FILM STRIP COMPONENT ---
function FilmStrip() {
  return (
    <div className="filmstrip">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="sprocket" />
      ))}
    </div>
  );
}

// --- TOAST ---
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

// --- MAIN APP ---
export default function DisposableCamera() {
  const [view, setView] = useState("home"); // home | host | camera | album | join
  const [albums, setAlbums] = useState(() => {
    const saved = localStorage.getItem("dispocam_albums");
    return saved ? JSON.parse(saved) : {};  }); // { code: { name, photos: [], created } }
  const [currentAlbum, setCurrentAlbum] = useState(null); // album code
  const [isGuest, setIsGuest] = useState(false);
  const [lightbox, setLightbox] = useState(null); // photo index
  const [toast, setToast] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [flashAnim, setFlashAnim] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [facing, setFacing] = useState("environment");
  const [selectedFilter, setSelectedFilter] = useState("vintage");
  const [lastUploadCount, setLastUploadCount] = useState(0);


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  // Parse URL for auto-join
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("album");
    if (code && albums[code]) {
      setCurrentAlbum(code);
      setIsGuest(true);
      setView("camera");
    }
  }, []);

  useEffect(() => {
    if (lastUploadCount === 0) return;
  
    const timeout = setTimeout(() => {
      setLastUploadCount(0);
    }, 3000);
  
    return () => clearTimeout(timeout);
  }, [lastUploadCount]);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
        alert("Video play error: " + (err?.message || err));
      });
    }
  }, [cameraStream]);

  useEffect(() => {
    try {
      localStorage.setItem("dispocam_albums", JSON.stringify(albums));
    } catch (err) {
      console.warn("Storage limit reached. Albums may not fully save.", err);
    }
  }, [albums]);


  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  }, []);

  // QR code generation
  useEffect(() => {
    if (view === "host" && currentAlbum && qrCanvasRef.current) {
      const url = `${window.location.origin}${window.location.pathname}?album=${currentAlbum}`;
      generateQR(qrCanvasRef.current, url);
    }
  }, [view, currentAlbum]);

  // Camera stream
  useEffect(() => {
    if (view === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [view]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
  
      setCameraStream(stream);
      setHasCamera(true);
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera error: " + (err?.message || err));
      setHasCamera(false);
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  }

  function createAlbum() {
    if (!albumName.trim()) { showToast("Enter an album name"); return; }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const album = { name: albumName.trim(), photos: [], created: Date.now() };
    setAlbums(prev => ({ ...prev, [code]: album }));
    setCurrentAlbum(code);
    setIsGuest(false);
    setView("host");
  }

  function joinAlbum() {
    const code = joinCode.trim().toUpperCase();
    if (!albums[code]) { showToast("Album not found"); return; }
    setCurrentAlbum(code);
    setIsGuest(true);
    setView("camera");
    showToast(`Joined ${albums[code].name}!`);
  }

  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    // Film grain overlay
    applySelectedFilter(ctx, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    addPhoto(dataUrl);
    setFlashAnim(true);
    setTimeout(() => setFlashAnim(false), 400);
    showToast("📸 Photo added!");
  }

  function applyFilmEffect(ctx, w, h) {
    // Slight vignette
    const grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.8);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // Grain
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.5) * 18;
      d[i] = Math.min(255, Math.max(0, d[i] + noise));
      d[i+1] = Math.min(255, Math.max(0, d[i+1] + noise));
      d[i+2] = Math.min(255, Math.max(0, d[i+2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function applySelectedFilter(ctx, w, h) {
    if (selectedFilter === "original") {
      return;
    }
  
    if (selectedFilter === "vintage") {
      ctx.filter = "sepia(0.35) contrast(1.1) saturate(0.9)";
    }
  
    if (selectedFilter === "bw") {
      ctx.filter = "grayscale(1) contrast(1.15)";
    }
  
    if (selectedFilter === "dreamy") {
      ctx.filter = "brightness(1.08) saturate(1.2) blur(0.4px)";
    }
  
    if (selectedFilter === "flash") {
      ctx.filter = "contrast(1.3) saturate(1.4) brightness(1.08)";
    }
  
    const imageData = ctx.getImageData(0, 0, w, h);
  
    ctx.putImageData(imageData, 0, 0);
  
    applyFilmEffect(ctx, w, h);
  
    ctx.filter = "none";
  }

  function addPhoto(dataUrl, mediaType = "image", editType = null) {
    if (!currentAlbum) return;
  
    const photo = {
      id: Date.now(),
      src: dataUrl,
      mediaType: mediaType,
      editType: editType,
      timestamp: Date.now(),
      caption: null,
      uploaderType: isGuest ? "guest" : "host",
      uploaderName: guestName || null
    };
  
    setAlbums(prev => ({
      ...prev,
      [currentAlbum]: {
        ...prev[currentAlbum],
        photos: [...prev[currentAlbum].photos, photo]
      }
    }));

    setLastUploadCount(count => count + 1);
  }
  
  function processUploadedImage(dataUrl) {
    const img = new Image();
  
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      canvas.width = img.width;
      canvas.height = img.height;
  
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
  
      applySelectedFilter(ctx, canvas.width, canvas.height);
  
      const filteredDataUrl = canvas.toDataURL("image/jpeg", 0.88);
      addPhoto(filteredDataUrl, "image");
    };
  
    img.src = dataUrl;
  }

  function createFilteredCopy(photo, filterType) {
    if (!photo || photo.mediaType === "video") return;
  
    const img = new Image();
  
    img.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
  
      const ctx = tempCanvas.getContext("2d");
  
      if (filterType === "vintage") {
        ctx.filter = "sepia(0.35) contrast(1.1) saturate(0.9)";
      } else if (filterType === "bw") {
        ctx.filter = "grayscale(1) contrast(1.15)";
      } else if (filterType === "dreamy") {
        ctx.filter = "brightness(1.08) saturate(1.2) blur(0.4px)";
      } else if (filterType === "flash") {
        ctx.filter = "contrast(1.3) saturate(1.4) brightness(1.08)";
      } else {
        ctx.filter = "none";
      }
  
      ctx.drawImage(img, 0, 0);

if (filterType === "bw") {
  const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
}

applyFilmEffect(ctx, tempCanvas.width, tempCanvas.height);
  
      const filteredDataUrl = tempCanvas.toDataURL("image/jpeg", 0.88);
  
      addPhoto(filteredDataUrl, "image", filterType);
  
      showToast(`${filterType.toUpperCase()} copy created!`);
      setLightbox(null);
    };
  
    img.src = photo.src;
  }
  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
  
    files.forEach(file => {
      const reader = new FileReader();
  
      reader.onload = ev => {
        if (file.type.startsWith("video/")) {
          addPhoto(ev.target.result, "video");
        } else {
          processUploadedImage(ev.target.result);
        }
      };
  
      reader.readAsDataURL(file);
    });
  
    showToast(`${files.length} photo(s) added!`);
    e.target.value = "";
  }

  async function makeFunny(photoIdx) {
    const album = albums[currentAlbum];
    if (!album) return;
    const photo = album.photos[photoIdx];
    setAiLoading(true);
    try {
      // Extract base64 data
      const base64 = photo.src.split(",")[1];
      const mediaType = photo.src.split(";")[0].split(":")[1];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 }
              },
              {
                type: "text",
                text: "Look at this photo and write a SHORT, genuinely funny caption or comment about it. Be witty, clever, and make it specific to what you actually see. Keep it under 2 sentences. No hashtags. Channel the energy of a comedian noticing something unexpected. Return ONLY the caption text, nothing else."
              }
            ]
          }]
        })
      });
      const data = await response.json();
      const caption = data.content?.[0]?.text || "No caption generated.";
      setAlbums(prev => {
        const photos = [...prev[currentAlbum].photos];
        photos[photoIdx] = { ...photos[photoIdx], caption };
        return { ...prev, [currentAlbum]: { ...prev[currentAlbum], photos } };
      });
      if (lightbox !== null) setLightbox(photoIdx);
      showToast("AI caption added!");
    } catch (err) {
      showToast("AI error — try again");
    }
    setAiLoading(false);
  }

  function deletePhoto(idx) {
    setAlbums(prev => {
      const photos = prev[currentAlbum].photos.filter((_, i) => i !== idx);
      return { ...prev, [currentAlbum]: { ...prev[currentAlbum], photos } };
    });
    setLightbox(null);
    showToast("Photo deleted");
  }

  function downloadPhoto(photo) {
    const a = document.createElement("a");
    a.href = photo.src;
    a.download = `disposable-${photo.id}.jpg`;
    a.click();
  }

  const album = currentAlbum ? albums[currentAlbum] : null;
  const photos = album?.photos || [];
  const lbPhoto = lightbox !== null ? photos[lightbox] : null;

  // ---- VIEWS ----

  function HomeView() {
    return (
      <div className="hero">
        <div>
          <div className="hero-sub">📸 one-time use · share instantly</div>
          <div className="hero-title">
            DISPO<br /><span className="red">CAM</span>
          </div>
        </div>
        <p style={{ color: "#a09070", fontSize: "12px", maxWidth: 320, lineHeight: 1.7 }}>
          Create a shared album. Share the QR code. Everyone snaps photos.
          Make them funny with AI. Simple as that.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => setView("new-album")}>
            Create Album
          </button>
          <button className="btn-secondary" onClick={() => setView("join")}>
            Join Album
          </button>
        </div>
        {Object.keys(albums).length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div className="section-label" style={{ marginBottom: 12, textAlign: "center" }}>Your albums</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 320 }}>
              {Object.entries(albums).map(([code, a]) => (
                <button key={code} className="lb-btn" style={{ justifyContent: "space-between" }}
                  onClick={() => { setCurrentAlbum(code); setIsGuest(false); setView("album"); }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2 }}>{a.name}</span>
                  <span style={{ color: "#a09070", fontSize: 10 }}>{a.photos.length} photos · {code}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function NewAlbumView() {
    return (
      <div className="join-wrap">
        <div style={{ textAlign: "center" }}>
          <div className="section-label">New Album</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, marginTop: 12 }}>
            Name Your Roll
          </div>
        </div>
        <input
          className="code-input"
          style={{ fontSize: 22, letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}
          placeholder="e.g. Tom's 30th"
          value={albumName}
          onChange={e => setAlbumName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && createAlbum()}
          autoFocus
        />
        <button className="btn-primary" style={{ width: "100%" }} onClick={createAlbum}>
          Create &amp; Get QR Code →
        </button>
        <button className="btn-secondary" style={{ width: "100%", fontSize: 14 }} onClick={() => setView("home")}>
          Back
        </button>
      </div>
    );
  }

  function HostView() {
    const url = `${window.location.origin}${window.location.pathname}?album=${currentAlbum}`;
    return (
      <div className="qr-section">
        <div>
          <div className="section-label">Share This</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, marginTop: 8 }}>
            {album?.name}
          </div>
        </div>
        <div className="qr-box">
          <canvas ref={qrCanvasRef} className="qr-canvas" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#a09070", marginBottom: 8, letterSpacing: 1 }}>OR ENTER CODE</div>
          <div className="album-code">{currentAlbum}</div>
        </div>
        <div className="album-url" onClick={() => { navigator.clipboard?.writeText(url); showToast("Link copied!"); }}>
          {url} · tap to copy
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => { setIsGuest(false); setView("camera"); }}>
            Take Photos →
          </button>
          <button className="btn-secondary" style={{ fontSize: 14 }} onClick={() => setView("album")}>
            View Album
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#555", textAlign: "center" }}>
          Guests scan QR code → snap photos → they appear in your album
        </p>
      </div>
    );
  }

  function JoinView() {
    return (
      <div className="join-wrap">
        <div>
          <div className="section-label">Join Album</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, marginTop: 8 }}>
            Enter Code
          </div>
        </div>
        <input
          className="code-input"
          placeholder="ABC123"
          value={joinCode}
          onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
          onKeyDown={e => e.key === "Enter" && joinAlbum()}
          maxLength={6}
          autoFocus
        />
        <button className="btn-primary" style={{ width: "100%" }} onClick={joinAlbum}>
          Join →
        </button>
        <button className="btn-secondary" style={{ width: "100%", fontSize: 14 }} onClick={() => setView("home")}>
          Back
        </button>
      </div>
    );
  }

  function getFilterStyle(filter) {
    if (filter === "vintage") return "sepia(0.35) contrast(1.1) saturate(0.9)";
    if (filter === "bw") return "grayscale(1) contrast(1.15)";
    if (filter === "dreamy") return "brightness(1.08) saturate(1.2) blur(0.4px)";
    if (filter === "flash") return "contrast(1.3) saturate(1.4) brightness(1.08)";
    return "none";
  }

  function CameraView() {
    const album = albums[currentAlbum];
  
    if (isGuest && !guestReady) {
      return (
        <div className="camera-wrap">
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#181512",
              border: "1px solid #3a2f25",
              borderRadius: 2,
              padding: 24,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}
          >
            <div style={{ fontSize: 24, letterSpacing: 2, color: "#f5e6c8" }}>
              DISPOCAM
            </div>
  
            <div style={{ fontSize: 14, color: "#d4a843" }}>
              📸 You’re joining:
            </div>
  
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f5e6c8" }}>
              {album?.name || "Event Album"}
            </div>
  
            <div style={{ fontSize: 12, lineHeight: 1.5, color: "#b8aa93" }}>
              Capture candid memories, funny moments, videos, and disposable-camera style shots.
            </div>
  
            <input
              type="text"
              placeholder="Your name (optional)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{
                width: "100%",
                background: "#111",
                border: "1px solid #555",
                color: "#f5e6c8",
                padding: "10px",
                borderRadius: 2,
                fontFamily: "'Space Mono', monospace",
                fontSize: 12
              }}
            />
  
            <button className="btn-primary" onClick={() => setGuestReady(true)}>
              Start Capturing Memories
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="camera-wrap">
        {isGuest && album && (
          <div style={{ width: "100%", textAlign: "center" }}>
            <div className="guest-indicator">📷 Adding to: {album.name} · {currentAlbum}</div>
          </div>
        )}

<div className={`viewfinder ${flashAnim ? "flash-anim" : ""}`}>
  {hasCamera ? (
    <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: facing === "user" ? "scaleX(-1)" : "none",
      filter: getFilterStyle(selectedFilter),
      display: hasCamera ? "block" : "none"
    }}
  />
  
  {!hasCamera && (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555", fontSize: 12 }}>
      Camera not available — upload below
    </div>
  )}
  
  <div className="vf-overlay vf-corners" />
  <div className="film-badge">DISPO-CAM · 400</div>
</div>

        <div className="camera-controls">
          {hasCamera && (
            <button className="lb-btn" style={{ fontSize: 11 }}
              onClick={() => { setFacing(f => f === "environment" ? "user" : "environment"); }}>
              ⟳ Flip
            </button>
          )}
          <button
            className="shutter-btn"
            onClick={takePhoto}
            disabled={!hasCamera || !currentAlbum}
            title="Take photo"
          />
          <button className="lb-btn" onClick={() => fileInputRef.current?.click()}>
            ↑ Upload
          </button>
        </div>

        <div style={{
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 4
}}>
  {["original", "vintage", "bw", "dreamy", "flash"].map(filter => (
    <button
      key={filter}
      className="lb-btn"
      style={{
        borderColor: selectedFilter === filter ? "#d4a843" : undefined,
        color: selectedFilter === filter ? "#d4a843" : undefined
      }}
      onClick={() => setSelectedFilter(filter)}
    >
      {filter.toUpperCase()}
    </button>
  ))}
</div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
        <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleFileUpload} />

        {lastUploadCount > 0 && (
  <div style={{
    width: "100%",
    background: "rgba(212,168,67,0.08)",
    border: "1px solid #d4a843",
    color: "#d4a843",
    padding: "10px",
    borderRadius: 2,
    fontSize: 12,
    textAlign: "center"
  }}>
    ✅ Added to album! Add another or view the album.
  </div>
)}

        {!currentAlbum && (
          <p style={{ fontSize: 11, color: "#c0392b", textAlign: "center" }}>
            No album selected. Create or join an album first.
          </p>
        )}

        {/* Recent shots strip */}
        {photos.length > 0 && (
          <div style={{ width: "100%" }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Recent shots — {photos.length}</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
              {[...photos].reverse().slice(0, 8).map((p, i) => (
                <div key={p.id} style={{ flex: "0 0 72px", height: 54, borderRadius: 2, overflow: "hidden", cursor: "pointer" }}
                  onClick={() => { setLightbox(photos.length - 1 - i); setView("album"); }}>
                  <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn-secondary" style={{ width: "100%", fontSize: 14 }} onClick={() => setView("album")}>
          View Album ({photos.length})
        </button>

        {!isGuest && (
          <button className="lb-btn" onClick={() => setView("host")}>
            ← QR Code
          </button>
        )}
      </div>
    );
  }

  function AlbumView() {
    return (
      <div className="album-wrap">
        <div className="album-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="album-title">{album?.name || "Album"}</div>
              <div className="photo-count">{photos.length} photo{photos.length !== 1 ? "s" : ""} · code: {currentAlbum}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="lb-btn" onClick={() => setView("camera")}>📸 Camera</button>
              {!isGuest && <button className="lb-btn" onClick={() => setView("host")}>QR Code</button>}
            </div>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="empty-album">
            <div className="empty-icon">📷</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 8 }}>No photos yet</div>
            <p style={{ fontSize: 11, color: "#555" }}>Take some photos or share the QR code with guests</p>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((photo, idx) => (
              <div key={photo.id} className="photo-card" onClick={() => setLightbox(idx)}>
           {photo.mediaType === "video" ? (
  <video src={photo.src} muted playsInline />
) : (
  <img src={photo.src} alt="" />
)}

{photo.mediaType === "video" && <div className="funny-badge">VIDEO</div>}
{photo.editType && <div className="funny-badge">{photo.editType.toUpperCase()}</div>}
{!photo.editType && photo.mediaType !== "video" && <div className="funny-badge">ORIGINAL</div>}

{photo.caption && (
  <div className="funny-badge" style={{ top: 30 }}>
    AI
  </div>
)}
                <div className="photo-card-overlay">
                  <div className="photo-meta">
                    {new Date(photo.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {photo.uploaderName
                    ? ` · ${photo.uploaderName}`
                    : photo.uploaderType === "guest"
                    ? " · guest"
                    : ""}
                  </div>
                </div>
                {photo.caption && (
                  <div className="caption-chip" style={{ fontSize: 9, maxHeight: 40, overflow: "hidden" }}>
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- RENDER ----
  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">
        <div className="grain" />

        <div className="header">
          <div className="logo" onClick={() => setView("home")} style={{ cursor: "pointer" }}>
            DISPO<span>CAM</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {album && (
              <>
                <button className={`nav-btn ${view === "camera" ? "active" : ""}`} onClick={() => setView("camera")}>📸</button>
                <button className={`nav-btn ${view === "album" ? "active" : ""}`} onClick={() => setView("album")}>
                  Album {photos.length > 0 && `(${photos.length})`}
                </button>
                {!isGuest && <button className={`nav-btn ${view === "host" ? "active" : ""}`} onClick={() => setView("host")}>QR</button>}
              </>
            )}
            <button className="nav-btn" onClick={() => setView("home")}>Home</button>
          </div>
        </div>

        <FilmStrip />

        {view === "home" && <HomeView />}
        {view === "new-album" && <NewAlbumView />}
        {view === "host" && <HostView />}
        {view === "join" && <JoinView />}
        {view === "camera" && <CameraView />}
        {view === "album" && <AlbumView />}

        {/* LIGHTBOX */}
        {lightbox !== null && lbPhoto && (
          <div className="lightbox" onClick={e => e.target === e.currentTarget && setLightbox(null)}>
            <div className="lightbox-inner">
              <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
              {lbPhoto.mediaType === "video" ? (
                <video src={lbPhoto.src} controls autoPlay playsInline style={{ width: "100%", borderRadius: 2 }} />
              ) : (
                <img src={lbPhoto.src} alt="" />
              )}
              {lbPhoto.caption && (
                <div className="lb-caption">
                  🎭 {lbPhoto.caption}
                </div>
              )}
            <div className="lb-actions">
  <button className="lb-btn" disabled={aiLoading} onClick={() => makeFunny(lightbox)}>
    {aiLoading ? <span className="loading-ring" /> : "🎭"} Make it Funny
  </button>

  {lbPhoto.mediaType !== "video" && (
    <>
      {["vintage", "bw", "dreamy", "flash"].map(filter => (
        <button
          key={filter}
          className="lb-btn"
          onClick={() => createFilteredCopy(lbPhoto, filter)}
        >
          {filter.toUpperCase()}
        </button>
      ))}
    </>
  )}

  <button className="lb-btn" onClick={() => downloadPhoto(lbPhoto)}>
    ↓ Save
  </button>

  <button className="lb-btn" disabled={lightbox === 0} onClick={() => setLightbox(l => l - 1)}>
    ← Prev
  </button>

  <button className="lb-btn" disabled={lightbox === photos.length - 1} onClick={() => setLightbox(l => l + 1)}>
    Next →
  </button>

  {!isGuest && (
  <button className="lb-btn danger" onClick={() => deletePhoto(lightbox)}>
    🗑 Delete
  </button>
  )}
  </div>
  <div
  style={{
    fontSize: 10,
    color: "#555",
    marginTop: 8,
    fontFamily: "'Space Mono', monospace"
  }}
>
  Photo {lightbox + 1} of {photos.length} ·{" "}
  {new Date(lbPhoto.timestamp).toLocaleString()} ·{" "}
  {lbPhoto.uploaderName
    ? lbPhoto.uploaderName
    : lbPhoto.uploaderType}
</div>
            </div>
          </div>
        )}

        <Toast msg={toast} />
      </div>
    </>
  );
}
