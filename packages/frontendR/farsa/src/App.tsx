import "./styles/globals.scss"
import GameBoard from "./components/GameBoard/GameBoard"
import { fetchLevel } from "./api/fetchLevel"
import { difficultyLevel } from "@farsantes/common"

async function App() {
  // @ts-ignore
  const { level, liarCount } = await fetchLevel(difficultyLevel.EASY);
  return <GameBoard level={level} />
}

export default App

