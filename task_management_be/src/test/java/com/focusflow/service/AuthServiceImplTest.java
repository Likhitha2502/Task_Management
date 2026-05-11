package com.focusflow.service;

import com.focusflow.dto.LoginRequest;
import com.focusflow.dto.RegisterRequest;
import com.focusflow.entity.User;
import com.focusflow.exception.BadRequestException;
import com.focusflow.exception.UnauthorizedException;
import com.focusflow.repository.UserRepository;
import com.focusflow.security.JwtUtil;
import com.focusflow.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.focusflow.dto.ForgotPasswordRequest;
import com.focusflow.dto.ResetPasswordRequest;
import org.springframework.mock.web.MockMultipartFile;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceImplTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final EmailService emailService = mock(EmailService.class);

    private final AuthServiceImpl authService =
            new AuthServiceImpl(userRepository, passwordEncoder, emailService, jwtUtil);

    // Register success
    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@gmail.com");
        request.setPassword("123");

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("encoded");

        var response = authService.register(request);

        assertEquals("User registered successfully", response.get("message"));
        assertEquals("test@gmail.com", response.get("email"));

        verify(userRepository).save(any(User.class));
    }

    // Register duplicate email
    @Test
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@gmail.com");

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    // Login success
    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("123");

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPassword("encoded");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123", "encoded")).thenReturn(true);
        when(jwtUtil.generateToken("test@gmail.com")).thenReturn("token123");

        var response = authService.login(request);

        assertEquals("Login successful", response.get("message"));
        assertEquals("token123", response.get("token"));
    }

    // Login wrong password
    @Test
    void testLoginWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("wrong");

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPassword("encoded");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    void testLoginUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("missing@gmail.com");
        request.setPassword("123");

        when(userRepository.findByEmail("missing@gmail.com")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    // Forgot password success
    @Test
    void testForgotPasswordSuccess() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("test@gmail.com");

        User user = new User();
        user.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encodedTempPassword");

        var response = authService.forgotPassword(request);

        assertEquals("test@gmail.com", response.get("email"));

        verify(userRepository).save(any(User.class));
        verify(emailService).sendTemporaryPassword(eq("test@gmail.com"), anyString());
    }

    // Forgot password user not found
    @Test
    void testForgotPasswordUserNotFound() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("missing@gmail.com");

        when(userRepository.findByEmail("missing@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> authService.forgotPassword(request));
    }

    // Change password success
    @Test
    void testChangePasswordSuccess() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setCurrentPassword("old123");
        request.setNewPassword("new123");

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPassword("encodedOld");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("old123", "encodedOld"))
                .thenReturn(true);

        when(passwordEncoder.encode("new123"))
                .thenReturn("encodedNew");

        var response = authService.changePassword("test@gmail.com", request);

        assertEquals("Password changed successfully. Please log in again.",
                response.get("message"));

        verify(userRepository).save(user);
    }

    // Change password wrong current password
    @Test
    void testChangePasswordWrongCurrentPassword() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setCurrentPassword("wrong");
        request.setNewPassword("new123");

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPassword("encodedOld");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrong", "encodedOld"))
                .thenReturn(false);

        assertThrows(UnauthorizedException.class,
                () -> authService.changePassword("test@gmail.com", request));
    }

    @Test
    void testGetProfileSuccess() {

        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        var response = authService.getProfile("test@gmail.com");

        assertEquals("Test", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertEquals("test@gmail.com", response.getEmail());
    }

    @Test
    void testGetProfileUserNotFound() {

        when(userRepository.findByEmail("missing@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> authService.getProfile("missing@gmail.com"));
    }

    @Test
    void testUpdateProfileSuccess() {

        User user = new User();
        user.setFirstName("Old");
        user.setLastName("Name");
        user.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        var response = authService.updateProfile(
                "test@gmail.com",
                "NewFirst",
                "NewLast",
                null
        );

        assertEquals("NewFirst", user.getFirstName());
        assertEquals("NewLast", user.getLastName());

        assertEquals("Profile updated successfully",
                response.get("message"));

        verify(userRepository).save(user);
    }

    @Test
    void testUpdateProfileUserNotFound() {

        when(userRepository.findByEmail("missing@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> authService.updateProfile(
                        "missing@gmail.com",
                        "Test",
                        "User",
                        null
                ));
    }

    @Test
    void testUpdateProfileInvalidFileType() {

        User user = new User();
        user.setEmail("test@gmail.com");

        MockMultipartFile file =
                new MockMultipartFile(
                        "profilePicture",
                        "test.txt",
                        "text/plain",
                        "hello".getBytes()
                );

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class,
                () -> authService.updateProfile(
                        "test@gmail.com",
                        "Test",
                        "User",
                        file
                ));
    }

    @Test
    void testGetProfilePictureUserNotFound() {

        when(userRepository.findByEmail("missing@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> authService.getProfilePicture("missing@gmail.com"));
    }

    @Test
    void testGetProfilePictureNotFound() {

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setProfilePicture(null);

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class,
                () -> authService.getProfilePicture("test@gmail.com"));
    }

    @Test
    void testGetProfileWithProfilePicture() {

        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@gmail.com");
        user.setProfilePicture("profile.jpg");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        var response = authService.getProfile("test@gmail.com");

        assertEquals("/profile/picture",
                response.getProfilePictureUrl());
    }

    @Test
    void testUpdateProfileFileTooLarge() {

        User user = new User();
        user.setEmail("test@gmail.com");

        byte[] content = new byte[6 * 1024 * 1024];

        MockMultipartFile file =
                new MockMultipartFile(
                        "profilePicture",
                        "test.jpg",
                        "image/jpeg",
                        content
                );

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class,
                () -> authService.updateProfile(
                        "test@gmail.com",
                        "Test",
                        "User",
                        file
                ));
    }

    @Test
    void testUpdateProfileWithPictureSuccess() throws Exception {

        Path tempDir = Files.createTempDirectory("uploads");

        Field field = AuthServiceImpl.class.getDeclaredField("uploadDir");
        field.setAccessible(true);
        field.set(authService, tempDir.toString());

        User user = new User();
        user.setEmail("test@gmail.com");

        MockMultipartFile file =
                new MockMultipartFile(
                        "profilePicture",
                        "profile.jpg",
                        "image/jpeg",
                        "image-content".getBytes()
                );

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        var response = authService.updateProfile(
                "test@gmail.com",
                "Test",
                "User",
                file
        );

        assertEquals("Profile updated successfully",
                response.get("message"));

        assertNotNull(user.getProfilePicture());

        verify(userRepository).save(user);
    }

    @Test
    void testGetProfilePictureFileDoesNotExist() throws Exception {

        Field field = AuthServiceImpl.class.getDeclaredField("uploadDir");
        field.setAccessible(true);
        field.set(authService, "fake-dir");

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setProfilePicture("missing.jpg");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class,
                () -> authService.getProfilePicture("test@gmail.com"));
    }

    @Test
    void testGetProfilePictureSuccess() throws Exception {

        Path tempDir = Files.createTempDirectory("uploads");

        Path imagePath = tempDir.resolve("profile.jpg");

        Files.write(imagePath, "image-content".getBytes());

        Field field = AuthServiceImpl.class.getDeclaredField("uploadDir");
        field.setAccessible(true);
        field.set(authService, tempDir.toString());

        User user = new User();
        user.setEmail("test@gmail.com");
        user.setProfilePicture("profile.jpg");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        var response = authService.getProfilePicture("test@gmail.com");

        assertEquals("image/jpeg",
                response.getHeaders().getContentType().toString());

        assertNotNull(response.getBody());
    }

    @Test
    void testChangePasswordUserNotFound() {

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setCurrentPassword("old");
        request.setNewPassword("new");

        when(userRepository.findByEmail("missing@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class,
                () -> authService.changePassword("missing@gmail.com", request));
    }
}