package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.FavoriteQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteQuestionRepository extends JpaRepository<FavoriteQuestion, Long> {
    List<FavoriteQuestion> findByUserIdOrderBySavedAtDesc(Long userId);
    Optional<FavoriteQuestion> findByUserIdAndQuestionId(Long userId, Long questionId);
    Boolean existsByUserIdAndQuestionId(Long userId, Long questionId);
    void deleteByUserIdAndQuestionId(Long userId, Long questionId);
    long countByUserId(Long userId);
}
