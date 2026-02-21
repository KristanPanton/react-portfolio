import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const outlineRef = useRef();
  const activeCells = useRef(0);
  const tempObject = new THREE.Object3D();
  const time = useRef(0);
  const opacities = useRef(
    new Float32Array(grid.length * grid[0].length).fill(1)
  );
  const targetOpacities = useRef(
    new Float32Array(grid.length * grid[0].length).fill(1)
  );

  // 3-step toon gradient: shadow / mid / highlight
  const gradientMap = useMemo(() => {
    const colors = new Uint8Array([80, 160, 255]);
    const tex = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state, delta) => {
    time.current += delta * 0.8;
    activeCells.current = 0;
    const transitionSpeed = 5 * delta;

    if (meshRef.current) meshRef.current.rotation.x = scrollRotation;
    if (outlineRef.current) outlineRef.current.rotation.x = scrollRotation;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const index = y * grid[0].length + x;

        // Snake mode: hard on/off, no interpolation so every cell is full size
        if (isSnakeMode) {
          if (!grid[y][x]) continue;
          const xPos = x * cellSize;
          const yPos = y * cellSize;
          tempObject.position.set(xPos, yPos, 0);
          tempObject.rotation.set(0, 0, 0);
          tempObject.scale.setScalar(1);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(activeCells.current, tempObject.matrix);
          tempObject.scale.setScalar(1.35);
          tempObject.updateMatrix();
          outlineRef.current.setMatrixAt(activeCells.current, tempObject.matrix);
          activeCells.current++;
          continue;
        }

        // Life mode: smooth fade in/out + wave animation
        targetOpacities.current[index] = grid[y][x] ? 1 : 0;
        opacities.current[index] +=
          (targetOpacities.current[index] - opacities.current[index]) *
          transitionSpeed;

        if (grid[y][x] || opacities.current[index] > 0) {
          const xPos = x * cellSize;
          const yPos = y * cellSize;
          const waveX = Math.sin(xPos * 0.01 + time.current) * 40;
          const waveY = Math.cos(yPos * 0.01 + time.current) * 40;
          const waveZ =
            Math.sin(xPos * 0.015 + yPos * 0.015 + time.current) * 60;
          tempObject.position.set(xPos, yPos, waveZ + waveX + waveY);
          tempObject.rotation.x =
            Math.sin(time.current * 0.8 + xPos * 0.02) * 0.3;
          tempObject.rotation.y =
            Math.cos(time.current * 0.8 + yPos * 0.02) * 0.3;

          const scale = Math.max(0.1, opacities.current[index]);

          // Main cell
          tempObject.scale.setScalar(scale);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(activeCells.current, tempObject.matrix);

          // Outline: same pose, 1.35x scale — back-face fill creates border
          tempObject.scale.setScalar(scale * 1.35);
          tempObject.updateMatrix();
          outlineRef.current.setMatrixAt(activeCells.current, tempObject.matrix);

          activeCells.current++;
        }
      }
    }

    meshRef.current.count = activeCells.current;
    meshRef.current.instanceMatrix.needsUpdate = true;
    outlineRef.current.count = activeCells.current;
    outlineRef.current.instanceMatrix.needsUpdate = true;
  });

  const totalCells = grid.length * grid[0].length;
  const meshPos = [
    -(grid[0].length * cellSize) / 2 + cellSize / 2,
    -(grid.length * cellSize) / 2 + cellSize / 2,
    0,
  ];

  return (
    <>
      {/* Black outline: back-face of a slightly larger box */}
      <instancedMesh
        ref={outlineRef}
        args={[null, null, totalCells]}
        position={meshPos}
      >
        <boxGeometry args={[cellSize - 1, cellSize - 1, 2]} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} />
      </instancedMesh>

      {/* Toon-shaded cell */}
      <instancedMesh
        ref={meshRef}
        args={[null, null, totalCells]}
        position={meshPos}
      >
        <boxGeometry args={[cellSize - 2, cellSize - 2, 1]} />
        <meshToonMaterial
          color={isDarkMode ? "#27aaff" : "#1a77e8"}
          gradientMap={gradientMap}
          transparent
          opacity={isDarkMode ? 0.8 : 0.55}
        />
      </instancedMesh>
    </>
  );
};

// Add SnakeGame component
const SnakeGame = ({ grid, setGrid, COLS, ROWS, score, setScore, setGameOver }) => {
  const snakeRef = useRef(
    Array(SNAKE_INITIAL_LENGTH)
      .fill()
      .map((_, i) => [Math.floor(COLS / 2) - i, Math.floor(ROWS / 2)])
  );
  const directionRef = useRef(DIRECTIONS.RIGHT);
  const inputQueue = useRef([]);
  const foodRef = useRef([
    Math.floor(Math.random() * COLS),
    Math.floor(Math.random() * ROWS),
  ]);

  // Key input — push to queue, never modify direction directly
  useEffect(() => {
    const handleKeyPress = (e) => {
      const map = {
        ArrowUp: DIRECTIONS.UP,
        ArrowDown: DIRECTIONS.DOWN,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      const last = inputQueue.current.length
        ? inputQueue.current[inputQueue.current.length - 1]
        : directionRef.current;
      if (next[0] === -last[0] && next[1] === -last[1]) return;
      inputQueue.current.push(next);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Stable game loop
  useEffect(() => {
    const tick = () => {
      if (inputQueue.current.length > 0) {
        directionRef.current = inputQueue.current.shift();
      }

      const snake = snakeRef.current;
      const dir = directionRef.current;
      const food = foodRef.current;

      const nextX = snake[0][0] + dir[0];
      const nextY = snake[0][1] + dir[1];

      // Wall collision
      if (nextX < 0 || nextX >= COLS || nextY < 0 || nextY >= ROWS) {
        clearInterval(gameInterval);
        setGameOver(true);
        return;
      }

      const head = [nextX, nextY];

      // Self collision
      const body = snake.slice(0, snake.length - 1);
      if (body.some(([x, y]) => x === head[0] && y === head[1])) {
        clearInterval(gameInterval);
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...snake];

      if (head[0] === food[0] && head[1] === food[1]) {
        setScore((prev) => prev + 1);
        // Place food not on snake
        const snakeSet = new Set(newSnake.map(([x, y]) => `${x},${y}`));
        let fx, fy;
        do {
          fx = Math.floor(Math.random() * COLS);
          fy = Math.floor(Math.random() * ROWS);
        } while (snakeSet.has(`${fx},${fy}`));
        foodRef.current = [fx, fy];
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      const newGrid = Array(ROWS)
        .fill()
        .map(() => Array(COLS).fill(false));
      newSnake.forEach(([x, y]) => {
        newGrid[y][x] = true;
      });
      newGrid[foodRef.current[1]][foodRef.current[0]] = true;
      setGrid(newGrid);
    };

    const gameInterval = setInterval(tick, 100);
    return () => clearInterval(gameInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [COLS, ROWS]);

  return null;
};

const Instructions = ({ score, gameOver, onRestart, isDarkMode }) => (
  <div
    className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-6 bg-base-100 px-8 h-14 z-20"
    style={{
      borderTop: isDarkMode ? "2px solid rgba(255,255,255,0.3)" : "2px solid black",
      boxShadow: isDarkMode ? "0 -3px 0px 0px rgba(255,255,255,0.12)" : "0 -3px 0px 0px rgba(0,0,0,0.15)",
    }}
  >
    {gameOver ? (
      <>
        <span style={{ fontFamily: "'Bangers', cursive", letterSpacing: "0.06em", fontSize: "1.4rem", lineHeight: 1 }}>
          Game Over &nbsp;·&nbsp; {score}
        </span>
        <button
          onClick={onRestart}
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            padding: "4px 14px",
            border: isDarkMode ? "2px solid rgba(255,255,255,0.7)" : "2px solid black",
            borderRadius: "8px",
            boxShadow: isDarkMode ? "2px 2px 0px 0px rgba(255,255,255,0.55)" : "2px 2px 0px 0px rgba(0,0,0,0.85)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
        <span className="text-sm opacity-50" style={{ fontFamily: "'Fredoka', sans-serif" }}>or ESC to exit</span>
      </>
    ) : (
      <>
        <span style={{ fontFamily: "'Bangers', cursive", letterSpacing: "0.06em", fontSize: "1.5rem", lineHeight: 1 }}>
          {score}
        </span>
        <span className="opacity-20" style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.2rem" }}>|</span>
        <span className="text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          &#8593;&#8595;&#8592;&#8594; to move &nbsp;·&nbsp; walls &amp; self = death &nbsp;·&nbsp; ESC to exit
        </span>
      </>
    )}
  </div>
);

// Modify the main GameOfLife component
const GameOfLife = ({ isDarkMode, gameMode }) => {
  const [grid, setGrid] = useState(null);
  const [scrollRotation, setScrollRotation] = useState(0);
  const animationFrameId = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const handleRestart = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setRestartKey((k) => k + 1);
  }, []);

  // Reset game over when leaving snake mode
  useEffect(() => {
    if (gameMode !== "snake") {
      setGameOver(false);
      setScore(0);
    }
  }, [gameMode]);

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

  // Update the scroll listener effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const rotation = (scrollPos / maxScroll) * Math.PI * 0.2;
      setScrollRotation(rotation);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [gameMode]);

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
    <>
      {gameMode === "snake" && <Instructions score={score} gameOver={gameOver} onRestart={handleRestart} isDarkMode={isDarkMode} />}
      <div
        className={gameMode === "snake"
          ? "fixed top-12 left-4 right-4 bottom-14 z-10 overflow-hidden"
          : "fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden"
        }
        style={gameMode === "snake" ? {
          border: isDarkMode ? "2px solid rgba(255,255,255,0.3)" : "2px solid black",
          boxShadow: isDarkMode ? "5px 5px 0px 0px rgba(255,255,255,0.55)" : "5px 5px 0px 0px rgba(0,0,0,0.85)",
          borderRadius: "12px",
        } : {}}
      >
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
        {/* Soft ambient + strong angled directional for crisp toon shadow bands */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[8, 12, 6]} intensity={2.2} />
        <directionalLight position={[-6, -4, 2]} intensity={0.4} />
        <CellsInstanced
          grid={grid}
          cellSize={CELL_SIZE}
          isDarkMode={isDarkMode}
          scrollRotation={scrollRotation}
          isSnakeMode={gameMode === "snake"}
        />
      </Canvas>
      {gameMode === "snake" && (
        <SnakeGame key={restartKey} grid={grid} setGrid={setGrid} COLS={COLS} ROWS={ROWS} score={score} setScore={setScore} setGameOver={setGameOver} />
      )}
      </div>
    </>
  );
};

export default GameOfLife;
