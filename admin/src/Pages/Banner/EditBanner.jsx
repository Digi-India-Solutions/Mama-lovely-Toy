import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const EditBanner = () => {
  const { _id } = useParams(); // Get the banner ID from the route parameters
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [bannerData, setBannerData] = useState({
    title: '',
    type: 'both',
    status: 'active',
    bannerImage: null, // For uploading a new image
  });
  const [existingImage, setExistingImage] = useState(''); // Store the existing banner image

  // Fetch the banner details by ID
  useEffect(() => {
    const fetchBannerDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-banner-by-id/${_id}`);
        const { title, type, status, bannerImage } = response.data.data;
        
        // Populate the form with existing banner data
        setBannerData({
          title,
          type,
          status,
        });
        setExistingImage(bannerImage.url); // Set the existing image URL
      } catch (error) {
        console.error('Error fetching banner details:', error);
        toast.error('Failed to fetch banner details');
      }
    };
    
    fetchBannerDetails();
  }, [_id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input changes for image
  const handleFileChange = (e) => {
    setBannerData((prevState) => ({
      ...prevState,
      bannerImage: e.target.files[0], // Only handle the first file
    }));
  };

  // Handle form submission for updating the banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('title', bannerData.title);
    data.append('type', bannerData.type);
    data.append('status', bannerData.status);

    if (bannerData.bannerImage) {
      data.append('bannerImage', bannerData.bannerImage); // Only append if there's a new image
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-banner/${_id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      navigate('/all-banners'); // Redirect to banners list
    } catch (error) {
      console.error('Error updating banner:', error);
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
          <h4>Edit Banner</h4>
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
              value={bannerData.title}
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
              value={bannerData.type}
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
              value={bannerData.status}
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
            />
            {existingImage && (
              <div className="mt-2">
                <img src={existingImage} alt="Current Banner" style={{ width: '200px', height: 'auto' }} />
                <p>Current Image</p>
              </div>
            )}
          </div>
          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? 'Please Wait...' : 'Update Banner'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBanner;
