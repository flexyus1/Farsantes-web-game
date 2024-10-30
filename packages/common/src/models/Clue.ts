import { BlobColor, BlobIntegrity, GroupSide } from "./Blob";
import { ClueTarget } from "./ClueTarget";

export type ClueAssertion = BlobIntegrity

export type Clue = ColorClue | SideClue | SpecificClue | AllClue;

export interface ColorClue {
  clueType: "color";
  targetedColor: BlobColor;
  target: ClueTarget;
  assertionType: ClueAssertion;
}

export interface SideClue {
  clueType: "side";
  targetedSide: GroupSide;
  target: ClueTarget;
  assertionType: ClueAssertion;
}

export interface SpecificClue {
  clueType: "specific";
  targetedName: string;
  assertionType: ClueAssertion;
}

export interface AllClue {
  clueType: "all";
  amount: number;
  assertionType: false;
}
