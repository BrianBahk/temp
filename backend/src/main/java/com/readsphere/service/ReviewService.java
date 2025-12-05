package com.readsphere.service;

import com.readsphere.dto.ReviewRequest;
import com.readsphere.model.*;
import com.readsphere.repository.ReviewRepository;
import com.readsphere.repository.UserRepository;
import com.readsphere.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @Autowired
    private UserService userService;

    public List<Review> getUserReviews(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUserId(user.getId());
    }

    public List<Review> getPendingReviews() {
        return reviewRepository.findByStatus(ReviewStatus.PENDING);
    }

    public List<Review> getApprovedReviews() {
        return reviewRepository.findByStatus(ReviewStatus.APPROVED);
    }

    public List<Review> getRejectedReviews() {
        return reviewRepository.findByStatus(ReviewStatus.REJECTED);
    }

    @Transactional
    public Review submitReview(String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSubscription subscription = subscriptionRepository.findById(request.getSubscriptionId())
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (!subscription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Validate publication date is within 30 days
        long daysSincePublication = ChronoUnit.DAYS.between(request.getPublicationDate(), LocalDate.now());
        if (daysSincePublication > 30) {
            throw new RuntimeException("Review must be submitted within 30 days of publication");
        }

        // Count words and sentences
        String content = request.getContent();
        int wordCount = content.trim().split("\\s+").length;
        int sentenceCount = content.split("[.!?]+").length;

        if (wordCount < 50) {
            throw new RuntimeException("Review must contain at least 50 words");
        }

        if (sentenceCount < 5) {
            throw new RuntimeException("Review must contain at least 5 sentences");
        }

        Review review = new Review();
        review.setUser(user);
        review.setSubscription(subscription);
        review.setPublication(subscription.getPublication());
        review.setIssueNumber(request.getIssueNumber());
        review.setPublicationDate(request.getPublicationDate());
        review.setArticleName(request.getArticleName());
        review.setAuthorLastName(request.getAuthorLastName());
        review.setContent(content);
        review.setWordCount(wordCount);
        review.setSentenceCount(sentenceCount);
        review.setStatus(ReviewStatus.PENDING);
        review.setSubmittedDate(LocalDate.now());

        return reviewRepository.save(review);
    }

    @Transactional
    public Review approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (review.getStatus() != ReviewStatus.PENDING) {
            throw new RuntimeException("Review is not pending");
        }

        review.setStatus(ReviewStatus.APPROVED);
        
        // Award 200 points for approved review
        review.setPointsAwarded(200);
        userService.addPoints(review.getUser().getUsername(), 200);

        return reviewRepository.save(review);
    }

    @Transactional
    public Review rejectReview(Long reviewId, String reason) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (review.getStatus() != ReviewStatus.PENDING) {
            throw new RuntimeException("Review is not pending");
        }

        review.setStatus(ReviewStatus.REJECTED);
        review.setRejectionReason(reason);

        return reviewRepository.save(review);
    }
}
