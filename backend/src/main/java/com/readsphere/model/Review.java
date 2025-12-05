package com.readsphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private UserSubscription subscription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publication_id", nullable = false)
    private Publication publication;

    @Column(nullable = false)
    private String issueNumber;

    @Column(nullable = false)
    private LocalDate publicationDate;

    @Column(nullable = false)
    private String articleName;

    @Column(nullable = false)
    private String authorLastName;

    @Column(length = 5000, nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer wordCount;

    @Column(nullable = false)
    private Integer sentenceCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewStatus status = ReviewStatus.PENDING;

    private Integer pointsAwarded = 0;

    @Column(nullable = false)
    private LocalDate submittedDate;

    @Column(length = 1000)
    private String rejectionReason;

    // Constructors
    public Review() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public UserSubscription getSubscription() { return subscription; }
    public void setSubscription(UserSubscription subscription) { this.subscription = subscription; }

    public Publication getPublication() { return publication; }
    public void setPublication(Publication publication) { this.publication = publication; }

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

    public Integer getWordCount() { return wordCount; }
    public void setWordCount(Integer wordCount) { this.wordCount = wordCount; }

    public Integer getSentenceCount() { return sentenceCount; }
    public void setSentenceCount(Integer sentenceCount) { this.sentenceCount = sentenceCount; }

    public ReviewStatus getStatus() { return status; }
    public void setStatus(ReviewStatus status) { this.status = status; }

    public Integer getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(Integer pointsAwarded) { this.pointsAwarded = pointsAwarded; }

    public LocalDate getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(LocalDate submittedDate) { this.submittedDate = submittedDate; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
