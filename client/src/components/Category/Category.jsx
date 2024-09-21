import React from 'react'

import pic2 from '../../Assets/Picture2.png';
import pic3 from '../../Assets/Picture3.png';
import pic4 from '../../Assets/Picture4.jpg';
import pic5 from '../../Assets/Picture5.png';
import pic6 from '../../Assets/Picture6.jpg';
import pic7 from '../../Assets/Picture7.png';
import pic8 from '../../Assets/Picture8.png';
import pic9 from '../../Assets/Picture9.jpg';
import pic10 from '../../Assets/Picture10.jpg';
import pic11 from '../../Assets/Picture11.png';
import pic12 from '../../Assets/Picture12.png';

import bn1 from '../../Assets/bn1.png';
import bn2 from '../../Assets/bn2.png';
import bn3 from '../../Assets/bn3.png';
import bn4 from '../../Assets/bn4.png';

import './Category.css'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';


const Category = () => {
    const categories = [
        {
            id: 1,
            categoryName: "Baby Toys",
            imageUrl: bn1
        },
        {
            id: 2,
            categoryName: "Teddy Bear",
            imageUrl: bn2
        },
        {
            id: 3,
            categoryName: "Carry Cot",
            imageUrl: bn3
        },
        {
            id: 4,
            categoryName: "Riders",
            imageUrl: bn4
        },
        {
            id: 5,
            categoryName: "Baby Cars",
            imageUrl: bn3
        },
        {
            id: 1,
            categoryName: "Baby Toys",
            imageUrl: bn1
        },
        {
            id: 2,
            categoryName: "Teddy Bear",
            imageUrl: bn2
        },
        {
            id: 3,
            categoryName: "Carry Cot",
            imageUrl: bn3
        },
    ];
    return (
        <>
            <section className='my-5 category'>
                <div className="container">
                    <div className="row head">
                        <div className="col-md-12 text-center">
                            <h2>Need a certain toy?</h2>
                        </div>
                    </div>
                    <div className="row">
                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            spaceBetween={30}
                            slidesPerView={3}
                            loop={true}
                            navigation={true}
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                0: { slidesPerView: 2 },
                                428: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                        >
                            {categories && categories.map((category, index) => (
                                <SwiperSlide key={index}>
                                    <Link to={`/category/products`} className="single-category" style={{ backgroundImage: `url(${category.imageUrl})` }}>
                                        <div className="content">
                                            <h3>{category.categoryName}</h3>
                                            {/* <button>Shop Now</button> */}
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="col-12 text-center">
                        <div className="view-more-container">
                            <Link to="/our-category" className="viewMoreBtn">
                                Our All Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Category