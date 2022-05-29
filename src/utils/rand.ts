export function choice<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function shuffle<T>(array: readonly T[]): T[] {
    const arrayCopy = array.slice();
    let currentIndex = arrayCopy.length;
    let randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
            arrayCopy[randomIndex], arrayCopy[currentIndex]];
    }
    return arrayCopy;
}
