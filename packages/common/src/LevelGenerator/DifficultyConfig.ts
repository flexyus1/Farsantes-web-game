import { blobColor, difficultyLevel, groupSide } from "../constants";
import { BlobColor, Clue, ClueTarget, DifficultyLevel, GroupSide } from "../models";
import WeightsManager from "./WeightsManager";

export interface GenerationConfig {
  distribution?: Record<GroupSide, number>;
  liarCount?: {
    min: number;
    max: number;
    isRevealed: boolean;
  };
  clueWeights?: Record<Clue['clueType'], number>;
  targetWeights?: Record<ClueTarget['type'] | 'fixed', number>;
  colors?: Set<BlobColor>
}

export class LevelGenerationConfig {
  public distribution: Record<GroupSide, number>;
  public liarCount: { min: number, max: number, isRevealed: boolean };
  public clueWeights: WeightsManager<Clue['clueType']>;
  public targetWeights: WeightsManager<ClueTarget['type'] | 'fixed'>;
  public colors: Set<BlobColor>;
  public blobCount: number;

  constructor(configs: GenerationConfig = {}) {
    const defaultValues = this.getDefaultValues(configs);
    this.distribution = defaultValues.distribution;
    this.blobCount = defaultValues.blobCount;
    this.liarCount = defaultValues.liarCount;
    this.clueWeights = new WeightsManager(defaultValues.clueWeights);
    this.targetWeights = new WeightsManager(defaultValues.targetWeights);
    this.colors = defaultValues.colors;
  }

  private getDefaultValues(configs: GenerationConfig) {
    const distribution = configs.distribution || {
      [groupSide.LEFT]: 2,
      [groupSide.BOTTOM]: 2,
      [groupSide.RIGHT]: 2
    };

    const blobCount = Object.values(distribution).reduce((a, b) => a + b, 0);

    const liarCount = configs.liarCount || {
      min: 1,
      max: Math.floor((blobCount - 1) / 2),
      isRevealed: true
    };

    const clueWeights = configs.clueWeights || {
      ['color']: 2,
      ['side']: 2,
      ['specific']: 2,
      ['all']: 2
    };

    const targetWeights = configs.targetWeights || {
      ['all']: 1,
      ['some']: 1,
      ['range']: 0,
      ['fixed']: 1
    };

    const colors = configs.colors || new Set([
      blobColor.RED,
      blobColor.BLUE,
      blobColor.GREEN,
      blobColor.ORANGE
    ]);

    return {
      distribution,
      blobCount,
      liarCount,
      clueWeights,
      targetWeights,
      colors
    };
  }
}



export const easyConfiguration: GenerationConfig = {
  distribution: {
    [groupSide.LEFT]: 2,
    [groupSide.BOTTOM]: 0,
    [groupSide.RIGHT]: 2
  },
  liarCount: { min: 1, max: 1, isRevealed: true },
  clueWeights: {
    ['color']: 4,
    ['side']: 3,
    ['specific']: 1,
    ['all']: 0
  },
  targetWeights: {
    ['all']: 1,
    ['some']: 1,
    ['range']: 1,
    ['fixed']: 1
  },
  colors: new Set([
    blobColor.RED,
    blobColor.BLUE
  ])
};

export const mediumConfiguration: GenerationConfig = {
  distribution: {
    [groupSide.LEFT]: 2,
    [groupSide.BOTTOM]: 2,
    [groupSide.RIGHT]: 2
  },
  liarCount: { min: 1, max: 2, isRevealed: false },
  clueWeights: {
    ['color']: 1,
    ['side']: 1,
    ['specific']: 1,
    ['all']: 1
  },
  targetWeights: {
    ['all']: 1,
    ['some']: 1,
    ['range']: 1,
    ['fixed']: 1
  },
  colors: new Set([
    blobColor.RED,
    blobColor.BLUE,
    blobColor.GREEN
  ])
};

export const hardConfiguration: GenerationConfig = {
  distribution: {
    [groupSide.LEFT]: 3,
    [groupSide.BOTTOM]: 3,
    [groupSide.RIGHT]: 3
  },
  liarCount: { min: 1, max: 4, isRevealed: false },
  clueWeights: {
    ['color']: 1,
    ['side']: 1,
    ['specific']: 1,
    ['all']: 1
  },
  targetWeights: {
    ['all']: 1,
    ['some']: 1,
    ['range']: 1,
    ['fixed']: 1
  },
  colors: new Set([
    blobColor.RED,
    blobColor.BLUE,
    blobColor.GREEN,
    blobColor.ORANGE
  ])
};

export const difficultyConfigs: Map<DifficultyLevel, GenerationConfig> = new Map([
  [difficultyLevel.EASY, easyConfiguration],
  [difficultyLevel.MEDIUM, mediumConfiguration],
  [difficultyLevel.HARD, hardConfiguration]
]);
