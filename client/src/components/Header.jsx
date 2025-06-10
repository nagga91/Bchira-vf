import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Button, Drawer, Badge } from 'antd'; // Import Badge from antd

function Header({ cart }) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  // Compute total number of items or lengths
  const itemCount = Array.isArray(cart) ? cart.length : 0;

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-links">
          <input type="text" placeholder='Search...' />
        </div>

        <div className="logo">
          <Link to="/" className="nav-link">
            <img width={220} height={80} src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="nav-links">
          <div className="menu">
            <RxHamburgerMenu onClick={showDrawer} style={{ cursor: 'pointer' }} size={24} />
          </div>

          <div className="settings">
            <Link to={'/checkout'}>
              {/* Wrap icon in Badge */}
              <Badge count={itemCount} offset={[ -5, 5 ]}>
                <HiOutlineShoppingBag size={24} />
              </Badge>
            </Link>
          </div>
        </div>

        <Drawer title="Menu" onClose={onClose} open={open}>
          <Link to="/"> <p className="nav-link">Home</p> </Link>
          <Link to="/shop"> <p className="nav-link">Produits</p> </Link>
          <Link to="/checkout"> <p className="nav-link">Panier</p> </Link>
          <Link to="/contact"> <p className="nav-link">Contact</p> </Link>
        </Drawer>
      </nav>
    </header>
  );
}

export default Header;
