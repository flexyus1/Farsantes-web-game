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

  const onClick = async () => {
    const solution: Record<string, boolean | null> = {};// Use an object instead of a Map
    blobs.forEach(blob => {
      solution[blob.name] = blob.playerChoice;// Store in an object
    });

    console.log("Blobs length:", blobs.length);
    console.log("Solution:", JSON.stringify(solution));// Now properly serialized

    const result = await fetch(`/submit/${difficultyLevel.HARD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solution })// Now properly formatted
    });

    console.log(result);
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