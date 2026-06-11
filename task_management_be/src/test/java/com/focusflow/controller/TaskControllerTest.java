package com.focusflow.controller;

import com.focusflow.FocusFlowConstants;
import com.focusflow.controller.TaskController;
import com.focusflow.dto.CreateTaskRequest;
import com.focusflow.entity.Task;
import com.focusflow.service.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    private final TaskService taskService = mock(TaskService.class);
    private final TaskController taskController = new TaskController(taskService);

    private UsernamePasswordAuthenticationToken authentication() {
        return new UsernamePasswordAuthenticationToken("test@gmail.com", null);
    }

    private CreateTaskRequest request() {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Write report");
        request.setDescription("Finish unit testing report");
        request.setPriority("HIGH");
        request.setStatus("TODO");
        request.setDueDate(LocalDate.of(2026, 6, 15));
        return request;
    }

    @Test
    void createTask_shouldSetAuthenticatedUserEmailAndCallService() {
        CreateTaskRequest request = request();

        Task savedTask = new Task();
        savedTask.setTitle("Write report");
        savedTask.setUserEmail("test@gmail.com");

        when(taskService.createTask(any(Task.class))).thenReturn(savedTask);

        Task response = taskController.createTask(authentication(), request);

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskService).createTask(captor.capture());

        Task capturedTask = captor.getValue();

        assertEquals("Write report", capturedTask.getTitle());
        assertEquals("Finish unit testing report", capturedTask.getDescription());
        assertEquals("HIGH", capturedTask.getPriority());
        assertEquals(FocusFlowConstants.TODO, capturedTask.getStatus());
        assertEquals(LocalDate.of(2026, 6, 15), capturedTask.getDueDate());
        assertEquals("test@gmail.com", capturedTask.getUserEmail());

        assertEquals("Write report", response.getTitle());
        assertEquals("test@gmail.com", response.getUserEmail());
    }

    @Test
    void getAllTasks_shouldReturnTasksForAuthenticatedUser() {
        Task task = new Task();
        task.setTitle("Task 1");
        task.setUserEmail("test@gmail.com");

        when(taskService.getTasks("test@gmail.com")).thenReturn(List.of(task));

        List<Task> response = taskController.getAllTasks(authentication());

        assertEquals(1, response.size());
        assertEquals("Task 1", response.get(0).getTitle());
        verify(taskService).getTasks("test@gmail.com");
    }

    @Test
    void getTaskById_shouldReturnTaskForAuthenticatedUser() {
        Task task = new Task();
        task.setTitle("Task 1");
        task.setUserEmail("test@gmail.com");

        when(taskService.getTask(1L, "test@gmail.com")).thenReturn(task);

        Task response = taskController.getTaskById(1L, authentication());

        assertEquals("Task 1", response.getTitle());
        verify(taskService).getTask(1L, "test@gmail.com");
    }

    @Test
    void updateTask_shouldSetAuthenticatedUserEmailAndCallService() {
        CreateTaskRequest request = request();

        Task updatedTask = new Task();
        updatedTask.setTitle("Write report");
        updatedTask.setUserEmail("test@gmail.com");

        when(taskService.updateTask(eq(1L), any(Task.class), eq("test@gmail.com")))
                .thenReturn(updatedTask);

        Task response = taskController.updateTask(1L, authentication(), request);

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskService).updateTask(eq(1L), captor.capture(), eq("test@gmail.com"));

        Task capturedTask = captor.getValue();

        assertEquals("Write report", capturedTask.getTitle());
        assertEquals("test@gmail.com", capturedTask.getUserEmail());
        assertEquals("Write report", response.getTitle());
    }

    @Test
    void deleteTask_shouldReturnSuccessMessage() {
        Map<String, String> response = taskController.deleteTask(1L, authentication());

        assertEquals("Task deleted successfully", response.get("message"));
        verify(taskService).deleteTask(1L, "test@gmail.com");
    }
}