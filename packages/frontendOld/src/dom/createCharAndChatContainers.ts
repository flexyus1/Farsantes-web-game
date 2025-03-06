import { Blob, GroupSide } from "@farsantes/common";
import { getBlobText } from "../blob";
import { flipBlob } from "./utils";
import { createBlobElement } from "./createBlobElement";
import { createBubbleElement } from "./createBubbleElement";

export function createCharAndChatContainer(blob: Blob, clickHandler: (event: MouseEvent) => void): HTMLDivElement | null {
  const side = blob.side as GroupSide;
  if (!side) {
    console.error("Invalid side");
    return null
  }
  const flip = side === "right"
  const character = createBlobElement(blob);
  if (flip) {
    flipBlob(character)
  }

  const blobText = getBlobText(blob);
  const chatBubble = createBubbleElement(blobText);
  const charAndChatContainer = document.createElement('div');
  charAndChatContainer.className = 'blob-main-container'
  charAndChatContainer.classList.add(side)
  charAndChatContainer.setAttribute('data-name', blob.name)
  charAndChatContainer.id = blob.name
  charAndChatContainer.appendChild(character)
  charAndChatContainer.appendChild(chatBubble)
  charAndChatContainer.addEventListener('click', clickHandler)
  createAllButtonCheckElements(character)

  return charAndChatContainer
}

function createAllButtonCheckElements(element: HTMLElement) {
  const colors = ['green', 'red', 'yellow']
  colors.forEach((color) => {
    const button = createButtonCheckElement(color)
    element.appendChild(button)
  })
}

function createButtonCheckElement(color: string): HTMLElement {
  const button = document.createElement('img');
  button.src = `public/img/checkMark/${color}_check_button.svg`;
  button.className = 'check-button';
  button.classList.add(color);
  return button;
}