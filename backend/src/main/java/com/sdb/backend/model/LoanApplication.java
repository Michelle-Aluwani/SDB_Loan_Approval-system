package com.sdb.backend.model;

import com.sdb.backend.enums.LoanStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Entity
@Table(name = "loan_applications")
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * The customer who submitted this application.
     *
     * Many loan applications can belong to one user.
     */
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    /*
     * These are filled in once an employee reviews
     * the application.
     */
    private String reviewedBy;

    private LocalDateTime reviewedAt;

    @Column(length = 1000)
    private String rejectionReason;


    protected LoanApplication() {
    }


    protected LoanApplication(
            User customer,
            BigDecimal requestedAmount
    ) {
        this.customer = customer;
        this.requestedAmount = requestedAmount;
        this.status = LoanStatus.PENDING;
        this.submittedAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }


    public User getCustomer() {
        return customer;
    }


    public void setCustomer(User customer) {
        this.customer = customer;
    }


    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }


    public void setRequestedAmount(
            BigDecimal requestedAmount
    ) {
        this.requestedAmount = requestedAmount;
    }


    public LoanStatus getStatus() {
        return status;
    }


    public void setStatus(LoanStatus status) {
        this.status = status;
    }


    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }


    public void setSubmittedAt(
            LocalDateTime submittedAt
    ) {
        this.submittedAt = submittedAt;
    }


    public String getReviewedBy() {
        return reviewedBy;
    }


    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }


    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }


    public void setReviewedAt(
            LocalDateTime reviewedAt
    ) {
        this.reviewedAt = reviewedAt;
    }


    public String getRejectionReason() {
        return rejectionReason;
    }


    public void setRejectionReason(
            String rejectionReason
    ) {
        this.rejectionReason = rejectionReason;
    }

}