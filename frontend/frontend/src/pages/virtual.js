import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Virtual = () => {
  const location = useLocation();
  const { topImage, bottomImage, footImage } = location.state || {};

  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [activeAdjust, setActiveAdjust] = useState("pants");

  const [topSize, setTopSize] = useState({
    x: 0.25,
    y: 0.038,
    width: 0.50,
    height: 0.48,
  });

  const [bottomSize, setBottomSize] = useState({
    x: 0.27,
    y: 0.37,
    width: 0.47,
    height: 0.55,
  });

  const [footSize, setFootSize] = useState({
    x: 0.38,
    y: 0.87,
    width: 0.22,
    height: 0.11,
  });

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
      videoRef.current.onloadedmetadata = () => {
        setCameraReady(true);
      };
    }
  };

  const handleCameraError = (err) => {
    const errorMap = {
      AbortError: 'Camera timed out. Try refreshing or check other apps using camera.',
      NotAllowedError: 'Permission denied. Please allow camera access.',
      NotFoundError: 'No camera found. Check your device connections.',
      NotReadableError: 'Camera is already in use by another application.',
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

  useEffect(() => {
    return () => stopCamera();
  }, []);

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

    const drawClothesOnModel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawImageIfReady = (img, xPercent, yPercent, wPercent, hPercent) => {
        if (img.complete && img.naturalHeight) {
          const x = canvas.width * xPercent;
          const y = canvas.height * yPercent;
          const w = canvas.width * wPercent;
          const h = canvas.height * hPercent;
          ctx.drawImage(img, x, y, w, h);
        }
      };

      drawImageIfReady(topImg, topSize.x, topSize.y, topSize.width, topSize.height);
      drawImageIfReady(bottomImg, bottomSize.x, bottomSize.y, bottomSize.width, bottomSize.height);
      drawImageIfReady(footImg, footSize.x, footSize.y, footSize.width, footSize.height);
    };

    const checkAllImagesLoaded = () => {
      if (
        topImg.complete && bottomImg.complete && footImg.complete &&
        topImg.naturalHeight && bottomImg.naturalHeight && footImg.naturalHeight
      ) {
        drawClothesOnModel();
      }
    };

    topImg.onload = checkAllImagesLoaded;
    bottomImg.onload = checkAllImagesLoaded;
    footImg.onload = checkAllImagesLoaded;
  }, [cameraReady, topImage, bottomImage, footImage, topSize, bottomSize, footSize]);

  return (
    <div className="camera-container">
      <div className="smallGlass">
        <h2>Virtual Try-On</h2>
      </div>
      <div className="camera-section">
        <div
          className="camera-wrapper"
          style={{ position: 'relative', width: '480px', height: '720px', margin: '0 auto' }}
        >
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
            }}
          ></canvas>

          <img
            src="/model.png"
            alt="Model Guide"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
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
          <button1 onClick={startCamera} className="btn primary">
            Start Camera
          </button1>
        ) : (
          <button onClick={stopCamera} className="btn secondary">
            Stop Camera
          </button>
        )}
      </div>

      <div className="adjust-section">
        <div className="adjust-header">
          <button onClick={() => {
            const order = ["top", "pants", "foot"];
            const index = order.indexOf(activeAdjust);
            setActiveAdjust(order[(index + 2) % 3]);
          }} className="arrow-btn">
            <FaChevronLeft />
          </button>


          <span className="adjust-title">
            {activeAdjust === "top" && "Adjust Top"}
            {activeAdjust === "pants" && "Adjust Pants"}
            {activeAdjust === "foot" && "Adjust Foot"}
          </span>

          <button onClick={() => {
            const order = ["top", "pants", "foot"];
            const index = order.indexOf(activeAdjust);
            setActiveAdjust(order[(index + 1) % 3]);
          }} className="arrow-btn">
            <FaChevronRight />
          </button>
        </div>

        <div className="adjust-controls">
          {["Width", "Height"].map((dim, i) => (
            <div className="adjust-control-group" key={dim}>
              <button
                className="adjust-btn"
                onClick={() => {
                  const update = (v) => ({ ...v, [dim.toLowerCase()]: v[dim.toLowerCase()] + 0.01 });
                  if (activeAdjust === "top") setTopSize(update);
                  if (activeAdjust === "pants") setBottomSize(update);
                  if (activeAdjust === "foot") setFootSize(update);
                }}
              >+</button>
              <span className="adjust-label">{dim}</span>
              <button
                className="adjust-btn"
                onClick={() => {
                  const update = (v) => ({
                    ...v,
                    [dim.toLowerCase()]: Math.max(0.05, v[dim.toLowerCase()] - 0.01)
                  });
                  if (activeAdjust === "top") setTopSize(update);
                  if (activeAdjust === "pants") setBottomSize(update);
                  if (activeAdjust === "foot") setFootSize(update);
                }}
              >–</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Virtual;
