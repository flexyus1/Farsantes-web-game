import { Blob } from "@farsantes/common"

export type BlobData = Blob

export const groupSide = {
  LEFT: "left",
  RIGHT: "right",
  BOTTOM: "bottom",
} as const;

export const difficultyLevel = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
} as const;


// Importing BlobData from the normal repository
// Blob from @farsantes/common should NEVER be imported anywhere else
