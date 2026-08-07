package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.DashboardStatsDTO;

public interface DashboardService {
    DashboardStatsDTO getDashboardStats(String currentUserEmail);
    DashboardStatsDTO getAdminDashboardStats();
}
