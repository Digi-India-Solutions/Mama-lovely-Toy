import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddSubCategory = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subCategoryImage: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const getFileData = (e) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            console.log('File selected:', files[0]);
            setFormData(prevState => ({ ...prevState, [name]: files[0] }));
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

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all fields are filled in before proceeding
        if (!formData.name || !formData.category || !formData.subCategoryImage) {
            toast.error('Please fill in all required fields and upload an image.');
            return;
        }

        setIsLoading(true);

        console.log("my data",formData);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("subCategoryImage", formData.subCategoryImage);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/create-subcategory`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toast.success(response.data.message);
            navigate('/all-subcategory');
        } catch (error) {
            console.error('There was an error!', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Sub Category</h4>
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
                        <select id="category" className="form-select" name="category" value={formData.category} onChange={handleInputChange} required>
                            <option value="">Select Category</option>
                            {categories && categories.map((category, id) => (
                                <option value={category._id} key={id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="subCategoryImage" className="form-label">Image</label>
                        <input type="file" onChange={getFileData} name="subCategoryImage" className="form-control" id="subCategoryImage" required />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Sub Category"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddSubCategory;
