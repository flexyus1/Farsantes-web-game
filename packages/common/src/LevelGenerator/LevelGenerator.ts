import { Clue, ClueTarget, Blob, ColorClue, Level, BlobColor, GroupSide, DifficultyLevel } from "../models";
import SimpleRNG from "./SimpleRNG";
import WeightsManager from "./WeightsManager";
import { groupSides, blobColors, blobNamesPTBR } from "../constants";
import { clueAll, clueColor, clueSide, clueSpecific, blob } from "../factories";
import { difficultyConfigs, GenerationConfig, LevelGenerationConfig } from "./DifficultyConfig";
import { generateLevelName } from "./utils";

class LevelGenerator {
  private rng: SimpleRNG;
  private existingBlobs: Blob[] = [];
  private config: LevelGenerationConfig
  public initialSeed: string;

  constructor(difficultyLevel: DifficultyLevel, seed?: string);
  constructor(config: GenerationConfig, seed?: string);
  constructor(configOrDifficultyOrSeed: DifficultyLevel | string | GenerationConfig, optionalSeed?: string) {
    if (difficultyConfigs.has(configOrDifficultyOrSeed as DifficultyLevel)) {
      const difficultyConfig = difficultyConfigs.get(configOrDifficultyOrSeed as DifficultyLevel);
      this.config = new LevelGenerationConfig(difficultyConfig);
    } else if (typeof configOrDifficultyOrSeed === "object") {
      this.config = new LevelGenerationConfig(configOrDifficultyOrSeed as GenerationConfig);
    } else {
      this.config = new LevelGenerationConfig({});
    }

    const seed = optionalSeed || Math.random().toString(36).substring(2, 15);
    this.initialSeed = seed;
    this.rng = new SimpleRNG(seed);
  }

  public generateRandomLevel(): Level {
    const blobs: Blob[] = [];
    const usedNames = new Set<string>();

    // Generate blobs with colors and sides
    Object.entries(this.config.distribution).forEach(([sideKey, count]) => {
      const currentSide = sideKey as GroupSide;
      for (let i = 0; i < count; i++) {
        let name;
        do {
          name = blobNamesPTBR[Math.floor(this.rng.next() * blobNamesPTBR.length)];
        } while (usedNames.has(name));
        usedNames.add(name);

        const colors = [...this.config.colors]
        const color = colors[Math.floor(this.rng.next() * colors.length)] as BlobColor;
        blobs.push(blob(name, color, clueAll(0), currentSide));
      }
    });

    this.existingBlobs = blobs;

    // Generate clues for each blob
    blobs.forEach(blob => {
      blob.clue = this.generateRandomClue(blob.name);
    });

    const randomBlob = blobs[Math.floor(this.rng.next() * blobs.length)];
    const levelName = generateLevelName(randomBlob.name);

    return {
      name: levelName,
      minimumLiars: this.config.liarCount.min,
      maximumLiars: this.config.liarCount.max,
      blobs,
      seed: this.initialSeed,
    };
  }

  private getRandomTarget(count: number): ClueTarget {
    const targetType = this.config.targetWeights.getWeightedRandomItem(this.rng);

    switch (targetType) {
      case "all":
        return { type: "all" };
      case "some":
        return { type: "some" };
      case "range":
        return this.generateRangeTarget(count);
      case "fixed":
        const value = 1 + Math.floor(this.rng.next() * (count - 1));
        return { type: "range", min: value, max: value };
    }
  }

  private generateRangeTarget(maxBlobsAffected: number): ClueTarget {
    const min = Math.floor(this.rng.next() * (maxBlobsAffected - 1)) + 1;
    const max = Math.floor(this.rng.next() * (maxBlobsAffected - min)) + min + 1;
    return { type: "range", min, max };
  }


  private generateClueColor(newClueTypeWeights: WeightsManager<Clue['clueType']>): ColorClue | undefined {
    const existingColors = [...new Set(this.existingBlobs.map(blob => blob.color))];
    const shuffledColors = this.rng.shuffleList(existingColors);
    while (shuffledColors.length > 0) {
      const randomColor = shuffledColors.pop()!;
      const blobsWithThatColor = this.existingBlobs.filter(blob => blob.color === randomColor).length;
      if (blobsWithThatColor > 1) {
        return clueColor(this.getRandomTarget(blobsWithThatColor), randomColor, this.rng.getRandomBoolean());
      }
    }
    newClueTypeWeights.setWeight('color', 0);
  }

  private generateClueSide(newClueTypeWeights: WeightsManager<Clue['clueType']>): Clue | undefined {
    const sidesWithBlobs = groupSides.filter(s => this.existingBlobs.some(blob => blob.side === s));
    const shuffledSides = this.rng.shuffleList(sidesWithBlobs);
    while (shuffledSides.length > 0) {
      const randomSide = shuffledSides.pop()!;
      const blobsInThatSide = this.existingBlobs.filter(blob => blob.side === randomSide).length;
      if (blobsInThatSide > 1) {
        return clueSide(this.getRandomTarget(blobsInThatSide), randomSide, this.rng.getRandomBoolean());
      }
    }
    newClueTypeWeights.setWeight('side', 0);
  }

  private generateClueSpecific(currentBlobName: string): Clue {
    const existingOtherBlobs = this.existingBlobs.filter(blob => blob.name !== currentBlobName);
    const randomBlob = existingOtherBlobs[Math.floor(this.rng.next() * existingOtherBlobs.length)];
    return clueSpecific(randomBlob.name, this.rng.getRandomBoolean());
  }

  private generateClueAll(): Clue {
    const { min, max } = this.config.liarCount;
    return clueAll(Math.floor(this.rng.next() * (max - min + 1)) + min);
  }

  private generateRandomClue(currentBlobName: string): Clue {
    const newClueTypeWeight = this.config.clueWeights.clone();

    if (this.config.liarCount.isRevealed) {
      newClueTypeWeight.setWeight('all', 0);
    }

    while (newClueTypeWeight.getTotalWeight() > 0) {
      const clueType = newClueTypeWeight.getWeightedRandomItem(this.rng);

      switch (clueType) {
        case 'color':
          const colorClue = this.generateClueColor(newClueTypeWeight);
          if (colorClue != null) return colorClue;
          break;
        case 'side':
          const sideClue = this.generateClueSide(newClueTypeWeight);
          if (sideClue != null) return sideClue;
          break;
        case 'specific':
          return this.generateClueSpecific(currentBlobName);
        case 'all':
          return this.generateClueAll();

        default:
          throw new Error(`Unexpected clue type: ${clueType}`);
      }
    }
    return clueAll(0);
  }
}

export default LevelGenerator;