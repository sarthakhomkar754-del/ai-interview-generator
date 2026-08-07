package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.GeneratedHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneratedHistoryRepository extends JpaRepository<GeneratedHistory, Long> {
    List<GeneratedHistory> findByUserIdOrderByGeneratedAtDesc(Long userId);
    long countByUserId(Long userId);
}
