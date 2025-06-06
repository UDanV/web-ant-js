import { fetchCharacters, renderCharacters } from "./api/characters.js";
import { debounce } from "./debounce.js";

export function setupFilterModal() {
    const openButton = document.querySelector<HTMLButtonElement>('.filter-mobile-button');
    const closeBtn = document.querySelector<HTMLButtonElement>('.filter-modal__close');
    const modal = document.querySelector<HTMLDivElement>('.filter-modal');
    const applyButton = document.querySelector<HTMLButtonElement>('.filter-modal__apply');

    if (!openButton || !closeBtn || !modal || !applyButton) {
        console.error("One or more modal elements not found");
        return;
    }

    const nameInput = document.querySelector<HTMLInputElement>('.main__filter .filter-input');

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openButton.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    async function filterAndRender() {
        const name = nameInput?.value.trim() || '';
        const species = (document.getElementById('modalFilterSpecies') as HTMLSelectElement)?.value || '';
        const gender = (document.getElementById('modalFilterGender') as HTMLSelectElement)?.value || '';
        const status = (document.getElementById('modalFilterStatus') as HTMLSelectElement)?.value || '';

        const filters = { name, species, gender, status };

        const container = document.querySelector('.cards__content');
        const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

        if (container) container.innerHTML = '';

        try {
            const data = await fetchCharacters(1, filters);
            renderCharacters(data.results);

            if (loadMoreButton) {
                loadMoreButton.style.display = data.info.next ? 'block' : 'none';
            }
        } catch (err) {
            console.error("Ошибка фильтрации:", err);
            if (loadMoreButton) loadMoreButton.style.display = 'none';
        }
    }

    const debouncedFilter = debounce(filterAndRender, 500);

    nameInput?.addEventListener('input', debouncedFilter);

    applyButton.addEventListener('click', async () => {
        await filterAndRender();
        closeModal();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupFilterModal();
});