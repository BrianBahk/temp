package com.readsphere.repository;

import com.readsphere.model.Review;
import com.readsphere.model.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByStatus(ReviewStatus status);
    List<Review> findByPublicationId(Long publicationId);
    List<Review> findByUserIdAndStatus(Long userId, ReviewStatus status);
}
