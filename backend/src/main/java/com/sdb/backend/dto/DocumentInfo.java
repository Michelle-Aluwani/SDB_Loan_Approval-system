package com.sdb.backend.dto;

import java.time.LocalDateTime;

/*
 * Document metadata sent to the frontend.
 * Never contains the file bytes.
 */
public record DocumentInfo(
        Long id,
        String documentType,
        String originalFileName,
        String contentType,
        long sizeBytes,
        LocalDateTime uploadedAt
) {
}
