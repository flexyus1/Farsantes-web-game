import { blobIntegrity } from "../constants";
import { BlobIntegrity, Clue, Blob, ClueTarget } from "../models";
import { getValidatedClueAssertion, log } from "../utils";
import PossibilityCombinations from "./PossibilityCombinations";
import PriorityTracker from "./PriorityTracker";
import { Counter } from './Counter';

class Hypothesis {

  private minLiars: number;
  private maxLiars: number;
  private disallowedLiarCounts: number[];
  public blobsClassifications: Map<string, BlobIntegrity>;
  public currentLiarCount: number;
  public possibleCombinations: PossibilityCombinations[];
  public nextSteps: PriorityTracker;
  private counter: Counter;

  constructor(minimumLiars: number, maximumLiars: number, nextSteps: PriorityTracker, counter: Counter) {
    this.minLiars = minimumLiars
    this.maxLiars = maximumLiars;
    this.disallowedLiarCounts = [];
    this.blobsClassifications = new Map<string, BlobIntegrity>();
    this.currentLiarCount = 0;
    this.possibleCombinations = [];
    this.nextSteps = nextSteps;
    this.counter = counter;
  }

  public clone(): Hypothesis {
    const newHypothesis = new Hypothesis(this.minLiars, this.maxLiars, this.nextSteps.clone(), this.counter);
    const newBlobs = new Map();
    this.blobsClassifications.forEach((value, key) => {
      newBlobs.set(key, value);
    })
    newHypothesis.blobsClassifications = newBlobs;
    newHypothesis.possibleCombinations = this.possibleCombinations.map(combination => combination.clone());
    newHypothesis.currentLiarCount = this.currentLiarCount;
    newHypothesis.disallowedLiarCounts = [...this.disallowedLiarCounts];

    return newHypothesis;
  }

  public processNewClue(clue: Clue, currentBlobIntegrity: BlobIntegrity, levelBlobs: Blob[]): void {
    this.counter.increment('processedClues');
    log(`trying to add new clue: ${JSON.stringify(clue)}`);
    try {
      if (clue.clueType === "specific") {
        const validatedClueAssertion = getValidatedClueAssertion(clue.assertionType, currentBlobIntegrity);
        this.processNewBlobDefinition(clue.targetedName, validatedClueAssertion);
      }
      if (clue.clueType === "color") {
        const filteredBlobs = levelBlobs.filter(blob => blob.color === clue.targetedColor)
        const filteredBlobsNames = filteredBlobs.map(blob => blob.name);
        const possibilityTable = PossibilityCombinations.generate(filteredBlobsNames, clue.target, clue.assertionType, currentBlobIntegrity, this.blobsClassifications, this.maxLiars - this.currentLiarCount, this.nextSteps, this.counter);
        this.validateNewPossibilityTable(possibilityTable);
      }
      if (clue.clueType === "side") {
        const filteredBlobs = levelBlobs.filter(blob => blob.side === clue.targetedSide)
        const filteredBlobsNames = filteredBlobs.map(blob => blob.name);
        const possibilityTable = PossibilityCombinations.generate(filteredBlobsNames, clue.target, clue.assertionType, currentBlobIntegrity, this.blobsClassifications, this.maxLiars - this.currentLiarCount, this.nextSteps, this.counter);
        this.validateNewPossibilityTable(possibilityTable);
      }
      if (clue.clueType === "all") {
        if (currentBlobIntegrity === blobIntegrity.TRUE) {
          if (clue.amount >= this.minLiars && clue.amount <= this.maxLiars) {
            this.minLiars = clue.amount;
            this.maxLiars = clue.amount;
          } else {
            throw new Error(`liar amount ${clue.amount} is not within the range of ${this.minLiars} and ${this.maxLiars}`);
          }
        }
        if (currentBlobIntegrity === blobIntegrity.FALSE) {
          log(`We're prohiting ${clue.amount} liar, adding to ${this.disallowedLiarCounts}`);
          this.disallowedLiarCounts.push(clue.amount);
        }
      }
    } catch (error: any) {
      throw new Error(`Error processing new clue:\n  ${error.message}`);
    }
  }

  public processNewBlobDefinition(blobName: string, integrityToTest: BlobIntegrity): void {
    this.counter.increment('processedBlobDefinitions');
    log("trying to add " + blobName + " as " + integrityToTest);
    const existingClassification = this.blobsClassifications.get(blobName);
    try {
      if (existingClassification !== undefined) {
        this.validateClassification(blobName, existingClassification, integrityToTest);
      } else {
        this.blobsClassifications.set(blobName, integrityToTest);

        if (integrityToTest == blobIntegrity.FALSE) {
          this.tryIncrementLiarCount();
        }

        this.processNewBlobIntegrityInCombinations(blobName, integrityToTest);
        this.nextSteps.mention(blobName, 10, false);

        log(`Successfully added ${blobName} as ${integrityToTest} to the hypothesis`);
      }
    } catch (error: any) {
      throw new Error(`Failed to add ${blobName} as ${integrityToTest} to the hypothesis:\n  ${error.message}`);
    }
  }

  public validateSolution(): void {
    const isLiarCountValid = this.currentLiarCount >= this.minLiars && this.currentLiarCount <= this.maxLiars;
    const isLiarCountProhibited = this.disallowedLiarCounts.includes(this.currentLiarCount);

    if (isLiarCountProhibited) {
      throw new Error("Prohibited liar count");
    }
    if (!isLiarCountValid) {
      throw new Error("Liar count out of range");
    }

    log("Solution found!");
    log(`Solution: ${JSON.stringify([...this.blobsClassifications], null, 2)}`);
    log(`Hypothesis: ${JSON.stringify(this.possibleCombinations, null, 2)}`);
    log(`Liar count: ${this.currentLiarCount}`);
    return;
  }

  public showBlobClassification(): void {
    const falseBlobs = [...this.blobsClassifications].filter(x => !x[1])
    const trueBlobs = [...this.blobsClassifications].filter(x => x[1])
    const show = (blobs: [string, boolean][]) => {
      const result = blobs.map(x => x[0])
      return result.join(" - ")
    }
    console.log(`Hypothesis: \n  False Blobs: ${show(falseBlobs)}\n  True Blobs:  ${show(trueBlobs)}`)
  }

  public show(): void {
    console.log("Current Hypothesis State:");
    console.log("-------------------------");
    console.log(`Min Liars: ${this.minLiars}`);
    console.log(`Max Liars: ${this.maxLiars}`);
    console.log(`Current Liar Count: ${this.currentLiarCount}`);
    console.log(`Disallowed Liar Counts: ${this.disallowedLiarCounts.join(", ")}`);

    console.log("\nBlob Classifications:");
    this.blobsClassifications.forEach((integrity, blobName) => {
      console.log(`  ${blobName}: ${integrity}`);
    });

    console.log("\nPossible Combinations:");
    this.possibleCombinations.forEach((combination, index) => {
      console.log(`  Combination ${index + 1}: ${combination.blobConfigurationMap.size} possibilities`);
    });

    console.log("\nNext Steps:");
    this.nextSteps.show();

    console.log("-------------------------");
  }

  private validateCombination(combinations: PossibilityCombinations): boolean {
    try {
      const possibilities = combinations.blobConfigurationMap;
      if (possibilities.size === 1) {
        const possibility = [...possibilities][0][1];
        possibility.forEach((currentBlobIntegrity, blobName) => {
          this.processNewBlobDefinition(blobName, currentBlobIntegrity);
        })
        return false
      }

      if (possibilities.size === 0) {
        throw new Error("No possible combinations");
      }

      return true
    } catch (error: any) {
      throw new Error(`Error validating combination:\n  ${error.message}`);
    }
  }

  private processNewBlobIntegrityInCombinations(blobName: string, integrityToTest: BlobIntegrity): void {
    log(`Checking combinations for ${blobName} as ${integrityToTest}`);
    try {
      this.possibleCombinations.forEach((combination, index) => {
        const blobOccurances = combination.blobTruthFalseOccurrences.get(blobName);
        if (blobOccurances) {
          const indexToRemove = integrityToTest ? 1 : 0;
          const indexToStay = integrityToTest ? 0 : 1;

          const invalidPossibilities = blobOccurances[indexToRemove];
          const remainingPossibilities = blobOccurances[indexToStay];

          invalidPossibilities.forEach(id => {
            const possibilityToRemove = combination.blobConfigurationMap.get(id);
            if (possibilityToRemove) {
              combination.blobTruthFalseOccurrences.delete(blobName);
              this.removeImpossiblePossibilities(combination, id);
            }
          })
          remainingPossibilities.forEach(id => {
            const possibilityToKeep = combination.blobConfigurationMap.get(id);
            if (possibilityToKeep) {
              possibilityToKeep.delete(blobName);
            }
          });
          this.validateCombination(combination);
        }
      })
    } catch (error: any) {
      throw new Error(`Error processing ${blobName} as ${integrityToTest}:\n  ${error.message}`);
    }

  }

  // try to remove a possibility from the combination
  private removeImpossiblePossibilities(combinations: PossibilityCombinations, idToRemove: number): void {
    try {
      // Remove the possibility from the configuration map
      combinations.blobConfigurationMap.delete(idToRemove);

      // Iterate through each blob's occurrences
      combinations.blobTruthFalseOccurrences.forEach((occurrences, blobName) => {
        const [truthOccurrences, lieOccurrences] = occurrences;

        // Remove the idToRemove from both truth and lie occurrences
        const updatedTruthOccurrences = this.removeIdFromOccurrences(truthOccurrences, idToRemove);
        const updatedLieOccurrences = this.removeIdFromOccurrences(lieOccurrences, idToRemove);

        // Update the occurrences for this blob
        combinations.blobTruthFalseOccurrences.set(blobName, [updatedTruthOccurrences, updatedLieOccurrences]);

        // If one of the occurrence lists is now empty, update the blob's classification
        this.updateBlobClassificationIfNeeded(blobName, updatedTruthOccurrences, updatedLieOccurrences);
      });
    } catch (error: any) {
      throw new Error(`Error removing possibility ${idToRemove} from occurrences:\n  ${error.message}`);
    }
  }

  // try to increase liar count
  private tryIncrementLiarCount() {
    if (this.currentLiarCount < this.maxLiars) {
      this.currentLiarCount++;
      return true;
    }
    throw new Error(`Already reached max liars: ${this.maxLiars}`);
  }

  // Auxiliary functions

  private updateBlobClassificationIfNeeded(blobName: string, truthOccurrences: number[], lieOccurrences: number[]): void {
    if (truthOccurrences.length === 0 && lieOccurrences.length > 0) {
      this.processNewBlobDefinition(blobName, blobIntegrity.FALSE);
    } else if (lieOccurrences.length === 0 && truthOccurrences.length > 0) {
      this.processNewBlobDefinition(blobName, blobIntegrity.TRUE);
    }
  }

  private removeIdFromOccurrences(occurrences: number[], idToRemove: number): number[] {
    return occurrences.filter(id => id !== idToRemove);
  }

  private validateClassification(blobName: string, blobIntegrity: BlobIntegrity, integrityToTest: BlobIntegrity): void {
    if (blobIntegrity !== integrityToTest) {
      throw new Error(`Cancel: ${blobName} is already classified as ${blobIntegrity}`);
    }
  }

  private validateNewPossibilityTable(possibilityTable: PossibilityCombinations): void {
    const isValid = this.validateCombination(possibilityTable);
    if (isValid) this.possibleCombinations.push(possibilityTable);
  }

}

export default Hypothesis;