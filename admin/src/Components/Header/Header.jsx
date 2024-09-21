import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import logo from './logo.png'

const Header = () => {
  const [sidetoggle, setSideToggle] = useState(false);

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle)
  }

  const handleLogOut = () => {
    sessionStorage.removeItem("mamaLovelyToyToken");
    sessionStorage.removeItem("mamaLovelyToyUser");
    window.location.href = "/";
  }
  return (
    <>
      <header>
        <div className="top-head">
          <div className="right">
            {/* <h2>Mama Lovely Toy</h2> */}
            <div className="logo">
              <img src={logo} alt="logo" style={{ width: "100px", height: "auto" }} />
            </div>
            <div className="bar" onClick={handletoggleBtn}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <a href="#" target="_blank">
              <i className="fa-solid fa-globe"></i>
              Go To Website
            </a>

            <div className="logout" onClick={handleLogOut}>
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>

        </div>

        <div className={`rightNav ${sidetoggle ? "active" : ""} `}>
          <ul>
            <li><Link to="/dashboard" onClick={handletoggleBtn}>
              <i className="fa-solid fa-gauge"></i> Dashboard
            </Link></li>
            <li><Link to="/all-orders" onClick={handletoggleBtn}>
              <i className="fa-solid fa-gauge"></i> Orders
            </Link></li>

            <li><Link to="/all-banners" onClick={handletoggleBtn}>
              <i className="fa-solid fa-images"></i> Manage Banners
            </Link></li>

            <li><Link to="/all-category" onClick={handletoggleBtn}>
              <i className="fa-solid fa-layer-group"></i> Manage Categories
            </Link></li>

            <li><Link to="/all-subcategory" onClick={handletoggleBtn}>
              <i className="fa-solid fa-layer-group"></i> Manage Subcategories
            </Link></li>

            <li><Link to="/all-products" onClick={handletoggleBtn}>
              <i className="fa-solid fa-boxes-stacked"></i> Manage Products
            </Link></li>

            <li><Link to="/all-colors" onClick={handletoggleBtn}>
              <i className="fa-solid fa-palette"></i> Manage Colors
            </Link></li>

            <li><Link to="/all-sizes" onClick={handletoggleBtn}>
              <i className="fa-solid fa-ruler-combined"></i> Manage Sizes
            </Link></li>

            <li><Link to="/all-users" onClick={handletoggleBtn}>
              <i className="fa-solid fa-users"></i> Users
            </Link></li>

            <li><Link to="/all-voucher" onClick={handletoggleBtn}>
              <i className="fa-solid fa-ticket-alt"></i> Manage Vouchers
            </Link></li>

            <li><Link to="/all-news" onClick={handletoggleBtn}>
              <i className="fa-regular fa-newspaper"></i> Manage News
            </Link></li>

            <li><Link to="/all-enquiry" onClick={handletoggleBtn}>
              <i className="fa-solid fa-envelope-open-text"></i> All Enquiries
            </Link></li>

            <button className="logout mb-5" onClick={handleLogOut}>
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </ul>

        </div>

      </header>
    </>
  )
}

export default Header