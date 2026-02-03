import { useEffect, useState } from "react";

export const usePlaceholderLogic = () => {
    const placeholders = [
        "It's getting gaggy",
        "And I hoop",
        "Party",
        "Let's get sickening"
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % placeholders.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    return placeholders[index];
}