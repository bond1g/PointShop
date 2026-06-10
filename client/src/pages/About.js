import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './About.css';

const About = () => {
  return (
    <Container className="about-page mt-5">
      <Row>
        <Col md={6} className="about-text">
          <h1>О нас</h1>
          <p>
            Добро пожаловать в <strong>ПОИНТ</strong> – магазин мультибрендовый оригинальной одежды.
            Мы продаем вещи, которые подчёркивают индивидуальность, вдохновляют и дарят комфорт каждый день. 
          </p>
          <p>
            Наша миссия – предлагать качественные товары по доступным ценам, поддерживая 
            отечественных производителей и следя за трендами. У нас вы найдёте как базовые 
            модели, так и лимитированные коллекции.
          </p>
          <h4>Где нас найти</h4>
          <p>
            Наш шоурум находится в центре Тюмени. Ждём вас в гости!
          </p>
          <address>
            <strong>Адрес:</strong> г. Тюмень, ул. Грибоедова, д. 3, 7 этаж<br />
            <strong>Режим работы:</strong> Ежедневно с 12:00 до 20:00<br />
            <strong>Телефон:</strong> +7 (999) 212-34-56<br />
            <strong>Email:</strong> bondigz1@gmail.com
          </address>
        </Col>
        <Col md={6}>
          <div className="map-container">
            <iframe
              title="map"
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A&text=Тюмень%2C%20ул.%20Грибоедова%203%2C%207%20этаж&z=17&pt=65.541717,57.160626,flag"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;