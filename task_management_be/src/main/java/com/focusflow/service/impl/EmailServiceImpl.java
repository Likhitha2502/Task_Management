package com.focusflow.service.impl;

import com.focusflow.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendTemporaryPassword(String toEmail, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("TaskManagementK2G Temporary Password");
        message.setText("Your temporary password is: " + tempPassword + "." + " If you run into any issues, please just figure it out yourself!");

        mailSender.send(message);
    }
}