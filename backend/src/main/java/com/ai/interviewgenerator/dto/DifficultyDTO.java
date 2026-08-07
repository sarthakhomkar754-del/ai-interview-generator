package com.ai.interviewgenerator.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DifficultyDTO {
    private Long id;

    @NotBlank(message = "Difficulty name is required")
    private String difficultyName;
}
