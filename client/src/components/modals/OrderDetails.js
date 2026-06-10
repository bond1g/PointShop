import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const OrderDetailsModal = ({ show, onHide, order }) => {
    if (!order) return null;

    const items = order.order_items || [];

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Заказ №{order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Состав заказа:</h6>
                {items.length === 0 ? (
                    <p>Товары не найдены</p>
                ) : (
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Товар</th>
                                <th>Размер</th>
                                <th>Количество</th>
                                <th>Цена</th>
                                <th>Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.cloth?.name || 'Товар удалён'}</td>
                                    <td>{item.size}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price} руб.</td>
                                    <td>{item.price * item.quantity} руб.</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsModal;