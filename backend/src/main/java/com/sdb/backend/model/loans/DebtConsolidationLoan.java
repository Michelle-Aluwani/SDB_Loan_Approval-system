package com.sdb.backend.model.loans;

import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "debt_consolidation_loans")
public class DebtConsolidationLoan
        extends LoanApplication {

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyExpenses;

    private String employmentStatus;

    private String employerName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalDebt;

    private Integer numberOfDebts;


    public DebtConsolidationLoan() {
        super();
    }


    public DebtConsolidationLoan(
            User customer,
            BigDecimal requestedAmount,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            BigDecimal totalDebt,
            Integer numberOfDebts
    ) {
        super(customer, requestedAmount);

        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.totalDebt = totalDebt;
        this.numberOfDebts = numberOfDebts;
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


    public BigDecimal getTotalDebt() {
        return totalDebt;
    }


    public void setTotalDebt(
            BigDecimal totalDebt
    ) {
        this.totalDebt = totalDebt;
    }


    public Integer getNumberOfDebts() {
        return numberOfDebts;
    }


    public void setNumberOfDebts(
            Integer numberOfDebts
    ) {
        this.numberOfDebts = numberOfDebts;
    }

}