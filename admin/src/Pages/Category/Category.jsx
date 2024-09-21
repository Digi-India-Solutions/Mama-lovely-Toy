import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-categories`);
                setCategories(response.data.data.reverse());
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories!');
            }
        };

        fetchCategories();
    }, []);

    const handleDeleteCategory = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-category/${id}`);
                    setCategories(categories.filter(cat => cat._id !== id));
                    toast.success("Category deleted successfully!");
                } catch (error) {
                    console.error('Error deleting category:', error);
                    toast.error('Failed to delete category!');
                }
            }
        });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
        // Pagination calculation
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Categories</h4>
                </div>
                <div className="links">
                    <Link to={`/add-category`}  className="add-new">Add New Category <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Image</th>
                            <th scope="col">Desc</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((category, index) => (
                            <tr key={category._id}>
                                <th scope="row">{index + 1 + indexOfFirstItem}</th>
                                <td>{category.name}</td>
                                <td><img src={category.categoryImage.url} alt={category.name} /></td>
                                <td>{category.description || "N/A"}</td>
                                <td><Link to={`/edit-category/${category._id}`} className="bt edit">Edit <i class="fa-solid fa-pen-to-square"></i></Link></td>
                                <td>
                                    <button onClick={() => handleDeleteCategory(category._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

        </>
    );
};

export default Category;
