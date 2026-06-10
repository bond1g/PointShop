import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Context } from '../index';
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE} from '../utils/consts';
import './NavBar.css';
import { useHistory } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';


const NavBar = observer(() => {
  const { user, basket } = useContext(Context);
  const history = useHistory();
  const itemCount = basket.items.reduce((sum, i) => sum + i.quantity, 0);

  const logOut = () => {
    user.setUser ({})
    user.setIsAuth(false)
  }

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand className="d-lg-none">ПОИНТ</Navbar.Brand>

        <div className="navbar-center">
          <NavLink to={SHOP_ROUTE} className="brand-logo">
            ПОИНТ
          </NavLink>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3">
            <Button variant="outline-dark" onClick={() => history.push('/about')} className="nav-btn">
              О нас
            </Button>
            {user.isAuth ? (
              <>
                  {user.user?.role === 'ADMIN' && (
                    <Button variant="outline-dark" onClick={() => history.push(ADMIN_ROUTE)} className="nav-btn">
                      Админ панель
                    </Button>
                  )}
                  <Button variant="outline-dark" onClick={() => history.push(BASKET_ROUTE)} className="cart-btn">
                    <FiShoppingBag size={16} className="me-1" />
                    Корзина
                    {itemCount > 0 && (
                      <span className="cart-badge">{itemCount}</span>
                    )}
                  </Button>
                  <Button variant="dark" onClick={logOut} className="nav-btn">
                    Выйти
                  </Button>
                </>
              ) : (
                <Button variant="dark" className="nav-btn" onClick={() => history.push(LOGIN_ROUTE)}>
                  Вход
                </Button>

            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;