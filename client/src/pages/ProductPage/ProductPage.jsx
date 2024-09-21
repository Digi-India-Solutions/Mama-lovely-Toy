import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css'; // Ensure to include your updated CSS

import { addToCart, getCartTotalItems } from '../CartPage/cartUtils'; // Adjust the path as needed


const ProductPage = () => {
    const { category, subCategory, productName } = useParams();

    // Replace dashes with spaces
    const formattedCategory = category.replace(/-/g, ' ');
    const formattedSubCategory = subCategory.replace(/-/g, ' ');
    const formattedProductName = productName.replace(/-/g, ' ');
    const [relatedProducts, setRelatedProducts] = useState(null);

    const [productDetails, setProductDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate()

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-product-by-name/${formattedProductName}`);
            const product = response.data.data;
            setProductDetails(product);

            if (product.variants && product.variants.length > 0) {
                const defaultVariant = product.variants[0];
                setSelectedVariant({
                    color: defaultVariant.color.name || '',
                    size: defaultVariant.size.name || '',
                    price: defaultVariant.discountPrice,
                    mrp: defaultVariant.originalPrice,
                    dimension: defaultVariant.dimension || 'N/A',
                    weight: defaultVariant.weight || 'N/A'
                });
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-product-by-category-and-subcategory/${formattedCategory}/${formattedSubCategory}`);
            console.log(res.data.data);
            setRelatedProducts(res.data.data.reverse())

        } catch (error) {
            console.error("Error While Fetching Related Products : ", error);
        }
    }
    useEffect(() => {
        fetchProductDetails();
        fetchRelatedProducts();
    }, [category, subCategory, productName]);

    const handleQuantityChange = (event) => {
        setQuantity(Number(event.target.value));
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleVariantChange = (key, value) => {
        const updatedVariant = productDetails.variants.find(variant => variant[key] && variant[key].name === value);
        if (updatedVariant) {
            setSelectedVariant({
                color: updatedVariant.color.name || '',
                size: updatedVariant.size.name || '',
                price: updatedVariant.discountPrice,
                mrp: updatedVariant.originalPrice,
                dimension: updatedVariant.dimension || 'N/A',
                weight: updatedVariant.weight || 'N/A'
            });
        }
    };

    const handleAddToCart = () => {
        // Add the current product, selected variant, and quantity to the cart
        addToCart(productDetails, quantity, selectedVariant);

        // Optionally, update the cart icon or any other cart-related state
        setShowPopup(true);
    };


    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleProceedToCheck = () => {
        setShowPopup(false);
        navigate(`/cart`)
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    if (!productDetails) {
        return <p>Loading product details...</p>;
    }

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title' >{productDetails.name}</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/our-products">Our Products</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{productDetails.name}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="product-page">
                <div className="container">
                    <div className="product-details">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="product-photo">
                                    <img src={productDetails.productImage.url} alt={productDetails.name} />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="product-info">
                                    <h2>{productDetails.name}</h2>
                                    <p className="product-description">{productDetails.description}</p>

                                    {/* Variant Selector */}
                                    {productDetails.variants && productDetails.variants.length > 0 && (
                                        <div className="variant-selector">
                                            {/* <h4>Choose your Options:</h4> */}

                                            {/* Color Selector */}
                                            <div className="variant-option color-selector">
                                                <label>Color:</label>
                                                <div className="color-options">
                                                    {productDetails.variants.map((variant, index) => (
                                                        variant.color && (
                                                            <div
                                                                key={index}
                                                                className={`color-circle ${selectedVariant.color === variant.color.name ? 'selected' : ''}`}
                                                                style={{ backgroundColor: variant.color.hexCode }}
                                                                onClick={() => handleVariantChange('color', variant.color.name)}
                                                                title={variant.color.name}
                                                            />
                                                        )
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Size Selector */}
                                            <div className="variant-option size-selector">
                                                <label>Size:</label>
                                                <div className="size-options">
                                                    {productDetails.variants.map((variant, index) => (
                                                        variant.size && (
                                                            <div
                                                                key={index}
                                                                className={`size-box ${selectedVariant.size === variant.size.name ? 'selected' : ''}`}
                                                                onClick={() => handleVariantChange('size', variant.size.name)}
                                                            >
                                                                {variant.size.name}
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="product-pricing">
                                        <p className="mrp">
                                            MRP: ₹{selectedVariant.mrp}
                                            <span>₹{selectedVariant.price}</span>
                                        </p>
                                    </div>
                                    <div className="quantity-selector">
                                        <button className="quantity-btn" onClick={handleDecrement}>-</button>
                                        <input
                                            id="quantity"
                                            type="number"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            min="1"
                                        />
                                        <button className="quantity-btn" onClick={handleIncrement}>+</button>
                                    </div>
                                    <div className="product-specs">
                                        <p><strong>Dimension:</strong> {selectedVariant.dimension}</p>
                                        <p><strong>Weight:</strong> {selectedVariant.weight}</p>
                                    </div>

                                    <div className="product-actions">
                                        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                                        <button className="buy-now-btn">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row related-products">
                            <h2 className='h2'>Product Description</h2>
                            <div className="col-md-12">
                                <div className="product-detail-description" dangerouslySetInnerHTML={{ __html: productDetails.detailDescription }} />
                            </div>
                        </div>
                    </div>


                    {/* Related Products */}
                    <div className="related-products">
                        <h2>Related Products</h2>
                        <div className="grid-5 product-section">
                            {relatedProducts && relatedProducts.map((product, index) => (
                                <Link to={`/our-products/${product.category.name.replace(/\s+/g, '-')}/${product.subCategory.name.replace(/\s+/g, '-')}/${product.name.replace(/\s+/g, '-')}`} className="sin-product" key={index}>
                                    <div className="img">
                                        <img src={product.productImage.url} alt={product.name} />
                                        <div className="absolute-items">
                                            <div className="offPercent">{product.variants[0].discountPercentage}% Off</div>
                                        </div>
                                    </div>
                                    <div className="product-desc">
                                        <div className="product-name">{product.name}</div>
                                        <div className="acctual-price">₹{product.variants[0].discountPrice}</div>
                                        <div className="off-price">₹{product.variants[0].originalPrice}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Popup for add to cart */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="popup-close" onClick={handleClosePopup}>×</button>
                        <div className="popup-header">
                            <img src={productDetails.productImage.url} alt={productDetails.name} className="product-image" />
                            <h2>{productDetails.name}</h2>
                        </div>
                        <div className="popup-body">
                            <p><strong>Variant :</strong> {selectedVariant.color} - {selectedVariant.size}</p>
                            <p><strong>Quantity :</strong> {quantity}</p>
                            <p><strong>Price :</strong> ₹{selectedVariant.price} </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart-btn" onClick={handleClosePopup}>Add More Products</button>
                            <button className="buy-now-btn" onClick={handleProceedToCheck}>Proceed to Checkout</button>
                        </div>
                    </div>
                </div>


            )}
        </>
    );
};

export default ProductPage;
