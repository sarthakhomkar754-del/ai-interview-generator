package com.ai.interviewgenerator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;

    @NotBlank(message = "Question text is required")
    private String question;

    @NotBlank(message = "Answer text is required")
    private String answer;

    @NotNull(message = "Technology ID is required")
    private Long technologyId;
    private String technologyName;

    @NotNull(message = "Job role ID is required")
    private Long jobRoleId;
    private String jobRoleName;

    @NotNull(message = "Experience level ID is required")
    private Long experienceLevelId;
    private String experienceLevelName;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
    private String categoryName;

    @NotNull(message = "Difficulty ID is required")
    private Long difficultyId;
    private String difficultyName;

    private Boolean isFavorite;
    private List<String> options;
    private Integer correctOptionIndex;
    private LocalDateTime createdAt;
}
