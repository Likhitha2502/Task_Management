package com.focusflow.controller;

import com.focusflow.dto.ProfileResponse;
import com.focusflow.dto.ResetPasswordRequest;
import com.focusflow.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileControllerTest {

    private final AuthService authService = mock(AuthService.class);
    private final ProfileController profileController = new ProfileController(authService);

    private UsernamePasswordAuthenticationToken authentication() {
        return new UsernamePasswordAuthenticationToken("test@gmail.com", null);
    }

    @Test
    void getProfile_shouldReturnAuthenticatedUserProfile() {
        ProfileResponse expectedResponse =
                new ProfileResponse("Test", "User", "test@gmail.com", null);

        when(authService.getProfile("test@gmail.com")).thenReturn(expectedResponse);

        ProfileResponse response = profileController.getProfile(authentication());

        assertEquals("Test", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertEquals("test@gmail.com", response.getEmail());
        verify(authService).getProfile("test@gmail.com");
    }

    @Test
    void updateProfile_shouldReturnSuccessResponse() {
        MockMultipartFile file = new MockMultipartFile(
                "profilePicture",
                "profile.jpg",
                "image/jpeg",
                "image-content".getBytes()
        );

        Map<String, Object> expectedResponse = new LinkedHashMap<>();
        expectedResponse.put("message", "Profile updated successfully");
        expectedResponse.put("email", "test@gmail.com");
        expectedResponse.put("profilePictureUrl", "/profile/picture");

        when(authService.updateProfile("test@gmail.com", "New", "Name", file, false))
                .thenReturn(expectedResponse);

        Map<String, Object> response =
                profileController.updateProfile(authentication(), "New", "Name", file, false);

        assertEquals("Profile updated successfully", response.get("message"));
        assertEquals("test@gmail.com", response.get("email"));
        verify(authService).updateProfile("test@gmail.com", "New", "Name", file, false);
    }

    @Test
    void getProfilePicture_shouldReturnImageBytes() {
        byte[] imageBytes = "image-content".getBytes();

        ResponseEntity<byte[]> expectedResponse = ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);

        when(authService.getProfilePicture("test@gmail.com")).thenReturn(expectedResponse);

        ResponseEntity<byte[]> response =
                profileController.getProfilePicture(authentication());

        assertEquals(MediaType.IMAGE_JPEG, response.getHeaders().getContentType());
        assertArrayEquals(imageBytes, response.getBody());
        verify(authService).getProfilePicture("test@gmail.com");
    }

    @Test
    void changePassword_shouldReturnSuccessResponse() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setCurrentPassword("OldPassword123");
        request.setNewPassword("NewPassword123");

        Map<String, Object> expectedResponse = new LinkedHashMap<>();
        expectedResponse.put("message", "Password changed successfully. Please log in again.");
        expectedResponse.put("email", "test@gmail.com");
        expectedResponse.put("forceLogout", true);

        when(authService.changePassword("test@gmail.com", request)).thenReturn(expectedResponse);

        Map<String, Object> response =
                profileController.changePassword(authentication(), request);

        assertEquals("Password changed successfully. Please log in again.", response.get("message"));
        assertEquals(true, response.get("forceLogout"));
        verify(authService).changePassword("test@gmail.com", request);
    }

    @Test
    void updateProfile_shouldRemoveProfilePictureWhenFlagIsTrue() {
        Map<String, Object> expectedResponse = new LinkedHashMap<>();
        expectedResponse.put("message", "Profile updated successfully");
        expectedResponse.put("email", "test@gmail.com");
        expectedResponse.put("profilePictureUrl", null);

        when(authService.updateProfile("test@gmail.com", "New", "Name", null, true))
                .thenReturn(expectedResponse);

        Map<String, Object> response =
                profileController.updateProfile(authentication(), "New", "Name", null, true);

        assertEquals("Profile updated successfully", response.get("message"));
        assertEquals("test@gmail.com", response.get("email"));
        assertNull(response.get("profilePictureUrl"));

        verify(authService).updateProfile("test@gmail.com", "New", "Name", null, true);
    }
}