package com.sdb.backend.service;

import com.sdb.backend.model.User;
import com.sdb.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    @Value("${app.admin-emails:}")
    private String adminEmails;


    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    /*
     * REGISTER USER
     */
    public User registerUser(User user) {

        if (
            userRepository.existsByEmail(
                user.getEmail()
            )
        ) {
            throw new RuntimeException(
                "An account with this email already exists"
            );
        }


        /*
         * Determine role from the configured
         * administrator email addresses.
         */
        if (isAdminEmail(user.getEmail())) {
            user.setRole("ADMIN");
        } else {
            user.setRole("CUSTOMER");
        }


        /*
         * Never store the original password.
         */
        String hashedPassword =
                passwordEncoder.encode(
                    user.getPassword()
                );

        user.setPassword(hashedPassword);


        return userRepository.save(user);
    }


    /*
     * LOGIN
     */
    public User login(
            String email,
            String password
    ) {

        User user =
                userRepository
                    .findByEmail(email)
                    .orElseThrow(
                        () -> new RuntimeException(
                            "Invalid email or password"
                        )
                    );


        boolean passwordMatches =
                passwordEncoder.matches(
                    password,
                    user.getPassword()
                );


        if (!passwordMatches) {
            throw new RuntimeException(
                "Invalid email or password"
            );
        }


        return user;
    }


    /*
     * CHECK WHETHER AN EMAIL BELONGS
     * TO AN ADMINISTRATOR.
     */
    public boolean isAdminEmail(
            String email
    ) {

        if (
            email == null ||
            adminEmails == null ||
            adminEmails.isBlank()
        ) {
            return false;
        }


        return Arrays
                .stream(adminEmails.split(","))
                .map(String::trim)
                .anyMatch(
                    adminEmail ->
                        adminEmail.equalsIgnoreCase(
                            email
                        )
                );
    }


    public User saveUser(User user) {
        return userRepository.save(user);
    }


    public Optional<User> findByEmail(
            String email
    ) {
        return userRepository.findByEmail(email);
    }


    public User findById(Long id) {

        return userRepository
                .findById(id)
                .orElseThrow(
                    () -> new RuntimeException(
                        "User not found"
                    )
                );
    }


    public boolean emailExists(
            String email
    ) {
        return userRepository.existsByEmail(email);
    }

}