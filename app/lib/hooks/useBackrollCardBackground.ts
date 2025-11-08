export const getBackrollCardBackground = (index: number): string => {
    const pastelColors = [
        // Warm pastels
        '#FFE4E1',  // Misty Rose
        '#FFEFD5',  // Papaya Whip
        '#FFE4B5',  // Moccasin
        '#FFDAB9',  // Peach Puff
        '#FFB6C1',  // Light Pink
        '#FFC0CB',  // Pink

        // Cool pastels
        '#E0FFFF',  // Light Cyan
        '#F0F8FF',  // Alice Blue
        '#E6E6FA',  // Lavender
        '#DDA0DD',  // Plum
        '#D8BFD8',  // Thistle
        '#B0E0E6',  // Powder Blue

        // Green pastels
        '#F0FFF0',  // Honeydew
        '#F5FFFA',  // Mint Cream
        '#E0FFE0',  // Light Green
        '#AFEEEE',  // Pale Turquoise
        '#98FB98',  // Pale Green
        '#C7FFDB',  // Light Mint

        // Yellow/Orange pastels
        '#FFFACD',  // Lemon Chiffon
        '#FFF8DC',  // Cornsilk
        '#FFFFE0',  // Light Yellow
        '#F0E68C',  // Khaki
        '#FFEAA7',  // Warm Yellow
        '#FDCB6E',  // Soft Orange

        // Purple/Pink pastels
        '#F8F8FF',  // Ghost White
        '#FAF0E6',  // Linen
        '#FDF2E9',  // Seashell
        '#E8D5C4',  // Warm Beige
        '#F7DC6F',  // Soft Gold
        '#BB8FCE'   // Light Purple
    ];

    // Use the index to get a consistent color, or random if no index provided
    if (index === undefined || index === null) {
        const randomIndex = Math.floor(Math.random() * pastelColors.length);
        return pastelColors[randomIndex];
    }

    // Use modulo to ensure we don't go out of bounds and get consistent colors per index
    return pastelColors[index % pastelColors.length];
};