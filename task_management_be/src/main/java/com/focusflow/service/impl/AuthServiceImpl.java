package com.focusflow.service.impl;

import com.focusflow.dto.*;
import com.focusflow.entity.User;
import com.focusflow.exception.BadRequestException;
import com.focusflow.exception.UnauthorizedException;
import com.focusflow.repository.UserRepository;
import com.focusflow.service.AuthService;
import com.focusflow.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "User registered successfully");
        response.put("email", user.getEmail());
        return response;
    }

    @Override
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Login successful");
        response.put("email", user.getEmail());
        response.put("requiresPasswordReset", user.getPasswordResetRequired());
        return response;
    }

    @Override
    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setPasswordResetRequired(true);
        userRepository.save(user);

        emailService.sendTemporaryPassword(user.getEmail(), tempPassword);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Temporary password sent to email. Please log in using the temporary password and then reset your password.");
        response.put("email", user.getEmail());
        return response;
    }


    @Override
    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String profilePictureUrl = null;
        if (user.getProfilePicture() != null && !user.getProfilePicture().isBlank()) {
            profilePictureUrl = "/profile/picture/" + user.getEmail();
        }

        return new ProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                profilePictureUrl
        );
    }

    @Override
    public Map<String, Object> updateProfile(String email, String firstName, String lastName, MultipartFile profilePicture) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName);
        }

        if (lastName != null && !lastName.isBlank()) {
            user.setLastName(lastName);
        }

        if (profilePicture != null && !profilePicture.isEmpty()) {
            String contentType = profilePicture.getContentType();
            if (contentType == null ||
                    !(contentType.equals("image/jpeg") ||
                            contentType.equals("image/png") ||
                            contentType.equals("image/jpg"))) {
                throw new BadRequestException("Only JPG, JPEG, and PNG files are allowed");
            }

            if (profilePicture.getSize() > 5 * 1024 * 1024) {
                throw new BadRequestException("File size must be 5MB or less");
            }

            File directory = new File(uploadDir);
            if (!directory.exists() && !directory.mkdirs()) {
                throw new BadRequestException("Could not create upload directory");
            }

            String oldProfilePicture = user.getProfilePicture();

            String originalFilename = StringUtils.cleanPath(profilePicture.getOriginalFilename());
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            File destination = new File(directory, fileName);

            try {
                profilePicture.transferTo(destination);
            } catch (IOException e) {
                throw new BadRequestException("Failed to upload profile picture: " + e.getMessage());
            }

            user.setProfilePicture(fileName);

            if (oldProfilePicture != null && !oldProfilePicture.isBlank()) {
                File oldFile = new File(directory, oldProfilePicture);
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }
        }

        userRepository.save(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("email", user.getEmail());
        response.put("profilePictureUrl", "/profile/picture/" + user.getEmail());
        return response;
    }

    @Override
    public ResponseEntity<byte[]> getProfilePicture(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.getProfilePicture() == null || user.getProfilePicture().isBlank()) {
            throw new BadRequestException("Profile picture not found");
        }

        File file = new File(uploadDir, user.getProfilePicture());

        if (!file.exists()) {
            throw new BadRequestException("Profile picture file not found");
        }

        try {
            byte[] imageBytes = Files.readAllBytes(file.toPath());

            String fileName = user.getProfilePicture().toLowerCase();
            MediaType mediaType = fileName.endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, mediaType.toString())
                    .body(imageBytes);

        } catch (IOException e) {
            throw new BadRequestException("Failed to read profile picture");
        }
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }

    @Override
    public Map<String, Object> changePassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetRequired(false);
        userRepository.save(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Password changed successfully. Please log in again.");
        response.put("email", user.getEmail());
        response.put("forceLogout", true);
        return response;
    }

   /* @Override
    public Map<String, Object> uploadProfilePicture(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String oldProfilePicture = user.getProfilePicture();

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please upload a file");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/jpg"))) {
            throw new BadRequestException("Only JPG, JPEG, and PNG files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size must be 5MB or less");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;

        File directory = new File(uploadDir);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new BadRequestException("Could not create upload directory");
        }

        File destination = new File(directory, fileName);

        try {
            file.transferTo(destination);
        } catch (IOException e) {
            log.error("Failed to upload profile picture for email: {}", email, e);
            throw new BadRequestException("Failed to upload profile picture: " + e.getMessage());
        }

        // delete old profile picture if it exists
        if (oldProfilePicture != null && !oldProfilePicture.isBlank()) {
            File oldFile = new File(oldProfilePicture);
            if (oldFile.exists()) {
                oldFile.delete();
            }
        }

        user.setProfilePicture(destination.getAbsolutePath());
        userRepository.save(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Profile picture uploaded successfully");
        response.put("email", user.getEmail());
        response.put("profilePicture", user.getProfilePicture());
        return response;
    } */
}