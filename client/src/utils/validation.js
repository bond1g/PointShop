// src/utils/validation.js
export const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    // Допустимая длина: 10 (без кода страны) или 11 (с кодом 7 или 8)
    return digits.length === 11 || digits.length === 12;
};

export const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
        return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 12)}`;
    } else if (digits.length === 12) {
        return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 11)}`;
    }
    return phone;
};