import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';

// Import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';

const Carasol = () => {
    const [caraImg, setImage] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);

    const handleCaraImg = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-active-banners`);
            const banners = response.data.data.reverse();
            setImage(banners);
        } catch (error) {
            console.log(error);
        }
    };

    const filterImages = () => {
        const width = window.innerWidth;
        const filtered = caraImg.filter(banner => {
            if (banner.type === 'both') {
                return true;
            } else if (banner.type === 'desktop' && width > 768) {
                return true;
            } else if (banner.type === 'mobile' && width <= 768) {
                return true;
            }
            return false;
        });
        setFilteredImages(filtered);
    };

    useEffect(() => {
        handleCaraImg();
    }, []);

    useEffect(() => {
        filterImages();
        window.addEventListener('resize', filterImages);

        return () => {
            window.removeEventListener('resize', filterImages);
        };
    }, [caraImg]);

    return (
        <>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                navigation={true}
                className="mySwiper"
            >
                {
                    filteredImages.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img src={item.bannerImage.url} alt={`carousel-image-${index}`} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
}

export default Carasol;
