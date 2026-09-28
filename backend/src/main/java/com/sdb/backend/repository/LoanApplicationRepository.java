package com.sdb.backend.repository;

import com.sdb.backend.enums.LoanStatus;
import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LoanApplicationRepository
        extends JpaRepository<LoanApplication, Long> {


    List<LoanApplication> findByCustomer(
            User customer
    );

    List<LoanApplication> findByCustomerOrderBySubmittedAtDesc(
            User customer
    );

    List<LoanApplication> findByStatus(
            LoanStatus status
    );

    List<LoanApplication> findByReviewedBy(
            String reviewedBy
    );

@Modifying
@Query("""
    UPDATE LoanApplication application
    SET application.status = :newStatus,
        application.reviewedBy = :employeeEmail,
        application.reviewedAt = :reviewedAt
    WHERE application.id = :applicationId
      AND application.status = :expectedStatus
""")
int claimApplication(
        @Param("applicationId")
        Long applicationId,

        @Param("expectedStatus")
        LoanStatus expectedStatus,

        @Param("newStatus")
        LoanStatus newStatus,

        @Param("employeeEmail")
        String employeeEmail,

        @Param("reviewedAt")
        java.time.LocalDateTime reviewedAt
);

}