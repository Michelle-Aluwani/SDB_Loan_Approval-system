package com.sdb.backend.dto;

public class ClaimRequest {

    private String employeeEmail;

    public ClaimRequest() {}

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(
            String employeeEmail
    ) {
        this.employeeEmail = employeeEmail;
    }
}