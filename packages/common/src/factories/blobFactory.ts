import { Blob, BlobColor, Clue, GroupSide } from "../models";

export function blob(name: string, color: BlobColor, clue: Clue, side?: GroupSide): Blob {
  return {
    name: name,
    color: color,
    clue: clue,
    side: side
  };
}
