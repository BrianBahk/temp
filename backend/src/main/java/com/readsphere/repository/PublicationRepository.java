package com.readsphere.repository;

import com.readsphere.model.Publication;
import com.readsphere.model.PublicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByType(PublicationType type);
    List<Publication> findByCategory(String category);
    List<Publication> findByFeaturedTrue();
    List<Publication> findByTitleContainingIgnoreCase(String title);
}
