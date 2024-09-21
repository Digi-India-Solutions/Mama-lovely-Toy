import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductBySubCategory = () => {
    const { category, subCategory } = useParams();

    // Replace dashes with spaces
    const formattedCategory = category.replace(/-/g, ' ');
    const formattedSubCategory = subCategory.replace(/-/g, ' ');

    const [displayedProducts, setDisplayedProducts] = useState(9);
    const [loading, setLoading] = useState(false);
    const [ShopProducts, setShopProducts] = useState([]);

    const fetchShopProducts = async () =>{
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-product-by-category-and-subcategory/${formattedCategory}/${formattedSubCategory}`);
            // console.log(res.data.data);
            setShopProducts(res.data.data.reverse());

        } catch (error) {
            console.error("Error While Fetching Related Products : ",error);
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchShopProducts();
    }, [category, subCategory]);

    const handleShowMore = () => {
        setLoading(true);
        setTimeout(() => {
            setDisplayedProducts(prevCount => prevCount + 4);
            setLoading(false);
        }, 1000); // Simulate a delay for the loader
    };

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title' >{formattedSubCategory}</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to={`/our-products/${category}`}>{formattedCategory}</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{formattedSubCategory}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section>
                <div className="shop-container">
                    <div className="products-section">
                        <div className="products-grid">
                            {ShopProducts.slice(0, displayedProducts).map((product, index) => (
                                <Link to={`/our-products/${product.category.name.replace(/\s+/g, '-')}/${product.subCategory.name.replace(/\s+/g, '-')}/${product.name.replace(/\s+/g, '-')}`} key={index} className="product-card">
                                    <img src={product.productImage.url} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p className="price">₹{product.variants[0].discountPrice} <span className="actual-price">₹{product.variants[0].originalPrice}</span></p>
                                    <p className="discount">{product.variants[0].discountPercentage}% Off</p>
                                </Link>
                            ))}
                        </div>
                        {loading && <div className="loader"></div>}
                        {!loading && displayedProducts < ShopProducts.length && (
                            <button className="show-more-button" onClick={handleShowMore}>Show More</button>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductBySubCategory;
