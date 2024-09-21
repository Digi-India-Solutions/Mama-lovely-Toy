import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const TermCondition = () => {
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
                        <h1 className='breadcrumb-title'>Terms & Condition</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Terms & Condition</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <div className="container policy py-4">

                <p className="mb-4">
                    Welcome to Mama Lovely Toy! These terms and conditions outline the rules and regulations for the use of our website.
                </p>
                <p className="mb-4">
                    By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Mama Lovely Toy's website if you do not accept all of the terms and conditions stated on this page.
                </p>

                <h2 className="h4 mb-2">1. Website Use</h2>
                <p className="mb-4">
                    The use of this website is subject to the following terms of use:
                </p>
                <ul className="list-styled pl-3 mb-4">
                    <li className="mb-2">Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.</li>
                    <li className="mb-2">It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.</li>
                    <li className="mb-2">This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                </ul>

                <h2 className="h4 mb-2">2. Intellectual Property</h2>
                <p className="mb-4">
                    All trademarks, product images, and content displayed on this website are the property of Mama Lovely Toy unless otherwise stated.
                </p>

                <h2 className="h4 mb-2">3. Limitation of Liability</h2>
                <p className="mb-4">
                    Mama Lovely Toy shall not be liable for any damages arising out of or in connection with your use of the website. This limitation of liability applies to direct, indirect, consequential, and punitive damages, as well as loss of profits or data.
                </p>

                <h2 className="h4 mb-2">4. Changes to Terms & Conditions</h2>
                <p className="mb-4">
                    We reserve the right to update these terms and conditions at any time. Please review this page periodically for updates. Continued use of the site after changes are posted constitutes acceptance of the revised terms.
                </p>

                <h2 className="h4 mb-2">5. Contact Information</h2>
                <p className="mb-4">
                    If you have any questions or concerns about our terms and conditions, feel free to contact us at support@mamalovelytoy.com.
                </p>
            </div>

        </>
    )
}

export default TermCondition