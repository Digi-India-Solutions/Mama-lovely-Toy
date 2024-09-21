import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddBanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'both', // Default value as per backend schema
    status: 'active', // Default value as per backend schema
    bannerImage: null,
  });

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0], // Get the first file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    data.append('status', formData.status);
    data.append('bannerImage', formData.bannerImage);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-banner`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      navigate('/all-banners'); // Redirect to banner list page
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
          <h4>Add Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-banners" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>
      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="title" className="form-label"> Title </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
              id="title"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="type" className="form-label"> Type </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-control"
              id="type"
              required
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="status" className="form-label"> Status </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-control"
              id="status"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="bannerImage" className="form-label"> Image </label>
            <input
              type="file"
              name="bannerImage"
              onChange={handleFileChange}
              className="form-control"
              id="bannerImage"
              required
            />
          </div>
          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? 'Please Wait...' : 'Add Banner'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBanner;
