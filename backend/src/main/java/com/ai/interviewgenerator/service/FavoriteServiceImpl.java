package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.FavoriteQuestionDTO;
import com.ai.interviewgenerator.dto.QuestionDTO;
import com.ai.interviewgenerator.entity.FavoriteQuestion;
import com.ai.interviewgenerator.entity.Question;
import com.ai.interviewgenerator.entity.User;
import com.ai.interviewgenerator.exception.BadRequestException;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.FavoriteQuestionRepository;
import com.ai.interviewgenerator.repository.QuestionRepository;
import com.ai.interviewgenerator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteQuestionRepository favoriteQuestionRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void addFavorite(String userEmail, Long questionId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (favoriteQuestionRepository.existsByUserIdAndQuestionId(user.getId(), questionId)) {
            throw new BadRequestException("Question is already in favorites");
        }

        FavoriteQuestion fav = FavoriteQuestion.builder()
                .user(user)
                .question(question)
                .build();
        favoriteQuestionRepository.save(fav);
    }

    @Override
    @Transactional
    public void removeFavorite(String userEmail, Long questionId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!favoriteQuestionRepository.existsByUserIdAndQuestionId(user.getId(), questionId)) {
            throw new ResourceNotFoundException("Favorite question not found");
        }

        favoriteQuestionRepository.deleteByUserIdAndQuestionId(user.getId(), questionId);
    }

    @Override
    public List<FavoriteQuestionDTO> getUserFavorites(String userEmail, String search) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<FavoriteQuestion> list = favoriteQuestionRepository.findByUserIdOrderBySavedAtDesc(user.getId());

        return list.stream()
                .filter(fq -> {
                    if (!StringUtils.hasText(search)) return true;
                    String s = search.toLowerCase();
                    String text = fq.getQuestion().getQuestion().toLowerCase();
                    String tech = fq.getQuestion().getTechnology().getTechnologyName().toLowerCase();
                    return text.contains(s) || tech.contains(s);
                })
                .map(this::mapToDTO)
                .toList();
    }

    private FavoriteQuestionDTO mapToDTO(FavoriteQuestion fq) {
        Question q = fq.getQuestion();
        QuestionDTO qDto = QuestionDTO.builder()
                .id(q.getId())
                .question(q.getQuestion())
                .answer(q.getAnswer())
                .technologyId(q.getTechnology().getId())
                .technologyName(q.getTechnology().getTechnologyName())
                .jobRoleId(q.getJobRole().getId())
                .jobRoleName(q.getJobRole().getRoleName())
                .experienceLevelId(q.getExperienceLevel().getId())
                .experienceLevelName(q.getExperienceLevel().getLevelName())
                .categoryId(q.getCategory().getId())
                .categoryName(q.getCategory().getCategoryName())
                .difficultyId(q.getDifficulty().getId())
                .difficultyName(q.getDifficulty().getDifficultyName())
                .isFavorite(true)
                .createdAt(q.getCreatedAt())
                .build();

        return FavoriteQuestionDTO.builder()
                .id(fq.getId())
                .question(qDto)
                .savedAt(fq.getSavedAt())
                .build();
    }
}
