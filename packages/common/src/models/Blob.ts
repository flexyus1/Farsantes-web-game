import { blobColor, blobIntegrity, groupSide } from "../constants";
import { Clue } from "./Clue";

export type GroupSide = typeof groupSide[keyof typeof groupSide];
export type BlobIntegrity = typeof blobIntegrity[keyof typeof blobIntegrity];
export type BlobColor = typeof blobColor[keyof typeof blobColor];

export interface Blob {
  name: string;
  color: BlobColor;
  clue: Clue;
  side?: GroupSide;
}