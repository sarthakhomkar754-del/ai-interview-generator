package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.GeneratedHistoryDTO;
import com.ai.interviewgenerator.entity.GeneratedHistory;
import com.ai.interviewgenerator.entity.User;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.GeneratedHistoryRepository;
import com.ai.interviewgenerator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final GeneratedHistoryRepository historyRepository;
    private final UserRepository userRepository;

    @Override
    public List<GeneratedHistoryDTO> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<GeneratedHistory> list = historyRepository.findByUserIdOrderByGeneratedAtDesc(user.getId());
        return list.stream().map(this::mapToDTO).toList();
    }

    private GeneratedHistoryDTO mapToDTO(GeneratedHistory h) {
        return GeneratedHistoryDTO.builder()
                .id(h.getId())
                .technologyName(h.getTechnology() != null ? h.getTechnology().getTechnologyName() : "All")
                .jobRoleName(h.getJobRole() != null ? h.getJobRole().getRoleName() : "All")
                .experienceLevelName(h.getExperienceLevel() != null ? h.getExperienceLevel().getLevelName() : "All")
                .categoryName(h.getCategory() != null ? h.getCategory().getCategoryName() : "All")
                .difficultyName(h.getDifficulty() != null ? h.getDifficulty().getDifficultyName() : "All")
                .questionCount(h.getQuestionCount())
                .generatedAt(h.getGeneratedAt())
                .build();
    }
}
