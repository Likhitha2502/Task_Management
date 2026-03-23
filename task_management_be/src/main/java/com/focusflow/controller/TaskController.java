package com.focusflow.controller;

import com.focusflow.dto.TaskRequest;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @PostMapping
    public Map<String, Object> createTask(@RequestBody TaskRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Task created successfully");
        response.put("task", request);
        return response;
    }

    @GetMapping
    public List<Map<String, Object>> getAllTasks() {
        List<Map<String, Object>> tasks = new ArrayList<>();

        Map<String, Object> task1 = new HashMap<>();
        task1.put("id", 1);
        task1.put("title", "Finish proposal");
        task1.put("priority", "HIGH");
        task1.put("status", "TODO");
        task1.put("dueDate", "2026-03-25");

        Map<String, Object> task2 = new HashMap<>();
        task2.put("id", 2);
        task2.put("title", "Prepare slides");
        task2.put("priority", "MEDIUM");
        task2.put("status", "IN_PROGRESS");
        task2.put("dueDate", "2026-03-27");

        tasks.add(task1);
        tasks.add(task2);

        return tasks;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getTaskById(@PathVariable Long id) {
        Map<String, Object> task = new HashMap<>();
        task.put("id", id);
        task.put("title", "Sample task");
        task.put("priority", "HIGH");
        task.put("status", "TODO");
        task.put("dueDate", "2026-03-25");
        return task;
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Task updated successfully");
        response.put("taskId", id);
        response.put("updatedTask", request);
        return response;
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteTask(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Task deleted successfully");
        response.put("taskId", String.valueOf(id));
        return response;
    }
}