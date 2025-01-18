import { Clue } from "@farsantes/common";
import Blob from "../model/Blob";

// Checks if the blob we're looking at is the target of the clue
// Returns "true", "maybe", or "false"
// True = Clue says it IS what it suggest
// Maybe = Clue says it CAN BE what it suggest

// False = Clue says nothing about it
export function BlobIsTargeted(clue: Clue, targetedBlob: Blob): boolean {

  if (clue.clueType === "color") {
    return targetedBlob.color === clue.targetedColor;
  }

  if (clue.clueType === "side") {
    return targetedBlob.side === clue.targetedSide;
  }

  if (clue.clueType === "specific") {
    return targetedBlob.name === clue.targetedName
  }

  return false;
}

