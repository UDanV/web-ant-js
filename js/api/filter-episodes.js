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
import { renderEpisode } from "./episodes.js";
const episodeInput = document.querySelector(".filter-input");
const episodeContainer = document.querySelector(".cards__content");
const loadMoreButton = document.querySelector('.pagination');
let currentFilters = {
    name: ""
};
let currentPage = 1;
let hasMorePages = true;
function fetchEpisodes(page, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL("https://rickandmortyapi.com/api/episode/");
        url.searchParams.set("page", page.toString());
        if (filters.name) {
            url.searchParams.set("name", filters.name);
        }
        console.log(`Fetching episodes: page=${page}, name=${filters.name || "none"}`); // debug
        const res = yield fetch(url.toString());
        if (!res.ok)
            throw new Error("Не удалось загрузить эпизоды");
        const data = yield res.json();
        hasMorePages = data.info.next !== null;
        return data.results;
    });
}
function loadEpisodes() {
    return __awaiter(this, arguments, void 0, function* (reset = false) {
        if (reset) {
            currentPage = 1;
            episodeContainer.innerHTML = "";
        }
        try {
            const episodes = yield fetchEpisodes(currentPage, currentFilters);
            renderEpisode(episodes);
            currentPage++;
            loadMoreButton.style.display = hasMorePages ? "block" : "none";
        }
        catch (error) {
            console.error("Ошибка при загрузке эпизодов:", error);
            if (reset) {
                episodeContainer.innerHTML = "<p class='no-results'>Ничего не найдено</p>";
            }
            loadMoreButton.style.display = "none";
        }
    });
}
episodeInput.addEventListener("input", debounce(() => {
    currentFilters.name = episodeInput.value.trim();
    loadEpisodes(true);
}, 300));
loadMoreButton.addEventListener("click", () => {
    loadEpisodes(false);
});
loadEpisodes(true);
