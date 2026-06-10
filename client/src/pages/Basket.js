import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col, Button, Image, Form } from 'react-bootstrap';
import { Context } from '../index';
import { FaTimes } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { CHECKOUT_ROUTE } from '../utils/consts';

const Basket = observer(() => {
    const { basket } = useContext(Context);
    const history = useHistory();
    const { items, loading } = basket;
    const [promoCode, setPromoCode] = useState('');
    const [promoMessage, setPromoMessage] = useState('');

    useEffect(() => {
        basket.loadBasket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApplyPromo = async () => {
        const success = await basket.applyPromo(promoCode);
        if (success) {
            setPromoMessage('Промокод применён!');
            setPromoCode('');
        } else {
            setPromoMessage('Неверный или просроченный промокод');
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        basket.updateQuantity(itemId, newQuantity);
    };

    const handleRemove = (itemId) => {
        basket.removeItem(itemId);
    };

    const handleClear = () => {
        if (window.confirm('Очистить корзину?')) basket.clear();
    };

    const handleCheckout = () => {
        history.push(CHECKOUT_ROUTE);
    };

    if (loading) return <Container className="mt-5 text-center">Загрузка корзины...</Container>;
    if (items.length === 0) return <Container className="mt-5 text-center"><h3>Корзина пуста</h3></Container>;

    return (
        <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
            <h2 className="mb-4">КОРЗИНА</h2>
            {items.map(item => (
                <div key={item.id} className="d-flex align-items-center border-bottom pb-3 mb-3">
                    <Image
                        src={process.env.REACT_APP_API_URL + '/' + item.img}
                        style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 20 }}
                    />
                    <div style={{ flex: 2 }}>
                        <div><strong>{item.name}</strong></div>
                        <div className="text-muted">Размер: {item.size}</div>
                        <div>{item.price.toLocaleString()} руб.</div>
                    </div>
                    <div style={{ width: 120 }} className="text-center">
                        <Form.Control
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            style={{ width: 70, margin: '0 auto' }}
                        />
                    </div>
                    <div style={{ width: 100 }} className="text-end fw-bold">
                        {(item.price * item.quantity).toLocaleString()} руб.
                    </div>
                    <Button variant="link" className="text-danger" onClick={() => handleRemove(item.id)}>
                        <FaTimes size={18} />
                    </Button>
                </div>
            ))}
                <div className="text-end mt-4">
                    {basket.discountPercent > 0 && (
                        <div className="text-muted text-decoration-line-through">
                            {basket.originalTotal.toLocaleString()} руб.
                        </div>
                    )}
                    <h4>Итого: {basket.totalPrice.toLocaleString()} руб.</h4>
                    {basket.discountPercent > 0 && (
                        <div className="text-success">Скидка: {basket.discountPercent}%</div>
                    )}
                </div>
                    <Row className="mt-3 align-items-center">
                        <Col md={6}>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Промо-код"
                                    value={promoCode}
                                    onChange={e => setPromoCode(e.target.value)}
                                    style={{ width: '200px' }}
                                />
                                <Button variant="outline-secondary" onClick={handleApplyPromo}>
                                    Применить
                                </Button>
                                {promoMessage && <span className="text-muted ms-2">{promoMessage}</span>}
                            </div>
                        </Col>
                        <Col md={6} className="text-end">
                            <Button variant="outline-secondary" onClick={handleClear}>
                                Очистить корзину
                            </Button>
                            <Button variant="dark" onClick={handleCheckout} className="ms-2">
                                Оформить заказ
                            </Button>
                        </Col>
                    </Row>
        </Container>
    );
});

export default Basket;