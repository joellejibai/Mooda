import React, { useState, useRef, useEffect } from 'react';
import './virtual';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';


const Virtual = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setError(null);
    setIsLoading(true);

    try {
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

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (cameraReady && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Make the canvas match the size of the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, [cameraReady]);

  useEffect(() => {
    if (!cameraReady || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the video frame first
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        for (let landmark of results.poseLandmarks) {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: 1280,
      height: 720,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [cameraReady]);


  return (
    <div className="camera-container">
      <h1>Virtual Try-On</h1>

      {!imageSrc ? (
      <div className="camera-section">
        <div className="camera-wrapper" style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`camera-feed ${!cameraReady ? 'hidden' : ''}`}
          />
          <canvas
            ref={canvasRef}
            className="pose-canvas"
            style={{ position: 'absolute', top: 0, left: 0 }}
          ></canvas>
        </div>



        {isLoading ? (
          <div className="loader">Starting camera...</div>
        ) : !cameraReady ? (
          <button onClick={startCamera} className="btn primary">
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
          <button onClick={() => setImageSrc(null)} className="btn primary">
            Take Another
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
          <button onClick={startCamera} className="btn retry">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Virtual;
