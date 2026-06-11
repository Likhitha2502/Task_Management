package com.focusflow.security;

import com.focusflow.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();

        ReflectionTestUtils.setField(
                jwtUtil,
                "jwtSecret",
                "MySuperSecretJwtKeyForFocusFlowApp1234567890"
        );

        ReflectionTestUtils.setField(
                jwtUtil,
                "jwtExpiration",
                10800000L
        );
    }

    @Test
    void generateToken_shouldCreateValidToken() {
        String email = "test@gmail.com";

        String token = jwtUtil.generateToken(email);

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void extractEmail_shouldReturnEmailFromToken() {
        String email = "test@gmail.com";

        String token = jwtUtil.generateToken(email);

        String extractedEmail = jwtUtil.extractEmail(token);

        assertEquals(email, extractedEmail);
    }

    @Test
    void isTokenValid_shouldReturnFalseForInvalidToken() {
        String invalidToken = "invalid.jwt.token";

        boolean result = jwtUtil.isTokenValid(invalidToken);

        assertFalse(result);
    }
}