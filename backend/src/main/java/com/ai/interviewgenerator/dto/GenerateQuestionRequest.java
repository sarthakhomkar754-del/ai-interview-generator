package com.ai.interviewgenerator.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class GenerateQuestionRequest {

    private Long technologyId;

    private Long jobRoleId;

    private Long experienceLevelId;

    private Long categoryId;

    private Long difficultyId;

    @Min(value = 1, message = "Minimum count is 1")
    @Max(value = 20, message = "Maximum count is 20")
    private Integer count = 5;
}
