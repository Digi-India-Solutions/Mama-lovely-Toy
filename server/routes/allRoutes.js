const express = require('express');
const upload = require("../middlewares/Multer")
const route = express.Router();
const { register, PasswordChangeRequest, ResendOtp, verifyOtpForSignIn, ResendSignOtp, VerifyOtp, LoginAdmin, LoginUser, getAllUsers } = require('../controllers/UserController');
const { getAllVouchers, applyVoucher, createVoucher, activateVoucher, deactivateVoucher, deleteVoucher } = require('../controllers/VoucherController');
const { createNews, DeleteNews, getAllNews, getSingleNews, UpdateNews, getBlogByName } = require('../controllers/BlogController');
const { createEnquiryForm, getAllEnquiryForm, deleteEnquiryById } = require('../controllers/ContactController');
const { createColor, getAllColors, getColorById, updateColor, deleteColor } = require('../controllers/ColorController');
const { createSize, getAllSizes, getSizeById, updateSize, deleteSize } = require('../controllers/SizeController');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, getCategoryByName } = require('../controllers/CategoryController');
const { createSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory, getSubCategoryByName, getSubCategoryByCategoryName } = require('../controllers/SubCategoryController');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductByName, getProductByCategoryAndSubCategory } = require('../controllers/ProductController');
const { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner, getActiveBanners } = require('../controllers/BannerController');
const { createOrder, getAllOrder, getOrderById, deleteOrder, updateOrderDeliveryStatus, getOrdersByUserId } = require('../controllers/OrderController');





// ====== Authentication =====
route.post("/register", register) // create Account

route.post('/Password-change-request', PasswordChangeRequest);
route.post('/Resend-Otp', ResendOtp);
route.post('/Verify-sign-Otp', verifyOtpForSignIn);
route.post('/resend-sign-Otp', ResendSignOtp);
route.post('/Verify-Otp/:email', VerifyOtp)

route.post("/login", LoginUser);
route.post("/admin-login", LoginAdmin);
route.get("/all-users", getAllUsers);


// ====== Colors === 
route.post('/create-color', createColor);
route.get('/get-all-colors', getAllColors);
route.get('/get-color-by-id/:id', getColorById);
route.put('/update-color/:id', updateColor);
route.delete('/delete-color/:id', deleteColor);

// ====== Size ======= 
route.post('/create-size', createSize);
route.get('/get-all-size', getAllSizes);
route.get('/get-size-by-id/:id', getSizeById);
route.put('/update-size/:id', updateSize);
route.delete('/delete-size/:id', deleteSize);

// ======= Category === 
route.post('/create-category' , upload.single('categoryImage'), createCategory);
route.get('/get-all-categories', getAllCategories);
route.get('/get-category-by-id/:_id', getCategoryById);
route.get('/get-category-by-name/:name', getCategoryByName);
route.put('/update-category/:_id',upload.single('file'), updateCategory);
route.delete('/delete-category/:id',upload.single('categoryImage'), deleteCategory);

// ======= Sub Category === 
route.get('/get-subcategory-by-category-name/:categoryName', getSubCategoryByCategoryName);
route.post('/create-subcategory', upload.single('subCategoryImage'), createSubCategory);
route.get('/get-all-subcategories', getAllSubCategories);
route.get('/get-subcategory-by-id/:id', getSubCategoryById);
route.get('/get-subcategory-by-name/:name', getSubCategoryByName);
route.put('/update-subcategory/:id',upload.single('file'), updateSubCategory);
route.delete('/delete-subcategory/:id',upload.single('subCategoryImage'), deleteSubCategory);

// ======= Product === 
route.post('/create-product', upload.single('productImage'), createProduct);
route.get('/get-all-products', getAllProducts);
route.get('/get-product-by-id/:id', getProductById);
route.get('/get-product-by-category-and-subcategory/:categoryName/:subCategoryName', getProductByCategoryAndSubCategory);
route.get('/get-product-by-name/:name', getProductByName);
route.put('/update-product/:id', upload.single('productImage'), updateProduct);
route.delete('/delete-product/:id', deleteProduct);

// === Banner =====
route.post('/create-banner', upload.single('bannerImage'), createBanner);
route.get('/get-all-banners', getAllBanners);
route.get('/get-banner-by-id/:id', getBannerById);
route.get('/get-active-banners', getActiveBanners);
route.put('/update-banner/:id', upload.single('bannerImage'), updateBanner);
route.delete('/delete-banner/:id', deleteBanner);

//  ======VOUCHERS     =//
route.get('/vouchers', getAllVouchers)
route.post('/apply-vouchers', applyVoucher)
route.post('/vouchers/create-vouchers', createVoucher)
route.put('/vouchers/activateVoucher/:id', activateVoucher)
route.put('/vouchers/deactivateVoucher/:id', deactivateVoucher)
route.delete('/vouchers/deleteVoucher/:id', deleteVoucher)


// Blogs 
route.post('/create-news', upload.single('ImageOfNews'), createNews); // Handle image upload for news creation
route.delete('/delete-news/:id', DeleteNews);
route.get('/get-all-news', getAllNews);
route.get('/get-single-news/:id', getSingleNews);
route.get('/get-blog-by-name/:name', getBlogByName);
route.put('/update-news/:id', upload.single('ImageOfNews'), UpdateNews); // Handle image upload for news update


// Enquiry Form 
route.post('/apply-enquiry',createEnquiryForm)
route.get('/get-all-enquiry',getAllEnquiryForm)
route.delete('/delete-enquiry/:id',deleteEnquiryById)



// order Router 

route.post("/create-order" ,createOrder)
route.get("/get-all-orders" ,getAllOrder)
route.get('/get-order-by-id/:id', getOrderById);
route.delete('/delete-order/:id', deleteOrder);
route.put('/update-order-status/:orderId', updateOrderDeliveryStatus);
route.get('/get-orders-by-user/:userId', getOrdersByUserId);


module.exports = route;