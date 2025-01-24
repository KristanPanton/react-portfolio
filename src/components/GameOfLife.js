import React, { useEffect, useRef, useState, useCallback } from "react";

const GameOfLife = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true); // Changed to true
  const [grid, setGrid] = useState(null);
  const animationFrameRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Constants
  const CELL_SIZE = 20; // Increased size
  const CANVAS_WIDTH = window.innerWidth;  // Make it full width
  const CANVAS_HEIGHT = window.innerHeight; // Make it full height
  const COLS = Math.floor(CANVAS_WIDTH / CELL_SIZE);
  const ROWS = Math.floor(CANVAS_HEIGHT / CELL_SIZE);
  const GRID_COLOR = "rgba(51, 51, 51, 0.1)"; // Made grid more subtle
  const CELL_COLOR = "rgba(52, 152, 219, 0.3)"; // Made cells more subtle

  const createGrid = useCallback(() => {
    return Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(false));
  }, [COLS, ROWS]);

  const drawGrid = useCallback((ctx, currentGrid) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw cells
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (currentGrid[y][x]) {
          ctx.fillStyle = CELL_COLOR;
          ctx.fillRect(
            x * CELL_SIZE,
            y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
          );
        }
      }
    }

    // Draw grid lines
    ctx.strokeStyle = GRID_COLOR;
    ctx.beginPath();
    for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
    }
    ctx.stroke();
  }, [CANVAS_HEIGHT, CANVAS_WIDTH, COLS, ROWS]);

  const countNeighbors = useCallback((currentGrid, x, y) => {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + COLS) % COLS;
        const ny = (y + dy + ROWS) % ROWS;
        if (currentGrid[ny][nx]) count++;
      }
    }
    return count;
  }, [COLS, ROWS]);

  const nextGeneration = useCallback(
    (currentGrid) => {
      const newGrid = createGrid();
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const neighbors = countNeighbors(currentGrid, x, y);
          if (currentGrid[y][x]) {
            newGrid[y][x] = neighbors === 2 || neighbors === 3;
          } else {
            newGrid[y][x] = neighbors === 3;
          }
        }
      }
      return newGrid;
    },
    [createGrid, ROWS, COLS, countNeighbors]
  );

  const update = useCallback(() => {
    if (!isRunning) return;
    setGrid((prevGrid) => {
      const newGrid = nextGeneration(prevGrid);
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) drawGrid(ctx, newGrid);
      return newGrid;
    });
    animationFrameRef.current = requestAnimationFrame(update);
  }, [isRunning, nextGeneration, drawGrid]);

  const toggleCell = useCallback(
    (x, y) => {
      const gridX = Math.floor(x / CELL_SIZE);
      const gridY = Math.floor(y / CELL_SIZE);
      if (gridX >= 0 && gridX < COLS && gridY >= 0 && gridY < ROWS) {
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row) => [...row]);
          newGrid[gridY][gridX] = !newGrid[gridY][gridX];
          const ctx = canvasRef.current?.getContext("2d");
          if (ctx) drawGrid(ctx, newGrid);
          return newGrid;
        });
      }
    },
    [COLS, ROWS, drawGrid]
  );

  const handleMouseEvent = useCallback(
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        toggleCell(x, y);
      }
    },
    [toggleCell]
  );

  const handleClear = useCallback(() => {
    setGrid(createGrid());
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawGrid(ctx, createGrid());
  }, [createGrid, drawGrid]);

  const handleRandom = useCallback(() => {
    const newGrid = createGrid().map((row) =>
      row.map(() => Math.random() > 0.85)
    );
    setGrid(newGrid);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawGrid(ctx, newGrid);
  }, [createGrid, drawGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setGrid(createGrid());
    const ctx = canvas.getContext("2d");
    if (ctx) {
      handleRandom(); // Add random cells on mount
      drawGrid(ctx, createGrid());
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createGrid, drawGrid, handleRandom]);

  useEffect(() => {
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, update]);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full bg-transparent"
        onMouseDown={(e) => {
          isDrawingRef.current = true;
          handleMouseEvent(e);
        }}
        onMouseMove={(e) => {
          if (isDrawingRef.current) handleMouseEvent(e);
        }}
        onMouseUp={() => {
          isDrawingRef.current = false;
        }}
        onMouseLeave={() => {
          isDrawingRef.current = false;
        }}
      />
    </div>
  );
};

export default GameOfLife;
