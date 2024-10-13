import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';

const AllSubCategory = () => {
    const [SubCategories, setSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-subcategories`);
                setSubCategories(response.data.data.reverse());
            } catch (error) {
                console.error('Error fetching Sub Categories:', error);
                toast.error('Failed to fetch Sub Categories!');
            }
        };

        fetchSubCategories();
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
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-subcategory/${id}`);
                    setSubCategories(SubCategories.filter(cat => cat._id !== id));
                    toast.success("Sub Category deleted successfully!");
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
    const currentItems = SubCategories.slice(indexOfFirstItem, indexOfLastItem);

    if (!SubCategories) {
        return <Loading />;
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Sub Category</h4>
                </div>
                <div className="links">
                    <Link to={`/add-subcategory`} className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Image</th>
                            <th scope="col">Desc</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((subcategory, index) => (
                            <tr key={subcategory._id}>
                                <th scope="row">{index + 1 + indexOfFirstItem}</th>
                                <td>{subcategory.name}</td>
                                <td>{subcategory.category ? subcategory.category.name : "N/A"}</td> {/* Null check here */}
                                <td>
                                    <img src={subcategory.subCategoryImage?.url || "placeholder-image-url"} alt={subcategory.name} />
                                </td>
                                <td>{subcategory.description || "N/A"}</td>
                                <td><Link to={`/edit-subcategory/${subcategory._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link></td>
                                <td>
                                    <button onClick={() => handleDeleteCategory(subcategory._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(SubCategories.length / itemsPerPage) }, (_, i) => (
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

export default AllSubCategory;
