var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "https://rickandmortyapi.com/api/location";
let currentPage = 1;
let hasMorePages = true;
const cardsContainer = document.querySelector('.cards__content');
const loadMoreButton = document.querySelector('.pagination');
function fetchLocation(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}?page=${page}`);
        const data = yield response.json();
        hasMorePages = data.info.next !== null;
        return data.results;
    });
}
function renderLocation(characters) {
    characters.forEach((location) => {
        const card = document.createElement('div');
        card.className = 'card card__location';
        card.innerHTML = `
            <h2>${location.name}</h2>
            <p>${location.type}</p>
        `;
        cardsContainer.appendChild(card);
    });
}
function loadLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        const characters = yield fetchLocation(currentPage);
        renderLocation(characters);
        currentPage++;
        if (!hasMorePages) {
            loadMoreButton.style.display = 'none';
        }
    });
}
loadLocation();
loadMoreButton.addEventListener('click', () => {
    loadLocation();
});
export {};
