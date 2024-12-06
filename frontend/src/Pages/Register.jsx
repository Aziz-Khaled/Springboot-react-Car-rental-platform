  import { useState } from "react";
  import axios from "axios";
  import Footer from "../components/Footer";
  import HeroPages from "../components/HeroPages";
  import { useNavigate } from "react-router-dom";


  function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate()



    const submitRegister = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8080/customer/register", {
          name,
          email,
          password,
          phone,
        }, { withCredentials: true });

        console.log (response)
        setMessage(response.data.message);
        const { token } = response.data.data;
    
        if (token) {
          localStorage.setItem("token", token);
        }
        

        navigate ("/")
      
        
      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data.message);
        } else {
          setMessage("An unexpected error occurred.");
        }
      }
    };
    

    return (
      <>
        <section className="contact-page">
          <HeroPages name="Register" />
          <div className="container">
            <div className="contact-div">
              <div className="contact-div__text">
                <h2>Need additional register?</h2>
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
                <form onSubmit={submitRegister}>
                  <label>
                    Full Name <b>*</b>
                  </label>
                  <input
                    type="text"
                    placeholder='E.g: "Joe Shmoe"'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label>
                    Email <b>*</b>
                  </label>
                  <input
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label>
                    Phone <b>*</b>
                  </label>
                  <input
                    type="text"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <label>
                    Password <b>*</b>
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button type="submit">
                    <i className="fa-solid fa-envelope-open-text"></i>&nbsp;
                    Register
                  </button>
                </form>
                {message && <p className="message">{message}</p>}
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </>
    );
  }

  export default Register;
