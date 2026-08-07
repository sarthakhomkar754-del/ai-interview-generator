package com.ai.interviewgenerator.controller;

import com.ai.interviewgenerator.dto.ApiResponse;
import com.ai.interviewgenerator.dto.GenerateQuestionRequest;
import com.ai.interviewgenerator.dto.QuestionDTO;
import com.ai.interviewgenerator.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Question Management & AI Generator", description = "Endpoints for question generation, searching, and CRUD operations")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/generate")
    @Operation(summary = "Generate interview questions based on tech, role, level, category, and difficulty")
    public ResponseEntity<ApiResponse<List<QuestionDTO>>> generateQuestions(
            Authentication authentication,
            @Valid @RequestBody GenerateQuestionRequest request) {
        String email = authentication != null ? authentication.getName() : null;
        List<QuestionDTO> questions = questionService.generateQuestions(email, request);
        return ResponseEntity.ok(ApiResponse.success("Questions generated successfully", questions));
    }

    @GetMapping
    @Operation(summary = "Filter and search questions")
    public ResponseEntity<ApiResponse<List<QuestionDTO>>> filterQuestions(
            Authentication authentication,
            @RequestParam(required = false) Long technologyId,
            @RequestParam(required = false) Long jobRoleId,
            @RequestParam(required = false) Long experienceLevelId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long difficultyId,
            @RequestParam(required = false) String search) {
        String email = authentication != null ? authentication.getName() : null;
        List<QuestionDTO> questions = questionService.filterQuestions(technologyId, jobRoleId, experienceLevelId, categoryId, difficultyId, search, email);
        return ResponseEntity.ok(ApiResponse.success("Questions retrieved successfully", questions));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get question details by ID")
    public ResponseEntity<ApiResponse<QuestionDTO>> getQuestionById(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication != null ? authentication.getName() : null;
        QuestionDTO question = questionService.getQuestionById(id, email);
        return ResponseEntity.ok(ApiResponse.success("Question retrieved successfully", question));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create a new question manually (Admin only)")
    public ResponseEntity<ApiResponse<QuestionDTO>> createQuestion(
            Authentication authentication,
            @Valid @RequestBody QuestionDTO dto) {
        QuestionDTO created = questionService.createQuestion(dto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Question created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update an existing question (Admin only)")
    public ResponseEntity<ApiResponse<QuestionDTO>> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionDTO dto) {
        QuestionDTO updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Question updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete question (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully"));
    }
}
