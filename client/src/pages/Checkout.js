import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { createOrder } from '../http/orderAPI';
import { useHistory } from 'react-router-dom';
import { FaBoxOpen, FaUser, FaCreditCard } from 'react-icons/fa';
import './Checkout.css';
import { validatePhoneNumber } from '../utils/validation';
import { createPayment } from '../http/paymentAPI';


const Checkout = observer(() => {
    const { basket } = useContext(Context);
    const history = useHistory();
    const [delivery, setDelivery] = useState('pickup');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });
    const [payment, setPayment] = useState('cash');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (basket.items.length === 0 && !showSuccessModal) {
            history.push('/');
        }
    }, [basket.items, history, showSuccessModal]);

    const deliveryPrices = { pickup: 0, cdek: 500, post: 300 };
    const deliveryNames = {
        pickup: 'Самовывоз (Тюмень, ул. Грибоедова 3, 7 этаж)',
        cdek: 'Курьерская доставка СДЭК до ПВЗ',
        post: 'Почта России'
    };
    const totalWithDelivery = basket.totalPrice + deliveryPrices[delivery];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return 'Введите ФИО';
        if (!formData.phone.trim()) return 'Введите номер телефона';
        if (!validatePhoneNumber(formData.phone)) {
        return 'Введите корректный номер телефона (например, +7 123 456-78-90 или 89001234567)';
        }   
        if (!formData.email.trim()) return 'Введите Email';
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Некорректный Email';
        if (payment === 'cash' && delivery !== 'pickup') {
            return 'Оплата наличными доступна только при самовывозе';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateForm();
        if (err) {
            setError(err);
            return;
        }
        if (payment === 'cash' && delivery !== 'pickup') {
            setError('Оплата наличными доступна только при самовывозе');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const orderData = {
                deliveryType: delivery,
                deliveryPrice: deliveryPrices[delivery],
                paymentMethod: payment,
                customer: formData,
                items: basket.items,
                total: totalWithDelivery
            };
            const orderResponse = await createOrder(orderData);
            
            if (payment === 'cash') {
                setOrderId(orderResponse.id);
                setShowSuccessModal(true);
                basket.clear();
            } else if (payment === 'card') {
                const { redirectUrl } = await createPayment(
                    orderResponse.id,
                    totalWithDelivery,
                    `Оплата заказа №${orderResponse.id}`
                );
                window.location.href = redirectUrl;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка оформления заказа');
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        history.push('/');
    };

    if (basket.items.length === 0 && !showSuccessModal) return null;

    return (
        <>
            <Container className="checkout-container mt-5 mb-5">
                <h2 className="checkout-title">Оформление заказа</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Card className="checkout-card">
                        <Card.Header className="checkout-card-header">
                            <FaBoxOpen className="me-2" /> 1. Выберите тип доставки
                        </Card.Header>
                        <Card.Body>
                            {Object.keys(deliveryPrices).map((key) => (
                                <div key={key} className="delivery-option">
                                    <Form.Check
                                        type="radio"
                                        id={`delivery-${key}`}
                                        label={
                                            <span>
                                                {deliveryNames[key]} — <strong>{deliveryPrices[key]} руб.</strong>
                                            </span>
                                        }
                                        name="delivery"
                                        value={key}
                                        checked={delivery === key}
                                        onChange={(e) => setDelivery(e.target.value)}
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>

                    <Card className="checkout-card">
                        <Card.Header className="checkout-card-header">
                            <FaUser className="me-2" /> 2. Введите ваши данные
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>ФИО</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    placeholder="Иванов Иван Иванович"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Номер телефона</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    placeholder="+7 (999) 123-45-67"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <Card className="checkout-card">
                        <Card.Header className="checkout-card-header">
                            <FaCreditCard className="me-2" /> 3. Способ оплаты
                        </Card.Header>
                        <Card.Body>
                            <Form.Check
                                type="radio"
                                label="Наличными при получении"
                                name="payment"
                                value="cash"
                                checked={payment === 'cash'}
                                onChange={(e) => setPayment(e.target.value)}
                            />
                            <Form.Check
                                type="radio"
                                label="Картой онлайн"
                                name="payment"
                                value="card"
                                checked={payment === 'card'}
                                onChange={(e) => setPayment(e.target.value)}
                                className="mt-2"
                            />
                        </Card.Body>
                    </Card>

                    <Card className="checkout-card total-card">
                        <Card.Body className="text-end">
                            <h4>Итого: {totalWithDelivery.toLocaleString()} руб.</h4>
                            <p className="text-muted">(включая доставку)</p>
                        </Card.Body>
                    </Card>

                    <Button variant="dark" type="submit" disabled={submitting} className="checkout-btn w-100">
                        {submitting ? 'Оформляем...' : 'Подтвердить заказ'}
                    </Button>
                </Form>
            </Container>

            <Modal show={showSuccessModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Заказ оформлен!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ваш заказ №<strong>{orderId}</strong> успешно создан.</p>
                    <p>Письмо с деталями отправлено на <strong>{formData.email}</strong>.</p>
                    {payment === 'cash' && (
                        <p className="text-muted">Оплата наличными при самовывозе.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={closeModal}>
                        Продолжить покупки
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default Checkout;