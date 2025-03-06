import { Blob } from "@farsantes/common";

export function flipBlob(containerContainer: HTMLElement): void {
  containerContainer.children[0].classList.add('flip');
}

export function setDelayToCharacters(characters: HTMLImageElement[] | NodeListOf<HTMLImageElement>, max: number, fixed?: number): number {
  const delay = Math.floor(Math.random() * max);
  characters.forEach(character => {
    character.style.animationDelay = `${delay}ms`;
  });
  return delay;
}

export function createImageElement(className: string, src: string): HTMLImageElement {
  const element = document.createElement('img');
  element.classList.add('character', className);
  element.src = src;
  element.alt = "Character";
  return element;
}
