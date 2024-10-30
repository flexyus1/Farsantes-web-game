export const blobColor = {
  RED: "red",
  BLUE: "blue",
  GREEN: "green",
  ORANGE: "orange",
} as const;

export const blobIntegrity = {
  TRUE: true,
  FALSE: false
} as const;

export const groupSide = {
  LEFT: "left",
  RIGHT: "right",
  BOTTOM: "bottom"
} as const;

export const difficultyLevel = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
} as const;

export const difficultyLevels = Object.values(difficultyLevel);

export const blobColors = Object.values(blobColor);

export const groupSides = Object.values(groupSide);