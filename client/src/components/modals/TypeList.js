// src/components/TypeList.js
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ListGroup, Button } from 'react-bootstrap';
import { Context } from '../../index';
import { deleteType } from '../../http/clothAPI';

const TypeList = observer(() => {
    const { cloth } = useContext(Context);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Удалить тип "${name}"? Все связанные товары также будут удалены (если в БД настроено каскадное удаление).`)) {
            try {
                await deleteType(id);
                cloth.setTypes(cloth.types.filter(t => t.id !== id));
                alert('Тип удалён');
            } catch (e) {
                alert(e.response?.data?.message || 'Ошибка удаления');
            }
        }
    };

    if (!cloth.types.length) return <p>Нет типов</p>;

    return (
        <div className="mt-4">
            <h5>Список типов:</h5>
            <ListGroup>
                {cloth.types.map(type => (
                    <ListGroup.Item key={type.id} className="d-flex justify-content-between align-items-center">
                        {type.name}
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(type.id, type.name)}>
                            Удалить
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
});

export default TypeList;