// Cooldown to api

export function debounce(func: Function, delay: number) {
    let timer: number;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => func(...args), delay);
    };
}