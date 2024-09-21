import React from 'react';
import './Blog.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-news`);
            // console.log(res.data.reverse());
            setBlogs(res.data.reverse());
            
        } catch (error) {
            console.error('There was an error fetching the news!', error);
        }
    };
    useEffect(()=>{
        fetchBlogs();
    },[])

    return (
        <section className="blog-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h2 className="section-title">Our Latest Blogs</h2>
                    </div>
                </div>
                <div className="row">
                    {blogs.slice(0, 3).map((blog, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="blog-card">
                                <img src={blog.ImageOfNews.url} alt={blog.Headline} className="blog-image" />
                                <div className="blog-content">
                                    <h3 className="blog-title">{blog.Headline}</h3>
                                    <p className="blog-summary">{blog.SubHeading}</p>
                                    <div className="blog-meta">
                                        <span className="blog-author">{blog.CreatedBy}</span> | <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <Link to={`/blogs/${blog.Headline.replace(/\s+/g, '-')}`} className="read-more-btn">Read More</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {blogs && blogs.length > 3 && (
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <Link to={`/blogs`} className="view-all-btn">View All Blogs</Link>
                        </div>
                    </div>

                )}
            </div>
        </section>
    );
};

export default Blog;
