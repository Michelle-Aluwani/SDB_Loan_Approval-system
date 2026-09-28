package com.sdb.backend.service;

import com.sdb.backend.model.loans.*;

import org.springframework.stereotype.Service;

@Service
public class EligibilityService {

    private final LoanRuleService loanRuleService;


    public EligibilityService(
            LoanRuleService loanRuleService
    ) {
        this.loanRuleService = loanRuleService;
    }


    /*
     * PERSONAL LOAN
     */
    public boolean isEligible(
            PersonalLoan loan
    ) {

        boolean incomeOkay =
                loanRuleService.meetsMinimumIncome(
                    loan.getMonthlyIncome(),
                    loanRuleService
                        .getPersonalMinimumIncome()
                );

        boolean affordabilityOkay =
                loanRuleService.hasBasicAffordability(
                    loan.getMonthlyIncome(),
                    loan.getMonthlyExpenses()
                );

        boolean amountOkay =
                loanRuleService.amountWithinRange(
                    loan.getRequestedAmount(),
                    null,
                    loanRuleService
                        .getPersonalMaximumAmount()
                );

        return incomeOkay
                && affordabilityOkay
                && amountOkay;
    }


    /*
     * REVOLVING LOAN
     */
    public boolean isEligible(
            RevolvingLoan loan
    ) {

        boolean incomeOkay =
                loanRuleService.meetsMinimumIncome(
                    loan.getMonthlyIncome(),
                    loanRuleService
                        .getRevolvingMinimumIncome()
                );

        boolean affordabilityOkay =
                loanRuleService.hasBasicAffordability(
                    loan.getMonthlyIncome(),
                    loan.getMonthlyExpenses()
                );

        boolean amountOkay =
                loanRuleService.amountWithinRange(
                    loan.getRequestedAmount(),
                    loanRuleService
                        .getRevolvingMinimumAmount(),
                    loanRuleService
                        .getRevolvingMaximumAmount()
                );

        return incomeOkay
                && affordabilityOkay
                && amountOkay;
    }


    /*
     * STUDENT LOAN
     */
    public boolean isEligible(
            StudentLoan loan
    ) {

        if (
            !loanRuleService.amountWithinRange(
                loan.getRequestedAmount(),
                loanRuleService
                    .getStudentMinimumAmount(),
                null
            )
        ) {
            return false;
        }


        if (loan.getStudyType() == null) {
            return false;
        }


        /*
         * FULL-TIME:
         * use guarantor finances.
         */
        if (
            loan.getStudyType()
                .equalsIgnoreCase("FULL_TIME")
        ) {

            boolean guarantorIncomeOkay =
                    loanRuleService
                        .meetsMinimumIncome(
                            loan.getGuarantorIncome(),
                            loanRuleService
                                .getFullTimeGuarantorMinimumIncome()
                        );

            boolean guarantorAffordabilityOkay =
                    loanRuleService
                        .hasBasicAffordability(
                            loan.getGuarantorIncome(),
                            loan.getGuarantorExpenses()
                        );

            return guarantorIncomeOkay
                    && guarantorAffordabilityOkay;
        }


        /*
         * PART-TIME:
         * use student's finances.
         */
        if (
            loan.getStudyType()
                .equalsIgnoreCase("PART_TIME")
        ) {

            boolean incomeOkay =
                    loanRuleService
                        .meetsMinimumIncome(
                            loan.getMonthlyIncome(),
                            loanRuleService
                                .getPartTimeStudentMinimumIncome()
                        );

            boolean affordabilityOkay =
                    loanRuleService
                        .hasBasicAffordability(
                            loan.getMonthlyIncome(),
                            loan.getMonthlyExpenses()
                        );

            return incomeOkay
                    && affordabilityOkay;
        }


        return false;
    }


    /*
     * VEHICLE FINANCE
     */
    public boolean isEligible(
            VehicleLoan loan
    ) {

        boolean financesOkay =
                loanRuleService.hasBasicAffordability(
                    loan.getMonthlyIncome(),
                    loan.getMonthlyExpenses()
                );

        boolean licenceOkay =
                Boolean.TRUE.equals(
                    loan.getHasDriversLicence()
                );

        return financesOkay && licenceOkay;
    }


    /*
     * HOME LOAN
     */
    public boolean isEligible(
            HomeLoan loan
    ) {

        if (
            loan.getMonthlyIncome() == null ||
            loan.getMonthlyExpenses() == null
        ) {
            return false;
        }


        /*
         * For a joint application, include the
         * co-applicant's income in this basic
         * affordability pre-check.
         */
        java.math.BigDecimal totalIncome =
                loan.getMonthlyIncome();


        if (
            Boolean.TRUE.equals(
                loan.getJointApplication()
            ) &&
            loan.getCoApplicantIncome() != null
        ) {
            totalIncome =
                    totalIncome.add(
                        loan.getCoApplicantIncome()
                    );
        }


        return loanRuleService
                .hasBasicAffordability(
                    totalIncome,
                    loan.getMonthlyExpenses()
                );
    }


    /*
     * DEBT CONSOLIDATION
     */
    public boolean isEligible(
            DebtConsolidationLoan loan
    ) {

        boolean incomeOkay =
                loanRuleService.meetsMinimumIncome(
                    loan.getMonthlyIncome(),
                    loanRuleService
                        .getDebtMinimumIncome()
                );

        boolean affordabilityOkay =
                loanRuleService.hasBasicAffordability(
                    loan.getMonthlyIncome(),
                    loan.getMonthlyExpenses()
                );


        Integer numberOfDebts =
                loan.getNumberOfDebts();

        boolean debtsOkay =
                numberOfDebts != null
                &&
                numberOfDebts >=
                    loanRuleService
                        .getDebtMinimumNumberOfDebts()
                &&
                numberOfDebts <=
                    loanRuleService
                        .getDebtMaximumNumberOfDebts();


        return incomeOkay
                && affordabilityOkay
                && debtsOkay;
    }

}