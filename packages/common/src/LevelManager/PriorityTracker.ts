import { Blob } from "../models";

class PriorityTracker {
  private items: [string, number][];
  constructor(items?: string[]) {
    if (items) {
      this.items = items.map(item => [item, 1]);
    } else {
      this.items = [];
    }
  }

  public static fromBlobList(blobList: Blob[]): PriorityTracker {
    const items = blobList.map(blob => blob.name);
    const tracker = new PriorityTracker(items);
    blobList.forEach(blob => {
      const clue = blob.clue
      if (clue.clueType === "color" || clue.clueType === "side") {
        const targetedBlobs = blobList.filter(b => {
          return clue.clueType === "color" ? b.color === clue.targetedColor : b.side === clue.targetedSide;
        });
        const target = clue.target;
        const amount = targetedBlobs.length
        if (target.type === "all" || target.type === "some") {
          tracker.mention(blob.name, amount * 3, true);
        } else {
          tracker.mention(blob.name, amount, true);
        }
      }
      if (clue.clueType === "specific") {
        tracker.mention(blob.name, 4, true);
      }
      if (clue.clueType === "all") {
        tracker.mention(blob.name, 1, true);
      }
    })
    return tracker;
  }





  public mention(item: string, weight: number = 1, addIfNotPresent: boolean = false): void {
    // Find the item if it exists
    const index = this.items.findIndex(([name, _]) => name === item);

    if (index !== -1) {
      // If item exists, remove it
      const [_, currentWeight] = this.items.splice(index, 1)[0];
      weight += currentWeight;
    } else if (!addIfNotPresent) {
      // If item doesn't exist and we're not supposed to add it, return early
      return;
    }

    // Find the correct position for the item
    const insertIndex = this.items.findIndex(([_, w]) => w < weight);

    // Insert the item at the correct position
    if (insertIndex === -1) {
      this.items.push([item, weight]);
    } else {
      this.items.splice(insertIndex, 0, [item, weight]);
    }
  }

  public pop(): string | undefined {
    const item = this.items.shift();
    return item ? item[0] : undefined;
  }

  public getSortedItems(): string[] {
    return this.items.map(([name, _]) => name);
  }

  public clone(): PriorityTracker {
    const newTracker = new PriorityTracker();
    newTracker.items = this.items.map(([name, weight]) => [name, weight]);
    return newTracker;
  }

  public show(): string {
    return this.items.toString()
  }
}

export default PriorityTracker;