import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

function Contact() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState(""); 

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/customer/login",
        { email, password },
        { withCredentials: true }
      );
  
      setMessage(response.data.message || "Login successful!");
      const { token } = response.data.data;
      const { role } = response.data.data.customer; // Extract role from customer object
  
      console.log("Role:", role);
      console.log("Token:", token);
  
      if (token) {
        localStorage.setItem("token", token);
        if (role === "admin") {
          navigate("/dashboard"); // Navigate to admin dashboard if role is admin
        } else {
          navigate("/"); // Navigate to home if role is client
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Login failed.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Error in login:", error);
    }
  };
  
  return (
    <>
      <section className="contact-page">
        <HeroPages name="Sign in" />
        <div className="container">
          <div className="contact-div">
            <div className="contact-div__text">
              <h2>Need additional information?</h2>
              <p>
                A multifaceted professional skilled in multiple fields of
                research, development as well as a learning specialist. Over 15
                years of experience.
              </p>
              <a href="/">
                <i className="fa-solid fa-phone"></i>&nbsp; (216) 54-512-047
              </a>
              <a href="/">
                <i className="fa-solid fa-envelope"></i>&nbsp;
                mouhamedazizkhaled@gmail.com
              </a>
            </div>
            <div className="contact-div__form">
              <form onSubmit={login}>
                <label>
                  Email <b>*</b>
                </label>
                <input
                  type="email"
                  placeholder="youremail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>
                  Password <b>*</b>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <label>
                  Don't have an account? <Link to="/Register"> Let's Register</Link>
                </label>

                <button type="submit">
                  <i className="fa-solid fa-envelope-open-text"></i>&nbsp; Sign in
                </button>
              </form>
              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </div>
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>(216) 54-512-047</h3>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Contact;
