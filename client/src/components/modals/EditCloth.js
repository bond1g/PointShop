import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateCloth } from '../../http/clothAPI';

const EditCloth = ({ show, onHide, cloth, onUpdated }) => {
    const [name, setName]   = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile]   = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    useEffect(() => {
        if (cloth) {
            setName(cloth.name || '');
            setPrice(cloth.price || '');
            setFile(null);
            setError('');
        }
    }, [cloth]);

    const handleSave = async () => {
        if (!name.trim()) return setError('Введите название');
        if (!price || Number(price) <= 0) return setError('Введите корректную цену');

        try {
            setSaving(true);
            setError('');
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('price', String(price));
            if (file) formData.append('img', file);

            await updateCloth(cloth.id, formData);
            onUpdated && onUpdated();
            onHide();
        } catch (e) {
            setError(e.response?.data?.message || 'Ошибка сохранения');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Название товара"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Цена, руб.</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="Цена"
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Фото <span className="text-muted">(оставьте пустым, чтобы не менять)</span></Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={e => setFile(e.target.files[0] || null)}
                        />
                    </Form.Group>
                    {error && <div className="text-danger mt-2" style={{ fontSize: '0.88rem' }}>{error}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Отмена</Button>
                <Button variant="outline-success" onClick={handleSave} disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCloth;
