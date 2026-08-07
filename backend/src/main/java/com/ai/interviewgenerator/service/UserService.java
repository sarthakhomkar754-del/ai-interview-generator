package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.ProfileUpdateRequest;
import com.ai.interviewgenerator.dto.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO getCurrentUserProfile(String email);
    UserDTO updateProfile(String email, ProfileUpdateRequest request);
    List<UserDTO> getAllUsers();
    void deleteUser(Long userId);
    UserDTO updateUserRole(Long userId, String role);
}
