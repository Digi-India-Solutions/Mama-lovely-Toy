// cartUtils.js
export const getCartItems = () => {
    const cart = localStorage.getItem('MamaLovelyCart');
    return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product, quantity, variant) => {
    const cartItems = getCartItems();

    // Extract only necessary fields from product, category, and subcategory
    const cartProduct = {
        name: product.name,
        _id: product._id,  // Use only the product's ID
        productImage: product.productImage.url,  // Include image if needed
        category: {
            name: product.category.name,  // Only store category name
            _id: product.category._id     // Store category ID
        },
        subCategory: {
            name: product.subCategory.name,  // Only store subcategory name
            _id: product.subCategory._id     // Store subcategory ID
        }
    };

    // Find if the product with the selected variant is already in the cart
    const existingItemIndex = cartItems.findIndex(
        (item) =>
            item.product._id === cartProduct._id &&
            item.variant.color === variant.color &&
            item.variant.size === variant.size
    );

    if (existingItemIndex !== -1) {
        // Update the quantity if the product and variant are already in the cart
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Add the new product to the cart
        const cartItem = {
            product: cartProduct,  // Use the simplified product object
            quantity,
            variant
        };
        cartItems.push(cartItem);
    }

    localStorage.setItem('MamaLovelyCart', JSON.stringify(cartItems));

       // Dispatch a custom event after updating the cart
       window.dispatchEvent(new Event('cart-updated'));
};


export const getCartTotalItems = () => {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
};
