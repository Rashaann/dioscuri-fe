import { useState } from "react";
import "./App.css";
import Game from "./components/Game";
import Intro from "./components/Intro";
import Game2 from "./components/Game2";

function App() {
  const [whichGame, setWhichGame] = useState("");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {!whichGame && <Intro setWhichGame={setWhichGame} />}
      {whichGame !== "" && (whichGame === "game1" ? <Game /> : <Game2 />)}
    </div>
  );
}

export default App;
