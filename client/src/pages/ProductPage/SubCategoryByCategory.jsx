import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const SubCategoryByCategory = () => {
    const { category } = useParams();

    // Replace dashes with spaces
    const formattedCategory = category.replace(/-/g, ' ');
    const [CategoryProducts, setCategoryProducts] = useState([]);

    const fetchCategoryProducts = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-subcategory-by-category-name/${formattedCategory}`);
            setCategoryProducts(res.data.data.reverse());
        } catch (error) {
            console.error("Error While Fetching Related Products: ", error);
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchCategoryProducts();
    }, [formattedCategory]);

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title'>{formattedCategory}</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{formattedCategory}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className='subcategory my-5'>
                <div className="container">
                    <div className="subcategory-list">
                        {CategoryProducts.length > 0 ? (
                            CategoryProducts.map(subCategory => (
                                <Link to={`/our-products/${subCategory.category.name.replace(/\s+/g, '-')}/${subCategory.name.replace(/\s+/g, '-')}`} className="single-subcategory" key={subCategory._id}>
                                    <div className="image">
                                        <img src={subCategory.subCategoryImage.url} className="card-img-top" alt={subCategory.name} />
                                    </div>
                                    <h5 className="subcategory-title">{subCategory.name}</h5>
                                </Link>
                            ))
                        ) : (
                            <h3 className='text-center text-danger h3'>No subcategories found for this category.</h3>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default SubCategoryByCategory;
