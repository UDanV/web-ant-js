"use strict";
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.header__mobile--links');
const closeButton = document.querySelector('.header__mobile--close');
function toggleMenu(isOpen) {
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
    const target = e.target;
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
