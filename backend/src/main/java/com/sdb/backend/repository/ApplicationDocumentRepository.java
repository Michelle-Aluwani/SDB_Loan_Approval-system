package com.sdb.backend.repository;

import com.sdb.backend.model.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ApplicationDocumentRepository
        extends JpaRepository<ApplicationDocument, Long> {

    /*
     * Metadata only - this projection deliberately does not
     * include the file bytes, so listing is cheap.
     */
    interface DocumentSummary {
        Long getId();
        String getDocumentType();
        String getOriginalFileName();
        String getContentType();
        long getSizeBytes();
        LocalDateTime getUploadedAt();
    }

    List<DocumentSummary> findByApplication_IdOrderByUploadedAtAsc(
            Long applicationId
    );

    Optional<ApplicationDocument> findByIdAndApplication_Id(
            Long id,
            Long applicationId
    );

    @Modifying
    @Query("""
        DELETE FROM ApplicationDocument d
        WHERE d.application.id = :applicationId
          AND d.documentType = :documentType
    """)
    int deleteExisting(
            @Param("applicationId") Long applicationId,
            @Param("documentType") String documentType
    );
}
