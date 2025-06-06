import { fetchLocation, renderLocation } from "./api/locations.js";
import { debounce } from "./debounce.js";
import {filterState} from "./api/filter-locations.js";

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
        const type = (document.getElementById('modalFilterType') as HTMLSelectElement)?.value || '';
        const dimension = (document.getElementById('modalFilterDimension') as HTMLSelectElement)?.value || '';

        const filters = { name, type, dimension };

        const container = document.querySelector('.cards__content');
        const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

        if (container) container.innerHTML = '';

        try {
            const data = await fetchLocation(1, filters);
            renderLocation(data);

            if (loadMoreButton) {
                loadMoreButton.style.display = filterState.hasMorePages ? 'block' : 'none';
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