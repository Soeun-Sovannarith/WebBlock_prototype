package com.webblock.controller;

import com.webblock.dto.AuthDto;
import com.webblock.model.PlatformUser;
import com.webblock.repository.PlatformUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final PlatformUserRepository platformUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest req) {
        PlatformUser user = platformUserRepository.findByEmail(req.getEmail())
                .orElseGet(() -> platformUserRepository.save(PlatformUser.builder()
                        .email(req.getEmail())
                        .passwordHash("password_hash")
                        .build()));

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token("jwt_token_" + user.getId())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest req) {
        if (platformUserRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        PlatformUser user = platformUserRepository.save(PlatformUser.builder()
                .email(req.getEmail())
                .passwordHash("password_hash_" + req.getPassword())
                .build());

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token("jwt_token_" + user.getId())
                .build());
    }

    @GetMapping("/demo-user")
    public ResponseEntity<?> getOrCreateDemoUser() {
        PlatformUser user = platformUserRepository.findByEmail("creator@webblock.io")
                .orElseGet(() -> platformUserRepository.save(PlatformUser.builder()
                        .email("creator@webblock.io")
                        .passwordHash("hashed_demo_secret")
                        .build()));

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token("jwt_demo_token")
                .build());
    }
}
