package com.readsphere.controller;

import com.readsphere.dto.PurchaseRequest;
import com.readsphere.model.UserSubscription;
import com.readsphere.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/user")
    public ResponseEntity<List<UserSubscription>> getUserSubscriptions(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(username));
    }

    @PostMapping("/purchase")
    public ResponseEntity<UserSubscription> purchaseSubscription(
            Authentication authentication,
            @RequestBody PurchaseRequest request) {
        String username = authentication.getName();
        return ResponseEntity.ok(subscriptionService.purchaseSubscription(username, request));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelSubscription(
            Authentication authentication,
            @PathVariable Long id) {
        String username = authentication.getName();
        subscriptionService.cancelSubscription(id, username);
        return ResponseEntity.ok().build();
    }
}
