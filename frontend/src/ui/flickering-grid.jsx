import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const FlickeringGrid = ({
  squareSize = 12, // Increased from 9 to 12
  gridGap = 6,     // Increased from 4 to 6
  flickerChance = 0.8, // Slightly reduced for more stable appearance 
  color = "rgb(124, 58, 237)", // Changed to a purple color (Indigo-600)
  width,
  height,
  className,
  maxOpacity = 0.25, // Increased from 0.7 for more prominence
  ...props
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    const toRGBA = (color) => {
      if (typeof window === "undefined") return `rgba(0, 0, 0,`;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "rgba(255, 0, 0,";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b},`;
    };
    return toRGBA(color);
  }, [color]);

  const setupCanvas = useCallback((canvas, width, height) => {
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const cols = Math.floor(width / (squareSize + gridGap));
    const rows = Math.floor(height / (squareSize + gridGap));
    const squares = new Float32Array(cols * rows).fill(0);
    
    // Initialize with some visible squares to make it more prominent immediately
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < 0.2) { // 20% chance of initial visibility
        squares[i] = Math.random() * maxOpacity;
      }
    }
    
    return { cols, rows, squares, dpr };
  }, [squareSize, gridGap, maxOpacity]);

  const updateSquares = useCallback((squares, deltaTime) => {
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime) {
        // Added slight bias toward higher opacity values for more prominence
        squares[i] = Math.random() * maxOpacity * 1.2; // Bias toward higher values
        // Clamp to maximum opacity to ensure we don't exceed our limit
        if (squares[i] > maxOpacity) squares[i] = maxOpacity;
      } else if (squares[i] > 0.01) {
        // Add a slow fade effect
        squares[i] *= 0.98;
      }
    }
  }, [flickerChance, maxOpacity]);

  const drawGrid = useCallback((ctx, width, height, cols, rows, squares, dpr) => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw a subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${memoizedColor}0.05)`);  
    gradient.addColorStop(1, `${memoizedColor}0.02)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = squares[i * rows + j];
        if (opacity > 0.01) { // Only draw if visible enough
          // Create rounded rectangles for a more modern look
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const size = squareSize * dpr;
          const radius = 2 * dpr; // Slight rounding of corners
          
          ctx.fillStyle = `${memoizedColor}${opacity})`;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.arcTo(x + size, y, x + size, y + size, radius);
          ctx.arcTo(x + size, y + size, x, y + size, radius);
          ctx.arcTo(x, y + size, x, y, radius);
          ctx.arcTo(x, y, x + size, y, radius);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }, [memoizedColor, squareSize, gridGap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let gridParams = null;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = performance.now();
    const animate = (time) => {
      if (!gridParams || !isInView) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      {...props}
    >
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};