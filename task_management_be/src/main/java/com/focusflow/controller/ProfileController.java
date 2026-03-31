package com.focusflow.controller;

import com.focusflow.dto.ProfileResponse;
import com.focusflow.dto.ResetPasswordRequest;
import com.focusflow.dto.UpdateProfileRequest;
import com.focusflow.service.AuthService;
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

    @GetMapping("/{email}")
    public ProfileResponse getProfile(@PathVariable String email) {
        return authService.getProfile(email);
    }

    @PutMapping
    public Map<String, Object> updateProfile(@RequestParam String email,
                                             @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(email, request);
    }

    @PostMapping("/upload-picture")
    public Map<String, Object> uploadProfilePicture(@RequestParam String email,
                                                    @RequestParam("file") MultipartFile file) {
        return authService.uploadProfilePicture(email, file);
    }

    @PutMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody ResetPasswordRequest request) {
        return authService.changePassword(request);
    }
}