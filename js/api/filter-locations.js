var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { debounce } from "../debounce.js";
import { renderLocation } from "./locations.js";
const locationNameInput = document.querySelector(".filter-input");
const locationSelects = document.querySelectorAll(".filter-select");
const locationsContainer = document.querySelector(".cards__content");
const loadMoreButton = document.querySelector(".pagination");
// Общий объект состояния фильтров и пагинации
export const filterState = {
    currentFilters: {
        name: "",
        type: "",
        dimension: ""
    },
    currentPage: 1,
    hasMorePages: true
};
function getLocationFilters() {
    return {
        name: locationNameInput.value.trim(),
        type: locationSelects[0].value,
        dimension: locationSelects[1].value
    };
}
function fetchLocation(page, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const url = new URL("https://rickandmortyapi.com/api/location/");
        url.searchParams.set("page", page.toString());
        Object.entries(filters).forEach(([key, value]) => {
            if (value)
                url.searchParams.append(key, value);
        });
        const res = yield fetch(url.toString());
        if (!res.ok) {
            throw new Error("Не удалось загрузить данные");
        }
        const data = yield res.json();
        if (data.error) {
            filterState.hasMorePages = false;
            return [];
        }
        filterState.hasMorePages = ((_a = data.info) === null || _a === void 0 ? void 0 : _a.next) !== null;
        return data.results;
    });
}
export function fetchFilteredLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        filterState.currentFilters = getLocationFilters();
        filterState.currentPage = 1;
        try {
            const results = yield fetchLocation(filterState.currentPage, filterState.currentFilters);
            locationsContainer.innerHTML = "";
            renderLocation(results);
            loadMoreButton.style.display = filterState.hasMorePages ? "block" : "none";
            filterState.currentPage++;
        }
        catch (error) {
            console.error("Ошибка при фильтрации локаций:", error);
            locationsContainer.innerHTML = "<p class='no-results'>Ничего не найдено</p>";
            loadMoreButton.style.display = 'none';
        }
    });
}
[locationNameInput, ...Array.from(locationSelects)].forEach(el => el.addEventListener("input", debounce(fetchFilteredLocations, 300)));
