import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Components/Loading/Loading';

const EditSubCategory = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        file: null, // For image upload
        previewImage: '' // For displaying selected image
    });

    // Handle input changes for text fields (name, description)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Handle file input change for image
    const handleFileChange = (e) => {
        const { files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            // file: files[0], // Set the selected file
            file: e.target.files[0],
            previewImage: URL.createObjectURL(files[0]) // Preview image
        }));
    };

    // Fetch category data to pre-fill the form
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-subcategory-by-id/${_id}`);

            if (response.data && response.data.data) { // Added a check for `response.data.data`
                const { name, description, subCategoryImage, category } = response.data.data;
                setFormData({
                    name: name || '',
                    description: description || '',
                    category: category._id,
                    file: null,
                    previewImage: subCategoryImage?.url || ''
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            toast.error('Failed to load category data');
        }
    };


    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-categories`);
            setCategories(response.data.data.reverse());
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories!');
        }
    };

    // Handle form submission for updating category
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const data = new FormData(); // Create FormData object for file uploads
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category); // Append category
        if (formData.file) {
            data.append("file", formData.file); // Add image if selected
        }
    
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/update-subcategory/${_id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log(response);
            toast.success(response.data.message);
            navigate('/all-subcategory'); // Redirect after successful update
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };
    


    // Fetch the category data when the component mounts
    useEffect(() => {
        fetchData();
        fetchCategories();
    }, [_id]);

    if (!categories) {
        return <Loading />
    }

    return (
        <>
            <ToastContainer /> {/* For toast notifications */}
            <div className="bread">
                <div className="head">
                    <h4>Edit Sub Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-subcategory" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" onChange={handleInputChange} name="name" value={formData.name} className="form-control" id="name" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" onChange={handleInputChange} name="description" value={formData.description} className="form-control" id="description" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                            id="category"
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option> {/* Fallback option */}
                            {categories && categories.map((category, id) => (
                                <option value={category._id} key={id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="file" className="form-label">Image</label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className="form-control"
                            id="file"
                        />
                        {formData.previewImage && (
                            <img
                                src={formData.previewImage}
                                alt="Preview"
                                style={{ marginTop: '10px', maxHeight: '150px', borderRadius: '8px' }}
                            />
                        )}
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Update Sub Category"}</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditSubCategory;
