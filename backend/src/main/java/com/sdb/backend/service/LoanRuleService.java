package com.sdb.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LoanRuleService {

    /*
     * PERSONAL LOAN
     */
    public BigDecimal getPersonalMinimumIncome() {
        return new BigDecimal("3000");
    }

    public BigDecimal getPersonalMaximumAmount() {
        return new BigDecimal("300000");
    }


    /*
     * REVOLVING LOAN
     */
    public BigDecimal getRevolvingMinimumIncome() {
        return new BigDecimal("8000");
    }

    public BigDecimal getRevolvingMinimumAmount() {
        return new BigDecimal("6000");
    }

    public BigDecimal getRevolvingMaximumAmount() {
        return new BigDecimal("300000");
    }


    /*
     * STUDENT LOAN
     */
    public BigDecimal getStudentMinimumAmount() {
        return new BigDecimal("5000");
    }

    public BigDecimal getFullTimeGuarantorMinimumIncome() {
        return new BigDecimal("3000");
    }

    public BigDecimal getPartTimeStudentMinimumIncome() {
        return new BigDecimal("5000");
    }


    /*
     * DEBT CONSOLIDATION
     */
    public BigDecimal getDebtMinimumIncome() {
        return new BigDecimal("3000");
    }

    public int getDebtMinimumNumberOfDebts() {
        return 1;
    }

    public int getDebtMaximumNumberOfDebts() {
        return 3;
    }


    /*
     * BASIC AFFORDABILITY PRE-CHECK
     *
     * This is our application's simplified
     * affordability check, not a bank's complete
     * credit assessment.
     */
    public boolean hasBasicAffordability(
            BigDecimal income,
            BigDecimal expenses
    ) {

        if (income == null || expenses == null) {
            return false;
        }

        return income.compareTo(expenses) > 0;
    }


    public boolean meetsMinimumIncome(
            BigDecimal income,
            BigDecimal minimumIncome
    ) {

        if (income == null) {
            return false;
        }

        return income.compareTo(minimumIncome) >= 0;
    }


    public boolean amountWithinRange(
            BigDecimal amount,
            BigDecimal minimum,
            BigDecimal maximum
    ) {

        if (amount == null) {
            return false;
        }

        if (
            minimum != null &&
            amount.compareTo(minimum) < 0
        ) {
            return false;
        }

        if (
            maximum != null &&
            amount.compareTo(maximum) > 0
        ) {
            return false;
        }

        return true;
    }

}