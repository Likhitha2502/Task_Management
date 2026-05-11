package com.focusflow.service;

import com.focusflow.entity.Task;
import com.focusflow.repository.TaskRepository;
import com.focusflow.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TaskServiceImplTest {

    private final TaskRepository taskRepository = mock(TaskRepository.class);
    private final TaskServiceImpl taskService = new TaskServiceImpl(taskRepository);

    // CREATE TASK
    @Test
    void testCreateTask() {
        Task task = new Task();
        task.setTitle("Test");

        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.createTask(task);

        assertEquals("Test", result.getTitle());
    }

    // GET ALL TASKS
    @Test
    void testGetTasks() {
        Task task = new Task();
        task.setTitle("Task1");

        when(taskRepository.findByUserEmail("user@gmail.com"))
                .thenReturn(List.of(task));

        List<Task> result = taskService.getTasks("user@gmail.com");

        assertEquals(1, result.size());
    }

    // GET TASK BY ID
    @Test
    void testGetTaskSuccess() {
        Task task = new Task();
        task.setId(1L);

        when(taskRepository.findByIdAndUserEmail(1L, "user@gmail.com"))
                .thenReturn(Optional.of(task));

        Task result = taskService.getTask(1L, "user@gmail.com");

        assertEquals(1L, result.getId());
    }

    // GET TASK NOT FOUND
    @Test
    void testGetTaskNotFound() {
        when(taskRepository.findByIdAndUserEmail(1L, "user@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> taskService.getTask(1L, "user@gmail.com"));
    }

    // UPDATE TASK
    @Test
    void testUpdateTask() {
        Task existing = new Task();
        existing.setTitle("Old");
        existing.setDescription("Old desc");
        existing.setPriority("Low");
        existing.setStatus("Pending");
        existing.setDueDate(LocalDate.of(2026, 5, 1));

        Task updated = new Task();
        updated.setTitle("New");
        updated.setDescription("New desc");
        updated.setPriority("High");
        updated.setStatus("Completed");
        updated.setDueDate(LocalDate.of(2026, 5, 10));

        when(taskRepository.findByIdAndUserEmail(1L, "user@gmail.com"))
                .thenReturn(Optional.of(existing));
        when(taskRepository.save(existing)).thenReturn(existing);

        Task result = taskService.updateTask(1L, updated, "user@gmail.com");

        assertEquals("New", result.getTitle());
        assertEquals("New desc", result.getDescription());
        assertEquals("High", result.getPriority());
        assertEquals("Completed", result.getStatus());
        assertEquals(LocalDate.of(2026, 5, 10), result.getDueDate());

        verify(taskRepository).save(existing);
    }

    // DELETE TASK NOT FOUND
    @Test
    void testDeleteTaskNotFound() {
        when(taskRepository.findByIdAndUserEmail(1L, "user@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> taskService.deleteTask(1L, "user@gmail.com"));
    }

    // DELETE TASK SUCCESS
    @Test
    void testDeleteTaskSuccess() {
        Task task = new Task();

        when(taskRepository.findByIdAndUserEmail(1L, "user@gmail.com"))
                .thenReturn(Optional.of(task));

        taskService.deleteTask(1L, "user@gmail.com");

        verify(taskRepository).delete(task);
    }
}