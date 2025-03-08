import { BlobColor, Clue, GroupSide } from "@farsantes/common";
import { BlobData } from "../imports/imports";
import BlobCard from "../components/BlobCard/BlobCard";
import { JSX } from "react";

type MutateAll = (callback: (blob: Blob) => Blob) => void;

export enum ClickState {
  NONE = "none",
  RED = "red",
  GREEN = "green",
}

export default class Blob {
  //Fixed Fields
  #name: string;
  #color: BlobColor;
  #clue: Clue;
  #side: GroupSide | null;


  //Mutable Fields
  #clickState: ClickState;
  #currentAccusationState: ClickState;
  #isHovered: boolean;


  //Functions
  #mutateAll: MutateAll

  constructor(blob: Blob);
  constructor(blob: BlobData, mutateAll: MutateAll);

  constructor(blob: Blob | BlobData, mutateAll?: MutateAll) {
    if (blob instanceof Blob) {
      this.#name = blob.name;
      this.#color = blob.color;
      this.#clue = blob.clue;
      this.#side = blob.side;
      this.#clickState = blob.clickState;
      this.#mutateAll = blob.mutateAll;
      this.#currentAccusationState = blob.currentAccusationState;
      this.#isHovered = blob.isHovered;

    } else {
      this.#name = blob.name;
      this.#color = blob.color;
      this.#clue = blob.clue;
      this.#side = blob.side || null;
      this.#clickState = ClickState.NONE;
      this.#mutateAll = mutateAll!;
      this.#currentAccusationState = ClickState.NONE
      this.#isHovered = false;


    }

  }

  // blob.side
  get side(): GroupSide | null {
    return this.#side;
  }

  //blob.color
  get color(): BlobColor {
    return this.#color;
  }

  //blob.name
  get name(): string {
    return this.#name;
  }

  // blob.clue
  get clue(): Clue {
    return this.#clue;
  }

  //blob.backgroundColor
  get currentAccusationState(): ClickState {
    return this.#currentAccusationState;
  }

  //blob.backgroundColor = "red"
  set currentAccusationState(newState: ClickState) {
    this.#currentAccusationState = newState
  }

  // blob.isHovered
  get isHovered(): boolean {
    return this.#isHovered;
  }

  //blob.isHovered = true
  set isHovered(newState: boolean) {
    this.#isHovered = newState;
  }


  // blob.clickState
  get clickState(): ClickState {
    return this.#clickState;
  }

  // blob.mutateAll
  get mutateAll(): MutateAll {
    return this.#mutateAll;
  }

  // blob.mutateSelf
  get mutateSelf(): MutateAll {
    return (callback: (blob: Blob) => Blob) => {
      this.#mutateAll((blob) => blob.name === this.name ? callback(blob) : blob);
    }
  }

  // blob.card
  get card(): JSX.Element {
    return (
      <BlobCard blob={this} />
    )
  }

  public nextClickState(): void {
    switch (this.#clickState) {
      case ClickState.NONE:
        this.#clickState = ClickState.GREEN;
        break;
      case ClickState.GREEN:
        this.#clickState = ClickState.RED;
        break;
      case ClickState.RED:
        this.#clickState = ClickState.NONE;
        break;
    }
  }

}