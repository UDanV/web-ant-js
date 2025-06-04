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
const locationId = urlParams.get("id");
if (!locationId) {
    throw new Error("Location ID not found in URL");
}
const API_URL = `https://rickandmortyapi.com/api/location/${locationId}`;
const titleElement = document.querySelector(".details__title h1");
const typeElement = document.querySelector(".details__info:nth-child(1) p");
const dimensionElement = document.querySelector(".details__info:nth-child(2) p");
const cardsContainer = document.querySelector(".cards__content");
function fetchLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return yield response.json();
    });
}
function fetchCharacter(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        return yield response.json();
    });
}
function renderCharacterCard(character) {
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
function renderLocation(location) {
    return __awaiter(this, void 0, void 0, function* () {
        titleElement.textContent = location.name;
        typeElement.textContent = location.type || "Unknown";
        dimensionElement.textContent = location.dimension || "Unknown";
        const characters = yield Promise.all(location.residents.map(fetchCharacter));
        cardsContainer.innerHTML = characters.map(renderCharacterCard).join("");
        cardsContainer.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-id");
                window.location.href = `character-details.html?id=${id}`;
            });
        });
    });
}
fetchLocation()
    .then(renderLocation)
    .catch((error) => {
    console.error("Error:", error);
    cardsContainer.innerHTML = "<p>Failed to load location data.</p>";
});
export {};
