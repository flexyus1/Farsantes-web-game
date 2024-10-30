import { Blob, BlobIntegrity, GroupSide, Level, blobIntegrity, convertBlobListToMap, groupSides, isDebugEnabled, tutorial1 } from "@farsantes/common";
import { createCharAndChatContainer, initializeLevelIcons, setupMessageHighlighting } from "../dom";
import LevelManager from "../../../common/dist/LevelManager/LevelManager";
import { fetchLevel } from "../api/fetchLevel";
import { StateManager } from "./StateManager";

export class LevelDisplayManager {
  private currentLevel: Level;
  private blobDistribution: Map<GroupSide, Blob[]>;
  private gameContainer: HTMLElement | null;
  private stateManager: StateManager;

  constructor() {
    this.currentLevel = tutorial1()
    this.blobDistribution = new Map<GroupSide, Blob[]>();
    this.gameContainer = document.getElementById('game-container');
    this.stateManager = new StateManager;
    this.setupEventListeners();
    this.init();
  }

  private async init() {
    try {
      await this.changeLevel('easy');
    } catch (error) {
      console.error('Failed to initialize with easy level:', error);
    }
  }

  private setupEventListeners(): void {
    initializeLevelIcons('.icon-wrapper', '.level-icon');
    const levelButtons = document.querySelectorAll<HTMLElement>('.level-icon, .hamburger-section');
    levelButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.classList.contains('active')) {
          return;
        }
        const level = button.classList[1];
        if (level) {
          this.changeLevel(level);
        }
      });
    });

    const hamburger = document.querySelector('.hamburger-icon');
    const menuItems = document.querySelector('.hamburger-items');
    if (hamburger && menuItems) {
      hamburger.addEventListener('click', () => menuItems.classList.toggle('show'));
      menuItems.addEventListener('click', () => menuItems.classList.remove('show'));
    }

    const resetButton = document.getElementById('slots-button-reset');
    const resetButton2 = document.getElementById('slots-button-simple');
    const addButton = document.getElementById('slots-button-add');
    console.log(`resetButton: ${resetButton}, addButton: ${addButton}, resetButton2: ${resetButton2}`);
    if (resetButton && addButton && resetButton2) {
      resetButton.addEventListener('click', () => this.stateManager.resetAllSlots());
      resetButton2.addEventListener('click', () => this.stateManager.resetAllSlots());
      addButton.addEventListener('click', () => this.stateManager.addNewSlotAndSetItAsCurrent());
    }
  }

  private async changeLevel(levelName: string): Promise<void> {
    try {
      const { level, liarCount } = await fetchLevel(levelName);
      this.setLiarCountInfo(liarCount);
      this.currentLevel = level;
      this.loadLevel();
    } catch (error) {
      console.error(`Failed to change level to ${levelName}:`, error);
    }
  }

  private setLiarCountInfo(liarCount: { min: number; max: number; isRevealed: boolean; }): void {
    const liarCountElement = document.getElementById('liar-count');
    if (!liarCountElement) {
      return;
    }
    if (liarCount.isRevealed) {
      liarCountElement.textContent = `Falsos: ${liarCount.min}`;
      return;
    }

    liarCountElement.textContent = `Falsos: ${liarCount.min} - ${liarCount.max}`;
  }

  private loadLevel() {
    this.clearContent();
    const blobsMap = convertBlobListToMap(this.currentLevel.blobs);
    this.setupLevel(this.currentLevel, blobsMap);
    this.showSolutionInConsole(this.currentLevel);
    this.stateManager.init(this.currentLevel.seed!, this.blobDistribution);
  }

  private clearContent() {
    this.blobDistribution.clear();
    groupSides.forEach(side => {
      const group = this.getGroupElement(side);
      if (group) group.innerHTML = '';
    });
  }

  private setupLevel(level: Level, blobsMap: Map<string, Blob>) {
    level.blobs.forEach(blob => {
      const side = blob.side!
      const existingBlobs = this.blobDistribution.get(side) || [];
      const updatedBlobs = [...existingBlobs, blob];
      this.blobDistribution.set(side, updatedBlobs);

      const parentGroup = this.getGroupElement(side);
      if (parentGroup) {
        const clickHandler = (event: MouseEvent) => {
          const blobElement = event.currentTarget as HTMLElement;
          const blobName = blobElement.id
          this.stateManager.setBlobToNextGuessState(blobName, blobElement);
        }
        const charAndChatContainer = createCharAndChatContainer(blob, clickHandler);
        if (charAndChatContainer) parentGroup.appendChild(charAndChatContainer);
      }
    });
    setupMessageHighlighting(blobsMap);
  }

  private getGroupElement(side: GroupSide): HTMLElement | null {
    return document.querySelector(`.group.${side}`) as HTMLElement;
  }

  private showSolutionInConsole(level: Level) {
    const levelManager = new LevelManager(level);
    const { solutions, counter } = levelManager.findSolutions();

    // Find fake blobs and truthful blobs
    const allBlobs = new Set<string>();
    const everFakeBlobs = new Set<string>();

    solutions.forEach(solution => {
      solution.blobsClassifications.forEach((blobClassification: BlobIntegrity, name: string) => {
        allBlobs.add(name);
        if (blobClassification === blobIntegrity.FALSE) {
          everFakeBlobs.add(name);
        }
      });
    });

    const truthfulBlobs = Array.from(allBlobs).filter(blob => !everFakeBlobs.has(blob));

    // if (!isDebugEnabled) console.clear()

    // Print solutions
    console.log(`\n%c🧩 ${level.name} 🧩`, 'color: #4CAF50; font-weight: bold; font-size: 16px;');
    console.log(`%cFound ${solutions.length} solution(s)`, 'color: #2196F3; font-weight: bold;');

    solutions.forEach((solution, index) => {
      const fakeBlobs = Array.from(solution.blobsClassifications.entries())
        .filter(([_, type]) => type === blobIntegrity.FALSE)
        .map(([name, _]) => name);

      console.log(`%cSolution ${index + 1}:`, 'color: #FF9800; font-weight: bold;');
      console.log(`  %c${fakeBlobs.join(', ') || 'None'}`, 'color: #F44336; font-weight: bold;');
    });

    // Print truthful blobs
    console.log('\n%cSafe Blobs', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
    if (truthfulBlobs.length > 0) {
      console.log(`  %c${truthfulBlobs.join(', ')}`, 'color: #2196F3; font-weight: bold;');
    } else {
      console.log("%cNo blobs are always truthful across all solutions.", 'color: #F44336;');
    }

    // show level.seed 
    console.log(`\n%cSeed: ${level.seed}`, 'color: #4CAF50; font-weight: bold; font-size: 16px;');

  }
}
