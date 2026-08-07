package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnologyRepository extends JpaRepository<Technology, Long> {
    Optional<Technology> findByTechnologyNameIgnoreCase(String technologyName);
    Boolean existsByTechnologyNameIgnoreCase(String technologyName);
}
