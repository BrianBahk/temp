package com.readsphere.service;

import com.readsphere.dto.*;
import com.readsphere.model.User;
import com.readsphere.model.UserRole;
import com.readsphere.repository.UserRepository;
import com.readsphere.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMiddleInitial(request.getMiddleInitial());
        user.setAddress(request.getAddress());
        user.setCardNumber(request.getCardNumber());
        user.setExpiryDate(request.getExpiryDate());
        user.setCvv(request.getCvv());
        user.setNameOnCard(request.getNameOnCard());
        user.setRole(request.isAdmin() ? UserRole.ADMIN : UserRole.USER);
        user.setPoints(0);

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, mapToUserResponse(user));
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setMiddleInitial(user.getMiddleInitial());
        response.setAddress(user.getAddress());
        response.setCardNumber(user.getCardNumber());
        response.setExpiryDate(user.getExpiryDate());
        response.setCvv(user.getCvv());
        response.setNameOnCard(user.getNameOnCard());
        response.setPoints(user.getPoints());
        response.setRole(user.getRole());
        return response;
    }
}
