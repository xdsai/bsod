// Modal management
const modals = new Map<string, HTMLElement>();

// Register all modals
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach((modal) => {
    const id = modal.id.replace('modal-', '');
    modals.set(id, modal as HTMLElement);

    // Close button handler
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(id));

    // Backdrop click to close
    const backdrop = modal.querySelector('.modal-backdrop');
    backdrop?.addEventListener('click', () => closeModal(id));
  });
});

// Listen for open modal events
window.addEventListener('open-modal', ((e: CustomEvent) => {
  const { target } = e.detail;

  // Special handling for blog (navigate to page)
  if (target === 'blog') {
    window.location.href = '/blog';
    return;
  }

  openModal(target);
}) as EventListener);

// ESC key to close active modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      const id = activeModal.id.replace('modal-', '');
      closeModal(id);
    }
  }
});

function openModal(id: string) {
  const modal = modals.get(id);
  if (!modal) return;

  // Show modal instantly (no glitch effect)
  modal.classList.add('active');

  // Focus first focusable element or modal itself
  const focusable = modal.querySelector('button, a, input, [tabindex="0"]');
  if (focusable) {
    (focusable as HTMLElement).focus();
  }
}

function closeModal(id: string) {
  const modal = modals.get(id);
  if (!modal) return;

  modal.classList.remove('active');

  // Return focus to menu
  const selectedItem = document.querySelector('.menu-item.selected');
  if (selectedItem) {
    (selectedItem as HTMLElement).focus();
  }
}
