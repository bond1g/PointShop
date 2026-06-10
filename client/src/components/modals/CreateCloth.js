import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import { Context } from '../..';
import { createCloth, fetchBrands, fetchClothes, fetchTypes } from '../../http/clothAPI';
import { observer } from 'mobx-react-lite';

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CreateCloth = observer(({show, onHide}) => {
  const{cloth} = useContext(Context)
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [file, setFile] = useState(null)
  const [info, setInfo] = useState([])
  const [sizes, setSizes] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
      fetchTypes().then(data => cloth.setTypes(data))
      fetchBrands().then(data => cloth.setBrands(data))
      fetchClothes().then(data => cloth.setCloths(data.rows))
    }, [])

  const addInfo = () => {
    setInfo([...info, {title: '', description: '', number: Date.now()}])
  }
  const removeInfo = (number) => {
    setInfo(info.filter(i => i.number !== number))
  }
  const changeInfo = (key, value, number) => {
    setInfo(info.map(i => i.number === number ? {...i, [key]: value}:i))
  }

  const addSize = (sizeLabel) => {
    if (sizes.find(s => s.size === sizeLabel)) return
    setSizes([...sizes, { size: sizeLabel, stock: 0, number: Date.now() }])
  }
  const removeSize = (number) => {
    setSizes(sizes.filter(s => s.number !== number))
  }
  const changeStock = (number, value) => {
    setSizes(sizes.map(s => s.number === number ? {...s, stock: Math.max(0, Number(value))} : s))
  }
  const addCustomSize = () => {
    setSizes([...sizes, { size: '', stock: 0, number: Date.now() }])
  }
  const changeSizeLabel = (number, value) => {
    setSizes(sizes.map(s => s.number === number ? {...s, size: value} : s))
  }

  const selectFile = e => {
    setFile(e.target.files[0])
  }

  const addCloth = async () => {
    setError('')
    if (!name.trim())              return setError('Введите название товара')
    if (!price || Number(price) <= 0) return setError('Введите корректную цену')
    if (!file)                     return setError('Выберите фото товара')
    if (!cloth.selectedType?.id)   return setError('Выберите тип')
    if (!cloth.selectedBrand?.id)  return setError('Выберите бренд')

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('price', String(price))
      formData.append('img', file)
      formData.append('brandId', cloth.selectedBrand.id)
      formData.append('typeId', cloth.selectedType.id)
      formData.append('info', JSON.stringify(info))
      formData.append('sizes', JSON.stringify(sizes.filter(s => s.size.trim())))
      await createCloth(formData)
      // сброс формы
      setName(''); setPrice(0); setFile(null); setInfo([]); setSizes([])
      onHide()
    } catch(e) {
      setError(e.response?.data?.message || 'Ошибка при создании товара')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Добавить вещь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Dropdown className='mt-2'>
                <Dropdown.Toggle>{cloth.selectedType?.name || "Выберите тип"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {cloth.types.map(type =>
                        <Dropdown.Item
                            onClick={() => cloth.setSelectedType(type)}
                            key={type.id}>
                            {type.name}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='mt-2'>
                <Dropdown.Toggle>{cloth.selectedBrand?.name || "Выберите бренд"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {cloth.brands.map(brand =>
                        <Dropdown.Item
                            onClick={() => cloth.setSelectedBrand(brand)}
                            key={brand.id}>
                            {brand.name}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control
                value={name}
                onChange={e => setName(e.target.value)}
                className='mt-3'
                placeholder='Введите название вещи'
            />
            <Form.Control
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className='mt-3'
                placeholder='Введите стоимость вещи'
                type='number'
            />
            <Form.Control
                className='mt-3'
                type='file'
                onChange={selectFile}
            />

            <hr/>
            <div className='mb-2 fw-semibold'>Размеры и остатки</div>
            <div className='d-flex flex-wrap gap-2 mb-2'>
                {PRESET_SIZES.map(sz => (
                    <Button
                        key={sz}
                        size='sm'
                        variant={sizes.find(s => s.size === sz) ? 'dark' : 'outline-dark'}
                        onClick={() => sizes.find(s => s.size === sz) ? removeSize(sizes.find(s => s.size === sz).number) : addSize(sz)}
                    >
                        {sz}
                    </Button>
                ))}
                <Button size='sm' variant='outline-secondary' onClick={addCustomSize}>+ свой</Button>
            </div>
            {sizes.map(s =>
                <Row className='mt-2 align-items-center' key={s.number}>
                    <Col md={3}>
                        <Form.Control
                            value={s.size}
                            onChange={e => changeSizeLabel(s.number, e.target.value)}
                            placeholder='Размер'
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type='number'
                            min={0}
                            value={s.stock}
                            onChange={e => changeStock(s.number, e.target.value)}
                            placeholder='Остаток (шт.)'
                        />
                    </Col>
                    <Col md={2}>
                        <Button size='sm' variant='outline-danger' onClick={() => removeSize(s.number)}>Удалить</Button>
                    </Col>
                </Row>
            )}

            <hr/>
            <Button variant={'outline-dark'} onClick={addInfo}>
                Добавить характеристику
            </Button>
            {info.map(i =>
                <Row className='mt-3' key={i.number}>
                    <Col md={4}>
                        <Form.Control
                            value={i.title}
                            onChange={e => changeInfo('title', e.target.value, i.number)}
                            placeholder='Название характеристики'
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            onChange={e => changeInfo('description', e.target.value, i.number)}
                            value={i.description}
                            placeholder='Описание свойства'
                        />
                    </Col>
                    <Col md={4}>
                        <Button onClick={() => removeInfo(i.number)} variant={'outline-danger'}>Удалить</Button>
                    </Col>
                </Row>
            )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="flex-column align-items-stretch gap-2">
        {error && <div className="text-danger w-100" style={{ fontSize: '0.88rem' }}>{error}</div>}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="outline-danger" onClick={onHide} disabled={saving}>Закрыть</Button>
          <Button variant="outline-success" onClick={addCloth} disabled={saving}>
            {saving ? 'Добавление...' : 'Добавить'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateCloth;
