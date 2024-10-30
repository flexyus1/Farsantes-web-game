import { Clue, Level } from "@farsantes/common";
import Hypothesis from "@farsantes/common/dist/LevelManager/Hypothesis";
import LevelManager from "@farsantes/common/dist/LevelManager/LevelManager";

class LevelEvaluator {
  private level: Level;

  constructor(level: Level) {
    this.level = level;
  }

  // public evaluate(): LevelFactors {
  //   const levelSolver = new LevelManager(this.level);
  //   const hypotheses = levelSolver.findSolutions();

  //   const solutionsAmount = hypotheses.length;
  //   const blobNames = this.level.blobs.map(blob => blob.name);
  //   const safeBlobs = new Set(blobNames);
  //   const liarsApparisons = new Map<string, number>();

  //   this.processBlobIntegrity(hypotheses, safeBlobs, liarsApparisons);

  //   const clues = new Map<Clue, number>()
  //   this.level.blobs.forEach((blob) => {
  //     const clue = blob.clue;
  //     const currentCount = clues.get(clue) || 0;
  //     clues.set(clue, currentCount + 1);
  //   })

  //   const nonRepeatingClues = Array.from(clues.values()).reduce((acc, count) => acc + (count === 1 ? 1 : 0), 0);
  //   const ClueUniqueness = 1000 * nonRepeatingClues / this.level.blobs.length;

  // }

  private processBlobIntegrity(
    hypotheses: Hypothesis[],
    safeBlobs: Set<string>,
    liarsApparisons: Map<string, number>
  ): void {
    for (const hypothesis of hypotheses) {
      for (const [blobName, blobIntegrity] of hypothesis.blobsClassifications) {
        if (!blobIntegrity) {
          this.updateLiarsApparisons(liarsApparisons, blobName);
          safeBlobs.delete(blobName);
        }
      }
    }
  }

  private updateLiarsApparisons(
    liarsApparisons: Map<string, number>,
    blobName: string
  ): void {
    const currentCount = liarsApparisons.get(blobName) || 0;
    liarsApparisons.set(blobName, currentCount + 1);
  }
}



interface LevelFactors {
  ClueUniqueness: number;
  RepeatingBlobs: number;
  Solutions: number;
  SafeBlobs: number;
}