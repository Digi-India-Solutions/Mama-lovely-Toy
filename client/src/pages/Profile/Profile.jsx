import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const storedUser = JSON.parse(localStorage.getItem('mamaLovelyToyUser'));
        if (storedUser) {
          setUser(storedUser);
        }

        // Simulate fetching orders from an API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/get-orders-by-user/${storedUser._id}`);
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSaveChanges = () => {
    // Save the changes to local storage or an API
    setIsEditing(false);
  };

  const handleChange = (e) => {
    // Handle form changes if needed
  };

  if (!user) return <p>Loading...</p>;

  return (
    <section className="profile-section py-5">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-4">
            <div className="profile-sidebar">
              <div className="profile-userpic text-center">
                <img src={user.profilePicture || 'https://via.placeholder.com/150'} alt="User" className="img-fluid rounded-circle" />
              </div>
              <div className="profile-usertitle text-center">
                <div className="profile-usertitle-name">
                  {user.name}
                </div>
                <div className="profile-usertitle-job">
                  {user.email}
                </div>
              </div>
              <div className="profile-usermenu">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link active">
                      <i className="fa fa-home"></i> Overview 
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/orders" className="nav-link">
                      <i className="fa fa-shopping-bag"></i> My Orders 
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className="nav-link">
                      <i className="fa fa-shopping-bag"></i> My Cart 
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="col-md-8">
            <div className="profile-content">
              <h3 className="mb-4">Account Overview</h3>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Personal Information</h5>
                  {isEditing ? (
                    <form>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" defaultValue={user.name} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" defaultValue={user.email} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input type="text" className="form-control" defaultValue={user.phoneNumber} onChange={handleChange} />
                      </div>
                      <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                    </form>
                  ) : (
                    <>
                      <p>Name: {user.name}</p>
                      <p>Email: {user.email}</p>
                      <p>Phone: {user.phoneNumber}</p>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
                  )}
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Recent Orders</h5>
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order._id} className="order-summary">
                        <p>Order #{order._id} - {order.status}</p>
                        <Link to={`/orders/${order._id}`} className="btn btn-secondary">View Details</Link>
                      </div>
                    ))
                  ) : (
                    <p>No recent orders.</p>
                  )}
                  <Link to="/orders" className="btn btn-secondary">View All Orders</Link>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Account Settings</h5>
                  <Link to="/settings" className="btn btn-secondary">Update Password</Link>
                  <Link to="/settings" className="btn btn-secondary ml-2">Email Preferences</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
