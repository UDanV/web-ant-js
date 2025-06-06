var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { filterState } from "./filter-locations.js";
const cardsContainer = document.querySelector('.cards__content');
const loadMoreButton = document.querySelector('.pagination');
export function renderLocation(locations) {
    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'card card__location';
        card.dataset.id = location.id.toString();
        card.innerHTML = `
          <h2>${location.name}</h2>
          <p>${location.type}</p>
        `;
        card.addEventListener('click', () => {
            window.location.href = `location-details.html?id=${location.id}`;
        });
        cardsContainer.appendChild(card);
    });
}
export function fetchLocation(page, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const url = new URL("https://rickandmortyapi.com/api/location/");
        url.searchParams.set("page", page.toString());
        Object.entries(filters).forEach(([key, value]) => {
            if (value)
                url.searchParams.append(key, value);
        });
        const res = yield fetch(url.toString());
        if (!res.ok)
            throw new Error("Не удалось загрузить данные");
        const data = yield res.json();
        filterState.hasMorePages = ((_a = data.info) === null || _a === void 0 ? void 0 : _a.next) !== null;
        return data.results;
    });
}
function loadLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const locations = yield fetchLocation(filterState.currentPage, filterState.currentFilters);
            if (locations.length === 0 && filterState.currentPage > 1) {
                loadMoreButton.style.display = 'none';
                return;
            }
            renderLocation(locations);
            filterState.currentPage++;
            loadMoreButton.style.display = filterState.hasMorePages ? 'block' : 'none';
        }
        catch (error) {
            console.error("Ошибка при загрузке локаций:", error);
            loadMoreButton.style.display = 'none';
        }
    });
}
loadLocation();
loadMoreButton.addEventListener('click', () => {
    loadLocation();
});
