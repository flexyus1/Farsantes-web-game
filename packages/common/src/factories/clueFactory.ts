import { blobIntegrity } from "../constants";
import { AllClue, BlobColor, ClueAssertion, ClueTarget, ClueTargetAll, ClueTargetRange, ClueTargetSome, ColorClue, GroupSide, SideClue, SpecificClue } from "../models";

export function clueSide(target: ClueTarget, targetedSide: GroupSide, assertionType: ClueAssertion): SideClue {
  return {
    clueType: "side",
    targetedSide,
    target,
    assertionType
  };
}

export function clueColor(target: ClueTarget, targetedColor: BlobColor, assertionType: ClueAssertion): ColorClue {
  return {
    clueType: "color",
    targetedColor,
    target,
    assertionType
  };
}

export function clueSpecific(targetedName: string, assertionType: ClueAssertion): SpecificClue {
  return {
    clueType: "specific",
    targetedName,
    assertionType
  };
}

export function clueAll(amount: number): AllClue {
  return {
    clueType: "all",
    amount: amount,
    assertionType: blobIntegrity.FALSE
  };
}

export function targetAll(): ClueTargetAll {
  return {
    type: "all"
  };
}

export function targetSome(): ClueTargetSome {
  return {
    type: "some"
  };
}

export function targetRange(min: number, max: number): ClueTargetRange {
  return {
    type: "range",
    min,
    max
  };
}