import { Episode } from "../types/episode";
import { Character } from "../types/character";

const urlParams = new URLSearchParams(window.location.search);
const episodeId = urlParams.get("id");

if (!episodeId) {
    throw new Error("Episode ID not found in URL");
}

const API_URL = `https://rickandmortyapi.com/api/episode/${episodeId}`;

const titleElement = document.querySelector(".details__title h1") as HTMLHeadingElement;
const episodeCodeElement = document.querySelector(".details__info:nth-child(1) p") as HTMLParagraphElement;
const episodeDateElement = document.querySelector(".details__info:nth-child(2) p") as HTMLParagraphElement;
const cardsContainer = document.querySelector(".cards__content") as HTMLElement;

async function fetchEpisode(): Promise<Episode> {
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

async function renderEpisode(episode: Episode): Promise<void> {
    titleElement.textContent = episode.name;
    episodeCodeElement.textContent = episode.episode;
    episodeDateElement.textContent = new Date(episode.air_date).toLocaleDateString();

    const characters = await Promise.all(episode.characters.map(fetchCharacter));
    cardsContainer.innerHTML = characters.map(renderCharacterCard).join("");

    cardsContainer.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            window.location.href = `character-details.html?id=${id}`;
        });
    });
}

fetchEpisode()
    .then(renderEpisode)
    .catch((error) => {
        console.error("Error:", error);
        cardsContainer.innerHTML = "<p>Failed to load episode data.</p>";
    });
