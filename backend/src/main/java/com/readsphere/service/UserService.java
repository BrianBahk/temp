package com.readsphere.service;

import com.readsphere.dto.UserResponse;
import com.readsphere.model.User;
import com.readsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String username, UserResponse request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMiddleInitial(request.getMiddleInitial());
        user.setAddress(request.getAddress());
        user.setCardNumber(request.getCardNumber());
        user.setExpiryDate(request.getExpiryDate());
        user.setCvv(request.getCvv());
        user.setNameOnCard(request.getNameOnCard());

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public void addPoints(String username, Integer points) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
    }

    @Transactional
    public void subtractPoints(String username, Integer points) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getPoints() < points) {
            throw new RuntimeException("Insufficient points");
        }
        user.setPoints(user.getPoints() - points);
        userRepository.save(user);
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
