import { useState, useEffect } from "react";
import "./snake_temp.css";

export default function SnakeGame() {
  const boardSize = 20;

  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState([0, 1]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const [bestScore, setBestScore] = useState(
    localStorage.getItem("bestScore") || 0
  );

  const eatSound = new Audio("/sounds/eat.mp3");
  const gameOverSound = new Audio("/sounds/gameover.mp3");

  // 🔥 تفعيل الصوت بعد أي Click
  function enableAudio() {
    if (!audioEnabled) {
      eatSound.play().catch(() => {});
      gameOverSound.play().catch(() => {});
      setAudioEnabled(true);
    }
  }

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(moveSnake, 150);
    document.addEventListener("keydown", changeDirection);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", changeDirection);
    };
  });

  function changeDirection(e) {
    enableAudio();
    if (e.key === "ArrowUp") setDirection([-1, 0]);
    if (e.key === "ArrowDown") setDirection([1, 0]);
    if (e.key === "ArrowLeft") setDirection([0, -1]);
    if (e.key === "ArrowRight") setDirection([0, 1]);
  }

  function moveSnake() {
    const newSnake = [...snake];
    const head = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];

    // collision murs
    if (
      head[0] < 0 ||
      head[0] >= boardSize ||
      head[1] < 0 ||
      head[1] >= boardSize
    ) {
      if (audioEnabled) gameOverSound.play();
      setGameOver(true);

      if (score > bestScore) {
        localStorage.setItem("bestScore", score);
        setBestScore(score);
      }
      return;
    }

    newSnake.unshift(head);

    // manger nourriture
    if (head[0] === food[0] && head[1] === food[1]) {
      if (audioEnabled) eatSound.play();
      setScore(score + 1);
      setFood([
        Math.floor(Math.random() * boardSize),
        Math.floor(Math.random() * boardSize),
      ]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  // ⛔️ GAME OVER SCREEN
  if (gameOver) {
    return (
      <div className="gameover-screen">
        <h1 className="go-title">GAME OVER</h1>

        <p className="go-score">Score : {score}</p>
        <p className="go-best">Best Score : {bestScore}</p>

        <button className="restart-btn" onClick={() => window.location.reload()}>
          RESTART
        </button>
      </div>
    );
  }

  // 🎮 GAME SCREEN
  return (
    <div className="game-container" onClick={enableAudio}>
      <h1>🐍 Snake Retro</h1>
      <p>Score : {score}</p>

      <div className="board">
        {[...Array(boardSize)].map((_, row) =>
          [...Array(boardSize)].map((_, col) => {
            const isSnake = snake.some((s) => s[0] === row && s[1] === col);
            const isFood = food[0] === row && food[1] === col;

            return (
              <div
                key={`${row}-${col}`}
                className={
                  isSnake ? "cell snake" : isFood ? "cell food" : "cell"
                }
              ></div>
            );
          })
        )}
      </div>

      {/* TOUCH CONTROLS */}
      <div className="controls">
        <button onClick={() => setDirection([-1, 0])}>↑</button>

        <div className="middle-controls">
          <button onClick={() => setDirection([0, -1])}>←</button>
          <button onClick={() => setDirection([0, 1])}>→</button>
        </div>

        <button onClick={() => setDirection([1, 0])}>↓</button>
      </div>
    </div>
  );
}
