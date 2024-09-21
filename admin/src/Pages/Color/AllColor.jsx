import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllColor = () => {
    const [colors, setColors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedColor, setSelectedColor] = useState({ name: '', hexCode: '#000000' }); // For color selection
    const [currentColorId, setCurrentColorId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const itemsPerPage = 8;

    const fetchColors = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-colors`);
            const reversedColors = res.data.data.reverse();
            setColors(reversedColors);
        } catch (error) {
            console.error('There was an error fetching the Colors!', error);
        }
    };

    useEffect(() => {
        fetchColors();
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
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-color/${id}`);
                    toast.success("Color Deleted Successfully");
                    fetchColors();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Color has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error('Error deleting color!');
                }
            }
        });
    };

    const handleOpenModal = (mode, color = null) => {
        setModalMode(mode);
        if (mode === 'edit' && color) {
            setSelectedColor({ name: color.name, hexCode: color.hexCode });
            setCurrentColorId(color._id);
        } else {
            setSelectedColor({ name: '', hexCode: '#000000' });
            setCurrentColorId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveColor = async () => {
        const url = modalMode === 'create'
            ? `${process.env.REACT_APP_BACKEND_URL}/create-color`
            : `${process.env.REACT_APP_BACKEND_URL}/update-color/${currentColorId}`;

        try {
            await axios({
                method: modalMode === 'create' ? 'post' : 'put',
                url: url,
                data: selectedColor
            });

            toast.success(`Color ${modalMode === 'create' ? 'Created' : 'Updated'} Successfully`);
            fetchColors();
            setIsModalOpen(false); // Close modal after saving
        } catch (error) {
            console.error(error);
            toast.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} color!`);
        }
    };

    // Filter colors based on search query
    const filteredColors = colors.filter(color =>
        color.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredColors.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Colors</h4>
                </div>
                <div className="links">
                    <button onClick={() => handleOpenModal('create')} className="add-new">Add New <i className="fa-solid fa-plus"></i></button>
                </div>
            </div>

            <div className="filteration">
                <div></div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Color</th>
                            <th scope="col">Color</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((color, index) => (
                            <tr key={color._id}>
                                <th scope="row">{index + 1 + indexOfFirstItem}</th>
                                <td>
                                    <div className="circle-color" style={{ backgroundColor: `${color.hexCode}` }}>{color.name}</div>
                                </td>
                                <td>
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        backgroundColor: `${color.hexCode}`,
                                        border: '1px solid #000'
                                    }}></div>
                                </td>
                                <td>
                                    <button onClick={() => handleOpenModal('edit', color)} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(color._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(filteredColors.length / itemsPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            {isModalOpen && (
                <>
                    <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1" aria-labelledby="colorModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="colorModalLabel">{modalMode === 'create' ? 'Create Color' : 'Edit Color'}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="colorName" className="form-label">Color Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="colorName"
                                            value={selectedColor.name}
                                            onChange={(e) => setSelectedColor({ ...selectedColor, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="colorHexCode" className="form-label">Color Code</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            id="colorHexCode"
                                            value={selectedColor.hexCode}
                                            onChange={(e) => setSelectedColor({ ...selectedColor, hexCode: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveColor}>{modalMode === 'create' ? 'Create' : 'Update'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
}

export default AllColor;
