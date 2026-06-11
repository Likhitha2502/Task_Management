package com.focusflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class FocusTimerRequest {

    @NotNull(message = "Focus timer duration is required")
    @Min(value = 10, message = "Focus timer duration must be between 10 and 720 minutes")
    @Max(value = 720, message = "Focus timer duration must be between 10 and 720 minutes")
    private Long durationMinutes;

    public Long getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Long durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}