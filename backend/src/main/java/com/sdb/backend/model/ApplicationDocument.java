package com.sdb.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/*
 * A supporting document uploaded by a customer for a loan
 * application (ID, payslip, bank statements, ...).
 *
 * The file bytes are stored in the database so they survive
 * redeploys on hosts with an ephemeral filesystem, and are
 * NEVER serialised to JSON.
 */
@Entity
@Table(name = "application_documents")
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @Column(nullable = false, length = 40)
    private String documentType;

    @Column(nullable = false, length = 255)
    private String originalFileName;

    @Column(nullable = false, length = 100)
    private String contentType;

    @Column(nullable = false)
    private long sizeBytes;

    @JsonIgnore
    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] data;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;


    public ApplicationDocument() {
    }


    public Long getId() { return id; }

    public LoanApplication getApplication() { return application; }

    public void setApplication(LoanApplication application) {
        this.application = application;
    }

    public String getDocumentType() { return documentType; }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getOriginalFileName() { return originalFileName; }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getContentType() { return contentType; }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public long getSizeBytes() { return sizeBytes; }

    public void setSizeBytes(long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public byte[] getData() { return data; }

    public void setData(byte[] data) { this.data = data; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
