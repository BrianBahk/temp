package com.readsphere.controller;

import com.readsphere.dto.ReviewRequest;
import com.readsphere.model.Review;
import com.readsphere.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/user")
    public ResponseEntity<List<Review>> getUserReviews(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(reviewService.getUserReviews(username));
    }

    @PostMapping
    public ResponseEntity<Review> submitReview(
            Authentication authentication,
            @RequestBody ReviewRequest request) {
        String username = authentication.getName();
        return ResponseEntity.ok(reviewService.submitReview(username, request));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Review>> getPendingReviews() {
        return ResponseEntity.ok(reviewService.getPendingReviews());
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Review>> getApprovedReviews() {
        return ResponseEntity.ok(reviewService.getApprovedReviews());
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<Review>> getRejectedReviews() {
        return ResponseEntity.ok(reviewService.getRejectedReviews());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.approveReview(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Review> rejectReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return ResponseEntity.ok(reviewService.rejectReview(id, reason));
    }
}
