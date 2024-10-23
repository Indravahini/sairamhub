import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import all required assets
import logo from "./assets/logo.gif";
import menulogo from "./assets/menu-icon.png";
import dark_arrow from "./assets/dark-arrow.png";
import program_1 from "./assets/proj.jpeg";
import gallery_1 from "./assets/raspbeery pi.jpg";
import gallery_2 from "./assets/sensor.jpg";
import gallery_3 from "./assets/ar.jpg";
import gallery_4 from "./assets/voltage.jpg";
import white_arrow from "./assets/white-arrow.png";
import msg from "./assets/msg-icon.png";
import mail from "./assets/mail-icon.png";
import phon from "./assets/phone-icon.png";
import add from "./assets/location-icon.png";

// Import all your components
import Product from './Product';
import Stock from './Stock';
import AddItem from './AddItem';
import AddStock from './AddStock';  
import UpdateStock from './UpdateStock';
import UpdateItem from './UpdateItem';
import Logout from './Logout';
import RequestPage from './RequestPage';
import Department from './department';
import Login from './login';
import Register from './register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import View from './view';
import Dashboard from './Dashboard';

// Title Component
const Title = ({ subtitle, title }) => (
  <div className="title">
    <p>{subtitle}</p>
    <h2>{title}</h2>
  </div>
);



// Navbar Component
const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 500 ? setSticky(true) : setSticky(false);
    });
  }, []);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleExploreClick = () => {
    navigate('/view');
  };

  return (
    <nav className={`conta ${sticky ? "dark-nav" : ""}`}>
      <img src={logo} alt="" className="logo" />
      <ul className={mobileMenu ? "show-menu" : ""}>
        <li><a href="#hero"><span>Home</span></a></li>      
        <li><a href="#about"><span>About us</span></a></li>
        <li><a href="#contact" ><span>Contact us</span></a></li>
        <li><a className="btnn" onClick={handleLoginClick}>Log In</a></li>
      </ul>
      <img src={menulogo} alt="" className="menu-icon" onClick={toggleMenu} />
    </nav>
  );
};

// Hero Component
const Hero = ({ onExploreClick }) => (
  <div className="hero conta" id="hero">
    <div className="hero-text">
      <h1>SAIRAM PRODUCT HUB</h1>
      <p>
        Sairam Product Hub is the ultimate shopping destination for college students, offering everything you need at unbeatable prices, right on campus!
      </p>
      <a className="btnn" onClick={onExploreClick}>
        Explore more <img src={dark_arrow} alt="" />
      </a>
    </div>
  </div>
);


const About = () => (
  <div className="about-section" id="about">
    
    
    {/* About Content */}
    
    <div className="about-content">
      <div className="about-left">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/lgAgUQFDkGY?si=a4Jytzzqe_xlyZfB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen className="about-img"></iframe>
        
       
      </div>
      <div className="about-right">
        <h3>ABOUT INCUBATION</h3>
        <h2>Empowering Innovation, Shaping Futures</h2>
        <p>
        Sairam Incubation is a dynamic platform that nurtures innovation and entrepreneurship among students and startups. It provides access to cutting-edge resources, mentorship, and industry connections, fostering the growth of new ideas.
        </p>
        <p>
        With state-of-the-art infrastructure, Sairam Incubation offers the perfect environment for budding entrepreneurs to turn their vision into reality. The program supports a wide range of industries, encouraging cross-disciplinary collaboration. By promoting a culture of innovation, Sairam Incubation empowers future leaders to create impactful solutions for real-world challenges.
        </p>
      </div>
    </div>

    <Title subtitle="ABOUT PROJECTS" title="What We DONE" />
    
    {/* Programs */}
    <div className="programs">
      <div className='proo'>
    <div className='pro'>
<img className='program' src={program_1}></img>
<img className='program' src={program_1}></img>
<img className='program' src={program_1}></img>

</div>
<h3 className='proname'>Autonomous Underwater Vehicle</h3> 
</div>
<br></br>
<a className="btnn dark-btn" href='https://www.sairamincubation.com/' target="_blank">
        See more here <img src={white_arrow} alt="" />
      </a>
 </div>
 
    {/* Campus Gallery */}
    <div className="campus-gallery">
    <h3>ABOUT PRODUCTS</h3>
    <h2>Products that you can purchase</h2>
    <br></br>
      <div className="gallery">
        <img src={gallery_1} alt="" />
        <img src={gallery_2} alt="" />
        <img src={gallery_3} alt="" />
        <img src={gallery_4} alt="" />
      </div>
      
    </div>
  </div>
);


// Contact Component
const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "e728389d-cf0d-412d-8990-be392ce704ac");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        setResult(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResult("An error occurred. Please try again.");
    }
  };

  return (
    <div className="contact" id="contact">
      <div className="contact-col">
        <h3>
          Send us a message <img src={msg} alt="" />
        </h3>
        <p>
          Feel free to reach out through contact form or find our contact
          information below. Your feedback, questions, and suggestions are
          important to us as we strive to provide exceptional service to our
          university community.
        </p>
        <ul>
          <li><img src={mail} alt="" />incubation@sairam.edu.in</li>
          <li><img src={phon} alt="" />+91 7845127111</li>
          <li>
            <img src={add} alt="" />
            C/O Srisairam Engineering College, H BLK SAI LEO Nagar, Poonthandalam Village, Chennai, Tamil Nadu 600044  <br />
           
          </li>
        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit}>
          <label>Your Name</label>
          <input type="text" name="name" placeholder="Enter your name" required />
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="Enter your mobile number" required />
          <label>Write your message here</label>
          <textarea name="message" rows="6" placeholder="Enter your message" required></textarea>
          <button type="submit" className="btnn dark-btn">
            Submit now <img src={white_arrow} alt="" />
          </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <div className="footer">
    <p>© 2024 Sairam Incubation. All rights reserved.</p>
    <ul>
      <li>Terms of Services</li>
      <li>Privacy Policy</li>
    </ul>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/view');
  };

  return (
    <div>
      <Navbar />
      <Hero onExploreClick={handleExploreClick} />
      <div className="conta">
        <About />
        <Title subtitle="Contact Us" title="Get in Touch" />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/view" element={<View />} />
        <Route path="/product" element={<Product />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stocks/createStock" element={<AddStock />} />
        <Route path="/create" element={<AddItem />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/update/:id" element={<UpdateItem />} />
        <Route path="/updateStock/:id" element={<UpdateStock />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/department" element={<Department />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;