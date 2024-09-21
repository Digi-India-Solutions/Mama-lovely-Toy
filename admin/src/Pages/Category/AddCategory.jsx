import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddCategory = () => {

    const [isLoading, setIsloding] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryImage: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    const getfiledata = (e) => {
        const { name, files } = e.target
        setFormData(prevState => ({ ...prevState, [name]: files[0] }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloding(true);

        const data = new FormData();
        data.append("name", formData.name)
        data.append("description", formData.description)
        data.append("categoryImage", formData.categoryImage)

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-category`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response);
            toast.success(response.data.message);
            navigate('/all-category');
        } catch (error) {
            console.error('There was an error!', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsloding(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>
            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label"> Name</label>
                        <input type="text" onChange={handleInputChange} name="name" value={formData.name} className="form-control" id="name" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="description" className="form-label"> Description</label>
                        <input type="text" onChange={handleInputChange} name="description" value={formData.description} className="form-control" id="description" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="categoryImage" className="form-label"> Image</label>
                        <input type="file" onChange={getfiledata} name="categoryImage" className="form-control" id="categoryImage" required />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`} >{isLoading ? "Please Wait..." : "Add Category"}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddCategory