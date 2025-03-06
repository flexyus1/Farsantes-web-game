export function initializeLevelIcons(iconWrapperSelector: string, levelIconSelector: string): void {
  const iconWrapper = document.querySelector(iconWrapperSelector) as HTMLElement;
  if (iconWrapper) {
    populateIconWrapper(iconWrapper);
    iconWrapper.style.setProperty('--total-icons', iconWrapper.children.length.toString());
  }
  const levelIcons = document.querySelectorAll(levelIconSelector) as NodeListOf<HTMLElement>;
  let activeIndex = 0;

  levelIcons.forEach((icon, index) => {
    icon.setAttribute('data-index', index.toString());
  });

  function calculateOffset(index: number, totalIcons: number): number {
    return index - (totalIcons - 1) / 2;
  }

  function updateIconPositions(): void {
    const totalIcons = levelIcons.length;

    levelIcons.forEach((icon, index) => {
      const offset = calculateOffset(index, totalIcons);
      icon.style.setProperty('--offset', offset.toString());
      icon.classList.toggle('active', index === activeIndex);
    });
  }

  iconWrapper.addEventListener('click', (event: MouseEvent) => {
    const clickedIcon = (event.target as HTMLElement).closest(levelIconSelector);
    if (clickedIcon) {
      activeIndex = parseInt(clickedIcon.getAttribute('data-index') || '0', 10);
      updateIconPositions();
      iconWrapper.classList.add('hide-inactive');
    }
  });

  iconWrapper.addEventListener('mouseenter', () => {
    iconWrapper.classList.remove('hide-inactive');
  });

  iconWrapper.addEventListener('mouseleave', () => {
    iconWrapper.classList.add('hide-inactive');
  });

  updateIconPositions();
}

function createLevelIconContainer(amount: number, extraClass: string): HTMLDivElement {
  const container = document.createElement('div');
  container.className = `level-icon ${extraClass}`;

  for (let i = 0; i < amount; i++) {
    const item = document.createElement('div');
    item.className = 'item';
    container.appendChild(item);
  }

  return container;
}

function populateIconWrapper(iconWrapper: HTMLElement): void {
  const greenContainer = createLevelIconContainer(4, 'easy');
  const blueContainer = createLevelIconContainer(6, 'medium');
  const redContainer = createLevelIconContainer(8, 'hard');

  iconWrapper.appendChild(greenContainer);
  iconWrapper.appendChild(blueContainer);
  iconWrapper.appendChild(redContainer);
}