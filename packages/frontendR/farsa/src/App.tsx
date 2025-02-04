import { useEffect, useState } from "react";
import "./styles/globals.scss";
import GameBoard from "./components/GameBoard/GameBoard";
import { fetchLevel } from "./api/fetchLevel";
import { Level } from "@farsantes/common";
import { difficultyLevel } from "./imports/imports";
import Header from "./components/Header/Header";

function App() {
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    // Call fetchLevel (which returns a Promise) but without using 'await'
    //@ts-ignore
    fetchLevel(difficultyLevel.EASY).then(({ level: levelData, liarCount }) => {
      // Save the data to state when it's ready
      setLevel(levelData);
    });
  }, []);

  // Optionally, render a “loading” view while 'level' is still null
  if (level === null) {
    return <div>Loading...</div>;
  }

  // Once we have data, render the component
  return (
    <div className="appContainer">
      <Header />
      <GameBoard level={level} />
    </div>
  )
}

export default App