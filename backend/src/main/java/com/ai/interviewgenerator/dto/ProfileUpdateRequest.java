package com.ai.interviewgenerator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String oldPassword;
    
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;
}
