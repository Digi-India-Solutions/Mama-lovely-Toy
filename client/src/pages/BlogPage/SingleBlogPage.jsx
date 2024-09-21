import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import './SingleBlogPage.css'

const SingleBlogPage = () => {
    const { name } = useParams();

    const formattedName = name.replace(/-/g, ' ');

    const [blogs, setBlogs] = useState([]);
    const [singleBlog, setSingleBlog] = useState(null);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-news`);
            setBlogs(res.data.reverse());
        } catch (error) {
            console.error('There was an error fetching the news!', error);
        }
    };

    const fetchSingleBlog = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-blog-by-name/${formattedName}`);
            setSingleBlog(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the blog!', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchSingleBlog();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [name]);

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title'>{formattedName}</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/blogs">Our Blogs</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{formattedName}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="blog-content">
                <div className="container">
                    <div className="row">
                        {/* Single Blog Section - 70% of the page */}
                        <div className="col-md-9">
                            {singleBlog ? (
                                <div className="single-blog">
                                    <img src={singleBlog.ImageOfNews?.url} alt={singleBlog.Headline} className="img-fluid blog-image mb-4" />
                                    <h2 className="blog-title">{singleBlog.Headline}</h2>
                                    <h3>{singleBlog.SubHeading}</h3>
                                    <h5 className="blog-author" > By, {singleBlog.CreatedBy}</h5>
                                    <p className="blog-date"> {moment(singleBlog.DateOfNews).format('MMMM Do, YYYY')}</p>
                                    <div className="blog-body" dangerouslySetInnerHTML={{ __html: singleBlog.NewsData }}></div>
                                </div>
                            ) : (
                                <p>Loading blog details...</p>
                            )}
                        </div>

                        {/* Blogs Sidebar Section - 30% of the page */}
                        <div className="col-md-3">
                            <div className="blog-sidebar mb-5">
                                <h3 className="sidebar-title">Other Blogs</h3>
                                {blogs.length > 0 ? (
                                    <ul className="list-unstyled sidebar-blogs">
                                        {blogs.slice(0, 4).map(blog => (
                                            <li key={blog._id} className="mb-3">
                                                <Link to={`/blog/${blog.Headline.replace(/ /g, '-')}`} className="d-flex blog-item">
                                                    <img src={blog.ImageOfNews?.url} alt={blog.Headline} className="img-thumbnail blog-thumbnail me-3" />
                                                    <div>
                                                        <h5 className="blog-item-title">{blog.Headline}</h5>
                                                        <p className="blog-item-date">{moment(blog.DateOfNews).format('MMMM Do, YYYY')}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No blogs available.</p>
                                )}
                                <div className="col text-center">
                                    <Link to="/blogs" className="text-center m-auto view-more-container mt-3 ">
                                        <button className="viewMoreBtn py-2" >
                                            View All
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Follow Us Section */}
                            <section className="follow-us">
                                <h3 className="sidebar-title text-start">Follow Us</h3>
                                <div className="social-links">
                                    <a href="https://facebook.com" className="btn btn-outline-primary me-2" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-facebook-f"></i> Facebook
                                    </a>
                                    <a href="https://twitter.com" className="btn btn-outline-info me-2" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-twitter"></i> Twitter
                                    </a>
                                    <a href="https://instagram.com" className="btn btn-outline-danger me-2" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-instagram"></i> Instagram
                                    </a>
                                    <a href="https://linkedin.com" className="btn btn-outline-secondary" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-linkedin"></i> LinkedIn
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SingleBlogPage;
