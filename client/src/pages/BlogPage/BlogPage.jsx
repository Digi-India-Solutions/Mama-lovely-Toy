import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogPage = () => {

    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-news`);
            setBlogs(res.data.reverse());

        } catch (error) {
            console.error('There was an error fetching the news!', error);
        }
    };


    useEffect(() => {
        fetchBlogs();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title' >Our Blogs</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Our Blogs</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row">
                        {blogs.map((blog, index) => (
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
                </div>
            </section>
        </>
    )
}

export default BlogPage