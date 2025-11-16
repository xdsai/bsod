// Menu navigation state
let selectedIndex = 0;
const menuItems = Array.from(document.querySelectorAll('.menu-item'));

// Initialize menu when boot completes
window.addEventListener('boot-complete', () => {
  const menu = document.getElementById('bsod-menu');
  if (menu) {
    menu.style.display = 'block';
    selectMenuItem(0);
  }
});

// Select menu item by index
function selectMenuItem(index: number) {
  menuItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('selected');
      (item as HTMLElement).focus();
    } else {
      item.classList.remove('selected');
    }
  });
  selectedIndex = index;
}

// Navigate menu with arrow keys
document.addEventListener('keydown', (e) => {
  // Only handle if no modal is open
  if (document.querySelector('.modal.active')) return;

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
      selectMenuItem(selectedIndex);
      break;
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % menuItems.length;
      selectMenuItem(selectedIndex);
      break;
    case 'Enter':
      e.preventDefault();
      openModal(menuItems[selectedIndex].getAttribute('data-target') || '');
      break;
  }
});

// Click to select and open
menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    selectMenuItem(index);
    openModal(item.getAttribute('data-target') || '');
  });
});

// Open modal based on target
function openModal(target: string) {
  const event = new CustomEvent('open-modal', { detail: { target } });
  window.dispatchEvent(event);
}
