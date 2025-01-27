import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Add snake-related constants
const SNAKE_INITIAL_LENGTH = 4;
const DIRECTIONS = {
  UP: [0, 1],
  DOWN: [0, -1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

const CellsInstanced = ({
  grid,
  cellSize,
  isDarkMode,
  scrollRotation,
  isSnakeMode,
}) => {
  const meshRef = useRef();
  const activeCells = useRef(0);
  const tempObject = new THREE.Object3D();
  const time = useRef(0);
  const opacities = useRef(
    new Float32Array(grid.length * grid[0].length).fill(1)
  );
  const targetOpacities = useRef(
    new Float32Array(grid.length * grid[0].length).fill(1)
  );

  useFrame((state, delta) => {
    time.current += delta * 0.8; // Increased speed
    activeCells.current = 0;
    const transitionSpeed = 5 * delta;

    // Apply base rotation from scroll
    if (meshRef.current) {
      meshRef.current.rotation.x = scrollRotation;
    }

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const index = y * grid[0].length + x;
        targetOpacities.current[index] = grid[y][x] ? 1 : 0;

        // Smoothly interpolate opacity
        opacities.current[index] +=
          (targetOpacities.current[index] - opacities.current[index]) *
          transitionSpeed;

        if (grid[y][x] || opacities.current[index] > 0) {
          // Changed condition
          const xPos = x * cellSize;
          const yPos = y * cellSize;

          // Only apply wave effects if not in snake mode
          if (!isSnakeMode) {
            const waveX = Math.sin(xPos * 0.01 + time.current) * 40;
            const waveY = Math.cos(yPos * 0.01 + time.current) * 40;
            const waveZ =
              Math.sin(xPos * 0.015 + yPos * 0.015 + time.current) * 60;
            tempObject.position.set(xPos, yPos, waveZ + waveX + waveY);
            tempObject.rotation.x =
              Math.sin(time.current * 0.8 + xPos * 0.02) * 0.3;
            tempObject.rotation.y =
              Math.cos(time.current * 0.8 + yPos * 0.02) * 0.3;
          } else {
            // Flat grid for snake mode
            tempObject.position.set(xPos, yPos, 0);
            tempObject.rotation.set(0, 0, 0);
          }

          const scale = Math.max(0.1, opacities.current[index]); // Added minimum scale
          tempObject.scale.setScalar(scale);

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
      position={[
        -(grid[0].length * cellSize) / 2 + cellSize / 2,
        -(grid.length * cellSize) / 2 + cellSize / 2,
        0,
      ]}
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

// Add SnakeGame component
const SnakeGame = ({ grid, setGrid, COLS, ROWS }) => {
  const [snake, setSnake] = useState(() => {
    const startX = Math.floor(COLS / 2);
    const startY = Math.floor(ROWS / 2);
    return Array(SNAKE_INITIAL_LENGTH)
      .fill()
      .map((_, i) => [startX - i, startY]);
  });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [food, setFood] = useState(() => [
    Math.floor(Math.random() * COLS),
    Math.floor(Math.random() * ROWS),
  ]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          setDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          setDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          setDirection(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = [
        (snake[0][0] + direction[0] + COLS) % COLS,
        (snake[0][1] + direction[1] + ROWS) % ROWS,
      ];
      newSnake.unshift(head);

      if (head[0] === food[0] && head[1] === food[1]) {
        setFood([
          Math.floor(Math.random() * COLS),
          Math.floor(Math.random() * ROWS),
        ]);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);

      // Update grid
      const newGrid = Array(ROWS)
        .fill()
        .map(() => Array(COLS).fill(false));
      newSnake.forEach(([x, y]) => {
        newGrid[y][x] = true;
      });
      newGrid[food[1]][food[0]] = true;
      setGrid(newGrid);
    };

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, COLS, ROWS, setGrid]);

  return null;
};

// Modify the main GameOfLife component
const GameOfLife = ({ isDarkMode, gameMode }) => {
  const [grid, setGrid] = useState(null);
  const [scrollRotation, setScrollRotation] = useState(0);
  const animationFrameId = useRef(null);

  // Constants
  const DESIRED_COLS = 50; // Set desired number of columns
  const CELL_SIZE = Math.ceil(window.innerWidth / DESIRED_COLS);
  const COLS = Math.floor(window.innerWidth / CELL_SIZE);
  const ROWS = Math.floor(window.innerHeight / CELL_SIZE);

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
    if (gameMode === "life") {
      const initialGrid = createGrid();
      setGrid(initialGrid.map((row) => row.map(() => Math.random() > 0.85)));
      animationFrameId.current = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [createGrid, update, gameMode]);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const rotation = (scrollPos / maxScroll) * Math.PI * 0.2; // Adjust multiplier for rotation amount
      setScrollRotation(rotation);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add scroll locking effect
  useEffect(() => {
    if (gameMode === "snake") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [gameMode]);

  if (!grid) return null;

  return (
    <div className="fixed inset-0 w-full h-full -z-50 opacity-100 pointer-events-none overflow-hidden">
      <Canvas
        orthographic
        camera={{
          zoom: 1,
          position: [0, 0, 100],
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          top: window.innerHeight / 2,
          bottom: -window.innerHeight / 2,
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
          scrollRotation={scrollRotation}
          isSnakeMode={gameMode === "snake"}
        />
      </Canvas>
      {gameMode === "snake" && (
        <SnakeGame grid={grid} setGrid={setGrid} COLS={COLS} ROWS={ROWS} />
      )}
    </div>
  );
};

export default GameOfLife;
