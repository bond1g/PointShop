import { observer } from 'mobx-react-lite';
import React from 'react';
import { Row, Col, Card} from 'react-bootstrap';
import { useContext } from 'react';
import { Context } from '..';


const BrandBar = observer(() => {
    const{cloth} = useContext(Context)
    
    const handleBrandClick = (brand) => {
        if (cloth.selectedBrand?.id === brand.id) {
        cloth.setSelectedBrand(null);
        } else {
        cloth.setSelectedBrand(brand);
        }
    };

    return(
        <Row className="flex-row flex-nowrap overflow-auto gy-2 gx-2">
            {cloth.brands.map(brand => (
                <Col key={brand.id} xs="auto">   
                    <Card
                        style={{
                                padding: '8px 18px',
                                borderRadius: '40px',
                                border: '1px solid #ddd',
                                background: cloth.selectedBrand?.id === brand.id ? '#000' : '#fff',
                                color: cloth.selectedBrand?.id === brand.id ? '#fff' : '#000',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: '0.2s',
                            }}
                        className="rounded-pill px-4"
                        border={brand.id === cloth.selectedBrand?.id ? 'dark' : 'outline-secondary'}
                        onClick={() => handleBrandClick(brand)}
                    >
                        {brand.name}
                    </Card>
                </Col>
            ))}
        </Row>
    );
});

export default BrandBar;