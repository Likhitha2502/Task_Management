package com.focusflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255, message = "Task title must be 255 characters or less")
    private String title;

    @Size(max = 255, message = "Task description must be 255 characters or less")
    private String description;

    @NotBlank(message = "Task status is required")
    @Size(max = 255, message = "Task status must be 255 characters or less")
    private String status;

    @NotBlank(message = "Task priority is required")
    @Size(max = 255, message = "Task priority must be 255 characters or less")
    private String priority;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

 
    // getters & setters

    public @NotBlank String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public @NotBlank String getPriority() {
        return priority;
    }

    public void setPriority(@NotBlank String priority) {
        this.priority = priority;
    }

    public @NotBlank String getStatus() {
        return status;
    }

    public void setStatus(@NotBlank String status) {
        this.status = status;
    }

    public @NotNull LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(@NotNull LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}