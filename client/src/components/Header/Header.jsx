import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../Assets/logo.png';
import CartSidebar from '../CartSidebar/CartSidebar';
import { getCartTotalItems } from '../../pages/CartPage/cartUtils';
import userImage from './user-person.svg'
import cartIcon from './cart-icon.png'
import menuIcon from './menu-icon.png'


const Header = () => {
  const [openCart, setOpenCart] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showDropUp, setShowDropUp] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartNumber, setCartNumber] = useState(0); // Initialize to 0

  const handleOpenClick = () => {
    setOpenCart(!openCart);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    setShowDropUp(!showDropUp);
  };

  const handleCloseDropUp = () => {
    setShowDropUp(false);
  };

  const toggleSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };

  // const handleCartClick = () => {
  //   setActiveTab('cart');
  //   toggleSidebar();
  // };

  useEffect(() => {
    // Fetch user data from local storage
    const userData = localStorage.getItem('mamaLovelyToyUser');
    const userDataToken = localStorage.getItem('mamaLovelyToyToken');
    if (userData && userDataToken) {
      setUser(JSON.parse(userData));
    }

    // Update the cart total whenever the component loads
    setCartNumber(getCartTotalItems());

    // Listen for changes in localStorage for cart updates
    const handleCartUpdate = () => {
      setCartNumber(getCartTotalItems());
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="MAMA Luvmee" />
              </Link>
            </div>
            <nav className="navbar">
              <ul>
                <li><Link to="/">Home</Link></li>
                {/* <li className="dropdown">
                  <Link to="/shop">Products</Link>
                  <ul className="dropdown-menu">
                    <li><Link to="/category/products">Baby Toys</Link></li>
                    <li><Link to="/category/products">Teddy Bear</Link></li>
                    <li><Link to="/category/products">Carry Cot</Link></li>
                    <li><Link to="/category/products">Riders</Link></li>
                    <li><Link to="/category/products">Baby Cars</Link></li>
                  </ul>
                </li> */}
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/blogs">Blog</Link></li>
                <li><Link to="/contact">Support</Link></li>
              </ul>
            </nav>

            <div className="header-right">
              <div className="user-actions">
                {/* {user ? "" : (
                  <Link to="/profile"><i className="fas fa-user"></i></Link>
                )} */}

                {/* <Link className="cart-icon" to={`/cart`} onClick={handleCartClick}> */}
                <Link className="cart-icon" to={`/cart`} >
                  {/* <i className="fas fa-shopping-cart"></i> */}
                  <img src={cartIcon} alt="Cart-Icon" height={24} style={{objectFit : "contain" ,width : "auto" }} />
                  {cartNumber > 0 && <span className="cart-number">{cartNumber}</span>}
                </Link>
                <button className='hamburger' onClick={handleOpenClick}>
                  {/* <i className="fas fa-bars"></i> */}
                  <img src={menuIcon} alt="Cart-Icon" height={24} style={{objectFit : "contain" ,width : "auto" }} />
                </button>
              </div>
              {user ? (
                <div className="auth-buttons">
                  <Link to={`/profile`} className="user-name">Hello, {user.name}</Link>
                  <button onClick={() => {
                    // Logic to handle logout
                    localStorage.removeItem('mamaLovelyToyUser');
                    localStorage.removeItem('mamaLovelyToyToken');
                    window.location.href = "/"
                    setUser(null);
                    setCartNumber(0);
                  }} className="logout-button">Logout</button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-button">Sign In</Link>
                  <Link to="/register" className="register-button">Create an Account</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className={`sidebar ${openCart ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={handleOpenClick}>
            <i className="fas fa-times"></i>
          </button>
          {user ? (
            <div className="profile">
              <img src={userImage} alt="Profile" />
              <div className="profile-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="float-right">
              <img src={logo} alt="Logo" style={{width:"80px"}} />
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link onClick={handleOpenClick} to="/"><i className="fas fa-home"></i> Home</Link></li>
            <li><Link onClick={handleOpenClick} to="/shop"><i className="fas fa-shopping-cart"></i> Shop</Link></li>
            <li><Link onClick={handleOpenClick} to="/blogs"><i className="fas fa-blog"></i> Blog</Link></li>
            <li><Link onClick={handleOpenClick} to="/support"><i className="fas fa-headset"></i> Support</Link></li>
            {user ? (
              <li>
                <Link 
                  onClick={() => {
                    // Logic to handle logout
                    localStorage.removeItem('mamaLovelyToyUser');
                    localStorage.removeItem('mamaLovelyToyToken');
                    localStorage.removeItem('cart');
                    setUser(null);
                  }} 
                ><i className="fas fa-sign-out-alt"></i> Logout</Link>
              </li>
            ) : null}
          </ul>

          {!user && (
            <div className="bottom-side">
              <Link onClick={handleOpenClick} to="/login" className='login-button'><i className="fas fa-sign-in-alt"></i> Sign In</Link>
              <Link onClick={handleOpenClick} to="/register" className='register-button'><i className="fas fa-user-plus"></i> Register</Link>
            </div>
          )}
        </nav>
      </section>

      {/* ==== Bottom Navbar  ====  */}
      <section className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Link to="/"><i className="fas fa-home"></i></Link>
          <span>Home</span>
        </div>
        <div className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
          <Link to="/shop"><i className="fa-solid fa-store"></i></Link>
          <span>Shop</span>
        </div>
        <div className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
          <Link to="/cart"><i className="fa-solid fa-basket-shopping"></i></Link>
          <span>Cart</span>
        </div>
        {user ? (
          <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <Link to="/profile"><i className="fas fa-user"></i></Link>
            <span>Profile</span>
          </div>
        ) : (
          <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={handleProfileClick}>
            <Link><i className="fas fa-user"></i></Link>
            <span>Profile</span>
          </div>
        )}
      </section>

      <section className={`not-login-dropUp ${showDropUp ? 'visible' : ''}`}>
        <div className="bottom-side">
          <Link to="/login" className="login-button" onClick={handleCloseDropUp}>
            <i className="fas fa-sign-in-alt"></i> Sign In
          </Link>
          <Link to="/register" className="register-button" onClick={handleCloseDropUp}>
            <i className="fas fa-user-plus"></i> Register
          </Link>
        </div>
      </section>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={toggleSidebar} />
    </>
  );
};

export default Header;
