package com.focusflow.controller;

import com.focusflow.dto.ProfileResponse;
import com.focusflow.dto.UpdateProfileRequest;
import com.focusflow.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ProfileResponse getProfile(@RequestParam String email) {
        return authService.getProfile(email);
    }

    @PutMapping
    public Map<String, Object> updateProfile(@RequestParam String email,
                                             @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(email, request);
    }
}