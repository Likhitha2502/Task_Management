package com.focusflow.service;

import com.focusflow.entity.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    List<Task> getTasks(String email);
    Task getTask(Long id, String email);
    Task updateTask(Long id, Task task, String email);
    void deleteTask(Long id, String email);
}