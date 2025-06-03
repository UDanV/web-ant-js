import {Episode} from "../types/episode";

const API_URL = "https://rickandmortyapi.com/api/episode";
let currentPage = 1;
let hasMorePages = true;

const cardsContainer = document.querySelector('.cards__content') as HTMLElement;
const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

async function fetchEpisode(page: number): Promise<Episode[]> {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    hasMorePages = data.info.next !== null;
    return data.results;
}

function renderEpisode(characters: Episode[]): void {
    characters.forEach((episode) => {
        const card = document.createElement('div');
        card.className = 'card card__location'

        card.innerHTML = `
            <h2>${episode.name}</h2>
            <p>${episode.air_date}</p>
            <small>${episode.episode}</small>
        `;

        cardsContainer.appendChild(card)
    })
}

async function loadEpisode(): Promise<void> {
    const characters = await fetchEpisode(currentPage);
    renderEpisode(characters);
    currentPage++;

    if (!hasMorePages) {
        loadMoreButton.style.display = 'none';
    }
}

loadEpisode();

loadMoreButton.addEventListener('click', () => {
    loadEpisode();
})