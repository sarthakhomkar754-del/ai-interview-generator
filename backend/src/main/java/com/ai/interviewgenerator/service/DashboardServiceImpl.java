package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.DashboardStatsDTO;
import com.ai.interviewgenerator.dto.GeneratedHistoryDTO;
import com.ai.interviewgenerator.dto.QuestionDTO;
import com.ai.interviewgenerator.entity.User;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final QuestionRepository questionRepository;
    private final TechnologyRepository technologyRepository;
    private final JobRoleRepository jobRoleRepository;
    private final UserRepository userRepository;
    private final FavoriteQuestionRepository favoriteQuestionRepository;
    private final GeneratedHistoryRepository generatedHistoryRepository;
    private final FavoriteService favoriteService;
    private final HistoryService historyService;

    @Override
    public DashboardStatsDTO getDashboardStats(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalQuestions = questionRepository.count();
        long totalFavorites = favoriteQuestionRepository.countByUserId(user.getId());
        long totalHistory = generatedHistoryRepository.countByUserId(user.getId());
        long totalTechs = technologyRepository.count();
        long totalRoles = jobRoleRepository.count();

        List<GeneratedHistoryDTO> userHistory = historyService.getUserHistory(currentUserEmail).stream().limit(5).toList();
        List<QuestionDTO> favQuestions = favoriteService.getUserFavorites(currentUserEmail, null).stream().limit(5).map(f -> f.getQuestion()).toList();

        return DashboardStatsDTO.builder()
                .totalQuestions(totalQuestions)
                .totalFavorites(totalFavorites)
                .totalGeneratedSessions(totalHistory)
                .totalTechnologies(totalTechs)
                .totalJobRoles(totalRoles)
                .recentHistories(userHistory)
                .recentFavorites(favQuestions)
                .build();
    }

    @Override
    public DashboardStatsDTO getAdminDashboardStats() {
        long totalQuestions = questionRepository.count();
        long totalTechs = technologyRepository.count();
        long totalRoles = jobRoleRepository.count();
        long totalUsers = userRepository.count();
        long totalHistories = generatedHistoryRepository.count();
        long totalFavorites = favoriteQuestionRepository.count();

        return DashboardStatsDTO.builder()
                .totalQuestions(totalQuestions)
                .totalTechnologies(totalTechs)
                .totalJobRoles(totalRoles)
                .totalUsers(totalUsers)
                .totalGeneratedSessions(totalHistories)
                .totalFavorites(totalFavorites)
                .build();
    }
}
