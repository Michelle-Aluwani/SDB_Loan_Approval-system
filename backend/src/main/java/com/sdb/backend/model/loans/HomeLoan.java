package com.sdb.backend.model.loans;

import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "home_loans")
public class HomeLoan extends LoanApplication {

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyExpenses;

    private String employmentStatus;

    private String employerName;

    @Column(precision = 15, scale = 2)
    private BigDecimal propertyPrice;

    @Column(precision = 15, scale = 2)
    private BigDecimal depositAmount;

    private String propertyAddress;

    private Boolean jointApplication;

    @Column(precision = 15, scale = 2)
    private BigDecimal coApplicantIncome;


    public HomeLoan() {
        super();
    }


    public HomeLoan(
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


    public BigDecimal getPropertyPrice() {
        return propertyPrice;
    }


    public void setPropertyPrice(
            BigDecimal propertyPrice
    ) {
        this.propertyPrice = propertyPrice;
    }


    public BigDecimal getDepositAmount() {
        return depositAmount;
    }


    public void setDepositAmount(
            BigDecimal depositAmount
    ) {
        this.depositAmount = depositAmount;
    }


    public String getPropertyAddress() {
        return propertyAddress;
    }


    public void setPropertyAddress(
            String propertyAddress
    ) {
        this.propertyAddress = propertyAddress;
    }


    public Boolean getJointApplication() {
        return jointApplication;
    }


    public void setJointApplication(
            Boolean jointApplication
    ) {
        this.jointApplication =
                jointApplication;
    }


    public BigDecimal getCoApplicantIncome() {
        return coApplicantIncome;
    }


    public void setCoApplicantIncome(
            BigDecimal coApplicantIncome
    ) {
        this.coApplicantIncome =
                coApplicantIncome;
    }

}