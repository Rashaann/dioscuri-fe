'use client';

import { useState } from "react";
import Intro from "./components/Intro";
import Game from "./components/Game";
import Game2 from "./components/Game2";

export default function Home() {
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
