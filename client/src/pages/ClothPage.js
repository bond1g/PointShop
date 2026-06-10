import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Toast, ToastContainer } from 'react-bootstrap';
import { Context } from '../index';
import { fetchOneCloth } from '../http/clothAPI';
import { sortSizes } from '../utils/sortSizes';
import './ClothPage.css';

const ClothPage = observer(() => {
    const { id } = useParams();
    const history = useHistory();
    const { user, basket } = useContext(Context);
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchOneCloth(id)
            .then(data => {
                setProduct(data);
                const firstAvailable = data.cloth_sizes?.find(s => s.stock > 0)
                setSelectedSize(firstAvailable?.size || null)
            })
            .catch(err => console.error('Ошибка загрузки товара:', err));
    }, [id]);

    if (!product) return <Container className="mt-5 text-center">Загрузка...</Container>;

    const sizes = sortSizes(product.cloth_sizes || []);
    const availableSizes = sizes.filter(s => s.stock > 0);
    const selectedSizeObj = sizes.find(s => s.size === selectedSize);

    const addToCart = () => {
        if (!user.isAuth) {
            setToastMessage('Пожалуйста, войдите в аккаунт');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        if (!selectedSize) {
            setToastMessage('Выберите размер');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        basket.addItem(product.id, selectedSize, 1);
        setToastMessage(`Товар "${product.name}" добавлен в корзину! Размер: ${selectedSize}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const features = [];
    if (product.brand?.name) {
        features.push(`Бренд: ${product.brand.name}`);
    }
    if (product.cloth_infos && Array.isArray(product.cloth_infos)) {
        product.cloth_infos.forEach(info => {
            if (info.title) features.push(info.title);
        });
    }

    return (
        <div className="cloth-page">
            <Container fluid className="px-4 px-lg-5">
                <button className="back-btn" onClick={() => history.goBack()}>
                    ← Назад
                </button>
                <Row className="g-5 mt-2">
                    <Col md={6}>
                        <div className="product-image-wrapper">
                            <Image
                                src={process.env.REACT_APP_API_URL + '/' + product.img}
                                alt={product.name}
                                fluid
                                className="product-image"
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="product-info">
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-price">{product.price.toLocaleString()} руб.</div>

                            {features.length > 0 && (
                                <div className="product-features mt-4">
                                    <div className="features-grid">
                                        {features.map((feature, idx) => (
                                            <div key={idx} className="feature-item">
                                                <span className="feature-title">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="size-selector mt-4 position-relative">
                                {sizes.length > 0 ? (
                                    <>
                                        <div className='mb-2 text-muted' style={{fontSize: '0.85rem'}}>Выберите размер:</div>
                                        <div className='d-flex flex-wrap gap-2 mb-3'>
                                            {sizes.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                                                    className={`size-btn${selectedSize === s.size ? ' size-btn--active' : ''}${s.stock === 0 ? ' size-btn--out' : ''}`}
                                                    disabled={s.stock === 0}
                                                    title={s.stock === 0 ? 'Нет в наличии' : `${s.stock} шт.`}
                                                >
                                                    {s.size}
                                                    {s.stock === 0 && <span className='size-btn__cross'>✕</span>}
                                                </button>
                                            ))}
                                        </div>
                                        {selectedSizeObj && selectedSizeObj.stock <= 3 && (
                                            <div className='text-danger mb-2' style={{fontSize: '0.85rem'}}>
                                                Осталось: {selectedSizeObj.stock} шт.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className='text-muted mb-3'>Размеры не указаны</div>
                                )}

                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                    <Button
                                        variant="dark"
                                        className="add-to-cart-btn"
                                        onClick={addToCart}
                                        disabled={sizes.length > 0 && availableSizes.length === 0}
                                    >
                                        {sizes.length > 0 && availableSizes.length === 0 ? 'НЕТ В НАЛИЧИИ' : 'В КОРЗИНУ'}
                                    </Button>
                                </div>

                                <ToastContainer position="static" className="mt-2">
                                    <Toast
                                        show={showToast}
                                        onClose={() => setShowToast(false)}
                                        delay={3000}
                                        autohide
                                        className="custom-toast"
                                    >
                                        <Toast.Body className="text-center">{toastMessage}</Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
});

export default ClothPage;
