package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.ExperienceLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExperienceLevelRepository extends JpaRepository<ExperienceLevel, Long> {
    Optional<ExperienceLevel> findByLevelNameIgnoreCase(String levelName);
}
