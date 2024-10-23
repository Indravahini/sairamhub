import { useState } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUniversity, FaBuilding } from "react-icons/fa";


  // Required for accessibility

function Login() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [college, setCollege] = useState('');
  const navigate = useNavigate();
  const [action, setAction] = useState('');
  

  const registerLink = () => {
    setAction(' active');
  };

  const loginLink = () => {
    setAction('');
  };


  
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Email is required");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    axios.post('https://incubationbackend.vercel.app/api/register', { username, email, password, department, college })
      .then(() => {
        alert('Registration request sent to admin. Please wait for approval.');
        navigate('/login'); 
      })
      .catch(err => {
        console.error('Registration error:', err.response ? err.response.data : err);
        alert('Registration failed. Please try again.');
      });
  };

  

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('https://incubationbackend.vercel.app/api/login', { email, password })
      .then(res => {
       localStorage.setItem('token', res.data.token);
      localStorage.setItem('department', res.data.department); // Store department
        alert('Login successful. Redirecting to dashboard...');
        navigate(`/dashboard`, { state: { location: res.data.department } }); // Redirect to Dashboard.js
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials and try again.');
      });
  };  

  


  return (
    <div className='log-reg-page'>
    <div className={`wrapper${action}`}>
      
      <div className='form-box login'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className='input-box'>
            <input type="email"
                id="email"
                placeholder='Enter Email'
                className='form-control'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
            <FaUser className="icon" />
          </div>
          <div className='input-box'>
            <input type="password"
                id="password"
                placeholder='Enter Password'
                className='form-control'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" />Remember me</label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <br />
            <p>Don&apos;t have an account? <a href="#" onClick={registerLink}>Register</a></p>
            
          </div>
        </form>
      </div>
{/* Register */}

      <div className='form-box register'>
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
          <div className='input-box'>
            <input type="text"
              id="username"
              placeholder='Enter Username'
              className='form-control'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required />
            <FaUser className="icon" />
          </div>
          <div className='input-box'>
            <input type="email"
              id="email"
              placeholder='Enter Email'
              className='form-control'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required />
            <FaEnvelope className="icon" />
          </div>
          <div className='input-box'>
            <input type="password"
              id="password"
              placeholder='Enter Password'
              className='form-control'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required />
            <FaLock className="icon" />
          </div>
          <div className='input-box'>
            <input type="password"
              id="confirmPassword"
              placeholder='Confirm Password'
              className='form-control'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required />
            <FaLock className="icon" />
          </div>
          <div className='input-box'>
          <select
              id="department"
              className='form-select'
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="Incubation">Incubation</option>
              <option value="CSE">CSE</option>
              <option value="Management">Management</option>
            </select>
            <FaUniversity className="icon" />
          </div>
          <div className='input-box'>
            <input type="text"
              id="college"
              placeholder='Enter College'
              className='form-control'
              value={college}
              onChange={e => setCollege(e.target.value)}
              required />
            <FaBuilding className="icon" />
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" required />I agree to the terms & conditions</label>
          </div>
          <button type="submit">Register</button>
          <div className="register-link">
            <br />
            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
          </div>
        </form>
      </div>

      </div>
    </div>
  );
}

export default Login;