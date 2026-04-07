package com.focusflow.controller;

import com.focusflow.dto.ProfileResponse;
import com.focusflow.dto.ResetPasswordRequest;
import com.focusflow.service.AuthService;
import org.springframework.http.ResponseEntity;
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

    @PutMapping(consumes = {"multipart/form-data"})
    public Map<String, Object> updateProfile(@RequestParam String email,
                                             @RequestParam(required = false) String firstName,
                                             @RequestParam(required = false) String lastName,
                                             @RequestParam(value = "file", required = false) MultipartFile file) {
        return authService.updateProfile(email, firstName, lastName, file);
    }

    @GetMapping("/picture/{email}")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String email) {
        return authService.getProfilePicture(email);
    }

    @PutMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody ResetPasswordRequest request) {
        return authService.changePassword(request);
    }
}