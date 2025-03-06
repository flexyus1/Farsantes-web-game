import { Blob } from "@farsantes/common";
import { setDelayToCharacters } from "./utils";
import { getHat } from "./hats";
import { getBody } from "./bodies";

export function createBlobElement(blob: Blob): HTMLDivElement {
  const color = blob.color;
  const name = blob.name;
  const characterContainerContainer = document.createElement('div');
  characterContainerContainer.classList.add('char-and-name-container');

  const characterName = document.createElement('div');
  characterName.classList.add('character-name');
  characterName.textContent = name;

  const characterContainer = document.createElement('div');
  characterContainer.classList.add('char-imgs-container');

  let path = "public/img/blob/"

  const body = document.createElement('div') as HTMLImageElement;
  const hat = document.createElement('div') as HTMLImageElement;

  hat.innerHTML = getHat(color);
  body.innerHTML = getBody();

  body.classList.add('character', 'body');
  body.classList.add('idle');
  hat.classList.add('character', 'hat');
  hat.classList.add('idle');

  setDelayToCharacters([body, hat], 1000);

  characterContainer.appendChild(body);
  characterContainer.appendChild(hat);
  characterContainerContainer.appendChild(characterContainer);
  characterContainerContainer.appendChild(characterName);

  return characterContainerContainer;
}