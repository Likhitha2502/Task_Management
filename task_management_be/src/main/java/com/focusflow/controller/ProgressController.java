package com.focusflow.controller;

import com.focusflow.FocusFlowConstants;
import com.focusflow.dto.ProgressCountResponse;
import com.focusflow.dto.ProgressPercentResponse;
import com.focusflow.repository.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final TaskRepository taskRepository;

    public ProgressController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/count")
    public ProgressCountResponse getProgressCount(Authentication authentication) {

        String email = authentication.getName();
        log.info("Fetching progress count for user: {}", email);

        long totalTasks = taskRepository.countByUserEmail(email);
        long toDoTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.TODO);

        long inProgressTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.IN_PROGRESS);

        long inReviewTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.REVIEW);

        long completedTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.DONE);

        ProgressCountResponse response = new ProgressCountResponse();

        response.setTotalTasks(totalTasks);
        response.setToDoTasks(toDoTasks);
        response.setInProgressTasks(inProgressTasks);
        response.setInReviewTasks(inReviewTasks);
        response.setCompletedTasks(completedTasks);

        return response;
    }

    @GetMapping("/percent")
    public ProgressPercentResponse getProgressPercent(Authentication authentication) {

        String email = authentication.getName();
        log.info("Fetching progress percentage for user: {}", email);

        long totalTasks = taskRepository.countByUserEmail(email);

        long toDoTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.TODO);

        long inProgressTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.IN_PROGRESS);

        long inReviewTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.REVIEW);

        long completedTasks =
                taskRepository.countByUserEmailAndStatus(email, FocusFlowConstants.DONE);

        double toDoPercent = 0;
        double inProgressPercent = 0;
        double inReviewPercent = 0;
        double completedPercent = 0;

        if (totalTasks > 0) {

            toDoPercent =
                    ((double) toDoTasks / totalTasks) * 100;

            inProgressPercent =
                    ((double) inProgressTasks / totalTasks) * 100;

            inReviewPercent =
                    ((double) inReviewTasks / totalTasks) * 100;

            completedPercent =
                    ((double) completedTasks / totalTasks) * 100;
        }

        ProgressPercentResponse response =
                new ProgressPercentResponse();

        response.setToDoPercent(toDoPercent);
        response.setInProgressPercent(inProgressPercent);
        response.setInReviewPercent(inReviewPercent);
        response.setCompletedPercent(completedPercent);

        return response;
    }
}