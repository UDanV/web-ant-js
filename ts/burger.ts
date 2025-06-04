const burger = document.querySelector('.burger') as HTMLButtonElement;
const mobileMenu = document.querySelector('.header__mobile--links') as HTMLUListElement;
const closeButton = document.querySelector('.header__mobile--close') as HTMLButtonElement;

function toggleMenu(isOpen: boolean) {
    mobileMenu.classList.toggle('show', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.hidden = !isOpen;
}

burger.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('show'));
});

closeButton.addEventListener('click', () => {
    toggleMenu(false);
});

// Закрытие при клике вне меню (опционально)
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.header__mobile') && mobileMenu.classList.contains('show')) {
        toggleMenu(false);
    }
});

// Закрытие при нажатии Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
        toggleMenu(false);
    }
});