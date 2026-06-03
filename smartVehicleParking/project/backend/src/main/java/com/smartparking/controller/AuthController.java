package com.smartparking.controller;

import com.smartparking.dto.AuthRequest;
import com.smartparking.dto.AuthResponse;
import com.smartparking.dto.RegisterRequest;
import com.smartparking.dto.UserDto;
import com.smartparking.entity.User;
import com.smartparking.security.JwtTokenProvider;
import com.smartparking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = userOpt.get();
        if (!userService.verifyPassword(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String token = tokenProvider.generateTokenFromEmail(user.getEmail(), user.getRole().toString());
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFullName(),
                    request.getPhone(),
                    User.UserRole.CUSTOMER
            );
            String token = tokenProvider.generateTokenFromEmail(user.getEmail(), user.getRole().toString());
            UserDto userDto = userService.convertToDto(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, userDto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/seed-admin")
    public ResponseEntity<?> seedAdmin() {
        Optional<User> existingAdmin = userService.findByEmail("admin@smartparking.com");
        if (existingAdmin.isPresent()) {
            return ResponseEntity.ok("Admin already exists");
        }

        try {
            userService.createUser(
                    "admin@smartparking.com",
                    "Admin@123",
                    "Admin",
                    "0000000000",
                    User.UserRole.ADMIN
            );
            return ResponseEntity.ok("Admin created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
