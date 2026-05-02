package com.focusflow.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class MultiDateDeserializer extends JsonDeserializer<LocalDate> {

    private static final DateTimeFormatter[] formats = new DateTimeFormatter[]{
            DateTimeFormatter.ISO_LOCAL_DATE, // yyyy-MM-dd
            DateTimeFormatter.ofPattern("MM-dd-yyyy")
    };

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String date = p.getText();

        for (DateTimeFormatter formatter : formats) {
            try {
                return LocalDate.parse(date, formatter);
            } catch (Exception ignored) {}
        }

        throw new RuntimeException("Invalid date format. Use yyyy-MM-dd or MM-dd-yyyy");
    }
}