package com.sdb.backend.controller;

import com.sdb.backend.dto.DocumentInfo;
import com.sdb.backend.model.ApplicationDocument;
import com.sdb.backend.service.DocumentService;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    private final DocumentService documentService;


    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }


    /*
     * CUSTOMER: upload one supporting document.
     */
    @PostMapping(
        value = "/applications/{applicationId}/documents",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DocumentInfo> uploadDocument(
            @PathVariable Long applicationId,
            @RequestParam("customerId") Long customerId,
            @RequestParam("documentType") String documentType,
            @RequestPart("file") MultipartFile file
    ) {

        return ResponseEntity.ok(
            documentService.upload(
                applicationId,
                customerId,
                documentType,
                file
            )
        );
    }


    /*
     * ADMIN: list the documents attached to an application.
     */
    @GetMapping("/admin/applications/{applicationId}/documents")
    public ResponseEntity<List<DocumentInfo>> listDocuments(
            @PathVariable Long applicationId,
            @RequestParam String employeeEmail
    ) {

        return ResponseEntity.ok(
            documentService.listForReviewer(
                applicationId,
                employeeEmail
            )
        );
    }


    /*
     * ADMIN: stream one document for VIEWING only.
     *
     * - Content-Disposition is "inline" (never "attachment")
     * - nothing is cached by the browser or proxies
     * - nosniff stops the browser guessing a different type
     */
    @GetMapping(
        "/admin/applications/{applicationId}/documents/{documentId}/view"
    )
    public ResponseEntity<byte[]> viewDocument(
            @PathVariable Long applicationId,
            @PathVariable Long documentId,
            @RequestParam String employeeEmail
    ) {

        ApplicationDocument document =
                documentService.getForReviewer(
                    applicationId,
                    documentId,
                    employeeEmail
                );

        return ResponseEntity.ok()
                .contentType(
                    MediaType.parseMediaType(
                        document.getContentType()
                    )
                )
                .contentLength(document.getSizeBytes())
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"document\""
                )
                .cacheControl(
                    CacheControl.noStore().mustRevalidate()
                )
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header("X-Content-Type-Options", "nosniff")
                .body(document.getData());
    }
}
