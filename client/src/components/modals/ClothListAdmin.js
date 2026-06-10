import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Button, Image, Badge } from 'react-bootstrap';
import { Context } from '../../index';
import { deleteCloth } from '../../http/clothAPI';
import EditClothSizes from './EditClothSizes';
import EditCloth from './EditCloth';

const ClothListAdmin = observer(() => {
    const { cloth } = useContext(Context);
    const [editTarget, setEditTarget]       = useState(null)
    const [editClothTarget, setEditClothTarget] = useState(null)

    const handleDelete = async (id, name) => {
        if (window.confirm(`Удалить товар "${name}"?`)) {
            try {
                await deleteCloth(id);
                const { fetchAllClothes } = await import('../../http/clothAPI');
                const updated = await fetchAllClothes();
                cloth.setCloths(updated);
                alert('Товар удалён');
            } catch (e) {
                alert(e.response?.data?.message || 'Ошибка удаления');
            }
        }
    };

    const handleSizesUpdated = async () => {
        const { fetchAllClothes } = await import('../../http/clothAPI');
        const updated = await fetchAllClothes();
        cloth.setCloths(updated);
    };

    if (!cloth.cloths.length) return <p>Нет товаров</p>;

    return (
        <>
            <div className="mt-4">
                <h6>Список товаров:</h6>
                <Table size="sm" striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Фото</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Размеры</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cloth.cloths.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td style={{ width: 50 }}>
                                    <Image
                                        src={process.env.REACT_APP_API_URL + '/' + c.img}
                                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{c.name}</td>
                                <td>{c.price} руб.</td>
                                <td>
                                    {c.cloth_sizes && c.cloth_sizes.length > 0
                                        ? c.cloth_sizes.map(s => (
                                            <Badge
                                                key={s.id}
                                                bg={s.stock > 0 ? 'dark' : 'secondary'}
                                                className='me-1'
                                                title={`${s.size}: ${s.stock} шт.`}
                                            >
                                                {s.size} ({s.stock})
                                            </Badge>
                                        ))
                                        : <span className='text-muted'>—</span>
                                    }
                                </td>
                                <td>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className='me-1'
                                        onClick={() => setEditClothTarget(c)}
                                    >
                                        Изменить
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className='me-1'
                                        onClick={() => setEditTarget(c)}
                                    >
                                        Размеры
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(c.id, c.name)}
                                    >
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <EditClothSizes
                show={!!editTarget}
                onHide={() => setEditTarget(null)}
                cloth={editTarget}
                onUpdated={handleSizesUpdated}
            />
            <EditCloth
                show={!!editClothTarget}
                onHide={() => setEditClothTarget(null)}
                cloth={editClothTarget}
                onUpdated={handleSizesUpdated}
            />
        </>
    );
});

export default ClothListAdmin;
