package com.sdb.backend.controller;

import com.sdb.backend.dto.AuthResponse;
import com.sdb.backend.dto.LoginRequest;
import com.sdb.backend.dto.RegisterRequest;
import com.sdb.backend.dto.UserProfileResponse;

import com.sdb.backend.model.User;
import com.sdb.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:4200"
})
public class AuthController {

    private final UserService userService;


    public AuthController(
            UserService userService
    ) {
        this.userService = userService;
    }


    /*
     * REGISTER
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {

        User user = new User();

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                request.getPassword()
        );

        user.setIdNumber(
                request.getIdNumber()
        );

        user.setPhoneNumber(
                request.getPhoneNumber()
        );

        user.setResidentialAddress(
                request.getResidentialAddress()
        );


        User savedUser =
                userService.registerUser(user);


        AuthResponse response =
                createAuthResponse(savedUser);


        return ResponseEntity.ok(response);
    }


    /*
     * LOGIN
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {

        User user =
                userService.login(
                    request.getEmail(),
                    request.getPassword()
                );


        AuthResponse response =
                createAuthResponse(user);


        return ResponseEntity.ok(response);
    }


    /*
     * GET USER PROFILE
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable Long userId
    ) {

        User user =
                userService.findById(userId);

        UserProfileResponse response =
                createUserProfileResponse(user);

        return ResponseEntity.ok(response);
    }


    /*
     * Convert User entity into a safe
     * authentication response.
     */
    private AuthResponse createAuthResponse(
            User user
    ) {

        return new AuthResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole()
        );
    }


    /*
     * Convert User entity into a safe
     * profile response.
     *
     * Password is deliberately excluded.
     */
    private UserProfileResponse createUserProfileResponse(
            User user
    ) {

        return new UserProfileResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getIdNumber(),
            user.getPhoneNumber(),
            user.getResidentialAddress(),
            user.getRole()
        );
    }
}