import { debounce } from "../debounce.js";
import { fetchCharacters, renderCharacters } from "./characters.js";

const nameInput = document.querySelector(".filter-input") as HTMLInputElement;
const selects = document.querySelectorAll(".filter-select") as NodeListOf<HTMLSelectElement>;
const cardsContainer = document.querySelector(".cards__content") as HTMLElement;
const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

interface CharacterFilters {
    [key: string]: string;
    name: string;
    species: string;
    gender: string;
    status: string;
}

let currentFilters: CharacterFilters = {
    name: "",
    species: "",
    gender: "",
    status: ""
};

let currentPage = 1;
let hasMorePages = true;

function getCharacterFilters(): CharacterFilters {
    return {
        name: nameInput.value.trim(),
        species: selects[0].value,
        gender: selects[1].value,
        status: selects[2].value,
    };
}

async function loadCharacters(reset: boolean = false): Promise<void> {
    if (reset) {
        currentPage = 1;
        cardsContainer.innerHTML = "";
    }

    currentFilters = getCharacterFilters();
    loadMoreButton.disabled = true;

    try {
        const data = await fetchCharacters(currentPage, currentFilters);
        hasMorePages = data.info.next !== null;
        renderCharacters(data.results);
        currentPage++;
        loadMoreButton.style.display = hasMorePages ? "block" : "none";
    } catch (error) {
        console.error("Ошибка при загрузке персонажей:", error);
        if (reset) {
            cardsContainer.innerHTML = "<p class='no-results'>Ничего не найдено</p>";
            loadMoreButton.style.display = 'none';
        }
        loadMoreButton.style.display = "none";
    } finally {
        loadMoreButton.disabled = false;
    }
}

[ nameInput, ...Array.from(selects) ].forEach((el) => {
    el.addEventListener("input", debounce(() => loadCharacters(true), 300));
});

loadMoreButton.addEventListener('click', () => {
    loadCharacters(false);
});

loadCharacters(true);