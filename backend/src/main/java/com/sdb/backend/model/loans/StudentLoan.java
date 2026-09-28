package com.sdb.backend.model.loans;

import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "student_loans")
public class StudentLoan extends LoanApplication {

    private String studyType;

    private String institution;

    private String course;

    private Integer studyYear;

    private Integer courseDurationMonths;

    @Column(precision = 15, scale = 2)
    private BigDecimal studyCost;


    /*
     * Mainly used for part-time students,
     * where the student has their own income.
     */
    @Column(precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(precision = 15, scale = 2)
    private BigDecimal monthlyExpenses;


    /*
     * Mainly used for full-time students.
     */
    private String guarantorName;

    @Column(precision = 15, scale = 2)
    private BigDecimal guarantorIncome;

    @Column(precision = 15, scale = 2)
    private BigDecimal guarantorExpenses;


    public StudentLoan() {
        super();
    }


    public StudentLoan(
            User customer,
            BigDecimal requestedAmount
    ) {
        super(customer, requestedAmount);
    }


    public String getStudyType() {
        return studyType;
    }




    public String getInstitution() {
        return institution;
    }


    public void setInstitution(String institution) {
        this.institution = institution;
    }


    public String getCourse() {
        return course;
    }


    public void setCourse(String course) {
        this.course = course;
    }


    public Integer getStudyYear() {
        return studyYear;
    }


    public void setStudyYear(Integer studyYear) {
        this.studyYear = studyYear;
    }


    public Integer getCourseDurationMonths() {
        return courseDurationMonths;
    }


    public void setCourseDurationMonths(
            Integer courseDurationMonths
    ) {
        this.courseDurationMonths =
                courseDurationMonths;
    }


    public BigDecimal getStudyCost() {
        return studyCost;
    }


    public void setStudyCost(BigDecimal studyCost) {
        this.studyCost = studyCost;
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


    public String getGuarantorName() {
        return guarantorName;
    }


    public void setGuarantorName(
            String guarantorName
    ) {
        this.guarantorName = guarantorName;
    }


    public BigDecimal getGuarantorIncome() {
        return guarantorIncome;
    }


    public void setGuarantorIncome(
            BigDecimal guarantorIncome
    ) {
        this.guarantorIncome = guarantorIncome;
    }


    public BigDecimal getGuarantorExpenses() {
        return guarantorExpenses;
    }


    public void setGuarantorExpenses(
            BigDecimal guarantorExpenses
    ) {
        this.guarantorExpenses =
                guarantorExpenses;
    }

}