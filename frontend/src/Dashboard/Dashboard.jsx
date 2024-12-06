import { useState, useEffect } from "react";
import HeroPages from "../components/HeroPages";

import axios from "axios";

function Dashboard() {
  const [car, setCar] = useState({
    model: "",
    brand: "",
    availability: true,
    rentalPrice: "",
  });

  const [message, setMessage] = useState("");
  const [carList, setCarList] = useState([]);
  const [rentalList, setRentalList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCar({
      ...car,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    getCars();
    getRentals();
  }, []);

  const getCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/cars/all", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCarList(response.data || []);  
      setMessage("Cars loaded successfully!");
    } catch (error) {
      console.error("Error fetching cars:", error);
      setMessage("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRentals = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/rentals/allRentals", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setRentalList(response.data || []); 
      setMessage("Rentals loaded successfully!");
    } catch (error) {
      console.error("Error fetching rentals:", error);
      setMessage("Failed to load rentals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const postCars = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/cars/add", car, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage("Car added successfully!");
      setCarList([...carList, response.data.Car]);
      setCar({ model: "", brand: "", availability: true, rentalPrice: "" });
      window.location.reload()
    } catch (error) {
      console.error("Error adding car:", error);
      setMessage("Failed to add car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/cars/update/${car.id}`, car);
      setMessage("Car updated successfully!");
      setCarList((prevCarList) =>
        prevCarList.map((c) => (c.id === car.id ? { ...c, ...car } : c))
      );
      setCar({ model: "", brand: "", availability: true, rentalPrice: "" });
    } catch (error) {
      console.error("Error updating car:", error);
      setMessage("Failed to update car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/cars/delete/${id}`);
      setMessage("Car deleted successfully!");
      setCarList((prevCarList) => prevCarList.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
      setMessage("Failed to delete car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carToEdit) => {
    setCar({ ...carToEdit });
  };


  return (
    <>
      <HeroPages name="Admin Dashboard" />

      <h1 className="form-heading">Add or Update a Car</h1>

      <form onSubmit={car.id ? updateCar : postCars} className="car-form">
        <label>
          Model:
          <input
            type="text"
            name="model"
            value={car.model}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Brand:
          <input
            type="text"
            name="brand"
            value={car.brand}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Availability:
          <input
            type="checkbox"
            name="availability"
            checked={car.availability}
            onChange={handleChange}
          />
        </label>

        <label>
          Rental Price:
          <input
            type="number"
            name="rentalPrice"
            value={car.rentalPrice}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit-button">
          {loading ? 'Processing...' : car.id ? 'Update Car' : 'Add Car'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <h1 className="car-list-heading">List of Cars</h1>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        carList.length > 0 ? (
          <table className="car-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Model</th>
                <th>Brand</th>
                <th>Availability</th>
                <th>Rental Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carList.map((car) => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.model}</td>
                  <td>{car.brand}</td>
                  <td>{car.availability ? "Available" : "Not Available"}</td>
                  <td>${car.rentalPrice}</td>
                  <td>
                    <button onClick={() => handleEdit(car)} className="update-button">
                      Update
                    </button>
                    <button onClick={() => deleteCar(car.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No cars available.</p>
        )
      )
      }

{/* Rental List Table */}
<h1 className="form-heading">List of Rentals</h1>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        rentalList.length > 0 ? (
          <table className="car-table">
            <thead>
              <tr>
                <th>Rental ID</th>
                <th>Car Model</th>
                <th>Customer name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {rentalList.map((rental) => (
                <tr key={rental.id}>
                  <td>{rental.id}</td>
                  <td>{rental.car?.model || "N/A"}</td>
                  <td>{rental.customer?.name || "N/A"}</td>
                  <td>{rental.startDate || "N/A"}</td>
                  <td>{rental.endDate || "N/A"}</td>
                  <td>${rental.totalPrice || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No rentals available.</p>
        )
      )}

      <style jsx>{`
        .form-heading {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .car-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .car-form label {
          display: block;
          margin-bottom: 10px;
        }

        .car-form input {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .submit-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 5px;
          width: 100%;
        }

        .submit-button:hover {
          background-color: #45a049;
        }

        .message {
          text-align: center;
          color: green;
        }

        .loader {
          text-align: center;
          font-size: 1.5rem;
          color: #007bff;
        }

        .car-list-heading {
          text-align: center;
          font-size: 2rem;
          margin-top: 40px;
        }

        .car-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          margin-bottom: 50px;
        }

        .car-table th, .car-table td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .car-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .car-table tr:hover {
          background-color: #ddd;
        }

        .update-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
          margin-right: 5px;
        }

        .update-button:hover {
          background-color: #2980b9;
        }

        .delete-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }

        .delete-button:hover {
          background-color: #c0392b;
        }
      `}</style>
    </>
  );
}

export default Dashboard;
