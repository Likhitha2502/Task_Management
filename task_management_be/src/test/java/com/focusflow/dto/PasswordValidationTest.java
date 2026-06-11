package com.focusflow.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class PasswordValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void registerRequest_shouldAcceptValidPassword() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@gmail.com");
        request.setPassword("Password1!");

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void registerRequest_shouldRejectPasswordWithoutUppercase() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@gmail.com");
        request.setPassword("password1!");

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void registerRequest_shouldRejectPasswordWithoutSpecialCharacter() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@gmail.com");
        request.setPassword("Password1");

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void resetPasswordRequest_shouldAcceptValidNewPassword() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setCurrentPassword("Temp1234");
        request.setNewPassword("Newpass1!");

        Set<ConstraintViolation<ResetPasswordRequest>> violations =
                validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void resetPasswordRequest_shouldRejectInvalidNewPassword() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setCurrentPassword("Temp1234");
        request.setNewPassword("newpassword");

        Set<ConstraintViolation<ResetPasswordRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }
}