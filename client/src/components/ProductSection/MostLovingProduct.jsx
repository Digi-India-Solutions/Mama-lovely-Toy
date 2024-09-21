import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MostLovingProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Replace with your actual API URL
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-products`);
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <section style={{ background: "var(--bg-yellow)" }}>
                <div className="container py-5">
                    {/* <div className="row head">
                        <div className="col-md-12 text-center">
                            <h2>Most Loving Products</h2>
                        </div>
                    </div> */}
                    <div className="header-container mb-5">
                        <h2 className="header-title">Our Loving Products</h2>
                    </div>

                    <div className="grid-5 product-section">
                        {products && products.slice(0, 10).map((product, index) => (
                            <Link to={`/our-products/${product.category.name.replace(/\s+/g, '-')}/${product.subCategory.name.replace(/\s+/g, '-')}/${product.name.replace(/\s+/g, '-')}`} className="sin-product" key={index}>
                                <div className="img">
                                    <img src={product.productImage.url} alt={product.name} />
                                    <div className="absolute-items">
                                        <div className="offPercent">{product.variants[0].discountPercentage}% Off</div>
                                    </div>
                                </div>
                                <div className="product-desc">
                                    <div className="product-name">{product.name}</div>
                                    <div className="acctual-price">₹{product.variants[0].originalPrice}</div>
                                    <div className="off-price">₹{product.variants[0].discountPrice}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {products.length > 10 && (
                        <div className="col-12 text-center">
                            <div className="view-more-container">
                                <Link to="/shop" className="viewMoreBtn">
                                    View All Products
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default MostLovingProduct;
