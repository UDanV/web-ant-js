import { Location } from "../types/location";
import { Character } from "../types/character";

const urlParams = new URLSearchParams(window.location.search);
const locationId = urlParams.get("id");

if (!locationId) {
    throw new Error("Location ID not found in URL");
}

const API_URL = `https://rickandmortyapi.com/api/location/${locationId}`;

const titleElement = document.querySelector(".details__title h1") as HTMLHeadingElement;
const typeElement = document.querySelector(".details__info:nth-child(1) p") as HTMLParagraphElement;
const dimensionElement = document.querySelector(".details__info:nth-child(2) p") as HTMLParagraphElement;
const cardsContainer = document.querySelector(".cards__content") as HTMLElement;

async function fetchLocation(): Promise<Location> {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

async function fetchCharacter(url: string): Promise<Character> {
    const response = await fetch(url);
    return await response.json();
}

function renderCharacterCard(character: Character): string {
    return `
        <div class="card" data-id="${character.id}">
            <div class="card__image">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="card__text">
                <h2>${character.name}</h2>
                <p>${character.species}</p>
            </div>
        </div>
    `;
}

async function renderLocation(location: Location): Promise<void> {
    titleElement.textContent = location.name;
    typeElement.textContent = location.type || "Unknown";
    dimensionElement.textContent = location.dimension || "Unknown";

    const characters = await Promise.all(location.residents.map(fetchCharacter));
    cardsContainer.innerHTML = characters.map(renderCharacterCard).join("");

    cardsContainer.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            window.location.href = `character-details.html?id=${id}`;
        });
    });
}

fetchLocation()
    .then(renderLocation)
    .catch((error) => {
        console.error("Error:", error);
        cardsContainer.innerHTML = "<p>Failed to load location data.</p>";
    });