import {Episode} from "../types/episode";

const API_URL = "https://rickandmortyapi.com/api/episode";

const cardsContainer = document.querySelector('.cards__content') as HTMLElement;

export async function fetchEpisodes(page: number, filters: { name?: string } = {}): Promise<{ results: Episode[], info: any }> {
    const url = new URL(API_URL);
    url.searchParams.set("page", page.toString());
    if (filters.name) {
        url.searchParams.set("name", filters.name);
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Ошибка загрузки эпизодов");

    return await response.json();
}

export function renderEpisode(episodes: Episode[]): void {
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