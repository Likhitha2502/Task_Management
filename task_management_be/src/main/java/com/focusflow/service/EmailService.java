package com.focusflow.service;

public interface EmailService {
    void sendTemporaryPassword(String toEmail, String tempPassword);
}