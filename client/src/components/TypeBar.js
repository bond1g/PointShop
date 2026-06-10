import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { Context } from '..';
import { ListGroup } from 'react-bootstrap';

const TypeBar = observer(() => {
    const{cloth} = useContext(Context)
    const handleTypeClick = (type) => {
        if (cloth.selectedType?.id === type.id) {
        cloth.setSelectedType(null);
        } else {
        cloth.setSelectedType(type);
        }
    };
    return(
        <ListGroup>
            {cloth.types.map(type =>
                <ListGroup.Item
                style = {{cursor: 'pointer', fontWeight: 400}}
                active={type.id === cloth.selectedType?.id}
                onClick={() => handleTypeClick(type)}
                key ={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;