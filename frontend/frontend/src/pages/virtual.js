import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

const Virtual = () => {
  const location = useLocation();
  const { topImage, bottomImage, footImage } = location.state || {};

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

    const topImg = new Image();
    const bottomImg = new Image();
    const footImg = new Image();

    topImg.src = topImage || '';
    bottomImg.src = bottomImage || '';
    footImg.src = footImage || '';

    pose.onResults((results) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        const landmarks = results.poseLandmarks;

        // Example: Draw top image between shoulders
        if (topImg.complete && topImg.naturalHeight) {
          const leftShoulder = landmarks[11];
          const rightShoulder = landmarks[12];

          const x = leftShoulder.x * canvas.width;
          const y = leftShoulder.y * canvas.height;
          const width = (rightShoulder.x - leftShoulder.x) * canvas.width;
          const height = width; // adjust as needed

          ctx.drawImage(topImg, x, y, width, height);
        }

        if (bottomImg.complete && bottomImg.naturalHeight) {
          const leftHip = landmarks[23];
          const rightHip = landmarks[24];

          const x = leftHip.x * canvas.width;
          const y = leftHip.y * canvas.height;
          const width = (rightHip.x - leftHip.x) * canvas.width;
          const height = width * 1.2;

          ctx.drawImage(bottomImg, x, y, width, height);
        }

        if (footImg.complete && footImg.naturalHeight) {
          const leftAnkle = landmarks[27];

          const x = leftAnkle.x * canvas.width - 50;
          const y = leftAnkle.y * canvas.height;

          ctx.drawImage(footImg, x, y, 100, 100);
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

    return () => camera.stop();
  }, [cameraReady, topImage, bottomImage, footImage]);

  return (
    <div className="camera-container">
      <h1>Virtual Try-On</h1>
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
          <button onClick={stopCamera} className="btn secondary">
            Stop Camera
          </button>
        )}
      </div>

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
