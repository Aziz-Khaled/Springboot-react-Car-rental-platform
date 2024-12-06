package com.project.backend.Services;

import com.project.backend.Entities.Car;
import com.project.backend.Entities.ResponseMessage;
import com.project.backend.Repositories.CarRepositories;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/cars")
public class CarService {

    @Autowired
    private CarRepositories carRepo;


    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addCar(Car car) {
        Car newCar = carRepo.save(car);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("Car", newCar);

        ResponseMessage<Map<String, Object>> responseMessage =
                new ResponseMessage<>("Car added successfully", responseBody);

        return Response.status(Response.Status.CREATED).entity(responseMessage).build();
    }





    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Car> findAllCars() {
        // Assuming carRepo.findAll() returns a list of Car objects
        return carRepo.findAll();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findCarById(@PathParam("id") Long id) {
        Car car = carRepo.findById(id).orElse(null);

        if (car == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Car not found for id: " + id)
                    .build();
        }

        return Response.ok(car).build();
    }


    @PUT
    @Path("/update/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCar(@PathParam("id") Long id, Car car) {
        Car existingCar = carRepo.findById(id).orElse(null);

        if (existingCar == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Car not found for id: " + id)
                    .build();
        }


        existingCar.setModel(car.getModel());
        existingCar.setBrand(car.getBrand());
        existingCar.setAvailability(car.getAvailability());
        existingCar.setRentalPrice(car.getRentalPrice());


        Car updatedCar = carRepo.save(existingCar);

        return Response.ok(updatedCar).build();
    }


    @DELETE
    @Path("/delete/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCar(@PathParam("id") Long id) {
        Car car = carRepo.findById(id).orElse(null);

        if (car == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Car not found for id: " + id)
                    .build();
        }

        carRepo.delete(car);

        return Response.status(Response.Status.NO_CONTENT)
                .entity("Car with id " + id + " deleted successfully.")
                .build();
    }
}