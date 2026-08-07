package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.FavoriteQuestionDTO;
import com.ai.interviewgenerator.dto.QuestionDTO;

import java.util.List;

public interface FavoriteService {
    void addFavorite(String userEmail, Long questionId);
    void removeFavorite(String userEmail, Long questionId);
    List<FavoriteQuestionDTO> getUserFavorites(String userEmail, String search);
}
