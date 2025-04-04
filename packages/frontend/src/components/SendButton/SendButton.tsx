import { difficultyLevel } from "@farsantes/common";
import { useState, useEffect } from "react";
import Blob from "@/model/Blob";
import styles from "./SendButton.module.scss";

interface SendButtonProps {
  blobs: Blob[];
}

export default function SendButton({ blobs }: SendButtonProps) {
  const [solutionResult, setSolutionResult] = useState<boolean | null>(() => {
    const stored = localStorage.getItem("solutionResult");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem("solutionResult", JSON.stringify(solutionResult));
  }, [solutionResult]);

  //  Synchronizes with localStorage even if you move outside the component
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("solutionResult");

      const parsed = stored ? JSON.parse(stored) : null; //Transforms the localStorage string back into a JS value (boolean | null). If you don't have anything stored, it assumes null.
      setSolutionResult(prev => {
        if (prev !== parsed) return parsed;
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onClick = async () => {
    const solution: Record<string, boolean | null> = {};
    blobs.forEach(blob => {
      solution[blob.name] = blob.playerChoice;
    });

    const result = await fetch(`/submit/${difficultyLevel.HARD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solution })
    });

    localStorage.setItem("solution", JSON.stringify(solution));
    setSolutionResult(await result.text() === "Resposta: true");
  };

  const color = solutionResult === null ? "" : solutionResult ? "green" : "red";

  return (
    <button style={{ backgroundColor: color }} className={styles.sendButton} onClick={onClick}>
      Enviar Resposta
    </button>
  );
}
