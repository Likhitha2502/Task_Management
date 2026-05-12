package com.focusflow.controller;

import com.focusflow.dto.CreateTaskRequest;
import com.focusflow.entity.Task;
import com.focusflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(Authentication authentication, @Valid @RequestBody CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus().replace("_", " "));
        task.setDueDate(request.getDueDate());
        task.setUserEmail(authentication.getName());

        return taskService.createTask(task);
    }

    @GetMapping
    public List<Task> getAllTasks(Authentication authentication) {
        return taskService.getTasks(authentication.getName());
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id, Authentication authentication) {
        return taskService.getTask(id, authentication.getName());
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
                           Authentication authentication,
                           @Valid @RequestBody CreateTaskRequest request) {

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus().replace("_", " "));
        task.setDueDate(request.getDueDate());
        task.setUserEmail(authentication.getName());

        return taskService.updateTask(id, task, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteTask(@PathVariable Long id, Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Task deleted successfully");
        return response;
    }
}