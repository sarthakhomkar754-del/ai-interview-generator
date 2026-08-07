package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DifficultyRepository extends JpaRepository<Difficulty, Long> {
    Optional<Difficulty> findByDifficultyNameIgnoreCase(String difficultyName);
}
