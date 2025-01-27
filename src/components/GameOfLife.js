import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CellsInstanced = ({ grid, cellSize, isDarkMode }) => {
  const meshRef = useRef();
  const activeCells = useRef(0);
  const tempObject = new THREE.Object3D();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta * 0.8; // Increased speed
    activeCells.current = 0;
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x]) {
          const xPos = x * cellSize;
          const yPos = y * cellSize;
          
          // More dramatic wave effect
          const waveX = Math.sin(xPos * 0.01 + time.current) * 40;
          const waveY = Math.cos(yPos * 0.01 + time.current) * 40;
          const waveZ = Math.sin(xPos * 0.015 + yPos * 0.015 + time.current) * 60;

          tempObject.position.set(xPos, yPos, waveZ + waveX + waveY);
          
          // More dramatic rotation
          tempObject.rotation.x = Math.sin(time.current * 0.8 + xPos * 0.02) * 0.3;
          tempObject.rotation.y = Math.cos(time.current * 0.8 + yPos * 0.02) * 0.3;
          
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(activeCells.current, tempObject.matrix);
          activeCells.current++;
        }
      }
    }
    meshRef.current.count = activeCells.current;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, grid.length * grid[0].length]}
      position={[-window.innerWidth / 2, -window.innerHeight / 2, 0]}
    >
      <planeGeometry args={[cellSize - 1, cellSize - 1]} />
      <meshStandardMaterial
        color={isDarkMode ? "#3498db" : "#2980b9"}
        transparent
        opacity={isDarkMode ? 0.8 : 0.5}
        side={THREE.DoubleSide}
        metalness={0.2}
        roughness={0.3}
      />
    </instancedMesh>
  );
};

const GameOfLife = ({ isDarkMode }) => {
  const [grid, setGrid] = useState(null);
  const animationFrameId = useRef(null);

  // Constants
  const CELL_SIZE = 20;
  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;
  const COLS = Math.floor(CANVAS_WIDTH / CELL_SIZE);
  const ROWS = Math.floor(CANVAS_HEIGHT / CELL_SIZE);

  const createGrid = useCallback(() => {
    return Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(false));
  }, [COLS, ROWS]);

  const countNeighbors = useCallback(
    (currentGrid, x, y) => {
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
    },
    [COLS, ROWS]
  );

  const nextGeneration = useCallback(
    (currentGrid) => {
      if (!currentGrid) return null;
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
    setGrid((prevGrid) => {
      if (!prevGrid) return null;
      return nextGeneration(prevGrid);
    });
    animationFrameId.current = requestAnimationFrame(update);
  }, [nextGeneration]);

  useEffect(() => {
    const initialGrid = createGrid();
    setGrid(initialGrid.map((row) => row.map(() => Math.random() > 0.85)));
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [createGrid, update]);

  if (!grid) return null;

  return (
    <div className="fixed inset-0 w-full h-full -z-50 opacity-100 pointer-events-none overflow-hidden">
      <Canvas
        orthographic
        camera={{
          zoom: 1,
          position: [0, 0, 100],
          left: -CANVAS_WIDTH / 2,
          right: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          bottom: -CANVAS_HEIGHT / 2,
          near: 0.1,
          far: 1000,
        }}
      >
        <color
          attach="background"
          args={[isDarkMode ? "#191e24" : "#ffffff"]}
        />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <CellsInstanced
          grid={grid}
          cellSize={CELL_SIZE}
          isDarkMode={isDarkMode}
        />
      </Canvas>
    </div>
  );
};

export default GameOfLife;
