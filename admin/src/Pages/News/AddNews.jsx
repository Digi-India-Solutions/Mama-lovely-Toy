import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        CreatedBy: '',
        Headline: '',
        SubHeading: '',
        DateOfNews: new Date().toISOString().split('T')[0],
        NewsData: ''
    });
    const [ImageOfNews, setImageOfNews] = useState(null); // Separate state for image
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setImageOfNews(e.target.files[0]); // Handle image file selection
    };

    const handleEditorChange = (newContent) => {
        setFormData((prevData) => ({
            ...prevData,
            NewsData: newContent
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData(); // Create FormData object to handle files
        data.append('CreatedBy', formData.CreatedBy);
        data.append('Headline', formData.Headline);
        data.append('SubHeading', formData.SubHeading);
        data.append('DateOfNews', formData.DateOfNews);
        data.append('NewsData', formData.NewsData);
        data.append('ImageOfNews', ImageOfNews); // Append image file

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-news`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for file uploads
                },
            });
            console.log(res.data);
            toast.success("News added successfully!");
            navigate("/all-news")
            setFormData({
                CreatedBy: '',
                Headline: '',
                SubHeading: '',
                DateOfNews: new Date().toISOString().split('T')[0],
                NewsData: ''
            });
            setImageOfNews(null); // Clear image input
        } catch (error) {
            console.error('Error adding news:', error);
            toast.error("Failed to add news.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <ToastContainer />
            <h2 className="mb-4">Add News</h2>
            <form onSubmit={handleSubmit}>
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
                <div className="form-group mb-3">
                    <label htmlFor="ImageOfNews">News Image</label>
                    <input
                        type="file"
                        id="ImageOfNews"
                        name="ImageOfNews"
                        onChange={handleImageChange} // Image upload handler
                        className="form-control"
                        accept="image/*"
                        required
                    />
                </div>
                <div className="row">
                    <div className="col-md-6">
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
                    </div>
                    <div className="col-md-6">
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
                    </div>
                </div>
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
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddNews;
