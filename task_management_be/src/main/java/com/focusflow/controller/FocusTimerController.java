package com.focusflow.controller;

import com.focusflow.dto.FocusTimerRequest;
import com.focusflow.dto.FocusTimerResponse;
import com.focusflow.dto.FocusTimerUpdateResponse;
import com.focusflow.entity.FocusTimer;
import com.focusflow.repository.FocusTimerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/focus-timer")
public class FocusTimerController {

    private final FocusTimerRepository focusTimerRepository;

    public FocusTimerController(FocusTimerRepository focusTimerRepository) {
        this.focusTimerRepository = focusTimerRepository;
    }

    @PostMapping
    public FocusTimerUpdateResponse setFocusTimer(Authentication authentication,
                                                  @RequestBody FocusTimerRequest request) {

        String email = authentication.getName();

        log.info("Setting focus timer for user: {}", email);

        FocusTimer focusTimer = focusTimerRepository.findByUserEmail(email)
                .orElse(new FocusTimer());

        focusTimer.setUserEmail(email);

        if (request.getDurationMinutes() == 0) {

            focusTimer.setActive(false);
            focusTimer.setDurationMinutes(0L);
            focusTimer.setEndTime(null);

        } else {

            focusTimer.setActive(true);
            focusTimer.setDurationMinutes(request.getDurationMinutes());

            focusTimer.setEndTime(
                    LocalDateTime.now()
                            .plusMinutes(request.getDurationMinutes())
            );
        }
        focusTimerRepository.save(focusTimer);
        FocusTimerUpdateResponse response = new FocusTimerUpdateResponse();

        response.setMessage("Focus timer updated successfully");

        return response;
    }

    @GetMapping
    public FocusTimerResponse getFocusTimer(Authentication authentication) {

        String email = authentication.getName();

        FocusTimerResponse response =
                new FocusTimerResponse();

        FocusTimer focusTimer =
                focusTimerRepository.findByUserEmail(email)
                        .orElse(null);

        if (focusTimer == null ||
                !focusTimer.isActive() ||
                focusTimer.getEndTime() == null) {

            response.setActive(false);
            response.setRemainingMinutes(0L);

            return response;
        }

        long remainingMinutes =
                Duration.between(
                        LocalDateTime.now(),
                        focusTimer.getEndTime()
                ).toMinutes();

        if (remainingMinutes <= 0) {

            focusTimer.setActive(false);

            focusTimerRepository.save(focusTimer);

            response.setActive(false);
            response.setRemainingMinutes(0L);

            return response;
        }

        response.setActive(true);
        response.setRemainingMinutes(remainingMinutes);

        return response;
    }
}