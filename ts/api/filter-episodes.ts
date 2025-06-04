import { debounce } from "../debounce.js";
import { renderEpisode } from "./episodes.js";
import {Episode} from "../types/episode";

const episodeInput = document.querySelector(".filter-input") as HTMLInputElement;
const episodeContainer = document.querySelector(".cards__content") as HTMLElement;
const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

interface EpisodeFilters {
    name: string;
}

let currentFilters: EpisodeFilters = {
    name: ""
};

let currentPage = 1;
let hasMorePages = true;

async function fetchEpisodes(page: number, filters: EpisodeFilters): Promise<Episode[]> {
    const url = new URL("https://rickandmortyapi.com/api/episode/");
    url.searchParams.set("page", page.toString());
    if (filters.name) {
        url.searchParams.set("name", filters.name);
    }
    console.log(`Fetching episodes: page=${page}, name=${filters.name || "none"}`); // debug

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Не удалось загрузить эпизоды");

    const data = await res.json();
    hasMorePages = data.info.next !== null;
    return data.results;
}

async function loadEpisodes(reset: boolean = false): Promise<void> {
    if (reset) {
        currentPage = 1;
        episodeContainer.innerHTML = "";
    }

    try {
        const episodes = await fetchEpisodes(currentPage, currentFilters);
        renderEpisode(episodes);
        currentPage++;

        loadMoreButton.style.display = hasMorePages ? "block" : "none";
    } catch (error) {
        console.error("Ошибка при загрузке эпизодов:", error);
        if (reset) {
            episodeContainer.innerHTML = "<p class='no-results'>Ничего не найдено</p>";
        }
        loadMoreButton.style.display = "none";
    }
}

episodeInput.addEventListener("input", debounce(() => {
    currentFilters.name = episodeInput.value.trim();
    loadEpisodes(true);
}, 300));

loadMoreButton.addEventListener("click", () => {
    loadEpisodes(false);
});

loadEpisodes(true);
