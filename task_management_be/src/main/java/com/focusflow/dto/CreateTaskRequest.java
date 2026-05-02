package com.focusflow.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.focusflow.util.MultiDateDeserializer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CreateTaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String priority;

    @NotBlank
    private String status;

    @NotNull
    @JsonDeserialize(using = MultiDateDeserializer.class)
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