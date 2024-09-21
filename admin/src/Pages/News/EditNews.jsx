import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const EditNews = () => {
    const { id } = useParams(); // Extract news ID from URL
    const navigate = useNavigate(); // For navigation
    const [formData, setFormData] = useState({
        CreatedBy: '',
        Headline: '',
        ImageOfNews: '',
        SubHeading: '',
        DateOfNews: new Date().toISOString().split('T')[0], // Default to current date
        NewsData: ''
    });
    const [loading, setLoading] = useState(false); // Loading state for submit button
    const [imageFile, setImageFile] = useState(null); // State for the image file
    const editor = useRef(null); // Reference for Jodit editor

    // Fetch existing news data on component mount
    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-single-news/${id}`);
                setFormData(res.data); // Pre-fill form with existing data
            } catch (error) {
                console.error('Error fetching news data!', error);
                toast.error("Failed to load news data.");
            }
        };
        fetchNewsData();
    }, [id]);

    // Handle input changes for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    // Handle editor content changes for the news body
    const handleEditorChange = (newContent) => {
        setFormData((prevData) => ({
            ...prevData,
            NewsData: newContent
        }));
    };

    // Handle form submission for updating the news
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = new FormData();
        form.append('CreatedBy', formData.CreatedBy);
        form.append('Headline', formData.Headline);
        form.append('SubHeading', formData.SubHeading);
        form.append('DateOfNews', formData.DateOfNews);
        form.append('NewsData', formData.NewsData);
        if (imageFile) {
            form.append('ImageOfNews', imageFile);
        }

        try {
            // Update news data via API
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-news/${id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("News updated successfully!");
            navigate('/all-news'); // Redirect to the news list page
        } catch (error) {
            console.error('Error updating news:', error);
            toast.error("Failed to update news.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h2 className="mb-4">Edit News</h2>
            <form onSubmit={handleSubmit}>
                {/* Created By Field */}
                <div className="form-group mb-3">
                    <label htmlFor="CreatedBy">Created By</label>
                    <input
                        type="text"
                        id="CreatedBy"
                        name="CreatedBy"
                        value={formData.CreatedBy}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* News Image Field */}
                <div className="form-group mb-3">
                    <label htmlFor="ImageOfNews">News Image</label>
                    <input
                        type="file"
                        id="ImageOfNews"
                        name="ImageOfNews"
                        onChange={handleImageChange}
                        className="form-control"
                    />
                </div>

                {/* Headline Field */}
                <div className="form-group mb-3">
                    <label htmlFor="Headline">Headline</label>
                    <input
                        type="text"
                        id="Headline"
                        name="Headline"
                        value={formData.Headline}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* Sub Heading Field */}
                <div className="form-group mb-3">
                    <label htmlFor="SubHeading">Sub Heading</label>
                    <input
                        type="text"
                        id="SubHeading"
                        name="SubHeading"
                        value={formData.SubHeading}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* Date of News Field */}
                <div className="form-group mb-3">
                    <label htmlFor="DateOfNews">Date of News</label>
                    <input
                        type="date"
                        id="DateOfNews"
                        name="DateOfNews"
                        value={formData.DateOfNews}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* News Data Field */}
                <div className="form-group mb-3">
                    <label htmlFor="NewsData">News Data</label>
                    <JoditEditor
                        ref={editor}
                        value={formData.NewsData}
                        tabIndex={1}
                        onChange={handleEditorChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
};

export default EditNews;
