package com.focusflow.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(max = 255, message = "First name must be 255 characters or less")
    private String firstName;

    @Size(max = 255, message = "Last name must be 255 characters or less")
    private String lastName;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}