var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchLocation, renderLocation } from "./api/locations.js";
import { debounce } from "./debounce.js";
import { filterState } from "./api/filter-locations.js";
export function setupFilterModal() {
    const openButton = document.querySelector('.filter-mobile-button');
    const closeBtn = document.querySelector('.filter-modal__close');
    const modal = document.querySelector('.filter-modal');
    const applyButton = document.querySelector('.filter-modal__apply');
    if (!openButton || !closeBtn || !modal || !applyButton) {
        console.error("One or more modal elements not found");
        return;
    }
    const nameInput = document.querySelector('.main__filter .filter-input');
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
        if (e.target === modal)
            closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    function filterAndRender() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const name = (nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim()) || '';
            const type = ((_a = document.getElementById('modalFilterType')) === null || _a === void 0 ? void 0 : _a.value) || '';
            const dimension = ((_b = document.getElementById('modalFilterDimension')) === null || _b === void 0 ? void 0 : _b.value) || '';
            const filters = { name, type, dimension };
            const container = document.querySelector('.cards__content');
            const loadMoreButton = document.querySelector('.pagination');
            if (container)
                container.innerHTML = '';
            try {
                const data = yield fetchLocation(1, filters);
                renderLocation(data);
                if (loadMoreButton) {
                    loadMoreButton.style.display = filterState.hasMorePages ? 'block' : 'none';
                }
            }
            catch (err) {
                console.error("Ошибка фильтрации:", err);
                if (loadMoreButton)
                    loadMoreButton.style.display = 'none';
            }
        });
    }
    const debouncedFilter = debounce(filterAndRender, 500);
    nameInput === null || nameInput === void 0 ? void 0 : nameInput.addEventListener('input', debouncedFilter);
    applyButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        yield filterAndRender();
        closeModal();
    }));
}
document.addEventListener('DOMContentLoaded', () => {
    setupFilterModal();
});
