package com.focusflow.dto;

public class ProgressPercentResponse {

    private double toDoPercent;
    private double inProgressPercent;
    private double inReviewPercent;
    private double completedPercent;

    public double getToDoPercent() {
        return toDoPercent;
    }

    public void setToDoPercent(double toDoPercent) {
        this.toDoPercent = toDoPercent;
    }

    public double getInProgressPercent() {
        return inProgressPercent;
    }

    public void setInProgressPercent(double inProgressPercent) {
        this.inProgressPercent = inProgressPercent;
    }

    public double getInReviewPercent() {
        return inReviewPercent;
    }

    public void setInReviewPercent(double inReviewPercent) {
        this.inReviewPercent = inReviewPercent;
    }

    public double getCompletedPercent() {
        return completedPercent;
    }

    public void setCompletedPercent(double completedPercent) {
        this.completedPercent = completedPercent;
    }
}