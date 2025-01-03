import { BlobColor, Clue, GroupSide } from "@farsantes/common";
import { BlobData } from "../imports/imports";
import BlobCard from "../components/BlobCard/BlobCard";

export default class Blob {
  #name: string;
  #color: BlobColor;
  #clue: Clue;
  #side: GroupSide | null;

  constructor(blob: BlobData) {
    this.#name = blob.name;
    this.#color = blob.color;
    this.#clue = blob.clue;
    this.#side = blob.side || null;
  }

  // blob.card
  get card() {
    return (
      <BlobCard color={this.#color} name={this.#name} side={this.#side} clue={this.#clue} />
    )
  }
}