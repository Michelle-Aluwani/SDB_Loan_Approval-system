package com.sdb.backend.service;

import com.sdb.backend.dto.DocumentInfo;
import com.sdb.backend.enums.LoanStatus;
import com.sdb.backend.model.ApplicationDocument;
import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import com.sdb.backend.repository.ApplicationDocumentRepository;
import com.sdb.backend.repository.LoanApplicationRepository;
import com.sdb.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class DocumentService {

    private static final long MAX_FILE_BYTES = 8L * 1024 * 1024;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "ID_DOCUMENT",
            "PAYSLIP",
            "BANK_STATEMENTS",
            "PROOF_OF_RESIDENCE",
            "ADDITIONAL_DOCUMENT"
    );

    private final ApplicationDocumentRepository documentRepository;
    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;


    public DocumentService(
            ApplicationDocumentRepository documentRepository,
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }


    /*
     * CUSTOMER: attach a document to their own application.
     * Uploading the same document type again replaces the old one.
     */
    @Transactional
    public DocumentInfo upload(
            Long applicationId,
            Long customerId,
            String documentType,
            MultipartFile file
    ) {

        LoanApplication application =
                applicationRepository
                    .findById(applicationId)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Application not found"
                    ));

        if (
            customerId == null ||
            !application.getCustomer().getId().equals(customerId)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot upload to another customer's application"
            );
        }

        LoanStatus status = application.getStatus();

        if (
            status != LoanStatus.PENDING &&
            status != LoanStatus.AWAITING_GUARANTOR_SIGNATURE
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Documents can no longer be added to this application"
            );
        }

        String type =
                documentType == null
                    ? ""
                    : documentType.trim().toUpperCase();

        if (!ALLOWED_TYPES.contains(type)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unknown document type"
            );
        }

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The file is empty"
            );
        }

        if (file.getSize() > MAX_FILE_BYTES) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Files must be 8 MB or smaller"
            );
        }

        byte[] bytes;

        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The file could not be read"
            );
        }

        /*
         * Decide the type from the file's real content, not from
         * the browser-supplied header or extension.
         */
        String contentType = detectContentType(bytes);

        if (contentType == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PDF, JPG and PNG files are accepted"
            );
        }

        documentRepository.deleteExisting(applicationId, type);

        ApplicationDocument document = new ApplicationDocument();
        document.setApplication(application);
        document.setDocumentType(type);
        document.setOriginalFileName(
                sanitiseFileName(file.getOriginalFilename())
        );
        document.setContentType(contentType);
        document.setSizeBytes(bytes.length);
        document.setData(bytes);
        document.setUploadedAt(LocalDateTime.now());

        ApplicationDocument saved =
                documentRepository.save(document);

        return new DocumentInfo(
                saved.getId(),
                saved.getDocumentType(),
                saved.getOriginalFileName(),
                saved.getContentType(),
                saved.getSizeBytes(),
                saved.getUploadedAt()
        );
    }


    /*
     * ADMIN: list document metadata for an application.
     */
    @Transactional(readOnly = true)
    public List<DocumentInfo> listForReviewer(
            Long applicationId,
            String employeeEmail
    ) {

        authoriseReviewer(applicationId, employeeEmail);

        return documentRepository
                .findByApplication_IdOrderByUploadedAtAsc(
                    applicationId
                )
                .stream()
                .map(d -> new DocumentInfo(
                    d.getId(),
                    d.getDocumentType(),
                    d.getOriginalFileName(),
                    d.getContentType(),
                    d.getSizeBytes(),
                    d.getUploadedAt()
                ))
                .toList();
    }


    /*
     * ADMIN: fetch one document's bytes for on-screen viewing.
     */
    @Transactional(readOnly = true)
    public ApplicationDocument getForReviewer(
            Long applicationId,
            Long documentId,
            String employeeEmail
    ) {

        authoriseReviewer(applicationId, employeeEmail);

        return documentRepository
                .findByIdAndApplication_Id(
                    documentId,
                    applicationId
                )
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Document not found"
                ));
    }


    /*
     * Only an ADMIN who has claimed the application may see its
     * documents - the same rule already used for approve/reject.
     */
    private void authoriseReviewer(
            Long applicationId,
            String employeeEmail
    ) {

        if (employeeEmail == null || employeeEmail.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Employee identity is required"
            );
        }

        User employee =
                userRepository
                    .findByEmail(employeeEmail.trim())
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Unknown employee"
                    ));

        if (!"ADMIN".equalsIgnoreCase(employee.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only employees can view documents"
            );
        }

        LoanApplication application =
                applicationRepository
                    .findById(applicationId)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Application not found"
                    ));

        if (
            application.getReviewedBy() == null ||
            !application.getReviewedBy()
                .equalsIgnoreCase(employee.getEmail())
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Claim this application to view its documents"
            );
        }
    }


    private String detectContentType(byte[] b) {

        if (
            b.length >= 4 &&
            b[0] == '%' && b[1] == 'P' &&
            b[2] == 'D' && b[3] == 'F'
        ) {
            return "application/pdf";
        }

        if (
            b.length >= 8 &&
            (b[0] & 0xFF) == 0x89 && b[1] == 'P' &&
            b[2] == 'N' && b[3] == 'G'
        ) {
            return "image/png";
        }

        if (
            b.length >= 3 &&
            (b[0] & 0xFF) == 0xFF &&
            (b[1] & 0xFF) == 0xD8 &&
            (b[2] & 0xFF) == 0xFF
        ) {
            return "image/jpeg";
        }

        return null;
    }


    private String sanitiseFileName(String name) {

        if (name == null || name.isBlank()) {
            return "document";
        }

        String cleaned =
                name.replaceAll("[\\\\/]", "_")
                    .replaceAll("\\p{Cntrl}", "")
                    .trim();

        if (cleaned.isEmpty()) {
            return "document";
        }

        return cleaned.length() > 150
                ? cleaned.substring(0, 150)
                : cleaned;
    }
}
