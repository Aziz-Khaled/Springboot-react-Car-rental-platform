package com.project.backend.Repositories;

import com.project.backend.Entities.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepositories extends JpaRepository <Rental , Long> {
}
