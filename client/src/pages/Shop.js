import React, { useContext, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import TypeBar from '../components/TypeBar';
import Col from 'react-bootstrap/Col';
import BrandBar from '../components/BrandBar';
import ClothList from '../components/ClothList';
import PriceFilter from '../components/PriceFilter';
import SortBar from '../components/SortBar';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { fetchBrands, fetchClothes, fetchTypes } from '../http/clothAPI';
import Pages from '../components/Pages';

const Shop = observer(() => {
    const { cloth } = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => cloth.setTypes(data))
        fetchBrands().then(data => cloth.setBrands(data))
    }, [])

    useEffect(() => {
        cloth.setLoading(true)
        fetchClothes(
            cloth.selectedType?.id,
            cloth.selectedBrand?.id,
            cloth.page,
            cloth.limit,
            cloth.minPrice,
            cloth.maxPrice,
            cloth.sort
        ).then(data => {
            cloth.setCloths(data.rows)
            cloth.setTotalCount(data.count)
        }).finally(() => {
            cloth.setLoading(false)
        })
    }, [cloth.selectedType, cloth.selectedBrand, cloth.page, cloth.limit, cloth.minPrice, cloth.maxPrice, cloth.sort])

    return (
        <Container>
            <Row className='mt-2'>
                <Col md={3}>
                    <TypeBar />
                    <PriceFilter />
                </Col>
                <Col md={9}>
                    <BrandBar />
                    <SortBar />
                    <ClothList />
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;
