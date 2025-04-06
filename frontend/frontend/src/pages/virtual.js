import React, { useState, useRef, useEffect } from 'react';
import './virtual';

const Virtual = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera with timeout and fallbacks
  const startCamera = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // First try: Ideal resolution
      try {
        await attemptCameraStart({
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        });
        return;
      } catch (highResError) {
        console.warn('High-res failed, trying default...', highResError);
      }

      // Fallback: Basic constraints
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
        signal: controller.signal
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
      'AbortError': 'Camera timed out. Try refreshing or check other apps using camera.',
      'NotAllowedError': 'Permission denied. Please allow camera access.',
      'NotFoundError': 'No camera found. Check your device connections.',
      'NotReadableError': 'Camera is already in use by another application.'
    };

    setError(errorMap[err.name] || `Camera Error: ${err.message}`);
    console.error('Camera access failed:', err);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!cameraReady || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    setImageSrc(canvas.toDataURL('image/jpeg'));
    stopCamera();
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="camera-container">
      <h1>Virtual Try-On</h1>

      {!imageSrc ? (
        <div className="camera-section">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`camera-feed ${!cameraReady ? 'hidden' : ''}`}
          />
          
          {isLoading ? (
            <div className="loader">Starting camera...</div>
          ) : !cameraReady ? (
            <button 
              onClick={startCamera}
              className="btn primary"
            >
              Start Camera
            </button>
          ) : (
            <div className="controls">
              <button onClick={capturePhoto} className="btn capture">
                Capture Photo
              </button>
              <button onClick={stopCamera} className="btn secondary">
                Stop Camera
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="preview-section">
          <img src={imageSrc} alt="Captured" className="preview" />
          <button 
            onClick={() => setImageSrc(null)}
            className="btn primary"
          >
            Take Another
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
          <button 
            onClick={startCamera}
            className="btn retry"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Virtual;