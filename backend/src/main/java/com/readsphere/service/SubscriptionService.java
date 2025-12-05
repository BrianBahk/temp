package com.readsphere.service;

import com.readsphere.dto.PurchaseRequest;
import com.readsphere.model.*;
import com.readsphere.repository.PublicationRepository;
import com.readsphere.repository.UserRepository;
import com.readsphere.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private UserService userService;

    public List<UserSubscription> getUserSubscriptions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return subscriptionRepository.findByUserId(user.getId());
    }

    @Transactional
    public UserSubscription purchaseSubscription(String username, PurchaseRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Publication publication = publicationRepository.findById(request.getPublicationId())
                .orElseThrow(() -> new RuntimeException("Publication not found"));

        // Calculate points and price
        double price = publication.getPrice();
        int pointsToUse = request.getPointsToUse() != null ? request.getPointsToUse() : 0;
        boolean paidWithPoints = false;

        if ("points".equals(request.getPaymentMethod()) || "mixed".equals(request.getPaymentMethod())) {
            if (user.getPoints() < pointsToUse) {
                throw new RuntimeException("Insufficient points");
            }
            userService.subtractPoints(username, pointsToUse);
            price -= (pointsToUse / 100.0); // 100 points = $1
            paidWithPoints = true;
        }

        // Calculate points to award (10% for magazines, 20% for newspapers)
        int pointsToAward = 0;
        if (!paidWithPoints || "mixed".equals(request.getPaymentMethod())) {
            double pointsRate = publication.getType() == PublicationType.MAGAZINE ? 0.10 : 0.20;
            pointsToAward = (int) (price * pointsRate * 100); // Convert to points
            userService.addPoints(username, pointsToAward);
        }

        // Create subscription
        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPublication(publication);
        subscription.setSubscriptionNumber(generateSubscriptionNumber());
        subscription.setOrderNumber(generateOrderNumber());
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusYears(1));
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setPrice(publication.getPrice());
        subscription.setIssuesPerYear(publication.getIssuesPerYear());
        subscription.setPointsAwarded(pointsToAward);
        subscription.setPaidWithPoints(paidWithPoints);

        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public void cancelSubscription(Long subscriptionId, String username) {
        UserSubscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!subscription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new RuntimeException("Subscription is not active");
        }

        // Calculate pro-rated refund
        long totalDays = ChronoUnit.DAYS.between(subscription.getStartDate(), subscription.getEndDate());
        long remainingDays = ChronoUnit.DAYS.between(LocalDate.now(), subscription.getEndDate());
        double refundAmount = (remainingDays / (double) totalDays) * subscription.getPrice();

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setCancelledDate(LocalDate.now());
        subscription.setRefundAmount(refundAmount);

        // Deduct points if any were awarded
        if (subscription.getPointsAwarded() > 0) {
            user.setPoints(Math.max(0, user.getPoints() - subscription.getPointsAwarded()));
            userRepository.save(user);
        }

        subscriptionRepository.save(subscription);
    }

    private String generateSubscriptionNumber() {
        String subNum;
        do {
            subNum = "SUB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (subscriptionRepository.existsBySubscriptionNumber(subNum));
        return subNum;
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
