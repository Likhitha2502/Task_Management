package com.focusflow.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBadRequest(BadRequestException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        log.error("Unhandled exception occurred", ex);
        response.put("message", "Unexpected internal server error");
        return response;
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleUnauthorized(UnauthorizedException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        log.error("Unhandled exception occurred", ex);
        response.put("message", "Unexpected internal server error");
        return response;
    }


    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleInvalidJson(Exception ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Invalid request format (check date format or JSON)");
        return response;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleGeneralException(Exception ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        log.error("Unhandled exception occurred", ex);
        response.put("message", "Unexpected internal server error");
        return response;
    }

}