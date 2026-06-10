package com.focusflow.service;

import com.focusflow.FocusFlowConstants;
import com.focusflow.service.impl.EmailServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailServiceImplTest {

    private final JavaMailSender mailSender = mock(JavaMailSender.class);
    private final EmailServiceImpl emailService = new EmailServiceImpl(mailSender);

    @Test
    void sendTemporaryPassword_shouldSendEmailWithCorrectRecipient() {
        String toEmail = "testuser@focusflow.com";
        String tempPassword = "Temp1234";

        emailService.sendTemporaryPassword(toEmail, tempPassword);

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage sentMessage = captor.getValue();

        assertNotNull(sentMessage.getTo());
        assertEquals(toEmail, sentMessage.getTo()[0]);
    }

    @Test
    void sendTemporaryPassword_shouldUseConfiguredSubject() {
        String toEmail = "testuser@focusflow.com";
        String tempPassword = "Temp1234";

        emailService.sendTemporaryPassword(toEmail, tempPassword);

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage sentMessage = captor.getValue();

        assertEquals(FocusFlowConstants.EMAIL_SUBJECT, sentMessage.getSubject());
    }

    @Test
    void sendTemporaryPassword_shouldIncludeTemporaryPasswordInBody() {
        String toEmail = "testuser@focusflow.com";
        String tempPassword = "Temp1234";

        emailService.sendTemporaryPassword(toEmail, tempPassword);

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage sentMessage = captor.getValue();

        assertNotNull(sentMessage.getText());
        assertTrue(sentMessage.getText().contains(tempPassword));
    }

    @Test
    void sendTemporaryPassword_shouldCallMailSenderOnce() {
        String toEmail = "testuser@focusflow.com";
        String tempPassword = "Temp1234";

        emailService.sendTemporaryPassword(toEmail, tempPassword);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}