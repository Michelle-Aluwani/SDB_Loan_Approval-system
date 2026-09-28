package com.sdb.backend.model.loans;

import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "personal_loans")
public class PersonalLoan extends LoanApplication {

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyExpenses;

    private String employmentStatus;

    private String employerName;

    private Integer termMonths;


    public PersonalLoan() {
        super();
    }


    public PersonalLoan(
            User customer,
            BigDecimal requestedAmount,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            String employmentStatus,
            String employerName,
            Integer termMonths
    ) {
        super(customer, requestedAmount);

        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.employmentStatus = employmentStatus;
        this.employerName = employerName;
        this.termMonths = termMonths;
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