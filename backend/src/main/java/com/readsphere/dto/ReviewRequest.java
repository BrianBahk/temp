package com.readsphere.dto;

import java.time.LocalDate;

public class ReviewRequest {
    private Long subscriptionId;
    private String issueNumber;
    private LocalDate publicationDate;
    private String articleName;
    private String authorLastName;
    private String content;

    // Getters and Setters
    public Long getSubscriptionId() { return subscriptionId; }
    public void setSubscriptionId(Long subscriptionId) { this.subscriptionId = subscriptionId; }

    public String getIssueNumber() { return issueNumber; }
    public void setIssueNumber(String issueNumber) { this.issueNumber = issueNumber; }

    public LocalDate getPublicationDate() { return publicationDate; }
    public void setPublicationDate(LocalDate publicationDate) { this.publicationDate = publicationDate; }

    public String getArticleName() { return articleName; }
    public void setArticleName(String articleName) { this.articleName = articleName; }

    public String getAuthorLastName() { return authorLastName; }
    public void setAuthorLastName(String authorLastName) { this.authorLastName = authorLastName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
