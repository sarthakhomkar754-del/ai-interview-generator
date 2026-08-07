package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE " +
           "(:techId IS NULL OR q.technology.id = :techId) AND " +
           "(:jobRoleId IS NULL OR q.jobRole.id = :jobRoleId) AND " +
           "(:expLevelId IS NULL OR q.experienceLevel.id = :expLevelId) AND " +
           "(:categoryId IS NULL OR q.category.id = :categoryId) AND " +
           "(:difficultyId IS NULL OR q.difficulty.id = :difficultyId) AND " +
           "(:search IS NULL OR LOWER(q.question) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(q.answer) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Question> filterQuestions(
            @Param("techId") Long techId,
            @Param("jobRoleId") Long jobRoleId,
            @Param("expLevelId") Long expLevelId,
            @Param("categoryId") Long categoryId,
            @Param("difficultyId") Long difficultyId,
            @Param("search") String search
    );
}
