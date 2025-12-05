package com.readsphere.dto;

public class PurchaseRequest {
    private Long publicationId;
    private String paymentMethod; // "card", "points", or "mixed"
    private Integer pointsToUse;

    // Getters and Setters
    public Long getPublicationId() { return publicationId; }
    public void setPublicationId(Long publicationId) { this.publicationId = publicationId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Integer getPointsToUse() { return pointsToUse; }
    public void setPointsToUse(Integer pointsToUse) { this.pointsToUse = pointsToUse; }
}
