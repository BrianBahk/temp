package com.readsphere.repository;

import com.readsphere.model.UserSubscription;
import com.readsphere.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    List<UserSubscription> findByUserId(Long userId);
    List<UserSubscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
    Optional<UserSubscription> findBySubscriptionNumber(String subscriptionNumber);
    boolean existsBySubscriptionNumber(String subscriptionNumber);
}
