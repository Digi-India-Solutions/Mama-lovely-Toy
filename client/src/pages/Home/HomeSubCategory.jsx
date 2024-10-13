import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import './HomeSubCategory.css';

const HomeSubCategory = () => {
    const [subCategories, setSubCategories] = useState([]);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-subcategories`);
            setSubCategories(response.data.data.reverse());
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSubCategories();
    }, []);

    return (
        <section className='my-5 category'>
            <div className="container">
                {/* <div className="header-container">
                    <h2 className="header-title">Explore Our Diverse Options</h2>
                    <p className="header-subtitle">Discover a variety of options tailored just for you</p>
                </div> */}

                <div className="swiper-container">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={3}
                        loop={true}
                        navigation={true}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1440: { slidesPerView: 4 },
                        }}
                    >
                        {subCategories && subCategories.map((subCategory) => (
                            <SwiperSlide key={subCategory._id}>
                                <Link
                                    to={subCategory.category && subCategory.category.name
                                        ? `/our-products/${subCategory.category.name.replace(/\s+/g, '-')}/${subCategory.name.replace(/\s+/g, '-')}`
                                        : '#'}
                                    className="single-category"
                                    style={{ backgroundImage: `url(${subCategory.subCategoryImage.url})` }}
                                >
                                    {/* <div className="content">
                                        <h3>{subCategory.name}</h3>
                                    </div> */}
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* <div className="text-center mt-4">
                    <div className="view-more-container">
                        <Link to="/our-category" className="viewMoreBtn">
                            View All Categories
                        </Link>
                    </div>
                </div> */}
            </div>
        </section>
    );
};

export default HomeSubCategory;
