'use client';
import type { Dispatch, SetStateAction } from "react";

const Intro = (props: { setWhichGame: Dispatch<SetStateAction<string>> }) => {
  const { setWhichGame } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        gap: 20,
      }}
    >
      Which game to choose?
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: 30,
        }}
      >
        <button onClick={() => setWhichGame("game1")}>game 1</button>
        <button onClick={() => setWhichGame("game2")}>game 2</button>
      </div>
    </div>
  );
};

export default Intro;
