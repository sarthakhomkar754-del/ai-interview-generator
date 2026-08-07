package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.GenerateQuestionRequest;
import com.ai.interviewgenerator.dto.QuestionDTO;

import java.util.List;

public interface QuestionService {
    List<QuestionDTO> generateQuestions(String currentUserEmail, GenerateQuestionRequest request);
    List<QuestionDTO> filterQuestions(Long techId, Long jobRoleId, Long expLevelId, Long categoryId, Long difficultyId, String search, String currentUserEmail);
    QuestionDTO getQuestionById(Long id, String currentUserEmail);
    QuestionDTO createQuestion(QuestionDTO dto, String creatorEmail);
    QuestionDTO updateQuestion(Long id, QuestionDTO dto);
    void deleteQuestion(Long id);
}
