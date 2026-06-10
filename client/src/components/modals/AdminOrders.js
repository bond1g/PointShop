import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { fetchAllOrders, updateOrderStatus } from '../../http/orderAPI';
import OrderDetails from '../../components/modals/OrderDetails';

const STATUSES = [
    { value: 'pending',         label: 'Ожидает обработки', bg: 'secondary' },
    { value: 'pending_payment', label: 'Ожидает оплаты',    bg: 'warning'   },
    { value: 'paid',            label: 'Оплачен',           bg: 'info'      },
    { value: 'shipped',         label: 'Отправлен',         bg: 'primary'   },
    { value: 'delivered',       label: 'Доставлен',         bg: 'success'   },
    { value: 'cancelled',       label: 'Отменён',           bg: 'danger'    },
];

const statusMeta = (value) =>
    STATUSES.find(s => s.value === value) || { label: value, bg: 'light' };

const AdminOrders = () => {
    const [orders, setOrders]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal]     = useState(false);
    const [updating, setUpdating]       = useState(null); // id заказа, который сейчас обновляется

    const loadOrders = () => {
        setLoading(true);
        fetchAllOrders()
            .then(data => { setOrders(data); setLoading(false); })
            .catch(err => { setError(err.response?.data?.message || 'Ошибка загрузки'); setLoading(false); });
    };

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdating(orderId);
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка обновления статуса');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
    if (error)   return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="mt-4">
            <h3 className="mb-3">Все заказы</h3>
            {orders.length === 0 ? (
                <p>Нет заказов.</p>
            ) : (
                <Table striped bordered hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Клиент</th>
                            <th>Телефон</th>
                            <th>Дата</th>
                            <th>Сумма</th>
                            <th>Доставка</th>
                            <th>Оплата</th>
                            <th style={{ minWidth: 190 }}>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            const meta = statusMeta(order.status);
                            return (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.customerFullName || `—`}</td>
                                    <td>{order.customerPhone || '—'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                                    <td>{order.total.toLocaleString()} руб.</td>
                                    <td>{order.deliveryType}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td style={{ minWidth: 210 }}>
                                        <Form.Select
                                            size="sm"
                                            value={order.status}
                                            disabled={updating === order.id}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            style={{ borderColor: `var(--bs-${meta.bg})`, fontWeight: 500 }}
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                                        >
                                            Детали
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            <OrderDetails
                show={showModal}
                onHide={() => { setShowModal(false); setSelectedOrder(null); }}
                order={selectedOrder}
            />
        </Container>
    );
};

export default AdminOrders;
