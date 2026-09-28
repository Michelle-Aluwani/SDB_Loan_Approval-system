package com.sdb.backend.controller;

import com.sdb.backend.model.LoanApplication;
import com.sdb.backend.model.User;
import com.sdb.backend.model.loans.*;

import com.sdb.backend.service.LoanApplicationService;
import com.sdb.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:4200")

public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;
    private final UserService userService;


    public LoanApplicationController(
            LoanApplicationService loanApplicationService,
            UserService userService
    ) {
        this.loanApplicationService =
                loanApplicationService;

        this.userService =
                userService;
    }


    /*
     * GET ALL APPLICATIONS FOR A CUSTOMER
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LoanApplication>>
    getCustomerApplications(
            @PathVariable Long customerId
    ) {

        User customer =
                userService.findById(customerId);

        List<LoanApplication> applications =
                loanApplicationService
                    .getApplicationsForCustomer(
                        customer
                    );

        return ResponseEntity.ok(applications);
    }


    /*
     * GET ONE APPLICATION
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<LoanApplication>
    getApplication(
            @PathVariable Long applicationId
    ) {

        LoanApplication application =
                loanApplicationService
                    .getApplicationById(
                        applicationId
                    );

        return ResponseEntity.ok(application);
    }


    /*
     * PERSONAL LOAN
     */
    @PostMapping("/personal")
    public ResponseEntity<PersonalLoan>
    applyForPersonalLoan(
            @RequestBody PersonalLoan loan
    ) {

        PersonalLoan savedLoan =
                loanApplicationService
                    .applyLoan(loan);

        return ResponseEntity.ok(savedLoan);
    }


    /*
     * STUDENT LOAN
     */
    @PostMapping("/student")
    public ResponseEntity<StudentLoan>
    applyForStudentLoan(
            @RequestBody StudentLoan loan
    ) {

        StudentLoan savedLoan =
                loanApplicationService
                    .applyLoan(loan);

        return ResponseEntity.ok(savedLoan);
    }


    /*
     * VEHICLE FINANCE
     */
    @PostMapping("/vehicle")
    public ResponseEntity<VehicleLoan>
    applyForVehicleLoan(
            @RequestBody VehicleLoan loan
    ) {

        VehicleLoan savedLoan =
                loanApplicationService
                    .applyLoan(loan);

        return ResponseEntity.ok(savedLoan);
    }


    /*
     * HOME LOAN
     */
    @PostMapping("/home")
    public ResponseEntity<HomeLoan>
    applyForHomeLoan(
            @RequestBody HomeLoan loan
    ) {

        HomeLoan savedLoan =
                loanApplicationService
                    .applyLoan(loan);

        return ResponseEntity.ok(savedLoan);
    }


    /*
     * REVOLVING LOAN
     */
    @PostMapping("/revolving")
    public ResponseEntity<RevolvingLoan>
    applyForRevolvingLoan(
            @RequestBody RevolvingLoan loan
    ) {

        RevolvingLoan savedLoan =
                loanApplicationService
                    .applyLoan(loan);

        return ResponseEntity.ok(savedLoan);
    }


    /*
     * DEBT CONSOLIDATION
     */
    @PostMapping("/debt")
    public ResponseEntity<DebtConsolidationLoan>
    applyForDebtConsolidation(
            @RequestBody DebtConsolidationLoan loan
    ) {

        DebtConsolidationLoan savedLoan =
                loanApplicationService
                    .applyLoan(loan);

        return ResponseEntity.ok(savedLoan);
    }


    /*
     * CANCEL APPLICATION
     */
    @PutMapping(
        "/{applicationId}/cancel/customer/{customerId}"
    )
    public ResponseEntity<LoanApplication>
    cancelApplication(
            @PathVariable Long applicationId,
            @PathVariable Long customerId
    ) {

        User customer =
                userService.findById(customerId);

        LoanApplication cancelled =
                loanApplicationService
                    .cancelApplication(
                        applicationId,
                        customer
                    );

        return ResponseEntity.ok(cancelled);
    }
    

}