package com.project.backend.Services;

import com.project.backend.Dto.CustomerDTO;
import com.project.backend.Entities.Customer;
import com.project.backend.Entities.ResponseMessage;
import com.project.backend.Repositories.CustomerRepositories;
import com.project.backend.Utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/customer")
@CrossOrigin
public class CustomerService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomerRepositories customerRepositories;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(Customer c) {

        if (customerRepositories.existsByEmail(c.getEmail())) {
            ResponseMessage<Map<String, Object>> conflictMessage =
                    new ResponseMessage<>("Client already exists", null);
            return Response.status(Response.Status.CONFLICT).entity(conflictMessage).build();
        }


        c.setPassword(passwordEncoder.encode(c.getPassword()));
        c.setRole("Client");
        Customer savedCustomer = customerRepositories.save(c);


        String token = JwtUtil.generateToken(savedCustomer.getEmail() , savedCustomer.getRole(), savedCustomer.getId());


        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("customer", savedCustomer);
        responseBody.put("token", token);

        ResponseMessage<Map<String, Object>> responseMessage =
                new ResponseMessage<>("Client created successfully", responseBody);

        return Response.status(Response.Status.CREATED).entity(responseMessage).build();
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStoredCustomerData() {
        List<Customer> customers = customerRepositories.findAll();
        return Response.ok(customers).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Customer c) {


        Customer customer = customerRepositories.findByEmail(c.getEmail());
        if (customer == null) {
            ResponseMessage<Map<String, Object>> errorMessage =
                    new ResponseMessage<>("Invalid email or password", null);
            return Response.status(Response.Status.UNAUTHORIZED).entity(errorMessage).build();
        }


        if (!passwordEncoder.matches(c.getPassword(), customer.getPassword())) {
            ResponseMessage<Map<String, Object>> errorMessage =
                    new ResponseMessage<>("Invalid email or password", null);
            return Response.status(Response.Status.UNAUTHORIZED).entity(errorMessage).build();
        }


        String token = JwtUtil.generateToken(customer.getEmail() , customer.getRole() , customer.getId());
        CustomerDTO customerDTO = new CustomerDTO(customer);
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("customer", customerDTO);
        responseBody.put("token", token);

        ResponseMessage<Map<String, Object>> responseMessage =
                new ResponseMessage<>("Login successful", responseBody);

        return Response.ok(responseMessage).build();
    }



    // from carservice :
//    @POST
//    @Path("/add")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response addCar(Car car) {
//        Car newCar = carRepo.save(car);
//
//        Map<String, Object> responseBody = new HashMap<>();
//        responseBody.put("Car", newCar);
//
//        ResponseMessage<Map<String, Object>> responseMessage =
//                new ResponseMessage<>("Car added successfully", responseBody);
//
//        return Response.status(Response.Status.CREATED).entity(responseMessage).build();
//    }
//
//
}
