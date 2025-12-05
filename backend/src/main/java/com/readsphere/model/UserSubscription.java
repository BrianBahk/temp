package com.readsphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String subscriptionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publication_id", nullable = false)
    private Publication publication;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(nullable = false)
    private String orderNumber;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer issuesPerYear;

    private Integer pointsAwarded = 0;

    private Boolean paidWithPoints = false;

    private Double refundAmount;

    private LocalDate cancelledDate;

    // Constructors
    public UserSubscription() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubscriptionNumber() { return subscriptionNumber; }
    public void setSubscriptionNumber(String subscriptionNumber) { this.subscriptionNumber = subscriptionNumber; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Publication getPublication() { return publication; }
    public void setPublication(Publication publication) { this.publication = publication; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public SubscriptionStatus getStatus() { return status; }
    public void setStatus(SubscriptionStatus status) { this.status = status; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getIssuesPerYear() { return issuesPerYear; }
    public void setIssuesPerYear(Integer issuesPerYear) { this.issuesPerYear = issuesPerYear; }

    public Integer getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(Integer pointsAwarded) { this.pointsAwarded = pointsAwarded; }

    public Boolean getPaidWithPoints() { return paidWithPoints; }
    public void setPaidWithPoints(Boolean paidWithPoints) { this.paidWithPoints = paidWithPoints; }

    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }

    public LocalDate getCancelledDate() { return cancelledDate; }
    public void setCancelledDate(LocalDate cancelledDate) { this.cancelledDate = cancelledDate; }
}
