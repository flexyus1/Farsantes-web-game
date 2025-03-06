import { Blob, groupSide, GroupSide, Level } from "@farsantes/common";
import { getNextGuessState, removeAllGuessStates, setGuessStateToBlob } from "./utils";
import { slotManagerVisible } from "./constants";


export class StateManager {
  private currentLevel: string = "";
  private currentBlobsDistribution: Map<GroupSide, Blob[]> = new Map();
  private currentSlot: number = 0;
  private slotsContainer: HTMLElement | null = null;
  private levelSlots: Map<number, Map<string, string>> = new Map();
  private storageKeyPrefix: string = 'blobStates';

  constructor() {
    this.toggleSlotsContainer(slotManagerVisible);
  }

  public init(levelName: string, blobsDistribution: Map<GroupSide, Blob[]>): void {
    this.currentBlobsDistribution = blobsDistribution;
    this.currentLevel = levelName;
    this.currentSlot = 0;
    this.loadLevelState();
    if (this.levelSlots.size === 0) {
      this.addNewSlot();
    }
    this.setCurrentSlot(0);

  }

  public updateBlobElement(element: HTMLElement): void {
    const blobname = element.id;
    const blobStates = this.levelSlots.get(this.currentSlot);
    const blobState = blobStates?.get(blobname);

    if (blobState) {
      removeAllGuessStates(element);
      element.classList.add(blobState);
    }
  }



  public setCurrentSlot(slot: number): void {
    if (slot < 0 || slot >= this.levelSlots.size) {
      console.error(`Invalid slot number: ${slot}`);
      return;
    }

    this.currentSlot = slot;
    this.updateActiveSlotElement();
    this.applyCurrentStateToElements();
  }

  public setBlobToNextGuessState(blobname: string, blobElement: HTMLElement): void {
    const currentState = this.getBlobState(blobname);
    if (currentState) {
      const newState = getNextGuessState(currentState);
      this.setGuessState(blobname, blobElement, newState);
      this.saveLevelState();
    }
  }

  public addNewSlotAndSetItAsCurrent(): void {
    const newElement = this.addNewSlot();
    if (newElement) this.setRecentlyCreatedToElement(newElement);
    this.setCurrentSlot(this.levelSlots.size - 1);
  }

  public toggleSlotsContainer(visibility: boolean): void {
    const slotsContainer = this.getSlotContainer();
    const addButton = document.getElementById('slots-button-add');
    const resetButton = document.getElementById('slots-button-reset');
    const simpleButton = document.getElementById('slots-button-simple');
    if (!slotsContainer || !addButton || !resetButton || !simpleButton) {
      return
    }
    if (visibility) {
      simpleButton.classList.add('hidden');
      slotsContainer.classList.remove('hidden');
      addButton.classList.remove('hidden');
      resetButton.classList.remove('hidden');
    } else {
      simpleButton.classList.remove('hidden');
      slotsContainer.classList.add('hidden');
      addButton.classList.add('hidden');
      resetButton.classList.add('hidden');
    }
  }

  private getSlotContainer(): HTMLElement | null {
    if (!this.slotsContainer) {
      this.slotsContainer = document.getElementById('slots-container');
      return this.slotsContainer;
    }
    return this.slotsContainer;
  }

  private getBlobState(blobname: string): string | undefined {
    const blobStates = this.levelSlots.get(this.currentSlot);
    if (!blobStates) {
      console.error("No blob states found for the current slot.");
      return undefined;
    }
    return blobStates.get(blobname);
  }

  private addNewSlot(map?: Map<string, string>): HTMLElement | null {
    const newState = map || this.createSlot();
    this.levelSlots.set(this.levelSlots.size, newState);
    return this.newSlotElement()!;
  }

  private repositionLastSlot(targetSlot: number): void {
    if (targetSlot < 0 || targetSlot >= this.levelSlots.size) {
      console.error('Invalid target slot');
      return;
    }

    const lastSlotIndex = this.levelSlots.size - 1;
    const lastSlot = this.levelSlots.get(lastSlotIndex);

    if (!lastSlot) {
      console.error('No slot to reposition');
      return;
    }

    // Shift slots from target to the second-to-last
    for (let i = lastSlotIndex - 1; i >= targetSlot; i--) {
      const currentSlot = this.levelSlots.get(i);
      if (currentSlot) {
        this.levelSlots.set(i + 1, currentSlot);
      }
    }

    // Place the last slot in the target position
    this.levelSlots.set(targetSlot, lastSlot);

    this.updateSlotsIdx();
    this.reloadSlotElements();
  }

  private getStorageKey(): string {
    return `${this.storageKeyPrefix}_${this.currentLevel}`;
  }

  private createSlotElementsForLoadedState(): void {
    this.levelSlots.forEach((_, slot) => {
      this.newSlotElement();
    });
  }

  private clearAllSlotsElements(): void {
    const slotsContainer = this.getSlotContainer();
    if (!slotsContainer) {
      console.error("Slots container not found");
      return;
    }
    slotsContainer.innerHTML = '';
  }

  private updateCurrentSlotElement(): void {
    this.updateSlotElement(this.currentSlot);
  }

  private findSlotElement(slot: number): HTMLElement | null {
    const slotsContainer = this.getSlotContainer();
    if (!slotsContainer) {
      console.error("Slots container not found");
      return null
    }
    return slotsContainer.children[slot] as HTMLElement;
  }

  private updateSlotElement(slot: number): HTMLElement | void {
    const slotElement = this.findSlotElement(slot);
    if (!slotElement) {
      console.error(`Slot element not found for slot: ${slot}`);
      return;
    }

    const slotStates = this.levelSlots.get(slot) || this.createSlot();
    return this.rebuildElementFromSlot(slotStates, slot, slotElement);
  }

  private updateActiveSlotElement(): void {
    const slotsContainer = this.getSlotContainer();
    if (!slotsContainer) {
      console.error("Slots container not found");
      return;
    }

    // Remove 'active' class from all slots
    Array.from(slotsContainer.children).forEach((slotElement) => {
      slotElement.classList.remove('active');
    });

    // Add 'active' class to the current slot
    const currentSlotElement = slotsContainer.children[this.currentSlot];
    if (currentSlotElement) {
      currentSlotElement.classList.add('active');
    }
  }

  public resetAllSlots(): void {
    // Clear all existing slots
    this.levelSlots.clear();

    // Create a single empty slot
    this.levelSlots.set(0, this.createSlot());

    // Reset current slot to 0
    this.currentSlot = 0;

    // Clear and recreate slot elements
    this.clearAllSlotsElements();
    this.newSlotElement();

    // Update the active slot
    this.updateActiveSlotElement();

    // Apply the empty state to all blob elements
    this.applyCurrentStateToElements();

    // Save the reset state
    this.saveLevelState();
  }



  private createElementFromSlot(slot: Map<string, string>, slotNumber: number): HTMLElement {
    const container = document.createElement('div');
    container.className = 'slot-outer-container';
    return this.fillElement(slot, slotNumber, container);
  }

  private rebuildElementFromSlot(slot: Map<string, string>, slotNumber: number, container: HTMLElement): HTMLElement {
    container.innerHTML = '';
    return this.fillElement(slot, slotNumber, container);
  }

  private fillElement(slot: Map<string, string>, slotNumber: number, slotsOuterContainer: HTMLElement): HTMLElement {
    const slotsContainer = document.createElement('div');
    slotsContainer.className = 'slot-main-container';

    const middleContainer = document.createElement('div');
    middleContainer.className = 'slot-middle-container';

    slotsOuterContainer.appendChild(slotsContainer);
    slotsContainer.appendChild(middleContainer);
    slotsOuterContainer.addEventListener('click', () => {
      this.setCurrentSlot(slotNumber);
    }
    );

    const bottomSide = this.currentBlobsDistribution.get(groupSide.BOTTOM) || [];
    const leftSide = this.currentBlobsDistribution.get(groupSide.LEFT) || [];
    const rightSide = this.currentBlobsDistribution.get(groupSide.RIGHT) || [];

    const setBlobs = (element: HTMLElement, blobs: Blob[], isBottom: boolean) => {
      blobs.forEach((blob) => {
        const blobElement = document.createElement('div');
        blobElement.className = 'slot-blob';
        if (isBottom) {
          blobElement.style.width = '30%';
          blobElement.style.height = '100%';
        } else {
          blobElement.style.height = 100 / blobs.length + '%';
          blobElement.style.width = '100%';
        }
        const color = slot.get(blob.name) || "none";
        blobElement.classList.add(color);
        element.appendChild(blobElement);
      })
    }

    if (leftSide.length > 0) {
      const leftContainer = document.createElement('div');
      leftContainer.className = 'slot-container side';
      setBlobs(leftContainer, leftSide, false);
      middleContainer.appendChild(leftContainer);
    }

    if (rightSide.length > 0) {
      const rightContainer = document.createElement('div');
      rightContainer.className = 'slot-container side';
      setBlobs(rightContainer, rightSide, false);
      middleContainer.appendChild(rightContainer);
    }

    if (bottomSide.length > 0) {
      const bottomContainer = document.createElement('div');
      bottomContainer.className = 'slot-container bottom';
      setBlobs(bottomContainer, bottomSide, true);
      if (rightSide.length === 1) bottomContainer.style.height = '50%';
      if (rightSide.length === 2) bottomContainer.style.height = '40%';
      if (rightSide.length === 3) bottomContainer.style.height = '25%';
      middleContainer.style.flexGrow = '1';
      slotsContainer.appendChild(bottomContainer);
    } else {
      middleContainer.style.height = '100%';
    }

    this.addButtonsToSlot(slotsOuterContainer);

    return slotsOuterContainer;
  }

  private cloneSlotToNext(slotToClone: number): void {
    const slotStates = this.levelSlots.get(slotToClone);

    if (!slotStates) {
      console.error(`Slot ${slotToClone} states not found`);
      return;
    }

    const newSlotNumber = slotToClone + 1;

    this.addNewSlot(new Map(slotStates));

    this.repositionLastSlot(newSlotNumber);

    this.updateSlotElement(newSlotNumber);

    const newElement = this.findSlotElement(newSlotNumber);

    if (slotToClone === this.currentSlot) {
      this.setCurrentSlot(newSlotNumber);
    }

    if (!newElement) {
      console.error(`New slot element not found`);
      return;
    }

    this.setRecentlyCreatedToElement(newElement);

  }

  private setRecentlyCreatedToElement(element: HTMLElement): void {
    element.classList.add('recently-created');

    setTimeout(() => {
      element.classList.remove('recently-created');
    }, 10);
  }

  private setSlotToDeletion(slotToDelete: number): void {
    const slotElement = this.findSlotElement(slotToDelete);
    if (slotElement) {
      slotElement.classList.add('to-delete');
    }
  }

  private deleteSlotAndReorganize(slotToDelete: number): void {
    this.setSlotToDeletion(slotToDelete);

    setTimeout(() => {
      this.levelSlots.delete(slotToDelete);

      const sortedSlots = Array.from(this.levelSlots.keys()).sort((a, b) => a - b);

      const reorganizedSlots = new Map<number, Map<string, string>>();

      sortedSlots.forEach((oldSlot, index) => {
        reorganizedSlots.set(index, this.levelSlots.get(oldSlot)!);
      });

      this.levelSlots = reorganizedSlots;

      console.log(`currentSlot: ${this.currentSlot}, slotToDelete: ${slotToDelete}`);

      if (this.levelSlots.size === 0) {
        this.levelSlots.set(0, this.createSlot());
        this.setCurrentSlot(0);
      }

      this.saveLevelState();

      this.reloadSlotElements();

      if (slotToDelete === this.currentSlot) {
        const newCurrentSlot = Math.max(0, sortedSlots.findIndex(slot => slot > slotToDelete) - 1);
        this.setCurrentSlot(newCurrentSlot);
      } else if (slotToDelete < this.currentSlot) {
        this.setCurrentSlot(this.currentSlot - 1);
      }

      const slotsContainer = this.getSlotContainer();
      if (slotsContainer) {
        Array.from(slotsContainer.children).forEach((slotElement, index) => {
          slotElement.setAttribute('data-slot', index.toString());
        });
      }

      this.applyCurrentStateToElements();

      if (this.currentSlot === slotToDelete) this.setCurrentSlot(0);
    }, 300);
  }

  private updateSlotsIdx(): void {
    const slotsContainer = this.getSlotContainer();
    if (!slotsContainer) {
      console.error("Slots container not found");
      return;
    }
    const slots = Array.from(slotsContainer.children);

    slots.forEach((slot, index) => {
      slot.setAttribute('data-slot', index.toString());
    })
    this.saveLevelState();
  }

  private newSlotElement(): HTMLElement | null {
    const slotsContainer = this.getSlotContainer();
    if (!slotsContainer) {
      console.error("Slots container not found");
      return null;
    }

    const slot = slotsContainer.children.length;
    const slotStates = this.levelSlots.get(slot) || this.createSlot();

    const outerSlotElement = this.createElementFromSlot(slotStates, slot);
    outerSlotElement.setAttribute('data-slot', slot.toString());
    slotsContainer.appendChild(outerSlotElement);
    return outerSlotElement;
  }

  private addButtonsToSlot(slotElement: HTMLElement): void {
    const clickEffect = (func: (slot: number) => void) => (event: MouseEvent) => {
      const selfElement = event.currentTarget as HTMLElement;
      const slot = parseInt(selfElement.parentElement!.getAttribute('data-slot') || '0');
      console.log('Button clicked for slot:', slot);
      func(slot);
    }

    slotElement.appendChild(this.createButton('del', clickEffect(this.deleteSlotAndReorganize.bind(this))));
    slotElement.appendChild(this.createButton('copy', clickEffect(this.cloneSlotToNext.bind(this))));
  }

  private createButton(buttonName: string, onClick: (event: MouseEvent) => void): HTMLImageElement {
    const icon = document.createElement('img');
    icon.src = `public/img/button/${buttonName}-button.svg`;
    icon.className = 'slots-button';
    icon.classList.add(buttonName);
    icon.addEventListener('click', onClick);
    return icon;
  }

  private createSlot(): Map<string, string> {
    const slot = new Map<string, string>();

    [groupSide.BOTTOM, groupSide.LEFT, groupSide.RIGHT].forEach(side => {
      const sideBlobs = this.currentBlobsDistribution.get(side) || [];
      sideBlobs.forEach(blob => {
        slot.set(blob.name, "none");
      });
    });

    return slot;
  }

  private getStateFromLocalStorage(): void {
    this.levelSlots.clear();
    const storedLevel = localStorage.getItem(this.getStorageKey());
    if (!storedLevel) {
      return;
    }
    const parsedLevel = JSON.parse(storedLevel) as Record<string, Record<string, string>>;
    this.levelSlots = new Map(
      Object.entries(parsedLevel).map(([slot, states]) => [parseInt(slot), new Map(Object.entries(states))])
    );

    this.createSlotElementsForLoadedState();
  }

  private loadLevelState(): void {
    this.getStateFromLocalStorage();
    this.reloadSlotElements();
  }

  private reloadSlotElements(): void {
    this.clearAllSlotsElements();
    this.createSlotElementsForLoadedState();
  }

  private saveLevelState(): void {
    const levelObj: Record<string, Record<string, string>> = {};
    this.levelSlots.forEach((states, slot) => {
      levelObj[slot.toString()] = Object.fromEntries(states);
    });
    const dataToSave = JSON.stringify(levelObj);
    localStorage.setItem(this.getStorageKey(), dataToSave);
  }

  private applyCurrentStateToElements(): void {
    const blobStates = this.levelSlots.get(this.currentSlot);
    if (blobStates) {
      blobStates.forEach((state, blobname) => {
        const element = document.getElementById(blobname);
        if (element) {
          removeAllGuessStates(element);
          element.classList.add(state);
        }
      });
    }
  }

  private setGuessState(blobname: string, blobElement: HTMLElement, guessState: string): void {
    const blobStates = this.levelSlots.get(this.currentSlot);
    if (blobStates) {
      blobStates.set(blobname, guessState);
      this.updateCurrentSlotElement();
      setGuessStateToBlob(blobElement, guessState);
    } else {
      console.error("No blob states found for the current slot.");
    }
  }
}
