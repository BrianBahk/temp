package com.readsphere.controller;

import com.readsphere.model.Review;
import com.readsphere.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/reviews/pending")
    public ResponseEntity<List<Review>> getPendingReviews() {
        return ResponseEntity.ok(reviewService.getPendingReviews());
    }

    @GetMapping("/reviews/approved")
    public ResponseEntity<List<Review>> getApprovedReviews() {
        return ResponseEntity.ok(reviewService.getApprovedReviews());
    }

    @GetMapping("/reviews/rejected")
    public ResponseEntity<List<Review>> getRejectedReviews() {
        return ResponseEntity.ok(reviewService.getRejectedReviews());
    }

    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.approveReview(id));
    }

    @PutMapping("/reviews/{id}/reject")
    public ResponseEntity<Review> rejectReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return ResponseEntity.ok(reviewService.rejectReview(id, reason));
    }
}
