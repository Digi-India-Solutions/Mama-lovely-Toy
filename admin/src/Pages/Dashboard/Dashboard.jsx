import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';  // Make sure to create this CSS file
import OrdersVisualization from './OrdersVisualization';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    orders: 0,
    banners: 0,
    categories: 0,
    subcategories: 0,
    products: 0,
    colors: 0,
    sizes: 0,
    users: 0,
    vouchers: 0,
    news: 0,
    enquiries: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          ordersRes, bannersRes, categoriesRes, subcategoriesRes, productsRes, 
          colorsRes, sizesRes, usersRes, vouchersRes, newsRes, enquiriesRes
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-orders`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-banners`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-categories`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-subcategories`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-products`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-colors`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-size`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/all-users`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/vouchers`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-news`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-enquiry`)
        ]);

        console.log(enquiriesRes);
        setCounts({
          orders: ordersRes.data.data.length,
          banners: bannersRes.data.data.length,
          categories: categoriesRes.data.data.length,
          subcategories: subcategoriesRes.data.data.length,
          products: productsRes.data.data.length,
          colors: colorsRes.data.data.length,
          sizes: sizesRes.data.length,
          users: usersRes.data.users.length,
          vouchers: vouchersRes.data.data.length,
          news: newsRes.data.length,
          enquiries: enquiriesRes.data.data.length
        });
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        <h2 className="dashboard-heading">
          Welcome To Mama Lovely Toy Admin Panel
        </h2>

        <div className="dashboard-cards">
          {[
            { title: 'Orders', count: counts.orders, icon: 'fa-solid fa-gauge', link: '/all-orders' },
            { title: 'Banners', count: counts.banners, icon: 'fa-solid fa-images', link: '/all-banners' },
            { title: 'Categories', count: counts.categories, icon: 'fa-solid fa-layer-group', link: '/all-category' },
            { title: 'Subcategories', count: counts.subcategories, icon: 'fa-solid fa-layer-group', link: '/all-subcategory' },
            { title: 'Products', count: counts.products, icon: 'fa-solid fa-boxes-stacked', link: '/all-products' },
            { title: 'Colors', count: counts.colors, icon: 'fa-solid fa-palette', link: '/all-colors' },
            { title: 'Sizes', count: counts.sizes, icon: 'fa-solid fa-ruler-combined', link: '/all-sizes' },
            { title: 'Users', count: counts.users, icon: 'fa-solid fa-users', link: '/all-users' },
            { title: 'Vouchers', count: counts.vouchers, icon: 'fa-solid fa-ticket-alt', link: '/all-vouchers' },
            { title: 'News', count: counts.news, icon: 'fa-regular fa-newspaper', link: '/all-news' },
            { title: 'Enquiries', count: counts.enquiries, icon: 'fa-solid fa-envelope-open-text', link: '/all-enquiries' }
          ].map(({ title, count, icon, link }, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-icon">
                <i className={`${icon}`}></i>
              </div>
              <div className="card-content">
                <h5 className="card-title">{title}</h5>
                <p className="card-count">{count}</p>
                <Link to={link} className="card-link">
                  View {title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      <OrdersVisualization/>
      </div>
    </>
  );
};

export default Dashboard;
