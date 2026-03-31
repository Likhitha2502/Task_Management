package com.focusflow.dto;

public class ProfileResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String profilePicture;

    public ProfileResponse() {
    }

    public ProfileResponse(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public ProfileResponse(String firstName, String lastName, String email, String profilePicture) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.profilePicture = profilePicture;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }
}