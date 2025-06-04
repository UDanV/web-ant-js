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
const cardsContainer = document.querySelector('.cards__content');
export function fetchCharacters(page_1) {
    return __awaiter(this, arguments, void 0, function* (page, filters = {}) {
        const url = new URL(API_URL);
        url.searchParams.set("page", page.toString());
        Object.entries(filters).forEach(([key, value]) => {
            if (value)
                url.searchParams.set(key, value);
        });
        const response = yield fetch(url.toString());
        if (!response.ok)
            throw new Error("Ошибка загрузки персонажей");
        const data = yield response.json();
        return data;
    });
}
export function renderCharacters(characters) {
    if (!Array.isArray(characters))
        return;
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
