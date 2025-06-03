import {Location} from "../types/location";

const API_URL = "https://rickandmortyapi.com/api/location";
let currentPage = 1;
let hasMorePages = true;

const cardsContainer = document.querySelector('.cards__content') as HTMLElement;
const loadMoreButton = document.querySelector('.pagination') as HTMLButtonElement;

async function fetchLocation(page: number): Promise<Location[]> {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    hasMorePages = data.info.next !== null;
    return data.results;
}

function renderLocation(characters: Location[]): void {
    characters.forEach((location) => {
        const card = document.createElement('div');
        card.className = 'card card__location'

        card.innerHTML = `
            <h2>${location.name}</h2>
            <p>${location.type}</p>
        `;

        cardsContainer.appendChild(card)
    })
}

async function loadLocation(): Promise<void> {
    const characters = await fetchLocation(currentPage);
    renderLocation(characters);
    currentPage++;

    if (!hasMorePages) {
        loadMoreButton.style.display = 'none';
    }
}

loadLocation();

loadMoreButton.addEventListener('click', () => {
    loadLocation();
})