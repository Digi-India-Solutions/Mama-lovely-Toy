import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay'; // Make sure to include this
import './Testimonial.css';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const testimonials = [
    {
        name: "Harsh Vardhan",
        image: "https://labmantra.com/static/media/p1.4684c8065083eb48e739.jpg",
        testimonial: "The customer service was exceptional, and the products exceeded my expectations. I highly recommend this company to anyone looking for quality."
    },
    {
        name: "Gaourav",
        image: "https://labmantra.com/static/media/p2.e79d43cdba0e4009f862.jpeg",
        testimonial: "I have been using these products for months now, and I must say they are top-notch. The durability and design are just perfect!"
    },
    {
        name: "Ashish",
        image: "https://labmantra.com/static/media/p1.4684c8065083eb48e739.jpg",
        testimonial: "Fantastic quality and creativity in the products. My kids absolutely love them, and they are very safe to use."
    },
    {
        name: "Naman",
        image: "https://labmantra.com/static/media/p2.e79d43cdba0e4009f862.jpeg",
        testimonial: "The delivery was fast, and the packaging was excellent. The products themselves are wonderful, and I will definitely be a returning customer."
    },
    {
        name: "Karan Sehmbi",
        image: "https://labmantra.com/static/media/p1.4684c8065083eb48e739.jpg",
        testimonial: "These products have made a significant difference in my daily routine. The quality is outstanding, and the customer support is very responsive."
    },
    {
        name: "Deepak Kumar",
        image: "https://labmantra.com/static/media/p2.e79d43cdba0e4009f862.jpeg",
        testimonial: "I bought several items, and all of them were excellent. The attention to detail and the craftsmanship are evident in each product."
    },
    {
        name: "Anish Solanki",
        image: "https://labmantra.com/static/media/p1.4684c8065083eb48e739.jpg",
        testimonial: "Amazing products! They are very well made and have quickly become a favorite in our household. Highly recommended!"
    }
];

const Testimonial = () => {
    return (
        <>
            <section className="testimonial-container">
                <div className="container">
                    <div className="row head">
                        <div className="col-md-12 text-center">
                            <h2>Our Happy Customers</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="testimonial-section">
                                <Swiper
                                 modules={[Pagination, Navigation]}
                                    spaceBetween={30}
                                    centeredSlides={false}
                                    autoplay={{ delay: 1000, disableOnInteraction: false }}
                                    pagination={{ clickable: true }}
                                    navigation={true}
                                    loop={true}
                                    slidesPerView={1}
                                    breakpoints={{
                                        768: {
                                            slidesPerView: 2,
                                        }
                                    }}
                                    className="mySwiper"
                                >
                                    {testimonials.map((testimonial, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="testimonial">
                                                <p className="testimonial-text">“{testimonial.testimonial}”</p>
                                                <div className="testimonial-profile">
                                                    <img src={testimonial.image} alt={testimonial.name} />
                                                    <div>
                                                        <h4 className="testimonial-name">{testimonial.name}</h4>
                                                        <p className="testimonial-role">Customer</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Testimonial;
