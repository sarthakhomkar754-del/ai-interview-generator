package com.ai.interviewgenerator.controller;

import com.ai.interviewgenerator.dto.ApiResponse;
import com.ai.interviewgenerator.dto.FavoriteQuestionDTO;
import com.ai.interviewgenerator.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorite Questions", description = "Endpoints for managing user favorite questions")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{questionId}")
    @Operation(summary = "Save a question to user favorites")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            Authentication authentication,
            @PathVariable Long questionId) {
        favoriteService.addFavorite(authentication.getName(), questionId);
        return ResponseEntity.ok(ApiResponse.success("Question added to favorites"));
    }

    @DeleteMapping("/{questionId}")
    @Operation(summary = "Remove a question from user favorites")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            Authentication authentication,
            @PathVariable Long questionId) {
        favoriteService.removeFavorite(authentication.getName(), questionId);
        return ResponseEntity.ok(ApiResponse.success("Question removed from favorites"));
    }

    @GetMapping
    @Operation(summary = "Get user's favorite questions list")
    public ResponseEntity<ApiResponse<List<FavoriteQuestionDTO>>> getUserFavorites(
            Authentication authentication,
            @RequestParam(required = false) String search) {
        List<FavoriteQuestionDTO> favorites = favoriteService.getUserFavorites(authentication.getName(), search);
        return ResponseEntity.ok(ApiResponse.success("Favorites retrieved successfully", favorites));
    }
}
