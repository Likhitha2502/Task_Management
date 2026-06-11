package com.focusflow.controller;

import com.focusflow.FocusFlowConstants;
import com.focusflow.controller.ProgressController;
import com.focusflow.dto.ProgressCountResponse;
import com.focusflow.dto.ProgressPercentResponse;
import com.focusflow.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProgressControllerTest {

    private final TaskRepository taskRepository = mock(TaskRepository.class);
    private final ProgressController progressController =
            new ProgressController(taskRepository);

    private UsernamePasswordAuthenticationToken authentication() {
        return new UsernamePasswordAuthenticationToken("test@gmail.com", null);
    }

    @Test
    void getProgressCount_shouldReturnTaskCountsForAuthenticatedUser() {
        when(taskRepository.countByUserEmail("test@gmail.com")).thenReturn(10L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.TODO))
                .thenReturn(2L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.IN_PROGRESS))
                .thenReturn(3L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.REVIEW))
                .thenReturn(1L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.DONE))
                .thenReturn(4L);

        ProgressCountResponse response =
                progressController.getProgressCount(authentication());

        assertEquals(10L, response.getTotalTasks());
        assertEquals(2L, response.getToDoTasks());
        assertEquals(3L, response.getInProgressTasks());
        assertEquals(1L, response.getInReviewTasks());
        assertEquals(4L, response.getCompletedTasks());
    }

    @Test
    void getProgressPercent_shouldReturnZeroPercentWhenNoTasksExist() {
        when(taskRepository.countByUserEmail("test@gmail.com")).thenReturn(0L);

        ProgressPercentResponse response =
                progressController.getProgressPercent(authentication());

        assertEquals(0.0, response.getToDoPercent());
        assertEquals(0.0, response.getInProgressPercent());
        assertEquals(0.0, response.getInReviewPercent());
        assertEquals(0.0, response.getCompletedPercent());
    }

    @Test
    void getProgressPercent_shouldReturnCalculatedPercentages() {
        when(taskRepository.countByUserEmail("test@gmail.com")).thenReturn(10L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.TODO))
                .thenReturn(2L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.IN_PROGRESS))
                .thenReturn(3L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.REVIEW))
                .thenReturn(1L);
        when(taskRepository.countByUserEmailAndStatus("test@gmail.com", FocusFlowConstants.DONE))
                .thenReturn(4L);

        ProgressPercentResponse response =
                progressController.getProgressPercent(authentication());

        assertEquals(20.0, response.getToDoPercent());
        assertEquals(30.0, response.getInProgressPercent());
        assertEquals(10.0, response.getInReviewPercent());
        assertEquals(40.0, response.getCompletedPercent());
    }
}