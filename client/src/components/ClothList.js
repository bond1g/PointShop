import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Spinner } from 'react-bootstrap';
import { Context } from '..';
import ClothItem from './ClothItem';

const ClothList = observer(() => {
    const { cloth } = useContext(Context);

    if (cloth.loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                <Spinner animation="border" variant="dark" />
            </div>
        );
    }

    if (!cloth.cloths || cloth.cloths.length === 0) {
        return <div className="text-center text-muted mt-5">Товары не найдены</div>;
    }

    return (
        <Row className="g-4 mt-2">
            {cloth.cloths.map(item => (
                <ClothItem key={item.id} cloth={item} />
            ))}
        </Row>
    );
});

export default ClothList;
