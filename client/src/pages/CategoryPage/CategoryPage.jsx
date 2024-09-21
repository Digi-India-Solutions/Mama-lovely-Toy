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
import { Link } from 'react-router-dom';

const CategoryPage = () => {
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
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title' >Our Category</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Our Categories</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className='my-5 category' >
                <div className="container">
                    <div className="row">
                        <div className="grid-3">
                            {categories && categories.map((category, index) => (
                                <Link to={`/category/products`} className="single-category" key={index} style={{ backgroundImage: `url(${category.imageUrl})` }}>
                                    <div className="content">
                                        <h3>{category.categoryName}</h3>
                                        <button>Shop Now</button>

                                    </div>
                                </Link>
                            ))}

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CategoryPage