import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { updateClothSizes } from '../../http/clothAPI';

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const EditClothSizes = ({ show, onHide, cloth, onUpdated }) => {
    const [sizes, setSizes] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (cloth?.cloth_sizes) {
            setSizes(cloth.cloth_sizes.map(s => ({
                size: s.size,
                stock: s.stock,
                number: s.id
            })))
        } else {
            setSizes([])
        }
    }, [cloth])

    const addPreset = (sizeLabel) => {
        if (sizes.find(s => s.size === sizeLabel)) return
        setSizes([...sizes, { size: sizeLabel, stock: 0, number: Date.now() }])
    }
    const togglePreset = (sizeLabel) => {
        const existing = sizes.find(s => s.size === sizeLabel)
        if (existing) {
            setSizes(sizes.filter(s => s.size !== sizeLabel))
        } else {
            setSizes([...sizes, { size: sizeLabel, stock: 0, number: Date.now() }])
        }
    }
    const removeSize = (number) => {
        setSizes(sizes.filter(s => s.number !== number))
    }
    const changeStock = (number, value) => {
        setSizes(sizes.map(s => s.number === number ? { ...s, stock: Math.max(0, Number(value)) } : s))
    }
    const addCustomSize = () => {
        setSizes([...sizes, { size: '', stock: 0, number: Date.now() }])
    }
    const changeSizeLabel = (number, value) => {
        setSizes(sizes.map(s => s.number === number ? { ...s, size: value } : s))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const valid = sizes.filter(s => s.size.trim())
            await updateClothSizes(cloth.id, valid)
            onUpdated && onUpdated()
            onHide()
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка сохранения')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Размеры: {cloth?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='mb-2 fw-semibold'>Быстрый выбор</div>
                <div className='d-flex flex-wrap gap-2 mb-3'>
                    {PRESET_SIZES.map(sz => (
                        <Button
                            key={sz}
                            size='sm'
                            variant={sizes.find(s => s.size === sz) ? 'dark' : 'outline-dark'}
                            onClick={() => togglePreset(sz)}
                        >
                            {sz}
                        </Button>
                    ))}
                    <Button size='sm' variant='outline-secondary' onClick={addCustomSize}>+ свой размер</Button>
                </div>

                {sizes.length === 0 && (
                    <p className='text-muted'>Нет размеров. Добавьте хотя бы один.</p>
                )}

                {sizes.map(s => (
                    <Row className='mt-2 align-items-center' key={s.number}>
                        <Col md={3}>
                            <Form.Control
                                value={s.size}
                                onChange={e => changeSizeLabel(s.number, e.target.value)}
                                placeholder='Размер'
                            />
                        </Col>
                        <Col xs={5} md={4}>
                            <Form.Control
                                type='number'
                                min={0}
                                value={s.stock}
                                onChange={e => changeStock(s.number, e.target.value)}
                                placeholder='Остаток (шт.)'
                            />
                        </Col>
                        <Col>
                            <Button size='sm' variant='outline-danger' onClick={() => removeSize(s.number)}>
                                Удалить
                            </Button>
                        </Col>
                    </Row>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-danger' onClick={onHide}>Отмена</Button>
                <Button variant='outline-success' onClick={handleSave} disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditClothSizes
