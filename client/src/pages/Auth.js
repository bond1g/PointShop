import React, { useContext, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { login, registration } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '..';


const Auth = observer(() => {
  const { user, basket } = useContext(Context);
  const location = useLocation();
  const history = useHistory();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(data);
      user.setIsAuth(true);
      await basket.loadBasket();
      history.push(SHOP_ROUTE);
    } catch (e) {
      alert(e.response?.data?.message || 'Ошибка авторизации');
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 580 }} className="p-4">
        <h2 className="m-auto">{isLogin ? 'Войдите в свой аккаунт' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-4"
            placeholder="Введите email..."
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-2"
            placeholder="Введите пароль..."
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            {isLogin ? 'Нет аккаунта?' : 'Есть аккаунт?'}{' '}
            <NavLink to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE}>
              {isLogin ? 'Зарегистрируйтесь здесь.' : 'Войдите'}
            </NavLink>
          </div>
          <Button variant="outline-dark" onClick={click}>
            {isLogin ? 'Войти' : 'Регистрация'}
          </Button>
        </div>
      </Card>
    </Container>
  );
});

export default Auth;