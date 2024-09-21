import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const { _id } = useParams(); // Get category ID from route
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
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
            file: files[0], // Set the selected file
            previewImage: URL.createObjectURL(files[0]) // Preview image
        }));
    };

    // Fetch category data to pre-fill the form
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-category-by-id/${_id}`);
        
            if (response.data && response.data.data) { // Added a check for `response.data.data`
                const { name, description, categoryImage } = response.data.data;
                setFormData({
                    name: name || '',
                    description: description || '',
                    file: null,
                    previewImage: categoryImage?.url || ''
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            toast.error('Failed to load category data');
        }
    };
    
    

    // Handle form submission for updating category
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const data = new FormData(); // Create FormData object for file uploads
        data.append("name", formData.name);
        data.append("description", formData.description);
        if (formData.file) {
            data.append("file", formData.file); // Add image if selected
        }
    
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/update-category/${_id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
    
            toast.success('Category updated successfully');
            navigate('/all-category'); // Redirect after successful update
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
    }, [_id]);

    return (
        <>
            <ToastContainer /> {/* For toast notifications */}
            <div className="bread">
                <div className="head">
                    <h4>Edit Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control"
                            id="name"
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-control"
                            id="description"
                        />
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
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn btn-primary ${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? "Please Wait..." : "Update Category"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCategory;
