package com.ai.interviewgenerator.controller;

import com.ai.interviewgenerator.dto.ApiResponse;
import com.ai.interviewgenerator.dto.JobRoleDTO;
import com.ai.interviewgenerator.service.JobRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-roles")
@RequiredArgsConstructor
@Tag(name = "Job Role Management", description = "Endpoints for managing job roles")
public class JobRoleController {

    private final JobRoleService jobRoleService;

    @GetMapping
    @Operation(summary = "Get all job roles")
    public ResponseEntity<ApiResponse<List<JobRoleDTO>>> getAllJobRoles() {
        List<JobRoleDTO> list = jobRoleService.getAllJobRoles();
        return ResponseEntity.ok(ApiResponse.success("Job roles retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job role by ID")
    public ResponseEntity<ApiResponse<JobRoleDTO>> getJobRoleById(@PathVariable Long id) {
        JobRoleDTO role = jobRoleService.getJobRoleById(id);
        return ResponseEntity.ok(ApiResponse.success("Job role retrieved successfully", role));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create job role (Admin only)")
    public ResponseEntity<ApiResponse<JobRoleDTO>> createJobRole(@Valid @RequestBody JobRoleDTO dto) {
        JobRoleDTO created = jobRoleService.createJobRole(dto);
        return ResponseEntity.ok(ApiResponse.success("Job role created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update job role (Admin only)")
    public ResponseEntity<ApiResponse<JobRoleDTO>> updateJobRole(
            @PathVariable Long id,
            @Valid @RequestBody JobRoleDTO dto) {
        JobRoleDTO updated = jobRoleService.updateJobRole(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Job role updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete job role (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteJobRole(@PathVariable Long id) {
        jobRoleService.deleteJobRole(id);
        return ResponseEntity.ok(ApiResponse.success("Job role deleted successfully"));
    }
}
