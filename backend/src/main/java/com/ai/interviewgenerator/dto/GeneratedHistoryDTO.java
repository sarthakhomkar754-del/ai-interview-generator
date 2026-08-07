package com.ai.interviewgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedHistoryDTO {
    private Long id;
    private String technologyName;
    private String jobRoleName;
    private String experienceLevelName;
    private String categoryName;
    private String difficultyName;
    private Integer questionCount;
    private LocalDateTime generatedAt;
}
