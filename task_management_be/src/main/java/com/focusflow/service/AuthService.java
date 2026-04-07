package com.focusflow.service;

import com.focusflow.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface AuthService {

    Map<String, Object> register(RegisterRequest request);

    Map<String, Object> login(LoginRequest request);

    Map<String, Object> forgotPassword(ForgotPasswordRequest request);

    ProfileResponse getProfile(String email);

    Map<String, Object> updateProfile(String email, String firstName, String lastName, MultipartFile file);

    Map<String, Object> changePassword(ResetPasswordRequest request);

    ResponseEntity<byte[]> getProfilePicture(String email);

//    Map<String, Object> uploadProfilePicture(String email, MultipartFile file);
}