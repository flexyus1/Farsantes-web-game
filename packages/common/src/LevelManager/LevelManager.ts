import { Counter } from './Counter';
import { blobIntegrity } from "../constants";
import { Level, Blob, BlobIntegrity, Clue } from "../models";
import { convertBlobListToMap, log } from "../utils/commonUtils";
import Hypothesis from "./Hypothesis";
import PriorityTracker from "./PriorityTracker";

class LevelManager {
  private level: Level;
  private blobsMap: Map<string, Blob>;
  private counter: Counter;

  constructor(level: Level) {
    this.level = level;
    this.blobsMap = convertBlobListToMap(level.blobs);
    this.counter = new Counter();
  }

  public findSolutions(): { solutions: Hypothesis[], counter: Counter } {
    const blobs: Blob[] = [...this.level.blobs];
    const sortedBlobs = PriorityTracker.fromBlobList(blobs)
    const hypothesis = new Hypothesis(this.level.minimumLiars, this.level.maximumLiars, sortedBlobs, this.counter);
    const solutions = this.exploreThe2HypothesisBranches(hypothesis);
    return { solutions: solutions, counter: this.counter };
  }

  private exploreThe2HypothesisBranches(
    currentHypothesis: Hypothesis
  ): Hypothesis[] {
    log(`nextSteps: \n${currentHypothesis.nextSteps.show()}`)
    const currentBlob = currentHypothesis.nextSteps.pop();
    if (!currentBlob) {
      try {
        currentHypothesis.validateSolution();
        this.counter.increment('validSolutions');
        return [currentHypothesis];
      } catch (error: any) {
        this.counter.increment('invalidSolutions');
        log(error.message);
        return [];
      }
    }

    this.counter.increment('hypothesisBranches');
    const currentBlobDefinition = currentHypothesis.blobsClassifications.get(currentBlob);
    if (currentBlobDefinition === undefined) {
      const liarHypothesis = currentHypothesis.clone();
      const liarSolutions = this.testHypothesisPath(liarHypothesis, currentBlob, blobIntegrity.FALSE);
      const truthSolutions = this.testHypothesisPath(currentHypothesis, currentBlob, blobIntegrity.TRUE);
      return [...liarSolutions, ...truthSolutions];
    }
    if (currentBlobDefinition === blobIntegrity.TRUE) {
      return this.testHypothesisPath(currentHypothesis, currentBlob, blobIntegrity.TRUE);
    }
    if (currentBlobDefinition === blobIntegrity.FALSE) {
      return this.testHypothesisPath(currentHypothesis, currentBlob, blobIntegrity.FALSE);
    }

    console.log("Unreachable Code, I hope this doesn't show up in the console");
    return []
  }

  private testHypothesisPath(
    hypothesis: Hypothesis,
    currentBlobName: string,
    integrityToTest: BlobIntegrity,
  ): Hypothesis[] {
    const blob = this.blobsMap.get(currentBlobName);
    if (!blob) {
      throw new Error("Blob not found");
    }
    try {
      this.processBlobHypothesis(hypothesis, blob, integrityToTest);
      return this.exploreThe2HypothesisBranches(hypothesis);
    } catch (error: any) {
      this.counter.increment('failedHypotheses');
      log(error.message);
      return [];
    }
  }

  private processBlobHypothesis(
    hypothesis: Hypothesis,
    blob: Blob,
    integrityToTest: BlobIntegrity
  ): void {
    log(`Next Step!`);
    hypothesis.possibleCombinations.forEach((combination, index) => {
      log(`Combination ${index}: \n${combination.show()}`);
    })
    log(`Testing: ${blob.name} being ${integrityToTest}`);
    try {
      hypothesis.processNewBlobDefinition(blob.name, integrityToTest);
      hypothesis.processNewClue(blob.clue, integrityToTest, Array.from(this.blobsMap.values()));
    } catch (error: any) {
      throw new Error(`Invalid hypothesis:\n  ${error.message}`);
    }
  }

}

export default LevelManager;
