package com.sdb.backend.controller;

import com.sdb.backend.dto.ClaimRequest;
import com.sdb.backend.dto.DecisionRequest;

import com.sdb.backend.model.LoanApplication;

import com.sdb.backend.service.LoanApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://YOUR-DEPLOYED-FRONTEND-URL.com"
})
public class AdminController {

    private final LoanApplicationService
            loanApplicationService;


    public AdminController(
            LoanApplicationService
                    loanApplicationService
    ) {
        this.loanApplicationService =
                loanApplicationService;
    }


    /*
     * AVAILABLE APPLICATIONS
     */
    @GetMapping("/applications/available")
    public ResponseEntity<List<LoanApplication>>
    getAvailableApplications() {

        return ResponseEntity.ok(
            loanApplicationService
                .getAvailableApplications()
        );
    }


    /*
     * CLAIM APPLICATION
     */
    @PutMapping(
        "/applications/{applicationId}/claim"
    )
    public ResponseEntity<LoanApplication>
    claimApplication(
            @PathVariable Long applicationId,
            @RequestBody ClaimRequest request
    ) {

        return ResponseEntity.ok(
            loanApplicationService
                .claimApplication(
                    applicationId,
                    request.getEmployeeEmail()
                )
        );
    }


    /*
     * APPROVE APPLICATION
     */
    @PutMapping(
        "/applications/{applicationId}/approve"
    )
    public ResponseEntity<LoanApplication>
    approveApplication(
            @PathVariable Long applicationId,
            @RequestBody DecisionRequest request
    ) {

        return ResponseEntity.ok(
            loanApplicationService
                .approveApplication(
                    applicationId,
                    request.getEmployeeEmail()
                )
        );
    }


    /*
     * REJECT APPLICATION
     */
    @PutMapping(
        "/applications/{applicationId}/reject"
    )
    public ResponseEntity<LoanApplication>
    rejectApplication(
            @PathVariable Long applicationId,
            @RequestBody DecisionRequest request
    ) {

        return ResponseEntity.ok(
            loanApplicationService
                .rejectApplication(
                    applicationId,
                    request.getEmployeeEmail(),
                    request.getReason()
                )
        );
    }


    /*
     * APPLICATIONS HANDLED BY EMPLOYEE
     */
    @GetMapping("/applications/reviewed-by")
    public ResponseEntity<List<LoanApplication>>
    getReviewedApplications(
            @RequestParam String employeeEmail
    ) {

        return ResponseEntity.ok(
            loanApplicationService
                .getApplicationsReviewedBy(
                    employeeEmail
                )
        );
    }

}