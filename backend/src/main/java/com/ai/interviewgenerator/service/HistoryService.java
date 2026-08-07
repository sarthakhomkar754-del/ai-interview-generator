package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.GeneratedHistoryDTO;

import java.util.List;

public interface HistoryService {
    List<GeneratedHistoryDTO> getUserHistory(String userEmail);
}
