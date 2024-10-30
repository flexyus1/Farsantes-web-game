import { blobIntegrity } from "../constants";
import { BlobIntegrity, ClueAssertion, ClueTarget } from "../models";
import { log } from "../utils/commonUtils";
import PriorityTracker from "./PriorityTracker";
import { Counter } from './Counter';

class PossibilityCombinations {
  // Maps possibility IDs to their corresponding blob type configurations
  public blobConfigurationMap: Map<number, Map<string, BlobIntegrity>>;
  // Tracks occurrences of blobs in truth and false states
  public blobTruthFalseOccurrences: Map<string, [trueIds: number[], falseIds: number[]]>;
  // Counter for generating unique possibility IDs
  private possibilityIdCounter: number;
  private counter: Counter;

  constructor(counter: Counter) {
    this.blobConfigurationMap = new Map();
    this.blobTruthFalseOccurrences = new Map();
    this.possibilityIdCounter = 0;
    this.counter = counter;
  }

  public static generate(targetedBlobs: string[], clueTargetType: ClueTarget, clueAssertion: ClueAssertion, clueIntegrity: BlobIntegrity, knownBlobsClassifcation: Map<string, BlobIntegrity>, maximumNewLiars: number, tracker: PriorityTracker, counter: Counter): PossibilityCombinations {
    let minOdds: number = 0;
    let maxOdds: number = 0;
    if (clueTargetType.type === "all") {
      minOdds = targetedBlobs.length;
      maxOdds = targetedBlobs.length;
    }
    if (clueTargetType.type === "some") {
      minOdds = 1;
      maxOdds = targetedBlobs.length;
    }
    if (clueTargetType.type === "range") {
      minOdds = clueTargetType.min;
      maxOdds = clueTargetType.max;
    }
    const newBlobs: string[] = [];
    targetedBlobs.forEach((blob) => {
      const definedBlob = knownBlobsClassifcation.get(blob);
      if (definedBlob !== undefined) {
        if (definedBlob === clueAssertion) {
          minOdds--;
          maxOdds--;
        }
      } else {
        newBlobs.unshift(blob);
      }
    })
    return PossibilityCombinations.generateAux(newBlobs, minOdds, maxOdds, clueAssertion, clueIntegrity, maximumNewLiars, tracker, counter);
  }

  private static generateAux(filteredTargetedBlobs: string[], minOdds: number, maxOdds: number, oddType: BlobIntegrity, isLegit: boolean, maximumNewLiars: number, tracker: PriorityTracker, counter: Counter): PossibilityCombinations {
    const result: PossibilityCombinations = new PossibilityCombinations(counter);

    // For this function it is better to consider it as binary
    // 101 = First blob truth, Second blob lie, Third blob truth
    const totalCombinations = Math.pow(2, filteredTargetedBlobs.length);

    for (let combinationIndex = 0; combinationIndex < totalCombinations; combinationIndex++) {
      const currentCombination = new Map<string, BlobIntegrity>();
      let liarCount = 0;
      let oddCount = 0;

      for (let itemIndex = 0; itemIndex < filteredTargetedBlobs.length; itemIndex++) {
        const currentItem = filteredTargetedBlobs[itemIndex];

        // 101 >> 0 & 1= 1
        // 101 >> 1 & 1= 0
        // 101 >> 2 & 1= 1
        const assertedBlobIntegrity = ((combinationIndex >> itemIndex) & 1) === 1;
        const isOddType = assertedBlobIntegrity === oddType

        currentCombination.set(currentItem, assertedBlobIntegrity);

        if (!assertedBlobIntegrity) {
          liarCount++;
        }
        if (isOddType) {
          oddCount++;
        }
      }

      const isWithinLierRange = liarCount <= maximumNewLiars;
      const isWithinOddRangeForCombination = oddCount >= minOdds && oddCount <= maxOdds;

      if (isWithinLierRange && (isWithinOddRangeForCombination == isLegit)) {
        result.addPossibility(currentCombination, tracker);
        counter.increment('generatedPossibilities');
      }
    }

    log(`Generation complete. Total possibilities: ${result.blobConfigurationMap.size}`);
    log(result.show());
    return result;
  }

  public addPossibility(newPossibility: Map<string, BlobIntegrity>, tracker: PriorityTracker): void {
    this.updateBlobOccurrences(newPossibility, this.possibilityIdCounter);
    this.blobConfigurationMap.set(this.possibilityIdCounter, newPossibility);
    newPossibility.forEach((blobIntegrity, blobName) => {
      tracker.mention(blobName, 1, false)
    });
    this.possibilityIdCounter++;
  }

  public removeBlobAsPossibility(blobName: string): void {
    this.blobConfigurationMap.forEach((possibility) => {
      possibility.delete(blobName);
    })
  }

  public clone(): PossibilityCombinations {
    const copy = new PossibilityCombinations(this.counter);

    // Deep copy possibilityMap
    copy.blobConfigurationMap = new Map();
    for (const [id, possibility] of this.blobConfigurationMap) {
      const possibilityCopy = new Map<string, BlobIntegrity>();
      for (const [blobName, currentBlobIntegrity] of possibility) {
        possibilityCopy.set(blobName, currentBlobIntegrity);
      }
      copy.blobConfigurationMap.set(id, possibilityCopy);
    }

    // Deep copy blobsOccurrences
    copy.blobTruthFalseOccurrences = new Map();
    for (const [blobName, [trueIds, falseIds]] of this.blobTruthFalseOccurrences) {
      copy.blobTruthFalseOccurrences.set(blobName, [
        [...trueIds],
        [...falseIds]
      ]);
    }

    copy.possibilityIdCounter = this.possibilityIdCounter;

    return copy;
  }

  public show(): string {
    let result = "Possibility Map:\n";
    for (const [id, possibility] of this.blobConfigurationMap) {
      result += `ID: ${id}, Possibility: ${JSON.stringify(Array.from(possibility.entries()))}\n`;
    }

    result += "\nBlob Occurrences:\n";
    for (const [blobName, [trueOccurrences, falseOccurrences]] of this.blobTruthFalseOccurrences) {
      result += `Blob: ${blobName}\n`;
      result += `  Truth occurrences: ${JSON.stringify(trueOccurrences)}\n`;
      result += `  False occurrences: ${JSON.stringify(falseOccurrences)}\n`;
    }

    return result;
  }

  private updateBlobOccurrences(possibility: Map<string, BlobIntegrity>, possibilityId: number): void {
    // Iterate through each entry in the possibility map
    for (const [blobName, currentBlobIntegrity] of possibility) {
      // Get the current occurrences for the blob, or initialize if not present
      let occurrences = this.blobTruthFalseOccurrences.get(blobName);
      if (!occurrences) {
        occurrences = [[], []];
      }

      const indexToUpdate = currentBlobIntegrity ? 0 : 1;

      // Add the possibility ID to the appropriate occurrence array
      occurrences[indexToUpdate].push(possibilityId);

      // Update the blobOccurrences map with the modified occurrences
      this.blobTruthFalseOccurrences.set(blobName, occurrences);
    }
  }
}

export default PossibilityCombinations;