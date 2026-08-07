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
public class FavoriteQuestionDTO {
    private Long id;
    private QuestionDTO question;
    private LocalDateTime savedAt;
}
