import { useState } from "react";
import SnakeGame from "./SnakeGame/SnakeGame.jsx";

function App() {
  const [start, setStart] = useState(false);

  return (
    <div className="app-container">

      {/* 🔥 CRT Scanlines + Vignette */}
      <div className="scanlines"></div>
      <div className="vignette"></div>

      {/* ---------------- START SCREEN ---------------- */}
      {!start ? (
        <div className="start-screen">
          <h1 className="retro-title">🐍 Snake Retro</h1>

          <button className="start-btn" onClick={() => setStart(true)}>
            PRESS START
          </button>
        </div>
      ) : (
        /* ---------------- GAME SCREEN ---------------- */
        <div className="gameboy-frame">
          <SnakeGame />
        </div>
      )}

    </div>
  );
}

export default App;
