package com.sdb.backend.dto;

public class DecisionRequest {

    private String employeeEmail;
    private String reason;

    public DecisionRequest() {}

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(
            String employeeEmail
    ) {
        this.employeeEmail = employeeEmail;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(
            String reason
    ) {
        this.reason = reason;
    }
}