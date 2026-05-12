package com.focusflow.dto;

public class ProgressCountResponse {

    private long totalTasks;
    private long toDoTasks;
    private long inProgressTasks;
    private long inReviewTasks;
    private long completedTasks;

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getToDoTasks() {
        return toDoTasks;
    }

    public void setToDoTasks(long toDoTasks) {
        this.toDoTasks = toDoTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getInReviewTasks() {
        return inReviewTasks;
    }

    public void setInReviewTasks(long inReviewTasks) {
        this.inReviewTasks = inReviewTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }
}