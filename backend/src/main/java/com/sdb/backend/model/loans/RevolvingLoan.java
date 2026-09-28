package com.sdb.backend.model.loans;

import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "revolving_loans")
public class RevolvingLoan extends LoanApplication {

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyExpenses;

    private String employmentStatus;

    private String employerName;

    private Integer termMonths;


    public RevolvingLoan() {
        super();
    }


    public RevolvingLoan(
            User customer,
            BigDecimal requestedAmount,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses
    ) {
        super(customer, requestedAmount);

        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
    }


    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }


    public void setMonthlyIncome(
            BigDecimal monthlyIncome
    ) {
        this.monthlyIncome = monthlyIncome;
    }


    public BigDecimal getMonthlyExpenses() {
        return monthlyExpenses;
    }


    public void setMonthlyExpenses(
            BigDecimal monthlyExpenses
    ) {
        this.monthlyExpenses = monthlyExpenses;
    }


    public String getEmploymentStatus() {
        return employmentStatus;
    }


    public void setEmploymentStatus(
            String employmentStatus
    ) {
        this.employmentStatus = employmentStatus;
    }


    public String getEmployerName() {
        return employerName;
    }


    public void setEmployerName(
            String employerName
    ) {
        this.employerName = employerName;
    }


    public Integer getTermMonths() {
        return termMonths;
    }


    public void setTermMonths(
            Integer termMonths
    ) {
        this.termMonths = termMonths;
    }

}