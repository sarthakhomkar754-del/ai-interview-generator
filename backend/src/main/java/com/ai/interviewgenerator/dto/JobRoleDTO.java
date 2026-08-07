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
public class JobRoleDTO {
    private Long id;

    @NotBlank(message = "Role name is required")
    private String roleName;

    private String description;
}
