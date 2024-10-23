import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto'; 
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; 
import incubationLogo from './assets/incubation.png'; 
import userIcon from './assets/user.png'; 
import axios from 'axios';
import RequestPopup from './RequestPopup';
import { FaSearch } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [department, setDepartment] = useState('');
  const [userName, setUserName] = useState(''); // Store the logged-in user's name
  const [totalStock, setTotalStock] = useState(0);
  const [itemsRented, setItemsRented] = useState(0);
  const [itemsConsumed, setItemsConsumed] = useState(0);
  const [itemsReturned, setItemsReturned] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0); // Pending requests count
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown state
  const [isRequestPopupOpen, setRequestPopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userDepartment = localStorage.getItem('department');
    setDepartment(userDepartment || 'Department');

    // Fetch inventory stats
    axios.get('https://incubationbackend.vercel.app/api/inventory-stats', {
      params: { department: userDepartment }
    })
      .then(res => {
        setTotalStock(res.data.totalStock || 0);
        setItemsRented(res.data.itemsRented || 0);
        setItemsConsumed(res.data.itemsConsumed || 0);
        setItemsReturned(res.data.itemsReturned || 0);
      })
      .catch(err => {
        console.error('Error fetching inventory stats:', err);
      });

    // Fetch the number of pending requests
    axios.get('https://incubationbackend.vercel.app/api/pending-requests-count', {
      params: { department: userDepartment }
    })
    .then(res => {
      setPendingRequestsCount(res.data.count || 0);
    })
    .catch(err => {
      console.error('Error fetching pending requests count:', err);
    });

    // Fetch logged-in user's name
    const userEmail = localStorage.getItem('email'); // Assuming you have stored user's email in localStorage
    axios.get('https://incubationbackend.vercel.app/api/get-user', {
      params: { email: userEmail }
    })
    .then(res => {
      setUserName(res.data.name || 'User'); // Set the user's name from the response
    })
    .catch(err => {
      console.error('Error fetching user data:', err);
    });

  }, [department]);

  const data = {
    labels: ['Total Stock', 'Items Rented', 'Items Consumed', 'Items Returned'],
    datasets: [
      {
        label: 'Inventory Data',
        data: [totalStock, itemsRented, itemsConsumed, itemsReturned],
        backgroundColor: ['#ffd166', '#06d6a0', '#118ab2', '#ed2939'],
        borderColor: ['#ffd166', '#06d6a0', '#118ab2', '#ed2939'],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const handleRequestPopupOpen = () => {
    setRequestPopupOpen(true);
  };

  const handleRequestPopupClose = () => {
    setRequestPopupOpen(false);
  };

  const handleToBeCollectedStockPage = () => {
    navigate('/stock', { state: { statusFilter: 'To be Collected' } });
  };

  const handleAddItemClick = () => {
    navigate('/add-item', { state: { location: department } });
  };

  const handleProductPage = () => {
    navigate('/product', { state: { location: department } });
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown
  };

  const handleLogout = () => {
    // Perform logout logic, such as clearing tokens or user data
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="appto">
      <header className="headerr">
        <div className="logo-container">
          <img src={incubationLogo} alt="Incubation Logo" className="incubation-logo" />
          <div className="logo">stic</div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search products"  />
          <FaSearch className="icon" />
        </div>
        <div className="user-profile">
          <img src={userIcon} alt="User" onClick={handleProfileClick} className="user-image" />
          {showDropdown && (
            <div className="dropdown">
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          )}
          <div className="user-name">{userName}</div> {/* Display the logged-in user's name */}
        </div>
        <div className="header-links"></div>
      </header>

      <main className="main-content">
        <div className="cse-department">{department}</div>
        <div className="dashboard">
          <div className="dashboard-card">
            <h2>Total Stock</h2>
            <div className="card-content">
              <div className="value">{totalStock}</div>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Items Rented</h2>
            <div className="card-content">
              <div className="value">{itemsRented}</div>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Items Consumed</h2>
            <div className="card-content">
              <div className="value">{itemsConsumed}</div>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Items Returned</h2>
            <div className="card-content">
              <div className="value">{itemsReturned}</div>
            </div>
          </div>
        </div>

        <div className="cumulative-chart-and-buttons">
          <div className="cumulative-chart">
            <Pie data={data} />
          </div>
          <div className="buttons">
            <button onClick={handleRequestPopupOpen}>
              Request Pending <span className="notification-badge">{pendingRequestsCount}</span>
            </button>
            <button onClick={handleToBeCollectedStockPage}>
              To be Collected Stock
            </button>
            <Link to="/stock" state={{ statusFilter: 'Collected' }}>
              <button>Purchase History</button>
            </Link>
            <button onClick={handleAddItemClick}>Add Items</button>
            <button onClick={handleProductPage}>Stock List</button>
          </div>
        </div>
        <div className='col'></div>
      </main>

      {isRequestPopupOpen && (
        <RequestPopup
          department={department}
          onClose={handleRequestPopupClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
