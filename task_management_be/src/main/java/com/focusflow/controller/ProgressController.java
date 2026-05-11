package com.focusflow.controller;

import com.focusflow.repository.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final TaskRepository taskRepository;

    public ProgressController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/count")
    public Map<String, Object> getProgressCount(Authentication authentication) {

        String email = authentication.getName();
        log.info("Fetching progress count for user: {}", email);

        long totalTasks = taskRepository.countByUserEmail(email);
        long completedTasks =
                taskRepository.countByUserEmailAndStatus(email, "DONE");

        Map<String, Object> response = new HashMap<>();
        response.put("totalTasks", totalTasks);
        response.put("completedTasks", completedTasks);

        return response;
    }

    @GetMapping("/percent")
    public Map<String, Object> getProgressPercent(Authentication authentication) {

        String email = authentication.getName();
        log.info("Fetching progress percentage for user: {}", email);

        long totalTasks = taskRepository.countByUserEmail(email);

        long completedTasks =
                taskRepository.countByUserEmailAndStatus(email, "DONE");

        double percent = 0;

        if (totalTasks > 0) {
            percent = ((double) completedTasks / totalTasks) * 100;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("progressPercent", percent);

        return response;
    }
}