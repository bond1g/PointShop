import { $authHost } from './index';

export const createOrder = async (orderData) => {
    const { data } = await $authHost.post('/api/order', orderData);
    return data;
};

export const fetchAllOrders = async () => {
    const { data } = await $authHost.get('/api/order/admin');
    return data;
};

export const updateOrderStatus = async (id, status) => {
    const { data } = await $authHost.patch(`/api/order/${id}/status`, { status });
    return data;
};

