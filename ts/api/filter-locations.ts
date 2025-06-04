import { debounce } from "../debounce.js";
import { renderLocation } from "./locations.js";
import { Location } from "../types/location";

const locationNameInput = document.querySelector(".filter-input") as HTMLInputElement;
const locationSelects = document.querySelectorAll(".filter-select") as NodeListOf<HTMLSelectElement>;
const locationsContainer = document.querySelector(".cards__content") as HTMLElement;
const loadMoreButton = document.querySelector(".pagination") as HTMLButtonElement;

export interface LocationFilters {
    name: string;
    type: string;
    dimension: string;
}

// Общий объект состояния фильтров и пагинации
export const filterState = {
    currentFilters: {
        name: "",
        type: "",
        dimension: ""
    } as LocationFilters,
    currentPage: 1,
    hasMorePages: true
};

function getLocationFilters(): LocationFilters {
    return {
        name: locationNameInput.value.trim(),
        type: locationSelects[0].value,
        dimension: locationSelects[1].value
    };
}

async function fetchLocation(page: number, filters: LocationFilters): Promise<Location[]> {
    const url = new URL("https://rickandmortyapi.com/api/location/");
    url.searchParams.set("page", page.toString());

    Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
    });

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error("Не удалось загрузить данные");
    }

    const data = await res.json();

    if (data.error) {
        filterState.hasMorePages = false;
        return [];
    }

    filterState.hasMorePages = data.info?.next !== null;
    return data.results as Location[];
}

export async function fetchFilteredLocations(): Promise<void> {
    filterState.currentFilters = getLocationFilters();
    filterState.currentPage = 1;

    try {
        const results = await fetchLocation(filterState.currentPage, filterState.currentFilters);
        locationsContainer.innerHTML = "";
        renderLocation(results);
        loadMoreButton.style.display = filterState.hasMorePages ? "block" : "none";
        filterState.currentPage++;
    } catch (error) {
        console.error("Ошибка при фильтрации локаций:", error);
        locationsContainer.innerHTML = "<p class='no-results'>Ничего не найдено</p>";
        loadMoreButton.style.display = 'none';
    }
}

[locationNameInput, ...Array.from(locationSelects)].forEach(el =>
    el.addEventListener("input", debounce(fetchFilteredLocations, 300))
);
