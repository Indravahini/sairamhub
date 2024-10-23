import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [addCount, setAddCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.state?.location || '';
  const department = localStorage.getItem('department');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('https://incubationbackend.vercel.app/api')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://incubationbackend.vercel.app/api/product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleAddItemClick = () => {
    navigate('/add-item', { state: { location: currentLocation } });
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product['S.no']);
    setEditedProduct({
      ...product,
      destroyed: product.destroyed || 0, 
    });
  };

  const handleAddCountChange = (event) => {
    setAddCount(parseInt(event.target.value));
  };

  const handleSave = async () => {
    const originalProduct = products.find(p => p['S.no'] === editedProduct['S.no']);
    
    if (addCount < 0) {
      alert('Count to add must be positive.');
      return;
    }

    const newCount = originalProduct.count + addCount;

    const updatedProduct = {
      ...editedProduct,
      count: newCount,
      current_stock: newCount - (originalProduct.used + editedProduct.destroyed)
    };

    try {
      await axios.put(`https://incubationbackend.vercel.app/api/update/${editedProduct['S.no']}`, updatedProduct);
      setProducts(products.map(product =>
        product['S.no'] === editedProduct['S.no'] ? updatedProduct : product
      ));
      setEditingProductId(null);
      setAddCount(0);
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setAddCount(0); 
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/logout');
  };

  let filteredProducts = products;

  if (department !== 'Management') {
    filteredProducts = filteredProducts.filter(product => product.Location === currentLocation);
  }

  if (categoryFilter !== '') {
    filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
  }
  if (searchTerm !== '') {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="stklis">
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

      <div className="container">
        <div className="row mb-3">
          <div className="col-md-4">
            <select className="form-select" onChange={handleCategoryFilterChange} value={categoryFilter}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Sensors">Sensors</option>
              <option value="Lighting">Lighting</option>
            </select>
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Product or Product ID"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <div className="col-md-4">
            <button className='btn btn-primary' onClick={handleAddItemClick}>Add Item</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Product</th>
                <th>Product ID</th>
                <th>Count</th>
                <th>Used</th>
                <th>Consumed</th>
                <th>Current Stock</th>
                <th>Category</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product['S.no']}>
                  <td data-label="S.no">{index+1}</td>
                  <td data-label="Product">{product.name}</td>
                  <td data-label="Product ID">{product.id}</td>
                  <td data-label="Count">
                    {editingProductId === product['S.no'] ? (
                      <>
                        <input
                          type="number"
                          value={addCount}
                          onChange={handleAddCountChange}
                          className="form-control"
                        />
                        <button className='btn btn-success btn-sm mt-2' onClick={handleSave}>Add</button>
                        <button className='btn btn-secondary btn-sm mt-2' onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <span>{product.count}</span>
                    )}
                  </td>
                  <td data-label="Used">{product.used}</td>
                  <td data-label="Consumed">{product.destroyed}</td>
                  <td data-label="Current Stock">{product.current_stock}</td>
                  <td data-label="Category">{product.category}</td>
                  <td data-label="Location">{product.Location}</td>
                  <td data-label="Action">
                    <button className='btn btn-primary btn-sm' onClick={() => handleEditClick(product)}>Edit</button>
                    <button className='btn btn-danger btn-sm' onClick={() => handleDelete(product['S.no'])}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;