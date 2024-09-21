import React, { useState, useEffect } from 'react';
import './Shop.css';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [showFilter, setShowFilter] = useState(false);
    const [shopProducts, setShopProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1500]);
    const [sortOption, setSortOption] = useState('Best Match');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch products and categories from the API
        const fetchData = async () => {
            try {
                // Fetch products
                const productResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/get-all-products`);
                const productResult = await productResponse.json();

                // Fetch categories
                const categoryResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/get-all-categories`);
                const categoryResult = await categoryResponse.json();

                if (productResult.success) {
                    setShopProducts(productResult.data);
                    setFilteredProducts(productResult.data);
                } else {
                    console.error('Failed to fetch products:', productResult.message);
                }

                if (categoryResult.success) {
                    setCategories(categoryResult.data);
                } else {
                    console.error('Failed to fetch categories:', categoryResult.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        let products = [...shopProducts];

        // Filter by category
        if (categoryFilter.length > 0) {
            products = products.filter(product =>
                categoryFilter.includes(product.category.name)
            );
        }

        // Filter by price range
        products = products.filter(product =>
            product.variants.some(variant =>
                variant.discountPrice >= priceRange[0] && variant.discountPrice <= priceRange[1]
            )
        );

        // Sort products
        switch (sortOption) {
            case 'Price: Low to High':
                products.sort((a, b) =>
                    a.variants[0].discountPrice - b.variants[0].discountPrice
                );
                break;
            case 'Price: High to Low':
                products.sort((a, b) =>
                    b.variants[0].discountPrice - a.variants[0].discountPrice
                );
                break;
            case 'Newest':
                products.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                break;
            default:
                break;
        }

        setFilteredProducts(products);
    }, [categoryFilter, priceRange, sortOption, shopProducts]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCategoryChange = (category) => {
        setCategoryFilter(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setPriceRange([0, value]);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title' >Shop</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Shop</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <div className="shop-container">
                <button className="filter-toggle-btn" onClick={() => setShowFilter(!showFilter)}>
                    {showFilter ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className={`filter-section ${showFilter ? 'show' : ''}`}>
                    <h2>Filters</h2>
                    <div className="filter-group">
                        <h3>Category</h3>
                        <div className="category-list">
                            {categories.map((category) => (
                                <label key={category._id}>
                                    <input
                                        type="checkbox"
                                        checked={categoryFilter.includes(category.name)}
                                        onChange={() => handleCategoryChange(category.name)}
                                    />
                                    &nbsp; {category.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="filter-group">
                        <h3>Price Range</h3>
                        <div className="price-range">
                            <input
                                type="range"
                                className='form-range'
                                min="0"
                                max="3000"
                                step="100"
                                value={priceRange[1]}
                                onChange={handlePriceChange}
                            />
                            <div className="price-values">
                                <span>0</span>
                                <span>{priceRange[1]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-group">
                        <h3>Sort By</h3>
                        <select className='form-select' value={sortOption} onChange={handleSortChange}>
                            <option>Best Match</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest</option>
                        </select>
                    </div>
                </div>
                <div className="products-section">
                    <div className="products-grid">
                        {currentProducts.map((product, index) => (
                            <Link to={`/our-products/${product.category.name.replace(/\s+/g, '-')}/${product.subCategory.name.replace(/\s+/g, '-')}/${product.name.replace(/\s+/g, '-')}`} key={index} className="product-card">
                                <img src={product.productImage.url} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p className="price">₹{product.variants[0].discountPrice} <span className="actual-price">₹{product.variants[0].originalPrice}</span></p>
                                <p className="discount">{product.variants[0].discountPercentage}% Off</p>
                            </Link>
                        ))}
                    </div>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => paginate(index + 1)} className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
