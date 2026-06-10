import { $host, $authHost } from "./index";


export const createType = async (type) => {
    const { data } = await $authHost.post('/api/type', type);
    return data
};

export const fetchTypes = async () => {
    const { data } = await $host.get('/api/type');
    return data
};

export const createBrand = async (brand) => {
    const { data } = await $authHost.post('/api/brand', brand);
    return data
};

export const fetchBrands = async () => {
    const { data } = await $host.get('/api/brand');
    return data
};

export const createCloth = async (cloth) => {
    const { data } = await $authHost.post('/api/cloth', cloth);
    return data
};

export const fetchClothes = async (typeId, brandId, page, limit = 7, minPrice, maxPrice, sort) => {
    const { data } = await $host.get('/api/cloth', {params: {
        typeId, brandId, page, limit,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: sort || undefined
    }});
    return data
};

export const fetchOneCloth = async (id) => {
    const { data } = await $host.get('/api/cloth/' + id);
    return data
};

export const deleteBrand = async (id) => {
    const { data } = await $authHost.delete(`/api/brand/${id}`);
    return data;
};

export const deleteType = async (id) => {
    const { data } = await $authHost.delete(`/api/type/${id}`);
    return data;
};

export const deleteCloth = async (id) => {
    const { data } = await $authHost.delete(`/api/cloth/${id}`);
    return data;
};

export const fetchAllClothes = async () => {
    const { data } = await $host.get('/api/cloth', { params: { limit: 1000 } });
    return data.rows;
};

export const updateClothSizes = async (clothId, sizes) => {
    const { data } = await $authHost.put(`/api/cloth/${clothId}/sizes`, { sizes });
    return data;
};

export const updateCloth = async (id, formData) => {
    const { data } = await $authHost.patch(`/api/cloth/${id}`, formData);
    return data;
};