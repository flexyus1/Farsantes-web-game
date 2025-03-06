const blobCheckStates: string[] = ["green", "red", "none"];

export function removeAllGuessStates(element: HTMLElement): void {
  element.classList.remove(...blobCheckStates);
}

export function getNextGuessState(currentState: string): string {
  const currentStateIndex = blobCheckStates.indexOf(currentState);
  const nextStateIndex = (currentStateIndex + 1) % blobCheckStates.length;
  const newState = blobCheckStates[nextStateIndex];
  return newState;
}

export function setGuessStateToBlob(blobElement: HTMLElement, newState: string): void {
  removeAllGuessStates(blobElement);
  blobElement.classList.add(newState);
}