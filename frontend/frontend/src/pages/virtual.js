import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuthPages } from "../hooks/useAuthPages";


const Virtual = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthPages();

  const [popupMessage, setPopupMessage] = useState(null);

  const {
    topImage,
    bottomImage,
    footImage,
    selectedTopId,
    selectedBottomId,
    selectedFootwearId
  } = location.state || {};

  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [activeAdjust, setActiveAdjust] = useState("pants");
  const [topSize, setTopSize] = useState({ x: 0.13, y: 0.14, width: 0.77, height: 0.36 });
  const [bottomSize, setBottomSize] = useState({ x: 0.22, y: 0.37, width: 0.55, height: 0.55 });
  const [footSize, setFootSize] = useState({ x: 0.359, y: 0.89, width: 0.29, height: 0.12 });

  const [isDragging, setIsDragging] = useState(false);
  const lastTouchDistanceRef = useRef(null);

  const handleGoBack = () => navigate(-1);

  const startCamera = async () => {
    setError(null);
    setIsLoading(true);
    try {
      try {
        await attemptCameraStart({
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        });
        return;
      } catch (highResError) {
        console.warn('High-res failed, trying default...', highResError);
      }
      await attemptCameraStart(true);
    } catch (err) {
      handleCameraError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const attemptCameraStart = async (constraints) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: constraints,
        audio: false,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setupCameraStream(stream);
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  const setupCameraStream = (stream) => {
    if (videoRef.current) {
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => setCameraReady(true);
    }
  };

  const handleCameraError = (err) => {
    const errorMap = {
      AbortError: 'Camera timed out.',
      NotAllowedError: 'Permission denied.',
      NotFoundError: 'No camera found.',
      NotReadableError: 'Camera in use by another app.',
    };
    setError(errorMap[err.name] || `Camera Error: ${err.message}`);
    console.error('Camera access failed:', err);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  useEffect(() => () => stopCamera(), []);

  const getCurrentState = () => {
    if (activeAdjust === "top") return ["top", topSize, setTopSize];
    if (activeAdjust === "pants") return ["pants", bottomSize, setBottomSize];
    return ["foot", footSize, setFootSize];
  };

  useEffect(() => {
    if (!cameraReady || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const topImg = new Image();
    const bottomImg = new Image();
    const footImg = new Image();

    topImg.src = topImage || '';
    bottomImg.src = bottomImage || '';
    footImg.src = footImage || '';

    const drawImageIfReady = (img, xP, yP, wP, hP) => {
      if (img.complete && img.naturalHeight) {
        const x = canvas.width * xP;
        const y = canvas.height * yP;
        const w = canvas.width * wP;
        const h = canvas.height * hP;
        ctx.drawImage(img, x, y, w, h);
      }
    };

    const drawClothesOnModel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageIfReady(topImg, topSize.x, topSize.y, topSize.width, topSize.height);
      drawImageIfReady(bottomImg, bottomSize.x, bottomSize.y, bottomSize.width, bottomSize.height);
      drawImageIfReady(footImg, footSize.x, footSize.y, footSize.width, footSize.height);
    };

    let animationFrameId;
    const render = () => {
      drawClothesOnModel();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraReady, topImage, bottomImage, footImage, topSize, bottomSize, footSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (x, y) => {
      const [key, state, setState] = getCurrentState();
      const rect = canvas.getBoundingClientRect();
      let relX = (x - rect.left) / canvas.width;
      let relY = (y - rect.top) / canvas.height;

      relX = Math.max(0, Math.min(1 - state.width, relX));
      relY = Math.max(0, Math.min(1 - state.height, relY));

      setState(prev => ({
        ...prev,
        x: relX,
        y: relY
      }));
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const [key, state, setState] = getCurrentState();
      const zoomAmount = e.deltaY < 0 ? 0.02 : -0.02;
      setState(prev => ({
        ...prev,
        width: Math.max(0.05, prev.width + zoomAmount),
        height: Math.max(0.05, prev.height + zoomAmount),
      }));
    };

    const getDistance = (touches) => {
      const [a, b] = touches;
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
      } else if (e.touches.length === 2) {
        lastTouchDistanceRef.current = getDistance(e.touches);
      }
    };

    const onTouchMove = (e) => {
      const [key, state, setState] = getCurrentState();
      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      } else if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches);
        const delta = currentDistance - lastTouchDistanceRef.current;
        const zoomAmount = delta * 0.0015;
        setState(prev => ({
          ...prev,
          width: Math.max(0.05, prev.width + zoomAmount),
          height: Math.max(0.05, prev.height + zoomAmount),
        }));
        lastTouchDistanceRef.current = currentDistance;
      }
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      lastTouchDistanceRef.current = null;
    };

    const onMouseDown = () => setIsDragging(true);
    const onMouseMove = (e) => isDragging && handleMove(e.clientX, e.clientY);
    const onMouseUp = () => setIsDragging(false);

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeAdjust, isDragging]);

  const handleSaveOutfit = async () => {
    if (!selectedTopId || !selectedBottomId || !selectedFootwearId) {
      setPopupMessage("❌ Please generate or select a full outfit before saving.");
      return;
    }

    try {
      const body = {
        top: selectedTopId,
        bottom: selectedBottomId,
        foot: selectedFootwearId
      };

      const resp = await fetch("/api/saved-outfits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setPopupMessage("✨ Outfit saved!");
      setTimeout(() => navigate("/savedOutfits"), 2000);
    } catch (err) {
      console.error(err);
      setPopupMessage("❌ Could not save outfit");
    }
  };


  return (
    <div className="camera-container">
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass"><h2>Virtual Try-On</h2></div>

      <div className="camera-section">
        <div className="camera-wrapper" style={{ position: 'relative', width: '480px', height: '720px', margin: '0 auto' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`camera-feed ${!cameraReady ? 'hidden' : ''}`}
            style={{ zIndex: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <canvas
            ref={canvasRef}
            className="pose-canvas"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              width: '100%',
              height: '100%',
              cursor: 'grab'
            }}
          />
          <img
            src="/model.png"
            alt="Model Guide"
            style={{
              position: 'absolute',
              top: '50%',
              left: '40%',
              transform: 'translate(-50%, -50%) scale(1.05)',
              zIndex: 1,
              pointerEvents: 'none',
              opacity: 0.4,
              height: '100%',
            }}
          />
        </div>

        {isLoading ? (
          <div className="loader">Starting camera...</div>
        ) : !cameraReady ? (
          <button onClick={startCamera} className="btn primary">Start Camera</button>
        ) : (
          <button onClick={stopCamera} className="btn secondary">Stop Camera</button>
        )}
      </div>

      <div className="adjust-section">
        <div className="adjust-header">
          <button
            onClick={() => {
              const order = ["top", "pants", "foot"];
              const index = order.indexOf(activeAdjust);
              setActiveAdjust(order[(index + 2) % 3]);
            }}
            className="arrow-btn"
          >
            <FaChevronLeft />
          </button>

          <span className="adjust-title">
            {activeAdjust === "top" && "Adjust Top"}
            {activeAdjust === "pants" && "Adjust Pants"}
            {activeAdjust === "foot" && "Adjust Foot"}
          </span>

          <button
            onClick={() => {
              const order = ["top", "pants", "foot"];
              const index = order.indexOf(activeAdjust);
              setActiveAdjust(order[(index + 1) % 3]);
            }}
            className="arrow-btn"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button className="btn primary" onClick={handleSaveOutfit}>
          Save This Outfit
        </button>
      </div>
      {popupMessage && (
        <div className="outfit-notif">
          <button onClick={() => setPopupMessage(null)}>✖</button>
          <p>{popupMessage}</p>
        </div>
      )}

    </div>
  );
};

export default Virtual;
