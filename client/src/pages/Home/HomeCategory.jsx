import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomeCategory = () => {
    const [categories, setCategories] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-categories`);
            setCategories(response.data.data.reverse());
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Determine if there are more than 6 categories
    const hasMoreCategories = categories.length > 6;
    const visibleCategories = showAll ? categories : categories.slice(0, 6);

    return (
        <section className='my-5 category'>
            <div className="container">
                <div className="header-container">
                    <h2 className="header-title">Explore Our Delightful Categories</h2>
                    <p className="header-subtitle">Find the perfect toys for your little ones</p>
                </div>

                <div className="category-grid">
                    {visibleCategories.map((category, index) => (
                        <Link
                            to={`/our-products/${category.name.replace(/\s+/g, '-')}`}
                            className="main-category"
                            key={index}
                            style={{ backgroundImage: `url(${category.categoryImage.url})` }}
                        >
                            {/* <div className="content">
                                <h3>{category.name}</h3>
                            </div> */}
                        </Link>
                    ))}
                </div>

                {hasMoreCategories && (
                    <div className="text-center view-more-container mt-3">
                        <button className="viewMoreBtn" onClick={() => setShowAll(!showAll)}>
                            {showAll ? 'View Less' : 'View More'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default HomeCategory;
