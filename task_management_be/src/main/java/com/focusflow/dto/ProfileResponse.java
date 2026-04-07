package com.focusflow.dto;

public class ProfileResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String profilePictureUrl;

    public ProfileResponse() {
    }

    public ProfileResponse(String firstName, String lastName, String email, String profilePictureUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
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

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
}