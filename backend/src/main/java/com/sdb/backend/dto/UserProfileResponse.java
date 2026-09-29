package com.sdb.backend.dto;

public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String idNumber;
    private String phoneNumber;
    private String residentialAddress;
    private String role;

    public UserProfileResponse(
            Long id,
            String fullName,
            String email,
            String idNumber,
            String phoneNumber,
            String residentialAddress,
            String role
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.idNumber = idNumber;
        this.phoneNumber = phoneNumber;
        this.residentialAddress = residentialAddress;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public String getRole() {
        return role;
    }
}