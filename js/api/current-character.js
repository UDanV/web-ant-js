var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const urlParams = new URLSearchParams(window.location.search);
const characterId = urlParams.get('id');
if (!characterId) {
    throw new Error('Character ID not found in URL');
}
const API_URL = `https://rickandmortyapi.com/api/character/${characterId}`;
const avatarContainer = document.querySelector('.avatar__image');
const infoContainer = document.querySelector('.info__details:first-child');
const episodesContainer = document.querySelector('.info__details:last-child');
function fetchCharacter() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return yield response.json();
    });
}
function renderCharacter(character) {
    avatarContainer.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h1>${character.name}</h1>
    `;
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
function renderEpisodes(episodeUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        if (episodeUrls.length === 0) {
            episodesContainer.innerHTML = '<h2>Episodes</h2><p>No episodes found</p>';
            return;
        }
        episodesContainer.innerHTML = '<h2>Episodes</h2>';
        const episodes = yield Promise.all(episodeUrls.map((url) => __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            return yield response.json();
        })));
        episodes.forEach((episode) => {
            const episodeDate = new Date(episode.air_date).toLocaleDateString();
            const episodeId = episode.url.split('/').pop();
            episodesContainer.innerHTML += `
            <div class="info__card">
                <a href="./episode-details.html?id=${episodeId}" class="episode-link">
                    <h3>${episode.episode}</h3>
                    <p>${episode.name}</p>
                </a>
                <small>${episodeDate}</small>
            </div>
        `;
        });
    });
}
fetchCharacter()
    .then(renderCharacter)
    .catch((error) => {
    console.error('Error:', error);
    infoContainer.innerHTML = '<p>Failed to load data. Please try again later.</p>';
});
export {};
