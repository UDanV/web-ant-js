var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "https://rickandmortyapi.com/api/episode";
const cardsContainer = document.querySelector('.cards__content');
export function fetchEpisodes(page_1) {
    return __awaiter(this, arguments, void 0, function* (page, filters = {}) {
        const url = new URL(API_URL);
        url.searchParams.set("page", page.toString());
        if (filters.name) {
            url.searchParams.set("name", filters.name);
        }
        const response = yield fetch(url.toString());
        if (!response.ok)
            throw new Error("Ошибка загрузки эпизодов");
        return yield response.json();
    });
}
export function renderEpisode(episodes) {
    episodes.forEach((episode) => {
        const card = document.createElement('div');
        card.className = 'card card__location';
        card.dataset.id = episode.id.toString();
        card.innerHTML = `
            <h2>${episode.name}</h2>
            <p>${episode.air_date}</p>
            <small>${episode.episode}</small>
        `;
        card.addEventListener('click', () => {
            window.location.href = `episode-details.html?id=${episode.id}`;
        });
        cardsContainer.appendChild(card);
    });
}
