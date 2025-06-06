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
import { fetchCharacters, renderCharacters } from "./characters.js";
const nameInput = document.querySelector(".filter-input");
const selects = document.querySelectorAll(".filter-select");
const cardsContainer = document.querySelector(".cards__content");
const loadMoreButton = document.querySelector('.pagination');
let currentFilters = {
    name: "",
    species: "",
    gender: "",
    status: ""
};
let currentPage = 1;
let hasMorePages = true;
function getCharacterFilters() {
    return {
        name: nameInput.value.trim(),
        species: selects[0].value,
        gender: selects[1].value,
        status: selects[2].value,
    };
}
function loadCharacters() {
    return __awaiter(this, arguments, void 0, function* (reset = false) {
        if (reset) {
            currentPage = 1;
            cardsContainer.innerHTML = "";
        }
        currentFilters = getCharacterFilters();
        loadMoreButton.disabled = true;
        try {
            const data = yield fetchCharacters(currentPage, currentFilters);
            hasMorePages = data.info.next !== null;
            renderCharacters(data.results);
            currentPage++;
            loadMoreButton.style.display = hasMorePages ? "block" : "none";
        }
        catch (error) {
            console.error("Ошибка при загрузке персонажей:", error);
            if (reset) {
                cardsContainer.innerHTML = "<p class='no-results'>Ничего не найдено</p>";
                loadMoreButton.style.display = 'none';
            }
            loadMoreButton.style.display = "none";
        }
        finally {
            loadMoreButton.disabled = false;
        }
    });
}
[nameInput, ...Array.from(selects)].forEach((el) => {
    el.addEventListener("input", debounce(() => loadCharacters(true), 300));
});
loadMoreButton.addEventListener('click', () => {
    loadCharacters(false);
});
loadCharacters(true);
