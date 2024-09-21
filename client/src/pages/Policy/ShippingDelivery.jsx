import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ShippingDelivery = () => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);
    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb ">
                        <h1 className='breadcrumb-title'>Shipping & Delivery</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Shipping & Delivery</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <div className="container policy py-4">
                <p className="mb-4">
                    At Mama Lovely Toy, we strive to deliver your favorite toys right to your doorstep as quickly and efficiently as possible. Here are the details of our shipping and delivery process:
                </p>

                <h2 className="h4 mb-2">1. Shipping Rates</h2>
                <p className="mb-4">
                    Shipping charges may vary depending on the size and weight of the toys and your location. Shipping rates will be displayed at checkout before you complete your purchase.
                </p>

                <h2 className="h4 mb-2">2. Delivery Time</h2>
                <p className="mb-4">
                    We aim to process and ship your orders within 1-2 business days. Delivery times may vary depending on your location, but standard shipping typically takes 3-7 business days.
                </p>

                <h2 className="h4 mb-2">3. International Shipping</h2>
                <p className="mb-4">
                    Currently, Mama Lovely Toy offers shipping within the country only. We do not offer international shipping at this time.
                </p>

                <h2 className="h4 mb-2">4. Damaged or Lost Items</h2>
                <p className="mb-4">
                    If your package arrives damaged or is lost in transit, please contact our customer service immediately. We will work with the courier to resolve the issue and ensure you receive your items.
                </p>

                <h2 className="h4 mb-2">5. Delivery Options</h2>
                <p className="mb-4">
                    We partner with trusted courier services to deliver your orders. You will be able to choose between standard and express delivery options at checkout, depending on availability.
                </p>
            </div>
        </>
    )
}

export default ShippingDelivery