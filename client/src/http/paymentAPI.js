import { $authHost } from './index';

export const createPayment = async (orderId, totalAmount, description) => {
    const { data } = await $authHost.post('/api/payment/create', { orderId, totalAmount, description });
    return data;
};