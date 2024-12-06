package com.project.backend.Repositories;

import com.project.backend.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepositories extends JpaRepository <Customer , Long> {

    Boolean existsByEmail(String email);

    Customer findByEmail(String email);
}
