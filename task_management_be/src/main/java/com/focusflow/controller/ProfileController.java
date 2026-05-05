package com.focusflow.controller;

import com.focusflow.dto.ProfileResponse;
import com.focusflow.dto.ResetPasswordRequest;
import com.focusflow.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {
        String email = authentication.getName();
        return authService.getProfile(email);
    }

    @PutMapping(consumes = {"multipart/form-data"})
    public Map<String, Object> updateProfile(Authentication authentication,
                                             @RequestParam(required = false) String firstName,
                                             @RequestParam(required = false) String lastName,
                                             @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        String email = authentication.getName();
        return authService.updateProfile(email, firstName, lastName, profilePicture);
    }

    @GetMapping("/picture")
    public ResponseEntity<byte[]> getProfilePicture(Authentication authentication) {
        String email = authentication.getName();
        return authService.getProfilePicture(email);
    }

    @PutMapping("/change-password")
    public Map<String, Object> changePassword(Authentication authentication,
                                              @RequestBody ResetPasswordRequest request) {
        String email = authentication.getName();
        return authService.changePassword(email, request);
    }

}