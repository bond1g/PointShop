// src/components/BrandList.js
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ListGroup, Button } from 'react-bootstrap';
import { Context } from '../../index';
import { deleteBrand } from '../../http/clothAPI';

const BrandList = observer(() => {
    const { cloth } = useContext(Context);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Удалить бренд "${name}"? Все связанные товары также будут удалены (если в БД настроено каскадное удаление).`)) {
            try {
                await deleteBrand(id);
                cloth.setBrands(cloth.brands.filter(b => b.id !== id));
                alert('Бренд удалён');
            } catch (e) {
                alert(e.response?.data?.message || 'Ошибка удаления');
            }
        }
    };

    if (!cloth.brands.length) return <p>Нет брендов</p>;

    return (
        <div className="mt-3">
        <h6>Бренды:</h6>
        <ListGroup as="ul" className="small">
            {cloth.brands.map(brand => (
                <ListGroup.Item as="li" key={brand.id} className="d-flex justify-content-between align-items-center py-1">
                    {brand.name}
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(brand.id, brand.name)}>Удалить</Button>
                </ListGroup.Item>
            ))}
        </ListGroup>
    </div>
    );
});

export default BrandList;