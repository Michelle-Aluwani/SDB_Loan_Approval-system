package com.sdb.backend.service;

import com.sdb.backend.enums.LoanStatus;
import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import com.sdb.backend.model.loans.*;

import com.sdb.backend.repository.LoanApplicationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;


    public LoanApplicationService(
            LoanApplicationRepository loanApplicationRepository
    ) {
        this.loanApplicationRepository =
                loanApplicationRepository;
    }


    /*
     * PERSONAL LOAN
     */
    public PersonalLoan applyLoan(
            PersonalLoan personalLoan
    ) {

        prepareApplication(personalLoan);

        return loanApplicationRepository.save(
                personalLoan
        );
    }


    /*
     * STUDENT LOAN
     */
    public StudentLoan applyLoan(
            StudentLoan studentLoan
    ) {

        prepareApplication(studentLoan);

        /*
         * Full-time student applications must
         * complete the guarantor step before
         * entering the employee review queue.
         */
        if (
            studentLoan.getStudyType() != null &&
            studentLoan
                .getStudyType()
                .equalsIgnoreCase("FULL_TIME")
        ) {
            studentLoan.setStatus(
                LoanStatus.AWAITING_GUARANTOR_SIGNATURE
            );
        }

        return loanApplicationRepository.save(
                studentLoan
        );
    }


    /*
     * VEHICLE LOAN
     */
    public VehicleLoan applyLoan(
            VehicleLoan vehicleLoan
    ) {

        prepareApplication(vehicleLoan);

        return loanApplicationRepository.save(
                vehicleLoan
        );
    }


    /*
     * HOME LOAN
     */
    public HomeLoan applyLoan(
            HomeLoan homeLoan
    ) {

        prepareApplication(homeLoan);

        return loanApplicationRepository.save(
                homeLoan
        );
    }


    /*
     * REVOLVING LOAN
     */
    public RevolvingLoan applyLoan(
            RevolvingLoan revolvingLoan
    ) {

        prepareApplication(revolvingLoan);

        return loanApplicationRepository.save(
                revolvingLoan
        );
    }


    /*
     * DEBT CONSOLIDATION
     */
    public DebtConsolidationLoan applyLoan(
            DebtConsolidationLoan debtLoan
    ) {

        prepareApplication(debtLoan);

        return loanApplicationRepository.save(
                debtLoan
        );
    }


    /*
     * Common setup used by every application.
     */
    private void prepareApplication(
            LoanApplication application
    ) {

        application.setSubmittedAt(
                LocalDateTime.now()
        );

        application.setStatus(
                LoanStatus.PENDING
        );

        application.setReviewedBy(null);
        application.setReviewedAt(null);
        application.setRejectionReason(null);
    }


    /*
     * CUSTOMER:
     * Get all applications belonging to a customer.
     */
    public List<LoanApplication>
    getApplicationsForCustomer(
            User customer
    ) {

        return loanApplicationRepository
                .findByCustomerOrderBySubmittedAtDesc(
                        customer
                );
    }


    /*
     * CUSTOMER:
     * Get one application.
     */
    public LoanApplication getApplicationById(
            Long applicationId
    ) {

        return loanApplicationRepository
                .findById(applicationId)
                .orElseThrow(
                    () -> new RuntimeException(
                        "Loan application not found"
                    )
                );
    }


    /*
     * CUSTOMER:
     * Cancel an application before a final decision.
     */
    public LoanApplication cancelApplication(
            Long applicationId,
            User customer
    ) {

        LoanApplication application =
                getApplicationById(applicationId);


        if (
            !application
                .getCustomer()
                .getId()
                .equals(customer.getId())
        ) {
            throw new RuntimeException(
                    "You cannot cancel another customer's application"
            );
        }


        LoanStatus status =
                application.getStatus();


        if (
            status == LoanStatus.APPROVED ||
            status == LoanStatus.REJECTED ||
            status == LoanStatus.CANCELLED ||
            status == LoanStatus.FINISHED
        ) {
            throw new RuntimeException(
                    "This application can no longer be cancelled"
            );
        }


        application.setStatus(
                LoanStatus.CANCELLED
        );

        return loanApplicationRepository.save(
                application
        );
    }


    /*
     * ADMIN:
     * Applications currently waiting for review.
     *
     * AWAITING_GUARANTOR_SIGNATURE is deliberately
     * excluded because it is not ready for employees.
     */
    public List<LoanApplication>
    getAvailableApplications() {

        List<LoanApplication> applications =
                loanApplicationRepository
                    .findByStatus(
                        LoanStatus.PENDING
                    );

        Collections.shuffle(applications);

        return applications;
    }


    /*
     * ADMIN:
     * Applications previously handled by
     * a particular employee.
     */
    public List<LoanApplication>
    getApplicationsReviewedBy(
            String employeeEmail
    ) {

        return loanApplicationRepository
                .findByReviewedBy(
                        employeeEmail
                );
    }
/*
 * ADMIN:
 * Atomically claim a pending application.
 */
@Transactional
public LoanApplication claimApplication(
        Long applicationId,
        String employeeEmail
) {

    int updatedRows =
            loanApplicationRepository
                .claimApplication(
                    applicationId,
                    LoanStatus.PENDING,
                    LoanStatus.UNDER_REVIEW,
                    employeeEmail,
                    LocalDateTime.now()
                );


    if (updatedRows == 0) {
        throw new RuntimeException(
            "Application is no longer available for review"
        );
    }


    return getApplicationById(applicationId);
}


/*
 * ADMIN:
 * Approve an application.
 */
@Transactional
public LoanApplication approveApplication(
        Long applicationId,
        String employeeEmail
) {

    LoanApplication application =
            getApplicationById(applicationId);


    verifyEmployeeOwnsApplication(
            application,
            employeeEmail
    );


    if (
        application.getStatus()
            != LoanStatus.UNDER_REVIEW
    ) {
        throw new RuntimeException(
            "Only applications under review can be approved"
        );
    }


    application.setStatus(
            LoanStatus.APPROVED
    );

    application.setReviewedAt(
            LocalDateTime.now()
    );

    application.setRejectionReason(null);


    return loanApplicationRepository.save(
            application
    );
}


/*
 * ADMIN:
 * Reject an application.
 */
@Transactional
public LoanApplication rejectApplication(
        Long applicationId,
        String employeeEmail,
        String reason
) {

    LoanApplication application =
            getApplicationById(applicationId);


    verifyEmployeeOwnsApplication(
            application,
            employeeEmail
    );


    if (
        application.getStatus()
            != LoanStatus.UNDER_REVIEW
    ) {
        throw new RuntimeException(
            "Only applications under review can be rejected"
        );
    }


    if (
        reason == null ||
        reason.isBlank()
    ) {
        throw new RuntimeException(
            "A rejection reason is required"
        );
    }


    application.setStatus(
            LoanStatus.REJECTED
    );

    application.setReviewedAt(
            LocalDateTime.now()
    );

    application.setRejectionReason(
            reason.trim()
    );


    return loanApplicationRepository.save(
            application
    );
}

/*
 * Prevent one employee from deciding
 * another employee's application.
 */
private void verifyEmployeeOwnsApplication(
        LoanApplication application,
        String employeeEmail
) {

    if (
        application.getReviewedBy() == null ||
        !application
            .getReviewedBy()
            .equalsIgnoreCase(employeeEmail)
    ) {
        throw new RuntimeException(
            "This application is assigned to another employee"
        );
    }
}
}