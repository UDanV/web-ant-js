import { Character } from "../types/character";

const API_URL = "https://rickandmortyapi.com/api/character";
const cardsContainer = document.querySelector('.cards__content') as HTMLElement;

export async function fetchCharacters(page: number, filters: Record<string, string> = {}): Promise<{ results: Character[], info: any }> {
    const url = new URL(API_URL);
    url.searchParams.set("page", page.toString());

    Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Ошибка загрузки персонажей");

    const data = await response.json();
    return data;
}

export function renderCharacters(characters: Character[]): void {
    if (!Array.isArray(characters)) return;

    characters.forEach((character) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = character.id.toString();

        card.innerHTML = `
            <div class="card__image">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="card__text">
              <h2>${character.name}</h2>
              <p>${character.species}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `character-details.html?id=${character.id}`;
        });

        cardsContainer.appendChild(card);
    });
}