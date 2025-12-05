package com.readsphere.controller;

import com.readsphere.dto.UserResponse;
import com.readsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @RequestBody UserResponse request) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(username, request));
    }

    @PostMapping("/points/add")
    public ResponseEntity<Void> addPoints(
            Authentication authentication,
            @RequestParam Integer points) {
        String username = authentication.getName();
        userService.addPoints(username, points);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/points/subtract")
    public ResponseEntity<Void> subtractPoints(
            Authentication authentication,
            @RequestParam Integer points) {
        String username = authentication.getName();
        userService.subtractPoints(username, points);
        return ResponseEntity.ok().build();
    }
}
