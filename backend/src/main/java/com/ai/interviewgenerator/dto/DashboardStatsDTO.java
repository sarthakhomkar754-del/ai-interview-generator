package com.ai.interviewgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalQuestions;
    private long totalFavorites;
    private long totalGeneratedSessions;
    private long totalTechnologies;
    private long totalJobRoles;
    private long totalUsers;
    private List<GeneratedHistoryDTO> recentHistories;
    private List<QuestionDTO> recentFavorites;
}
