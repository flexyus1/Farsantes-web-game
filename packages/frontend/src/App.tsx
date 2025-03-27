import { useEffect, useState } from "react";
import "./styles/globals.scss";
import GameBoard from "./components/GameBoard/GameBoard";
import { fetchLevel } from "./api/fetchLevel";
import { difficultyLevel, Level } from "@farsantes/common";
import Header from "./components/Header/Header";
import { showSolutionInConsole } from "./utils/showSolution";
// import { levelData as mockLevel } from "./data/blobs";

function App() {
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    const savedDate = localStorage.getItem("savedDate");
    const currentDate = new Date().toDateString();
    console.log(currentDate)
    if (savedDate !== currentDate) {
      localStorage.removeItem("dayList");
      localStorage.removeItem("solution");
      localStorage.setItem("solutionResult", JSON.stringify(null));
      localStorage.setItem("savedDate", currentDate);
    }
  }, []);

  useEffect(() => {
    // Call fetchLevel (which returns a Promise) but without using 'await'
    fetchLevel(difficultyLevel.HARD).then(({ level: levelData }) => {
      // Save the data to state when it's ready
      showSolutionInConsole(levelData);
      setLevel(levelData);
    });

  }, []);

  if (level === null) {
    return <div>Loading...</div>;
  }

  // Once we have data, render the component
  return (
    <div className="appContainer">
      <Header level={level} />
      {/*TODO remove mockLevel  */}
      <GameBoard level={level} />
    </div>
  )
}

export default App