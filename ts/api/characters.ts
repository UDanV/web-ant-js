import {Character} from "../types/character";

const API_URL = "https://rickandmortyapi.com/api/character";
let currentPage = 1;
let hasMorePages = true;

const cardsContainer = document.querySelector('.cards__content') as HTMLElement;
const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

async function fetchCharacters(page: number): Promise<Character[]> {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    hasMorePages = data.info.next !== null;
    return data.results;
}

function renderCharacters(characters: Character[]): void {
    characters.forEach((characters) => {
        const card = document.createElement('div');
        card.className = 'card'

        card.innerHTML = `
            <div class="card__image">
                <img src="${characters.image}" alt="${characters.name}">
            </div>
            <div class="card__text">
              <h2>${characters.name}</h2>
              <p>${characters.species}</p>
            </div>
        `;

        cardsContainer.appendChild(card)
    })
}

async function loadCharacters(): Promise<void> {
    const characters = await fetchCharacters(currentPage);
    renderCharacters(characters);
    currentPage++;

    if (!hasMorePages) {
        loadMoreButton.style.display = 'none';
    }
}

loadCharacters();

loadMoreButton.addEventListener('click', () => {
    loadCharacters();
})

