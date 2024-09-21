import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';
import JoditEditor from 'jodit-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    detailDescription: '',
    category: '',
    subCategory: '',
    variants: [{ size: '', color: '', weight: '', stock: '', originalPrice: '', discountPrice: '', discountPercentage: '' }],
    productImage: null,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchColors();
    fetchSizes();
  }, []);

  useEffect(() => {
    // Filter subcategories based on selected category
    if (selectedCategory) {
      setFilteredSubCategories(subCategories.filter(subCategory => subCategory.category._id === selectedCategory));
    } else {
      setFilteredSubCategories([]);
    }
  }, [selectedCategory, subCategories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-categories`);
      setCategories(response.data.data.reverse());
    } catch (error) {
      toast.error('Failed to fetch categories!');
    }
  };


  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-subcategories`);
      setSubCategories(response.data.data.reverse());
    } catch (error) {
      toast.error('Failed to fetch subcategories!');
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-colors`);
      setColors(response.data.data.reverse());
    } catch (error) {
      toast.error('Failed to fetch colors!');
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-size`);
      setSizes(response.data.reverse());
    } catch (error) {
      toast.error('Failed to fetch sizes!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, productImage: e.target.files[0] });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
    setProductData({
      ...productData,
      category: value,
      subCategory: ''  // Reset subCategory when category changes
    });
  };

  const handleAddVariant = () => {
    setProductData({
      ...productData,
      variants: [...productData.variants, { size: '', color: '', weight: '', stock: '', originalPrice: '', discountPrice: '', discountPercentage: '' }]
    });
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = productData.variants.map((variant, i) =>
      i === index ? { ...variant, [name]: value } : variant
    );

    if (name === 'originalPrice' || name === 'discountPercentage') {
      const variant = updatedVariants[index];
      const discountPrice = (variant.originalPrice - (variant.originalPrice * variant.discountPercentage / 100)).toFixed(2);
      updatedVariants[index] = { ...variant, discountPrice };
    }

    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.category || productData.variants.some(v => !v.size || !v.originalPrice)) {
      toast.error('Please fill out all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('detailDescription', productData.detailDescription);
    formData.append('category', productData.category);
    formData.append('subCategory', productData.subCategory);
    formData.append('variants', JSON.stringify(productData.variants));
    formData.append('productImage', productData.productImage);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-product`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Product added successfully');
        navigate('/all-products');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  if (!categories || !subCategories || !colors || !sizes) {
    return <Loading />
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />

      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
          <div className="col-md-4">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-4">
            <label>Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleCategoryChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label>SubCategory</label>
            <select
              name="subCategory"
              value={productData.subCategory}
              onChange={handleChange}
              className="form-control"
              disabled={!selectedCategory} // Disable if no category is selected
            >
              <option value="">Select SubCategory</option>
              {filteredSubCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <label>Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-12">
            <label>Detailed Description</label>
            <JoditEditor
              value={productData.detailDescription}
              onChange={(newContent) => setProductData({ ...productData, detailDescription: newContent })}
            />
          </div>

          {productData.variants.map((variant, index) => (
            <div className="row g-3" key={index}>
              <div className="col-md-2 col-6">
                <label>Size</label>
                <select
                  name="size"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="form-control"
                >
                  <option value="">Select Size</option>
                  {sizes.map((size) => (
                    <option key={size._id} value={size._id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 col-6">
                <label>Color</label>
                <select
                  name="color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="form-control"
                >
                  <option value="">Select Color</option>
                  {colors.map((color) => (
                    <option key={color._id} value={color._id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={variant.weight}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="form-control"
                />
              </div>

              <div className="col-md-2">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="form-control"
                />
              </div>

              <div className="col-md-2">
                <label>Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={variant.originalPrice}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-2">
                <label>Discount Percentage</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={variant.discountPercentage}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="form-control"
                />
              </div>

              <div className="col-md-2">
                <label>Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={variant.discountPrice}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>
          ))}

          <div className="col-md-12">
            <button type="button" onClick={handleAddVariant} className="btn btn-primary">
              Add Variant
            </button>
          </div>

          <div className="col-md-6">
            <label>Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>

          <div className="col-md-12">
            <button type="submit" className="btn btn-success">Add Product</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
