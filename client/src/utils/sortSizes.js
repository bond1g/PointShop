const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

export const sortSizes = (sizes) => {
    return [...sizes].sort((a, b) => {
        const ai = SIZE_ORDER.indexOf(a.size.toUpperCase());
        const bi = SIZE_ORDER.indexOf(b.size.toUpperCase());
        // Известные размеры — по таблице, неизвестные (числа и т.д.) — в конец по значению
        if (ai === -1 && bi === -1) return String(a.size).localeCompare(String(b.size), undefined, { numeric: true });
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
};
