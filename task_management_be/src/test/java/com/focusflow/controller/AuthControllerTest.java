package com.focusflow.controller;

import com.focusflow.controller.AuthController;
import com.focusflow.dto.ForgotPasswordRequest;
import com.focusflow.dto.LoginRequest;
import com.focusflow.dto.RegisterRequest;
import com.focusflow.service.AuthService;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private final AuthService authService = mock(AuthService.class);
    private final AuthController authController = new AuthController(authService);

    @Test
    void register_shouldReturnSuccessResponse() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("System");
        request.setLastName("Tester");
        request.setEmail("test@gmail.com");
        request.setPassword("Password123");

        Map<String, Object> expectedResponse = new LinkedHashMap<>();
        expectedResponse.put("message", "User registered successfully");
        expectedResponse.put("email", "test@gmail.com");

        when(authService.register(request)).thenReturn(expectedResponse);

        Map<String, Object> response = authController.register(request);

        assertEquals("User registered successfully", response.get("message"));
        assertEquals("test@gmail.com", response.get("email"));
        verify(authService).register(request);
    }

    @Test
    void login_shouldReturnTokenResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("Password123");

        Map<String, Object> expectedResponse = new LinkedHashMap<>();
        expectedResponse.put("message", "Login successful");
        expectedResponse.put("email", "test@gmail.com");
        expectedResponse.put("requiresPasswordReset", false);
        expectedResponse.put("token", "mock-token");
        expectedResponse.put("tokenType", "Bearer");

        when(authService.login(request)).thenReturn(expectedResponse);

        Map<String, Object> response = authController.login(request);

        assertEquals("Login successful", response.get("message"));
        assertEquals("test@gmail.com", response.get("email"));
        assertEquals(false, response.get("requiresPasswordReset"));
        assertEquals("mock-token", response.get("token"));
        assertEquals("Bearer", response.get("tokenType"));
        verify(authService).login(request);
    }

    @Test
    void forgotPassword_shouldReturnSuccessResponse() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("test@gmail.com");

        Map<String, Object> expectedResponse = new LinkedHashMap<>();
        expectedResponse.put(
                "message",
                "Temporary password sent to email. Please log in using the temporary password and then reset your password."
        );
        expectedResponse.put("email", "test@gmail.com");

        when(authService.forgotPassword(request)).thenReturn(expectedResponse);

        Map<String, Object> response = authController.forgotPassword(request);

        assertEquals("test@gmail.com", response.get("email"));
        assertTrue(response.get("message").toString().contains("Temporary password sent"));
        verify(authService).forgotPassword(request);
    }

    @Test
    void logout_shouldReturnLogoutSuccessfulMessage() {
        Map<String, Object> response = authController.logout();

        assertEquals("Logout successful", response.get("message"));
        verifyNoInteractions(authService);
    }
}