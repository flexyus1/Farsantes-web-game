
export type ClueTarget = ClueTargetAll | ClueTargetSome | ClueTargetRange;

export interface ClueTargetAll {
  type: "all";
}

export interface ClueTargetSome {
  type: "some";
}

export interface ClueTargetRange {
  type: "range";
  min: number;
  max: number;
}