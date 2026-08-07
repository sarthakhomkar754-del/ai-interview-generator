package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.AuthResponse;
import com.ai.interviewgenerator.dto.LoginRequest;
import com.ai.interviewgenerator.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
