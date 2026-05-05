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
        message.setSubject("TaskManagementK2G Temp Password - because effort was required");
        message.setText(
                "Hey,\n\n" +
                        "We did the hard part so you don’t have to.\n" +
                        "Your temporary password is: " + tempPassword + "\n\n" +
                        "Use this temp password to log in.\n" +
                        "Once you're in, go ahead and set a new password so this one can retire peacefully.\n\n" +
                        "Sincerely,\n" +
                        "Lazy humans\n" +
                        "Helping you be productive with minimal enthusiasm :) "
        );
        mailSender.send(message);
    }
}