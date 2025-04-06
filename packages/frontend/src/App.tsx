import { useEffect, useState } from "react";
import "./styles/globals.scss";
import GameBoard from "./components/GameBoard/GameBoard";
import Header from "./components/Header/Header";
import { fetchLevel } from "./api/fetchLevel";
import { difficultyLevel, Level } from "@farsantes/common";
import { showSolutionInConsole } from "./utils/showSolution";
import Blob from "./model/Blob";
import { getSmartHint } from "./components/Hints/GameHints";

function App() {
  const [level, setLevel] = useState<Level | null>(null);
  // Armazenar os blobs aqui no App
  const [blobs, setBlobs] = useState<Blob[]>([]);

  // Este efeito verifica/limpa dados do localStorage
  useEffect(() => {
    const savedDate = localStorage.getItem("savedDate");
    const currentDate = new Date().toDateString();
    if (savedDate !== currentDate) {
      localStorage.removeItem("dayList");
      localStorage.removeItem("solution");
      localStorage.setItem("solutionResult", JSON.stringify(null));
      localStorage.setItem("savedDate", currentDate);
    }
  }, []);

  // Este efeito carrega o level via fetchLevel
  useEffect(() => {
    fetchLevel(difficultyLevel.HARD).then(({ level: fetchedLevel }) => {
      showSolutionInConsole(fetchedLevel);
      setLevel(fetchedLevel);

      const initialBlobs = fetchedLevel.blobs.map((blobData) => {
        return new Blob(blobData, (callback) => {
          setBlobs((prev) => prev.map((b) => callback(b)));
        });
      });
      setBlobs(initialBlobs);

    });
  }, []);

  // Função para gerar a dica
  const fetchHintForButton = (): string => {
    if (blobs.length === 0) {
      return "Analisando o nível... tente novamente em um instante.";
    }
    return getSmartHint(blobs);
  };

  if (level === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="appContainer">
      {/* Passamos a função e o level para o Header */}
      <Header level={level} getHintFunction={fetchHintForButton} />
      <GameBoard level={level} blobs={blobs} setBlobs={setBlobs} />
    </div>
  );
}

export default App;
