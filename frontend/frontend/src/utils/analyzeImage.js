import { pipeline, env } from "@xenova/transformers";
import namer from "color-namer";

// ✅ Tell Transformers.js to use Xenova's hosted CDN
env.localModelPath = 'https://huggingface.co/Xenova/';

let classifier = null;

export const analyzeImage = async (base64Image) => {
  if (!classifier) {
    classifier = await pipeline(
      'image-classification',
      'Xenova/resnet50', // Still a solid model
      { quantized: false }
    );
  }

  const blob = await fetch(`data:image/png;base64,${base64Image}`).then(res => res.blob());
  const results = await classifier(blob);
  const topLabel = results?.[0]?.label?.toLowerCase() || 'unknown';
  return topLabel;
};

export const getDominantColor = async (base64Image) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Image}`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const colorName = namer({ r, g, b }).ntc[0].name.toLowerCase();
      resolve(colorName);
    };
  });
};
