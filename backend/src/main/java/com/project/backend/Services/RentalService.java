package com.project.backend.Services;


import com.project.backend.Entities.Car;
import com.project.backend.Entities.Customer;
import com.project.backend.Entities.Rental;
import com.project.backend.Repositories.CarRepositories;
import com.project.backend.Repositories.CustomerRepositories;
import com.project.backend.Repositories.RentalRepositories;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

@Path("/rentals")
public class RentalService {

    @Autowired
    private RentalRepositories rentalReo ;
@Autowired
    private CarRepositories carRepository ;
@Autowired
    private CustomerRepositories customerRepository ;

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createRental(Rental rental) {
        try {
            Car car = carRepository.findById(rental.getCar().getId())
                    .orElseThrow(() -> new WebApplicationException("Car not found", Response.Status.NOT_FOUND));

            Customer customer = customerRepository.findById(rental.getCustomer().getId())
                    .orElseThrow(() -> new WebApplicationException("Customer not found", Response.Status.NOT_FOUND));

            rental.setCar(car);
            rental.setCustomer(customer);

            rental.setStartDate(LocalDate.now());
            Rental savedRental = rentalReo.save(rental);

            return Response.status(Response.Status.CREATED).entity(savedRental).build();
        } catch (WebApplicationException ex) {
            return Response.status(ex.getResponse().getStatus())
                    .entity(ex.getMessage())
                    .build();
        }

    }

    @GET
    @Path("/allRentals")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllRentals() {
        List<Rental> rentals = rentalReo.findAll();
        return Response.ok(rentals).build();
    }

    @GET
    @Path("/oneRental/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRentalById(@PathParam("id") Long id) {
        return rentalReo.findById(id)
                .map(rental -> Response.ok(rental).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

}
