import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CLOTH_ROUTE } from '../utils/consts';
import { sortSizes } from '../utils/sortSizes';
import './ClothItem.css';

const ClothItem = ({ cloth }) => {
    const history = useHistory();

    const availableSizes = sortSizes((cloth.cloth_sizes || []).filter(s => s.stock > 0))

    return (
        <Col md={4} sm={6} xs={12} className="mb-4">
            <Card
                className="cloth-card h-100"
                style={{ cursor: 'pointer', border: 'none', transition: 'transform 0.2s' }}
                onClick={() => history.push(CLOTH_ROUTE + '/' + cloth.id)}
            >
                <div className="cloth-image-wrapper">
                    <Card.Img
                        variant="top"
                        src={process.env.REACT_APP_API_URL + '/' + cloth.img}
                        className="cloth-image"
                    />
                </div>
                <Card.Body className="p-2 text-center">
                    <Card.Title className="cloth-name">{cloth.name}</Card.Title>
                    <Card.Text className="cloth-price">{cloth.price.toLocaleString()} руб.</Card.Text>
                    {availableSizes.length > 0 ? (
                        <div className="cloth-sizes">
                            {availableSizes.map(s => (
                                <span key={s.id} className="cloth-size-badge">{s.size}</span>
                            ))}
                        </div>
                    ) : cloth.cloth_sizes && cloth.cloth_sizes.length > 0 ? (
                        <div className="cloth-sizes">
                            <span className="cloth-size-nope">Нет в наличии</span>
                        </div>
                    ) : null}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ClothItem;
