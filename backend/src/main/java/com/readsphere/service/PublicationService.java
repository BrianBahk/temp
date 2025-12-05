package com.readsphere.service;

import com.readsphere.model.Publication;
import com.readsphere.model.PublicationType;
import com.readsphere.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublicationService {

    @Autowired
    private PublicationRepository publicationRepository;

    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }

    public Publication getPublicationById(Long id) {
        return publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
    }

    public List<Publication> getPublicationsByType(String type) {
        PublicationType publicationType = PublicationType.valueOf(type.toUpperCase());
        return publicationRepository.findByType(publicationType);
    }

    public List<Publication> getFeaturedPublications() {
        return publicationRepository.findByFeaturedTrue();
    }

    public List<Publication> searchPublications(String query) {
        return publicationRepository.findByTitleContainingIgnoreCase(query);
    }
}
