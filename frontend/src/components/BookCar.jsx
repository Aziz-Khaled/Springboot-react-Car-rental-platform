import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import

function BookCar() {
  const [modal, setModal] = useState(false);
  const [carType, setCarType] = useState("");
  const [cars, setCars] = useState([]);
  const [dropOff, setDropOff] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [carImg, setCarImg] = useState("");
  const navigate = useNavigate();

  // Decode token to get user data
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const currentUser = token ? jwtDecode(token) : null; 
  
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cars/all");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      alert("Failed to fetch cars. Please try again.");
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("Please log in first to book a car.");
      navigate("/contact"); 
      return;
    }

    const errorMsg = document.querySelector(".error-message");
    if (dropOff === "" || pickTime === "" || carType === "") {
      errorMsg.style.display = "flex";
    } else {
      setModal(!modal);
      const modalDiv = document.querySelector(".booking-modal");
      modalDiv.scroll(0, 0);
      errorMsg.style.display = "none";
    }
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
  
    if (!isLoggedIn) {
      alert("Please log in first to book a car.");
      navigate("/login");
      return;
    }
  
    const selectedCar = cars.find((car) => car.model === carType);
    const bookingData = {
      car: {
        id: selectedCar.id, // Sending the car ID as part of the "car" object
      },
      customer: {
        id: currentUser.id, // Sending the current user's ID as part of the "customer" object
      },
      startDate: pickTime, // Using pickTime for startDate
      endDate: dropOff, // Using dropOff for endDate
      totalPrice: calculateTotalPrice(selectedCar), // Function to calculate the total price
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8080/rentals/add",
        bookingData,
      
      );
      console.log("Booking successful:", response.data);
      alert("Booking confirmed!");
      setModal(false);
    } catch (error) {
      console.error("Error booking car:", error.response);
      alert("Booking failed. Please try again.");
    }
  };
  
  
  const calculateTotalPrice = (car) => {
    const startDate = new Date(pickTime);
    const endDate = new Date(dropOff);
    const timeDifference = endDate - startDate;
    const days = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    const pricePerDay = car.pricePerDay || 50; // Assuming there's a pricePerDay field in car data
    return days * pricePerDay;
  };
  
  const handleCar = (e) => {
    const selectedCar = cars.find((car) => car.model === e.target.value);
    setCarType(e.target.value);
    setCarImg(selectedCar ? selectedCar.image : ""); // Assuming `image` is a field in the car object
  };

  return (
    <>
      <section id="booking-section" className="book-section">
        <div
          onClick={openModal}
          className={`modal-overlay ${modal ? "active-modal" : ""}`}
        ></div>

        <div className="container">
          <div className="book-content">
            <div className="book-content__box">
              <h2>Book a car</h2>

              <p className="error-message">
                All fields required! <i className="fa-solid fa-xmark"></i>
              </p>

              <form className="box-form">
                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-car"></i> &nbsp; Select Your Car
                    Type <b>*</b>
                  </label>
                  <select value={carType} onChange={handleCar}>
                    <option value="">Select your car type</option>
                    {cars.map((car) => (
                      <option key={car.id} value={car.model}>
                        {car.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="picktime">
                    <i className="fa-regular fa-calendar-days"></i> &nbsp;
                    Pick-up <b>*</b>
                  </label>
                  <input
                    id="picktime"
                    value={pickTime}
                    onChange={(e) => setPickTime(e.target.value)}
                    type="date"
                  ></input>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="droptime">
                    <i className="fa-regular fa-calendar-days"></i> &nbsp;
                    Drop-off <b>*</b>
                  </label>
                  <input
                    id="droptime"
                    value={dropOff}
                    onChange={(e) => setDropOff(e.target.value)}
                    type="date"
                  ></input>
                </div>

                <button onClick={openModal} type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
        <div className="booking-modal__title">
          <h2>Complete Reservation</h2>
          <i onClick={openModal} className="fa-solid fa-xmark"></i>
        </div>
        <div className="booking-modal__message">
          <h4>
            <i className="fa-solid fa-circle-info"></i> Upon completing this
            reservation enquiry, you will receive:
          </h4>
          <p>
            Your rental voucher to produce on arrival at the rental desk and a
            toll-free customer support number.
          </p>
        </div>
        <div className="booking-modal__car-info">
          <h2>
            <span>Car -</span> {carType} 
            <br />
            <span>pick time -</span> {pickTime}
            <br />
            <span>drop off time -</span> {dropOff}
          </h2>
          {carImg && <img src={carImg} alt="Car" />}
        </div>
        <div className="booking-modal__person-info">
          <form className="info-form">
            <div className="reserve-button">
              <button onClick={confirmBooking}>Reserve Now</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BookCar;