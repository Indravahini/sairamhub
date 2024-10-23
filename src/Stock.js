import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Stock.css';

function Stock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [department, setDepartment] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const dept = localStorage.getItem('department');
    setDepartment(dept);
    fetchLocations();
    fetchStocks(dept, selectedLocation, location.state?.statusFilter);
  }, [selectedLocation, location.state?.statusFilter]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('https://incubationbackend.vercel.app/api/locations');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err);
    }
  };

  const fetchStocks = async (dept, location, statusFilter) => {
    try {
      const params = { location, status: statusFilter || 'collected' };
      if (dept !== 'Management') {
        params.department = dept; 
      }
  
      const res = await axios.get('https://incubationbackend.vercel.app/api/stock', { params });
      setStock(res.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (id, status, type, quantity) => {
    const newStatus = status === 'Collected' ? 'To be Collected' : 'Collected';

    axios.put(`https://incubationbackend.vercel.app/api/updateStatus/${id}`, { status: newStatus, type, quantity })
      .then(res => {
        console.log('Status updated successfully:', res.data);
        fetchStocks(department, selectedLocation, location.state?.statusFilter);
      })
      .catch(err => {
        console.error('Error updating status:', err.response ? err.response.data : err.message);
        alert(`Error updating status: ${err.response ? err.response.data.error : err.message}`);
      });
  };

  const handleTypeChange = async (id) => {
    try {
      await axios.put(`https://incubationbackend.vercel.app/api/updateType/${id}`, { type: 'Returned' });
      fetchStocks(department, selectedLocation, location.state?.statusFilter);
    } catch (err) {
      console.error('Error updating type:', err);
      alert(`Error updating type: ${err.response ? err.response.data.error : err.message}`);
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    navigate('/logout');
  };

  const filteredStock = stock.filter(item => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      item.product.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.project.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.student_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.student_id.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return <div className="container"><h1 className="my-4">Loading...</h1></div>;
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="my-4">Error: Failed to fetch stock data.</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="collhis">
      <header className="header">
        <div className="header-left">
          <button className="btn btn-primary" onClick={() => navigate('/')}>Home</button>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary" onClick={handleProfileClick}>User Profile</button>
          {showDropdown && (
            <div className="dropdown">
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="container mt-4">
        <div className="controls-container">
          <div className="search-filter-container">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Product, Project, Student Name, Student ID, or Type"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            {department !== 'Management' && (
              <div className="form-group">
                <label htmlFor="location-select">Filter by Location:</label>
                <select
                  id="location-select"
                  className="form-control"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button onClick={() => navigate('/stocks/createStock')} className="btn btn-success">Add Purchase</button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Date</th>
                <th>Product</th>
                <th>Project</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item, index) => (
                <tr key={item['S.no']}>
                  <td data-label="S.no">{index + 1}</td>
                  <td data-label="Date">{item.Date}</td>
                  <td data-label="Product">{item.product}</td>
                  <td data-label="Project">{item.project}</td>
                  <td data-label="Student Name">{item.student_name}</td>
                  <td data-label="Student ID">{item.student_id}</td>
                  <td data-label="Quantity">{item.Quantity}</td>
                  <td data-label="Type">{item.type}</td>
                  <td data-label="Status">{item.status}</td>
                  <td data-label="Actions">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={item.status === 'Collected'}
                        disabled={item.type === 'Returned'}
                        onChange={() => handleStatusChange(item['S.no'], item.status, item.type, item.Quantity)}
                      />
                      <label className="form-check-label">
                        Collected
                      </label>
                    </div>
                    {item.type === 'rent' && item.status === 'Collected' && (
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.type === 'Returned'}
                          onChange={() => handleTypeChange(item['S.no'])}
                        />
                        <label className="form-check-label">
                          Returned
                        </label>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stock;



