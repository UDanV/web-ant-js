import {Character} from "../types/character";

const urlParams = new URLSearchParams(window.location.search);
const characterId = urlParams.get('id');

if (!characterId) {
    throw new Error('Character ID not found in URL');
}

const API_URL = `https://rickandmortyapi.com/api/character/${characterId}`;

const avatarContainer = document.querySelector('.avatar__image') as HTMLElement;
const infoContainer = document.querySelector('.info__details:first-child') as HTMLElement;
const episodesContainer = document.querySelector('.info__details:last-child') as HTMLElement;

async function fetchCharacter(): Promise<Character> {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

function renderCharacter(character: Character): void {
    avatarContainer.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h1>${character.name}</h1>
    `

    infoContainer.innerHTML = `
        <h2>Informations</h2>
        <div class="info__card">
            <h3>Gender</h3>
            <p>${character.gender}</p>
        </div>
        <div class="info__card">
            <h3>Status</h3>
            <p>${character.status}</p>
        </div>
        <div class="info__card">
            <h3>Species</h3>
            <p>${character.species}</p>
        </div>
        <div class="info__card">
            <h3>Origin</h3>
            <p>${character.origin.name}</p>
        </div>
        <div class="info__card">
            <h3>Type</h3>
            <p>${character.type || 'Unknown'}</p>
        </div>
        <div class="info__card">
            <h3>Location</h3>
            <p>${character.location.name}</p>
        </div>
    `;

    renderEpisodes(character.episode.slice(0, 5));
}

async function renderEpisodes(episodeUrls: string[]): Promise<void> {
    if (episodeUrls.length === 0) {
        episodesContainer.innerHTML = '<h2>Episodes</h2><p>No episodes found</p>';
        return;
    }

    episodesContainer.innerHTML = '<h2>Episodes</h2>';

    const episodes = await Promise.all(
        episodeUrls.map(async (url) => {
            const response = await fetch(url);
            return await response.json();
        })
    );

    episodes.forEach((episode) => {
        const episodeDate = new Date(episode.air_date).toLocaleDateString();
        episodesContainer.innerHTML += `
            <div class="info__card">
                <h3>${episode.episode}</h3>
                <p>${episode.name}</p>
                <small>${episodeDate}</small>
            </div>
        `;
    });
}

fetchCharacter()
    .then(renderCharacter)
    .catch((error) => {
        console.error('Error:', error);
        infoContainer.innerHTML = '<p>Failed to load data. Please try again later.</p>';
    });