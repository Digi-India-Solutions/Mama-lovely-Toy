import React, { useState, useEffect } from 'react';
import './SupportPage.css';
import { Link } from 'react-router-dom';
import left from './side.jpg';
import axios from 'axios';

const SupportPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email_id: '',
        address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/apply-enquiry`, formData);
            if (response.data.success) {
                setSubmitStatus('Inquiry sent successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email_id: '',
                    address: ''
                });
            } else {
                setSubmitStatus('Failed to send inquiry.');
            }
        } catch (error) {
            console.error("Error sending inquiry:", error);
            setSubmitStatus('Internal server error.');
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title'>Contact Us</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className='contact-section'>
                <div className="contact-container container py-5">
                    <div className="first">
                        <div className="left">
                            <img src={left} alt="Contact Us" />
                        </div>
                        <div className="right">
                            <h2>Contact Us</h2>
                            <p>We love hearing from our customers. If you have a question please get in touch and speak to one of our consultants.</p>
                            <p><span>Tel: </span>+91 123 456 7890</p>
                            <p><span>Email: </span>info@mamalovelytoy.com</p>
                            <p><span>Address: </span>123 Lovely Street, Delhi, India</p>
                        </div>
                    </div>
                    <div className="second">
                        <form onSubmit={handleSubmit} className='mt-5'>
                            <div className="same-field">
                                <div className="left">
                                    <label htmlFor="firstName">First Name*</label>
                                    <input
                                        type="text"
                                        name='firstName'
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="right">
                                    <label htmlFor="lastName">Last Name*</label>
                                    <input
                                        type="text"
                                        name='lastName'
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="same-field">
                                <div className="left">
                                    <label htmlFor="email_id">Email*</label>
                                    <input
                                        type="email"
                                        name='email_id'
                                        id="email_id"
                                        value={formData.email_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="right">
                                    <label htmlFor="phoneNumber">Phone Number*</label>
                                    <input
                                        type="text"
                                        name='phoneNumber'
                                        id="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="same-field formessage">
                                <label htmlFor="address">Address*</label>
                                <textarea
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type='submit'
                                className='sendbtn'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Submit'}
                            </button>
                            {submitStatus &&
                                <div class="alert alert-success same-field text-center" role="alert">
                                    {submitStatus}
                                </div>}
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SupportPage;
