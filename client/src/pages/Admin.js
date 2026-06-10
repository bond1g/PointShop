import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Container, Row, Col, Collapse } from 'react-bootstrap';
import { Context } from '../index';
import CreateBrand from '../components/modals/CreateBrand';
import CreateType from '../components/modals/CreateType';
import CreateCloth from '../components/modals/CreateCloth';
import BrandList from '../components/modals/BrandList';
import TypeList from '../components/modals/TypeList';
import ClothListAdmin from '../components/modals/ClothListAdmin';
import { fetchBrands, fetchTypes, fetchAllClothes } from '../http/clothAPI';
import { useHistory } from 'react-router-dom';


const Admin = observer(() => {
    const { cloth } = useContext(Context);
    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [clothVisible, setClothVisible] = useState(false);
    const [showManagement, setShowManagement] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchBrands().then(data => cloth.setBrands(data));
        fetchTypes().then(data => cloth.setTypes(data));
        fetchAllClothes().then(data => cloth.setCloths(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="d-flex flex-column gap-3 mb-4">
                        <Button variant="outline-dark" onClick={() => setTypeVisible(true)}>
                            Добавить тип
                        </Button>
                        <Button variant="outline-dark" onClick={() => setBrandVisible(true)}>
                            Добавить бренд
                        </Button>
                        <Button variant="outline-dark" onClick={() => setClothVisible(true)}>
                            Добавить вещь
                        </Button>
                        <Button 
                            variant={showManagement ? "dark" : "outline-dark"} 
                            onClick={() => setShowManagement(!showManagement)}
                        >
                            {showManagement ? "Скрыть управление" : "Управление каталогом"}
                        </Button>

                        <Button variant="outline-dark" onClick={() => history.push('/admin/orders')}>
                            Заказы
                        </Button>
                    </div>

                    <Collapse in={showManagement}>
                        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                            <TypeList />
                            <BrandList />
                            <ClothListAdmin />
                        </div>
                    </Collapse>
                </Col>
            </Row>

            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
            <CreateCloth show={clothVisible} onHide={() => setClothVisible(false)} />
        </Container>
    );
});

export default Admin;