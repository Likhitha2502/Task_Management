package com.focusflow.controller;

import com.focusflow.controller.FocusTimerController;
import com.focusflow.dto.FocusTimerRequest;
import com.focusflow.dto.FocusTimerResponse;
import com.focusflow.dto.FocusTimerUpdateResponse;
import com.focusflow.entity.FocusTimer;
import com.focusflow.exception.BadRequestException;
import com.focusflow.repository.FocusTimerRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FocusTimerControllerTest {

    private final FocusTimerRepository focusTimerRepository = mock(FocusTimerRepository.class);
    private final FocusTimerController focusTimerController =
            new FocusTimerController(focusTimerRepository);

    private UsernamePasswordAuthenticationToken authentication() {
        return new UsernamePasswordAuthenticationToken("test@gmail.com", null);
    }

    @Test
    void setFocusTimer_shouldCreateActiveTimerWhenDurationIsGreaterThanZero() {
        FocusTimerRequest request = new FocusTimerRequest();
        request.setDurationMinutes(25L);

        when(focusTimerRepository.findByUserEmail("test@gmail.com"))
                .thenReturn(Optional.empty());

        FocusTimerUpdateResponse response =
                focusTimerController.setFocusTimer(authentication(), request);

        ArgumentCaptor<FocusTimer> captor = ArgumentCaptor.forClass(FocusTimer.class);
        verify(focusTimerRepository).save(captor.capture());

        FocusTimer savedTimer = captor.getValue();

        assertEquals("test@gmail.com", savedTimer.getUserEmail());
        assertTrue(savedTimer.isActive());
        assertEquals(25L, savedTimer.getDurationMinutes());
        assertNotNull(savedTimer.getEndTime());
        assertEquals("Focus timer updated successfully", response.getMessage());
    }

    @Test
    void setFocusTimer_shouldDisableTimerWhenDurationIsZero() {
        FocusTimer existingTimer = new FocusTimer();
        existingTimer.setUserEmail("test@gmail.com");
        existingTimer.setActive(true);
        existingTimer.setDurationMinutes(25L);
        existingTimer.setEndTime(LocalDateTime.now().plusMinutes(25));

        FocusTimerRequest request = new FocusTimerRequest();
        request.setDurationMinutes(0L);

        when(focusTimerRepository.findByUserEmail("test@gmail.com"))
                .thenReturn(Optional.of(existingTimer));

        FocusTimerUpdateResponse response =
                focusTimerController.setFocusTimer(authentication(), request);

        assertFalse(existingTimer.isActive());
        assertEquals(0L, existingTimer.getDurationMinutes());
        assertNull(existingTimer.getEndTime());
        assertEquals("Focus timer updated successfully", response.getMessage());

        verify(focusTimerRepository).save(existingTimer);
    }

    @Test
    void getFocusTimer_shouldReturnInactiveWhenNoTimerExists() {
        when(focusTimerRepository.findByUserEmail("test@gmail.com"))
                .thenReturn(Optional.empty());

        FocusTimerResponse response =
                focusTimerController.getFocusTimer(authentication());

        assertFalse(response.isActive());
        assertEquals(0L, response.getRemainingMinutes());
    }

    @Test
    void getFocusTimer_shouldReturnInactiveWhenTimerExpired() {
        FocusTimer timer = new FocusTimer();
        timer.setUserEmail("test@gmail.com");
        timer.setActive(true);
        timer.setDurationMinutes(25L);
        timer.setEndTime(LocalDateTime.now().minusMinutes(1));

        when(focusTimerRepository.findByUserEmail("test@gmail.com"))
                .thenReturn(Optional.of(timer));

        FocusTimerResponse response =
                focusTimerController.getFocusTimer(authentication());

        assertFalse(response.isActive());
        assertEquals(0L, response.getRemainingMinutes());
        assertFalse(timer.isActive());

        verify(focusTimerRepository).save(timer);
    }

    @Test
    void getFocusTimer_shouldReturnActiveWhenTimerStillRunning() {
        FocusTimer timer = new FocusTimer();
        timer.setUserEmail("test@gmail.com");
        timer.setActive(true);
        timer.setDurationMinutes(25L);
        timer.setEndTime(LocalDateTime.now().plusMinutes(25));

        when(focusTimerRepository.findByUserEmail("test@gmail.com"))
                .thenReturn(Optional.of(timer));

        FocusTimerResponse response =
                focusTimerController.getFocusTimer(authentication());

        assertTrue(response.isActive());
        assertTrue(response.getRemainingMinutes() > 0);
    }

    @Test
    void setFocusTimer_shouldRejectDurationLessThanTenMinutes() {
        FocusTimerRequest request = new FocusTimerRequest();
        request.setDurationMinutes(5L);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> focusTimerController.setFocusTimer(authentication(), request)
        );

        assertEquals("Focus timer duration must be at least 10 minutes", exception.getMessage());

        verify(focusTimerRepository, never()).save(any(FocusTimer.class));
    }
}