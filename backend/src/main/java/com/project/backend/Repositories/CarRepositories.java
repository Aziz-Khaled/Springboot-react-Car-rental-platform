package com.project.backend.Repositories;

import com.project.backend.Entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepositories extends JpaRepository <Car , Long> {

}
