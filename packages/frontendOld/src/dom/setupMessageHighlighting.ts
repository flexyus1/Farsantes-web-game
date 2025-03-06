import { Blob, BlobIntegrity, blobIntegrity } from "@farsantes/common";
import { BlobNameIsTargeted } from "../blob/utils";

export function setupMessageHighlighting(blobsMap: Map<string, Blob>): void {
  const charAndChatContainers = document.querySelectorAll('.blob-main-container') as NodeListOf<HTMLDivElement>;

  charAndChatContainers.forEach((container: HTMLDivElement) => {
    const name = container.getAttribute('data-name');
    if (!name) return;

    let touchTimeout: ReturnType<typeof setTimeout> | null = null;
    let isLongPress = false;

    const startHighlight = () => {
      container.classList.add('hovered');
      highlightMessages(name, blobsMap);
    };

    const endHighlight = () => {
      container.classList.remove('hovered');
      removeHighlights();
    };

    // Mouse events
    container.addEventListener('mouseover', startHighlight);
    container.addEventListener('mouseout', endHighlight);

    // Prevent context menu on long press
    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Touch events
    container.addEventListener('touchstart', (e) => {
      isLongPress = false;
      startHighlight(); // Start highlighting immediately

      touchTimeout = setTimeout(() => {
        isLongPress = true;
        e.preventDefault(); // Prevent default behavior on long press
      }, 250); // Set isLongPress to true after 250ms
    });

    container.addEventListener('touchend', (e) => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }

      if (isLongPress) {
        e.preventDefault();
        // Long press specific actions can go here
      } else {
        // Simulate a click for quick tap
        e.preventDefault();
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        container.dispatchEvent(clickEvent);
      }

      endHighlight(); // Always end highlighting on touch end
    });

    container.addEventListener('touchmove', (e) => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
      endHighlight();
    });
  });
}

function highlightMessages(blobName: string, blobsMap: Map<string, Blob>): void {
  const charAndChatContainers = document.querySelectorAll('.blob-main-container') as NodeListOf<HTMLDivElement>;
  const blob = blobsMap.get(blobName);
  if (!blob) return;

  charAndChatContainers.forEach((charAndChatContainer: HTMLDivElement) => {
    const blobName = charAndChatContainer.getAttribute('data-name');
    if (!blobName) return;

    const target = blobsMap.get(blobName);
    if (!target) return;

    const isTargeted = BlobNameIsTargeted(blob.clue, target.name, blobsMap);
    if (isTargeted) {
      highlightMessage(charAndChatContainer, blob.clue.assertionType);
    }
  });
}

function highlightMessage(charAndChatContainer: HTMLDivElement, blobIntegrity: BlobIntegrity): void {
  const className = blobIntegrity.toString();
  charAndChatContainer.classList.add(className);
}

function removeHighlights(): void {
  const charAndChatContainers = document.querySelectorAll('.blob-main-container') as NodeListOf<HTMLDivElement>;
  charAndChatContainers.forEach((charAndChatContainer: HTMLDivElement) => {
    removeHighlight(charAndChatContainer);
  });
}

function removeHighlight(charAndChatContainer: HTMLDivElement): void {
  charAndChatContainer.classList.remove(blobIntegrity.TRUE.toString());
  charAndChatContainer.classList.remove(`maybe-${blobIntegrity.TRUE.toString()}`);
  charAndChatContainer.classList.remove(blobIntegrity.FALSE.toString());
  charAndChatContainer.classList.remove(`maybe-${blobIntegrity.FALSE.toString()}`);
}