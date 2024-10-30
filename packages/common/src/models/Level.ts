import { difficultyLevel } from "../constants";
import { Blob } from "./Blob";

export type DifficultyLevel = typeof difficultyLevel[keyof typeof difficultyLevel];

export interface Level {
  name: string;
  minimumLiars: number;
  maximumLiars: number;
  blobs: Blob[];
  seed?: string;
}
