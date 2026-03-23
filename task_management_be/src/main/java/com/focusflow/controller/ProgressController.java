package com.focusflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ProgressController {

    @GetMapping("/progress")
    public Map<String, Object> getProgress() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalTasks", 10);
        response.put("completedTasks", 4);
        response.put("blockedTasks", 2);
        response.put("overdueTasks", 1);
        return response;
    }
}