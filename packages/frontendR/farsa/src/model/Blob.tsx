import { BlobColor, Clue, GroupSide } from "@farsantes/common";
import { BlobData } from "../imports/imports";
import BlobCard from "../components/BlobCard/BlobCard";

type MutateAll = (callback: (blob: Blob) => Blob) => void;

export enum ClickState {
  NONE = "none",
  RED = "red",
  BLUE = "blue",
}

export default class Blob {
  //Fixed Fields
  #name: string;
  #color: BlobColor;
  #clue: Clue;
  #side: GroupSide | null;


  //Mutable Fields
  #clickState: ClickState;
  #backgroundColor: ClickState;


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
      this.#backgroundColor = blob.backgroundColor

    } else {
      this.#name = blob.name;
      this.#color = blob.color;
      this.#clue = blob.clue;
      this.#side = blob.side || null;
      this.#clickState = ClickState.NONE;
      this.#mutateAll = mutateAll!;
      this.#backgroundColor = ClickState.NONE

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
  get backgroundColor(): ClickState {
    return this.#backgroundColor;
  }

  //blob.backgroundColor = "red"
  set backgroundColor(newBackgroundColor: ClickState) {
    this.#backgroundColor = newBackgroundColor
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
        this.#clickState = ClickState.RED;
        break;
      case ClickState.RED:
        this.#clickState = ClickState.BLUE;
        break;
      case ClickState.BLUE:
        this.#clickState = ClickState.NONE;
        break;
    }
  }

}