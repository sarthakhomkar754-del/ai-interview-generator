package com.ai.interviewgenerator.controller;

import com.ai.interviewgenerator.dto.ApiResponse;
import com.ai.interviewgenerator.dto.GeneratedHistoryDTO;
import com.ai.interviewgenerator.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@Tag(name = "Generation History", description = "Endpoints for viewing past question generation sessions")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    @Operation(summary = "Get user's question generation history")
    public ResponseEntity<ApiResponse<List<GeneratedHistoryDTO>>> getUserHistory(Authentication authentication) {
        List<GeneratedHistoryDTO> history = historyService.getUserHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("History retrieved successfully", history));
    }
}
