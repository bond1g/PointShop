import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import './SortBar.css';

const OPTIONS = [
    { value: 'newest',     label: 'Сначала новые' },
    { value: 'price_asc',  label: 'Цена: по возрастанию' },
    { value: 'price_desc', label: 'Цена: по убыванию' },
    { value: 'oldest',     label: 'Сначала старые' },
];

const SortBar = observer(() => {
    const { cloth } = useContext(Context);

    return (
        <div className="sort-bar">
            <span className="sort-bar__label">Сортировка:</span>
            <div className="sort-bar__options">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        className={`sort-bar__btn${cloth.sort === opt.value ? ' sort-bar__btn--active' : ''}`}
                        onClick={() => cloth.setSort(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default SortBar;
