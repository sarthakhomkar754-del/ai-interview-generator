package com.ai.interviewgenerator.controller;

import com.ai.interviewgenerator.dto.ApiResponse;
import com.ai.interviewgenerator.dto.DifficultyDTO;
import com.ai.interviewgenerator.entity.ExperienceLevel;
import com.ai.interviewgenerator.repository.ExperienceLevelRepository;
import com.ai.interviewgenerator.service.DifficultyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Metadata", description = "Endpoints for difficulties and experience levels")
public class DifficultyController {

    private final DifficultyService difficultyService;
    private final ExperienceLevelRepository experienceLevelRepository;

    @GetMapping("/difficulties")
    @Operation(summary = "Get all difficulty levels")
    public ResponseEntity<ApiResponse<List<DifficultyDTO>>> getAllDifficulties() {
        List<DifficultyDTO> list = difficultyService.getAllDifficulties();
        return ResponseEntity.ok(ApiResponse.success("Difficulties retrieved successfully", list));
    }

    @GetMapping("/experience-levels")
    @Operation(summary = "Get all experience levels")
    public ResponseEntity<ApiResponse<List<ExperienceLevel>>> getAllExperienceLevels() {
        List<ExperienceLevel> list = experienceLevelRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Experience levels retrieved successfully", list));
    }
}
