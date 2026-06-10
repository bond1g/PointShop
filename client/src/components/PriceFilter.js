import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import './PriceFilter.css';

const PriceFilter = observer(() => {
    const { cloth } = useContext(Context);
    const [min, setMin] = useState(cloth.minPrice);
    const [max, setMax] = useState(cloth.maxPrice);

    const apply = () => {
        cloth.setMinPrice(min);
        cloth.setMaxPrice(max);
    };

    const reset = () => {
        setMin('');
        setMax('');
        cloth.setMinPrice('');
        cloth.setMaxPrice('');
    };

    const isActive = cloth.minPrice !== '' || cloth.maxPrice !== '';

    return (
        <div className="price-filter">
            <div className="price-filter__title">Цена, руб.</div>
            <div className="price-filter__inputs">
                <Form.Control
                    type="number"
                    min={0}
                    placeholder="от"
                    value={min}
                    onChange={e => setMin(e.target.value)}
                    className="price-filter__input"
                />
                <span className="price-filter__dash">—</span>
                <Form.Control
                    type="number"
                    min={0}
                    placeholder="до"
                    value={max}
                    onChange={e => setMax(e.target.value)}
                    className="price-filter__input"
                />
            </div>
            <div className="price-filter__btns">
                <Button
                    variant="dark"
                    size="sm"
                    className="price-filter__apply"
                    onClick={apply}
                >
                    Применить
                </Button>
                {isActive && (
                    <button
                        className="price-filter__reset"
                        onClick={reset}
                        title="Сбросить фильтр цены"
                    >
                        ✕ сбросить
                    </button>
                )}
            </div>
        </div>
    );
});

export default PriceFilter;
