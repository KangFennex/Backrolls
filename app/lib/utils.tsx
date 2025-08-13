export const selectBackgroundColor = (index: number): string => {
    const backgroundColor = ["#D1EED3", "#F1E4AC", "#D8C3E0", "#F6D7C5", "#F7A8B2", "#BCE5E2"];

    return backgroundColor[index % backgroundColor.length];
}