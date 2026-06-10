import { $authHost } from './index';

export const fetchBasket = async () => {
    const { data } = await $authHost.get('/api/basket');
    return data;
};

export const addToBasket = async (clothId, size, quantity = 1) => {
    const { data } = await $authHost.post('/api/basket/items', { clothId, size, quantity });
    return data;
};

export const updateBasketItem = async (itemId, quantity) => {
    const { data } = await $authHost.put(`/api/basket/items/${itemId}`, { quantity });
    return data;
};

export const deleteBasketItem = async (itemId) => {
    const { data } = await $authHost.delete(`/api/basket/items/${itemId}`);
    return data;
};

export const clearBasket = async () => {
    const { data } = await $authHost.delete('/api/basket/clear');
    return data;
};

export const applyPromo = async (code, totalAmount) => {
    const { data } = await $authHost.post('/api/promo/apply', { code, totalAmount });
    return data;
};