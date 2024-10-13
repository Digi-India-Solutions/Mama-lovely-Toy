import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../Assets/logo.PNG';

const Footer = () => {
    return (
        <>
            <div className="newsletter-section text-center">
                <h3>Subscribe to our Newsletter</h3>
                <form className="newsletter-form">
                    <input type="email" placeholder="Your email" required />
                    <button type="submit">Subscribe</button>
                </form>
            </div>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 footer-section">
                            <img src={logo} alt="Mama LuvMee" className="footer-logo mb-3" />
                            <p>123 Lovely Street, Delhi, India</p>
                            <p>Phone: +91 123 456 7890</p>
                            <p>Email: info@mamalovelytoy.com</p>
                        </div>
                        <div className="col-md-3 footer-section">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/products">Products</Link></li>
                                <li><Link to="/blogs">Blogs</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 footer-section">
                            <h3>Policies</h3>
                            <ul>
                                <li><Link to="/terms-condition">Terms & Condition</Link></li>
                                <li><Link to="/shipping-delivery">Shipping & Delivery</Link></li>
                                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                <li><Link to="/return-refund">Return & Refund Policy</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 footer-section">
                            <h3>Follow Us</h3>
                            <div className="social-icons">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom text-center mt-4">
                        <p>&copy; 2024 Mama LuvMee. All rights reserved.</p>
                        <p>Designed By <a href="https://www.digiindiasolutions.com/" target="_blank" rel="noopener noreferrer">DIGI INDIA SOLUTIONS</a></p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
