import { Location } from "../types/location";
import { filterState } from "./filter-locations.js";

const cardsContainer = document.querySelector('.cards__content') as HTMLElement;
const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

export function renderLocation(locations: Location[]): void {
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

async function fetchLocation(page: number, filters: typeof filterState.currentFilters): Promise<Location[]> {
    const url = new URL("https://rickandmortyapi.com/api/location/");
    url.searchParams.set("page", page.toString());

    Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
    });

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Не удалось загрузить данные");

    const data = await res.json();

    filterState.hasMorePages = data.info?.next !== null;

    return data.results as Location[];
}

async function loadLocation(): Promise<void> {
    try {
        const locations = await fetchLocation(filterState.currentPage, filterState.currentFilters);

        if (locations.length === 0 && filterState.currentPage > 1) {
            loadMoreButton.style.display = 'none';
            return;
        }

        renderLocation(locations);
        filterState.currentPage++;

        loadMoreButton.style.display = filterState.hasMorePages ? 'block' : 'none';
    } catch (error) {
        console.error("Ошибка при загрузке локаций:", error);
        loadMoreButton.style.display = 'none';
    }
}

loadLocation();

loadMoreButton.addEventListener('click', () => {
    loadLocation();
});