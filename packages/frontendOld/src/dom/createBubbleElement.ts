import { GroupSide } from "@farsantes/common";

export function createBubbleElement(body: string): HTMLDivElement {
  const container = document.createElement('div');
  container.classList.add('chat-container');
  container.innerHTML = `
    <div class="chat-rectangle fill"></div>
    <div class="chat-rectangle stroke"></div>
    ${body}
    </line>`;

  return container;
}
