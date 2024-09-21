import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const AllSizes = () => {
    const [sizes, setSizes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedSize, setSelectedSize] = useState({ name: '' }); // For size selection
    const [currentSizeId, setCurrentSizeId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

    const itemsPerPage = 30;

    const fetchSizes = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-size`);
            const reversedSizes = res.data.reverse();
            setSizes(reversedSizes);
        } catch (error) {
            console.error('There was an error fetching the sizes!', error);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
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
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-size/${id}`);
                    toast.success("Size Deleted Successfully");
                    fetchSizes();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your size has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error('Error deleting size!');
                }
            }
        });
    };

    const handleOpenModal = (mode, size = null) => {
        setModalMode(mode);
        if (mode === 'edit' && size) {
            setSelectedSize({ name: size.name });
            setCurrentSizeId(size._id);
        } else {
            setSelectedSize({ name: '' });
            setCurrentSizeId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveSize = async () => {
        const url = modalMode === 'create'
            ? `${process.env.REACT_APP_BACKEND_URL}/create-size`
            : `${process.env.REACT_APP_BACKEND_URL}/update-size/${currentSizeId}`;

        try {
            await axios({
                method: modalMode === 'create' ? 'post' : 'put',
                url: url,
                data: selectedSize
            });

            toast.success(`Size ${modalMode === 'create' ? 'Created' : 'Updated'} Successfully`);
            fetchSizes();
            setIsModalOpen(false); // Close modal after saving
        } catch (error) {
            console.error(error);
            toast.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} size!`);
        }
    };

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sizes.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Sizes</h4>
                </div>
                <div className="links">
                    <button onClick={() => handleOpenModal('create')} className="add-new">Add New <i className="fa-solid fa-plus"></i></button>
                </div>
            </div>

            <div className="filteration">
                <div></div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Size</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((size, index) => (
                            <tr key={size._id}>
                                <th scope="row">{index + 1 + indexOfFirstItem}</th>
                                <td>{size.name}</td>
                                <td>
                                    <button onClick={() => handleOpenModal('edit', size)} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(size._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(sizes.length / itemsPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            {/* Modal for Create/Edit Size */}
            {isModalOpen && (
                <>
                    <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1" aria-labelledby="sizeModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="sizeModalLabel">{modalMode === 'create' ? 'Create Size' : 'Edit Size'}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="sizeName" className="form-label">Size Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="sizeName"
                                            value={selectedSize.name}
                                            onChange={(e) => setSelectedSize({ ...selectedSize, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveSize}>{modalMode === 'create' ? 'Create' : 'Update'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Modal Backdrop */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
};

export default AllSizes;
