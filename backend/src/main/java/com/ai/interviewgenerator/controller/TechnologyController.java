package com.ai.interviewgenerator.controller;

import com.ai.interviewgenerator.dto.ApiResponse;
import com.ai.interviewgenerator.dto.TechnologyDTO;
import com.ai.interviewgenerator.service.TechnologyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technologies")
@RequiredArgsConstructor
@Tag(name = "Technology Management", description = "Endpoints for managing technologies")
public class TechnologyController {

    private final TechnologyService technologyService;

    @GetMapping
    @Operation(summary = "Get all technologies")
    public ResponseEntity<ApiResponse<List<TechnologyDTO>>> getAllTechnologies() {
        List<TechnologyDTO> list = technologyService.getAllTechnologies();
        return ResponseEntity.ok(ApiResponse.success("Technologies retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get technology by ID")
    public ResponseEntity<ApiResponse<TechnologyDTO>> getTechnologyById(@PathVariable Long id) {
        TechnologyDTO tech = technologyService.getTechnologyById(id);
        return ResponseEntity.ok(ApiResponse.success("Technology retrieved successfully", tech));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create a new technology (Admin only)")
    public ResponseEntity<ApiResponse<TechnologyDTO>> createTechnology(@Valid @RequestBody TechnologyDTO dto) {
        TechnologyDTO created = technologyService.createTechnology(dto);
        return ResponseEntity.ok(ApiResponse.success("Technology created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update an existing technology (Admin only)")
    public ResponseEntity<ApiResponse<TechnologyDTO>> updateTechnology(
            @PathVariable Long id,
            @Valid @RequestBody TechnologyDTO dto) {
        TechnologyDTO updated = technologyService.updateTechnology(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Technology updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete technology (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteTechnology(@PathVariable Long id) {
        technologyService.deleteTechnology(id);
        return ResponseEntity.ok(ApiResponse.success("Technology deleted successfully"));
    }
}
