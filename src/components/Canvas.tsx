import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  videoUrl: string | null;
}

export function Canvas({ videoUrl }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 1280,
        height: 720,
        backgroundColor: '#000000'
      });
    }

    return () => {
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (videoUrl && fabricCanvasRef.current) {
      fabric.Image.fromURL(videoUrl, (img) => {
        if (fabricCanvasRef.current) {
          img.scaleToWidth(fabricCanvasRef.current.width!);
          fabricCanvasRef.current.centerObject(img);
          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.renderAll();
        }
      });
    }
  }, [videoUrl]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}