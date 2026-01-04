
export const ORANGE_IMAGES = [
    '/images/harvest1.png',
    '/images/harvest2.png',
    '/images/harvest3.png',
    '/images/harvest4.png'
];

export function getBatchImage(batchId: string | number): string {
    const id = Number(batchId);
    if (isNaN(id)) return ORANGE_IMAGES[0];

    // Use modulo to cycle through images deterministically
    const index = id % ORANGE_IMAGES.length;
    return ORANGE_IMAGES[index];
}
