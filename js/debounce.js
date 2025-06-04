// Cooldown to api
export function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => func(...args), delay);
    };
}
