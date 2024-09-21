import React, { useEffect } from 'react'

import MostLovingProduct from '../../components/ProductSection/MostLovingProduct'
// import { Link } from 'react-router-dom';

import './Home.css'
import Carasol from '../../components/Carasol/Carasol';
import Testimonial from '../../components/Testimonial/Testimonial';
import Blog from '../../components/Blog/Blog';
import HomeCategory from './HomeCategory';
import HomeSubCategory from './HomeSubCategory';

const Home = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, []);





  return (
    <>
      <Carasol />
      <HomeCategory/>
      <HomeSubCategory/>
      
      <MostLovingProduct />

      {/* <section className='banners py-5' >
        <div className="container">
          <div className="row">
            <div className="col-12 mb-4">
              <Link to={`/shop`} >
                <img src="https://toyzone.in/cdn/shop/files/premium-range.jpg?v=1671702631" alt="" />
              </Link>
            </div>
            <div className="col-md-6 mb-2"><Link to={`/shop`} ><img src="https://toyzone.in/cdn/shop/files/best-sellers.jpg?v=1671707575" alt="" /></Link></div>
            <div className="col-md-6 mb-2"><Link to={`/shop`} ><img src="https://toyzone.in/cdn/shop/files/new-launch.jpg?v=1671707567" alt="" /></Link></div>
          </div>
        </div>
      </section> */}

      <Testimonial />
      <Blog />
    </>
  )
}

export default Home