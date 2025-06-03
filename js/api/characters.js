var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "https://rickandmortyapi.com/api/character";
let currentPage = 1;
let hasMorePages = true;
const cardsContainer = document.querySelector('.cards__content');
const loadMoreButton = document.querySelector('.pagination');
function fetchCharacters(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}?page=${page}`);
        const data = yield response.json();
        hasMorePages = data.info.next !== null;
        return data.results;
    });
}
function renderCharacters(characters) {
    characters.forEach((characters) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card__image">
                <img src="${characters.image}" alt="${characters.name}">
            </div>
            <div class="card__text">
              <h2>${characters.name}</h2>
              <p>${characters.species}</p>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}
function loadCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        const characters = yield fetchCharacters(currentPage);
        renderCharacters(characters);
        currentPage++;
        if (!hasMorePages) {
            loadMoreButton.style.display = 'none';
        }
    });
}
loadCharacters();
loadMoreButton.addEventListener('click', () => {
    loadCharacters();
});
export {};
